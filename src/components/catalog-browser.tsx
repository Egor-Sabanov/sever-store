"use client";

import { ArrowDownWideNarrow, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/products";
import { categories } from "@/lib/products";
import styles from "./catalog-browser.module.css";

export function CatalogBrowser({ products }: { products: Product[] }) {
  const [category, setCategory] = useState("Всё");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("category");
    const selected = categories.find((item) => item === requested);
    if (selected) setCategory(selected);
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ru");
    const result = products.filter((product) => {
      const matchesCategory = category === "Всё" || product.category === category;
      const matchesQuery =
        !normalized ||
        `${product.name} ${product.category} ${product.color}`
          .toLocaleLowerCase("ru")
          .includes(normalized);
      return matchesCategory && matchesQuery;
    });
    return [...result].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [category, query, sort, products]);

  return (
    <div className={styles.catalogBrowser}>
      <div className={styles.catalogBrowser__toolbar}>
        <button
          className={styles.catalogBrowser__filterToggle}
          type="button"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((value) => !value)}
        >
          {filtersOpen ? <X size={17} /> : <SlidersHorizontal size={17} />} Фильтры
        </button>
        <label className={styles.catalogBrowser__search}>
          <Search size={16} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Найти свою вещь"
            aria-label="Поиск по каталогу"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Очистить поиск">
              <X size={15} />
            </button>
          )}
        </label>
        <label className={styles.catalogBrowser__sort}>
          <ArrowDownWideNarrow size={16} />
          <span>Сортировка</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Сортировка товаров"
          >
            <option value="featured">Сначала важное</option>
            <option value="price-low">Сначала дешевле</option>
            <option value="price-high">Сначала дороже</option>
          </select>
        </label>
      </div>
      <div className={styles.catalogBrowser__body}>
        <aside className={styles.catalogBrowser__sidebar} data-open={filtersOpen}>
          <p className={styles.catalogBrowser__filterTitle}>Категория</p>
          <div className={styles.catalogBrowser__categories}>
            {["Всё", ...categories].map((item) => (
              <button
                key={item}
                type="button"
                className={styles.catalogBrowser__category}
                data-active={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
                <span>
                  {item === "Всё"
                    ? products.length
                    : products.filter((product) => product.category === item).length}
                </span>
              </button>
            ))}
          </div>
          <div className={styles.catalogBrowser__asideNote}>
            Продуманные формы.
            <br />
            Без лишнего шума.
          </div>
        </aside>
        <div className={styles.catalogBrowser__results}>
          <p className={styles.catalogBrowser__resultCount}>
            Найдено вещей: <strong>{filtered.length}</strong>
          </p>
          {filtered.length ? (
            <div className={styles.catalogBrowser__grid}>
              {filtered.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className={styles.catalogBrowser__empty}>
              <span>Ничего похожего</span>
              <p>Попробуй другое название или сбрось фильтр.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("Всё");
                }}
              >
                Показать всё
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
