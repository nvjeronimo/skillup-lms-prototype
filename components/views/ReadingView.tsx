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
      <p className="sk-text-lg-medium text-sk-text-primary">{article.lede}</p>

      {article.sections.map((s) => (
        <section key={s.heading} className="flex flex-col gap-2">
          <h2 className="sk-text-display-xs-semibold text-sk-text-primary">{s.heading}</h2>
          {s.paragraphs.map((p, i) => (
            <p key={i} className="sk-text-md-regular text-sk-text-secondary">
              {p}
            </p>
          ))}
        </section>
      ))}

      <blockquote className="border-l-[3px] border-sk-border-brand bg-sk-bg-brand-section px-5 py-4">
        <p className="sk-text-lg-medium italic text-sk-text-primary">“{article.pullQuote.text}”</p>
        <footer className="sk-text-sm-regular mt-2 text-sk-text-tertiary">
          — {article.pullQuote.attribution}
        </footer>
      </blockquote>

      <section className="rounded-xl border border-sk-border-secondary bg-sk-bg-secondary p-5">
        <p className="sk-text-2xs-medium mb-3 text-sk-text-tertiary">Key takeaways</p>
        <ul className="flex flex-col gap-2">
          {article.takeaways.map((t, i) => (
            <li key={i} className="flex gap-2">
              <span className="sk-text-xs-semibold mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sk-bg-brand-section text-sk-text-brand-secondary">
                {i + 1}
              </span>
              <span className="sk-text-sm-regular text-sk-text-primary">{t}</span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
