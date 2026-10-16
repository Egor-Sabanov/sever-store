import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE, isAdminSessionValid, isTrustedOrigin } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";

const productSchema = z.object({ stock: z.number().int().min(0).max(100_000) });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "Запрос не принят." }, { status: 403 });
  }

  const cookieStore = await cookies();
  if (!isAdminSessionValid(cookieStore.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Нужен вход в панель." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Не удалось прочитать данные." }, { status: 400 });
  }

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Проверь остаток." }, { status: 400 });
  }

  try {
    const { id } = await params;
    const product = await getPrisma().product.update({
      where: { id },
      data: { stock: parsed.data.stock },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        active: true,
        featured: true,
      },
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Товар не найден или база недоступна." }, { status: 404 });
  }
}
