# Building the next module

This is the same process we used for CSE302, written down so it can be repeated for any module.

## 1. Gather the material

Put everything in one folder for the module:

- **Lecture slides** (pptx, ppt or pdf)
- **Past papers**: finals, supplementaries and assessment tests, with as many years as you can find
- **Revision-session transcript**, if the lecturer held one. This is the most valuable source: lecturers usually say what's on the final.
- Any memos or scenario/revision question sheets

## 2. Ask Claude to build the module

Open a chat with the folder connected (or the files attached) and use this prompt, filling in the brackets:

> I have an exam for **[module code and name]** at **[institution]** in **[time until exam]**. In **[folder]** are the lecture slides, past papers and revision material. Using my study-site project (`study-site/`, see `_template/` and `csa/` for the format):
>
> 1. Read everything. Remove duplicate papers. Note the paper format (compulsory questions, choices, marks, time).
> 2. Rank topics by how often they appear across papers, and by anything the lecturer said about the final. Tier 1 = near certain, Tier 2 = likely, Tier 3 = lower. List what can be skipped (on old papers but not in the current slides).
> 3. Write model answers for every Tier 1 and Tier 2 question, and the main Tier 3 ones, as mark points (`"Heading::Explanation"`), in the slides' wording, with an exam tip each.
> 4. Write multiple-choice drill questions. Every wrong option needs a reason that teaches something, because it's read aloud when picked.
> 5. Build a predicted paper and a study plan for the time I have.
> 6. Create `study-site/[new-folder]/` from `_template/` with `data/module.js`, `data/learn.js` and `data/drill.js`, add it to `modules.js`, and check it runs with no errors.
> 7. If the module has calculations (like subnetting in CSA), suggest a tool in `assets/tools/` that generates practice problems with worked solutions.

## 3. Check it, then publish

1. Open `study-site/index.html` and click into the new module.
2. Skim the Learn cards against your slides and correct anything that doesn't match how your lecturer teaches it.
3. Commit and push; the hosted site updates on its own.

## Data formats

All three files are plain JavaScript with comments explaining every field. Start from the copies in `_template/data/`.

| File | Holds | Used by |
| --- | --- | --- |
| `module.js` | `MODULE` settings, `TOPICS`, `PREDICTED`, `HITLIST`, `PLAN_BLOCKS`, `RULES`, `QUOTES` | Plan, filters, Exam sets |
| `learn.js` | `LEARN`: model answers | Learn, Exam mode, Claude marking |
| `drill.js` | `DRILL`: multiple-choice questions | Drill |

## Writing a tool

A tool is one script in `assets/tools/` that registers itself:

```js
window.STUDY_TOOLS = window.STUDY_TOOLS || {};
window.STUDY_TOOLS.mytool = {
  id: 'mytool',                 // also the tab's #hash
  label: 'My tool',             // tab name
  planButton: 'Practise X',     // button on the Plan tab (optional)
  render(view, ctx) { /* draw into view; ctx has $, $$, esc, rand, S (saved state), save, TTS, ICON, toast */ },
  stat(ctx) { return { n: '0', l: 'problems solved' }; }   // optional figure on the Plan tab
};
```

Then add `"mytool"` to `MODULE.tools` and a `<script src="../assets/tools/mytool.js"></script>` line before `engine.js` in that module's `index.html`. `assets/tools/subnet.js` is a full example.
