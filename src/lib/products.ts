export type ProductCategory = "Одежда" | "Верхняя одежда" | "Аксессуары";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  oldPrice?: number;
  image: string;
  imageAlt: string;
  label?: string;
  color: string;
  description: string;
  materials: string;
  sizes: string[];
  stock: number;
  featured?: boolean;
};

export const categories: ProductCategory[] = ["Одежда", "Верхняя одежда", "Аксессуары"];

export const products: Product[] = [
  {
    id: "sever-hoodie-01",
    slug: "hoodie-tishina",
    name: "Худи «Тишина»",
    category: "Одежда",
    price: 8900,
    image: "/images/hoodie.jpg",
    imageAlt: "Свободное худи в уличном образе",
    label: "Хит дропа",
    color: "Графит",
    description:
      "Плотное хлопковое худи с мягкой изнанкой и спущенной линией плеча. Для тех дней, когда хочется оставить город на фоне.",
    materials: "Хлопок 80%, переработанный полиэстер 20%",
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 18,
    featured: true,
  },
  {
    id: "sever-jacket-01",
    slug: "kurtka-povtornyi-marshrut",
    name: "Куртка «Маршрут»",
    category: "Верхняя одежда",
    price: 16400,
    image: "/images/jacket.jpg",
    imageAlt: "Кожаная куртка в городском образе",
    label: "Новый цвет",
    color: "Тёмный шоколад",
    description:
      "Собранный силуэт, объёмный воротник и карманы, которые действительно нужны. Верхний слой, который делает весь образ.",
    materials: "Верх: полиуретан, подкладка: вискоза",
    sizes: ["S", "M", "L", "XL"],
    stock: 8,
    featured: true,
  },
  {
    id: "sever-tee-01",
    slug: "futbolka-vne-vremeni",
    name: "Футболка «Вне времени»",
    category: "Одежда",
    price: 3900,
    image: "/images/tee.jpg",
    imageAlt: "Белая базовая футболка крупным планом",
    color: "Молочный",
    description:
      "Тяжёлый хлопок, свободная посадка и чистая форма. Та самая футболка, которую не хочется снимать.",
    materials: "100% хлопок, 240 г/м²",
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 32,
    featured: true,
  },
  {
    id: "sever-cap-01",
    slug: "kepka-dalniy-svet",
    name: "Кепка «Дальний свет»",
    category: "Аксессуары",
    price: 3400,
    image: "/images/cap.jpg",
    imageAlt: "Кепка с лаконичным силуэтом",
    label: "Последний тираж",
    color: "Чёрный",
    description:
      "Шесть панелей, изогнутый козырёк и ремешок, который легко подстроить. Мелочь, которая меняет настроение.",
    materials: "Хлопок 100%",
    sizes: ["ONE SIZE"],
    stock: 12,
    featured: true,
  },
  {
    id: "sever-sweat-01",
    slug: "sweatshirt-nebo",
    name: "Свитшот «Небо»",
    category: "Одежда",
    price: 7600,
    image: "/images/look.jpg",
    imageAlt: "Яркий спортивный образ на фоне города",
    color: "Лайм",
    description:
      "Свободный свитшот с мягким объёмом и плотной резинкой. Цвет, который первым ловит взгляд.",
    materials: "Хлопок 85%, полиэстер 15%",
    sizes: ["XS", "S", "M", "L"],
    stock: 14,
    featured: true,
  },
  {
    id: "sever-overshirt-01",
    slug: "overshirt-posle-dozhdya",
    name: "Овершот «После дождя»",
    category: "Верхняя одежда",
    price: 11200,
    image: "/images/hero.jpg",
    imageAlt: "Тёмный овершот в выразительном уличном образе",
    color: "Хвойный",
    description:
      "Лёгкий верхний слой на переменчивую погоду. Свободный крой оставляет место для любимого худи.",
    materials: "Хлопок 65%, нейлон 35%",
    sizes: ["S", "M", "L", "XL"],
    stock: 10,
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function formatPrice(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}
