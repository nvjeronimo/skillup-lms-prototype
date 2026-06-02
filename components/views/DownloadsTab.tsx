"use client";

import * as React from "react";
import { FileItem } from "@/components/molecules/FileItem";
import { topicDownloads } from "@/lib/data";
import { useLmsStore } from "@/lib/store";

export function DownloadsTab({ topicId }: { topicId: string }) {
  const files = topicDownloads(topicId);
  const showToast = useLmsStore((s) => s.showToast);

  if (!files.length) {
    return (
      <p className="lms-text-sm-regular px-1 py-8 text-center text-lms-text-tertiary">
        No downloads for this topic.
      </p>
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
          onDownload={() => showToast(`Downloading ${f.name}…`)}
        />
      ))}
    </div>
  );
}
