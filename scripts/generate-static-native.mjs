import fs from 'node:fs';
import path from 'node:path';
import girisMain from '../src/native/data/girisComputedStylesData.js';
import girisHeader from '../src/native/data/girisHeaderData.js';
import girisMenu from '../src/native/data/girisNavMenuData.js';
import girisLanguage from '../src/native/data/girisLanguageData.js';
import authData from '../src/native/data/authPageData.js';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'src', 'pages', 'generated');

const TAG_ALIAS = {
  clippath: 'clipPath',
  foreignobject: 'foreignObject',
};

const VOID_TAGS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
  'path',
]);

const PSEUDO_MEANINGFUL_PROPS = [
  'display',
  'position',
  'top',
  'left',
  'right',
  'bottom',
  'width',
  'height',
  'opacity',
  'transform',
  'transition',
  'z-index',
  'background',
  'background-color',
  'box-shadow',
  'border',
  'border-color',
  'border-width',
  'border-style',
  'animation',
  'animation-name',
];

const TRANSLATABLE_ATTRS = new Set(['aria-label', 'title', 'placeholder', 'alt']);

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function namespaceExtractionData(data, namespace) {
  if (!namespace || typeof namespace !== 'string') return data;

  const elements = Array.isArray(data?.elements)
    ? data.elements.map((el) => ({
        ...el,
        id: `${namespace}-${el.id}`,
        parentId: el.parentId == null ? null : `${namespace}-${el.parentId}`,
      }))
    : [];

  return {
    ...(data || {}),
    elements,
  };
}

function getRenderableTag(tag) {
  if (!tag || typeof tag !== 'string') return 'div';
  const lowered = tag.toLowerCase();
  return TAG_ALIAS[lowered] || lowered;
}

function toReactAttrName(name) {
  if (!name || typeof name !== 'string') return name;

  const lowered = name.toLowerCase();
  if (lowered === 'class') return 'className';
  if (lowered === 'for') return 'htmlFor';
  if (lowered === 'tabindex') return 'tabIndex';
  if (lowered === 'srcset') return 'srcSet';
  if (lowered === 'playsinline') return 'playsInline';
  if (lowered === 'autoplay') return 'autoPlay';
  if (lowered === 'readonly') return 'readOnly';
  if (lowered === 'viewbox') return 'viewBox';
  if (lowered === 'pathlength') return 'pathLength';
  if (lowered.startsWith('aria-') || lowered.startsWith('data-')) return lowered;

  if (name.includes(':')) {
    const [prefix, rest] = name.split(':');
    return `${prefix}${rest ? rest.charAt(0).toUpperCase() + rest.slice(1) : ''}`;
  }

  if (name.includes('-')) {
    return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  }

  return name;
}

function parsePx(value) {
  if (typeof value !== 'string') return null;
  const match = value.trim().match(/^(-?\d+(?:\.\d+)?)px$/);
  if (!match) return null;
  return Number(match[1]);
}

function isMeaningfulPseudoContent(contentValue) {
  if (typeof contentValue !== 'string') return false;
  const trimmed = contentValue.trim();
  if (!trimmed) return false;
  if (trimmed === 'none' || trimmed === 'normal') return false;
  if (trimmed === '""' || trimmed === "''") return false;
  return true;
}

function serializePseudoContent(contentValue) {
  if (!isMeaningfulPseudoContent(contentValue)) {
    return '""';
  }
  const trimmed = contentValue.trim();
  if (
    trimmed.startsWith('"') ||
    trimmed.startsWith("'") ||
    trimmed.startsWith('url(') ||
    trimmed.startsWith('attr(')
  ) {
    return trimmed;
  }
  return `"${trimmed.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function shouldKeepPseudo(styleObj) {
  if (!styleObj || typeof styleObj !== 'object') return false;

  if (isMeaningfulPseudoContent(styleObj.content)) return true;

  for (const [prop, val] of Object.entries(styleObj)) {
    if (prop === 'content' || prop === 'cssVars') continue;
    if (typeof val !== 'string' || !val.trim()) continue;
    if (PSEUDO_MEANINGFUL_PROPS.some((k) => prop === k || prop.startsWith(`${k}-`))) {
      return true;
    }
  }

  if (styleObj.cssVars && typeof styleObj.cssVars === 'object') {
    return Object.keys(styleObj.cssVars).length > 0;
  }

  return false;
}

function splitSelectorList(selector) {
  const parts = [];
  let current = '';
  let escaped = false;
  let parenDepth = 0;
  let bracketDepth = 0;
  let braceDepth = 0;

  for (const char of selector) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }

    if (char === '\\') {
      current += char;
      escaped = true;
      continue;
    }

    if (char === '(') parenDepth += 1;
    else if (char === ')' && parenDepth > 0) parenDepth -= 1;
    else if (char === '[') bracketDepth += 1;
    else if (char === ']' && bracketDepth > 0) bracketDepth -= 1;
    else if (char === '{') braceDepth += 1;
    else if (char === '}' && braceDepth > 0) braceDepth -= 1;

    const atTopLevel =
      parenDepth === 0 && bracketDepth === 0 && braceDepth === 0;

    if (char === ',' && atTopLevel) {
      parts.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  if (current) parts.push(current);
  return parts;
}

function scopeSelector(selector, shellClass) {
  return splitSelectorList(selector)
    .map((part) => {
      const trimmed = part.trim();
      if (!trimmed) return trimmed;
      if (trimmed.startsWith('[dir] ')) {
        return trimmed.replace(/^\[dir\]\s+/, `[dir] ${shellClass} `);
      }
      if (trimmed.startsWith('html ')) {
        return trimmed.replace(/^html\s+/, `html ${shellClass} `);
      }
      if (trimmed.startsWith(shellClass)) {
        return trimmed;
      }
      return `${shellClass} ${trimmed}`;
    })
    .join(', ');
}

function appendCssBlock(lines, selector, styleObj, options = {}) {
  if (!styleObj || typeof styleObj !== 'object') return;

  const declarations = [];

  for (const [prop, val] of Object.entries(styleObj)) {
    if (prop === 'content' || prop === 'cssVars') continue;
    if (typeof val === 'string' && val.trim()) {
      declarations.push(`  ${prop}: ${val};`);
    }
  }

  if (options.includePseudoContent && isMeaningfulPseudoContent(styleObj.content)) {
    declarations.unshift(`  content: ${serializePseudoContent(styleObj.content)};`);
  }

  if (styleObj.cssVars && typeof styleObj.cssVars === 'object') {
    for (const [varName, varValue] of Object.entries(styleObj.cssVars)) {
      if (
        typeof varName === 'string' &&
        varName.startsWith('--') &&
        typeof varValue === 'string' &&
        varValue.trim()
      ) {
        declarations.push(`  ${varName}: ${varValue};`);
      }
    }
  }

  if (declarations.length === 0) return;

  lines.push(`${selector} {`);
  lines.push(...declarations);
  lines.push('}');
  lines.push('');
}

function normalizeElementStyles(styleObj, el, rootId, topLevelIds, options = {}) {
  const normalized = { ...(styleObj || {}) };
  const isRoot = el.id === rootId;
  const isTopLevel = topLevelIds.has(el.id);
  const applyRootViewportFix = options.applyRootViewportFix !== false;

  if (isRoot && applyRootViewportFix) {
    delete normalized.height;
    normalized['min-height'] = '100vh';
    normalized['overflow-y'] = 'visible';
  }

  const overflowY = normalized['overflow-y'];
  const heightPx = parsePx(normalized.height);

  if (!isRoot && (overflowY === 'auto' || overflowY === 'scroll')) {
    normalized['overflow-y'] = 'visible';

    if (heightPx !== null && heightPx >= 180) {
      normalized.height = 'auto';
      delete normalized['max-height'];
    }
  }

  if (isTopLevel) {
    if (heightPx !== null && heightPx >= 500) {
      normalized.height = 'auto';
      delete normalized['max-height'];
    }

    const widthPx = parsePx(normalized.width);
    if (widthPx !== null && widthPx >= 1800) {
      normalized.width = '100%';
    }
  }

  return normalized;
}

function buildTreeMeta(data) {
  const elements = Array.isArray(data?.elements) ? data.elements : [];
  const byId = new Map();
  const byParent = new Map();
  let rootId = null;

  for (const el of elements) {
    byId.set(el.id, el);
    const parent = el.parentId ?? '__ROOT__';
    if (!byParent.has(parent)) byParent.set(parent, []);
    byParent.get(parent).push(el.id);
    if (el.parentId == null && rootId == null) rootId = el.id;
  }

  return { elements, byId, byParent, rootId };
}

function buildCss(data, options) {
  const {
    shellClass,
    classPrefix,
    applyRootViewportFix = true,
    addGirisFixes = false,
    addAuthFixes = false,
  } = options;

  const { elements, byParent, rootId } = buildTreeMeta(data);
  const lines = [];
  const cssVarDefaults = data?.cssVarDefaults || {};
  const keyframes = Array.isArray(data?.keyframes) ? data.keyframes : [];
  const interactiveRules = Array.isArray(data?.interactiveRules) ? data.interactiveRules : [];
  const topLevelIds = new Set(byParent.get(rootId) || []);

  if (Object.keys(cssVarDefaults).length) {
    lines.push(`${shellClass} {`);
    for (const [varName, varValue] of Object.entries(cssVarDefaults)) {
      if (
        typeof varName === 'string' &&
        varName.startsWith('--') &&
        typeof varValue === 'string' &&
        varValue.trim()
      ) {
        lines.push(`  ${varName}: ${varValue};`);
      }
    }
    lines.push('}');
    lines.push('');
  }

  for (const el of elements) {
    const id = el?.id;
    if (!id || typeof id !== 'string') continue;

    const normalizedStyles = normalizeElementStyles(
      el.styles || {},
      el,
      rootId,
      topLevelIds,
      { applyRootViewportFix },
    );

    appendCssBlock(lines, `.${classPrefix}-${id}`, normalizedStyles);

    if (el.cssVarOverrides && typeof el.cssVarOverrides === 'object') {
      appendCssBlock(lines, `.${classPrefix}-${id}`, { cssVars: el.cssVarOverrides });
    }

    if (shouldKeepPseudo(el.pseudoBefore)) {
      appendCssBlock(lines, `.${classPrefix}-${id}::before`, el.pseudoBefore, { includePseudoContent: true });
    }

    if (shouldKeepPseudo(el.pseudoAfter)) {
      appendCssBlock(lines, `.${classPrefix}-${id}::after`, el.pseudoAfter, { includePseudoContent: true });
    }
  }

  for (const kf of keyframes) {
    if (typeof kf?.cssText === 'string' && kf.cssText.trim()) {
      lines.push(kf.cssText);
      lines.push('');
    }
  }

  const groupedMedia = new Map();

  for (const rule of interactiveRules) {
    const selector = typeof rule?.selector === 'string' ? rule.selector.trim() : '';
    const properties = rule?.properties && typeof rule.properties === 'object' ? rule.properties : null;
    if (!selector || !properties) continue;

    const scoped = scopeSelector(selector, shellClass);
    const ruleLines = [];

    for (const [prop, value] of Object.entries(properties)) {
      if (typeof value === 'string' && value.trim()) {
        ruleLines.push(`  ${prop}: ${value};`);
      }
    }

    if (!ruleLines.length) continue;

    const block = [`${scoped} {`, ...ruleLines, '}', ''].join('\n');
    const media = typeof rule.media === 'string' && rule.media.trim() ? rule.media.trim() : null;

    if (!media) {
      lines.push(block);
      continue;
    }

    if (!groupedMedia.has(media)) groupedMedia.set(media, []);
    groupedMedia.get(media).push(block);
  }

  for (const [media, blocks] of groupedMedia.entries()) {
    lines.push(`${media} {`);
    for (const block of blocks) {
      const indented = block
        .split('\n')
        .map((line) => (line ? `  ${line}` : line))
        .join('\n');
      lines.push(indented);
    }
    lines.push('}');
    lines.push('');
  }

  if (addGirisFixes) {
    lines.push('.gra-shell .gra-el-2008 {');
    lines.push('  position: relative !important;');
    lines.push('  left: auto !important;');
    lines.push('  right: auto !important;');
    lines.push('  width: 100vw !important;');
    lines.push('  min-width: 100vw !important;');
    lines.push('  max-width: none !important;');
    lines.push('  margin-left: calc(50% - 50vw) !important;');
    lines.push('  margin-right: calc(50% - 50vw) !important;');
    lines.push('}');
    lines.push('');
    lines.push('.gra-shell .gra-el-2009 {');
    lines.push('  width: 100% !important;');
    lines.push('  min-width: 100% !important;');
    lines.push('  max-width: none !important;');
    lines.push('  height: 100% !important;');
    lines.push('  object-fit: cover !important;');
    lines.push('  display: block !important;');
    lines.push('}');
    lines.push('');
    lines.push('.gra-shell .gra-el-2010 {');
    lines.push('  width: 100% !important;');
    lines.push('  min-width: 100% !important;');
    lines.push('  overflow-y: visible !important;');
    lines.push('}');
    lines.push('');
  }

  if (addAuthFixes) {
    lines.push('.ara-shell .ara-el-0 {');
    lines.push('  position: relative !important;');
    lines.push('  display: grid !important;');
    lines.push('  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;');
    lines.push('  align-items: stretch !important;');
    lines.push('  width: 100% !important;');
    lines.push('  min-height: 100vh !important;');
    lines.push('  overflow: visible !important;');
    lines.push('}');
    lines.push('');
    lines.push('.ara-shell .ara-el-1 {');
    lines.push('  grid-column: 1 / 2 !important;');
    lines.push('  width: 100% !important;');
    lines.push('  min-width: 0 !important;');
    lines.push('  min-height: 100vh !important;');
    lines.push('  height: auto !important;');
    lines.push('}');
    lines.push('');
    lines.push('.ara-shell .ara-el-85 {');
    lines.push('  grid-column: 2 / 3 !important;');
    lines.push('  width: 100% !important;');
    lines.push('  min-width: 0 !important;');
    lines.push('  min-height: 100vh !important;');
    lines.push('  height: auto !important;');
    lines.push('  margin-left: 0 !important;');
    lines.push('  position: sticky !important;');
    lines.push('  right: auto !important;');
    lines.push('  top: 0 !important;');
    lines.push('  z-index: 1 !important;');
    lines.push('  overflow: hidden !important;');
    lines.push('}');
    lines.push('');
    lines.push('.ara-shell .ara-el-86 {');
    lines.push('  width: 100% !important;');
    lines.push('  min-width: 100% !important;');
    lines.push('  min-height: 100vh !important;');
    lines.push('  height: 100% !important;');
    lines.push('  display: block !important;');
    lines.push('  object-fit: cover !important;');
    lines.push('  object-position: 100% 50% !important;');
    lines.push('}');
    lines.push('');
    lines.push('.ara-shell .ara-el-76, .ara-shell .ara-el-82 {');
    lines.push('  display: none !important;');
    lines.push('}');
    lines.push('');
    lines.push('.ara-shell .ara-el-67 {');
    lines.push('  display: flex !important;');
    lines.push('  flex-wrap: wrap !important;');
    lines.push('  justify-content: center !important;');
    lines.push('  align-items: center !important;');
    lines.push('  gap: 6px !important;');
    lines.push('  width: 100% !important;');
    lines.push('  height: auto !important;');
    lines.push('  line-height: 1.3 !important;');
    lines.push('  text-align: center !important;');
    lines.push('}');
    lines.push('');
    lines.push('.ara-shell .ara-el-68, .ara-shell .ara-el-69 {');
    lines.push('  white-space: nowrap !important;');
    lines.push('}');
    lines.push('');
    lines.push('.ara-shell .ara-el-70 {');
    lines.push('  display: flex !important;');
    lines.push('  flex-wrap: wrap !important;');
    lines.push('  align-items: center !important;');
    lines.push('  justify-content: center !important;');
    lines.push('  gap: 12px !important;');
    lines.push('  width: 100% !important;');
    lines.push('  height: auto !important;');
    lines.push('  grid-template-columns: none !important;');
    lines.push('  grid-template-rows: none !important;');
    lines.push('}');
    lines.push('');
    lines.push('.ara-shell .ara-el-39::before, .ara-shell .ara-el-48::before {');
    lines.push('  display: none !important;');
    lines.push('  box-shadow: none !important;');
    lines.push('  opacity: 0 !important;');
    lines.push('}');
    lines.push('');
    lines.push('.ara-shell .ara-el-39, .ara-shell .ara-el-48 {');
    lines.push('  transition: transform 0.14s ease, filter 0.14s ease !important;');
    lines.push('}');
    lines.push('');
    lines.push('.ara-shell .ara-el-39:hover .ara-el-40, .ara-shell .ara-el-48:hover .ara-el-49 {');
    lines.push('  background-color: rgb(249, 249, 251) !important;');
    lines.push('  border-color: rgb(187, 187, 193) !important;');
    lines.push('}');
    lines.push('');
    lines.push('.ara-shell .ara-el-39:hover, .ara-shell .ara-el-48:hover {');
    lines.push('  transform: translateY(-1px) !important;');
    lines.push('}');
    lines.push('');
  }

  return lines.join('\n');
}

function buildJsxTree(data, options) {
  const {
    classPrefix,
    componentName,
    languageLabelId = null,
    translatableAttrs = null,
  } = options;

  const { byId, byParent, rootId } = buildTreeMeta(data);

  const renderNode = (id, depth = 3) => {
    const el = byId.get(id);
    if (!el) return '';

    const tag = getRenderableTag(el.tag);
    if (tag === 'script' || tag === 'style') return '';

    const indent = '  '.repeat(depth);
    const childIndent = '  '.repeat(depth + 1);
    const attrs = [];

    const classTokens = [`${classPrefix}-${el.id}`];
    if (typeof el.classes === 'string' && el.classes.trim()) {
      classTokens.push(el.classes.trim());
    }

    attrs.push(`className={${JSON.stringify(classTokens.join(' '))}}`);
    attrs.push(`data-el-id={${JSON.stringify(el.id)}}`);

    const combinedAttrs = { ...(el.attrs || {}), ...(el.svgAttrs || {}) };
    for (const [rawName, rawValue] of Object.entries(combinedAttrs)) {
      if (rawName === 'class' || rawName === 'style') continue;
      const reactName = toReactAttrName(rawName);
      if (!reactName) continue;

      const attrLower = String(rawName).toLowerCase();
      const shouldTranslateAttr =
        typeof rawValue === 'string' && translatableAttrs?.has(attrLower);

      if (shouldTranslateAttr) {
        attrs.push(`${reactName}={translateText(${JSON.stringify(rawValue)})}`);
      } else {
        attrs.push(`${reactName}={${JSON.stringify(rawValue)}}`);
      }
    }

    const openTag = `<${tag}${attrs.length ? ` ${attrs.join(' ')}` : ''}`;

    const childIds = byParent.get(el.id) || [];
    const childNodes = childIds.map((childId) => renderNode(childId, depth + 1)).filter(Boolean);

    const hasText = typeof el.text === 'string' && el.text.trim().length > 0;
    const textExpr = hasText
      ? el.id === languageLabelId
        ? `{languageLabel ?? translateText(${JSON.stringify(el.text)})}`
        : `{translateText(${JSON.stringify(el.text)})}`
      : null;

    if (VOID_TAGS.has(tag) && !hasText && childNodes.length === 0) {
      return `${indent}${openTag} />`;
    }

    const lines = [];
    lines.push(`${indent}${openTag}>`);

    if (textExpr) {
      lines.push(`${childIndent}${textExpr}`);
    }

    if (childNodes.length) {
      lines.push(...childNodes);
    }

    lines.push(`${indent}</${tag}>`);
    return lines.join('\n');
  };

  const rootJsx = rootId ? renderNode(rootId, 3) : '      <div />';

  return `/* eslint-disable */\n\nexport default function ${componentName}({ translateText = (value) => value, languageLabel }) {\n  return (\n${rootJsx}\n  );\n}\n`;
}

function writeFile(relPath, content) {
  const full = path.join(ROOT, relPath);
  ensureDir(path.dirname(full));
  fs.writeFileSync(full, content, 'utf8');
  console.log(`Wrote ${relPath}`);
}

function generateGiris() {
  const namespacedHeader = namespaceExtractionData(girisHeader, 'hdr');
  const namespacedMenu = namespaceExtractionData(girisMenu, 'mnu');
  const namespacedLanguage = namespaceExtractionData(girisLanguage, 'lng');

  const mainJsx = buildJsxTree(girisMain, {
    classPrefix: 'gra',
    componentName: 'GirisNativeMainTree',
    translatableAttrs: TRANSLATABLE_ATTRS,
  });
  const headerJsx = buildJsxTree(namespacedHeader, {
    classPrefix: 'gra',
    componentName: 'GirisNativeHeaderTree',
    translatableAttrs: TRANSLATABLE_ATTRS,
  });
  const menuJsx = buildJsxTree(namespacedMenu, {
    classPrefix: 'gra',
    componentName: 'GirisNativeMenuTree',
    languageLabelId: 'mnu-el-19',
    translatableAttrs: TRANSLATABLE_ATTRS,
  });
  const languageJsx = buildJsxTree(namespacedLanguage, {
    classPrefix: 'gra',
    componentName: 'GirisNativeLanguageTree',
    translatableAttrs: TRANSLATABLE_ATTRS,
  });

  const cssParts = [
    buildCss(namespacedHeader, {
      shellClass: '.gra-shell',
      classPrefix: 'gra',
      applyRootViewportFix: false,
    }),
    buildCss(girisMain, {
      shellClass: '.gra-shell',
      classPrefix: 'gra',
      applyRootViewportFix: true,
      addGirisFixes: true,
    }),
    buildCss(namespacedMenu, {
      shellClass: '.gra-shell',
      classPrefix: 'gra',
      applyRootViewportFix: false,
    }),
    buildCss(namespacedLanguage, {
      shellClass: '.gra-shell',
      classPrefix: 'gra',
      applyRootViewportFix: false,
    }),
  ];

  writeFile('src/pages/generated/GirisNativeMainTree.jsx', mainJsx);
  writeFile('src/pages/generated/GirisNativeHeaderTree.jsx', headerJsx);
  writeFile('src/pages/generated/GirisNativeMenuTree.jsx', menuJsx);
  writeFile('src/pages/generated/GirisNativeLanguageTree.jsx', languageJsx);
  writeFile('src/pages/generated/giris-native-generated.css', cssParts.join('\n\n'));
}

function generateAuth() {
  const authJsx = buildJsxTree(authData, {
    classPrefix: 'ara',
    componentName: 'AuthNativeTree',
    translatableAttrs: new Set(['alt', 'title', 'placeholder', 'aria-label', 'value']),
  });

  const css = buildCss(authData, {
    shellClass: '.ara-shell',
    classPrefix: 'ara',
    applyRootViewportFix: true,
    addAuthFixes: true,
  });

  writeFile('src/pages/generated/AuthNativeTree.jsx', authJsx);
  writeFile('src/pages/generated/auth-native-generated.css', css);
}

generateGiris();
generateAuth();
