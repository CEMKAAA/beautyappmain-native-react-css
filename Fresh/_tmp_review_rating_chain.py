import json
from collections import defaultdict, deque

with open(r'Fresh/MarketPlaceJson.json','r',encoding='utf-8') as f:
    data=json.load(f)

by_id={e['id']:e for e in data['elements']}
children=defaultdict(list)
for e in data['elements']:
    children[e.get('parentId')].append(e['id'])

# show structure around rating text element el-1402
start='el-1402'
cur=start
for i in range(6):
    e=by_id.get(cur)
    if not e: break
    print(cur, e.get('tag'), e.get('text'), e.get('classes'), e.get('styles',{}))
    cur=e.get('parentId')
    if cur is None: break

# list children of parent of el-1402
parent=by_id[start].get('parentId')
print('parent', parent, by_id[parent].get('tag'), by_id[parent].get('classes'))
for cid in children.get(parent, []):
    e=by_id[cid]
    print('  child', cid, e.get('tag'), (e.get('text') or '').strip(), e.get('classes'))
