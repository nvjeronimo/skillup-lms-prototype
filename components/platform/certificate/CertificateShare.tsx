"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { ShareMenu, type ShareChannel } from "@/components/molecules/ShareMenu";
import { certificateUrl, shareHref, type ShareTarget } from "@/lib/platform/certificate-share";
import { useLmsStore } from "@/lib/store";
import { useDisclosure } from "@/lib/useDisclosure";
import { cn } from "@/lib/utils";

/**
 * Share an issued certificate (Nelson, 20 Oct 2026): Add to LinkedIn profile, LinkedIn, X,
 * Facebook, Copy link, Email. A disclosure (Esc / outside click close, focus returns to the
 * trigger) over the DS ShareMenu.
 * - `look="button"`: Button Secondary with the share icon and the word, on the certificate page.
 * - `look="icon"`: an icon-only Button Secondary next to View and Download, on the Certificate card.
 * `up` opens the menu above the trigger (the card's actions sit at the bottom of the card).
 */
export function CertificateShare({
  target,
  look = "button",
  size = "sm",
  up = false,
  className,
}: {
  target: ShareTarget;
  look?: "button" | "icon";
  size?: "sm" | "lg";
  up?: boolean;
  className?: string;
}) {
  const share = useDisclosure();
  const showToast = useLmsStore((s) => s.showToast);

  const onSelect = (channel: ShareChannel) => {
    share.close();
    if (channel === "copy") {
      const url = certificateUrl(target.document);
      navigator.clipboard?.writeText(url).then(
        () => showToast("Link copied"),
        () => showToast(url),
      );
      return;
    }
    const href = shareHref(channel, target);
    if (!href) return;
    if (channel === "email") window.location.href = href;
    else window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <div ref={share.containerRef} className={cn("relative", className)}>
      <Button
        hierarchy="secondary"
        size={size}
        leftIcon={Share2}
        iconOnly={look === "icon"}
        aria-label={look === "icon" ? `Share certificate: ${target.title}` : undefined}
        className={cn(look === "icon" ? "max-md:size-11" : "w-full")}
        {...share.triggerProps}
      >
        {look === "icon" ? null : "Share certificate"}
      </Button>
      {share.open ? (
        <div
          {...share.panelProps}
          className={cn("absolute right-0 z-20", look === "button" && "left-0", up ? "bottom-full mb-1" : "top-full mt-1")}
        >
          <ShareMenu onSelect={onSelect} onClose={share.close} className={look === "button" ? "w-full" : undefined} />
        </div>
      ) : null}
    </div>
  );
}
