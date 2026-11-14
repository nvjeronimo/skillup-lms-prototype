import * as React from "react";
import { ArrowUp, MessageCircle } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Avatar } from "@/components/atoms/Avatar";
import { cn } from "@/lib/utils";
import styles from "./ThreadItem.module.css";

export interface ThreadItemProps {
  author: string;
  avatarUrl?: string;
  timestamp: string;
  content: string;
  replies: number;
  upvotes?: number;
  onClick?: () => void;
  className?: string;
}

/** Discussion thread item: avatar + content + upvotes + replies count. */
export function ThreadItem({
  author,
  avatarUrl,
  timestamp,
  content,
  replies,
  upvotes = 12,
  onClick,
  className,
}: ThreadItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(styles.thread, className)}
    >
      <Avatar name={author} src={avatarUrl} size="sm" />
      <div className={styles.body}>
        <div className={styles.head}>
          <span className={`sk-text-body-medium-medium ${styles.author}`}>{author}</span>
          <span className={`sk-text-body-small-regular ${styles.time}`}>{timestamp}</span>
        </div>
        <p className={`sk-text-body-medium-regular ${styles.content}`}>{content}</p>
        <span className={styles.meta}>
          {/* DS `upvote-btn`: a pill. Display-only here, because the whole card is a
              <button> and interactive elements cannot be nested inside it. */}
          <span className={styles.upvote}>
            <Icon icon={ArrowUp} size={14} className={styles.upvoteIcon} />
            <span className={`sk-text-body-small-medium ${styles.upvoteCount}`}>{upvotes}</span>
          </span>
          <span className={`sk-text-body-small-medium ${styles.replies}`}>
            <Icon icon={MessageCircle} size={14} />
            {replies} {replies === 1 ? "reply" : "replies"}
          </span>
        </span>
      </div>
    </button>
  );
}
