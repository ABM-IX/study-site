/* Subnet lab tool: VLSM problem generator, answer checker and worked solutions.
   Turn it on for a module by adding "subnet" to MODULE.tools. Load this file before engine.js. */
(function () {
'use strict';
const P32 = 4294967296;
const ORD = ['', '1st', '2nd', '3rd', '4th'];
function ip2n(s) { const p = String(s).trim().split('.'); if (p.length !== 4) return NaN; let n = 0; for (const x of p) { if (!/^\d{1,3}$/.test(x)) return NaN; const v = +x; if (v > 255) return NaN; n = n * 256 + v; } return n; }
function n2ip(n) { return [Math.floor(n / 16777216) % 256, Math.floor(n / 65536) % 256, Math.floor(n / 256) % 256, n % 256].join('.'); }
function maskN(prefix) { return prefix === 0 ? 0 : P32 - Math.pow(2, 32 - prefix); }
function vlsm(base, basePrefix, reqs) {
  const sorted = reqs.map((r, i) => Object.assign({ i }, r)).sort((a, b) => b.hosts - a.hosts || a.i - b.i);
  let ptr = base; const end = base + Math.pow(2, 32 - basePrefix) - 1; const rows = [];
  for (const r of sorted) {
    let h = 2; while (Math.pow(2, h) - 2 < r.hosts) h++;
    const size = Math.pow(2, h); const net = ptr; const bc = net + size - 1;
    rows.push({ name: r.name, hosts: r.hosts, h, size, prefix: 32 - h, mask: maskN(32 - h), net, first: net + 1, last: bc - 1, bc, overflow: bc > end });
    ptr = bc + 1;
  }
  return rows;
}
function explainRow(r) {
  const full = Math.floor(r.h / 8), rem = r.h % 8, io = 4 - full, block = Math.pow(2, rem);
  const oct = n => n2ip(n).split('.').map(Number);
  const no = oct(r.net), bo = oct(r.bc);
  const lines = [];
  lines.push(`${r.name} needs ${r.hosts} hosts. ${r.hosts} + 2 (network and broadcast) = ${r.hosts + 2}. The next power of 2 is ${r.size} = 2^${r.h}, so ${r.h} host bits and the prefix is 32 − ${r.h} = /${r.prefix}.`);
  if (full === 0) lines.push(`All ${r.h} host bits are in the 4th octet, so the block size in the 4th octet is 2^${r.h} = ${block}. Mask 4th octet = 256 − ${block} = ${256 - block}, giving ${n2ip(r.mask)}.`);
  else lines.push(`${full === 1 ? 'The 4th octet is all host bits (8)' : `The last ${full} octets are all host bits`}, and ${rem} host bit${rem === 1 ? ' is' : 's are'} in the ${ORD[io]} octet, so the block size in the ${ORD[io]} octet is 2^${rem} = ${block}. Mask ${ORD[io]} octet = 256 − ${block} = ${256 - block}, giving ${n2ip(r.mask)}.`);
  lines.push(`The network starts where the last subnet ended: ${n2ip(r.net)}. Broadcast: ${ORD[io]} octet ${no[io - 1]} + ${block} − 1 = ${bo[io - 1]}${io < 4 ? ', and every octet after it is 255' : ''}, giving ${n2ip(r.bc)}.`);
  lines.push(`Usable range: ${n2ip(r.first)} to ${n2ip(r.last)} (${r.size - 2} hosts). The next subnet starts at ${n2ip(r.bc + 1)}.`);
  return lines;
}
function maskBits(r) {
  const b = Array.from({ length: 32 }, (_, i) => i < r.prefix ? '1' : '0');
  let out = '';
  for (let o = 0; o < 4; o++) { out += b.slice(o * 8, o * 8 + 8).map(x => x === '1' ? '<span class="n">1</span>' : '0').join('') + (o < 3 ? ' . ' : ''); }
  return `mask ${out}`;
}
/* Past-paper problems. Edit or add your own here. */
const PRESETS = [
  { id: 'lect', label: 'Lecturer style (/16, big hosts)', base: '172.20.0.0', p: 16, reqs: [['Dept A', 4000], ['Dept B', 1000], ['Dept C', 500], ['Dept D', 200], ['Dept E', 60]] },
  { id: 'p2025', label: '2025 test (172.18.0.0/16)', base: '172.18.0.0', p: 16, reqs: [['Dept A', 300], ['Dept B', 120], ['Dept C', 50], ['Dept D', 12]] },
  { id: 'p2026', label: '2026 test (bank, /24)', base: '172.20.0.0', p: 24, reqs: [['Branch A', 100], ['Branch B', 50], ['Branch C', 20], ['Branch D', 8], ['Branch E', 2]] },
  { id: 'p2022', label: '2022 test / 2017 supp (192.168.1.0/24)', base: '192.168.1.0', p: 24, reqs: [['Net 1', 110], ['Net 2', 50], ['Net 3', 14], ['Net 4', 12], ['Net 5', 6]] },
  { id: 'prev', label: 'Revision paper (192.168.170.0)', base: '192.168.170.0', p: 24, reqs: [['Sales', 85], ['Accounts', 20], ['Marketing', 5]] }
];
const SN = { mode: 'final', prob: null, checked: false, shown: false };
let C = null; /* engine context: $, $$, esc, rand, S, save, TTS, ICON */
const st = () => { const S = C.S; S.subnet = Object.assign({ solved: 0, streak: 0 }, S.subnet || {}); return S.subnet; };

function genProblem(mode) {
  const rand = C.rand, names = ['A', 'B', 'C', 'D', 'E'];
  for (let tries = 0; tries < 50; tries++) {
    let base, p, hosts;
    if (mode === 'final') {
      base = `172.${rand(16, 31)}.0.0`; p = 16;
      hosts = [rand(1500, 4000), rand(500, 1000), rand(257, 500), rand(100, 254), rand(10, 62)];
      if (Math.random() < 0.5) hosts.splice(rand(2, 4), 1);
      if (Math.random() < 0.4) { const k = rand(0, hosts.length - 1); const pw = Math.pow(2, Math.round(Math.log2(hosts[k]))); hosts[k] = Math.random() < 0.5 ? pw : pw - 2; }
    } else {
      base = Math.random() < 0.5 ? `192.168.${rand(1, 254)}.0` : `172.${rand(16, 31)}.${rand(0, 255)}.0`; p = 24;
      hosts = [rand(60, 120), rand(25, 60), rand(10, 28), rand(3, 14), 2];
      if (Math.random() < 0.4) { const k = rand(1, 3); const pw = Math.pow(2, Math.max(2, Math.round(Math.log2(hosts[k])))); hosts[k] = Math.random() < 0.5 ? pw : pw - 2; }
    }
    hosts = Array.from(new Set(hosts)).sort((a, b) => b - a);
    const reqs = hosts.map((h, i) => ({ name: (mode === 'final' ? 'Dept ' : 'Branch ') + names[i], hosts: h }));
    const rows = vlsm(ip2n(base), p, reqs);
    if (!rows.some(r => r.overflow)) return { base, p, reqs, rows, label: mode === 'final' ? 'Final style: /16 with big host counts' : 'Classic: /24' };
  }
  return null;
}
function loadPreset(pr) { const reqs = pr.reqs.map(([name, hosts]) => ({ name, hosts })); return { base: pr.base, p: pr.p, reqs, rows: vlsm(ip2n(pr.base), pr.p, reqs), label: pr.label }; }
function cheatTable() {
  let rows = '';
  for (let p = 16; p <= 30; p++) { const h = 32 - p, full = Math.floor(h / 8), rem = h % 8, io = 4 - full; rows += `<tr><td>/${p}</td><td>${n2ip(maskN(p))}</td><td>${h}</td><td>${Math.pow(2, rem)} in the ${ORD[io]} octet</td><td>${(Math.pow(2, h) - 2).toLocaleString('en-GB')}</td></tr>`; }
  return `<table class="cheat"><thead><tr><th>Prefix</th><th>Mask</th><th>Host bits</th><th>Block size</th><th>Usable hosts</th></tr></thead><tbody>${rows}</tbody></table>`;
}
function scoreText() { const s = st(); return `Solved perfectly: ${s.solved || 0}${s.streak ? ` · streak ${s.streak}` : ''}`; }
function render(v, ctx) {
  C = ctx; const { $, $$, esc } = C;
  v.innerHTML = `
  <div class="card filters">
    <div class="row" style="justify-content:space-between"><h2>Subnet lab</h2><span class="muted small" id="sn-score">${scoreText()}</span></div>
    <div class="modes">
      <button class="chip" data-mode="final" aria-pressed="${SN.mode === 'final'}">Final style: /16, big hosts</button>
      <button class="chip" data-mode="classic" aria-pressed="${SN.mode === 'classic'}">Classic: /24</button>
      <button class="chip" data-mode="preset" aria-pressed="${SN.mode === 'preset'}">Past papers</button>
    </div>
    <div class="row" id="sn-presetrow" ${SN.mode === 'preset' ? '' : 'hidden'}><select id="sn-preset" aria-label="Past paper">${PRESETS.map(p => `<option value="${p.id}">${esc(p.label)}</option>`).join('')}</select></div>
  </div>
  <div class="card" id="sn-card"></div>
  <details><summary>Cheat sheet: prefixes, masks and block sizes</summary><div class="tablewrap" style="margin-top:10px">${cheatTable()}</div></details>`;
  $$('[data-mode]', v).forEach(b => b.onclick = () => { SN.mode = b.dataset.mode; $$('[data-mode]', v).forEach(x => x.setAttribute('aria-pressed', x === b)); $('#sn-presetrow').hidden = SN.mode !== 'preset'; snNew(); });
  $('#sn-preset').onchange = snNew;
  snNew();
}
function snNew() {
  const { $, $$, esc, TTS, ICON } = C;
  TTS.stop();
  SN.prob = SN.mode === 'preset' ? loadPreset(PRESETS.find(p => p.id === $('#sn-preset').value) || PRESETS[0]) : genProblem(SN.mode);
  SN.checked = false; SN.shown = false;
  const P = SN.prob; const card = $('#sn-card');
  const F = [['px', 'Prefix'], ['mask', 'Subnet mask'], ['net', 'Network'], ['first', 'First usable'], ['last', 'Last usable'], ['bc', 'Broadcast']];
  card.innerHTML = `
    <span class="eyebrow">${esc(P.label)}</span>
    <p class="q">You are allocated <span class="mono">${P.base}/${P.p}</span>. Using VLSM, allocate the largest subnet first, starting at <span class="mono">${P.base}</span>, for: ${P.reqs.map(r => `${esc(r.name)} <span class="mono">${r.hosts}</span> hosts`).join(', ')}.</p>
    <div class="tablewrap"><table class="sn-table"><thead><tr><th>Subnet</th>${F.map(f => `<th>${f[1]}</th>`).join('')}</tr></thead><tbody>
      ${P.rows.map((r, i) => `<tr><td class="h"><b>${esc(r.name)}</b><br><span class="mono small muted">${r.hosts} hosts</span></td>${F.map(([k]) => `<td class="${k === 'px' ? 'px' : ''}"><input id="sn-${i}-${k}" data-r="${i}" data-f="${k}" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="${k === 'px' ? '/__' : 'x.x.x.x'}" aria-label="${esc(r.name)} ${k}"></td>`).join('')}</tr>`).join('')}
    </tbody></table></div>
    <div class="row">
      <button class="btn primary" id="sn-check">Check my answers</button>
      <button class="btn" id="sn-show">Show worked solution</button>
      <button class="btn" id="sn-new">${SN.mode === 'preset' ? 'Reset' : 'New problem'}</button>
      <button class="btn ghost" id="sn-read" hidden>${ICON.play}Read solution aloud</button>
    </div>
    <p id="sn-result" class="small"></p>
    <div class="work" id="sn-work" hidden></div>`;
  $('#sn-check').onclick = snCheck; $('#sn-show').onclick = snShow; $('#sn-new').onclick = snNew;
  $$('#sn-card input').forEach(inp => inp.addEventListener('keydown', e => { if (e.key === 'Enter') snCheck(); }));
}
function snCheck() {
  const { $, $$, save } = C; const s = st();
  const P = SN.prob; let ok = 0, tot = 0, empty = 0;
  $$('#sn-card input').forEach(inp => {
    const r = P.rows[+inp.dataset.r], f = inp.dataset.f, raw = inp.value.trim(); tot++;
    inp.classList.remove('ok', 'no');
    if (!raw) { empty++; return; }
    const good = f === 'px' ? parseInt(raw.replace(/[^\d]/g, ''), 10) === r.prefix : ip2n(raw) === r[f];
    inp.classList.add(good ? 'ok' : 'no'); if (good) ok++;
  });
  const res = $('#sn-result');
  if (ok === tot) {
    res.innerHTML = `<span class="ok-t">All ${tot} cells correct.</span> That's full marks for this table.`;
    if (!SN.checked && !SN.shown) { s.solved = (s.solved || 0) + 1; s.streak = (s.streak || 0) + 1; save(); }
  } else {
    res.innerHTML = `<b>${ok} of ${tot}</b> cells correct${empty ? ` (${empty} empty)` : ''}. Red cells are wrong. Fix them, or open the worked solution.`;
    if (!SN.checked) { s.streak = 0; save(); }
  }
  SN.checked = true;
  $('#sn-score').textContent = scoreText();
}
function snShow() {
  const { $, esc, TTS } = C;
  const P = SN.prob; SN.shown = true; const w = $('#sn-work');
  if (!w.hidden) { w.hidden = true; $('#sn-show').textContent = 'Show worked solution'; $('#sn-read').hidden = true; return; }
  w.innerHTML = `<div class="step"><b>Method.</b> Sort largest first. For each subnet: hosts + 2 → round up to a power of 2 → host bits → prefix. Split the host bits across octets; the block size is 2 to the power of the host bits in the octet where the network bits stop. Network = where the previous subnet ended; broadcast = network + block − 1 in that octet, 255 after it.</div>` +
    P.rows.map(r => `<div class="step"><b>${esc(r.name)} · /${r.prefix} · ${n2ip(r.mask)}</b><p>${explainRow(r).map(esc).join('<br>')}</p><div class="bits">${maskBits(r)}</div></div>`).join('') +
    `<div class="step"><b>Answer table</b><div class="tablewrap" style="margin-top:6px"><table class="cheat"><thead><tr><th>Subnet</th><th>Prefix</th><th>Mask</th><th>Network</th><th>First</th><th>Last</th><th>Broadcast</th></tr></thead><tbody>${P.rows.map(r => `<tr><td>${esc(r.name)}</td><td>/${r.prefix}</td><td>${n2ip(r.mask)}</td><td>${n2ip(r.net)}</td><td>${n2ip(r.first)}</td><td>${n2ip(r.last)}</td><td>${n2ip(r.bc)}</td></tr>`).join('')}</tbody></table></div></div>`;
  w.hidden = false; $('#sn-show').textContent = 'Hide worked solution';
  const rd = $('#sn-read'); rd.hidden = false;
  rd.onclick = () => TTS.speak(P.rows.map(r => explainRow(r).join(' ')).join(' '));
}

window.STUDY_TOOLS = window.STUDY_TOOLS || {};
window.STUDY_TOOLS.subnet = {
  id: 'subnet',
  label: 'Subnet lab',
  tabHTML: 'Subnet<span class="wide"> lab</span>',
  planButton: 'Practise subnetting',
  render,
  stat: ctx => { C = ctx; return { n: String(st().solved || 0), l: 'subnet problems solved perfectly' }; },
  _test: { vlsm, ip2n, n2ip, explainRow }
};
})();
