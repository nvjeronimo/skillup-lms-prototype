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
        "flex w-full gap-3 rounded-lg border border-sko-border-subtle p-4 text-left transition-colors hover:border-sko-border-default",
        className,
      )}
    >
      <Avatar name={author} src={avatarUrl} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="sk-text-body-medium-medium text-sko-text-default">{author}</span>
          <span className="sk-text-body-small-regular text-sko-text-subtle">{timestamp}</span>
        </div>
        <p className="sk-text-body-medium-regular mt-2 text-sko-text-default">{content}</p>
        <span className="mt-2 flex items-center gap-4">
          {/* DS `upvote-btn`: a pill. Display-only here, because the whole card is a
              <button> and interactive elements cannot be nested inside it. */}
          <span className="inline-flex items-center gap-1 rounded-full border border-sko-border-subtle px-2 py-1">
            <Icon icon={ArrowUp} size={14} className="text-sko-icon-muted" />
            <span className="sk-text-body-small-medium text-sko-text-default">{upvotes}</span>
          </span>
          <span className="sk-text-body-small-medium inline-flex items-center gap-1 text-sko-text-primary">
            <Icon icon={MessageCircle} size={14} />
            {replies} {replies === 1 ? "reply" : "replies"}
          </span>
        </span>
      </div>
    </button>
  );
}
