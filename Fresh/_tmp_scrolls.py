import json

with open(r'Fresh/MarketPlaceJson.json','r',encoding='utf-8') as f:
    data=json.load(f)

by_id={e['id']:e for e in data['elements']}
children={}
for e in data['elements']:
    children.setdefault(e.get('parentId'), []).append(e['id'])

scroll_ids=['el-219','el-602','el-985','el-1398','el-2312']
for sid in scroll_ids:
    print('\nSCROLL', sid, (by_id[sid].get('classes') or ''), by_id[sid].get('styles',{}).get('height'))
    # climb
    cur=sid
    for i in range(6):
        node=by_id.get(cur)
        print('  ancestor', cur, node.get('tag'), node.get('styles',{}).get('position'), node.get('styles',{}).get('height'), (node.get('classes') or '')[:50])
        cur=node.get('parentId')
        if cur is None: break
    # siblings (buttons) of parent
    parent=by_id[sid].get('parentId')
    sibs=[x for x in children.get(parent,[]) if x!=sid]
    print('  siblings', sibs[:6])
