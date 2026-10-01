import * as React from "react";
import { Check } from "lucide-react";
import { SkillUpLogo } from "@/components/atoms/SkillUpLogo";
import type { CertificateDocumentData } from "@/lib/platform/program";
import { cn } from "@/lib/utils";

/* The artwork is an A4 landscape sheet, 1123 × 794 at 96 dpi. It is drawn at that size in
   `em`: the root font-size is 16 design px expressed in container-query units (16 / 1123 of
   the preview's width), so `u(24)` is 24 design px at whatever width the thumbnail has. */
const u = (px: number) => `${px / 16}em`;
const SHEET_FONT_SIZE = `${(16 / 1123) * 100}cqw`;

/* In the dark theme the sheet is dark (it is bound to bg/page), so the fixed-ink artwork
   (signatures, QR) is inverted to stay legible. */
const INK = "[[data-theme=dark]_&]:invert";

/** One line of the sheet: a DS text style's family and weight at a design-px size. */
function Line({
  size,
  leading,
  className,
  children,
}: {
  size: number;
  leading: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={cn("whitespace-nowrap", className)} style={{ fontSize: u(size), lineHeight: leading / size }}>
      {children}
    </p>
  );
}

function Signatory({ name, role, signatureSrc }: CertificateDocumentData["signatories"][number]) {
  return (
    <div className="flex flex-col items-center text-center" style={{ width: u(240), gap: u(6) }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={signatureSrc} alt="" className={INK} style={{ width: u(166), height: u(34) }} />
      <span className="w-full border-t border-sko-border-subtle" />
      <Line size={16} leading={24} className="sk-text-md-semibold text-sko-text-default">
        {name}
      </Line>
      <Line size={14} leading={20} className="sk-text-sm-regular text-sko-text-subtle">
        {role}
      </Line>
    </div>
  );
}

/**
 * DS `LMS / Course Detail / Certificate document` (5774:1195), as the thumbnail of the
 * Certificate card. Visual representation only: the platform renders the real certificate
 * from its own template, so this is one image to assistive tech (`role="img"`) and its small
 * print is not page text. White edge 24, 2px border/primary safe area (padding 40/48/32),
 * header (SkillUp logo · partner), body, signatures + seal, verification strip.
 * Put it in a box with `container-type: inline-size` and the sheet's 1123/794 ratio.
 */
export function CertificateDocument({ data, label }: { data: CertificateDocumentData; label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="flex size-full flex-col bg-sko-bg-page"
      style={{ fontSize: SHEET_FONT_SIZE, padding: u(24) }}
    >
      <div
        aria-hidden
        className="flex min-h-0 flex-1 flex-col justify-between border-sko-border-primary"
        style={{ borderWidth: u(2), padding: `${u(40)} ${u(48)} ${u(32)}` }}
      >
        <div className="flex items-center justify-between">
          <span className="flex" style={{ height: u(40), margin: u(8) }}>
            <SkillUpLogo className="h-full" />
          </span>
          <div className="flex items-center" style={{ gap: u(12) }}>
            <Line size={12} leading={18} className="sk-text-xs-regular text-sko-text-subtle">
              In partnership with
            </Line>
            <span className="flex items-center justify-center" style={{ width: u(104), height: u(41) }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.partnerLogoSrc} alt="" style={{ width: u(75), height: u(28) }} />
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center text-center" style={{ gap: u(12) }}>
          <Line size={12} leading={18} className="sk-text-2xs-semibold text-sko-text-on-primary-soft">
            Certificate of completion
          </Line>
          <span style={{ height: u(8) }} />
          <Line size={18} leading={24} className="sk-text-md-regular text-sko-text-muted">
            This is to certify that
          </Line>
          <Line size={48} leading={60} className="sk-text-display-sm-semibold tracking-[-0.02em] text-sko-text-default">
            {data.learner}
          </Line>
          <span className="bg-sko-bg-primary" style={{ width: u(360), height: u(2) }} />
          <Line size={18} leading={24} className="sk-text-md-regular text-sko-text-muted">
            has successfully completed the professional course
          </Line>
          <Line size={30} leading={38} className="sk-text-display-sm-semibold text-sko-text-on-primary-soft">
            {data.courseTitle}
          </Line>
          <Line size={16} leading={24} className="sk-text-md-regular whitespace-pre text-sko-text-subtle">
            {data.summary}
          </Line>
        </div>

        <div className="flex flex-col" style={{ gap: u(20) }}>
          <div className="flex items-end justify-between">
            {data.signatories[0] ? <Signatory {...data.signatories[0]} /> : null}
            <div className="flex flex-col items-center text-center" style={{ gap: u(8) }}>
              <span
                className="relative flex items-center justify-center rounded-full bg-sko-bg-primary text-sko-icon-on-primary"
                style={{ width: u(88), height: u(88) }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/platform/certificate-seal-ring.png"
                  alt=""
                  className="absolute"
                  style={{ inset: u(8), width: u(72), height: u(72) }}
                />
                <Check strokeWidth={2} style={{ width: u(44), height: u(44) }} />
              </span>
              <Line size={12} leading={18} className="sk-text-2xs-semibold text-sko-text-subtle">
                Issued
              </Line>
              <Line size={16} leading={24} className="sk-text-md-semibold text-sko-text-default">
                {data.issuedOn}
              </Line>
            </div>
            {data.signatories[1] ? <Signatory {...data.signatories[1]} /> : null}
          </div>

          <div
            className="flex items-center justify-between border-t border-sko-border-subtle"
            style={{ paddingTop: u(16) }}
          >
            <div className="flex flex-col items-start" style={{ gap: u(2) }}>
              <Line size={12} leading={18} className="sk-text-2xs-semibold text-sko-text-subtle">
                Certificate ID
              </Line>
              <Line size={12} leading={18} className="sk-text-xs-semibold text-sko-text-default">
                {data.certificateId}
              </Line>
            </div>
            <div className="flex items-center" style={{ gap: u(12) }}>
              <div className="flex flex-col items-end text-right" style={{ gap: u(2) }}>
                <Line size={12} leading={18} className="sk-text-2xs-semibold text-sko-text-subtle">
                  Verify this certificate
                </Line>
                <Line size={12} leading={18} className="sk-text-xs-semibold text-sko-text-on-primary-soft">
                  {data.verifyUrl}
                </Line>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/platform/certificate-qr.svg"
                alt=""
                className={INK}
                style={{ width: u(63), height: u(63) }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
