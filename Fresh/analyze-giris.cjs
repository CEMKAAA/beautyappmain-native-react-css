const fs = require('fs');
const d = JSON.parse(fs.readFileSync('giris-computed-styles.json', 'utf8'));
const els = d.elements;

// Build parent-child map
const childMap = {};
els.forEach(e => {
  if (!childMap[e.parentId]) childMap[e.parentId] = [];
  childMap[e.parentId].push(e);
});

// Count descendants
function countDesc(id) {
  const ch = childMap[id] || [];
  let total = ch.length;
  ch.forEach(c => { total += countDesc(c.id); });
  return total;
}

console.log('=== ROOT ===');
const root = els[0];
console.log(root.id, '(' + root.tag + ') classes:', (root.classes || '').substring(0, 100));
console.log('');

console.log('=== DIRECT CHILDREN OF el-0 (main) ===');
const mainChildren = childMap['el-0'] || [];
mainChildren.forEach(c => {
  const desc = countDesc(c.id);
  const text = c.textContent ? c.textContent.substring(0, 80) : '';
  const cls = (c.classes || '').substring(0, 120);
  console.log(c.id + ' (' + c.tag + ') desc:' + desc + ' text:' + JSON.stringify(text));
  console.log('  classes: ' + cls);
  console.log('');
});

console.log('=== KEYFRAMES ===');
if (d.keyframes && Array.isArray(d.keyframes)) {
  d.keyframes.forEach(kf => {
    console.log('  @keyframes ' + kf.name);
  });
} else if (d.keyframes) {
  Object.keys(d.keyframes).forEach(k => {
    console.log('  @keyframes ' + k);
  });
}

console.log('');
console.log('=== INTERACTIVE RULES (first 5) ===');
if (d.interactiveRules) {
  d.interactiveRules.slice(0, 5).forEach((r, i) => {
    console.log(i + ': ' + JSON.stringify(r).substring(0, 200));
  });
}
