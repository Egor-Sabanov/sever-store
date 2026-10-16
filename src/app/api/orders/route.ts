import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";

const checkoutSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s()-]{10,20}$/),
  email: z.string().trim().max(160).email().or(z.literal("")),
  city: z.string().trim().min(2).max(80),
  address: z.string().trim().min(5).max(180),
  delivery: z.enum(["courier", "pickup"]),
  comment: z.string().trim().max(500),
  consent: z.literal(true),
  items: z
    .array(
      z.object({
        slug: z.string().min(1).max(100),
        size: z.string().min(1).max(20),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1)
    .max(20),
});

class OrderIssue extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const requestHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (origin && requestHost && new URL(origin).host !== requestHost) {
    return NextResponse.json(
      { error: "Запрос не принят. Обнови страницу и попробуй снова." },
      { status: 403 },
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Не удалось прочитать данные формы." }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Проверь имя, телефон, адрес и согласие на обработку данных." },
      { status: 400 },
    );
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Сейчас не удалось принять заказ. Попробуй ещё раз чуть позже." },
      { status: 503 },
    );
  }

  try {
    const input = parsed.data;
    const prisma = getPrisma();
    const uniqueSlugs = [...new Set(input.items.map((item) => item.slug))];
    const products = await prisma.product.findMany({
      where: { slug: { in: uniqueSlugs }, active: true },
    });
    const productBySlug = new Map(products.map((product) => [product.slug, product]));

    for (const item of input.items) {
      const product = productBySlug.get(item.slug);
      if (!product) throw new OrderIssue(400, "Одна из выбранных вещей уже недоступна.");
      if (!product.sizes.includes(item.size))
        throw new OrderIssue(400, "Проверь размер в корзине.");
    }

    const quantityBySlug = new Map<string, number>();
    for (const item of input.items) {
      quantityBySlug.set(item.slug, (quantityBySlug.get(item.slug) ?? 0) + item.quantity);
    }

    const orderNumber = `SV-${randomBytes(4).toString("hex").toUpperCase()}`;
    const order = await prisma.$transaction(async (transaction) => {
      for (const [slug, quantity] of quantityBySlug) {
        const product = productBySlug.get(slug);
        if (!product || product.stock < quantity) {
          throw new OrderIssue(409, "Одной из вещей уже нет в нужном количестве. Обнови корзину.");
        }
        const changed = await transaction.product.updateMany({
          where: { id: product.id, active: true, stock: { gte: quantity } },
          data: { stock: { decrement: quantity } },
        });
        if (changed.count !== 1) {
          throw new OrderIssue(
            409,
            "Остаток только что изменился. Проверь корзину и попробуй снова.",
          );
        }
      }

      const subtotal = input.items.reduce((sum, item) => {
        const product = productBySlug.get(item.slug);
        if (!product) throw new OrderIssue(400, "Одна из выбранных вещей уже недоступна.");
        return sum + product.price * item.quantity;
      }, 0);
      const deliveryPrice = subtotal >= 12000 ? 0 : input.delivery === "pickup" ? 290 : 390;

      return transaction.order.create({
        data: {
          orderNumber,
          customerName: input.name,
          customerPhone: input.phone,
          customerEmail: input.email || null,
          city: input.city,
          address: input.address,
          deliveryMethod: input.delivery === "pickup" ? "PICKUP" : "COURIER",
          comment: input.comment || null,
          subtotal,
          deliveryPrice,
          total: subtotal + deliveryPrice,
          consentAt: new Date(),
          items: {
            create: input.items.map((item) => {
              const product = productBySlug.get(item.slug);
              if (!product) throw new OrderIssue(400, "Одна из выбранных вещей уже недоступна.");
              return {
                productId: product.id,
                productName: product.name,
                productSlug: product.slug,
                size: item.size,
                quantity: item.quantity,
                unitPrice: product.price,
                lineTotal: product.price * item.quantity,
              };
            }),
          },
        },
      });
    });

    return NextResponse.json({ orderNumber: order.orderNumber }, { status: 201 });
  } catch (error) {
    if (error instanceof OrderIssue) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: "Сейчас не удалось принять заказ. Попробуй ещё раз чуть позже." },
      { status: 503 },
    );
  }
}
