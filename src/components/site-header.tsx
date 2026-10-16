"use client";

import { ArrowUpRight, Menu, Search, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-provider";
import styles from "./site-header.module.css";

const links = [
  { href: "/catalog", label: "Одежда" },
  { href: "/catalog?category=Аксессуары", label: "Аксессуары" },
  { href: "/#story", label: "История" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pathname) setOpen(false);
  }, [pathname]);

  return (
    <>
      <div className={styles.header__announcement}>
        <span>Дроп «Вне сезона» уже в каталоге</span>
        <Link href="/catalog" aria-label="Перейти к новому дропу">
          <ArrowUpRight size={14} />
        </Link>
      </div>
      <header className={styles.header}>
        <Link className={styles.header__brand} href="/" aria-label="СЕВЕР — на главную">
          <span className={styles.header__brandMark}>С</span>
          <span className={styles.header__brandName}>
            СЕВЕР<span>®</span>
          </span>
        </Link>

        <nav className={styles.header__nav} aria-label="Основная навигация">
          {links.map((link) => (
            <Link key={link.href} className={styles.header__link} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.header__actions}>
          <Link className={styles.header__iconLink} href="/catalog" aria-label="Открыть каталог">
            <Search size={19} strokeWidth={1.8} />
          </Link>
          <Link
            className={styles.header__cart}
            href="/cart"
            aria-label={`Корзина, товаров: ${count}`}
          >
            <ShoppingBag size={19} strokeWidth={1.8} />
            <span>Корзина</span>
            <span className={styles.header__count}>{count}</span>
          </Link>
          <button
            className={styles.header__menuToggle}
            type="button"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <div className={styles.header__mobilePanel} data-open={open}>
        <nav className={styles.header__mobileNav} aria-label="Мобильная навигация">
          {links.map((link) => (
            <Link key={link.href} className={styles.header__mobileLink} href={link.href}>
              {link.label}
              <ArrowUpRight size={17} />
            </Link>
          ))}
          <Link className={styles.header__mobileLink} href="/cart">
            Корзина <span className={styles.header__mobileCount}>{count}</span>
          </Link>
        </nav>
        <p>Вещи для своего темпа.</p>
      </div>
    </>
  );
}
