import json
with open(r'Fresh/MarketPlaceJson.json','r',encoding='utf-8') as f:
    data=json.load(f)

children={}
for e in data['elements']:
    children.setdefault(e.get('parentId'), []).append(e['id'])

kids = children.get('el-47', [])
print('el-47 kids count', len(kids))
print(kids[:20])
# print texts of kids
by_id={e['id']:e for e in data['elements']}
for kid in kids:
    txt=(by_id[kid].get('text') or '').strip()
    if txt:
        print(kid, txt)
