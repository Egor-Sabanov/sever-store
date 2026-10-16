"use client";

import { ArrowUpRight, Boxes, LogOut, PackageCheck, RefreshCw, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { type FormEvent, useEffect, useState } from "react";
import { formatPrice } from "@/lib/products";
import styles from "./admin.module.css";

const orderStatuses = {
  NEW: "Новый",
  CONFIRMED: "Подтверждён",
  PACKING: "Собирается",
  SHIPPED: "Передан в доставку",
  COMPLETED: "Завершён",
  CANCELLED: "Отменён",
} as const;

type OrderStatus = keyof typeof orderStatuses;
type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  stock: number;
  active: boolean;
  featured: boolean;
  image: string;
};
type AdminOrderItem = {
  id: string;
  productName: string;
  productSlug: string;
  size: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};
type AdminOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  city: string;
  address: string;
  deliveryMethod: "COURIER" | "PICKUP";
  comment: string | null;
  subtotal: number;
  deliveryPrice: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  items: AdminOrderItem[];
};
type AdminData = { products: AdminProduct[]; orders: AdminOrder[] };

async function fetchAdminData(): Promise<AdminData> {
  const response = await fetch("/api/admin/data", { cache: "no-store" });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Не получилось загрузить панель.");
  return result as AdminData;
}

export function AdminPanel() {
  const [data, setData] = useState<AdminData | null>(null);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [loginPending, setLoginPending] = useState(false);
  const [message, setMessage] = useState("");

  async function refresh() {
    setMessage("");
    try {
      setData(await fetchAdminData());
    } catch (error) {
      const text = error instanceof Error ? error.message : "Не получилось загрузить панель.";
      if (text === "Нужен вход в панель.") setData(null);
      else setMessage(text);
    } finally {
      setChecking(false);
    }
  }

  useEffect(() => {
    let current = true;
    void fetchAdminData()
      .then((result) => {
        if (current) setData(result);
      })
      .catch((error: unknown) => {
        if (!current) return;
        const text = error instanceof Error ? error.message : "Не получилось загрузить панель.";
        if (text !== "Нужен вход в панель.") setMessage(text);
      })
      .finally(() => {
        if (current) setChecking(false);
      });
    return () => {
      current = false;
    };
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginPending(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Не получилось войти.");
      setPassword("");
      setData(await fetchAdminData());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не получилось войти.");
    } finally {
      setLoginPending(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setData(null);
    setMessage("");
  }

  async function saveProduct(id: string, changes: Pick<AdminProduct, "stock">) {
    const response = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Не получилось сохранить товар.");
    setData((current) =>
      current
        ? {
            ...current,
            products: current.products.map((product) =>
              product.id === id ? { ...product, ...result } : product,
            ),
          }
        : current,
    );
  }

  async function saveOrderStatus(id: string, status: OrderStatus) {
    const response = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Не получилось обновить заказ.");
    setData((current) =>
      current
        ? {
            ...current,
            orders: current.orders.map((order) =>
              order.id === id ? { ...order, status: result.status } : order,
            ),
          }
        : current,
    );
  }

  if (checking) {
    return (
      <main className={styles.admin}>
        <p className={styles.admin__loading}>Открываем панель…</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className={styles.admin}>
        <section className={styles.adminLogin}>
          <a className={styles.adminLogin__brand} href="/">
            СЕВЕР<span>®</span>
          </a>
          <p className={styles.adminLogin__eyebrow}>Пространство команды</p>
          <h1>Вход в управление</h1>
          <p className={styles.adminLogin__description}>
            Здесь собраны заказы, каталог и остатки магазина.
          </p>
          <form className={styles.adminLogin__form} onSubmit={handleLogin}>
            <label htmlFor="admin-password">Пароль администратора</label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              maxLength={256}
            />
            {message && (
              <p className={styles.admin__error} role="alert">
                {message}
              </p>
            )}
            <button type="submit" disabled={loginPending}>
              {loginPending ? "Проверяем…" : "Войти"}
              <ArrowUpRight size={18} />
            </button>
          </form>
        </section>
      </main>
    );
  }

  const openOrders = data.orders.filter(
    (order) => !["COMPLETED", "CANCELLED"].includes(order.status),
  );
  const lowStock = data.products.filter((product) => product.stock <= 3 && product.active).length;

  return (
    <main className={styles.admin}>
      <header className={styles.admin__header}>
        <div>
          <a className={styles.admin__brand} href="/">
            СЕВЕР<span>®</span>
          </a>
          <span className={styles.admin__headerDivider} />
          <span className={styles.admin__headerLabel}>Управление</span>
        </div>
        <div className={styles.admin__actions}>
          <button type="button" className={styles.admin__refresh} onClick={() => void refresh()}>
            <RefreshCw size={16} />
            Обновить
          </button>
          <button
            type="button"
            className={styles.admin__logout}
            onClick={() => void handleLogout()}
          >
            <LogOut size={16} />
            Выйти
          </button>
        </div>
      </header>

      <div className={styles.admin__intro}>
        <div>
          <p className={styles.admin__eyebrow}>Рабочее пространство</p>
          <h1>Всё под рукой.</h1>
        </div>
        <p>Последние 100 заказов и актуальный каталог магазина.</p>
      </div>

      {message && (
        <p className={styles.admin__error} role="alert">
          {message}
        </p>
      )}

      <section className={styles.admin__stats} aria-label="Сводка">
        <article className={styles.adminStat}>
          <span className={styles.adminStat__icon} data-tone="lime">
            <ShoppingBag size={19} />
          </span>
          <span className={styles.adminStat__label}>Заказы в работе</span>
          <strong>{openOrders.length}</strong>
        </article>
        <article className={styles.adminStat}>
          <span className={styles.adminStat__icon} data-tone="lilac">
            <Boxes size={19} />
          </span>
          <span className={styles.adminStat__label}>Товаров в каталоге</span>
          <strong>{data.products.length}</strong>
        </article>
        <article className={styles.adminStat}>
          <span className={styles.adminStat__icon} data-tone="coral">
            <PackageCheck size={19} />
          </span>
          <span className={styles.adminStat__label}>Мало на складе</span>
          <strong>{lowStock}</strong>
        </article>
      </section>

      <section className={styles.adminSection}>
        <div className={styles.adminSection__head}>
          <div>
            <p className={styles.admin__eyebrow}>Каталог</p>
            <h2>Товары и остатки</h2>
          </div>
          <span>{data.products.length} позиций</span>
        </div>
        <div className={styles.adminProducts}>
          {data.products.map((product) => (
            <ProductRow key={product.id} product={product} onSave={saveProduct} />
          ))}
        </div>
      </section>

      <section className={styles.adminSection}>
        <div className={styles.adminSection__head}>
          <div>
            <p className={styles.admin__eyebrow}>Продажи</p>
            <h2>Последние заказы</h2>
          </div>
          <span>{data.orders.length} заказов</span>
        </div>
        <div className={styles.adminOrders}>
          {data.orders.length ? (
            data.orders.map((order) => (
              <OrderCard key={order.id} order={order} onSave={saveOrderStatus} />
            ))
          ) : (
            <p className={styles.adminOrders__empty}>Заказов пока нет.</p>
          )}
        </div>
      </section>
    </main>
  );
}

function ProductRow({
  product,
  onSave,
}: {
  product: AdminProduct;
  onSave: (id: string, changes: Pick<AdminProduct, "stock">) => Promise<void>;
}) {
  const [stock, setStock] = useState(String(product.stock));
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setSaved(false);
    setError("");
    try {
      await onSave(product.id, { stock: Number(stock) });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1800);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Не получилось сохранить.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className={styles.adminProduct} onSubmit={handleSave}>
      <div className={styles.adminProduct__identity}>
        <Image src={product.image} alt="" width={64} height={76} />
        <span>
          <strong>{product.name}</strong>
          <small>
            {product.category} · {formatPrice(product.price)} ·{" "}
            {product.active ? "В продаже" : "Скрыт"}
          </small>
        </span>
      </div>
      <label className={styles.adminProduct__field}>
        Остаток, шт.
        <input
          type="number"
          min="0"
          max="100000"
          step="1"
          value={stock}
          onChange={(event) => setStock(event.target.value)}
          required
        />
      </label>
      <div className={styles.adminProduct__save}>
        {error && <span role="alert">{error}</span>}
        <button type="submit" disabled={pending}>
          {pending ? "Сохраняем…" : saved ? "Готово" : "Сохранить остаток"}
        </button>
      </div>
    </form>
  );
}
function OrderCard({
  order,
  onSave,
}: {
  order: AdminOrder;
  onSave: (id: string, status: OrderStatus) => Promise<void>;
}) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function updateStatus() {
    setPending(true);
    setMessage("");
    try {
      await onSave(order.id, status);
      setMessage("Сохранено");
      window.setTimeout(() => setMessage(""), 1800);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не получилось сохранить.");
    } finally {
      setPending(false);
    }
  }

  return (
    <article className={styles.adminOrder}>
      <div className={styles.adminOrder__head}>
        <div>
          <strong>{order.orderNumber}</strong>
          <time dateTime={order.createdAt}>
            {new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(
              new Date(order.createdAt),
            )}
          </time>
        </div>
        <strong className={styles.adminOrder__total}>{formatPrice(order.total)}</strong>
      </div>
      <div className={styles.adminOrder__body}>
        <div className={styles.adminOrder__customer}>
          <strong>{order.customerName}</strong>
          <a href={`tel:${order.customerPhone}`}>{order.customerPhone}</a>
          {order.customerEmail && (
            <a href={`mailto:${order.customerEmail}`}>{order.customerEmail}</a>
          )}
          <span>
            {order.city}, {order.address}
          </span>
          <span>{order.deliveryMethod === "COURIER" ? "Курьер" : "Пункт выдачи"}</span>
          {order.comment && <i>Комментарий: {order.comment}</i>}
        </div>
        <ul className={styles.adminOrder__items}>
          {order.items.map((item) => (
            <li key={item.id}>
              <span>
                {item.productName} · {item.size} × {item.quantity}
              </span>
              <strong>{formatPrice(item.lineTotal)}</strong>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.adminOrder__controls}>
        <label>
          Статус
          <select value={status} onChange={(event) => setStatus(event.target.value as OrderStatus)}>
            {Object.entries(orderStatuses).map(([key, label]) => (
              <option value={key} key={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => void updateStatus()}
          disabled={pending || status === order.status}
        >
          {pending ? "Сохраняем…" : "Обновить статус"}
        </button>
        {message && <span role="status">{message}</span>}
      </div>
    </article>
  );
}
