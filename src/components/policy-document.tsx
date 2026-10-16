import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import styles from "./policy-document.module.css";

export type PolicySection = { title: string; paragraphs: string[]; list?: string[] };
export function PolicyDocument({
  eyebrow,
  title,
  lead,
  sections,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  sections: PolicySection[];
}) {
  return (
    <main className={styles.policy}>
      <Link className={styles.policy__back} href="/">
        <ArrowLeft size={14} /> На главную
      </Link>
      <header className={styles.policy__header}>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <span>{lead}</span>
        <ArrowUpRight className={styles.policy__arrow} size={34} />
      </header>
      <div className={styles.policy__content}>
        {sections.map((section) => (
          <section className={styles.policy__section} key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.list && (
              <ul>
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
