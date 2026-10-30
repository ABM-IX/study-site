/* Multiple-choice drill. o = [option text, why it's right or wrong]; a = index of the correct option.
   Options are shuffled when shown. Every "why" is read aloud when the student picks that option,
   so make each one teach something ("That's a tree, not a forest"), never just "No." */
var DRILL = [
{ id:"d-t1-1", t:"t1", q:"Example question?",
  o:[["Correct option","Why it's right."],
     ["Wrong option 1","Why this one is wrong."],
     ["Wrong option 2","Why this one is wrong."],
     ["Wrong option 3","Why this one is wrong."]],
  a:0, tip:"A one-line memory hook." }
];
