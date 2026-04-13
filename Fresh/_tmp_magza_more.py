import json

with open(r'Fresh/Magza.json','r',encoding='utf-8') as f:
    data=json.load(f)

by_id={e['id']:e for e in data['elements']}
children={}
for e in data['elements']:
    children.setdefault(e.get('parentId'), []).append(e['id'])

# children of services tabs container el-126
print('tabs children', children.get('el-126', [])[:30])
for cid in children.get('el-126', [])[:10]:
    e=by_id[cid]
    print(' tab', cid, e.get('tag'), (e.get('text') or '').strip(), e.get('classes'), e.get('styles',{}))

# children of el-156 (arrow area)
print('\narrows area el-156 children', children.get('el-156', [])[:10])
for cid in children.get('el-156', [])[:10]:
    e=by_id[cid]
    print(' arrow child', cid, e.get('tag'), e.get('classes'), e.get('styles',{}))

# inspect visibility_gte_laptop el-184 content
print('\nlist container el-184 children', children.get('el-184', [])[:10])
for cid in children.get('el-184', [])[:10]:
    e=by_id[cid]
    print(' list child', cid, e.get('tag'), (e.get('text') or '').strip(), e.get('classes'), e.get('styles',{}))

# find text containing 'Closed' or 'opens'
for e in data['elements']:
    txt=(e.get('text') or '').strip()
    if 'Closed' in txt or 'opens' in txt:
        print('CLOSED', e['id'], e.get('tag'), txt, e.get('classes'), e.get('styles',{}))

# find employees cards with borders
for e in data['elements']:
    cls=(e.get('classes') or '')
    styles=e.get('styles') or {}
    if 'Employees' in cls and any(k.startswith('border') for k in styles.keys()):
        print('EMP BORDER', e['id'], cls, styles)
