# Study Hub

Exam prep for every module, built the way we prepared for CSE302 Computer Systems Administration:

- **Plan**: what's most likely to come out (ranked from past papers and the lecturer's revision session), a predicted paper, a study plan and answering rules.
- **Learn**: model answers written as mark points, with read-aloud.
- **Drill**: multiple choice. A wrong answer is explained out loud: why your pick was wrong, what's right, and how to avoid the trap. Missed questions come back.
- **Speed test**: quick rounds of 10, 20 or 30 tap-to-answer questions for on the go, with an optional timer. Right answers move on by themselves, wrong ones explain why, and you get a score and a retry of your misses at the end.
- **Exam mode**: write your answer under a timer, then tick off the mark scheme or let Claude mark it.
- **Tools**: module-specific extras. CSA has a **Subnet lab** (unlimited /16 VLSM problems with worked solutions).

It's a plain static site: HTML, CSS and JavaScript, with no build step, no framework and no server.

```
study-site/
├── index.html            hub page (lists every module)
├── modules.js            the hub's list of modules
├── assets/
│   ├── style.css         shared look (light and dark)
│   ├── engine.js         shared app: Plan, Learn, Drill, Exam
│   └── tools/subnet.js   Subnet lab tool
├── csa/                  CSE302 module
│   ├── index.html
│   └── data/
│       ├── module.js     settings, topics, hit list, predicted paper, plan, rules, quotes
│       ├── learn.js      model answers (Learn + Exam mode)
│       └── drill.js      multiple-choice questions
├── is/                   CSE301 Intelligent Systems module
│   └── index.html        one self-contained file, built with the Study Hub engine (Quest, Calc lab, Chaining lab)
├── _template/            copy this to start a new module
├── scripts/bundle.mjs    makes a single-file version of a module
├── NEW-MODULE.md         how to build the next module (with a prompt for Claude)
└── .nojekyll             tells GitHub Pages to serve files as they are
```

## CSE301 Intelligent Systems

`is/index.html` is built from the Study Hub project (`Study Hub/imports/is-final-prep`, `node build.mjs`), so edit it there and copy the new build here. It opens on **Quest**: the lecturer's ten scope topics as missions, each with four steps (know it, drill it, calculate it, write it), XP and levels, 15-minute focus sprints and one **Go** button that always picks the next step. Progress is saved in the browser, per device.

## Run it on your computer

Double-click `index.html` (or `csa/index.html`). It works straight from the folder.

Or serve it, which is closer to how it behaves online:

```bash
npx serve .              # or: python -m http.server 8000
```

## Put it online

### GitHub Pages (free, public repo)

```bash
cd study-site
git init
git add .
git commit -m "Study hub with CSE302 module"
git branch -M main
git remote add origin https://github.com/<your-username>/study-hub.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save.**
After a minute it's live at `https://<your-username>.github.io/study-hub/`, and the CSA module is at `…/study-hub/csa/`.

> GitHub Pages on a free account needs a **public** repo. This site contains past-paper questions and quotes from your lecturer's revision session, so if you'd rather keep it private, use a private repo with **Cloudflare Pages**, **Netlify** or **Vercel** (all free): connect the repo, leave the build command empty and set the output folder to `/`.

### Updating

Edit the files, then `git add . && git commit -m "Update" && git push`. Pages redeploys on its own.

## Claude marking and "Ask Claude"

- **Inside Claude** (the artifact version), the Claude buttons use your Claude account. Nothing to set up.
- **On your hosted copy**, open **Settings** (top right) and paste an Anthropic API key. It's stored only in that browser's local storage and sent only to `api.anthropic.com`; each marking costs a little API credit. The model name is editable (default `claude-sonnet-5-5`).
- **Never commit an API key to the repo.** The key lives in the browser, not in the code.
- With no key, the Claude buttons stay hidden and everything else works, including self-marking against the mark scheme.

## Progress

Progress (known answers, drill history, drafts, plan ticks, subnet score) is saved per module in the browser's local storage. It doesn't sync between devices; each device keeps its own.

## A single-file version

```bash
node scripts/bundle.mjs csa              # → dist/csa.html, one file that works offline
node scripts/bundle.mjs csa --artifact   # → dist/csa.artifact.html, for publishing as a Claude artifact
```

## Adding a module

See [NEW-MODULE.md](NEW-MODULE.md). In short: copy `_template/` to a new folder, fill in the three `data/` files, add a line to `modules.js`.
