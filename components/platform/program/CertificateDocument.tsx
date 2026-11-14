import * as React from "react";
import { Check } from "lucide-react";
import { SkillUpLogo } from "@/components/atoms/SkillUpLogo";
import type { CertificateDocumentData } from "@/lib/platform/program";
import { platformUser } from "@/lib/platform/user";
import { cn } from "@/lib/utils";
import styles from "./CertificateDocument.module.css";

/* The artwork is an A4 landscape sheet, 1123 × 794 at 96 dpi. It is drawn at that size in
   `em`: the root font-size is 16 design px expressed in container-query units (16 / 1123 of
   the preview's width), so `u(24)` is 24 design px at whatever width the thumbnail has. */
const u = (px: number) => `${px / 16}em`;
const SHEET_FONT_SIZE = `${(16 / 1123) * 100}cqw`;

/* In the dark theme the sheet is dark (it is bound to bg/page), so the fixed-ink artwork
   (signatures, QR) is inverted to stay legible. */
const INK = styles.ink;

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
    <p className={cn(styles.line, className)} style={{ fontSize: u(size), lineHeight: leading / size }}>
      {children}
    </p>
  );
}

function Signatory({ name, role, signatureSrc }: CertificateDocumentData["signatories"][number]) {
  return (
    <div className={styles.centered} style={{ width: u(240), gap: u(6) }}>
      <img src={signatureSrc} alt="" className={INK} style={{ width: u(166), height: u(34) }} />
      <span className={styles.signatureRule} />
      <Line size={16} leading={24} className={`sk-text-body-large-semibold ${styles.textDefault}`}>
        {name}
      </Line>
      <Line size={14} leading={20} className={`sk-text-body-medium-regular ${styles.textSubtle}`}>
        {role}
      </Line>
    </div>
  );
}

/* The seal's engraved ring, drawn rather than shipped as a raster (the PNG it replaced was never
   committed): a fine outer and inner line with 60 radial ticks between them, in the seal's own
   ink (`currentColor`, icon/on-primary), so it follows every skin and theme. Decorative. */
const SEAL_TICKS = Array.from({ length: 60 }, (_, i) => (i * 360) / 60);

function SealRing({ style }: { style: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true" focusable="false" className={styles.sealRing} style={style}>
      <g fill="none" stroke="currentColor" opacity={0.6}>
        <circle cx="36" cy="36" r="35" strokeWidth="1" />
        <circle cx="36" cy="36" r="29.5" strokeWidth="0.75" />
        {SEAL_TICKS.map((deg) => (
          <line key={deg} x1="36" y1="2.5" x2="36" y2="5.5" strokeWidth="0.75" transform={`rotate(${deg} 36 36)`} />
        ))}
      </g>
    </svg>
  );
}

/** The name on the sheet: the certificate's own or, left out, the signed-in learner (`user`). */
export const certificateLearner = (data: CertificateDocumentData) => data.learner ?? platformUser.name;

/**
 * DS `LMS / Course Detail / Certificate document` (5774:1195), as the thumbnail of the
 * Certificate card. Visual representation only: the platform renders the real certificate
 * from its own template, so this is one image to assistive tech (`role="img"`) and its small
 * print is not page text. White edge 24, 2px border/primary safe area (padding 40/48/32),
 * header (SkillUp logo · partner), body, signatures + seal, verification strip.
 * Put it in a box with `container-type: inline-size` and the sheet's 1123/794 ratio.
 *
 * Since 10 Oct 2026 (proposal): the partner block is printed only when the certificate has a
 * partner, the learner defaults to the signed-in learner, and `kind: "program"` changes the
 * sentence above the title.
 */
export function CertificateDocument({ data, label }: { data: CertificateDocumentData; label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      // The sheet is a printed document: it keeps its light colours in dark mode (Nelson, 20 Oct 2026).
      data-theme="light"
      className={styles.sheet}
      style={{ fontSize: SHEET_FONT_SIZE, padding: u(24) }}
    >
      <div
        aria-hidden
        className={styles.frame}
        style={{ borderWidth: u(2), padding: `${u(40)} ${u(48)} ${u(32)}` }}
      >
        <div className={styles.top}>
          <span className={styles.logoBox} style={{ height: u(40), margin: u(8) }}>
            <SkillUpLogo className={styles.logo} />
          </span>
          {data.partnerLogoSrc ? (
            <div className={styles.partners} style={{ gap: u(12) }}>
              <Line size={12} leading={18} className={`sk-text-body-small-regular ${styles.textSubtle}`}>
                In partnership with
              </Line>
              <span className={styles.logoSlot} style={{ width: u(104), height: u(41) }}>
                <img src={data.partnerLogoSrc} alt="" style={{ width: u(75), height: u(28) }} />
              </span>
              {(data.morePartners ?? []).map((p) => (
                <span key={p.name} className={styles.logoSlot} style={{ width: u(104), height: u(41) }}>
                  <img src={p.logoSrc} alt="" style={{ width: u(75), height: u(28), objectFit: "contain" }} />
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className={styles.centered} style={{ gap: u(12) }}>
          <Line size={12} leading={18} className={`sk-text-label-small-semibold ${styles.textOnPrimarySoft}`}>
            Certificate of completion
          </Line>
          <span style={{ height: u(8) }} />
          <Line size={18} leading={24} className={`sk-text-body-large-regular ${styles.textMuted}`}>
            This is to certify that
          </Line>
          <Line size={48} leading={60} className={`sk-text-headline-medium-semibold ${styles.tight} ${styles.textDefault}`}>
            {certificateLearner(data)}
          </Line>
          <span className={styles.nameRule} style={{ width: u(360), height: u(2) }} />
          <Line size={18} leading={24} className={`sk-text-body-large-regular ${styles.textMuted}`}>
            {data.kind === "program"
              ? "has successfully completed the certificate program"
              : "has successfully completed the professional course"}
          </Line>
          <Line size={30} leading={38} className={`sk-text-headline-medium-semibold ${styles.textOnPrimarySoft}`}>
            {data.courseTitle}
          </Line>
          <Line size={16} leading={24} className={`sk-text-body-large-regular ${styles.pre} ${styles.textSubtle}`}>
            {data.summary}
          </Line>
        </div>

        <div className={styles.bottom} style={{ gap: u(20) }}>
          <div className={styles.signatures}>
            {data.signatories[0] ? <Signatory {...data.signatories[0]} /> : null}
            <div className={styles.centered} style={{ gap: u(8) }}>
              <span
                className={styles.seal}
                style={{ width: u(88), height: u(88) }}
              >
                <SealRing style={{ inset: u(8), width: u(72), height: u(72) }} />
                <Check strokeWidth={2} style={{ width: u(44), height: u(44) }} />
              </span>
              <Line size={12} leading={18} className={`sk-text-label-small-semibold ${styles.textSubtle}`}>
                Issued
              </Line>
              <Line size={16} leading={24} className={`sk-text-body-large-semibold ${styles.textDefault}`}>
                {data.issuedOn}
              </Line>
            </div>
            {data.signatories[1] ? <Signatory {...data.signatories[1]} /> : null}
          </div>

          <div
            className={styles.strip}
            style={{ paddingTop: u(16) }}
          >
            <div
              data-invented="certificate: Open edX identifies it by its verify UUID, no readable ID"
              className={styles.idBlock}
              style={{ gap: u(2) }}
            >
              <Line size={12} leading={18} className={`sk-text-label-small-semibold ${styles.textSubtle}`}>
                Certificate ID
              </Line>
              <Line size={12} leading={18} className={`sk-text-body-small-semibold ${styles.textDefault}`}>
                {data.certificateId}
              </Line>
            </div>
            {/* ml-auto keeps it on the right when the ID beside it is hidden (Open edX scope). */}
            <div className={styles.verify} style={{ gap: u(12) }}>
              <div className={styles.verifyText} style={{ gap: u(2) }}>
                <Line size={12} leading={18} className={`sk-text-label-small-semibold ${styles.textSubtle}`}>
                  Verify this certificate
                </Line>
                <Line size={12} leading={18} className={`sk-text-body-small-semibold ${styles.textOnPrimarySoft}`}>
                  {data.verifyUrl}
                </Line>
              </div>
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
