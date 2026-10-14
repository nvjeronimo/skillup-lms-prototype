/**
 * True when a scroll box is at, or within `slack` px of, the end of its content, or when
 * the content is shorter than the box. The assistant follows a growing conversation only
 * while this holds; once the learner has scrolled up to read, it leaves them there.
 */
export function isNearEnd(scrollTop: number, clientHeight: number, scrollHeight: number, slack = 48): boolean {
  return scrollHeight - (scrollTop + clientHeight) <= slack;
}
