import json

with open(r'Fresh/Magza.json','r',encoding='utf-8') as f:
    data=json.load(f)

by_id={e['id']:e for e in data['elements']}

def chain(start, depth=6):
    cur=start
    for i in range(depth):
        e=by_id.get(cur)
        if not e: break
        print(cur, e.get('tag'), e.get('text'), e.get('classes'), e.get('styles',{}))
        cur=e.get('parentId')
        if cur is None: break

print('chain closed el-70')
chain('el-70', 6)
print('\nchain closed el-71')
chain('el-71', 6)
