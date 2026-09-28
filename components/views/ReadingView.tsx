"use client";

import * as React from "react";
import { getArticle } from "@/lib/content";
import { getTopic } from "@/lib/data";

export function ReadingView({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId);
  if (!topic) return null;
  const article = getArticle(topic);

  return (
    <article className="flex flex-col gap-5 py-4">
      <p className="sk-text-lg-medium text-sko-text-default">{article.lede}</p>

      {article.sections.map((s) => (
        <section key={s.heading} className="flex flex-col gap-2">
          <h2 className="sk-text-display-xs-semibold text-sko-text-default">{s.heading}</h2>
          {s.paragraphs.map((p, i) => (
            <p key={i} className="sk-text-md-regular text-sko-text-muted">
              {p}
            </p>
          ))}
        </section>
      ))}

      {/* DS Lesson Block Kind=HTML (Blockquote), 21354:6807. */}
      <blockquote className="flex flex-col gap-1.5 rounded-lg border-l-4 border-sko-border-primary bg-sko-bg-primary-soft px-5 py-[18px]">
        <p className="sk-text-md-medium text-sko-text-primary">“{article.pullQuote.text}”</p>
        <footer className="sk-text-sm-regular text-sko-text-primary">
          {article.pullQuote.attribution}
        </footer>
      </blockquote>

      {/* DS Lesson Block Kind=HTML (Key Takeaways), 21354:6808. */}
      <section className="flex flex-col gap-3 rounded-xl bg-sko-bg-muted px-6 py-[22px]">
        <p className="sk-text-xs-medium uppercase text-sko-text-subtle">Key takeaways</p>
        <ul className="flex flex-col gap-3">
          {article.takeaways.map((t, i) => (
            <li key={i} className="flex gap-3.5">
              <span className="sk-text-sm-semibold w-4 shrink-0 text-sko-text-primary">{i + 1}</span>
              <span className="sk-text-md-medium text-sko-text-default">{t}</span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
