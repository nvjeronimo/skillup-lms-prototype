import * as React from "react";
import { ArrowUp, MessageCircle } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Avatar } from "@/components/atoms/Avatar";
import { cn } from "@/lib/utils";

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
      className={cn(
        "flex w-full gap-3 rounded-lg border border-lms-border-secondary p-4 text-left transition-colors hover:border-lms-border-primary",
        className,
      )}
    >
      <Avatar name={author} src={avatarUrl} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="lms-text-sm-semibold text-lms-text-primary">{author}</span>
          <span className="lms-text-xs-regular text-lms-text-tertiary">{timestamp}</span>
        </div>
        <p className="lms-text-sm-regular mt-1 text-lms-text-secondary">{content}</p>
        <span className="mt-2 flex items-center gap-4">
          <span className="lms-text-xs-medium inline-flex items-center gap-1 text-lms-text-tertiary">
            <Icon icon={ArrowUp} size={14} />
            {upvotes}
          </span>
          <span className="lms-text-xs-medium inline-flex items-center gap-1 text-lms-text-brand-secondary">
            <Icon icon={MessageCircle} size={14} />
            {replies} {replies === 1 ? "reply" : "replies"}
          </span>
        </span>
      </div>
    </button>
  );
}
