import json
from collections import defaultdict

INPUT = r'Fresh/Magza.json'
OUT_JSX = r'src/pages/MagzaReplica.jsx'
OUT_CSS = r'src/pages/MagzaReplica.css'

TAG_ALIAS = {
    'clippath': 'clipPath',
    'foreignobject': 'foreignObject',
}
VOID_TAGS = set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr','path'])

with open(INPUT,'r',encoding='utf-8') as f:
    data = json.load(f)

elements = data['elements']
by_id = {e['id']: e for e in elements}
children = defaultdict(list)
root_id = None
for e in elements:
    pid = e.get('parentId')
    if pid is None and root_id is None:
        root_id = e['id']
    children[pid].append(e['id'])

# CSS generation
css_lines = []
css_lines.append('.mzr-shell {')
css_lines.append('  width: 100%;')
css_lines.append('  min-height: 100vh;')
css_lines.append('  overflow-x: hidden;')
css_lines.append('  overflow-y: visible;')
css_lines.append('}')
css_lines.append('')
css_lines.append('.mzr-shell *, .mzr-shell *::before, .mzr-shell *::after {')
css_lines.append('  box-sizing: border-box;')
css_lines.append('}')
css_lines.append('')

# css var defaults
css_vars = data.get('cssVarDefaults') or {}
if css_vars:
    css_lines.append('.mzr-shell {')
    for k,v in css_vars.items():
        if isinstance(k,str) and k.startswith('--') and isinstance(v,str) and v.strip():
            css_lines.append(f'  {k}: {v};')
    css_lines.append('}')
    css_lines.append('')

# element styles
for e in elements:
    cls = f".mzr-{e['id']}"
    styles = e.get('styles') or {}
    css_lines.append(f'{cls} {{')
    for prop,val in styles.items():
        if not isinstance(val,str) or not val.strip():
            continue
        css_lines.append(f'  {prop}: {val};')
    css_lines.append('}')
    css_lines.append('')

    # pseudo
    for pseudo_key, pseudo_sel in (('pseudoBefore','::before'), ('pseudoAfter','::after')):
        ps = e.get(pseudo_key) or {}
        if not ps:
            continue
        lines = []
        content = ps.get('content')
        if content and content not in ('none','normal','""','\'\''):
            lines.append(f'  content: {content};')
        for prop,val in ps.items():
            if prop in ('content','cssVars'):
                continue
            if isinstance(val,str) and val.strip():
                lines.append(f'  {prop}: {val};')
        css_vars_over = ps.get('cssVars') or {}
        for k,v in css_vars_over.items():
            if isinstance(k,str) and k.startswith('--') and isinstance(v,str) and v.strip():
                lines.append(f'  {k}: {v};')
        if lines:
            css_lines.append(f'{cls}{pseudo_sel} {{')
            css_lines.extend(lines)
            css_lines.append('}')
            css_lines.append('')

# keyframes
for kf in data.get('keyframes') or []:
    cssText = kf.get('cssText')
    if isinstance(cssText,str) and cssText.strip():
        css_lines.append(cssText)
        css_lines.append('')

# interactive rules
for rule in data.get('interactiveRules') or []:
    selector = rule.get('selector')
    props = rule.get('properties') or {}
    if not selector or not props:
        continue
    css_lines.append(f'.mzr-shell {selector} {{')
    for prop,val in props.items():
        if isinstance(val,str) and val.strip():
            css_lines.append(f'  {prop}: {val};')
    css_lines.append('}')
    css_lines.append('')

with open(OUT_CSS,'w',encoding='utf-8') as f:
    f.write('\n'.join(css_lines))

# JSX generation
jsx_lines = []
jsx_lines.append("import { useEffect } from 'react';")
jsx_lines.append("import './MagzaReplica.css';")
jsx_lines.append('')
jsx_lines.append('export default function MagzaReplica() {')
jsx_lines.append('  useEffect(() => {')
jsx_lines.append('    const html = document.documentElement;')
jsx_lines.append('    const body = document.body;')
jsx_lines.append('    const root = document.getElementById(\'root\');')
jsx_lines.append('')
jsx_lines.append('    const prev = {')
jsx_lines.append('      htmlOverflow: html.style.overflow,')
jsx_lines.append('      htmlOverflowY: html.style.overflowY,')
jsx_lines.append('      bodyOverflow: body.style.overflow,')
jsx_lines.append('      bodyOverflowY: body.style.overflowY,')
jsx_lines.append('      bodyHeight: body.style.height,')
jsx_lines.append('      rootOverflow: root ? root.style.overflow : \'\',')
jsx_lines.append('      rootHeight: root ? root.style.height : \'\',')
jsx_lines.append('      rootMinHeight: root ? root.style.minHeight : \'\',')
jsx_lines.append('    };')
jsx_lines.append('')
jsx_lines.append('    html.style.overflow = \'auto\';')
jsx_lines.append('    html.style.overflowY = \'auto\';')
jsx_lines.append('    body.style.overflow = \'auto\';')
jsx_lines.append('    body.style.overflowY = \'auto\';')
jsx_lines.append('    body.style.height = \'auto\';')
jsx_lines.append('    if (root) {')
jsx_lines.append('      root.style.overflow = \'visible\';')
jsx_lines.append('      root.style.height = \'auto\';')
jsx_lines.append('      root.style.minHeight = \'100vh\';')
jsx_lines.append('    }')
jsx_lines.append('')
jsx_lines.append('    return () => {')
jsx_lines.append('      html.style.overflow = prev.htmlOverflow;')
jsx_lines.append('      html.style.overflowY = prev.htmlOverflowY;')
jsx_lines.append('      body.style.overflow = prev.bodyOverflow;')
jsx_lines.append('      body.style.overflowY = prev.bodyOverflowY;')
jsx_lines.append('      body.style.height = prev.bodyHeight;')
jsx_lines.append('      if (root) {')
jsx_lines.append('        root.style.overflow = prev.rootOverflow;')
jsx_lines.append('        root.style.height = prev.rootHeight;')
jsx_lines.append('        root.style.minHeight = prev.rootMinHeight;')
jsx_lines.append('      }')
jsx_lines.append('    };')
jsx_lines.append('  }, []);')
jsx_lines.append('')
jsx_lines.append('  return (')
jsx_lines.append('    <div className="mzr-shell">')


def render_node(node_id, indent=6):
    e = by_id[node_id]
    tag = e.get('tag') or 'div'
    tag = TAG_ALIAS.get(tag, tag)

    class_tokens = [f"mzr-{e['id']}"]
    raw_classes = (e.get('classes') or '').strip()
    if raw_classes:
        class_tokens.append(raw_classes)
    class_attr = ' '.join(class_tokens)

    attrs = {}
    attrs.update(e.get('attrs') or {})
    attrs.update(e.get('svgAttrs') or {})
    attr_parts = []
    attr_parts.append(f'className="{class_attr}"')
    attr_parts.append(f'data-el-id="{e['id']}"')
    for k,v in attrs.items():
        if k in ('class','style'):
            continue
        rk = k
        if k.lower() == 'class':
            rk = 'className'
        elif k.lower() == 'for':
            rk = 'htmlFor'
        elif k.lower() == 'tabindex':
            rk = 'tabIndex'
        elif k.lower() == 'srcset':
            rk = 'srcSet'
        elif k.lower() == 'playsinline':
            rk = 'playsInline'
        elif k.lower() == 'autoplay':
            rk = 'autoPlay'
        elif k.lower() == 'readonly':
            rk = 'readOnly'
        elif k.lower() == 'viewbox':
            rk = 'viewBox'
        elif k.lower() == 'pathlength':
            rk = 'pathLength'
        elif k.lower().startswith('aria-') or k.lower().startswith('data-'):
            rk = k.lower()
        if isinstance(v, bool):
            attr_parts.append(f'{rk}={{%s}}' % ('true' if v else 'false'))
        else:
            val = str(v).replace('"','&quot;')
            attr_parts.append(f'{rk}="{val}"')

    prop_str = ' ' + ' '.join(attr_parts) if attr_parts else ''
    pad = ' ' * indent
    jsx_lines.append(f"{pad}{{/* {e['id']} */}}")

    text = e.get('text') or ''
    child_ids = children.get(node_id, [])

    if tag in VOID_TAGS:
        jsx_lines.append(f"{pad}<{tag}{prop_str} />")
        return

    jsx_lines.append(f"{pad}<{tag}{prop_str}>")
    if text.strip():
        jsx_lines.append(f"{pad}  {text}")
    for cid in child_ids:
        render_node(cid, indent + 2)
    jsx_lines.append(f"{pad}</{tag}>")

if root_id:
    render_node(root_id, indent=6)

jsx_lines.append('    </div>')
jsx_lines.append('  );')
jsx_lines.append('}')

with open(OUT_JSX,'w',encoding='utf-8') as f:
    f.write('\n'.join(jsx_lines))

print('WROTE', OUT_JSX)
print('WROTE', OUT_CSS)
