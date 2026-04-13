import json
from collections import defaultdict, deque

with open(r'Fresh/MarketPlaceJson.json','r',encoding='utf-8') as f:
    data=json.load(f)

by_id={e['id']:e for e in data['elements']}
children=defaultdict(list)
for e in data['elements']:
    children[e.get('parentId')].append(e['id'])

card_id='el-1399'

q=deque([card_id])
found=[]
while q:
    nid=q.popleft()
    e=by_id[nid]
    tag=e.get('tag')
    cls=e.get('classes') or ''
    if tag in ('svg','path') or 'star' in cls.lower() or 'rating' in cls.lower():
        found.append((nid, tag, cls, e.get('text'), e.get('styles',{})))
    q.extend(children.get(nid, []))

for item in found:
    print(item[0], item[1], item[2], item[3], item[4])
