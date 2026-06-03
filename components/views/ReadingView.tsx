"use client";

import * as React from "react";
import { Avatar } from "@/components/atoms/Avatar";
import { ContentFeedback } from "@/components/molecules/ContentFeedback";
import { getArticle } from "@/lib/content";
import { getTopic } from "@/lib/data";

export function ReadingView({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId);
  const [feedback, setFeedback] = React.useState<"like" | "dislike" | null>(null);
  if (!topic) return null;
  const article = getArticle(topic);

  return (
    <article className="flex flex-col gap-5 py-4">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 lms-text-sm-regular text-lms-text-tertiary">
        <span className="lms-text-sm-medium text-lms-text-secondary">{article.byline.author}</span>
        <span>·</span>
        <span>{article.byline.date}</span>
        <span>·</span>
        <span>{article.byline.readingTime}</span>
      </div>

      <p className="lms-text-lg-medium text-lms-text-primary">{article.lede}</p>

      {article.sections.map((s) => (
        <section key={s.heading} className="flex flex-col gap-2">
          <h2 className="lms-text-display-xs-semibold text-lms-text-primary">{s.heading}</h2>
          {s.paragraphs.map((p, i) => (
            <p key={i} className="lms-text-md-regular text-lms-text-secondary">
              {p}
            </p>
          ))}
        </section>
      ))}

      <blockquote className="border-l-[3px] border-lms-border-brand bg-lms-bg-brand-section px-5 py-4">
        <p className="lms-text-lg-medium italic text-lms-text-primary">“{article.pullQuote.text}”</p>
        <footer className="lms-text-sm-regular mt-2 text-lms-text-tertiary">
          — {article.pullQuote.attribution}
        </footer>
      </blockquote>

      <section className="rounded-xl border border-lms-border-secondary bg-lms-bg-secondary p-5">
        <p className="lms-text-2xs-medium mb-3 text-lms-text-tertiary">Key takeaways</p>
        <ul className="flex flex-col gap-2">
          {article.takeaways.map((t, i) => (
            <li key={i} className="flex gap-2">
              <span className="lms-text-xs-semibold mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lms-bg-brand-section text-lms-text-brand-secondary">
                {i + 1}
              </span>
              <span className="lms-text-sm-regular text-lms-text-primary">{t}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex items-center gap-4 border-t border-lms-border-secondary pt-4">
        <Avatar name={article.byline.author} size="md" />
        <div>
          <p className="lms-text-sm-semibold text-lms-text-primary">{article.byline.author}</p>
          <p className="lms-text-sm-regular text-lms-text-secondary">
            Lead instructor · ASQ-Certified Six Sigma Black Belt
          </p>
        </div>
      </div>

      <ContentFeedback
        value={feedback}
        onLike={() => setFeedback(feedback === "like" ? null : "like")}
        onDislike={() => setFeedback(feedback === "dislike" ? null : "dislike")}
      />
    </article>
  );
}
