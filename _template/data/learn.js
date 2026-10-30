/* Model answers (used by Learn and Exam mode).
   id      unique id
   t       topic key from TOPICS
   tier    1 near certain, 2 likely, 3 lower
   marks   marks in the paper; est: true if you estimated them
   steps   true → points are numbered steps
   q       the question as the paper words it
   seen    which papers it appeared in
   pts     mark points, written "Heading::Explanation"
   tip     how to score full marks */
var LEARN = [
{ id:"t1-example", t:"t1", tier:1, marks:4,
  q:"Explain two advantages of X.",
  seen:["2025 test","2024 final"],
  pts:[
    "First advantage::One or two sentences explaining it, linked to the scenario.",
    "Second advantage::One or two sentences explaining it, linked to the scenario."
  ],
  tip:"2 marks per point: name it, then explain it." },
{ id:"t2-example", t:"t2", tier:2, marks:3, steps:true,
  q:"Write down the steps to do Y.",
  seen:["2023 test"],
  pts:[
    "Open the tool::Where to find it.",
    "Do the action::What to click or type.",
    "Confirm::How you know it worked."
  ],
  tip:"" }
];
