/**
 * Geometry check of the platform pages against the Figma frames (ICP Phase 1,
 * sections 6374:16005 and 6443:18721), at the 1280px desktop width.
 *
 * How to run: start the app (`pnpm dev`), open any page of it, paste this file in
 * the browser console. It loads each route in an off-screen 1280px iframe, measures
 * the blocks below with getBoundingClientRect and prints a table: Figma size, built
 * size, difference. A screenshot is not needed (and a scaled preview pane cannot be
 * trusted for a few pixels).
 *
 * Update EXPECTED when the Figma frames change. Sizes are width x height in px.
 */
(async () => {
  const WIDTH = 1280;
  const PROGRAM = "/platform/program/ai-driven-digital-marketing";

  const size = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return [Math.round(r.width), Math.round(r.height)];
  };
  /** Elements matching `sel` that are actually rendered (a hidden tab panel keeps its markup). */
  const all = (doc, sel) => [...doc.querySelectorAll(sel)].filter((el) => el.getBoundingClientRect().height > 0);
  const mock = (doc, starts) => doc.querySelector(`[data-mock^="${starts}"]`);

  /** route → list of [name, Figma [w, h], (doc) => element]. */
  const EXPECTED = {
    "/platform/dashboard": [
      ["Top bar", [1280, 72], (d) => d.querySelector("header")],
      ["Glance card", [808, 274], (d) => mock(d, "No API for lessons")],
      ["Streak card", [360, 274], (d) => mock(d, "Streak")],
      ["Due item 1", [458, 111], (d) => mock(d, "No API for due dates").children[0]],
      ["Due item 2", [458, 83], (d) => mock(d, "No API for due dates").children[1]],
      ["Due item 3", [458, 110], (d) => mock(d, "No API for due dates").children[2]],
      ["Course row (resume)", [708, 68], (d) => all(d, "main li").filter((li) => /Resume/.test(li.textContent))[0]],
      ["Jump tile", [288, 124], (d) => mock(d, "Counts and mentor").children[0]],
    ],
    "/platform/my-learning": [
      ["Stat", [200, 122], (d) => mock(d, "Daily goals").children[0]],
      ["Tabs row height", [null, 48], (d) => d.querySelector("[role=tab]")],
      ["Course card, grid", [384, 358], (d) => all(d, "[role=tabpanel] li")[0]],
    ],
    "/platform/my-learning?view=list": [
      ["Course card, list", [1200, 152], (d) => all(d, "[role=tabpanel] li")[0]],
    ],
    "/platform/my-learning?tab=programs": [
      ["Program card 1, grid", [384, 370], (d) => all(d, "[data-mock^='Program weeks']")[0]],
      ["Program card 2, grid", [384, 404], (d) => all(d, "[data-mock^='Program weeks']")[1]],
    ],
    "/platform/my-learning?tab=programs&view=list": [
      ["Program card, list", [1200, 280], (d) => all(d, "[data-mock^='Program weeks']")[0]],
    ],
    [PROGRAM]: [
      ["Header band", [1280, 352], (d) => d.querySelector("h1").closest("[data-theme]")],
      ["Tabs", [1200, 48], (d) => d.querySelector("[role=tablist]")],
      ["Course row, closed", [840, 76], (d) => mock(d, "Course intro").children[0]],
      ["Course row, open", [840, 321], (d) => mock(d, "Course intro").children[1]],
      ["Program dates", [320, 257], (d) => mock(d, "Program dates")],
      ["What's included", [320, 218], (d) => mock(d, "Content counts")],
      ["Program instructor", [320, 122], (d) => mock(d, "No instructor")],
    ],
  };

  const load = (url) =>
    new Promise((resolve) => {
      const frame = document.createElement("iframe");
      frame.style.cssText = `position:fixed;left:-99999px;top:0;border:0;width:${WIDTH}px;height:1600px`;
      frame.onload = () => setTimeout(() => resolve(frame), 2500); // let the client render settle
      frame.src = url;
      document.body.appendChild(frame);
    });

  const rows = [];
  for (const [route, checks] of Object.entries(EXPECTED)) {
    const frame = await load(route);
    const doc = frame.contentDocument;
    for (const [name, figma, find] of checks) {
      let built = null;
      try {
        built = size(find(doc));
      } catch {
        /* element not found: reported below */
      }
      const diff = built
        ? [figma[0] === null ? 0 : built[0] - figma[0], built[1] - figma[1]]
        : null;
      rows.push({
        route,
        block: name,
        figma: `${figma[0] ?? "–"}x${figma[1]}`,
        built: built ? `${figma[0] === null ? "–" : built[0]}x${built[1]}` : "NOT FOUND",
        diff: diff ? `${diff[0] >= 0 ? "+" : ""}${diff[0]} / ${diff[1] >= 0 ? "+" : ""}${diff[1]}` : "",
      });
    }
    frame.remove();
  }
  console.table(rows);
  return rows;
})();
