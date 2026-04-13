import { readFileSync, writeFileSync } from 'fs';

const data = JSON.parse(readFileSync('Fresh/computed-styles.json', 'utf8'));
const els = data.elements;

const lines = [];

// ========================
// SECTION 1: CSS VARIABLES & ROOT
// ========================
lines.push('=== FAZ 1: ROOT & CSS VARIABLES ===');
if (data.cssVarDefaults) {
  lines.push('CSS Variable Defaults:');
  for (const [k, v] of Object.entries(data.cssVarDefaults)) {
    lines.push(`  ${k}: ${v}`);
  }
}
if (data.viewport) {
  lines.push(`\nViewport: ${JSON.stringify(data.viewport)}`);
}
lines.push('');

// ========================
// SECTION 2: SIDEBAR ITEMS - Detailed
// ========================
lines.push('=== FAZ 2: SIDEBAR (el-0 to el-128) ===');
lines.push('');

// Root containers
const roots = els.filter(e => e.depth <= 6 && parseInt(e.id.replace('el-','')) <= 128);
roots.forEach(el => {
  const bg = el.styles['background-color'] || '';
  lines.push(`${el.id} <${el.tag}> d=${el.depth} ${el.styles.width || ''}x${el.styles.height || ''} bg=${bg}`);
  lines.push(`  styles: ${JSON.stringify(el.styles)}`);
  if (el.pseudoBefore) lines.push(`  pseudoBefore: ${JSON.stringify(el.pseudoBefore)}`);
  if (el.pseudoAfter) lines.push(`  pseudoAfter: ${JSON.stringify(el.pseudoAfter)}`);
});

// Sidebar menu items
const sidebarGroups = [
  { name: 'All reports (active)', root: 'el-15', count: '53' },
  { name: 'Favourites', root: 'el-31', count: '0' },
  { name: 'Dashboards', root: 'el-43', count: '3' },
  { name: 'Standard', root: 'el-55', count: '45' },
  { name: 'Premium', root: 'el-67', count: '8' },
  { name: 'Custom', root: 'el-79', count: '0' },
  { name: 'Targets', root: 'el-91', count: 'N/A' },
];

lines.push('\n--- SIDEBAR MENU ITEMS ---');
sidebarGroups.forEach(g => {
  const el = els.find(e => e.id === g.root);
  lines.push(`\n[${g.name}] ${g.root}:`);
  lines.push(`  bg: ${el.styles['background-color'] || 'inherit'}`);
  lines.push(`  styles: ${JSON.stringify(el.styles)}`);
  
  // Get SVG paths
  const children = els.filter(e => {
    const id = parseInt(e.id.replace('el-',''));
    const rootId = parseInt(g.root.replace('el-',''));
    return id > rootId && id < rootId + 16 && e.tag === 'path' && e.svgAttrs;
  });
  children.forEach(c => {
    lines.push(`  SVG path (${c.id}): d="${c.svgAttrs.d}"`);
    lines.push(`    fill: ${c.styles.fill || 'currentColor'}`);
  });
  
  // Badge
  const badgeEl = els.filter(e => {
    const id = parseInt(e.id.replace('el-',''));
    const rootId = parseInt(g.root.replace('el-',''));
    return id > rootId && id < rootId + 16 && e.text;
  });
  badgeEl.forEach(b => {
    lines.push(`  Badge (${b.id}): "${b.text}" styles=${JSON.stringify(b.styles)}`);
  });
});

// Folders section
lines.push('\n--- FOLDERS SECTION ---');
const foldersEl = els.find(e => e.id === 'el-103');
if (foldersEl) {
  lines.push(`el-103 <li> styles: ${JSON.stringify(foldersEl.styles)}`);
  // Add folder SVG
  const addFolderPaths = els.filter(e => e.tag === 'path' && parseInt(e.id.replace('el-','')) >= 107 && parseInt(e.id.replace('el-','')) <= 117);
  addFolderPaths.forEach(p => {
    if (p.svgAttrs) lines.push(`  SVG ${p.id}: d="${p.svgAttrs.d}" fill=${p.styles.fill}`);
  });
}

// Data connector
lines.push('\n--- DATA CONNECTOR ---');
const dcImg = els.find(e => e.id === 'el-125');
if (dcImg) {
  lines.push(`el-125 <img>: src="${dcImg.attrs?.src}" styles=${JSON.stringify(dcImg.styles)}`);
}

// ========================
// SECTION 3: HEADER
// ========================
lines.push('\n\n=== FAZ 3: CONTENT HEADER (el-129 to el-145) ===');
els.filter(e => {
  const id = parseInt(e.id.replace('el-',''));
  return id >= 129 && id <= 145;
}).forEach(el => {
  const indent = '  '.repeat(Math.max(0, el.depth - 4));
  const txt = el.text ? ` "${el.text}"` : '';
  lines.push(`${indent}${el.id} <${el.tag}>${txt}`);
  lines.push(`${indent}  styles: ${JSON.stringify(el.styles)}`);
  if (el.pseudoBefore) lines.push(`${indent}  pseudoBefore: ${JSON.stringify(el.pseudoBefore)}`);
  if (el.pseudoAfter) lines.push(`${indent}  pseudoAfter: ${JSON.stringify(el.pseudoAfter)}`);
  if (el.attrs) lines.push(`${indent}  attrs: ${JSON.stringify(el.attrs)}`);
});

// ========================
// SECTION 4: TOOLBAR
// ========================
lines.push('\n\n=== FAZ 4: TOOLBAR (el-146 to el-179) ===');
els.filter(e => {
  const id = parseInt(e.id.replace('el-',''));
  return id >= 146 && id <= 179;
}).forEach(el => {
  const indent = '  '.repeat(Math.max(0, el.depth - 6));
  const txt = el.text ? ` "${el.text}"` : '';
  lines.push(`${indent}${el.id} <${el.tag}>${txt}`);
  lines.push(`${indent}  styles: ${JSON.stringify(el.styles)}`);
  if (el.pseudoBefore) lines.push(`${indent}  pseudoBefore: ${JSON.stringify(el.pseudoBefore)}`);
  if (el.attrs) lines.push(`${indent}  attrs: ${JSON.stringify(el.attrs)}`);
  if (el.svgAttrs) lines.push(`${indent}  svgAttrs: ${JSON.stringify(el.svgAttrs)}`);
});

// ========================
// SECTION 5: TAB BAR
// ========================
lines.push('\n\n=== FAZ 5: TAB BAR (el-180 to el-202) ===');
els.filter(e => {
  const id = parseInt(e.id.replace('el-',''));
  return id >= 180 && id <= 202;
}).forEach(el => {
  const indent = '  '.repeat(Math.max(0, el.depth - 7));
  const txt = el.text ? ` "${el.text}"` : '';
  lines.push(`${indent}${el.id} <${el.tag}>${txt}`);
  lines.push(`${indent}  styles: ${JSON.stringify(el.styles)}`);
  if (el.pseudoBefore) lines.push(`${indent}  pseudoBefore: ${JSON.stringify(el.pseudoBefore)}`);
  if (el.pseudoAfter) lines.push(`${indent}  pseudoAfter: ${JSON.stringify(el.pseudoAfter)}`);
  if (el.attrs) lines.push(`${indent}  attrs: ${JSON.stringify(el.attrs)}`);
});

// ========================
// SECTION 6: REPORT CARDS
// ========================
lines.push('\n\n=== FAZ 6-7: ALL REPORT CARDS ===');

const reportCards = [
  { root: 'el-204', title: 'Performance dashboard', icon: 'el-217', isPremium: false },
  { root: 'el-236', title: 'Performance over time', icon: 'el-249', isPremium: true },
  { root: 'el-270', title: 'Sales summary', icon: 'el-283', isPremium: false },
  { root: 'el-303', title: 'Finance summary', icon: 'el-316', isPremium: false },
  { root: 'el-335', title: 'Appointments summary', icon: 'el-348', isPremium: false },
  { root: 'el-367', title: 'Attendance summary', icon: 'el-380', isPremium: false },
  { root: 'el-399', title: 'Client summary', icon: 'el-412', isPremium: true },
  { root: 'el-434', title: 'Stock movement summary', icon: 'el-447', isPremium: false },
];

// First card full detail
lines.push('\n--- REPORT CARD PATTERN (Full detail from el-204) ---');
els.filter(e => {
  const id = parseInt(e.id.replace('el-',''));
  return id >= 204 && id <= 235;
}).forEach(el => {
  const indent = '  '.repeat(Math.max(0, el.depth - 8));
  const txt = el.text ? ` "${el.text}"` : '';
  lines.push(`${indent}${el.id} <${el.tag}>${txt}`);
  lines.push(`${indent}  styles: ${JSON.stringify(el.styles)}`);
  if (el.pseudoBefore) lines.push(`${indent}  pseudoBefore: ${JSON.stringify(el.pseudoBefore)}`);
  if (el.attrs) lines.push(`${indent}  attrs: ${JSON.stringify(el.attrs)}`);
  if (el.svgAttrs) lines.push(`${indent}  svgAttrs: ${JSON.stringify(el.svgAttrs)}`);
  if (el.cssVarOverrides) lines.push(`${indent}  cssVarOverrides: ${JSON.stringify(el.cssVarOverrides)}`);
});

// Per-card unique data
lines.push('\n--- PER-CARD UNIQUE DATA ---');
reportCards.forEach(card => {
  const rootEl = els.find(e => e.id === card.root);
  lines.push(`\n[${card.title}] (${card.root}) Premium=${card.isPremium}`);
  lines.push(`  Card container styles: ${JSON.stringify(rootEl.styles)}`);
  
  // Grid template (content grid)
  const rootId = parseInt(card.root.replace('el-',''));
  const gridEl = els.find(e => parseInt(e.id.replace('el-','')) === rootId + 2);
  if (gridEl) {
    lines.push(`  Grid layout: ${gridEl.styles['grid-template-columns'] || ''} rows: ${gridEl.styles['grid-template-rows'] || ''}`);
  }
  
  // Icon color
  const iconEl = els.find(e => e.id === card.icon);
  if (iconEl) {
    lines.push(`  Icon fill: ${iconEl.styles.fill}`);
    if (iconEl.svgAttrs) lines.push(`  Icon SVG d: "${iconEl.svgAttrs.d}"`);
    const parentSpan = els.find(e => e.id === iconEl.parentId)?.parentId;
    const iconWrapper = parentSpan ? els.find(e => e.id === parentSpan) : null;
    if (iconWrapper?.cssVarOverrides?.['--icon-fill']) {
      lines.push(`  Icon --icon-fill: ${iconWrapper.cssVarOverrides['--icon-fill']}`);
    }
  }
  
  // Multiple path SVGs
  const iconPaths = els.filter(e => e.tag === 'path' && e.svgAttrs && (() => {
    const eid = parseInt(e.id.replace('el-',''));
    return eid >= rootId && eid < rootId + 20;
  })());
  if (iconPaths.length > 1) {
    lines.push(`  Multiple SVG paths (${iconPaths.length}):`);
    iconPaths.forEach(p => {
      lines.push(`    ${p.id}: d="${p.svgAttrs.d}" fill=${p.styles.fill}`);
    });
  }
  
  // Title & Description
  const titleH3 = els.find(e => e.tag === 'h3' && (() => {
    const eid = parseInt(e.id.replace('el-',''));
    return eid >= rootId && eid < rootId + 32;
  })());
  const descH4 = els.find(e => e.tag === 'h4' && (() => {
    const eid = parseInt(e.id.replace('el-',''));
    return eid >= rootId && eid < rootId + 32;
  })());
  if (titleH3) lines.push(`  Title: "${titleH3.text}" (${titleH3.id}) styles: ${JSON.stringify(titleH3.styles)}`);
  if (descH4) lines.push(`  Desc: "${descH4.text}" (${descH4.id}) styles: ${JSON.stringify(descH4.styles)}`);
  
  // Premium badge
  if (card.isPremium) {
    const badge = els.find(e => {
      const eid = parseInt(e.id.replace('el-',''));
      return eid >= rootId && eid < rootId + 32 && e.text === 'Premium';
    });
    if (badge) {
      lines.push(`  Premium badge (${badge.id}): styles=${JSON.stringify(badge.styles)}`);
      const badgeParent = els.find(e => e.id === badge.parentId);
      if (badgeParent) lines.push(`  Premium badge parent (${badgeParent.id}): styles=${JSON.stringify(badgeParent.styles)}`);
    }
  }
  
  // Star icon SVG path
  const starPath = els.find(e => {
    const eid = parseInt(e.id.replace('el-',''));
    return eid >= rootId && eid < rootId + 32 && e.tag === 'path' && e.svgAttrs?.d?.includes('29.9');
  });
  if (starPath) lines.push(`  Star SVG same as card 1: YES`);
  else {
    const allPaths = els.filter(e => {
      const eid = parseInt(e.id.replace('el-',''));
      return eid >= rootId && eid < rootId + 32 && e.tag === 'path' && e.svgAttrs;
    });
    const nonIconPaths = allPaths.filter(p => p.id !== card.icon);
    if (nonIconPaths.length > 0) {
      lines.push(`  Star/fav paths:`);
      nonIconPaths.forEach(p => lines.push(`    ${p.id}: d="${p.svgAttrs.d.substring(0, 60)}..."`));
    }
  }
});

const output = lines.join('\n');
writeFileSync('Fresh/full-analysis.txt', output, 'utf8');
console.log(`Written ${lines.length} lines to Fresh/full-analysis.txt`);
