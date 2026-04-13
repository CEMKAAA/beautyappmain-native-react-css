const fs = require('fs');
const data = JSON.parse(fs.readFileSync('Fresh/computed-styles.json', 'utf8'));
const els = data.elements;
console.log('Total elements:', els.length);
els.forEach(el => {
  const indent = '  '.repeat(el.depth);
  const txt = el.text ? ` "${el.text.substring(0, 40)}"` : '';
  const svgD = (el.svgAttrs && el.svgAttrs.d) ? ' [SVG-path]' : '';
  const src = (el.attrs && el.attrs.src) ? ' [img-src]' : '';
  const href = (el.attrs && el.attrs.href) ? ' [href]' : '';
  const type = (el.attrs && el.attrs.type) ? ` type=${el.attrs.type}` : '';
  const placeholder = (el.attrs && el.attrs.placeholder) ? ` ph="${el.attrs.placeholder.substring(0, 30)}"` : '';
  const display = el.styles && el.styles.display === 'none' ? ' [HIDDEN]' : '';
  const w = el.styles && el.styles.width ? ` w=${el.styles.width}` : '';
  const h = el.styles && el.styles.height ? ` h=${el.styles.height}` : '';
  console.log(`${indent}${el.id} <${el.tag}> p=${el.parentId}${txt}${svgD}${src}${href}${type}${placeholder}${display}${w}${h}`);
});
