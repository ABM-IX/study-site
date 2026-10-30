/* CSA module settings. The engine (../assets/engine.js) reads everything in this file. */
var MODULE = {
  id: "csa",
  storageKey: "csa-final-prep-v1",       // keeps progress from the first version of this page
  code: "CSE302",
  name: "Computer Systems Administration",
  brand: ["CSA", "Final", "Prep"],
  institution: "Botswana Accountancy College",
  level: "BSc Year 3",
  examName: "final exam",
  hubHref: "../index.html",
  planHeading: "What's most likely on the final",
  sourceNote: "Built from 12 past papers, the 2026 slides and the revision session",
  introHTML: "The final follows the 2024 format: <b>Question 1 is compulsory</b>, then you choose <b>any 3 of the other 4</b>. Every question is 25 marks; 3 hours in total. Tier 1 topics either appear every year or were named by your lecturer as final-exam material. Start there.",
  quoteSource: "Mr Chikati, revision session (lightly cleaned from the auto-transcript)",
  skipHTML: "<b>Skip unless you have spare time:</b> WAP (Wireless Application Protocol), PCF and the “deck of cards”. They were on the 2014–2020 papers but aren't in the 2026 slides. One insurance card is in Learn under Wireless.",
  minutesPerMark: 1.8,
  voiceTest: "If you can hear this clearly, the voice is ready. Question 1 is compulsory, so start there.",
  tools: ["subnet"],
  defaultModel: "claude-sonnet-5-5"
};

var TOPICS = {
  ws:    { name: "Windows Server & AD DS", c: "--f-blue" },
  admin: { name: "Sysadmin roles", c: "--f-orange" },
  eth:   { name: "Ethernet fundamentals", c: "--f-green" },
  gbe:   { name: "Gigabit Ethernet", c: "--f-brown" },
  wifi:  { name: "Wireless 802.11", c: "--f-slate" },
  ip:    { name: "TCP/IP & subnetting", c: "--f-red" },
  cloud: { name: "Cloud, virtualisation & SDN", c: "--f-violet" },
  sec:   { name: "Security & management", c: "--f-aqua" }
};

/* Predicted final paper (best guess: Q1 compulsory + any 3 of Q2–Q5) */
var PREDICTED = [
  { title:"Question 1 · compulsory", sub:"Windows Server, AD DS and network services", items:["ws-install","ws-promote","ws-ou","ws-group","ws-adduser","ws-services"] },
  { title:"Question 2", sub:"Ethernet and Gigabit Ethernet", items:["gbe-sublayers","gbe-media","gbe-dmd","gbe-duplex","eth-mac"], marksOverride:{ "gbe-media":6 } },
  { title:"Question 3", sub:"Wireless LANs", items:["wifi-advdis","wifi-csmaca","wifi-hidden","wifi-ap","wifi-threats"] },
  { title:"Question 4", sub:"IP addressing and TCP", items:["ip-vlsm16","ip-window"] },
  { title:"Question 5", sub:"Cloud, virtualisation, SDN and security", items:["cl-service","cl-hyper","cl-sdn","sec-detect","sec-patch"] }
];

var HITLIST = [
  { tier:1, t:"ws",   name:"Windows Server steps: install, promote to DC, OU / group / user", ev:"Q1 every year · 9 papers", go:"ws-install" },
  { tier:1, t:"ws",   name:"DNS, DHCP, AD DS: what each does and what breaks without it", ev:"7 papers · answers read out in the revision session", go:"ws-services" },
  { tier:1, t:"ip",   name:"VLSM plan on a /16 with big host counts", ev:"5 papers · “ours is /16”", go:"ip-vlsm16" },
  { tier:1, t:"gbe",  name:"PCS, PMA and PMD sublayers", ev:"9 papers, every year", go:"gbe-sublayers" },
  { tier:1, t:"gbe",  name:"1000BASE-SX / LX / CX and the scenario picks", ev:"8 papers", go:"gbe-media" },
  { tier:1, t:"gbe",  name:"DMD and the mode conditioning patch cable", ev:"5 papers · discussed in the session", go:"gbe-dmd" },
  { tier:1, t:"cloud",name:"Cloud: why, service models, deployment models, AWS / Azure / Google", ev:"Flagged for the final · 2020 final scenario", go:"cl-why" },
  { tier:1, t:"cloud",name:"Virtualisation: why, types, Type 1 vs Type 2, full vs para", ev:"Flagged for the final · 2020 final", go:"cl-virt-why" },
  { tier:1, t:"cloud",name:"SDN: what, why, how", ev:"Flagged for the final · new in the 2026 slides", go:"cl-sdn" },
  { tier:1, t:"sec",  name:"Security: policy, hardware, software, detecting attacks", ev:"Flagged · detecting attacks on 3 of 4 finals", go:"sec-detect" },
  { tier:1, t:"sec",  name:"Management: backups, upgrades, patching, troubleshooting", ev:"Flagged for the final", go:"sec-patch" },
  { tier:1, t:"ip",   name:"TCP dynamic windowing with a diagram", ev:"2025 + 2026 · “copy and paste”", go:"ip-window" },
  { tier:2, t:"wifi", name:"Hidden node, RTS/CTS, exposed node", ev:"7 papers", go:"wifi-hidden" },
  { tier:2, t:"wifi", name:"Wireless advantages and disadvantages, explained", ev:"6 papers · marks lost for one-word answers", go:"wifi-advdis" },
  { tier:2, t:"wifi", name:"CSMA/CA, autonomous vs lightweight APs, WLAN threats", ev:"4 recent papers", go:"wifi-csmaca" },
  { tier:2, t:"gbe",  name:"Full duplex, same frame format, reasons to switch, GBIC", ev:"6 papers", go:"gbe-duplex" },
  { tier:2, t:"eth",  name:"Why Ethernet succeeded, deterministic vs non-deterministic, IFS and backoff", ev:"2024–2026 tests", go:"eth-success" },
  { tier:2, t:"admin",name:"Sysadmin scenarios: one-person model, documentation, DBA vs security", ev:"2025 + 2026 tests", go:"ad-oneperson" },
  { tier:2, t:"ws",   name:"Windows Server management: Group Policy, backup, Performance Monitor, Hyper-V, firewall", ev:"Practicals · “backing up… if there are problems, how do we handle that?”", go:"ws-backup" },
  { tier:2, t:"ip",   name:"Troubleshooting commands and the Packet Tracer DHCP practical", ev:"Study notes · practicals", go:"ip-commands" },
  { tier:3, t:"wifi", name:"Roaming, station services, FHSS / DSSS, WEP", ev:"2014–2022 papers", go:"wifi-roaming" },
  { tier:3, t:"ip",   name:"TCP / UDP / ICMP / ARP, DHCP DORA", ev:"4 papers", go:"ip-protocols" },
  { tier:3, t:"ws",   name:"Group scopes, delegation, MMC, AD terms, file shares", ev:"Older papers", go:"ws-scopes" }
];

var PLAN_BLOCKS = [
  { id:"b1", h:"Block 1 · 90 min", t:"Question 1, Windows Server. Learn the install, promote, OU/group/user steps and the DNS/DHCP/AD DS answers, then write them from memory in Exam mode." },
  { id:"b2", h:"Block 2 · 2 h", t:"Subnet lab. Do “Final style /16” problems until you get 3 fully correct in a row. Then the TCP windowing steps and diagram." },
  { id:"b3", h:"Block 3 · 2 h", t:"Gigabit Ethernet + Ethernet fundamentals: PCS/PMA/PMD, SX/LX/CX, DMD, GBIC, full duplex, why Ethernet succeeded." },
  { id:"b4", h:"Block 4 · 2 h", t:"Cloud, virtualisation and SDN. These are new for the final, so read every Learn card in that topic." },
  { id:"b5", h:"Block 5 · 90 min", t:"Security and management: policy, hardware/software security, detecting attacks, patching, backups, troubleshooting." },
  { id:"b6", h:"Block 6 · 90 min", t:"Wireless: hidden/exposed node with diagrams, CSMA/CA, AP types, threats, advantages and disadvantages." },
  { id:"b7", h:"Block 7 · 2 h", t:"Drill everything until the missed pile is empty, then sit the predicted paper in Exam mode under time (45 min per question) and get Claude to mark it." },
  { id:"b8", h:"Night before", t:"Skim the hit list, rewrite the Q1 steps once and do one /16 subnet problem. Then sleep." }
];

var RULES = [
  ["One-word answers score zero.","Your lecturer said it twice. Every point is: name it, explain it, link it to the scenario."],
  ["Marks tell you how many points.","2 marks = one point explained, or two short points. 6 marks for “three factors” = 2 each."],
  ["Q1 is compulsory, then choose 3 of 4.","Read the whole paper in the 15 minutes' reading time. Subnetting is the safest 20 marks if you've practised."],
  ["About 45 minutes per question.","3 hours for 4 questions. Don't spend 70 minutes polishing one."],
  ["Draw when the question says “with the aid of a diagram”.","TCP windowing, RTS/CTS and the hidden node all have diagram marks."],
  ["Show subnet working in a table.","Hosts → power of 2 → host bits → prefix → mask → block size → network, first, last, broadcast."],
  ["“Justify”, “evaluate” and “analyse” mean judgement.","Say why. Give both sides, then a verdict with reasons."]
];

var QUOTES = [
  "“The final exam, over and above all this, which remain very important. So make sure you understand everything here.”",
  "“Ours is /16… these numbers are beyond 255… you need the block size in each of those octets.”",
  "“The other part is on cloud computing, virtualisation and SDN… What are deployment models? What are service models?… Azure, AWS, Google Cloud.”",
  "“Then security: hardware security, software security. Then management: backing up, upgrading, patching. And if there are problems, how do we handle that?”",
  "“The one-word answer is not an answer, guys.”"
];
