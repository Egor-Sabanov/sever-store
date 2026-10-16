import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, isAdminSessionValid } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  const cookieStore = await cookies();
  if (!isAdminSessionValid(cookieStore.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Нужен вход в панель." }, { status: 401 });
  }

  try {
    const prisma = getPrisma();
    const [products, orders] = await Promise.all([
      prisma.product.findMany({
        orderBy: [{ category: "asc" }, { name: "asc" }],
        select: {
          id: true,
          name: true,
          slug: true,
          category: true,
          price: true,
          stock: true,
          active: true,
          featured: true,
          image: true,
        },
      }),
      prisma.order.findMany({
        take: 100,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
    ]);

    return NextResponse.json({ products, orders });
  } catch (error) {
    console.error("Admin data could not be loaded:", error);
    return NextResponse.json(
      { error: "Не получилось загрузить данные. Проверь подключение базы." },
      { status: 503 },
    );
  }
}
