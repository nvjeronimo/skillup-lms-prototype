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
      <div className="mt-2 flex justify-center border-t border-sk-border-secondary pt-3">
        <button
          type="button"
          onClick={() => {
            track("download_file", { fileId: "all", type: "ZIP" });
            showToast(`Downloading ${files.length} resources…`);
          }}
          className="sk-text-sm-medium inline-flex items-center gap-1.5 text-sk-text-brand-secondary hover:underline"
        >
          <Icon icon={Download} size={16} />
          Download all resources
        </button>
      </div>
    </div>
  );
}
