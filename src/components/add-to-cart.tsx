"use client";

import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/products";
import styles from "./add-to-cart.module.css";

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [size, setSize] = useState("");
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (!size) return;
    addItem(product, size);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className={styles.addToCart}>
      <div className={styles.addToCart__labelRow}>
        <span>Размер</span>
        <a href="/delivery">
          Таблица размеров <ArrowRight size={13} />
        </a>
      </div>
      <fieldset className={styles.addToCart__sizes}>
        <legend className={styles.addToCart__legend}>Выбери размер</legend>
        {product.sizes.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={size === item}
            className={styles.addToCart__size}
            data-selected={size === item}
            onClick={() => setSize(item)}
          >
            {item}
          </button>
        ))}
      </fieldset>
      <button
        className={styles.addToCart__button}
        type="button"
        disabled={!size}
        onClick={handleAdd}
      >
        <span>
          {added ? "Добавлено в корзину" : size ? "Добавить в корзину" : "Сначала выбери размер"}
        </span>
        <span className={styles.addToCart__buttonIcon}>
          {added ? <Check size={19} /> : <ArrowRight size={19} />}
        </span>
      </button>
      <p className={styles.addToCart__note}>Можно оплатить при получении · Доставка от 2 дней</p>
    </div>
  );
}
