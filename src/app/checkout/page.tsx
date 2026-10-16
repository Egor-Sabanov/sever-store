"use client";

import { ArrowLeft, ArrowRight, Check, LoaderCircle, PackageCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { formatPrice, getProduct } from "@/lib/products";
import styles from "./checkout.module.css";

export default function CheckoutPage() {
  const { lines, total, ready, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [delivery, setDelivery] = useState<"courier" | "pickup">("courier");
  const entries = lines
    .map((line) => ({ line, product: getProduct(line.slug) }))
    .filter((entry) => entry.product);
  const shipping = total >= 12000 || total === 0 ? 0 : delivery === "pickup" ? 290 : 390;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      city: String(form.get("city") ?? ""),
      address: String(form.get("address") ?? ""),
      delivery: String(form.get("delivery") ?? ""),
      comment: String(form.get("comment") ?? ""),
      consent: form.get("consent") === "on",
      items: lines.map((line) => ({ slug: line.slug, size: line.size, quantity: line.quantity })),
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Не получилось принять заказ. Попробуй ещё раз.");
        return;
      }
      setOrderNumber(result.orderNumber);
      clear();
    } catch {
      setError("Не получилось связаться с сервером. Проверь соединение и попробуй снова.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!ready)
    return (
      <main className={styles.checkout}>
        <p className={styles.checkout__loading}>Готовим оформление…</p>
      </main>
    );

  if (orderNumber) {
    return (
      <main className={styles.checkout}>
        <section className={styles.checkout__success}>
          <span className={styles.checkout__successIcon}>
            <Check size={30} />
          </span>
          <p className={styles.checkout__eyebrow}>Заказ принят</p>
          <h1>
            Спасибо.
            <br />
            <em>Дальше мы.</em>
          </h1>
          <p className={styles.checkout__successText}>
            Заказ <strong>{orderNumber}</strong> уже у нас. Мы свяжемся, уточним детали доставки и
            подскажем, когда ждать курьера.
          </p>
          <div className={styles.checkout__successNote}>
            <PackageCheck size={19} />
            <span>Оплатишь после примерки при получении.</span>
          </div>
          <Link href="/catalog" className={styles.checkout__back}>
            Вернуться в каталог <ArrowRight size={17} />
          </Link>
        </section>
      </main>
    );
  }

  if (!entries.length) {
    return (
      <main className={styles.checkout}>
        <div className={styles.checkout__empty}>
          <h1>
            Корзина ждёт
            <br />
            свою первую вещь.
          </h1>
          <Link href="/catalog">
            Открыть каталог <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.checkout}>
      <div className={styles.checkout__heading}>
        <Link href="/cart">
          <ArrowLeft size={15} /> В корзину
        </Link>
        <p>Оформление заказа</p>
      </div>
      <div className={styles.checkout__layout}>
        <form className={styles.checkout__form} onSubmit={handleSubmit}>
          <section className={styles.checkout__section}>
            <div className={styles.checkout__sectionHead}>
              <span>Контакты</span>
              <i>Чтобы мы могли подтвердить заказ</i>
            </div>
            <div className={styles.checkout__fieldGrid}>
              <label className={styles.checkout__field}>
                Имя и фамилия
                <input
                  name="name"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={80}
                  placeholder="Александр Иванов"
                />
              </label>
              <label className={styles.checkout__field}>
                Телефон
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  pattern="^\+?[0-9\s()\-]{10,20}$"
                  placeholder="+7 900 000-00-00"
                />
              </label>
              <label className={styles.checkout__field}>
                Электронная почта <span>необязательно</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={160}
                  placeholder="name@example.com"
                />
              </label>
            </div>
          </section>

          <section className={styles.checkout__section}>
            <div className={styles.checkout__sectionHead}>
              <span>Доставка</span>
              <i>Оплата после примерки</i>
            </div>
            <div className={styles.checkout__deliveryChoices}>
              <label className={styles.checkout__deliveryOption}>
                <input
                  type="radio"
                  name="delivery"
                  value="courier"
                  checked={delivery === "courier"}
                  onChange={() => setDelivery("courier")}
                />
                <span>
                  <strong>Курьер до двери</strong>
                  <small>Примерка и оплата при получении</small>
                </span>
                <b>от 390 ₽</b>
              </label>
              <label className={styles.checkout__deliveryOption}>
                <input
                  type="radio"
                  name="delivery"
                  value="pickup"
                  checked={delivery === "pickup"}
                  onChange={() => setDelivery("pickup")}
                />
                <span>
                  <strong>Пункт выдачи</strong>
                  <small>Выбери удобный адрес в комментарии</small>
                </span>
                <b>от 290 ₽</b>
              </label>
            </div>
            <div className={styles.checkout__fieldGrid}>
              <label className={styles.checkout__field}>
                Город
                <input
                  name="city"
                  autoComplete="address-level2"
                  defaultValue="Москва"
                  required
                  maxLength={80}
                />
              </label>
              <label className={styles.checkout__field}>
                Адрес доставки
                <input
                  name="address"
                  autoComplete="street-address"
                  required
                  minLength={5}
                  maxLength={180}
                  placeholder="Улица, дом, квартира"
                />
              </label>
            </div>
            <label className={styles.checkout__field}>
              Комментарий к заказу <span>необязательно</span>
              <textarea
                name="comment"
                maxLength={500}
                rows={3}
                placeholder="Домофон, удобный интервал или пункт выдачи"
              />
            </label>
          </section>

          <section className={styles.checkout__section}>
            <div className={styles.checkout__sectionHead}>
              <span>Оплата</span>
              <i>Без предоплаты</i>
            </div>
            <div className={styles.checkout__payment}>
              <span className={styles.checkout__paymentIcon}>
                <Check size={16} />
              </span>
              <span>
                <strong>При получении</strong>
                <small>Картой или наличными после примерки</small>
              </span>
            </div>
          </section>

          <label className={styles.checkout__consent}>
            <input type="checkbox" name="consent" required />
            <span>
              Согласен на обработку персональных данных по{" "}
              <Link href="/privacy" target="_blank">
                политике конфиденциальности
              </Link>
              .
            </span>
          </label>
          {error && (
            <p className={styles.checkout__error} role="alert">
              {error}
            </p>
          )}
          <button className={styles.checkout__submit} type="submit" disabled={submitting}>
            <span>{submitting ? "Отправляем заказ…" : "Оформить заказ"}</span>
            <span>
              {submitting ? (
                <LoaderCircle className={styles.checkout__spinner} size={19} />
              ) : (
                <ArrowRight size={19} />
              )}
            </span>
          </button>
        </form>

        <aside className={styles.checkout__summary}>
          <h2>
            Твой заказ <span>{entries.length}</span>
          </h2>
          <div className={styles.checkout__items}>
            {entries.map(
              ({ line, product }) =>
                product && (
                  <div className={styles.checkout__item} key={line.slug + line.size}>
                    <div className={styles.checkout__itemImage}>
                      <Image src={product.image} alt="" fill sizes="70px" />
                    </div>
                    <div>
                      <strong>{product.name}</strong>
                      <span>
                        {line.size} · {line.quantity} шт.
                      </span>
                    </div>
                    <b>{formatPrice(product.price * line.quantity)}</b>
                  </div>
                ),
            )}
          </div>
          <div className={styles.checkout__totalRow}>
            <span>Товары</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <div className={styles.checkout__totalRow}>
            <span>Доставка</span>
            <strong>{shipping ? formatPrice(shipping) : "Бесплатно"}</strong>
          </div>
          <div className={styles.checkout__grandTotal}>
            <span>Итого</span>
            <strong>{formatPrice(total + shipping)}</strong>
          </div>
          <p className={styles.checkout__summaryHint}>
            Доставим бесплатно при заказе от 12 000 ₽. Можно примерить перед оплатой.
          </p>
        </aside>
      </div>
    </main>
  );
}
