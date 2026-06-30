"use client";

import * as React from "react";
import { Avatar } from "@/components/atoms/Avatar";
import { ContentFeedback } from "@/components/molecules/ContentFeedback";
import { getArticle } from "@/lib/content";
import { getTopic } from "@/lib/data";
import { useLmsStore } from "@/lib/store";

export function ReadingView({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId);
  const showToast = useLmsStore((s) => s.showToast);
  const [feedback, setFeedback] = React.useState<"like" | "dislike" | null>(null);
  if (!topic) return null;
  const article = getArticle(topic);

  return (
    <article className="flex flex-col gap-5 py-4">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 sk-text-sm-regular text-sk-text-tertiary">
        <span className="sk-text-sm-medium text-sk-text-secondary">{article.byline.author}</span>
        <span>·</span>
        <span>{article.byline.date}</span>
        <span>·</span>
        <span>{article.byline.readingTime}</span>
      </div>

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

      <div className="flex items-center gap-4 border-t border-sk-border-secondary pt-4">
        <Avatar name={article.byline.author} size="md" />
        <div>
          <p className="sk-text-sm-semibold text-sk-text-primary">{article.byline.author}</p>
          <p className="sk-text-sm-regular text-sk-text-secondary">
            Lead instructor · ASQ-Certified Six Sigma Black Belt
          </p>
        </div>
      </div>

      <ContentFeedback
        value={feedback}
        onLike={() => setFeedback(feedback === "like" ? null : "like")}
        onDislike={() => setFeedback(feedback === "dislike" ? null : "dislike")}
        onReport={() => showToast("Thanks — we'll take a look.")}
      />
    </article>
  );
}
