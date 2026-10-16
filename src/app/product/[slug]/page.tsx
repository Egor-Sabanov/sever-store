import { ArrowLeft, ArrowUpRight, Check, PackageCheck, RotateCcw, Truck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCart } from "@/components/add-to-cart";
import { ProductCard } from "@/components/product-card";
import { formatPrice, getProduct, products } from "@/lib/products";
import styles from "./product.module.css";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return product ? { title: product.name, description: product.description } : {};
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense
      fallback={
        <main className={styles.productPage} aria-busy="true">
          <div className={styles.productPage__loading}>Открываем вещь…</div>
        </main>
      }
    >
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const similar = products
    .filter((item) => item.category === product.category && item.slug !== product.slug)
    .slice(0, 3);

  return (
    <main className={styles.productPage}>
      <div className={styles.productPage__breadcrumb}>
        <Link href="/catalog">
          <ArrowLeft size={14} /> Каталог
        </Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>
      <section className={styles.productPage__detail}>
        <div className={styles.productPage__gallery}>
          <div className={styles.productPage__mainImage}>
            <Image
              src={product.image}
              alt={product.imageAlt}
              fill
              priority
              sizes="(max-width: 760px) 100vw, 55vw"
            />
            {product.label && <span className={styles.productPage__badge}>{product.label}</span>}
            <span className={styles.productPage__imageCaption}>СЕВЕР / Коллекция «Вне сезона»</span>
          </div>
          <div className={styles.productPage__galleryNote}>
            <SparkleMark />
            <span>
              Свободная посадка
              <br />
              на каждый день
            </span>
          </div>
        </div>
        <div className={styles.productPage__info}>
          <p className={styles.productPage__category}>
            {product.category}
            <span>·</span>
            {product.color}
          </p>
          <h1>{product.name}</h1>
          <p className={styles.productPage__price}>{formatPrice(product.price)}</p>
          <p className={styles.productPage__description}>{product.description}</p>
          <AddToCart product={product} />
          <div className={styles.productPage__benefits}>
            <div>
              <Truck size={17} />
              <span>Доставка с примеркой</span>
            </div>
            <div>
              <RotateCcw size={17} />
              <span>Возврат в течение 14 дней</span>
            </div>
            <div>
              <PackageCheck size={17} />
              <span>Оплата после осмотра</span>
            </div>
          </div>
          <details className={styles.productPage__details}>
            <summary>
              Состав и уход <span>+</span>
            </summary>
            <p>
              {product.materials}. Стирать наизнанку в прохладной воде, сушить естественным
              способом.
            </p>
          </details>
          <details className={styles.productPage__details}>
            <summary>
              Доставка и возврат <span>+</span>
            </summary>
            <p>
              Передадим заказ в службу доставки в течение двух рабочих дней. Можно примерить вещи
              при получении и отказаться от неподходящих.
            </p>
          </details>
        </div>
      </section>
      {similar.length > 0 && (
        <section className={styles.productPage__related}>
          <div className={styles.productPage__relatedHead}>
            <p>Сочетается с</p>
            <Link href="/catalog">
              Весь каталог <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className={styles.productPage__relatedGrid}>
            {similar.map((item, index) => (
              <ProductCard key={item.id} product={item} index={index} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function SparkleMark() {
  return (
    <span className={styles.productPage__sparkle}>
      <Check size={16} />
    </span>
  );
}
