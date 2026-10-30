/* Module settings. Copy this whole _template folder (for example to acc/), then edit these three files. */
var MODULE = {
  id: "newmod",                          // unique; also used for this browser's progress storage
  // storageKey: "my-key",            // optional; defaults to "study-prep-" + id
  code: "ABC123",                        // module code shown in the header
  name: "Module Name",
  brand: ["ABC", "Exam", "Prep"],        // header title: first word, highlighted word, last word
  institution: "Botswana Accountancy College",
  level: "BSc Year 3",
  examName: "final exam",
  hubHref: "../index.html",              // link back to the hub page
  planHeading: "What's most likely on the exam",
  sourceNote: "Built from past papers and lecture slides",
  introHTML: "Describe the exam format here, for example: <b>Question 1 is compulsory</b>, then any 3 of the other 4.",
  quoteSource: "",                       // e.g. "Lecturer, revision session"
  skipHTML: "",                          // topics you can skip, shown under the hit list
  minutesPerMark: 1.8,                   // exam time ÷ total marks (180 min ÷ 100)
  voiceTest: "If you can hear this clearly, the voice is ready.",
  tools: [],                             // e.g. ["subnet"]; also add the tool's <script> to index.html
  defaultModel: "claude-sonnet-5-5"      // used only on hosted copies with your own API key
};

/* Topics. c = colour token from assets/style.css: --f-blue --f-orange --f-green --f-brown --f-slate --f-red --f-violet --f-aqua */
var TOPICS = {
  t1: { name: "First topic", c: "--f-blue" },
  t2: { name: "Second topic", c: "--f-orange" }
};

/* Predicted paper: groups of LEARN ids. marksOverride lets one item count differently in this paper. */
var PREDICTED = [
  { title: "Question 1 · compulsory", sub: "First topic", items: ["t1-example"] }
];

/* Hit list on the Plan tab. tier 1–3; go = a LEARN id to jump to. */
var HITLIST = [
  { tier: 1, t: "t1", name: "Example: the question that appears every year", ev: "5 papers", go: "t1-example" }
];

var PLAN_BLOCKS = [
  { id: "b1", h: "Block 1 · 90 min", t: "What to study first." }
];

var RULES = [
  ["One-word answers score zero.", "Name the point, explain it, link it to the scenario."]
];

var QUOTES = [];
