import type { ShareChannel } from "@/components/molecules/ShareMenu";
import type { CertificateDocumentData } from "./program";

/**
 * Where each share channel goes for an issued certificate (Nelson, 20 Oct 2026: share the
 * certificate on social networks). The address shared is the certificate's verification
 * page (Open edX serves it at /certificates/{verify_uuid}). Nothing is posted by the
 * platform: each channel opens the network's own share or "add certification" form in a new tab.
 */
export interface ShareTarget {
  title: string;
  document: CertificateDocumentData;
}

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

export function certificateUrl(doc: CertificateDocumentData): string {
  return doc.verifyUrl.startsWith("http") ? doc.verifyUrl : `https://${doc.verifyUrl}`;
}

/** "30 September 2026" → { year: 2026, month: 9 }. */
function issued(doc: CertificateDocumentData): { year?: number; month?: number } {
  const [, monthName, year] = doc.issuedOn.split(" ");
  const month = MONTHS.indexOf((monthName ?? "").toLowerCase()) + 1;
  return { year: Number(year) || undefined, month: month || undefined };
}

/** The address a channel opens, or null for the ones handled in the page (copy). */
export function shareHref(channel: ShareChannel, target: ShareTarget): string | null {
  const url = certificateUrl(target.document);
  const text = `I earned the ${target.title} certificate on SkillUp Online.`;
  const e = encodeURIComponent;
  switch (channel) {
    case "linkedin-profile": {
      const { year, month } = issued(target.document);
      const q = new URLSearchParams({
        startTask: "CERTIFICATION_NAME",
        name: target.title,
        organizationName: "SkillUp Online",
        certUrl: url,
        certId: target.document.certificateId,
      });
      if (year) q.set("issueYear", String(year));
      if (month) q.set("issueMonth", String(month));
      return `https://www.linkedin.com/profile/add?${q.toString()}`;
    }
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${e(url)}`;
    case "twitter":
      return `https://x.com/intent/post?text=${e(text)}&url=${e(url)}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${e(url)}`;
    case "email":
      return `mailto:?subject=${e(`My ${target.title} certificate`)}&body=${e(`${text}\n\n${url}`)}`;
    default:
      return null;
  }
}
