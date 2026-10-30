/* Study engine: builds the Plan, Learn, Drill and Exam views (plus any tools) for one module.
   Reads these globals from the module's data files: MODULE, TOPICS, LEARN, DRILL,
   PREDICTED, HITLIST, PLAN_BLOCKS, RULES, QUOTES. Tools register on window.STUDY_TOOLS. */
(function () {
'use strict';
const W = window;
const MOD = W.MODULE || {};
const TOPICS = W.TOPICS || {};
const LEARN = W.LEARN || [];
const DRILL = W.DRILL || [];
const PREDICTED = W.PREDICTED || [];
const HITLIST = W.HITLIST || [];
const PLAN_BLOCKS = W.PLAN_BLOCKS || [];
const RULES = W.RULES || [];
const QUOTES = W.QUOTES || [];
const TOOLS = (MOD.tools || []).map(id => (W.STUDY_TOOLS || {})[id]).filter(Boolean);

const $ = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const BY_ID = {}; LEARN.forEach(it => { BY_ID[it.id] = it; });
const DRILL_BY_ID = {}; DRILL.forEach(it => { DRILL_BY_ID[it.id] = it; });
const who = `a ${MOD.level || 'university'} student${MOD.institution ? ' at ' + MOD.institution : ''} revising for the ${[MOD.code, MOD.name].filter(Boolean).join(' ')} ${MOD.examName || 'exam'}`;

/* ---------- storage (this browser only) ---------- */
const KEY = MOD.storageKey || ('study-prep-' + (MOD.id || 'module'));
let S = { known: {}, drill: {}, plan: {}, drafts: {}, ticks: {}, settings: { rate: 1, voice: '', auto: true } };
try {
  const raw = localStorage.getItem(KEY);
  if (raw) { const o = JSON.parse(raw); S = Object.assign(S, o); S.settings = Object.assign({ rate: 1, voice: '', auto: true }, o.settings || {}); }
} catch (e) { /* storage unavailable: run without it */ }
let saveT = null;
function save() { clearTimeout(saveT); saveT = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }, 250); }
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(() => { t.hidden = true; }, 2600); }

/* ---------- text helpers ---------- */
function splitPt(p) { const i = p.indexOf('::'); return i < 0 ? { h: '', b: p } : { h: p.slice(0, i), b: p.slice(i + 2) }; }
function ptHTML(p) { const { h, b } = splitPt(p); return h ? `<b>${esc(h)}.</b> ${esc(b)}` : esc(b); }
function topicChip(t) { const T = TOPICS[t] || { name: t, c: '--ink-2' }; return `<span class="topic"><span class="strand" style="--sc:var(${T.c})"></span>${esc(T.name)}</span>`; }
function tierPill(n) { return `<span class="pill tier${n}">${n === 1 ? 'Tier 1 · near certain' : n === 2 ? 'Tier 2 · likely' : 'Tier 3 · lower'}</span>`; }
function itemSpeech(it, marks) {
  const m = marks || it.marks;
  let s = `Question. ${it.q} For ${m} marks. `;
  it.pts.forEach((p, i) => { const { h, b } = splitPt(p); s += (it.steps ? `Step ${i + 1}. ` : '') + (h ? h + '. ' : '') + b + ' '; });
  if (it.tip) s += 'Exam tip. ' + it.tip;
  return s;
}
function itemContext(it) { return `${it.q} [${it.marks} marks]\nModel answer points:\n` + it.pts.map((p, i) => `${i + 1}. ${p.replace('::', ': ')}`).join('\n') + (it.tip ? `\nTip: ${it.tip}` : ''); }
function shortQ(q) { const s = q.replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+/g, ' ').trim(); return s.length > 92 ? s.slice(0, 89).replace(/\s+\S*$/, '') + '…' : s; }
const ICON = {
  play: '<svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
  spark: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/></svg>',
  pen: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4z"/></svg>',
  check: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>',
  gear: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg>'
};

/* ---------- page shell ---------- */
const VIEWS = ['plan', 'learn', 'drill', 'speed', 'exam'].concat(TOOLS.map(t => t.id));
function buildShell() {
  const b = MOD.brand || [MOD.code || 'Study', '', 'Prep'];
  if (!document.title) document.title = b.filter(Boolean).join(' ');
  const hub = MOD.hubHref && !W.STUDY_STANDALONE ? `<a class="hublink" href="${esc(MOD.hubHref)}">← All modules</a>` : '';
  const tabs = [['plan', 'Plan'], ['learn', 'Learn'], ['drill', 'Drill'], ['speed', 'Speed<span class="wide"> test</span>'], ['exam', 'Exam<span class="wide"> mode</span>']].concat(TOOLS.map(t => [t.id, t.tabHTML || esc(t.label)]));
  document.body.insertAdjacentHTML('afterbegin', `
<header class="top">
  <div class="wrap top-in">
    <div class="brand">
      <div class="eyebrow">${esc([MOD.code, MOD.name].filter(Boolean).join(' · '))}</div>
      <h1>${esc(b[0])} <span>${esc(b[1] || '')}</span> ${esc(b[2] || '')}</h1>
      ${hub}
    </div>
    <div class="top-actions">
      <button id="btn-stop" class="btn" hidden><span class="speaking-dot" aria-hidden="true"></span>Stop reading</button>
      <button id="btn-voice" class="btn ghost" aria-expanded="false" aria-controls="voice-panel">${ICON.gear}Settings</button>
    </div>
  </div>
  <div id="voice-panel" class="wrap voice-panel" hidden>
    <div class="voice-grid">
      <label for="voice-select">Voice<select id="voice-select"></select></label>
      <label for="voice-rate">Speed <span id="rate-val" class="mono">1.0×</span><input id="voice-rate" type="range" min="0.7" max="1.5" step="0.05" value="1"></label>
      <label class="check" for="voice-auto"><input id="voice-auto" type="checkbox"> Read feedback aloud automatically</label>
      <div class="row"><button id="voice-test" class="btn">Test voice</button></div>
      <p id="voice-status" class="small muted" style="grid-column:1/-1"></p>
      <div class="ai-box" id="ai-box" hidden>
        <div class="ai-h"><b>Claude marking on your own site</b><p class="small muted">Inside Claude this works without a key. On a hosted copy, paste an Anthropic API key: it's saved only in this browser, sent only to api.anthropic.com, and each answer marked uses a little of your API credit. Never put the key in the code.</p></div>
        <label for="ai-key">API key<input id="ai-key" type="password" autocomplete="off" spellcheck="false" placeholder="sk-ant-…"></label>
        <label for="ai-model">Model<input id="ai-model" type="text" spellcheck="false"></label>
        <div class="row"><button id="ai-save" class="btn primary">Save key</button><button id="ai-forget" class="btn">Forget key</button></div>
        <p id="ai-status" class="small" style="grid-column:1/-1"></p>
      </div>
    </div>
  </div>
</header>
<div class="tabs-bar">
  <nav class="wrap tabs" aria-label="Sections">${tabs.map(([id, h]) => `<a href="#${id}" data-view="${id}">${h}</a>`).join('')}</nav>
</div>
<main class="wrap">${VIEWS.map((v, i) => `<section id="view-${v}" class="view"${i ? ' hidden' : ''}></section>`).join('')}</main>
<div id="toast" class="toast" hidden role="status"></div>`);
}

/* ---------- voice ---------- */
const TTS = {
  synth: ('speechSynthesis' in W) ? W.speechSynthesis : null,
  voices: [], gen: 0,
  init() {
    const status = $('#voice-status');
    if (!this.synth) { status.textContent = 'This browser has no built-in voice, so read-aloud is off. Chrome or Edge on a computer usually has good voices.'; $('#voice-test').disabled = true; return; }
    const load = () => {
      let all = [];
      try { all = this.synth.getVoices() || []; } catch (e) { all = []; }
      const en = all.filter(v => /^en([-_]|$)/i.test(v.lang));
      this.voices = en.length ? en : all;
      this.fill();
    };
    load();
    try { this.synth.addEventListener('voiceschanged', load); } catch (e) { this.synth.onvoiceschanged = load; }
    setTimeout(load, 800);
  },
  score(v) { let s = 0; if (/natural|neural|online/i.test(v.name)) s += 40; if (/google/i.test(v.name)) s += 10; if (/en-GB/i.test(v.lang)) s += 12; if (/en-ZA/i.test(v.lang)) s += 11; if (/en-US/i.test(v.lang)) s += 6; return s; },
  pick() {
    if (S.settings.voice) { const v = this.voices.find(v => v.name === S.settings.voice); if (v) return v; }
    return this.voices.slice().sort((a, b) => this.score(b) - this.score(a))[0] || null;
  },
  fill() {
    const sel = $('#voice-select'); const cur = this.pick();
    if (!this.voices.length) { sel.innerHTML = '<option>Default voice</option>'; $('#voice-status').textContent = 'No voices listed yet. Press “Test voice”; some browsers load them on first use.'; return; }
    sel.innerHTML = this.voices.map(v => `<option value="${esc(v.name)}"${cur && v.name === cur.name ? ' selected' : ''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('');
    $('#voice-status').textContent = 'Voices with “Natural” or “Online” in the name usually sound best.';
  },
  clean(t) {
    return String(t)
      .replace(/::/g, '. ')
      .replace(/(\d+)BASE-([A-Z]+)/g, (m, a, b) => a + ' base ' + b.split('').join(' '))
      .replace(/8B\/10B/g, '8 B 10 B')
      .replace(/(\d)\s*[–-]\s*(\d)/g, '$1 to $2')
      .replace(/→/g, ', to ').replace(/[–—]/g, ', ')
      .replace(/\/(\d{1,2})\b/g, ' slash $1')
      .replace(/2\^\((h−8)\)/g, '2 to the power h minus 8').replace(/2\^(\d+)/g, '2 to the power $1')
      .replace(/−/g, ' minus ').replace(/\s\+\s/g, ' plus ').replace(/×/g, ' times ').replace(/≥/g, ' at least ').replace(/≤/g, ' at most ')
      .replace(/µm/g, ' micron').replace(/µs/g, ' microseconds')
      .replace(/\be\.g\./gi, 'for example').replace(/\bi\.e\./gi, 'that is').replace(/\betc\./gi, 'and so on')
      .replace(/[“”"*#]/g, '').replace(/\\+/g, ' ')
      .replace(/\s+/g, ' ').trim();
  },
  chunk(t) {
    const out = []; const parts = t.match(/[^.!?;]+[.!?;]*\s*/g) || [t];
    let buf = '';
    parts.forEach(p => { if ((buf + p).length > 220 && buf) { out.push(buf.trim()); buf = p; } else buf += p; });
    if (buf.trim()) out.push(buf.trim());
    const fin = [];
    out.forEach(c => { if (c.length <= 260) { fin.push(c); return; } const bits = c.split(/,\s*/); let b2 = ''; bits.forEach(x => { if ((b2 + x).length > 220 && b2) { fin.push(b2); b2 = x; } else b2 += (b2 ? ', ' : '') + x; }); if (b2) fin.push(b2); });
    return fin;
  },
  speak(text) {
    if (!this.synth || !text) return;
    const g = ++this.gen;
    try { this.synth.cancel(); } catch (e) {}
    const v = this.pick(); const parts = this.chunk(this.clean(text));
    setTimeout(() => {
      if (g !== this.gen) return;
      parts.forEach((p, i) => {
        const u = new SpeechSynthesisUtterance(p);
        if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-GB';
        u.rate = S.settings.rate || 1;
        if (i === 0) u.onstart = () => { if (g === this.gen) setSpeaking(true); };
        if (i === parts.length - 1) u.onend = u.onerror = () => { if (g === this.gen) setSpeaking(false); };
        this.synth.speak(u);
      });
      setSpeaking(true);
    }, 80);
  },
  stop() { this.gen++; try { this.synth && this.synth.cancel(); } catch (e) {} setSpeaking(false); }
};
function setSpeaking(on) { $('#btn-stop').hidden = !on; }

/* ---------- Claude: the artifact's built-in access, or your own API key on a hosted copy ---------- */
const AI_STORE = 'study-ai';
let aiCfg = { key: '', model: MOD.defaultModel || 'claude-sonnet-5-5' };
try { const o = JSON.parse(localStorage.getItem(AI_STORE) || 'null'); if (o) aiCfg = Object.assign(aiCfg, o); } catch (e) {}
const inClaude = !!(W.claude && typeof W.claude.use === 'function');
const AI = {
  mode: null, sample: null,
  refresh() {
    this.mode = this.sample ? 'claude' : (!inClaude && aiCfg.key ? 'api' : null);
    document.documentElement.classList.toggle('has-claude', !!this.mode);
    const box = $('#ai-box'); if (box) box.hidden = inClaude;
  },
  async text(prompt, o) {
    o = o || {};
    if (this.mode === 'claude') return (await this.sample(prompt, { signal: o.signal, cache: false, onText: o.onText })).text;
    if (this.mode === 'api') { const t = await apiCall(prompt, o.signal); if (o.onText) o.onText({ text: t }); return t; }
    throw { code: 'not_granted' };
  },
  async json(prompt, o) {
    o = o || {};
    if (this.mode === 'claude') return this.sample.json(prompt, { signal: o.signal, cache: false });
    if (this.mode === 'api') { const t = await apiCall(prompt + '\n\nReply with the JSON only, no other text.', o.signal); const v = parseLoose(t); if (v === undefined) throw { code: 'invalid_json', text: t }; return v; }
    throw { code: 'not_granted' };
  }
};
async function apiCall(prompt, signal) {
  let r;
  try {
    r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', signal,
      headers: { 'content-type': 'application/json', 'x-api-key': aiCfg.key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
      body: JSON.stringify({ model: aiCfg.model, max_tokens: 1500, messages: [{ role: 'user', content: prompt }] })
    });
  } catch (e) { if (e && e.name === 'AbortError') throw { code: 'cancelled' }; throw { code: 'upstream_error', message: String(e) }; }
  if (!r.ok) {
    let msg = ''; try { const j = await r.json(); msg = (j.error && j.error.message) || ''; } catch (e) {}
    throw { code: r.status === 401 || r.status === 403 ? 'bad_key' : r.status === 429 ? 'rate_limited' : (r.status === 400 || r.status === 404) ? 'bad_request' : 'upstream_error', message: msg };
  }
  const j = await r.json();
  return (j.content || []).filter(c => c.type === 'text').map(c => c.text).join('').trim();
}
function parseLoose(t) {
  try { return JSON.parse(t); } catch (e) {}
  const f = t.match(/```(?:json)?\s*([\s\S]*?)```/); if (f) { try { return JSON.parse(f[1]); } catch (e) {} }
  const a = t.search(/[[{]/), b = Math.max(t.lastIndexOf('}'), t.lastIndexOf(']'));
  if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch (e) {} }
  return undefined;
}
function claudeErr(e) {
  const c = e && e.code;
  if (['not_granted', 'sampling_disabled', 'not_declared', 'capability_disabled', 'capability_removed'].includes(c)) { AI.sample = null; AI.refresh(); return 'Claude isn’t available here, so this button is now hidden. Everything else still works.'; }
  if (c === 'bad_key') return 'Anthropic rejected the API key. Check it under Settings.';
  if (c === 'bad_request') return 'The API refused the request' + (e.message ? ': ' + e.message : '') + '. Check the model name under Settings.';
  if (c === 'rate_limited') return 'Too many requests right now. Wait a minute, then try again.';
  if (c === 'session_expired') return 'Your Claude session expired. Sign in again, then retry.';
  if (c === 'invalid_json') return 'The marking came back in the wrong format. Press the button again.';
  if (c === 'cancelled') return '';
  return 'Couldn’t reach Claude. Check your connection and try again.';
}
const tidy = s => String(s || '').replace(/\*\*/g, '').replace(/^#+\s*/gm, '').trim();
function mountAsk(container, getContext, presetQ) {
  if (container.dataset.mounted) { container.hidden = !container.hidden; if (!container.hidden) $('input', container).focus(); return; }
  container.dataset.mounted = '1'; container.hidden = false;
  container.innerHTML = `<div class="ask-row"><input type="text" aria-label="Your question" placeholder="Ask anything about this"><button class="btn primary" data-a="go">Ask</button><button class="btn" data-a="stop" hidden>Stop</button></div><div class="ask-out" hidden></div><div class="row" data-r="after" hidden><button class="btn" data-a="read">${ICON.play}Read answer aloud</button></div>`;
  const inp = $('input', container), out = $('.ask-out', container), go = $('[data-a=go]', container), stop = $('[data-a=stop]', container), after = $('[data-r=after]', container);
  if (presetQ) inp.value = presetQ;
  let ctl = null;
  const ask = async () => {
    const qv = inp.value.trim(); if (!qv || !AI.mode) return;
    ctl = new AbortController(); go.disabled = true; stop.hidden = false; after.hidden = true; out.hidden = false; out.textContent = 'Thinking…';
    const prompt = `You are a patient tutor for ${who}. Answer the student's question about the study item below in plain language, in under 170 words, using the same terms as the lecture slides. Use short paragraphs or a few "- " bullet lines; no headings and no bold. If it helps, end with one line starting "In the exam:" that says how to write it for full marks.\n\nSTUDY ITEM:\n${getContext()}\n\nSTUDENT'S QUESTION:\n${qv}`;
    try {
      const t = await AI.text(prompt, { signal: ctl.signal, onText: ({ text }) => { out.textContent = tidy(text); } });
      out.textContent = tidy(t); after.hidden = false;
    } catch (e) { const m = claudeErr(e); out.textContent = (e && e.text ? tidy(e.text) + '\n\n' : '') + m; if (!m && !(e && e.text)) out.hidden = true; }
    finally { go.disabled = false; stop.hidden = true; }
  };
  go.onclick = ask; inp.onkeydown = e => { if (e.key === 'Enter') ask(); };
  stop.onclick = () => ctl && ctl.abort();
  $('[data-a=read]', container).onclick = () => TTS.speak(out.textContent);
  inp.focus();
}

/* ---------- router ---------- */
const rendered = {};
function route() {
  let v = (location.hash || '').replace('#', '');
  if (!VIEWS.includes(v)) v = 'plan';
  if (v !== 'speed') speedPause();
  VIEWS.forEach(n => { $('#view-' + n).hidden = n !== v; });
  $$('.tabs a').forEach(a => { if (a.dataset.view === v) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  if (v === 'plan' || !rendered[v]) { RENDER[v](); rendered[v] = true; }
  if (v === 'drill' && !D.cur) drillNext();
  if (v === 'speed') speedResume();
}
function go(v) { if (location.hash === '#' + v) route(); else location.hash = v; W.scrollTo(0, 0); }
const CTX = { $, $$, esc, rand, shuffle, save, toast, TTS, ICON, get S() { return S; }, go };

/* ---------- PLAN ---------- */
function progress() {
  const known = Object.keys(S.known).filter(k => S.known[k] && BY_ID[k]).length;
  const seen = Object.keys(S.drill).filter(k => DRILL_BY_ID[k]);
  const right = seen.filter(k => S.drill[k].last === 'r').length;
  return { known, total: LEARN.length, seen: seen.length, right };
}
function renderPlan() {
  const p = progress();
  const v = $('#view-plan');
  const toolStats = TOOLS.filter(t => t.stat).map(t => t.stat(CTX));
  const toolBtns = TOOLS.map(t => `<a class="btn" href="#${t.id}">${esc(t.planButton || 'Open ' + t.label)}</a>`).join('');
  v.innerHTML = `
  <div class="hero" ${QUOTES.length ? '' : 'style="grid-template-columns:1fr"'}>
    <div class="card">
      ${MOD.sourceNote ? `<span class="eyebrow">${esc(MOD.sourceNote)}</span>` : ''}
      <h2>${esc(MOD.planHeading || 'What’s most likely on the exam')}</h2>
      ${MOD.introHTML ? `<p>${MOD.introHTML}</p>` : ''}
      <div class="stats">
        <div class="stat"><div class="n mono">${p.known}/${p.total}</div><div class="l">model answers you've marked as known</div></div>
        <div class="stat"><div class="n mono">${p.seen ? Math.round(100 * p.right / p.seen) + '%' : '–'}</div><div class="l">drill accuracy (${p.right} of ${p.seen} questions)</div></div>
        ${toolStats.map(s => `<div class="stat"><div class="n mono">${esc(s.n)}</div><div class="l">${esc(s.l)}</div></div>`).join('')}
      </div>
      <div class="row"><a class="btn primary" href="#learn">Start with the model answers</a><a class="btn" href="#speed">Quick speed test</a>${toolBtns}</div>
    </div>
    ${QUOTES.length ? `<div class="card">${MOD.quoteSource ? `<span class="eyebrow">${esc(MOD.quoteSource)}</span>` : ''}<ul class="quotes">${QUOTES.map(q => `<li>${esc(q)}</li>`).join('')}</ul></div>` : ''}
  </div>

  ${HITLIST.length ? `<div class="card">
    <h2>Hit list</h2>
    <div class="tablewrap"><table class="hit"><thead><tr><th>#</th><th>Topic</th><th>Evidence</th><th></th></tr></thead><tbody>
    ${HITLIST.map((h, i) => `<tr><td>${i + 1}</td><td><div class="name">${esc(h.name)}</div><div class="row" style="margin-top:4px">${tierPill(h.tier)}${topicChip(h.t)}</div></td><td class="ev">${esc(h.ev)}</td><td>${BY_ID[h.go] ? `<button class="btn" data-go="${h.go}">Learn</button>` : ''}</td></tr>`).join('')}
    </tbody></table></div>
    ${MOD.skipHTML ? `<p class="skip">${MOD.skipHTML}</p>` : ''}
  </div>` : ''}

  ${PREDICTED.length ? `<div class="card">
    <h2>My predicted paper</h2>
    <p class="muted">A best guess at how the paper could group these topics. Sit it in Exam mode under time.</p>
    <div class="paper">
      ${PREDICTED.map(P => { const ids = P.items.filter(id => BY_ID[id]); const tot = ids.reduce((a, id) => a + ((P.marksOverride && P.marksOverride[id]) || BY_ID[id].marks), 0); return `<div class="card"><div class="row" style="justify-content:space-between"><h3>${esc(P.title)}</h3><span class="marks">${tot} marks</span></div><div class="muted small">${esc(P.sub || '')}</div><ol>${ids.map(id => `<li>${esc(shortQ(BY_ID[id].q))} <span class="mono small muted">[${(P.marksOverride && P.marksOverride[id]) || BY_ID[id].marks}]</span></li>`).join('')}</ol></div>`; }).join('')}
    </div>
    <div class="row"><button class="btn primary" data-exam="predicted">Sit the predicted paper</button></div>
  </div>` : ''}

  ${PLAN_BLOCKS.length ? `<div class="card">
    <h2>Study plan</h2>
    <p class="muted">Tick blocks off as you finish them. Your ticks stay in this browser.</p>
    <ul class="plan-list">${PLAN_BLOCKS.map(b => `<li><label class="${S.plan[b.id] ? 'done' : ''}"><input type="checkbox" id="plan-${b.id}" data-plan="${b.id}" ${S.plan[b.id] ? 'checked' : ''}><span><span class="bh">${esc(b.h)}</span><span class="bt">${esc(b.t)}</span></span></label></li>`).join('')}</ul>
  </div>` : ''}

  ${RULES.length ? `<div class="card"><h2>How to answer for marks</h2><div class="rules">${RULES.map(r => `<div><b>${esc(r[0])}</b><span class="muted">${esc(r[1])}</span></div>`).join('')}</div></div>` : ''}`;
  $$('[data-go]', v).forEach(b => b.onclick = () => { L.topic = BY_ID[b.dataset.go].t; L.tier = 'all'; L.q = ''; L.focus = b.dataset.go; rendered.learn = false; go('learn'); });
  $$('[data-plan]', v).forEach(c => c.onchange = () => { S.plan[c.dataset.plan] = c.checked; c.closest('label').classList.toggle('done', c.checked); save(); });
  const pe = $('[data-exam=predicted]', v); if (pe) pe.onclick = () => { E.set = 'predicted'; E.id = PREDICTED[0].items[0]; rendered.exam = false; go('exam'); };
}

/* ---------- LEARN ---------- */
const L = { topic: 'all', tier: 'all', q: '', unknown: false, focus: null };
function topicChips(cur, attr) {
  const tops = [['all', 'All topics', null]].concat(Object.keys(TOPICS).map(k => [k, TOPICS[k].name, TOPICS[k].c]));
  return tops.map(([k, n, c]) => `<button class="chip" ${attr}="${k}" aria-pressed="${cur === k}">${c ? `<span class="strand" style="--sc:var(${c})"></span>` : ''}${esc(n)}</button>`).join('');
}
function renderLearn() {
  const v = $('#view-learn');
  v.innerHTML = `
  <div class="card filters">
    <div class="row" style="justify-content:space-between"><h2>Model answers</h2><span class="muted small" id="learn-count"></span></div>
    <div class="chips" id="learn-topics">${topicChips(L.topic, 'data-t')}</div>
    <div class="chips" id="learn-tiers">${[['all', 'All tiers'], ['1', 'Tier 1'], ['2', 'Tier 2'], ['3', 'Tier 3']].map(([k, n]) => `<button class="chip" data-tier="${k}" aria-pressed="${String(L.tier) === k}">${n}</button>`).join('')}</div>
    <div class="searchrow"><input type="text" id="learn-q" placeholder="Search the model answers" aria-label="Search model answers" value="${esc(L.q)}"><label class="row small"><input type="checkbox" id="learn-unknown" ${L.unknown ? 'checked' : ''}> Hide ones I know</label></div>
  </div>
  <div id="learn-list" class="view"></div>`;
  $$('#learn-topics .chip').forEach(b => b.onclick = () => { L.topic = b.dataset.t; L.focus = null; $$('#learn-topics .chip').forEach(x => x.setAttribute('aria-pressed', x === b)); learnList(); });
  $$('#learn-tiers .chip').forEach(b => b.onclick = () => { L.tier = b.dataset.tier; L.focus = null; $$('#learn-tiers .chip').forEach(x => x.setAttribute('aria-pressed', x === b)); learnList(); });
  $('#learn-q').oninput = e => { L.q = e.target.value; learnList(); };
  $('#learn-unknown').onchange = e => { L.unknown = e.target.checked; learnList(); };
  learnList();
}
function learnList() {
  const ql = L.q.trim().toLowerCase();
  let items = LEARN.filter(it => (L.topic === 'all' || it.t === L.topic) && (L.tier === 'all' || String(it.tier) === String(L.tier)) && (!L.unknown || !S.known[it.id]) && (!ql || (it.q + ' ' + it.pts.join(' ') + ' ' + (it.tip || '')).toLowerCase().includes(ql)));
  items = items.slice().sort((a, b) => a.tier - b.tier);
  $('#learn-count').textContent = `${items.length} shown · ${progress().known} of ${LEARN.length} known`;
  const list = $('#learn-list');
  if (!items.length) { list.innerHTML = '<div class="card"><p>Nothing matches. Clear the search or pick another topic.</p></div>'; return; }
  list.innerHTML = items.map(it => learnCard(it)).join('');
  $$('[data-act]', list).forEach(b => b.onclick = () => learnAct(b));
  if (L.focus) { const el = $('#card-' + L.focus); if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60); L.focus = null; }
}
function learnCard(it) {
  const tag = it.steps ? 'ol' : 'ul';
  return `<article class="card ${S.known[it.id] ? 'known-on' : ''}" id="card-${it.id}">
    <div class="card-head">${tierPill(it.tier)}${topicChip(it.t)}<span class="marks">${it.marks} mark${it.marks > 1 ? 's' : ''}${it.est ? ' (est.)' : ''}</span>${S.known[it.id] ? `<span class="known-tag">${ICON.check} Known</span>` : ''}</div>
    <p class="q">${esc(it.q)}</p>
    ${it.seen && it.seen.length ? `<p class="seen">Seen in: ${esc(it.seen.join(' · '))}</p>` : ''}
    <${tag} class="pts">${it.pts.map(p => `<li>${ptHTML(p)}</li>`).join('')}</${tag}>
    ${it.tip ? `<div class="tip"><b>Exam tip.</b> ${esc(it.tip)}</div>` : ''}
    <div class="row">
      <button class="btn" data-act="read" data-id="${it.id}">${ICON.play}Read aloud</button>
      <button class="btn" data-act="exam" data-id="${it.id}">${ICON.pen}Practise in exam mode</button>
      <button class="btn needs-claude" data-act="ask" data-id="${it.id}">${ICON.spark}Ask Claude</button>
      <button class="btn ghost" data-act="known" data-id="${it.id}">${S.known[it.id] ? 'Mark as not known' : 'I know this'}</button>
    </div>
    <div class="ask" id="ask-${it.id}" hidden></div>
  </article>`;
}
function learnAct(b) {
  const it = BY_ID[b.dataset.id];
  if (b.dataset.act === 'read') TTS.speak(itemSpeech(it));
  else if (b.dataset.act === 'exam') { E.set = 'all'; E.id = it.id; rendered.exam = false; go('exam'); }
  else if (b.dataset.act === 'ask') mountAsk($('#ask-' + it.id), () => itemContext(it));
  else if (b.dataset.act === 'known') {
    S.known[it.id] = !S.known[it.id]; save();
    const card = $('#card-' + it.id); const fresh = document.createElement('div'); fresh.innerHTML = learnCard(it); const nc = fresh.firstElementChild; card.replaceWith(nc);
    $$('[data-act]', nc).forEach(x => x.onclick = () => learnAct(x));
    $('#learn-count').textContent = `${$$('#learn-list > .card').length} shown · ${progress().known} of ${LEARN.length} known`;
  }
}

/* ---------- DRILL ---------- */
const D = { topic: 'all', mode: 'smart', queue: [], cur: null, order: [], answered: false, sess: { r: 0, w: 0, streak: 0 }, total: 0 };
function drillBuild() {
  let ids = DRILL.filter(d => D.topic === 'all' || d.t === D.topic).map(d => d.id);
  if (D.mode === 'missed') ids = ids.filter(id => S.drill[id] && S.drill[id].last === 'w');
  const w = id => { const s = S.drill[id]; return (s ? (s.last === 'w' ? 3 : 0) : 1.5) + Math.random() * 2; };
  D.queue = ids.map(id => [id, w(id)]).sort((a, b) => b[1] - a[1]).map(x => x[0]);
  D.total = D.queue.length; D.cur = null; D.answered = false;
}
function renderDrill() {
  const v = $('#view-drill');
  v.innerHTML = `
  <div class="card filters">
    <div class="drill-top"><h2>Drill</h2><span class="muted small" id="drill-sess"></span></div>
    <div class="chips" id="drill-topics">${topicChips(D.topic, 'data-t')}</div>
    <div class="chips"><button class="chip" data-m="smart" aria-pressed="${D.mode === 'smart'}">Weakest first</button><button class="chip" data-m="missed" aria-pressed="${D.mode === 'missed'}">Only ones I got wrong</button></div>
    <p class="small muted">Questions you miss come back a few cards later. Keys: <span class="kbd">1</span>–<span class="kbd">4</span> to answer, <span class="kbd">Enter</span> for next.</p>
  </div>
  <div id="drill-card"></div>
  <div class="card" id="drill-mastery"></div>`;
  $$('#drill-topics .chip', v).forEach(b => b.onclick = () => { D.topic = b.dataset.t; $$('#drill-topics .chip', v).forEach(x => x.setAttribute('aria-pressed', x === b)); drillBuild(); drillNext(); });
  $$('[data-m]', v).forEach(b => b.onclick = () => { D.mode = b.dataset.m; $$('[data-m]', v).forEach(x => x.setAttribute('aria-pressed', x === b)); drillBuild(); drillNext(); });
  drillBuild(); drillMastery();
}
function drillNext() {
  if (!rendered.drill) return;
  TTS.stop();
  const box = $('#drill-card');
  D.answered = false;
  if (!D.queue.length) {
    D.cur = null;
    const none = D.mode === 'missed' ? 'No missed questions here. Everything in this set is currently right.' : (DRILL.length ? 'You’ve been through every question in this set.' : 'This module has no drill questions yet.');
    box.innerHTML = `<div class="card donebox"><h3>${esc(none)}</h3><p class="muted">This session: ${D.sess.r} right, ${D.sess.w} wrong.</p><div class="row"><button class="btn primary" id="drill-again">Go again</button>${D.mode === 'smart' ? '<button class="btn" id="drill-missed">Only the ones I got wrong</button>' : ''}</div></div>`;
    $('#drill-again').onclick = () => { drillBuild(); drillNext(); };
    const m = $('#drill-missed'); if (m) m.onclick = () => { D.mode = 'missed'; $$('[data-m]').forEach(x => x.setAttribute('aria-pressed', x.dataset.m === 'missed')); drillBuild(); drillNext(); };
    drillSess(); return;
  }
  const id = D.queue.shift(); D.cur = DRILL_BY_ID[id];
  D.order = shuffle(D.cur.o.map((o, i) => i));
  const done = D.total - D.queue.length;
  box.innerHTML = `<div class="card">
    <div class="meter" aria-hidden="true"><i style="width:${Math.min(100, Math.round(100 * (done - 1) / Math.max(1, D.total)))}%"></i></div>
    <div class="card-head">${topicChip(D.cur.t)}<span class="muted small">Card ${done} of ${D.total}${S.drill[id] && S.drill[id].last === 'w' ? ' · you missed this last time' : ''}</span></div>
    <p class="q">${esc(D.cur.q)}</p>
    <div class="opts">${D.order.map((oi, k) => `<button class="opt" data-k="${k}"><span class="k">${k + 1}</span><span>${esc(D.cur.o[oi][0])}</span></button>`).join('')}</div>
    <div id="drill-fb"></div>
  </div>`;
  $$('.opt', box).forEach(b => b.onclick = () => drillAnswer(+b.dataset.k));
  drillSess();
}
function drillAnswer(k) {
  if (D.answered || !D.cur) return;
  D.answered = true;
  const it = D.cur, oi = D.order[k], ok = oi === it.a;
  const st = S.drill[it.id] || { r: 0, w: 0, last: '' };
  if (ok) { st.r++; st.last = 'r'; D.sess.r++; D.sess.streak++; }
  else { st.w++; st.last = 'w'; D.sess.w++; D.sess.streak = 0; D.queue.splice(Math.min(3, D.queue.length), 0, it.id); D.total++; }
  S.drill[it.id] = st; save();
  $$('#drill-card .opt').forEach((b, kk) => { b.disabled = true; const o = D.order[kk]; if (o === it.a) b.classList.add('right'); else if (kk === k) b.classList.add('wrong'); });
  const right = it.o[it.a], chose = it.o[oi];
  const fb = $('#drill-fb');
  fb.innerHTML = ok
    ? `<div class="fb ok"><h3>Correct</h3><p>${esc(right[1])}</p>${it.tip ? `<p><span class="lbl">Remember:</span> ${esc(it.tip)}</p>` : ''}</div>`
    : `<div class="fb no"><h3>Not quite</h3><p><span class="lbl">Why “${esc(chose[0])}” is wrong:</span> ${esc(chose[1])}</p><p><span class="lbl">The answer:</span> ${esc(right[0])}. ${esc(right[1])}</p>${it.tip ? `<p><span class="lbl">Avoid this trap:</span> ${esc(it.tip)}</p>` : ''}<p class="small">This one will come back in a few cards.</p></div>`;
  fb.insertAdjacentHTML('beforeend', `<div class="row" style="margin-top:10px"><button class="btn primary" id="drill-next">Next question</button><button class="btn" id="drill-read">${ICON.play}Read explanation</button><button class="btn needs-claude" id="drill-ask">${ICON.spark}Explain it differently</button></div><div class="ask" id="drill-askbox" hidden></div>`);
  const speech = ok ? `Correct. ${right[1]} ${it.tip ? 'Remember: ' + it.tip : ''}` : `Not quite. You chose: ${chose[0]}. ${chose[1]} The correct answer is: ${right[0]}. ${right[1]} ${it.tip ? 'To avoid this trap: ' + it.tip : ''}`;
  $('#drill-next').onclick = drillNext;
  $('#drill-read').onclick = () => TTS.speak(speech);
  $('#drill-ask').onclick = () => mountAsk($('#drill-askbox'), () => `Multiple-choice question: ${it.q}\nOptions: ${it.o.map(o => o[0]).join(' | ')}\nCorrect answer: ${right[0]} (${right[1]})\nThe student chose: ${chose[0]}${ok ? ' (correct)' : ' (wrong: ' + chose[1] + ')'}`, ok ? 'Explain this idea a different way, with a simple real-world example.' : 'I got this wrong. Explain the idea a different way, with a simple real-world example, so I don’t confuse it again.');
  if (!ok && S.settings.auto) TTS.speak(speech);
  $('#drill-next').focus({ preventScroll: true });
  drillSess(); drillMastery();
}
function drillSess() { const s = $('#drill-sess'); if (s) s.textContent = `This session: ${D.sess.r} right · ${D.sess.w} wrong${D.sess.streak > 2 ? ` · streak ${D.sess.streak}` : ''}`; }
function drillMastery() {
  const box = $('#drill-mastery'); if (!box) return;
  const rows = Object.keys(TOPICS).map(t => {
    const ids = DRILL.filter(d => d.t === t).map(d => d.id); if (!ids.length) return '';
    const right = ids.filter(id => S.drill[id] && S.drill[id].last === 'r');
    const pct = Math.round(100 * right.length / ids.length);
    return `<tr><td>${topicChip(t)}</td><td class="mono">${right.length}/${ids.length}</td><td style="width:40%"><div class="meter"><i style="width:${pct}%"></i></div></td></tr>`;
  }).join('');
  box.innerHTML = `<h3>Mastery by topic</h3><p class="small muted">Questions whose last answer was right, out of all questions in the topic.</p><div class="tablewrap"><table><tbody>${rows}</tbody></table></div>`;
}
document.addEventListener('keydown', e => {
  const dv = $('#view-drill'); if (!dv || dv.hidden) return;
  const tg = e.target && e.target.tagName; if (tg === 'INPUT' || tg === 'TEXTAREA' || tg === 'SELECT') return;
  if (!D.answered && /^[1-4]$/.test(e.key)) { const n = +e.key - 1; if (D.cur && n < D.cur.o.length) { e.preventDefault(); drillAnswer(n); } }
  else if (D.answered && (e.key === 'Enter' || e.key === 'n') && !(tg === 'BUTTON' && e.key === 'Enter' && e.target.id !== 'drill-next')) { e.preventDefault(); drillNext(); }
});

/* ---------- SPEED TEST ---------- */
const SP = { topic: 'all', len: 10, secs: 30, auto: true, read: false, round: null, timer: null };
const spKey = () => `${SP.topic}|${SP.len}`;
function speedStore() { S.speed = Object.assign({ best: {}, rounds: 0 }, S.speed || {}); return S.speed; }
function speedClear() { if (SP.timer) { clearInterval(SP.timer); clearTimeout(SP.timer); SP.timer = null; } }
function speedPause() { const R = SP.round; if (R && !R.done && SP.timer) { speedClear(); R.paused = R.answered ? 'next' : 'q'; } }
function speedResume() { const R = SP.round; if (R && R.paused) { const p = R.paused; R.paused = false; if (p === 'next') speedNext(); else speedQuestion(); } }
function renderSpeed() { const R = SP.round; if (R && R.done) speedEnd(); else if (R) speedQuestion(); else speedSetup(); }
function speedSetup() {
  speedClear(); SP.round = null;
  const v = $('#view-speed'); const st = speedStore(); const best = st.best[spKey()];
  const chip = (attr, val, cur, label) => `<button class="chip" data-${attr}="${val}" aria-pressed="${String(cur) === String(val)}">${label}</button>`;
  const pool = DRILL.filter(d => SP.topic === 'all' || d.t === SP.topic).length;
  v.innerHTML = `<div class="card filters">
    <div class="row" style="justify-content:space-between"><h2>Speed test</h2><span class="muted small">${st.rounds} round${st.rounds === 1 ? '' : 's'} played</span></div>
    <p>Quick-fire multiple choice for on the go. Tap an answer: right answers move on by themselves, wrong ones stop and explain why.</p>
    <div><div class="eyebrow">Topic</div><div class="chips" id="sp-topics">${topicChips(SP.topic, 'data-t')}</div></div>
    <div class="sp-opts">
      <div><div class="eyebrow">Questions</div><div class="chips">${[10, 20, 30].map(n => chip('len', n, SP.len, n)).join('')}</div></div>
      <div><div class="eyebrow">Time per question</div><div class="chips">${[[0, 'No timer'], [15, '15 s'], [30, '30 s']].map(([n, l]) => chip('secs', n, SP.secs, l)).join('')}</div></div>
    </div>
    <label class="row small"><input type="checkbox" id="sp-auto" ${SP.auto ? 'checked' : ''}> Move on by itself when I'm right</label>
    <label class="row small"><input type="checkbox" id="sp-read" ${SP.read ? 'checked' : ''}> Read each question and its options aloud (turns the timer off)</label>
    <div class="row"><button class="btn primary sp-start" id="sp-start" ${pool ? '' : 'disabled'}>Start ${Math.min(SP.len, pool)} questions</button><span class="small muted">${best ? `Best for this setup: ${best.score}/${best.of}` : 'No best score yet for this setup.'}</span></div>
    <p class="small muted">Questions you got wrong before come up more often. Keys: <span class="kbd">1</span>–<span class="kbd">4</span> to answer, <span class="kbd">Enter</span> for next.</p>
  </div>`;
  $$('#sp-topics .chip', v).forEach(b => b.onclick = () => { SP.topic = b.dataset.t; speedSetup(); });
  $$('[data-len]', v).forEach(b => b.onclick = () => { SP.len = +b.dataset.len; speedSetup(); });
  $$('[data-secs]', v).forEach(b => b.onclick = () => { SP.secs = +b.dataset.secs; speedSetup(); });
  $('#sp-auto').onchange = e => { SP.auto = e.target.checked; };
  $('#sp-read').onchange = e => { SP.read = e.target.checked; };
  $('#sp-start').onclick = () => speedStart();
}
function speedStart(ids) {
  let pool = ids;
  if (!pool) {
    const w = id => { const s = S.drill[id]; return (s ? (s.last === 'w' ? 3 : 0) : 1.5) + Math.random() * 2.5; };
    pool = shuffle(DRILL.filter(d => SP.topic === 'all' || d.t === SP.topic).map(d => [d.id, w(d.id)]).sort((a, b) => b[1] - a[1]).map(x => x[0]).slice(0, SP.len));
  }
  if (!pool.length) return speedSetup();
  SP.round = { ids: pool, i: 0, res: [], retry: !!ids, key: spKey(), answered: false };
  speedStore().rounds++; save();
  speedQuestion();
}
function speedQuestion() {
  speedClear(); TTS.stop();
  const R = SP.round, v = $('#view-speed'), it = DRILL_BY_ID[R.ids[R.i]];
  R.order = shuffle(it.o.map((o, i) => i)); R.answered = false; R.qt = Date.now();
  const right = R.res.filter(x => x.ok).length, useTimer = SP.secs > 0 && !SP.read;
  v.innerHTML = `<div class="card speed-card">
    <div class="sp-head"><span class="mono"><b>Q ${R.i + 1}</b>/${R.ids.length}</span><span class="mono muted">${right} right · ${R.res.length - right} wrong</span><button class="btn ghost" id="sp-quit">End round</button></div>
    <div class="meter" aria-hidden="true"><i style="width:${Math.round(100 * R.i / R.ids.length)}%"></i></div>
    ${useTimer ? '<div class="sp-timer" aria-hidden="true"><i id="sp-tbar"></i></div>' : ''}
    <div class="card-head">${topicChip(it.t)}</div>
    <p class="q sp-q">${esc(it.q)}</p>
    <div class="opts">${R.order.map((oi, k) => `<button class="opt sp-opt" data-k="${k}"><span class="k">${k + 1}</span><span>${esc(it.o[oi][0])}</span></button>`).join('')}</div>
    <div id="sp-fb" aria-live="polite"></div>
  </div>`;
  $$('.sp-opt', v).forEach(b => b.onclick = () => speedAnswer(+b.dataset.k));
  $('#sp-quit').onclick = () => { speedClear(); TTS.stop(); if (R.res.length) { R.done = true; speedEnd(); } else speedSetup(); };
  if (SP.read) TTS.speak(`${it.q} ` + R.order.map((oi, k) => `Option ${k + 1}. ${it.o[oi][0]}.`).join(' '));
  if (useTimer) {
    const ms = SP.secs * 1000;
    SP.timer = setInterval(() => {
      const left = ms - (Date.now() - R.qt), el = $('#sp-tbar');
      if (el) { el.style.width = Math.max(0, 100 * left / ms) + '%'; el.classList.toggle('low', left < ms * 0.3); }
      if (left <= 0) speedAnswer(-1);
    }, 100);
  }
  W.scrollTo({ top: 0 });
}
function speedAnswer(k) {
  const R = SP.round; if (!R || R.answered || R.done) return;
  R.answered = true; speedClear();
  const it = DRILL_BY_ID[R.ids[R.i]], oi = k < 0 ? -1 : R.order[k], ok = oi === it.a;
  R.res.push({ id: it.id, ok, picked: oi, ms: Date.now() - R.qt });
  const st = S.drill[it.id] || { r: 0, w: 0, last: '' }; if (ok) { st.r++; st.last = 'r'; } else { st.w++; st.last = 'w'; } S.drill[it.id] = st; save();
  $$('#view-speed .sp-opt').forEach((b, kk) => { b.disabled = true; const o = R.order[kk]; if (o === it.a) b.classList.add('right'); else if (kk === k) b.classList.add('wrong'); });
  const right = it.o[it.a], last = R.i >= R.ids.length - 1, nextLbl = last ? 'See my score' : 'Next question';
  const fb = $('#sp-fb');
  if (ok) {
    fb.innerHTML = `<div class="fb ok"><h3>Correct</h3><p>${esc(right[1])}</p>${SP.auto ? '<div class="sp-auto" aria-hidden="true"><i></i></div>' : ''}<div class="row"><button class="btn primary" id="sp-next">${nextLbl}</button></div></div>`;
    if (S.settings.auto) TTS.speak('Correct.');
    if (SP.auto) { const bar = $('.sp-auto i', fb); requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.width = '100%'; })); SP.timer = setTimeout(speedNext, 1700); }
  } else {
    const chose = oi >= 0 ? it.o[oi] : null;
    fb.innerHTML = `<div class="fb no"><h3>${chose ? 'Not quite' : 'Time’s up'}</h3>${chose ? `<p><span class="lbl">Why “${esc(chose[0])}” is wrong:</span> ${esc(chose[1])}</p>` : ''}<p><span class="lbl">The answer:</span> ${esc(right[0])}. ${esc(right[1])}</p>${it.tip ? `<p><span class="lbl">Avoid this trap:</span> ${esc(it.tip)}</p>` : ''}<div class="row"><button class="btn primary" id="sp-next">${nextLbl}</button><button class="btn" id="sp-readfb">${ICON.play}Read explanation</button></div></div>`;
    const speech = (chose ? `Not quite. You chose: ${chose[0]}. ${chose[1]} ` : 'Time’s up. ') + `The correct answer is: ${right[0]}. ${right[1]} ${it.tip ? 'To avoid this trap: ' + it.tip : ''}`;
    $('#sp-readfb').onclick = () => TTS.speak(speech);
    if (S.settings.auto) TTS.speak(speech);
  }
  $('#sp-next').onclick = () => speedNext();
  $('#sp-next').focus({ preventScroll: true });
  fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
function speedNext() {
  const R = SP.round; if (!R || !R.answered || R.done) return;
  speedClear();
  if (R.i >= R.ids.length - 1) { R.done = true; speedEnd(); } else { R.i++; speedQuestion(); }
}
function speedEnd() {
  speedClear();
  const R = SP.round, v = $('#view-speed'), n = R.res.length, sc = R.res.filter(x => x.ok).length;
  const pct = n ? Math.round(100 * sc / n) : 0;
  const avg = n ? (R.res.reduce((a, x) => a + x.ms, 0) / n / 1000).toFixed(1) : '0';
  const st = speedStore(); let newBest = false;
  if (!R.retry && !R.saved && n === R.ids.length) { const b = st.best[R.key]; if (!b || sc > b.score) { st.best[R.key] = { score: sc, of: n }; newBest = true; } R.saved = true; save(); }
  const miss = R.res.filter(x => !x.ok);
  const verdict = pct >= 90 ? 'Exam-ready on these. Try a longer round or another topic.' : pct >= 70 ? 'Solid. Clean up the misses below, then retry them.' : pct >= 50 ? 'Getting there. Read every miss below, then retry them.' : 'Go back to the Learn cards for these topics, then retry.';
  v.innerHTML = `<div class="card speed-card">
    <span class="eyebrow">${R.retry ? 'Retry of missed questions' : 'Round complete'}</span>
    <div class="row" style="align-items:flex-end;gap:16px"><div class="score mono">${sc}/${n}</div><div class="muted">${pct}% · ${avg} s per question${newBest ? ' · <span class="ok-t">new best</span>' : ''}</div></div>
    <p>${esc(verdict)}</p>
    <div class="row">${miss.length ? `<button class="btn primary" id="sp-retry">Retry the ${miss.length} I missed</button>` : ''}<button class="btn${miss.length ? '' : ' primary'}" id="sp-again">New round</button><button class="btn ghost" id="sp-setup">Change settings</button><button class="btn ghost" id="sp-readsum">${ICON.play}Read summary</button></div>
  </div>
  ${miss.length ? `<div class="card"><h3>What you missed</h3><ol class="pts sp-miss">${miss.map(x => { const it = DRILL_BY_ID[x.id], r = it.o[it.a], c = x.picked >= 0 ? it.o[x.picked] : null; return `<li><b>${esc(it.q)}</b><span>${c ? `<span class="no-t">You:</span> ${esc(c[0])}. ${esc(c[1])}` : '<span class="no-t">Ran out of time.</span>'}</span><span><span class="ok-t">Answer:</span> ${esc(r[0])}. ${esc(r[1])}</span></li>`; }).join('')}</ol></div>` : ''}`;
  const retry = $('#sp-retry'); if (retry) retry.onclick = () => speedStart(shuffle(miss.map(x => x.id)));
  $('#sp-again').onclick = () => speedStart();
  $('#sp-setup').onclick = () => speedSetup();
  $('#sp-readsum').onclick = () => TTS.speak(`You scored ${sc} out of ${n}. ${verdict} ` + miss.map(x => { const it = DRILL_BY_ID[x.id]; return `${it.q} The answer is: ${it.o[it.a][0]}.`; }).join(' '));
  W.scrollTo({ top: 0 });
}
document.addEventListener('keydown', e => {
  const sv = $('#view-speed'); const R = SP.round;
  if (!sv || sv.hidden || !R || R.done) return;
  const tg = e.target && e.target.tagName; if (tg === 'INPUT' || tg === 'TEXTAREA' || tg === 'SELECT') return;
  if (!R.answered && /^[1-4]$/.test(e.key) && +e.key - 1 < R.order.length) { e.preventDefault(); speedAnswer(+e.key - 1); }
  else if (R.answered && (e.key === 'Enter' || e.key === 'n') && !(tg === 'BUTTON' && e.key === 'Enter' && e.target.id !== 'sp-next')) { e.preventDefault(); speedNext(); }
});

/* ---------- EXAM ---------- */
const E = { set: PREDICTED.length ? 'predicted' : 'all', id: null, timer: { on: false, start: 0, acc: 0, h: null }, ctl: null };
function examList() {
  if (E.set === 'predicted') { const out = []; PREDICTED.forEach(P => P.items.filter(id => BY_ID[id]).forEach((id, si) => out.push({ id, label: `${P.title.replace(/\s*·\s*compulsory/i, '')} (${String.fromCharCode(97 + si)})`, marks: (P.marksOverride && P.marksOverride[id]) || BY_ID[id].marks, group: P.title + (P.sub ? ' · ' + P.sub : '') }))); return out; }
  const items = LEARN.filter(it => E.set === 'all' || it.t === E.set).slice().sort((a, b) => a.tier - b.tier);
  return items.map(it => ({ id: it.id, label: shortQ(it.q), marks: it.marks, group: (TOPICS[it.t] || { name: it.t }).name }));
}
function renderExam() {
  const v = $('#view-exam');
  if (!LEARN.length) { v.innerHTML = '<div class="card"><p>This module has no questions yet.</p></div>'; return; }
  let list = examList();
  if (!list.length) { E.set = 'all'; list = examList(); }
  if (!E.id || !list.find(x => x.id === E.id)) E.id = list[0].id;
  const sets = (PREDICTED.length ? [['predicted', 'Predicted paper']] : []).concat([['all', 'All questions']], Object.keys(TOPICS).map(k => [k, TOPICS[k].name]));
  v.innerHTML = `
  <div class="card filters">
    <div class="row" style="justify-content:space-between"><h2>Exam mode</h2><span class="muted small">Write first, then reveal the mark scheme<span class="needs-claude"> or let Claude mark it</span>.</span></div>
    <div class="exam-nav">
      <label for="exam-set" class="small muted">Set</label>
      <select id="exam-set">${sets.map(([k, n]) => `<option value="${k}"${E.set === k ? ' selected' : ''}>${esc(n)}</option>`).join('')}</select>
    </div>
    <div class="exam-nav">
      <button class="btn" id="exam-prev" aria-label="Previous question">←</button>
      <select id="exam-q" aria-label="Question"></select>
      <button class="btn" id="exam-next" aria-label="Next question">→</button>
    </div>
  </div>
  <div id="exam-work"></div>`;
  const sel = $('#exam-q'); let lastG = null, html = '';
  list.forEach(x => { if (x.group !== lastG) { if (lastG !== null) html += '</optgroup>'; html += `<optgroup label="${esc(x.group)}">`; lastG = x.group; } html += `<option value="${x.id}"${x.id === E.id ? ' selected' : ''}>${esc(x.label)} [${x.marks}]</option>`; });
  sel.innerHTML = html + '</optgroup>';
  $('#exam-set').onchange = e => { E.set = e.target.value; E.id = null; renderExam(); };
  sel.onchange = e => { E.id = e.target.value; examWork(); };
  $('#exam-prev').onclick = () => examStep(-1);
  $('#exam-next').onclick = () => examStep(1);
  examWork();
}
function examStep(d) { const list = examList(); const i = list.findIndex(x => x.id === E.id); const n = list[(i + d + list.length) % list.length]; E.id = n.id; $('#exam-q').value = n.id; examWork(); W.scrollTo({ top: 0, behavior: 'smooth' }); }
function fmtTime(ms) { const s = Math.floor(ms / 1000); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }
function timerStop() { if (E.timer.h) clearInterval(E.timer.h); E.timer = { on: false, start: 0, acc: 0, h: null }; }
function examWork() {
  TTS.stop(); timerStop(); if (E.ctl) { E.ctl.abort(); E.ctl = null; }
  const it = BY_ID[E.id]; const meta = examList().find(x => x.id === E.id); const marks = meta.marks;
  const mins = Math.max(2, Math.round(marks * (MOD.minutesPerMark || 1.8)));
  const box = $('#exam-work');
  box.innerHTML = `<div class="card">
    <div class="card-head">${E.set === 'predicted' ? `<span class="pill tier1">${esc(meta.label)}</span>` : tierPill(it.tier)}${topicChip(it.t)}<span class="marks">${marks} mark${marks > 1 ? 's' : ''}</span></div>
    <p class="q">${esc(it.q)}</p>
    ${it.seen && it.seen.length ? `<p class="seen">Seen in: ${esc(it.seen.join(' · '))}</p>` : ''}
    <div class="row"><span class="small muted">Suggested time: about ${mins} min</span><span class="timer" id="exam-timer">00:00</span><button class="btn" id="exam-tbtn">Start timer</button><button class="btn ghost" id="exam-treset">Reset</button><button class="btn ghost" id="exam-read">${ICON.play}Read question</button></div>
    <label for="exam-answer" class="small muted">Your answer (saved in this browser as you type)</label>
    <textarea id="exam-answer" placeholder="Write it the way you would in the exam: one point per line, each one explained.">${esc(S.drafts[it.id] || '')}</textarea>
    <div class="row">
      <button class="btn primary needs-claude" id="exam-mark">${ICON.spark}Mark my answer with Claude</button>
      <button class="btn" id="exam-scheme">Show mark scheme</button>
      <button class="btn ghost" id="exam-clear">Clear answer</button>
    </div>
    <div id="exam-result"></div>
    <div id="exam-schemebox" hidden></div>
  </div>`;
  const ta = $('#exam-answer');
  ta.oninput = () => { S.drafts[it.id] = ta.value; save(); };
  $('#exam-read').onclick = () => TTS.speak(`${it.q} For ${marks} marks.`);
  $('#exam-tbtn').onclick = () => {
    const T = E.timer, b = $('#exam-tbtn');
    if (T.on) { T.acc += Date.now() - T.start; T.on = false; clearInterval(T.h); b.textContent = 'Resume timer'; }
    else { T.start = Date.now(); T.on = true; b.textContent = 'Pause timer'; T.h = setInterval(() => { const el = $('#exam-timer'); if (!el) { clearInterval(T.h); return; } const ms = T.acc + (Date.now() - T.start); el.textContent = fmtTime(ms); el.style.color = ms > mins * 60000 ? 'var(--bad)' : ''; }, 500); }
  };
  $('#exam-treset').onclick = () => { timerStop(); $('#exam-timer').textContent = '00:00'; $('#exam-timer').style.color = ''; $('#exam-tbtn').textContent = 'Start timer'; };
  $('#exam-clear').onclick = () => { if (!ta.value) return; S.drafts[it.id] = ''; ta.value = ''; save(); toast('Answer cleared'); };
  $('#exam-scheme').onclick = () => {
    const sb = $('#exam-schemebox'); sb.hidden = !sb.hidden; $('#exam-scheme').textContent = sb.hidden ? 'Show mark scheme' : 'Hide mark scheme';
    if (!sb.hidden) {
      const ticks = S.ticks[it.id] || [];
      sb.innerHTML = `<div class="result" style="background:var(--surface)"><h3>Mark scheme</h3><p class="small muted">Tick each point your answer actually covered and explained.</p><ul class="pts scheme">${it.pts.map((p, i) => `<li><label><input type="checkbox" id="tick-${it.id}-${i}" data-i="${i}" ${ticks.includes(i) ? 'checked' : ''}><span>${ptHTML(p)}</span></label></li>`).join('')}</ul>${it.tip ? `<div class="tip"><b>Exam tip.</b> ${esc(it.tip)}</div>` : ''}<p id="tick-sum" class="small"></p></div>`;
      const upd = () => { const t = $$('input[data-i]', sb).filter(c => c.checked).map(c => +c.dataset.i); S.ticks[it.id] = t; save(); $('#tick-sum').innerHTML = `<b>${t.length} of ${it.pts.length}</b> points covered. ${t.length >= Math.min(it.pts.length, marks) ? 'That’s enough points for full marks if each one was explained.' : `For ${marks} marks you want about ${Math.min(it.pts.length, marks)} explained points.`}`; };
      $$('input[data-i]', sb).forEach(c => c.onchange = upd); upd();
    }
  };
  $('#exam-mark').onclick = () => examMark(it, marks);
}
async function examMark(it, marks) {
  const ans = $('#exam-answer').value.trim(); const out = $('#exam-result');
  if (!ans) { out.innerHTML = '<p class="small no-t">Write your answer first, then ask Claude to mark it.</p>'; return; }
  if (!AI.mode) return;
  if (E.ctl) E.ctl.abort();
  const ctl = E.ctl = new AbortController(); const btn = $('#exam-mark'); btn.disabled = true;
  out.innerHTML = `<div class="result"><p>Marking against the scheme… this can take up to a minute.</p><div class="row"><button class="btn" id="exam-cancel">Cancel</button></div></div>`;
  $('#exam-cancel').onclick = () => ctl.abort();
  const prompt = `You are marking one answer from the ${[MOD.code, MOD.name].filter(Boolean).join(' ')} ${MOD.examName || 'exam'}${MOD.institution ? ' at ' + MOD.institution : ''} (${MOD.level || 'university level'}). Mark it the way the lecturer does: strictly, using the mark scheme and the lecture slides. One-word answers and bare lists earn nothing; each mark needs a correct point that is explained (and linked to the scenario when the question has one). Accept other correct, well-explained points that are not in the scheme. A blank or off-topic answer scores 0.\n\nQUESTION (${marks} marks):\n${it.q}\n\nMARK SCHEME (model points; there can be more points than marks):\n${it.pts.map((p, i) => `${i + 1}. ${p.replace('::', ': ')}`).join('\n')}\n${it.tip ? 'Marker note: ' + it.tip + '\n' : ''}\nSTUDENT ANSWER:\n<<<\n${ans.slice(0, 6000)}\n>>>\n\nReply with only JSON in exactly this shape:\n{"score": <integer from 0 to ${marks}>, "outOf": ${marks}, "awarded": [{"point": "<what they got right, short>", "marks": <number>}], "missed": ["<a scheme point they missed, or only named without explaining, short>"], "feedback": "<2 or 3 direct sentences in plain English, speaking to the student as you>", "fix": "<one sentence: the single change that would gain the most marks>"}`;
  try {
    const r = await AI.json(prompt, { signal: ctl.signal });
    const sc = Math.max(0, Math.min(marks, Math.round(Number(r && r.score) || 0)));
    const aw = Array.isArray(r && r.awarded) ? r.awarded : []; const mi = Array.isArray(r && r.missed) ? r.missed : [];
    out.innerHTML = `<div class="result">
      <div class="row" style="justify-content:space-between;align-items:flex-end"><div><div class="eyebrow">Claude's mark</div><div class="score mono">${sc}/${marks}</div></div><button class="btn" id="exam-readfb">${ICON.play}Read feedback</button></div>
      ${r.feedback ? `<p>${esc(tidy(r.feedback))}</p>` : ''}
      ${aw.length ? `<div><span class="ok-t">Earned</span><ul>${aw.map(a => `<li>${esc(tidy(a && a.point))}${a && a.marks != null ? ` <span class="mono small">(+${esc(a.marks)})</span>` : ''}</li>`).join('')}</ul></div>` : ''}
      ${mi.length ? `<div><span class="no-t">Missed</span><ul>${mi.map(m => `<li>${esc(tidy(m))}</li>`).join('')}</ul></div>` : ''}
      ${r.fix ? `<div class="tip"><b>Biggest fix.</b> ${esc(tidy(r.fix))}</div>` : ''}
      <p class="small muted">Claude marks against the model scheme. Use it as a guide; your lecturer's marking decides.</p>
    </div>`;
    const speech = `You scored ${sc} out of ${marks}. ${tidy(r.feedback || '')} ${mi.length ? 'You missed: ' + mi.map(tidy).join('. ') + '.' : ''} ${r.fix ? 'Biggest fix: ' + tidy(r.fix) : ''}`;
    $('#exam-readfb').onclick = () => TTS.speak(speech);
    if (S.settings.auto) TTS.speak(speech);
  } catch (e) { const m = claudeErr(e); out.innerHTML = m ? `<div class="result"><p class="no-t">${esc(m)}</p></div>` : ''; }
  finally { if (E.ctl === ctl) E.ctl = null; const b = $('#exam-mark'); if (b) b.disabled = false; }
}

const RENDER = { plan: renderPlan, learn: renderLearn, drill: renderDrill, speed: renderSpeed, exam: renderExam };
TOOLS.forEach(t => { RENDER[t.id] = () => t.render($('#view-' + t.id), CTX); });

/* ---------- boot ---------- */
function boot() {
  buildShell();
  const vp = $('#voice-panel'), vb = $('#btn-voice');
  vb.onclick = () => { vp.hidden = !vp.hidden; vb.setAttribute('aria-expanded', String(!vp.hidden)); };
  $('#btn-stop').onclick = () => TTS.stop();
  const rate = $('#voice-rate'); rate.value = S.settings.rate; $('#rate-val').textContent = Number(S.settings.rate).toFixed(2).replace(/0$/, '') + '×';
  rate.oninput = () => { S.settings.rate = +rate.value; $('#rate-val').textContent = Number(rate.value).toFixed(2).replace(/0$/, '') + '×'; save(); };
  const auto = $('#voice-auto'); auto.checked = !!S.settings.auto; auto.onchange = () => { S.settings.auto = auto.checked; save(); };
  $('#voice-select').onchange = e => { S.settings.voice = e.target.value; save(); };
  $('#voice-test').onclick = () => { TTS.fill(); TTS.speak(MOD.voiceTest || 'If you can hear this clearly, the voice is ready.'); };
  const k = $('#ai-key'), m = $('#ai-model'), st = $('#ai-status');
  m.value = aiCfg.model; k.value = aiCfg.key ? '••••••••' : '';
  const aiMsg = () => { st.textContent = aiCfg.key ? 'A key is saved in this browser. The Claude buttons are on.' : 'No key saved. The Claude buttons stay hidden; everything else works.'; };
  $('#ai-save').onclick = () => { const v = k.value.trim(); if (v && !/^•+$/.test(v)) aiCfg.key = v; aiCfg.model = m.value.trim() || MOD.defaultModel || 'claude-sonnet-5-5'; try { localStorage.setItem(AI_STORE, JSON.stringify(aiCfg)); } catch (e) {} k.value = aiCfg.key ? '••••••••' : ''; AI.refresh(); aiMsg(); toast(aiCfg.key ? 'Key saved in this browser' : 'Model saved'); };
  $('#ai-forget').onclick = () => { aiCfg.key = ''; try { localStorage.setItem(AI_STORE, JSON.stringify(aiCfg)); } catch (e) {} k.value = ''; AI.refresh(); aiMsg(); toast('Key removed from this browser'); };
  aiMsg();
  TTS.init();
  AI.refresh();
  if (inClaude) { (async () => { try { AI.sample = await W.claude.use('sample'); } catch (e) { AI.sample = null; } AI.refresh(); })(); }
  W.addEventListener('hashchange', route);
  route();
}
boot();
})();
