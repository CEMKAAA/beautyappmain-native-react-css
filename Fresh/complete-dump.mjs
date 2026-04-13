import { readFileSync, writeFileSync } from 'fs';

const data = JSON.parse(readFileSync('Fresh/computed-styles.json', 'utf8'));
const els = data.elements;

const lines = [];

// ================================================================
// PART 1: DUMP EVERY SINGLE ELEMENT - NO EXCEPTIONS
// ================================================================
lines.push('=== COMPLETE ELEMENT DUMP (468 elements, ZERO skips) ===');
lines.push(`Total elements: ${els.length}`);
lines.push('');

els.forEach((el, idx) => {
  lines.push(`--- ELEMENT ${idx}: ${el.id} ---`);
  lines.push(`  parentId: ${el.parentId}`);
  lines.push(`  depth: ${el.depth}`);
  lines.push(`  tag: ${el.tag}`);
  lines.push(`  classes: "${el.classes}"`);
  lines.push(`  text: "${el.text}"`);
  
  // Full styles
  lines.push(`  styles: {`);
  if (el.styles) {
    for (const [k, v] of Object.entries(el.styles)) {
      lines.push(`    "${k}": "${v}",`);
    }
  }
  lines.push(`  }`);
  
  // Attrs
  if (el.attrs) {
    lines.push(`  attrs: {`);
    for (const [k, v] of Object.entries(el.attrs)) {
      lines.push(`    "${k}": "${v}",`);
    }
    lines.push(`  }`);
  }
  
  // SVG attrs
  if (el.svgAttrs) {
    lines.push(`  svgAttrs: {`);
    for (const [k, v] of Object.entries(el.svgAttrs)) {
      lines.push(`    "${k}": "${v}",`);
    }
    lines.push(`  }`);
  }
  
  // Pseudo before
  if (el.pseudoBefore) {
    lines.push(`  pseudoBefore: {`);
    for (const [k, v] of Object.entries(el.pseudoBefore)) {
      lines.push(`    "${k}": "${v}",`);
    }
    lines.push(`  }`);
  }
  
  // Pseudo after
  if (el.pseudoAfter) {
    lines.push(`  pseudoAfter: {`);
    for (const [k, v] of Object.entries(el.pseudoAfter)) {
      lines.push(`    "${k}": "${v}",`);
    }
    lines.push(`  }`);
  }
  
  // CSS var overrides
  if (el.cssVarOverrides) {
    lines.push(`  cssVarOverrides: {`);
    for (const [k, v] of Object.entries(el.cssVarOverrides)) {
      lines.push(`    "${k}": "${v}",`);
    }
    lines.push(`  }`);
  }
  
  lines.push('');
});

// ================================================================
// PART 2: STRUCTURAL VERIFICATION - Compare repeating patterns
// ================================================================
lines.push('\n=== STRUCTURAL VERIFICATION ===\n');

// Compare sidebar menu items structurally
const sidebarItems = [
  { name: 'All reports', rootId: 15 },
  { name: 'Favourites', rootId: 31 },
  { name: 'Dashboards', rootId: 43 },
  { name: 'Standard', rootId: 55 },
  { name: 'Premium', rootId: 67 },
  { name: 'Custom', rootId: 79 },
  { name: 'Targets', rootId: 91 },
];

lines.push('--- SIDEBAR ITEM COMPARISON ---');
const baseItem = sidebarItems[0];
const baseChildren = els.filter(e => {
  const eid = parseInt(e.id.replace('el-', ''));
  return eid >= baseItem.rootId && eid < baseItem.rootId + 16;
});
const basePattern = baseChildren.map(e => ({ 
  depthOffset: e.depth - els.find(x => x.id === `el-${baseItem.rootId}`).depth,
  tag: e.tag,
  styleKeys: Object.keys(e.styles || {}).sort().join(','),
  hasText: !!e.text,
  hasSvgAttrs: !!e.svgAttrs,
  hasPseudoBefore: !!e.pseudoBefore,
  hasPseudoAfter: !!e.pseudoAfter,
  hasAttrs: !!e.attrs,
}));

lines.push(`Base pattern (${baseItem.name}): ${baseChildren.length} elements`);
basePattern.forEach((p, i) => {
  lines.push(`  [${i}] depth+${p.depthOffset} <${p.tag}> keys(${p.styleKeys.split(',').length}) text=${p.hasText} svg=${p.hasSvgAttrs}`);
});

for (let i = 1; i < sidebarItems.length; i++) {
  const item = sidebarItems[i];
  const children = els.filter(e => {
    const eid = parseInt(e.id.replace('el-', ''));
    return eid >= item.rootId && eid < item.rootId + 16;
  });
  
  lines.push(`\n[${item.name}] vs base: ${children.length} elements (base: ${baseChildren.length})`);
  
  if (children.length !== baseChildren.length) {
    lines.push(`  *** ELEMENT COUNT MISMATCH! ***`);
  }
  
  const itemPattern = children.map(e => ({
    depthOffset: e.depth - els.find(x => x.id === `el-${item.rootId}`).depth,
    tag: e.tag,
    styleKeys: Object.keys(e.styles || {}).sort().join(','),
    hasText: !!e.text,
    hasSvgAttrs: !!e.svgAttrs,
  }));
  
  let diffs = [];
  for (let j = 0; j < Math.max(basePattern.length, itemPattern.length); j++) {
    const b = basePattern[j];
    const c = itemPattern[j];
    if (!b || !c) {
      diffs.push(`  [${j}] MISSING in ${!b ? 'base' : item.name}`);
      continue;
    }
    if (b.tag !== c.tag) diffs.push(`  [${j}] TAG: ${b.tag} vs ${c.tag}`);
    if (b.depthOffset !== c.depthOffset) diffs.push(`  [${j}] DEPTH: +${b.depthOffset} vs +${c.depthOffset}`);
    if (b.styleKeys !== c.styleKeys) {
      const bKeys = new Set(b.styleKeys.split(','));
      const cKeys = new Set(c.styleKeys.split(','));
      const onlyInBase = [...bKeys].filter(k => !cKeys.has(k));
      const onlyInItem = [...cKeys].filter(k => !bKeys.has(k));
      if (onlyInBase.length) diffs.push(`  [${j}] Only in base: ${onlyInBase.join(', ')}`);
      if (onlyInItem.length) diffs.push(`  [${j}] Only in ${item.name}: ${onlyInItem.join(', ')}`);
    }
  }
  
  if (diffs.length === 0) {
    lines.push(`  ✅ IDENTICAL structure to base`);
  } else {
    lines.push(`  ❌ DIFFERENCES:`);
    diffs.forEach(d => lines.push(d));
  }
}

// Compare report cards
lines.push('\n\n--- REPORT CARD COMPARISON ---');
const reportCards = [
  { name: 'Performance dashboard', rootId: 204 },
  { name: 'Performance over time', rootId: 236 },
  { name: 'Sales summary', rootId: 270 },
  { name: 'Finance summary', rootId: 303 },
  { name: 'Appointments summary', rootId: 335 },
  { name: 'Attendance summary', rootId: 367 },
  { name: 'Client summary', rootId: 399 },
  { name: 'Stock movement summary', rootId: 434 },
];

const card1Root = 204;
const card1End = 235;
const card1Els = els.filter(e => {
  const eid = parseInt(e.id.replace('el-', ''));
  return eid >= card1Root && eid <= card1End;
});

lines.push(`Base card (Performance dashboard): ${card1Els.length} elements`);
const card1Pattern = card1Els.map(e => ({
  depthOffset: e.depth - 8,
  tag: e.tag,
  styleKeys: Object.keys(e.styles || {}).sort().join(','),
  hasText: !!e.text,
  hasSvgAttrs: !!e.svgAttrs,
  hasPseudoBefore: !!e.pseudoBefore,
  classesHash: (e.classes || '').length,
}));

card1Pattern.forEach((p, i) => {
  lines.push(`  [${i}] d+${p.depthOffset} <${p.tag}> keys=${p.styleKeys.split(',').length} text=${p.hasText} svg=${p.hasSvgAttrs} pseudo=${p.hasPseudoBefore} clsLen=${p.classesHash}`);
});

for (let i = 1; i < reportCards.length; i++) {
  const card = reportCards[i];
  const nextCardRoot = i < reportCards.length - 1 ? reportCards[i + 1].rootId : 468;
  const cardEls = els.filter(e => {
    const eid = parseInt(e.id.replace('el-', ''));
    return eid >= card.rootId && eid < nextCardRoot;
  });
  
  lines.push(`\n[${card.name}] (el-${card.rootId}): ${cardEls.length} elements (base: ${card1Els.length})`);
  
  const cardPattern = cardEls.map(e => ({
    depthOffset: e.depth - 8,
    tag: e.tag,
    styleKeys: Object.keys(e.styles || {}).sort().join(','),
    hasText: !!e.text,
    hasSvgAttrs: !!e.svgAttrs,
    hasPseudoBefore: !!e.pseudoBefore,
  }));
  
  let diffs = [];
  for (let j = 0; j < Math.max(card1Pattern.length, cardPattern.length); j++) {
    const b = card1Pattern[j];
    const c = cardPattern[j];
    if (!b || !c) {
      diffs.push(`  [${j}] ${!b ? 'EXTRA in card' : 'MISSING in card'}: ${c ? `<${c.tag}>` : `<${b.tag}>`}`);
      continue;
    }
    if (b.tag !== c.tag) diffs.push(`  [${j}] TAG: ${b.tag} vs ${c.tag}`);
    if (b.depthOffset !== c.depthOffset) diffs.push(`  [${j}] DEPTH: +${b.depthOffset} vs +${c.depthOffset}`);
    if (b.hasPseudoBefore !== c.hasPseudoBefore) diffs.push(`  [${j}] pseudoBefore: ${b.hasPseudoBefore} vs ${c.hasPseudoBefore}`);
    
    // Compare actual style VALUES
    const bEl = card1Els[j];
    const cEl = cardEls[j];
    if (bEl && cEl) {
      const allKeys = new Set([...Object.keys(bEl.styles || {}), ...Object.keys(cEl.styles || {})]);
      for (const key of allKeys) {
        const bVal = (bEl.styles || {})[key];
        const cVal = (cEl.styles || {})[key];
        if (bVal !== cVal) {
          // Skip width differences (they vary by content)
          if (['width', 'right', 'left', 'grid-template-columns'].includes(key)) continue;
          // Skip the 'd' property (SVG paths differ per icon)
          if (key === 'd') continue;
          // Skip fill for path elements
          if (key === 'fill' && bEl.tag === 'path') continue;
          diffs.push(`  [${j}] <${b.tag}> "${key}": "${bVal}" vs "${cVal}"`);
        }
      }
    }
  }
  
  if (diffs.length === 0) {
    lines.push(`  ✅ IDENTICAL structure and styles (except width/SVG as expected)`);
  } else {
    lines.push(`  Differences:`);
    diffs.forEach(d => lines.push(d));
  }
}

// ================================================================
// PART 3: Missing fields check
// ================================================================
lines.push('\n\n=== FIELD COVERAGE CHECK ===');
let totalStyles = 0;
let totalAttrs = 0;
let totalSvgAttrs = 0;
let totalPseudoBefore = 0;
let totalPseudoAfter = 0;
let totalCssVarOverrides = 0;
let totalClasses = 0;
let totalText = 0;

els.forEach(el => {
  if (el.styles) totalStyles += Object.keys(el.styles).length;
  if (el.attrs) totalAttrs += Object.keys(el.attrs).length;
  if (el.svgAttrs) totalSvgAttrs += Object.keys(el.svgAttrs).length;
  if (el.pseudoBefore) totalPseudoBefore += Object.keys(el.pseudoBefore).length;
  if (el.pseudoAfter) totalPseudoAfter += Object.keys(el.pseudoAfter).length;
  if (el.cssVarOverrides) totalCssVarOverrides += Object.keys(el.cssVarOverrides).length;
  if (el.classes) totalClasses++;
  if (el.text) totalText++;
});

lines.push(`Total style properties: ${totalStyles}`);
lines.push(`Total attr properties: ${totalAttrs}`);
lines.push(`Total svgAttr properties: ${totalSvgAttrs}`);
lines.push(`Total pseudoBefore properties: ${totalPseudoBefore}`);
lines.push(`Total pseudoAfter properties: ${totalPseudoAfter}`);
lines.push(`Total cssVarOverride properties: ${totalCssVarOverrides}`);
lines.push(`Elements with classes: ${totalClasses}`);
lines.push(`Elements with text: ${totalText}`);

const output = lines.join('\n');
writeFileSync('Fresh/complete-dump.txt', output, 'utf8');
console.log(`Written ${lines.length} lines to Fresh/complete-dump.txt`);
console.log(`Dumped all ${els.length} elements with ZERO skips`);
