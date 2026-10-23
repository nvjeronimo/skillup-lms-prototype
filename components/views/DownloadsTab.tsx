"use client";

import * as React from "react";
import { Download, FileText } from "lucide-react";
import { Icon } from "@/lib/icons";
import { FileItem } from "@/components/molecules/FileItem";
import { EmptyState } from "@/components/atoms/EmptyState";
import { getTopic } from "@/lib/data";
import { getDownloads } from "@/lib/content";
import { useLmsStore } from "@/lib/store";
import { track } from "@/lib/analytics";

export function DownloadsTab({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId);
  const files = topic ? getDownloads(topic) : [];
  const showToast = useLmsStore((s) => s.showToast);

  if (!files.length) {
    return (
      <div className="py-3">
        <EmptyState
          icon={FileText}
          title="No downloads for this lesson"
          description="Files will appear here as your instructor adds them. Your mentor can help in the meantime."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 py-3">
      {files.map((f) => (
        <FileItem
          key={f.id}
          type={f.type}
          name={f.name}
          size={f.size}
          addedLabel="Added 2 weeks ago"
          onDownload={() => {
            track("download_file", { fileId: f.id, type: f.type });
            showToast(`Downloading ${f.name}…`);
          }}
        />
      ))}

      {/* Download all (ICP Phase 1). */}
      <div className="mt-2 flex justify-center border-t border-sko-border-subtle pt-3">
        <button
          type="button"
          onClick={() => {
            track("download_file", { fileId: "all", type: "ZIP" });
            showToast(`Downloading ${files.length} resources…`);
          }}
          // DS Link Button Type=Brand, Hierarchy=Primary: 1px icon/primary underline; on hover the text, line and icon
          // darken, no fill (Nelson, 23 Oct 2026: a fill on hover was wrong); bg/faint only on keyboard focus.
          className="sk-text-body-medium-semibold inline-flex items-center gap-1 border-b border-sko-icon-primary px-0.5 pb-[3px] pt-1 text-sko-text-primary transition-colors hover:border-sko-icon-default hover:text-sko-text-on-primary-soft focus-visible:rounded-control focus-visible:bg-sko-bg-faint [&:hover_svg]:text-sko-icon-default"
        >
          <Icon icon={Download} size={16} className="text-sko-icon-primary" />
          <span className="px-0.5">Download all resources</span>
        </button>
      </div>
    </div>
  );
}
