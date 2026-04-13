import json

with open(r'Fresh/Magza.json','r',encoding='utf-8') as f:
    data=json.load(f)

by_id={e['id']:e for e in data['elements']}
children={}
for e in data['elements']:
    children.setdefault(e.get('parentId'), []).append(e['id'])

# Inspect (1.144) instances
for eid in ['el-66','el-380','el-725']:
    e=by_id.get(eid)
    if not e: continue
    print('\nCOUNT', eid, e.get('text'), e.get('styles',{}), e.get('classes'))
    p=e.get('parentId')
    if p:
        print(' parent', p, by_id[p].get('tag'), by_id[p].get('styles',{}), by_id[p].get('classes'))

# Inspect Get directions clip
for eid in ['el-80','el-694','el-763']:
    e=by_id.get(eid)
    if not e: continue
    print('\nDIR', eid, e.get('text'), e.get('styles',{}), e.get('classes'))
    p=e.get('parentId')
    if p:
        print(' parent', p, by_id[p].get('tag'), by_id[p].get('styles',{}), by_id[p].get('classes'))

# Services section: climb from title el-123
cur='el-123'
print('\nServices chain')
for i in range(8):
    e=by_id.get(cur)
    if not e: break
    print(cur, e.get('tag'), e.get('styles',{}), e.get('classes'))
    cur=e.get('parentId')
    if cur is None: break

# find containers with class contains 'Services' or 'Service'
for e in data['elements']:
    cls=e.get('classes') or ''
    if 'Service' in cls or 'Services' in cls:
        if e.get('tag') in ('div','section','ul'):
            print('SVC', e['id'], e.get('tag'), cls)
