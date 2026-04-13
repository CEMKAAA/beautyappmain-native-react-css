import json
with open(r'Fresh/MarketPlaceJson.json','r',encoding='utf-8') as f:
    data=json.load(f)

by_id={e['id']:e for e in data['elements']}

ids=[e['id'] for e in data['elements'] if (e.get('text') or '').strip()=='Australia']
print('ids', ids)
for eid in ids:
    cur=eid
    for i in range(6):
        e=by_id.get(cur)
        if not e: break
        print(cur, e.get('tag'), e.get('text'), e.get('styles',{}), e.get('classes'))
        cur=e.get('parentId')
        if cur is None: break
