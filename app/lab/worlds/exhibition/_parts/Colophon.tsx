import { MockTag } from "@/components/lab/MockTag";

/** The page's one MockTag, at the foot, on plaster — like the small print by the gallery door. */
export function Colophon({ reason }: { reason: string }) {
  if (!reason) return null;
  return (
    <div className="ex-plaster">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-6 md:px-10">
        <MockTag layout="block" reason={reason} />
      </div>
    </div>
  );
}
