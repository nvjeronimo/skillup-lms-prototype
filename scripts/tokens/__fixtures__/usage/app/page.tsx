export default function Page({ r }: { r: string }) {
  return (
    <div className="text-sko-text-default" style={{ borderRadius: `var(--sk-radius-${r})` }} />
  );
}
