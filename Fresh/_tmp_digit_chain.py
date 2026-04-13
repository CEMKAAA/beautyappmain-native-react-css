import json
with open(r'Fresh/MarketPlaceJson.json','r',encoding='utf-8') as f:
    data=json.load(f)

by_id={e['id']:e for e in data['elements']}

def chain(start, depth=6):
    cur=start
    for i in range(depth):
        e=by_id.get(cur)
        if not e: break
        print(cur, e.get('tag'), e.get('text'), e.get('styles',{}), e.get('classes'))
        cur=e.get('parentId')
        if cur is None: break

print('chain for el-48')
chain('el-48', depth=8)
