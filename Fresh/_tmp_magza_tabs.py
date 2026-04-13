import json
from collections import defaultdict

with open(r'Fresh/Magza.json','r',encoding='utf-8') as f:
    data=json.load(f)

by_id={e['id']:e for e in data['elements']}
children=defaultdict(list)
for e in data['elements']:
    children[e.get('parentId')].append(e['id'])

print('ul el-129 children', children.get('el-129', [])[:20])
for cid in children.get('el-129', [])[:10]:
    e=by_id[cid]
    print(' li', cid, e.get('tag'), e.get('classes'), e.get('styles',{}), (e.get('text') or '').strip())
    # find span in li
    for gc in children.get(cid, []):
        ge=by_id[gc]
        print('   child', gc, ge.get('tag'), (ge.get('text') or '').strip(), ge.get('classes'))
