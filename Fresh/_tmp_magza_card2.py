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

with open(r'Fresh/_magza_card.txt','w',encoding='utf-8') as f:
    for row in items:
        f.write(str(row)+'\n')

print('wrote', len(items))
