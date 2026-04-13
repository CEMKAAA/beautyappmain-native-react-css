import { readFileSync, writeFileSync } from 'fs';

const data = JSON.parse(readFileSync('Fresh/computed-styles.json', 'utf8'));
const els = data.elements;

const lines = [];
lines.push(`Total elements: ${els.length}`);
lines.push(`Total lines in JSON: 14675`);
lines.push('');
lines.push('=== FULL ELEMENT HIERARCHY TREE ===');
lines.push('');

els.forEach(el => {
  const indent = '  '.repeat(el.depth);
  const txt = el.text ? ` "${el.text.substring(0, 50)}"` : '';
  const svgD = (el.svgAttrs && el.svgAttrs.d) ? ' [SVG-path]' : '';
  const src = (el.attrs && el.attrs.src) ? ' [img-src]' : '';
  const href = (el.attrs && el.attrs.href) ? ` [href=${el.attrs.href.substring(0,40)}]` : '';
  const type = (el.attrs && el.attrs.type) ? ` type=${el.attrs.type}` : '';
  const placeholder = (el.attrs && el.attrs.placeholder) ? ` ph="${el.attrs.placeholder.substring(0, 40)}"` : '';
  const display = el.styles && el.styles.display === 'none' ? ' [HIDDEN]' : '';
  const w = el.styles && el.styles.width ? ` w=${el.styles.width}` : '';
  const h = el.styles && el.styles.height ? ` h=${el.styles.height}` : '';
  const bg = el.styles && el.styles['background-color'] && el.styles['background-color'] !== 'rgba(0, 0, 0, 0)' && el.styles['background-color'] !== 'rgba(19, 19, 19, 0)' ? ` bg=${el.styles['background-color']}` : '';
  const cls = el.classes ? ` cls="${el.classes.substring(0, 60)}"` : '';
  
  lines.push(`${indent}${el.id} <${el.tag}> p=${el.parentId} d=${el.depth}${txt}${svgD}${src}${href}${type}${placeholder}${display}${w}${h}${bg}`);
});

// Also output a summary of unique tags and their counts
lines.push('');
lines.push('=== TAG SUMMARY ===');
const tagCounts = {};
els.forEach(el => { tagCounts[el.tag] = (tagCounts[el.tag] || 0) + 1; });
Object.entries(tagCounts).sort((a,b) => b[1] - a[1]).forEach(([tag, count]) => {
  lines.push(`  ${tag}: ${count}`);
});

// Depth distribution
lines.push('');
lines.push('=== DEPTH DISTRIBUTION ===');
const depthCounts = {};
els.forEach(el => { depthCounts[el.depth] = (depthCounts[el.depth] || 0) + 1; });
Object.entries(depthCounts).sort((a,b) => Number(a[0]) - Number(b[0])).forEach(([depth, count]) => {
  lines.push(`  depth ${depth}: ${count} elements`);
});

// Root children summary (depth breakdown)
lines.push('');
lines.push('=== TOP-LEVEL STRUCTURE (depth 0-4) ===');
els.filter(el => el.depth <= 4).forEach(el => {
  const indent = '  '.repeat(el.depth);
  const txt = el.text ? ` "${el.text.substring(0, 50)}"` : '';
  const childCount = els.filter(c => c.parentId === el.id).length;
  lines.push(`${indent}${el.id} <${el.tag}> children=${childCount}${txt}`);
});

// Text content summary
lines.push('');
lines.push('=== ALL TEXT CONTENT ===');
els.filter(el => el.text && el.text.trim()).forEach(el => {
  lines.push(`  ${el.id} (d=${el.depth}, p=${el.parentId}): "${el.text}"`);
});

const output = lines.join('\n');
writeFileSync('Fresh/element-tree.txt', output, 'utf8');
console.log(`Written ${lines.length} lines to Fresh/element-tree.txt`);
console.log('Done!');
