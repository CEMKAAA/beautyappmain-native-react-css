import json
from collections import defaultdict

with open(r'Fresh/Magza.json','r',encoding='utf-8') as f:
    data=json.load(f)

by_id={e['id']:e for e in data['elements']}
children=defaultdict(list)
for e in data['elements']:
    children[e.get('parentId')].append(e['id'])

for bid in ['el-157','el-169']:
    print('\nbutton', bid, by_id[bid].get('styles',{}), by_id[bid].get('classes'))
    print('children', children.get(bid, []))
    for cid in children.get(bid, []):
        e=by_id[cid]
        print('  ', cid, e.get('tag'), e.get('classes'), e.get('styles',{}))
