import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__top}>
        <div className={styles.footer__identity}>
          <Link className={styles.footer__brand} href="/">
            СЕВЕР<span>®</span>
          </Link>
          <p>
            Не подстраивайся под сезон.
            <br />
            Оставь его позади.
          </p>
        </div>
        <div className={styles.footer__links}>
          <div>
            <span className={styles.footer__label}>Навигация</span>
            <Link href="/catalog">Каталог</Link>
            <Link href="/#story">О бренде</Link>
          </div>
          <div>
            <span className={styles.footer__label}>Покупателям</span>
            <Link href="/delivery">Доставка</Link>
            <Link href="/returns">Обмен и возврат</Link>
          </div>
          <div>
            <span className={styles.footer__label}>Связаться</span>
            <a href="mailto:hello@sever.store">hello@sever.store</a>
            <a href="https://t.me/" target="_blank" rel="noreferrer">
              Telegram <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </div>
      <div className={styles.footer__bottom}>
        <span>© СЕВЕР, 2026</span>
        <span>Сделано для движения</span>
        <Link href="/privacy">Конфиденциальность</Link>
      </div>
    </footer>
  );
}
