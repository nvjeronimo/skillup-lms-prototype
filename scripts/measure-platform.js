/**
 * Geometry check of the platform pages against the Figma handoff frames on
 * "Platform Pages - Ready for Dev" (My Learning & Dashboard 6408:35150, Program Page
 * 6728:15050), at the 1280px desktop width. Sizes read from Figma on 8 Oct 2026.
 *
 * How to run: start the app (`pnpm dev`), open any page of it, paste this file in
 * the browser console. It loads each route in an off-screen 1280px iframe, measures
 * the blocks below with getBoundingClientRect and prints a table: Figma size, built
 * size, difference. A screenshot is not needed (and a scaled preview pane cannot be
 * trusted for a few pixels).
 *
 * Update EXPECTED when the Figma frames change. Sizes are width x height in px.
 * Tablet (960) and mobile (375) sizes, for a check by hand (set WIDTH below):
 *   Dashboard: glance 896x160 / 327x252; due items 894x83, 894x82 / 325x149, 325x130;
 *     course row 896x68; resume row 327x136 (144 built: the action is 44 tall on mobile);
 *     jump tile 288x124 / 155x142.
 *   My Learning: stat 200x122 / 109x116; course card 438x352 / 327x340 (368 with a
 *     three-line title); program cards 438x354, 438x350 / 327x340, 327x348 (356 built: the
 *     action is 44 tall on mobile); browse tile 438x352 / 327x160.
 *   Program: header 960x321 / 375x525; tab bar 960x48 / 375x44; course row closed
 *     912x383 / 343x435, open 912x748 / 343x944; FAQ card 560x886 / 343x1094.
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
      ["Glance card", [1200, 168], (d) => d.querySelector("#dashboard-glance-title").closest("section")],
      ["Glance stat", [270, 82], (d) => d.querySelector("#dashboard-glance-title").closest("section").querySelector("li")],
      ["Due item 1", [438, 111], (d) => mock(d, "Due dates come").children[0]],
      ["Due item 2", [438, 92], (d) => mock(d, "Due dates come").children[1]],
      ["Course row (resume)", [728, 68], (d) => all(d, "main li").filter((li) => /Resume/.test(li.textContent))[0]],
      ["Jump tile", [389, 124], (d) => mock(d, "The Discussion count").children[0]],
    ],
    "/platform/my-learning": [
      ["Stat", [200, 122], (d) => d.querySelector("main header li")],
      ["Tabs row height", [null, 48], (d) => d.querySelector("[role=tab]")],
      ["Course card, grid", [384, 360], (d) => all(d, "[role=tabpanel] li")[0]],
      ["Course thumbnail, grid", [86, 86], (d) => all(d, "[role=tabpanel] article img")[0]],
    ],
    "/platform/my-learning?view=list": [
      ["Course card, list", [1200, 152], (d) => all(d, "[role=tabpanel] li")[0]],
      ["Course thumbnail, list", [118, 118], (d) => all(d, "[role=tabpanel] article img")[0]],
    ],
    "/platform/my-learning?tab=programs": [
      ["Program card 1, grid", [384, 370], (d) => all(d, "[role=tabpanel] article")[0]],
      ["Program card 2, grid", [384, 404], (d) => all(d, "[role=tabpanel] article")[1]],
    ],
    "/platform/my-learning?tab=programs&view=list": [
      ["Program card, list", [1200, 280], (d) => all(d, "[role=tabpanel] article")[0]],
    ],
    [PROGRAM]: [
      ["Header band", [1280, 352], (d) => d.querySelector("h1").closest("[data-theme]")],
      ["Tabs", [1200, 48], (d) => d.querySelector("[role=tablist]")],
      ["Course row, closed", [1200, 183], (d) => all(d, "[role=tabpanel] > div > ol > li")[0]],
      ["Course row, open", [1200, 550], (d) => all(d, "[role=tabpanel] > div > ol > li")[1]],
      ["Course card in a row", [1198, 136], (d) => all(d, "[role=tabpanel] article")[0]],
      ["Modules bar", [1198, 45], (d) => all(d, "[role=tabpanel] > div > ol > li")[0].children[2]],
      ["Module row", [1166, 76], (d) => mock(d, "Module durations").children[0]],
    ],
    [`${PROGRAM}?tab=faqs`]: [
      ["FAQ card", [840, 786], (d) => mock(d, "Program FAQs")],
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
