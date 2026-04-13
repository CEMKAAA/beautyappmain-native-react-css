import { useMemo } from 'react';
import source from '../../Fresh/giris-computed-styles.json';
import './GirisReplica.css';

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

  if (name === 'disabled' || name === 'aria-hidden') {
    if (value === '' || value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
  }

  if (name === 'tabIndex' && typeof value === 'string') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? value : parsed;
  }

  return value;
}

export default function GirisReplica() {
  const { rootId, byId, byParent } = useMemo(() => {
    const elements = Array.isArray(source?.elements) ? source.elements : [];
    const nextById = new Map();
    const nextByParent = new Map();
    let nextRootId = null;

    for (const el of elements) {
      nextById.set(el.id, el);
      const parent = el.parentId ?? '__ROOT__';
      if (!nextByParent.has(parent)) {
        nextByParent.set(parent, []);
      }
      nextByParent.get(parent).push(el.id);
      if (el.parentId == null && nextRootId == null) {
        nextRootId = el.id;
      }
    }

    return {
      rootId: nextRootId,
      byId: nextById,
      byParent: nextByParent,
    };
  }, []);

  const renderNode = (id) => {
    const el = byId.get(id);
    if (!el) return null;

    const tag = getRenderableTag(el.tag);
    if (tag === 'script') return null;

    const classTokens = [`gr-${el.id}`];
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
      props[reactName] = coerceAttrValue(reactName, rawValue);
    }

    if (el.cssVarOverrides && typeof el.cssVarOverrides === 'object') {
      props.style = el.cssVarOverrides;
    }

    if (tag === 'a' && !props.href) props.href = '#';
    if (tag === 'button') props.type = props.type || 'button';
    if (tag === 'img' && !props.alt) props.alt = '';
    if (tag === 'input' && !props.type) props.type = 'text';

    const children = (byParent.get(el.id) || []).map((childId) => renderNode(childId));
    const Tag = tag;

    if (VOID_TAGS.has(tag)) {
      return <Tag {...props} />;
    }

    const hasText = typeof el.text === 'string' && el.text.trim().length > 0;
    if (hasText) {
      return (
        <Tag {...props}>
          {el.text}
          {children}
        </Tag>
      );
    }

    return <Tag {...props}>{children}</Tag>;
  };

  if (!rootId) {
    return <div className="gr-page-shell">No root element found.</div>;
  }

  const rootNode = renderNode(rootId);

  return <div className="gr-page-shell">{rootNode}</div>;
}
