import json, collections

with open(r'Fresh/MarketPlaceJson.json','r',encoding='utf-8') as f:
    data = json.load(f)

elements = data['elements']
children = collections.defaultdict(list)
root = None
for e in elements:
    pid = e.get('parentId')
    if pid is None and root is None:
        root = e['id']
    children[pid].append(e['id'])

key_props = [
    'display','position','width','height','min-width','min-height','max-width','max-height',
    'margin','padding','background-color','color','font-size','line-height','font-weight',
    'gap','row-gap','column-gap','flex','flex-direction','justify-content','align-items',
    'grid-template-columns','grid-template-rows','overflow','overflow-x','overflow-y',
    'z-index','transform','opacity'
]

rows = []
for e in elements:
    styles = e.get('styles',{}) or {}
    keys = []
    for p in key_props:
        v = styles.get(p)
        if v:
            keys.append(f"{p}: {v}")
    key_styles = '; '.join(keys)
    tag = e.get('tag')
    classes = e.get('classes','')
    if tag in ('img','svg','path'):
        role = 'media/icon'
    elif tag == 'button':
        role = 'button'
    elif tag == 'a':
        role = 'link'
    elif tag in ('input','textarea','select'):
        role = 'form control'
    else:
        if styles.get('display') in ('flex','grid') or styles.get('position') in ('relative','absolute','fixed','sticky'):
            role = 'container'
        else:
            role = 'wrapper'
    rows.append((e['id'], tag, role, key_styles, classes))

out_path = r'Fresh/marketplace-step6-analysis.md'
with open(out_path,'w',encoding='utf-8') as f:
    f.write('# MarketPlace Step 6 Analysis\n\n')
    f.write('| Element ID | Tag | Semantik Rol | Anahtar Stiller | Classes |\n')
    f.write('|---|---|---|---|---|\n')
    for rid,tag,role,ks,cls in rows:
        ks = str(ks).replace('\n',' ')
        cls = str(cls).replace('\n',' ')
        f.write(f'| {rid} | `{tag}` | {role} | {ks} | {cls} |\n')

print('WROTE', out_path)
