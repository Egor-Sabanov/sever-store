import { ArrowDownRight, ArrowRight, ArrowUpRight, MoveUpRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/products";
import styles from "./home.module.css";

export default function HomePage() {
  const featured = products.filter((product) => product.featured).slice(0, 4);

  return (
    <main>
      <section className={styles.homeHero}>
        <div className={styles.homeHero__wash} />
        <div className={styles.homeHero__copy}>
          <h1>
            Не жди сезона.
            <br />
            <em>Создавай свой.</em>
          </h1>
          <p className={styles.homeHero__description}>
            Вещи для тех, кто выбирает свой маршрут. Спокойные формы, сильные детали, свобода
            двигаться как хочется.
          </p>
          <div className={styles.homeHero__actions}>
            <Link className={styles.homeHero__primary} href="/catalog">
              Смотреть дроп{" "}
              <span>
                <ArrowDownRight size={18} />
              </span>
            </Link>
            <Link className={styles.homeHero__secondary} href="#story">
              О бренде <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className={styles.homeHero__meta}>
            <span>Новая коллекция</span>
            <i />
            <span>Осень · Зима 2026</span>
          </div>
        </div>
        <div className={styles.homeHero__visual}>
          <Image
            className={styles.homeHero__image}
            src="/images/hero.jpg"
            alt="Уличный образ из новой коллекции СЕВЕР"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 54vw"
          />
          <div className={styles.homeHero__photoTint} />
          <div className={styles.homeHero__orbit} aria-hidden="true">
            <span>ВНЕ СЕЗОНА · ВНЕ СЕЗОНА ·</span>
            <b>С</b>
          </div>
          <div className={styles.homeHero__note}>
            <Sparkles size={15} />
            <span>Найди свой темп</span>
          </div>
          <span className={styles.homeHero__caption}>
            Снято на улицах, где начинается свой путь
          </span>
        </div>
        <Link className={styles.homeHero__scroll} href="#new">
          <ArrowDownRight size={16} /> Листай вниз
        </Link>
      </section>

      <section className={styles.homeTicker} aria-label="Одежда для своего маршрута">
        <div className={styles.homeTicker__track} aria-hidden="true">
          {[0, 1].map((copy) => (
            <div className={styles.homeTicker__group} key={copy}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((repetition) => (
                <span className={styles.homeTicker__unit} key={repetition}>
                  СВОЙ МАРШРУТ <i>✳</i> СВОЙ ТЕМП <i>✳</i> СВОИ ПРАВИЛА <i>✳</i> ГОРОД ОТКРЫТ{" "}
                  <i>✳</i>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.homeCollection} id="new">
        <div className={styles.homeSectionHead}>
          <div>
            <p className={styles.homeEyebrow}>Вышли из тени</p>
            <h2>
              Свежий дроп<span>®</span>
            </h2>
          </div>
          <Link className={styles.homeTextLink} href="/catalog">
            Весь каталог <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className={styles.homeCollection__grid}>
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
        <div className={styles.homeCollection__foot}>
          <span>Вещи, которые выдержат больше одного сезона</span>
          <Link href="/catalog">
            Выбрать своё <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <section className={styles.homeStory} id="story">
        <div className={styles.homeStory__visual}>
          <Image
            src="/images/look.jpg"
            alt="Городской образ в коллекции СЕВЕР"
            fill
            sizes="(max-width: 760px) 100vw, 50vw"
          />
          <span className={styles.homeStory__imageTag}>Город — твоя примерочная</span>
          <div className={styles.homeStory__spark} aria-hidden="true">
            ✳
          </div>
        </div>
        <div className={styles.homeStory__copy}>
          <p className={styles.homeEyebrow}>Одежда с характером</p>
          <h2>
            Город не задаёт правила.
            <br />
            <span>Он даёт пространство.</span>
          </h2>
          <p>
            Мы создаём одежду, которая не диктует, кем быть. Чёткий крой, тактильные материалы и
            акцент там, где его хочется оставить.
          </p>
          <p className={styles.homeStory__small}>
            Небольшие тиражи. Продуманные детали. Никаких случайных вещей.
          </p>
          <Link className={styles.homeStory__link} href="/catalog">
            Найти свой силуэт <MoveUpRight size={18} />
          </Link>
          <span className={styles.homeStory__scribble} aria-hidden="true">
            wear it your way
          </span>
        </div>
      </section>

      <section className={styles.homeValues}>
        <div className={styles.homeValues__intro}>
          <p className={styles.homeEyebrow}>Всё на своих местах</p>
          <h2>
            Хорошая вещь
            <br />
            живёт <em>дольше.</em>
          </h2>
        </div>
        <article className={styles.homeValues__card} data-tone="lime">
          <span className={styles.homeValues__icon}>
            <Sparkles size={19} />
          </span>
          <h3>Меньше, но лучше</h3>
          <p>Небольшие коллекции, в которых каждая вещь имеет смысл.</p>
          <span className={styles.homeValues__shape} aria-hidden="true">
            ✳
          </span>
        </article>
        <article className={styles.homeValues__card} data-tone="lilac">
          <span className={styles.homeValues__icon}>
            <ArrowRight size={19} />
          </span>
          <h3>Удобно каждый день</h3>
          <p>Посадка, материалы и детали проверены в городском ритме.</p>
          <span className={styles.homeValues__shape} aria-hidden="true">
            ↗
          </span>
        </article>
        <article className={styles.homeValues__card} data-tone="coral">
          <span className={styles.homeValues__icon}>
            <ArrowDownRight size={19} />
          </span>
          <h3>Просто выбрать</h3>
          <p>Доставка с примеркой и оплата после того, как вещь подошла.</p>
          <span className={styles.homeValues__shape} aria-hidden="true">
            ○
          </span>
        </article>
      </section>

      <section className={styles.homeCta}>
        <div>
          <p className={styles.homeEyebrow}>Дальше — твой ход</p>
          <h2>
            Встретимся
            <br />
            <em>на маршруте.</em>
          </h2>
        </div>
        <Link href="/catalog" className={styles.homeCta__button}>
          Открыть каталог{" "}
          <span>
            <ArrowUpRight size={20} />
          </span>
        </Link>
        <span className={styles.homeCta__orbit} aria-hidden="true">
          СЕВЕР · СЕВЕР · СЕВЕР ·
        </span>
      </section>
    </main>
  );
}
