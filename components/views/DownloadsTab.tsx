"use client";

import * as React from "react";
import { FileText } from "lucide-react";
import { FileItem } from "@/components/molecules/FileItem";
import { EmptyState } from "@/components/atoms/EmptyState";
import { topicDownloads } from "@/lib/data";
import { useLmsStore } from "@/lib/store";
import { track } from "@/lib/analytics";

export function DownloadsTab({ topicId }: { topicId: string }) {
  const files = topicDownloads(topicId);
  const showToast = useLmsStore((s) => s.showToast);

  if (!files.length) {
    return (
      <div className="py-3">
        <EmptyState
          icon={FileText}
          title="No downloads for this lesson"
          description="Your instructor hasn't attached any files. Check back later or message your mentor."
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
    </div>
  );
}
