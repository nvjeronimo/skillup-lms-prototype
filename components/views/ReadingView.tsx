"use client";

import * as React from "react";
import { getArticle, getDownloads } from "@/lib/content";
import { getTopic } from "@/lib/data";
import { useLmsStore } from "@/lib/store";

export function ReadingView({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId);
  const showToast = useLmsStore((s) => s.showToast);
  if (!topic) return null;
  const article = getArticle(topic);
  const files = getDownloads(topic);

  return (
    <article className="flex flex-col gap-5 py-4">
      <p className="sk-text-title-medium-medium text-sko-text-default">{article.lede}</p>

      {article.sections.map((s) => (
        <section key={s.heading} className="flex flex-col gap-2">
          <h2 className="sk-text-headline-small-semibold text-sko-text-default">{s.heading}</h2>
          {s.paragraphs.map((p, i) => (
            <p key={i} className="sk-text-body-large-regular text-sko-text-muted">
              {p}
            </p>
          ))}
        </section>
      ))}

      {/* DS Lesson Block Kind=HTML (Blockquote), 21354:6807. */}
      <blockquote className="flex flex-col gap-1.5 rounded-lg border-l-4 border-sko-border-primary bg-sko-bg-primary-soft px-5 py-[18px]">
        <p className="sk-text-body-large-medium text-sko-text-primary">“{article.pullQuote.text}”</p>
        <footer className="sk-text-body-medium-regular text-sko-text-primary">
          {article.pullQuote.attribution}
        </footer>
      </blockquote>

      {/* DS Lesson Block Kind=HTML (Key Takeaways), 21354:6808. */}
      <section className="flex flex-col gap-3 rounded-xl bg-sko-bg-muted px-6 py-[22px]">
        <p className="sk-text-body-small-medium uppercase text-sko-text-subtle">Key takeaways</p>
        <ul className="flex flex-col gap-3">
          {article.takeaways.map((t, i) => (
            <li key={i} className="flex gap-3.5">
              <span className="sk-text-body-medium-semibold w-4 shrink-0 text-sko-text-primary">{i + 1}</span>
              <span className="sk-text-body-large-medium text-sko-text-default">{t}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Reading has no Downloads tab: its files are links in the body, and a link opens the
          file in a new tab (Studio has no download button). */}
      {files.length ? (
        <section className="flex flex-col gap-2">
          <h2 className="sk-text-headline-small-semibold text-sko-text-default">Files</h2>
          <ul className="flex flex-col gap-1">
            {files.map((f) => (
              <li key={f.id}>
                <a
                  href={`#file-${f.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    showToast(`Opening ${f.name} in a new tab…`);
                  }}
                  className="sk-text-body-large-medium inline-flex min-h-11 items-center gap-2 text-sko-text-primary underline underline-offset-2"
                >
                  {f.name}
                  <span className="sk-text-body-medium-regular text-sko-text-subtle no-underline">
                    {f.type} · {f.size}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
