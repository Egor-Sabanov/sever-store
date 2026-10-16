"use client";

import { ArrowLeft, ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatPrice, getProduct } from "@/lib/products";
import styles from "./cart.module.css";

export default function CartPage() {
  const { lines, total, ready, setQuantity, removeItem } = useCart();
  const entries = lines
    .map((line) => ({ line, product: getProduct(line.slug) }))
    .filter((entry) => entry.product);
  const shipping = total >= 12000 || total === 0 ? 0 : 390;

  if (!ready)
    return (
      <main className={styles.cartPage}>
        <div className={styles.cartPage__loading}>Подготавливаем корзину…</div>
      </main>
    );

  return (
    <main className={styles.cartPage}>
      <div className={styles.cartPage__intro}>
        <p>Твой выбор</p>
        <h1>
          Корзина<span> · {entries.length}</span>
        </h1>
        <Link href="/catalog">
          <ArrowLeft size={14} /> Продолжить покупки
        </Link>
      </div>
      {!entries.length ? (
        <div className={styles.cartPage__empty}>
          <span className={styles.cartPage__emptyMark}>С</span>
          <h2>Пока здесь пусто.</h2>
          <p>Начни с вещи, которая задаст настроение всему образу.</p>
          <Link href="/catalog">
            Открыть каталог <ArrowRight size={17} />
          </Link>
        </div>
      ) : (
        <div className={styles.cartPage__layout}>
          <section className={styles.cartPage__items} aria-label="Товары в корзине">
            {entries.map(
              ({ line, product }) =>
                product && (
                  <article className={styles.cartPage__item} key={line.slug + line.size}>
                    <Link className={styles.cartPage__image} href={`/product/${product.slug}`}>
                      <Image src={product.image} alt={product.imageAlt} fill sizes="120px" />
                    </Link>
                    <div className={styles.cartPage__productInfo}>
                      <div>
                        <p>
                          {product.category} · {product.color}
                        </p>
                        <Link href={`/product/${product.slug}`}>{product.name}</Link>
                        <span>Размер: {line.size}</span>
                      </div>
                      <strong>{formatPrice(product.price * line.quantity)}</strong>
                      <div className={styles.cartPage__controls}>
                        <div className={styles.cartPage__stepper}>
                          <button
                            type="button"
                            aria-label="Уменьшить количество"
                            onClick={() => setQuantity(line.slug, line.size, line.quantity - 1)}
                          >
                            <Minus size={13} />
                          </button>
                          <span>{line.quantity}</span>
                          <button
                            type="button"
                            aria-label="Увеличить количество"
                            onClick={() => setQuantity(line.slug, line.size, line.quantity + 1)}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <button
                          className={styles.cartPage__remove}
                          type="button"
                          onClick={() => removeItem(line.slug, line.size)}
                        >
                          <Trash2 size={14} /> Убрать
                        </button>
                      </div>
                    </div>
                  </article>
                ),
            )}
          </section>
          <aside className={styles.cartPage__summary}>
            <h2>Итого</h2>
            <div>
              <span>Товары</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <div>
              <span>Доставка</span>
              <strong>{shipping === 0 ? "Бесплатно" : formatPrice(shipping)}</strong>
            </div>
            {shipping > 0 && (
              <p className={styles.cartPage__shippingHint}>
                Добавь ещё на {formatPrice(12000 - total)} — и доставка будет за наш счёт.
              </p>
            )}
            <div className={styles.cartPage__total}>
              <span>К оплате</span>
              <strong>{formatPrice(total + shipping)}</strong>
            </div>
            <Link className={styles.cartPage__checkout} href="/checkout">
              Перейти к оформлению{" "}
              <span>
                <ArrowRight size={18} />
              </span>
            </Link>
            <p className={styles.cartPage__finePrint}>Оплата при получении после примерки</p>
          </aside>
        </div>
      )}
    </main>
  );
}
