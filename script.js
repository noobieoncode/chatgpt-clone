const STORAGE_KEY = "css-lab-progress-v1";

const courseOrder = [
  "CSS Fundamentals", "Selectors", "Box Model", "Typography", "Display", "Flexbox", "Grid", "Positioning",
  "Responsive Design", "Transitions & Animations", "Advanced CSS"
];

const detailedLessons = [
  {
    id: "display", category: "Display", property: "display", description: "Controls how an element participates in layout.",
    syntax: "display: value;", values: ["block", "inline", "inline-block", "flex", "grid", "none"],
    valueNotes: {
      block: "Takes full row width and starts on a new line.",
      inline: "Stays in text flow and ignores width/height.",
      "inline-block": "Sits inline but can use width and height.",
      flex: "Turns children into flex items.",
      grid: "Turns children into grid items.",
      none: "Hides the element from layout and view."
    },
    htmlExample: `<div class="container"><div class="box">One</div><div class="box">Two</div><div class="box">Three</div></div>`,
    cssExample: `.container { display: flex; gap: 12px; }\n.box { background: royalblue; color: white; padding: 14px; border-radius: 8px; }`,
    beginnerExplanation: "display is like choosing each element's role in a stage layout.",
    commonMistake: "Using display:inline and expecting width/height to work.",
    usedWith: "Works with width, gap, justify-content, align-items.",
    related: ["justify-content", "align-items", "grid-template-columns"]
  },
  {
    id: "justify-content", category: "Flexbox", property: "justify-content", description: "Distributes flex/grid items along the main axis.",
    syntax: "justify-content: value;", values: ["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"],
    valueNotes: {
      "flex-start": "All items hug the start edge.",
      "flex-end": "All items move to the end edge.",
      center: "Items group in the center.",
      "space-between": "Equal space between items, edges stay flush.",
      "space-around": "Items get space on both sides.",
      "space-evenly": "Equal spacing everywhere, including edges."
    },
    htmlExample: `<div class="row"><div>A</div><div>B</div><div>C</div></div>`,
    cssExample: `.row { display:flex; justify-content: space-between; border:1px dashed #93a5cf; padding: 10px; }\n.row div { background:#4f8cff; color:white; padding: 10px; border-radius:6px; }`,
    beginnerExplanation: "It decides where extra free space goes on the row/column.",
    commonMistake: "Using justify-content when there is no free space left.",
    usedWith: "display:flex, flex-direction, gap.",
    related: ["align-items", "place-content", "gap"]
  },
  {
    id: "align-items", category: "Flexbox", property: "align-items", description: "Aligns items across the cross axis.",
    syntax: "align-items: value;", values: ["stretch", "flex-start", "flex-end", "center", "baseline"],
    valueNotes: {
      stretch: "Items stretch to fill the cross size.",
      "flex-start": "Items align to cross-axis start.",
      "flex-end": "Items align to cross-axis end.",
      center: "Items align in the middle.",
      baseline: "Text baselines line up."
    },
    htmlExample: `<div class="row"><div class="a">A</div><div class="b">Big B</div><div class="c">C</div></div>`,
    cssExample: `.row { display:flex; gap:10px; align-items:center; border:1px dashed #93a5cf; padding:8px; min-height:100px; }\n.row div { background:#7c3aed; color:white; padding:8px; border-radius:6px; }\n.b { font-size:1.3rem; }`,
    beginnerExplanation: "Cross axis means top-to-bottom in a row layout.",
    commonMistake: "Expecting align-items to center horizontally in a row.",
    usedWith: "display:flex or grid.",
    related: ["justify-content", "align-self", "place-items"]
  },
  {
    id: "grid-template-columns", category: "Grid", property: "grid-template-columns", description: "Defines column tracks in a grid container.",
    syntax: "grid-template-columns: value;", values: ["1fr 1fr", "200px 1fr", "repeat(3, 1fr)", "repeat(auto-fit, minmax(120px, 1fr))"],
    valueNotes: {
      "1fr 1fr": "Two equal columns.",
      "200px 1fr": "Fixed first column plus flexible second.",
      "repeat(3, 1fr)": "Three equal columns quickly.",
      "repeat(auto-fit, minmax(120px, 1fr))": "Responsive columns that wrap automatically."
    },
    htmlExample: `<div class="grid"><div>1</div><div>2</div><div>3</div><div>4</div></div>`,
    cssExample: `.grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }\n.grid div { background:#0ea5e9; color:white; padding: 15px; border-radius:8px; text-align:center; }`,
    beginnerExplanation: "You draw the column blueprint before placing items.",
    commonMistake: "Forgetting display:grid, so columns never apply.",
    usedWith: "display:grid, gap, grid-column.",
    related: ["grid-template-rows", "repeat()", "minmax()"]
  },
  {
    id: "position", category: "Positioning", property: "position", description: "Chooses how an element is positioned in the page flow.",
    syntax: "position: value;", values: ["static", "relative", "absolute", "fixed", "sticky"],
    valueNotes: {
      static: "Default: follows normal layout.",
      relative: "Keeps original space, then shifts visually.",
      absolute: "Removed from normal flow and anchored to nearest positioned ancestor.",
      fixed: "Anchored to viewport.",
      sticky: "Acts relative until a scroll threshold, then sticks."
    },
    htmlExample: `<div class="stage"><div class="anchor">Anchor<div class="dot">Dot</div></div></div>`,
    cssExample: `.stage { height:140px; border:1px dashed #9aaad0; padding: 12px; }\n.anchor { position:relative; height:100px; background:#e2e8f033; }\n.dot { position:absolute; top:10px; right:10px; background:#ef4444; color:white; padding:6px 10px; border-radius:999px; }`,
    beginnerExplanation: "position changes who controls an element's coordinates.",
    commonMistake: "Using top/left on static elements.",
    usedWith: "top/right/bottom/left, inset, z-index.",
    related: ["top", "z-index", "inset"]
  },
  {
    id: "padding", category: "Box Model", property: "padding", description: "Space inside an element, between content and border.",
    syntax: "padding: value;", values: ["4px", "16px", "1rem 2rem", "2%"],
    valueNotes: {
      "4px": "Small internal breathing room.",
      "16px": "Comfortable default spacing.",
      "1rem 2rem": "Top/bottom then left/right spacing.",
      "2%": "Padding scales with parent width."
    },
    htmlExample: `<button class="primary-btn">Primary Button</button>`,
    cssExample: `.primary-btn { background:#2563eb; color:white; border:0; border-radius:8px; padding: 10px 20px; }`,
    beginnerExplanation: "padding is inner cushion around content.",
    commonMistake: "Confusing padding (inside) with margin (outside).",
    usedWith: "border, width, box-sizing.",
    related: ["margin", "border", "box-sizing"]
  },
  {
    id: "color", category: "Colors", property: "color", description: "Sets the text color.",
    syntax: "color: value;", values: ["#2563eb", "rgb(220, 38, 38)", "hsl(160 84% 39%)", "lch(60% 60 30)"],
    valueNotes: {
      "#2563eb": "Hex notation for blue.",
      "rgb(220, 38, 38)": "Red/green/blue channels.",
      "hsl(160 84% 39%)": "Hue/saturation/lightness form.",
      "lch(60% 60 30)": "Modern color space with perceptual lightness/chroma/hue."
    },
    htmlExample: `<p class="text">CSS colors can be expressive and precise.</p>`,
    cssExample: `.text { color: hsl(221 83% 53%); font-size: 1.2rem; }`,
    beginnerExplanation: "color paints letters, not backgrounds.",
    commonMistake: "Changing color and expecting box background to change.",
    usedWith: "background-color, color-mix(), opacity.",
    related: ["background-color", "color-mix()", "opacity"]
  },
  {
    id: "font-size", category: "Typography", property: "font-size", description: "Controls text size.",
    syntax: "font-size: value;", values: ["14px", "1rem", "2vw", "clamp(1rem, 2vw, 2rem)"],
    valueNotes: {
      "14px": "Fixed pixel size.",
      "1rem": "Relative to root font size.",
      "2vw": "Scales with viewport width.",
      "clamp(1rem, 2vw, 2rem)": "Fluid size with minimum and maximum guardrails."
    },
    htmlExample: `<p class="copy">Readable text scales the design.</p>`,
    cssExample: `.copy { font-size: clamp(1rem, 2.6vw, 2rem); line-height: 1.4; }`,
    beginnerExplanation: "font-size sets the baseline scale for text and em units.",
    commonMistake: "Using tiny px values that hurt readability.",
    usedWith: "line-height, rem, clamp().",
    related: ["line-height", "clamp()", "rem"]
  },
  {
    id: "transform", category: "Transforms", property: "transform", description: "Moves, rotates, scales, or skews an element visually.",
    syntax: "transform: function();", values: ["translateX(20px)", "scale(1.2)", "rotate(15deg)", "skew(10deg)"],
    valueNotes: {
      "translateX(20px)": "Shift right by 20px.",
      "scale(1.2)": "Grow to 120% size.",
      "rotate(15deg)": "Rotate clockwise.",
      "skew(10deg)": "Slant the box."
    },
    htmlExample: `<div class="shape">Transform me</div>`,
    cssExample: `.shape { display:inline-block; background:#14b8a6; color:white; padding:12px; border-radius:8px; transform: rotate(8deg); }`,
    beginnerExplanation: "transform changes appearance without changing normal document flow space.",
    commonMistake: "Trying to animate left/top when transform is smoother.",
    usedWith: "transition, transform-origin.",
    related: ["transition", "translate", "rotate"]
  }
];

const coverageMap = {
  "CSS Basics": ["color", "background-color", "width", "height", "display"],
  "Selectors": ["*", "type selector", ".class", "#id", "[attr]", "descendant", "child (>)", "adjacent sibling (+)", "general sibling (~)", "grouping", ":hover", ":active", ":focus", ":focus-visible", ":checked", ":disabled", ":enabled", ":first-child", ":last-child", ":nth-child()", ":nth-of-type()", ":not()", ":is()", ":where()", ":has()"],
  "Colors": ["Hex", "RGB", "RGBA", "HSL", "HSLA", "HWB", "Lab", "LCH", "color-mix()"],
  "Typography": ["font-family", "font-size", "font-weight", "font-style", "font-variant", "font-stretch", "line-height", "letter-spacing", "word-spacing", "text-align", "text-indent", "text-transform", "text-decoration", "text-shadow", "white-space", "word-break", "overflow-wrap", "hyphens", "text-overflow"],
  "Box Model": ["width", "height", "min-width", "max-width", "min-height", "max-height", "margin", "padding", "border", "border-width", "border-style", "border-color", "border-radius", "box-sizing", "box-shadow", "outline"],
  "Display": ["display", "block", "inline", "inline-block", "none", "flex", "inline-flex", "grid", "inline-grid", "table", "contents"],
  "Flexbox": ["flex-direction", "flex-wrap", "flex-flow", "justify-content", "align-items", "align-content", "align-self", "gap", "row-gap", "column-gap", "order", "flex-grow", "flex-shrink", "flex-basis", "flex"],
  "Grid": ["grid-template-columns", "grid-template-rows", "grid-template-areas", "grid-column", "grid-row", "grid-column-start", "grid-column-end", "grid-row-start", "grid-row-end", "grid-area", "place-items", "place-content", "place-self", "auto-fit", "auto-fill", "minmax()", "repeat()", "fr"],
  "Positioning": ["position", "top", "right", "bottom", "left", "inset", "z-index", "static", "relative", "absolute", "fixed", "sticky"],
  "Sizing": ["aspect-ratio", "object-fit", "object-position", "min()", "max()", "clamp()"],
  "Spacing": ["margin-inline", "margin-block", "padding-inline", "padding-block", "gap"],
  "Borders": ["solid", "dashed", "dotted", "double", "border-image", "logical borders"],
  "Backgrounds": ["background", "background-image", "linear-gradient()", "radial-gradient()", "conic-gradient()", "background-size", "background-position", "background-repeat", "background-attachment", "multiple backgrounds"],
  "Transforms": ["translate", "translateX", "translateY", "translateZ", "scale", "rotate", "skew", "transform-origin"],
  "Transitions": ["transition", "transition-property", "transition-duration", "transition-delay", "transition-timing-function"],
  "Animations": ["@keyframes", "animation-name", "animation-duration", "animation-delay", "animation-iteration-count", "animation-direction", "animation-fill-mode", "animation-play-state", "animation-timing-function", "animation"],
  "Shadows": ["box-shadow", "text-shadow"],
  "Overflow": ["overflow", "overflow-x", "overflow-y", "clip", "overflow-wrap", "text-overflow"],
  "Lists": ["list-style", "list-style-type", "list-style-position", "list-style-image"],
  "Tables": ["table-layout", "border-collapse", "border-spacing", "caption-side"],
  "Forms": ["input", "textarea", "select", "button", "checkbox", "radio", "placeholder styling"],
  "Images": ["object-fit", "object-position", "aspect-ratio"],
  "Pseudo-classes": [":hover", ":focus", ":checked", ":disabled", ":enabled", ":not()", ":has()"],
  "Pseudo-elements": ["::before", "::after", "::placeholder", "::marker", "::selection"],
  "Functions": ["calc()", "min()", "max()", "clamp()", "var()", "url()", "rgb()", "hsl()", "color-mix()", "minmax()", "repeat()", "fit-content()"],
  "Variables": [":root", "--custom-property", "var()"],
  "Responsive Design": ["media queries", "breakpoints", "responsive units", "fluid typography", "responsive grids", "mobile-first"],
  "Media Queries": ["@media", "max-width", "min-width", "prefers-reduced-motion"],
  "Container Queries": ["container-type", "container-name", "@container"],
  "Logical Properties": ["margin-inline", "margin-block", "padding-inline", "padding-block", "inset-inline", "inset-block", "border-inline", "border-block"],
  "Modern CSS": ["@layer", "@supports", "@property", "nesting", "subgrid", ":has()", "modern color functions"],
  "Miscellaneous": ["opacity", "visibility", "cursor", "pointer-events", "user-select", "resize"]
};

const genericHtml = `<div class="demo-target">Demo element</div>`;
const genericCss = `.demo-target {\n  background: #4f8cff;\n  color: #fff;\n  padding: 12px;\n  border-radius: 8px;\n}`;

const generatedLessons = Object.entries(coverageMap).flatMap(([category, topics]) =>
  topics.map((topic) => {
    const id = `${category}-${topic}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return {
      id,
      category,
      property: topic,
      description: `Learn what ${topic} changes and how it affects HTML elements visually.`,
      syntax: `${topic}: value;`,
      values: [],
      valueNotes: {},
      htmlExample: genericHtml,
      cssExample: genericCss,
      beginnerExplanation: `${topic} changes how selected HTML elements are rendered.`,
      commonMistake: `Applying ${topic} to the wrong selector or expecting unrelated properties to change.`,
      usedWith: "Selectors, units, and layout context.",
      related: []
    };
  })
);

const lessonMap = new Map();
[...detailedLessons, ...generatedLessons].forEach((lesson) => {
  if (!lessonMap.has(lesson.property)) lessonMap.set(lesson.property, lesson);
});
const lessons = [...lessonMap.values()];

const challenges = [
  {
    id: "center-box",
    title: "Challenge: Center the box",
    goal: "Horizontally and vertically center .box.",
    html: `<div class="stage"><div class="box">Center me</div></div>`,
    starterCss: `.stage { height: 180px; border: 1px dashed #7d8fb7; }\n.box { width: 90px; height: 90px; background:#2563eb; color:white; }`,
    check: (css) => {
      const c = css.toLowerCase().replace(/\s+/g, " ");
      return (c.includes("display:flex") && c.includes("justify-content:center") && c.includes("align-items:center")) ||
      (c.includes("display:grid") && c.includes("place-items:center"));
    },
    explain: "Centering needs both horizontal and vertical alignment context on the parent."
  },
  {
    id: "responsive-grid",
    title: "Challenge: Responsive cards",
    goal: "Make cards auto-fit across widths with a minimum card width.",
    html: `<div class="cards"><div>1</div><div>2</div><div>3</div><div>4</div></div>`,
    starterCss: `.cards { display:grid; gap: 10px; }\n.cards div { background:#0ea5e9; color:white; padding: 12px; }`,
    check: (css) => /grid-template-columns\s*:\s*repeat\s*\(\s*auto-(fit|fill)\s*,\s*minmax\s*\(/i.test(css),
    explain: "repeat(auto-fit|minmax()) creates fluid, responsive columns."
  }
];

const quizzes = [
  {
    id: "q-flex-main-axis",
    q: "Which property controls main-axis distribution in flexbox?",
    options: ["align-items", "justify-content", "text-align", "place-items"],
    answer: 1,
    why: "justify-content distributes free space on the main axis."
  },
  {
    id: "q-box-model",
    q: "Which is inside the border: margin or padding?",
    options: ["margin", "padding", "both", "neither"],
    answer: 1,
    why: "Padding is inner space; margin is outside the border."
  }
];

let state = {
  completed: [],
  bookmarks: [],
  currentLesson: lessons[0]?.id,
  quizScores: {},
  challengeDone: [],
  theme: "dark"
};

const els = {
  landing: document.getElementById("landing"),
  app: document.getElementById("app"),
  quickCss: document.getElementById("quickCss"),
  quickPreview: document.getElementById("quickPreview"),
  startLearningBtn: document.getElementById("startLearningBtn"),
  exploreBtn: document.getElementById("exploreBtn"),
  searchInput: document.getElementById("searchInput"),
  categoryList: document.getElementById("categoryList"),
  lessonPanel: document.getElementById("lessonPanel"),
  htmlEditor: document.getElementById("htmlEditor"),
  cssEditor: document.getElementById("cssEditor"),
  htmlLines: document.getElementById("htmlLines"),
  cssLines: document.getElementById("cssLines"),
  styledPreview: document.getElementById("styledPreview"),
  unstyledPreview: document.getElementById("unstyledPreview"),
  cssError: document.getElementById("cssError"),
  runCode: document.getElementById("runCode"),
  resetCode: document.getElementById("resetCode"),
  copyHtml: document.getElementById("copyHtml"),
  copyCss: document.getElementById("copyCss"),
  viewportRange: document.getElementById("viewportRange"),
  valueExplorer: document.getElementById("valueExplorer"),
  boxModelLab: document.getElementById("boxModelLab"),
  challengeLab: document.getElementById("challengeLab"),
  quizLab: document.getElementById("quizLab"),
  progressBar: document.getElementById("progressBar"),
  progressPercent: document.getElementById("progressPercent"),
  themeToggle: document.getElementById("themeToggle"),
  propertyInsert: document.getElementById("propertyInsert"),
  insertProperty: document.getElementById("insertProperty"),
  mobileMenuBtn: document.getElementById("mobileMenuBtn"),
  sidebar: document.getElementById("sidebar"),
  previewDialog: document.getElementById("previewDialog"),
  fullscreenPreview: document.getElementById("fullscreenPreview"),
  dialogPreview: document.getElementById("dialogPreview"),
  courseFlow: document.getElementById("courseFlow"),
  functionsLab: document.getElementById("functionsLab")
};

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try { state = { ...state, ...JSON.parse(raw) }; } catch {}
}

function setTheme(theme) {
  state.theme = theme;
  document.body.classList.toggle("light", theme === "light");
  els.themeToggle.textContent = theme === "light" ? "🌞" : "🌙";
  saveState();
}

function updateProgress() {
  const pct = Math.round((state.completed.length / lessons.length) * 100) || 0;
  els.progressBar.style.width = `${pct}%`;
  els.progressPercent.textContent = `${pct}%`;
}

function lineNumbers(text) {
  return Array.from({ length: Math.max(1, text.split("\n").length) }, (_, i) => i + 1).join("\n");
}

function syncLines() {
  els.htmlLines.textContent = lineNumbers(els.htmlEditor.value);
  els.cssLines.textContent = lineNumbers(els.cssEditor.value);
}

function cssBeginnerErrors(cssText) {
  if ((cssText.match(/{/g) || []).length !== (cssText.match(/}/g) || []).length) return "You may have unmatched { } braces.";
  const lines = cssText.split("\n").map((l) => l.trim()).filter(Boolean);
  const bad = lines.find((l) => /^[a-z-]+\s+[^:{].*;$/i.test(l));
  if (bad) return `This line looks like it's missing a colon (:): "${bad}"`;
  return "";
}

function previewDoc(html, css = "") {
  return `<!doctype html><html><head><meta charset="UTF-8"><style>body{font-family:system-ui;padding:16px}*{box-sizing:border-box}${css}</style></head><body>${html}</body></html>`;
}

function renderPreview() {
  const html = els.htmlEditor.value;
  const css = els.cssEditor.value;
  const err = cssBeginnerErrors(css);
  els.cssError.textContent = err;
  els.cssError.className = `error ${err ? "show" : ""}`;
  els.unstyledPreview.srcdoc = previewDoc(html, "");
  els.styledPreview.srcdoc = previewDoc(html, css);
}

function copyText(text) {
  navigator.clipboard.writeText(text);
}

function currentLesson() {
  return lessons.find((l) => l.id === state.currentLesson) || lessons[0];
}

function renderLessonPanel() {
  const lesson = currentLesson();
  const idx = lessons.findIndex((l) => l.id === lesson.id);
  const isDone = state.completed.includes(lesson.id);
  const isBookmarked = state.bookmarks.includes(lesson.id);
  els.lessonPanel.innerHTML = `
    <h2>${lesson.property}</h2>
    <p class="lesson-meta">${lesson.category} • ${lesson.description}</p>
    <h3>What it does</h3><p>${lesson.description}</p>
    <h3>Syntax</h3><pre class="code-block">${escapeHtml(lesson.syntax)}</pre>
    <h3>Think of it as</h3><p>${lesson.beginnerExplanation}</p>
    <h3>HTML + CSS connection</h3>
    <p><code>.primary-btn</code> selects the HTML element whose class is <code>primary-btn</code>. HTML → Selector → Property → Value → Result.</p>
    <h3>Before / After</h3>
    <p class="note">WITHOUT CSS: plain structure. WITH CSS: same HTML, styled by this rule.</p>
    <h3>Common mistake</h3><p>${lesson.commonMistake}</p>
    <h3>Used with</h3><p>${lesson.usedWith}</p>
    <h3>Related properties</h3><p>${lesson.related.length ? lesson.related.join(", ") : "See sidebar for related topics."}</p>
    <div class="lesson-actions">
      <button id="prevLesson" class="btn" ${idx === 0 ? "disabled" : ""}>Previous</button>
      <button id="nextLesson" class="btn" ${idx === lessons.length - 1 ? "disabled" : ""}>Next</button>
      <button id="toggleDone" class="btn primary">${isDone ? "Completed" : "Mark as complete"}</button>
      <button id="toggleBookmark" class="btn">${isBookmarked ? "Bookmarked" : "Bookmark"}</button>
    </div>
  `;

  els.htmlEditor.value = lesson.htmlExample;
  els.cssEditor.value = lesson.cssExample;
  syncLines();
  renderPreview();

  document.getElementById("prevLesson").onclick = () => navigateLesson(idx - 1);
  document.getElementById("nextLesson").onclick = () => navigateLesson(idx + 1);
  document.getElementById("toggleDone").onclick = () => {
    if (!state.completed.includes(lesson.id)) state.completed.push(lesson.id);
    saveState();
    updateProgress();
    renderLessonPanel();
    renderSidebar();
  };
  document.getElementById("toggleBookmark").onclick = () => {
    state.bookmarks = state.bookmarks.includes(lesson.id)
      ? state.bookmarks.filter((id) => id !== lesson.id)
      : [...state.bookmarks, lesson.id];
    saveState();
    renderLessonPanel();
    renderSidebar();
  };

  renderValueExplorer(lesson);
}

function renderSidebar(filter = "") {
  const byCategory = lessons.reduce((acc, l) => {
    const key = l.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(l);
    return acc;
  }, {});
  const q = filter.trim().toLowerCase();

  els.categoryList.innerHTML = Object.entries(byCategory)
    .map(([cat, list]) => {
      const filtered = list.filter((l) => {
        if (!q) return true;
        const text = `${l.property} ${l.category} ${l.description} ${l.related.join(" ")}`.toLowerCase();
        return text.includes(q);
      });
      if (!filtered.length) return "";
      return `<section><h3>${cat}</h3>${filtered.map((l) => `
        <button class="lesson-link ${l.id === state.currentLesson ? "active" : ""}" data-id="${l.id}">
          ${l.property}
          <small>${state.completed.includes(l.id) ? "✓ complete" : state.bookmarks.includes(l.id) ? "★ bookmarked" : ""}</small>
        </button>`).join("")}</section>`;
    }).join("");

  els.categoryList.querySelectorAll(".lesson-link").forEach((btn) => {
    btn.onclick = () => {
      state.currentLesson = btn.dataset.id;
      saveState();
      renderLessonPanel();
      renderSidebar(els.searchInput.value);
      if (window.innerWidth <= 1024) els.sidebar.classList.remove("open");
    };
  });
}

function renderCourseFlow() {
  els.courseFlow.innerHTML = courseOrder.map((item) => `<span class="chip">${item}</span>`).join("");
}

function navigateLesson(i) {
  if (i < 0 || i >= lessons.length) return;
  state.currentLesson = lessons[i].id;
  saveState();
  renderLessonPanel();
  renderSidebar(els.searchInput.value);
}

function renderValueExplorer(lesson) {
  if (!lesson.values?.length) {
    els.valueExplorer.innerHTML = `<h3>Try It Yourself</h3><p class="note">This topic is open exploration. Edit the CSS directly in the playground.</p>`;
    return;
  }

  els.valueExplorer.innerHTML = `
    <h3>Try It Yourself: ${lesson.property}</h3>
    <div class="value-grid">
      <label>${lesson.property}
        <select id="valueSelect">${lesson.values.map((v) => `<option value="${v}">${v}</option>`).join("")}</select>
      </label>
      <p id="valueExplain" class="note"></p>
    </div>
  `;

  const select = document.getElementById("valueSelect");
  const explain = document.getElementById("valueExplain");
  select.onchange = () => {
    const chosen = select.value;
    explain.textContent = lesson.valueNotes?.[chosen] || `Changed ${lesson.property} to ${chosen}.`;
    const reg = new RegExp(`${escapeRegex(lesson.property)}\\s*:\\s*[^;]+;`);
    if (reg.test(els.cssEditor.value)) {
      els.cssEditor.value = els.cssEditor.value.replace(reg, `${lesson.property}: ${chosen};`);
    } else {
      els.cssEditor.value += `\n${lesson.property}: ${chosen};`;
    }
    syncLines();
    renderPreview();
  };
  select.dispatchEvent(new Event("change"));
}

function renderBoxModelLab() {
  els.boxModelLab.innerHTML = `
    <h3>Interactive Box Model Diagram</h3>
    <div class="box-model-controls">
      <label>Margin <input id="mRange" type="range" min="0" max="40" value="16" /></label>
      <label>Border <input id="bRange" type="range" min="0" max="20" value="4" /></label>
      <label>Padding <input id="pRange" type="range" min="0" max="40" value="12" /></label>
    </div>
    <div class="box-demo">
      <div id="marginLayer" class="margin-layer">Margin
        <div id="borderLayer" class="border-layer">Border
          <div id="paddingLayer" class="padding-layer">Padding
            <div class="content-layer">Content</div>
          </div>
        </div>
      </div>
    </div>
  `;

  const m = document.getElementById("mRange");
  const b = document.getElementById("bRange");
  const p = document.getElementById("pRange");
  const marginLayer = document.getElementById("marginLayer");
  const borderLayer = document.getElementById("borderLayer");
  const paddingLayer = document.getElementById("paddingLayer");

  const paint = () => {
    marginLayer.style.padding = `${m.value}px`;
    borderLayer.style.borderWidth = `${b.value}px`;
    paddingLayer.style.padding = `${p.value}px`;
  };
  [m, b, p].forEach((el) => el.addEventListener("input", paint));
  paint();
}

function renderFunctionsLab() {
  els.functionsLab.innerHTML = `
    <h3>CSS Functions Explorer</h3>
    <label>Function
      <select id="fnSelect">
        <option value="clamp">clamp()</option>
        <option value="calc">calc()</option>
        <option value="minmax">minmax()</option>
        <option value="color-mix">color-mix()</option>
      </select>
    </label>
    <div id="fnControls" class="value-grid"></div>
    <pre id="fnSyntax" class="code-block"></pre>
    <div class="card"><p id="fnPreviewText">Function preview text</p></div>
  `;

  const select = document.getElementById("fnSelect");
  const controls = document.getElementById("fnControls");
  const syntax = document.getElementById("fnSyntax");
  const text = document.getElementById("fnPreviewText");

  const render = () => {
    const fn = select.value;
    if (fn === "clamp") {
      controls.innerHTML = `
        <label>Min rem <input id="cMin" type="range" min="0.5" max="2" step="0.1" value="1" /></label>
        <label>Preferred vw <input id="cPref" type="range" min="1" max="8" step="0.2" value="3" /></label>
        <label>Max rem <input id="cMax" type="range" min="1" max="4" step="0.1" value="2.5" /></label>`;
      const update = () => {
        const expr = `clamp(${val("cMin")}rem, ${val("cPref")}vw, ${val("cMax")}rem)`;
        syntax.textContent = `font-size: ${expr};`;
        text.style.fontSize = expr;
      };
      controls.querySelectorAll("input").forEach((i) => i.oninput = update);
      update();
    }
    if (fn === "calc") {
      controls.innerHTML = `<label>Base px <input id="base" type="range" min="10" max="80" value="20" /></label><label>Plus vw <input id="vw" type="range" min="0" max="8" step="0.2" value="2" /></label>`;
      const update = () => {
        const expr = `calc(${val("base")}px + ${val("vw")}vw)`;
        syntax.textContent = `padding: ${expr};`;
        text.style.padding = expr;
        text.style.background = "#1d4ed8";
        text.style.color = "white";
      };
      controls.querySelectorAll("input").forEach((i) => i.oninput = update);
      update();
    }
    if (fn === "minmax") {
      controls.innerHTML = `<label>Min px <input id="gMin" type="range" min="60" max="180" value="100" /></label><label>Max fr <input id="gMax" type="range" min="1" max="4" step="0.5" value="1" /></label>`;
      const update = () => {
        const expr = `repeat(auto-fit, minmax(${val("gMin")}px, ${val("gMax")}fr))`;
        syntax.textContent = `grid-template-columns: ${expr};`;
        text.style.display = "grid";
        text.style.gridTemplateColumns = expr;
        text.innerHTML = "<span class='card'>A</span><span class='card'>B</span><span class='card'>C</span>";
      };
      controls.querySelectorAll("input").forEach((i) => i.oninput = update);
      update();
    }
    if (fn === "color-mix") {
      controls.innerHTML = `<label>Blue mix % <input id="mix" type="range" min="0" max="100" value="50" /></label>`;
      const update = () => {
        const expr = `color-mix(in oklab, royalblue ${val("mix")}% , tomato)`;
        syntax.textContent = `background: ${expr};`;
        text.style.background = expr;
        text.style.color = "white";
        text.style.padding = "1rem";
      };
      controls.querySelector("input").oninput = update;
      update();
    }
  };

  select.onchange = render;
  render();
}

function val(id) {
  return document.getElementById(id).value;
}

function renderChallenges() {
  const challenge = challenges[0];
  els.challengeLab.innerHTML = `
    <h3>Mini Challenge</h3>
    <strong>${challenge.title}</strong>
    <p>${challenge.goal}</p>
    <pre class="code-block">${escapeHtml(challenge.html)}</pre>
    <textarea id="challengeCss" class="editor" aria-label="Challenge CSS editor">${challenge.starterCss}</textarea>
    <div class="controls"><button id="checkChallenge" class="btn primary">Check solution</button><span id="challengeStatus" class="challenge-status"></span></div>
    <iframe id="challengePreview" title="Challenge preview"></iframe>
  `;

  const css = document.getElementById("challengeCss");
  const preview = document.getElementById("challengePreview");
  const status = document.getElementById("challengeStatus");

  const draw = () => preview.srcdoc = previewDoc(challenge.html, css.value);
  css.addEventListener("input", draw);
  draw();

  document.getElementById("checkChallenge").onclick = () => {
    const pass = challenge.check(css.value);
    status.textContent = pass ? `Challenge complete. ${challenge.explain}` : "Not quite yet. Try adjusting layout properties.";
    status.className = `challenge-status ${pass ? "ok" : "fail"}`;
    if (pass && !state.challengeDone.includes(challenge.id)) {
      state.challengeDone.push(challenge.id);
      saveState();
    }
  };
}

function renderQuiz() {
  const quiz = quizzes[0];
  els.quizLab.innerHTML = `
    <h3>Quick Quiz</h3>
    <p>${quiz.q}</p>
    <div class="quiz-options">
      ${quiz.options.map((o, i) => `<button class="btn quiz-btn" data-idx="${i}">${String.fromCharCode(65 + i)}. ${o}</button>`).join("")}
    </div>
    <p id="quizResult" class="note"></p>
  `;

  const result = document.getElementById("quizResult");
  els.quizLab.querySelectorAll(".quiz-btn").forEach((btn) => {
    btn.onclick = () => {
      const ok = Number(btn.dataset.idx) === quiz.answer;
      result.textContent = `${ok ? "Correct." : "Not this one."} ${quiz.why}`;
      state.quizScores[quiz.id] = ok ? 1 : 0;
      saveState();
    };
  });
}

function fillPropertyInsert() {
  const allProps = [...new Set(lessons.map((l) => l.property).filter((p) => /[a-z-]/i.test(p)))].sort();
  els.propertyInsert.innerHTML = allProps.map((p) => `<option value="${p}">${p}</option>`).join("");
}

function initEvents() {
  els.quickCss.addEventListener("input", () => {
    els.quickPreview.srcdoc = previewDoc(`<div class="demo-box">Edit this CSS and watch me change.</div>`, els.quickCss.value);
  });

  [els.htmlEditor, els.cssEditor].forEach((editor) => editor.addEventListener("input", () => {
    syncLines();
    renderPreview();
  }));

  els.runCode.onclick = renderPreview;
  els.resetCode.onclick = () => {
    const lesson = currentLesson();
    els.htmlEditor.value = lesson.htmlExample;
    els.cssEditor.value = lesson.cssExample;
    syncLines();
    renderPreview();
  };

  els.copyHtml.onclick = () => copyText(els.htmlEditor.value);
  els.copyCss.onclick = () => copyText(els.cssEditor.value);

  els.viewportRange.oninput = () => {
    const px = `${els.viewportRange.value}px`;
    [els.unstyledPreview, els.styledPreview].forEach((f) => f.style.maxWidth = px);
  };

  document.querySelectorAll(".viewport-btn").forEach((btn) => btn.onclick = () => {
    els.viewportRange.value = btn.dataset.size;
    els.viewportRange.dispatchEvent(new Event("input"));
  });

  els.startLearningBtn.onclick = () => {
    els.landing.classList.add("hidden");
    els.app.classList.remove("hidden");
  };
  els.exploreBtn.onclick = els.startLearningBtn.onclick;

  els.searchInput.oninput = () => renderSidebar(els.searchInput.value);

  els.themeToggle.onclick = () => setTheme(state.theme === "dark" ? "light" : "dark");

  els.insertProperty.onclick = () => {
    const prop = els.propertyInsert.value;
    els.cssEditor.value += `\n${prop}: ;`;
    syncLines();
    els.cssEditor.focus();
  };

  els.mobileMenuBtn.onclick = () => els.sidebar.classList.toggle("open");

  els.fullscreenPreview.onclick = () => {
    els.dialogPreview.srcdoc = els.styledPreview.srcdoc;
    els.previewDialog.showModal();
  };

  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "enter") renderPreview();
  });
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function init() {
  loadState();
  setTheme(state.theme);
  renderCourseFlow();
  renderSidebar();
  renderLessonPanel();
  renderBoxModelLab();
  renderFunctionsLab();
  renderChallenges();
  renderQuiz();
  fillPropertyInsert();
  updateProgress();
  initEvents();
  els.quickCss.dispatchEvent(new Event("input"));
}

init();
