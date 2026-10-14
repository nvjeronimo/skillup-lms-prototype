/**
 * The topic body comes in on every topic and tab change (a fade and a 4px nudge). Next mounts
 * a template afresh on each navigation, inside the layout: the player shell (top bar,
 * sidebar, footer) lives in that layout and the sidebar restores its own scroll position.
 */
export default function TopicTemplate({ children }: { children: React.ReactNode }) {
  return <div className="sk-animate-page">{children}</div>;
}
