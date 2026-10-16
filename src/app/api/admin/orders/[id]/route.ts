import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE, isAdminSessionValid, isTrustedOrigin } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";

const statusSchema = z.object({
  status: z.enum(["NEW", "CONFIRMED", "PACKING", "SHIPPED", "COMPLETED", "CANCELLED"]),
});

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

  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Выбери корректный статус." }, { status: 400 });
  }

  try {
    const { id } = await params;
    const order = await getPrisma().order.update({
      where: { id },
      data: { status: parsed.data.status },
      select: { id: true, status: true },
    });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Заказ не найден или база недоступна." }, { status: 404 });
  }
}
