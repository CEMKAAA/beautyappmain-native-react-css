import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import source from '../../Fresh/AuthPage.json';
import './AuthReplicaAdvanced.css';

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

const TEXT_TRANSLATIONS = new Map([
  ['Fresha for professionals', 'Profesyoneller için Fresha'],
  ['Create an account or log in to manage your business.', 'İşletmenizi yönetmek için hesap oluşturun veya giriş yapın.'],
  ['Continue', 'Devam et'],
  ['OR', 'VEYA'],
  ['Continue with Facebook', 'Facebook ile devam et'],
  ['Continue with Google', 'Google ile devam et'],
  ['Google and apply', 'Google ile devam ederek'],
  ['Go to Fresha for customers', 'Müşteriler için Fresha\'ya git'],
  ['Are you a customer looking to book an appointment?', 'Randevu almak isteyen bir müşteri misiniz?'],
  ['Privacy Policy', 'Gizlilik Politikası'],
  ['Terms of Service', 'Hizmet Şartları'],
  ['English (US)', 'Türkçe (TR)'],
  ['Support', 'Destek'],
  ['This site is protected by reCAPTCHA', 'Bu site reCAPTCHA ile korunmaktadır'],
]);

const TRANSLATABLE_ATTRS = new Set(['alt', 'title', 'placeholder', 'aria-label', 'value']);
const BACK_ROUTE = '/giris-replica-advanced';
const BACK_BUTTON_IDS = new Set(['el-5']);
const BUTTON_ALERTS = {
  'el-29': 'Devam et butonuna basildi',
  'el-48': 'Google ile devam et butonuna basildi',
};

function translateText(value) {
  if (typeof value !== 'string') return value;
  return TEXT_TRANSLATIONS.get(value) || value;
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

function coerceAttrValue(name, value) {
  if (value == null) return value;

  if (
    name === 'disabled' ||
    name === 'checked' ||
    name === 'readOnly' ||
    name === 'muted' ||
    name === 'loop' ||
    name === 'controls' ||
    name === 'autoPlay' ||
    name === 'playsInline' ||
    name === 'aria-hidden'
  ) {
    if (value === '' || value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
  }

  if (name === 'tabIndex' && typeof value === 'string') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? value : parsed;
  }

  return value;
}

function scopeSelector(selector) {
  return selector
    .split(',')
    .map((part) => {
      const trimmed = part.trim();
      if (!trimmed) return trimmed;
      if (trimmed.startsWith('[dir] ')) {
        return trimmed.replace(/^\[dir\]\s+/, '[dir] .ara-shell ');
      }
      if (trimmed.startsWith('html ')) {
        return trimmed.replace(/^html\s+/, 'html .ara-shell ');
      }
      if (trimmed.startsWith('.ara-shell')) {
        return trimmed;
      }
      return `.ara-shell ${trimmed}`;
    })
    .join(', ');
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

function normalizeElementStyles(styleObj, el, rootId) {
  const normalized = { ...(styleObj || {}) };
  const isRoot = el.id === rootId;

  if (isRoot) {
    normalized.width = '100%';
    delete normalized.height;
    normalized['min-height'] = '100vh';
  }

  return normalized;
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

  if (!declarations.length) return;

  lines.push(`${selector} {`);
  lines.push(...declarations);
  lines.push('}');
  lines.push('');
}

function buildDynamicCss(data, rootId, byParent) {
  const lines = [];
  const cssVarDefaults = data?.cssVarDefaults || {};
  const elements = Array.isArray(data?.elements) ? data.elements : [];
  const keyframes = Array.isArray(data?.keyframes) ? data.keyframes : [];
  const interactiveRules = Array.isArray(data?.interactiveRules) ? data.interactiveRules : [];

  lines.push('/* Dynamic stylesheet from AuthPage.json */');
  lines.push('');

  if (Object.keys(cssVarDefaults).length) {
    lines.push('.ara-shell {');
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
    if (!el?.id) continue;
    const normalizedStyles = normalizeElementStyles(el.styles || {}, el, rootId, byParent);
    appendCssBlock(lines, `.ara-${el.id}`, normalizedStyles);

    if (el.cssVarOverrides && typeof el.cssVarOverrides === 'object') {
      appendCssBlock(lines, `.ara-${el.id}`, { cssVars: el.cssVarOverrides });
    }

    if (shouldKeepPseudo(el.pseudoBefore)) {
      appendCssBlock(lines, `.ara-${el.id}::before`, el.pseudoBefore, { includePseudoContent: true });
    }

    if (shouldKeepPseudo(el.pseudoAfter)) {
      appendCssBlock(lines, `.ara-${el.id}::after`, el.pseudoAfter, { includePseudoContent: true });
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

    const scoped = scopeSelector(selector);
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

  // Auth page fidelity fix:
  // Right-side hero image can be clipped/hidden in replica due sticky + negative z-index
  // and fixed pixel widths captured from a larger viewport.
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

  // Remove purple indicator/box around language link while keeping link text visible.
  lines.push('.ara-shell .ara-el-71, .ara-shell .ara-el-71::before, .ara-shell .ara-el-71::after {');
  lines.push('  background: transparent !important;');
  lines.push('  box-shadow: none !important;');
  lines.push('  border: none !important;');
  lines.push('}');
  lines.push('');
  lines.push('.ara-shell .ara-el-76, .ara-shell .ara-el-82 {');
  lines.push('  display: none !important;');
  lines.push('}');
  lines.push('');

  // Keep reCAPTCHA legal line readable after translation.
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

  // Footer purple links: avoid overlap by replacing fixed grid widths with wrapping flex.
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
  lines.push('.ara-shell .ara-el-71, .ara-shell .ara-el-77, .ara-shell .ara-el-83 {');
  lines.push('  width: auto !important;');
  lines.push('  margin-top: 0 !important;');
  lines.push('  margin-bottom: 0 !important;');
  lines.push('}');
  lines.push('');
  lines.push('.ara-shell .ara-el-72, .ara-shell .ara-el-78, .ara-shell .ara-el-84 {');
  lines.push('  width: auto !important;');
  lines.push('  max-width: 100% !important;');
  lines.push('}');
  lines.push('');

  // Social buttons (Facebook/Google): remove captured dark edge artifacts and add clean hover states.
  lines.push('.ara-shell .ara-el-39::before, .ara-shell .ara-el-48::before {');
  lines.push('  display: none !important;');
  lines.push('  box-shadow: none !important;');
  lines.push('  opacity: 0 !important;');
  lines.push('}');
  lines.push('');
  lines.push('.ara-shell .ara-el-39, .ara-shell .ara-el-48 {');
  lines.push('  transition: transform 0.14s ease, filter 0.14s ease !important;');
  lines.push('  will-change: transform;');
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
  lines.push('.ara-shell .ara-el-39:active, .ara-shell .ara-el-48:active {');
  lines.push('  transform: translateY(0) scale(0.985) !important;');
  lines.push('}');
  lines.push('');

  return lines.join('\n');
}

export default function AuthReplicaAdvanced() {
  const navigate = useNavigate();
  const [lastAction, setLastAction] = useState('');

  const { rootId, byId, byParent, styleText } = useMemo(() => {
    const elements = Array.isArray(source?.elements) ? source.elements : [];
    const nextById = new Map();
    const nextByParent = new Map();
    let nextRootId = null;

    for (const el of elements) {
      nextById.set(el.id, el);
      const parent = el.parentId ?? '__ROOT__';
      if (!nextByParent.has(parent)) nextByParent.set(parent, []);
      nextByParent.get(parent).push(el.id);
      if (el.parentId == null && nextRootId == null) nextRootId = el.id;
    }

    return {
      rootId: nextRootId,
      byId: nextById,
      byParent: nextByParent,
      styleText: buildDynamicCss(source, nextRootId, nextByParent),
    };
  }, []);

  const renderNode = (id) => {
    const el = byId.get(id);
    if (!el) return null;

    const tag = getRenderableTag(el.tag);
    if (tag === 'script' || tag === 'style') return null;

    const classTokens = [`ara-${el.id}`];
    if (typeof el.classes === 'string' && el.classes.trim()) {
      classTokens.push(el.classes.trim());
    }

    const props = {
      key: el.id,
      className: classTokens.join(' '),
      'data-el-id': el.id,
    };

    const combinedAttrs = { ...(el.attrs || {}), ...(el.svgAttrs || {}) };
    for (const [rawName, rawValue] of Object.entries(combinedAttrs)) {
      if (rawName === 'class' || rawName === 'style') continue;
      const reactName = toReactAttrName(rawName);
      if (!reactName) continue;
      const maybeTranslated =
        typeof rawValue === 'string' && TRANSLATABLE_ATTRS.has(reactName)
          ? translateText(rawValue)
          : rawValue;
      props[reactName] = coerceAttrValue(reactName, maybeTranslated);
    }

    if (tag === 'a' && !props.href) props.href = '#';
    if (tag === 'button') props.type = props.type || 'button';
    if (tag === 'img' && !props.alt) props.alt = '';
    if (tag === 'input' && !props.type) props.type = 'text';

    if (BACK_BUTTON_IDS.has(el.id)) {
      props.onClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        navigate(BACK_ROUTE);
      };
      props.onKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          navigate(BACK_ROUTE);
        }
      };
      if (props.role === 'button' && props.tabIndex == null) {
        props.tabIndex = 0;
      }
    }

    const clickMessage = BUTTON_ALERTS[el.id];
    if (clickMessage) {
      props.onClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setLastAction(clickMessage);
        window.alert(clickMessage);
      };
    }

    const children = (byParent.get(el.id) || []).map((childId) => renderNode(childId));
    const Tag = tag;

    if (VOID_TAGS.has(tag)) {
      return <Tag {...props} />;
    }

    const hasText = typeof el.text === 'string' && el.text.trim().length > 0;
    if (hasText) {
      return (
        <Tag {...props}>
          {translateText(el.text)}
          {children}
        </Tag>
      );
    }

    return <Tag {...props}>{children}</Tag>;
  };

  if (!rootId) {
    return <div className="ara-shell">Kök eleman bulunamadı.</div>;
  }

  return (
    <div className="ara-shell" data-last-action={lastAction || undefined}>
      <style>{styleText}</style>
      {renderNode(rootId)}
    </div>
  );
}
