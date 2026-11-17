import * as React from "react";
import { Quote } from "lucide-react";
import { getArticle, getDownloads, getReadingOpenResponse } from "@/lib/content";
import { ReadingOpenResponseBlock } from "./OraView";
import { Icon } from "@/lib/icons";
import { getTopic } from "@/lib/data";
import { useLmsStore } from "@/lib/store";
import styles from "./ReadingView.module.css";

export function ReadingView({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId);
  const showToast = useLmsStore((s) => s.showToast);
  if (!topic) return null;
  const article = getArticle(topic);
  const files = getDownloads(topic);
  const openResponse = getReadingOpenResponse(topic);

  return (
    // Blocks 32 apart, 24 above and below (were 20 / 16; Nelson, 25 Oct 2026: more space between sections).
    <article className={styles.article}>
      {/* Running text stops at DS Container/text-max-width (max-w-text), for now 1200 like the
          column and the platform pages (Nelson, 27 Oct 2026; replaces the 56ch cap of 25 Oct), so a
          shorter measure is one token away. text-pretty keeps a last word from standing alone. */}
      <p className={`sk-text-title-medium-medium ${styles.lede}`}>{article.lede}</p>

      {article.sections.map((s) => (
        <section key={s.heading} className={styles.section}>
          {/* title-large/Bold, a step under the topic title (Figma Reading 5685:170897; Nelson's SKO
              match review, 28 Oct 2026: the H2 was headline-small, the size of the H1). */}
          <h2 className={`sk-text-title-large-bold ${styles.heading}`}>{s.heading}</h2>
          {s.paragraphs.map((p, i) => (
            <p key={i} className={`sk-text-body-large-regular ${styles.paragraph}`}>
              {p}
            </p>
          ))}
        </section>
      ))}

      {/* DS Lesson Block Kind=HTML (Blockquote) v1.1, 21354:6807: a typographic pull quote, no box
          and no stripe — the Quote mark (28, icon/primary), the quote in title-medium/Medium
          text/primary between curly quotation marks (as the DS block draws it; Nelson's SKO match
          review, 28 Oct 2026), the attribution in body-medium text/muted. */}
      <blockquote className={styles.quote}>
        <Icon icon={Quote} size={28} aria-hidden="true" className={styles.quoteIcon} />
        <div className={styles.quoteBody}>
          <p className={`sk-text-title-medium-medium ${styles.quoteText}`}>&ldquo;{article.pullQuote.text}&rdquo;</p>
          <footer className={`sk-text-body-medium-regular ${styles.quoteAttribution}`}>{article.pullQuote.attribution}</footer>
        </div>
      </blockquote>

      {/* DS Lesson Block Kind=HTML (Key Takeaways), 21354:6808. */}
      <section className={styles.takeaways}>
        <p className={`sk-text-body-small-medium ${styles.takeawaysLabel}`}>Key takeaways</p>
        <ul className={styles.takeawayList}>
          {article.takeaways.map((t, i) => (
            <li key={i} className={styles.takeaway}>
              <span className={`sk-text-body-medium-semibold ${styles.takeawayNumber}`}>{i + 1}</span>
              <span className={`sk-text-body-large-medium ${styles.takeawayText}`}>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* An Open Response at the end of the read (Figma Reading Row 6, 28 Oct 2026). */}
      {openResponse ? <ReadingOpenResponseBlock topicId={topic.id} openResponse={openResponse} /> : null}

      {/* Reading has no Downloads tab: its files are links in the body, and a link opens the
          file in a new tab (Studio has no download button). */}
      {files.length ? (
        <section className={styles.section}>
          <h2 className={`sk-text-title-large-bold ${styles.heading}`}>Files</h2>
          <ul className={styles.files}>
            {files.map((f) => (
              <li key={f.id}>
                <a
                  href={`#file-${f.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    showToast(`Opening ${f.name} in a new tab…`);
                  }}
                  className={`sk-text-body-large-medium ${styles.fileLink}`}
                >
                  {f.name}
                  <span
                    data-invented="files: file type and size are not shown to learners in Open edX"
                    className={`sk-text-body-medium-regular ${styles.fileMeta}`}
                  >
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
