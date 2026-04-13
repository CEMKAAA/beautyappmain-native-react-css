import json
from collections import defaultdict, deque

with open(r'Fresh/MarketPlaceJson.json','r',encoding='utf-8') as f:
    data=json.load(f)

by_id={e['id']:e for e in data['elements']}
children=defaultdict(list)
for e in data['elements']:
    children[e.get('parentId')].append(e['id'])

card_id='el-1399'

# BFS gather text nodes
q=deque([card_id])
items=[]
while q:
    nid=q.popleft()
    e=by_id[nid]
    txt=(e.get('text') or '').strip()
    if txt:
        items.append((nid, e.get('tag'), txt, e.get('classes') or '', e.get('styles',{})))
    q.extend(children.get(nid, []))

for nid,tag,txt,cls,styles in items:
    print(nid, tag, txt[:120], cls)
