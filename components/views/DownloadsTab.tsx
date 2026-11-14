import * as React from "react";
import { Download, FileText } from "lucide-react";
import { Icon } from "@/lib/icons";
import { FileItem } from "@/components/molecules/FileItem";
import { EmptyState } from "@/components/atoms/EmptyState";
import { getTopic } from "@/lib/data";
import { getDownloads } from "@/lib/content";
import { useLmsStore } from "@/lib/store";
import { track } from "@/lib/analytics";
import styles from "./DownloadsTab.module.css";

export function DownloadsTab({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId);
  const files = topic ? getDownloads(topic) : [];
  const showToast = useLmsStore((s) => s.showToast);

  if (!files.length) {
    return (
      <div className={styles.empty}>
        <EmptyState
          icon={FileText}
          title="No downloads for this lesson"
          description="Files will appear here as your instructor adds them. Your mentor can help in the meantime."
        />
      </div>
    );
  }

  return (
    <div className={styles.list}>
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
      <div className={styles.footer}>
        <button
          type="button"
          onClick={() => {
            track("download_file", { fileId: "all", type: "ZIP" });
            showToast(`Downloading ${files.length} resources…`);
          }}
          // DS Link Button Type=Brand, Hierarchy=Primary: 1px icon/primary underline; on hover the text, line and icon
          // darken, no fill (Nelson, 23 Oct 2026: a fill on hover was wrong); bg/faint only on keyboard focus.
          className={`sk-text-body-medium-semibold ${styles.downloadAll}`}
        >
          <Icon icon={Download} size={16} className={styles.downloadIcon} />
          <span className={styles.downloadLabel}>Download all resources</span>
        </button>
      </div>
    </div>
  );
}
