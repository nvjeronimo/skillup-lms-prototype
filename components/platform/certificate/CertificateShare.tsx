"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { DrawnCheck } from "@/components/atoms/DrawnCheck";
import { ShareMenu, type ShareChannel } from "@/components/molecules/ShareMenu";
import { certificateUrl, shareHref, type ShareTarget } from "@/lib/platform/certificate-share";
import { useLmsStore } from "@/lib/store";
import { useDisclosure } from "@/lib/useDisclosure";
import { copiedLabel } from "@/lib/motion/feedback";
import { useCopiedFlash } from "@/lib/motion/useCopiedFlash";
import { cn } from "@/lib/utils";

/**
 * Share an issued certificate (Nelson, 20 Oct 2026): Add to LinkedIn profile, LinkedIn, X,
 * Facebook, Copy link, Email. A disclosure (Esc / outside click close, focus returns to the
 * trigger) over the DS ShareMenu.
 * - `look="button"`: Button Secondary with the share icon and the word, on the certificate page.
 * - `look="icon"`: an icon-only Button Secondary next to View and Download, on the Certificate card.
 * `up` opens the menu above the trigger (the card's actions sit at the bottom of the card).
 * After a successful Copy link the trigger's icon turns into a check that draws and its label
 * (the word, or the icon button's aria-label) says "Copied" for COPIED_MS (motion-matrix §7.9).
 * The toast says "Link copied" once (its polite status region): no second live region here.
 * A failed copy keeps the old behaviour: the toast shows the link to copy by hand.
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
  const { copied, flash } = useCopiedFlash();

  const onSelect = (channel: ShareChannel) => {
    share.close();
    if (channel === "copy") {
      const url = certificateUrl(target.document);
      navigator.clipboard?.writeText(url).then(
        () => {
          flash();
          showToast("Link copied");
        },
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
        leftIcon={copied ? DrawnCheck : Share2}
        iconOnly={look === "icon"}
        aria-label={
          look === "icon" ? copiedLabel(copied, `Share certificate: ${target.title}`) : undefined
        }
        className={cn(look === "icon" ? "max-md:size-11" : "w-full")}
        {...share.triggerProps}
      >
        {look === "icon" ? null : copiedLabel(copied, "Share certificate")}
      </Button>
      {share.mounted ? (
        <div
          {...share.panelProps}
          className={cn(
            "absolute right-0 z-20",
            look === "button" && "left-0",
            // Grows out of the button: upward from its top edge, or down from its bottom edge.
            up ? "sk-animate-menu-up bottom-full mb-1" : "sk-animate-menu top-full mt-1",
            look === "button"
              ? up
                ? "origin-bottom"
                : "origin-top"
              : up
                ? "origin-bottom-right"
                : "origin-top-right",
          )}
        >
          <ShareMenu
            onSelect={onSelect}
            onClose={share.close}
            className={look === "button" ? "w-full" : undefined}
          />
        </div>
      ) : null}
    </div>
  );
}
