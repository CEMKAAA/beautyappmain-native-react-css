import json

with open(r'Fresh/Magza.json','r',encoding='utf-8') as f:
    data=json.load(f)

by_id={e['id']:e for e in data['elements']}
children={}
for e in data['elements']:
    children.setdefault(e.get('parentId'), []).append(e['id'])

# inspect services rail and list container
rail='el-124'
print('rail children', children.get(rail, [])[:20])
for cid in children.get(rail, [])[:12]:
    e=by_id[cid]
    print(' ', cid, e.get('tag'), (e.get('text') or '').strip(), e.get('classes'), e.get('styles',{}))

# inspect services list container
svc_list='el-182'
print('\nservices list children', children.get(svc_list, [])[:10])
for cid in children.get(svc_list, [])[:6]:
    e=by_id[cid]
    print(' ', cid, e.get('tag'), (e.get('text') or '').strip(), e.get('classes'))

# find closed opens on tuesday
for e in data['elements']:
    txt=(e.get('text') or '').strip()
    if 'Closed opens on' in txt:
        print('CLOSED', e['id'], e.get('tag'), txt, e.get('classes'), e.get('styles',{}))

# team section: find text 'Team'
for e in data['elements']:
    txt=(e.get('text') or '').strip()
    if txt=='Team':
        print('TEAM', e['id'], e.get('tag'), e.get('classes'), e.get('styles',{}))

# find elements with border-color rgb(0,0,0) and class contains Team
for e in data['elements']:
    cls=(e.get('classes') or '')
    styles=e.get('styles') or {}
    if 'Team' in cls and any('border' in k for k in styles.keys()):
        print('TEAM BORDER', e['id'], cls, styles)

