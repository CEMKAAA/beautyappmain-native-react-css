import json
from collections import defaultdict, deque

with open(r'Fresh/Magza.json','r',encoding='utf-8') as f:
    data=json.load(f)

by_id={e['id']:e for e in data['elements']}
children=defaultdict(list)
for e in data['elements']:
    children[e.get('parentId')].append(e['id'])

card='el-185'
q=deque([card])
items=[]
while q:
    nid=q.popleft()
    e=by_id[nid]
    txt=(e.get('text') or '').strip()
    if txt:
        items.append((nid, e.get('tag'), txt, e.get('classes') or '', e.get('styles',{})))
    q.extend(children.get(nid, []))

for row in items:
    print(row[0], row[1], row[2], row[3])
