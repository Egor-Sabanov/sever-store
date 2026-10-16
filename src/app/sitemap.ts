import type { MetadataRoute } from "next";
import { products } from "@/lib/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sever.store";

const publicPages = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/catalog", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/delivery", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/returns", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...publicPages.map((page) => ({
      url: new URL(page.path, siteUrl).toString(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...products.map((product) => ({
      url: new URL(`/product/${product.slug}`, siteUrl).toString(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
