import type { Metadata } from "next";
import { PartnerStandIn } from "./View";
import { pageTitle } from "@/lib/utils";

export const metadata: Metadata = { title: pageTitle("Partner lab (stand-in)") };

export default function Page({ params }: { params: { partner: string } }) {
  return <PartnerStandIn partner={params.partner} />;
}
