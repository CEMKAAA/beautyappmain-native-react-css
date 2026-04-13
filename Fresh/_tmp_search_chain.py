import json
with open(r'Fresh/MarketPlaceJson.json','r',encoding='utf-8') as f:
    data=json.load(f)

by_id={e['id']:e for e in data['elements']}
cur='el-42'
for i in range(6):
    e=by_id[cur]
    print(cur, e.get('tag'), e.get('styles',{}), e.get('classes'))
    cur=e.get('parentId')
    if cur is None: break
