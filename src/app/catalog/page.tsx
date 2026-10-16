import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog-browser";
import { products } from "@/lib/products";
import styles from "./catalog.module.css";

export const metadata: Metadata = {
  title: "Каталог",
  description: "Одежда, верхний слой и аксессуары СЕВЕР.",
};

export default function CatalogPage() {
  return (
    <main className={styles.catalogPage}>
      <section className={styles.catalogPage__intro}>
        <p className={styles.catalogPage__eyebrow}>Одежда и аксессуары</p>
        <h1>
          Собери свой
          <br />
          <em>маршрут.</em>
        </h1>
        <p>Формы, к которым возвращаются. Цвета, которые остаются с тобой дольше одного сезона.</p>
        <span className={styles.catalogPage__total}>{products.length} вещей в коллекции</span>
        <span className={styles.catalogPage__decoration} aria-hidden="true">
          ✳
        </span>
      </section>
      <CatalogBrowser products={products} />
    </main>
  );
}
