import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import styles from "./product-card.module.css";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <article className={styles.productCard} style={{ "--card-index": index } as CSSProperties}>
      <Link
        className={styles.productCard__visual}
        href={`/product/${product.slug}`}
        aria-label={`Открыть товар: ${product.name}`}
      >
        <Image
          className={styles.productCard__image}
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 620px) 90vw, (max-width: 950px) 44vw, 23vw"
        />
        {product.label && <span className={styles.productCard__label}>{product.label}</span>}
        <span className={styles.productCard__quick}>
          <ArrowUpRight size={17} />
        </span>
      </Link>
      <div className={styles.productCard__info}>
        <div>
          <p className={styles.productCard__category}>
            {product.category}
            <span>{product.color}</span>
          </p>
          <Link className={styles.productCard__name} href={`/product/${product.slug}`}>
            {product.name}
          </Link>
        </div>
        <div className={styles.productCard__priceBlock}>
          <strong>{formatPrice(product.price)}</strong>
          {product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}
        </div>
      </div>
      <Link className={styles.productCard__choose} href={`/product/${product.slug}`}>
        Смотреть товар <ArrowUpRight size={15} />
      </Link>
    </article>
  );
}
