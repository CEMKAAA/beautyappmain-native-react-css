import json

with open(r'Fresh/Magza.json','r',encoding='utf-8') as f:
    data=json.load(f)

by_id={e['id']:e for e in data['elements']}
children={}
for e in data['elements']:
    children.setdefault(e.get('parentId'), []).append(e['id'])

# find arrows near services rail (buttons siblings in same parent)
rail='el-124'
parent=by_id[rail].get('parentId')
print('rail parent', parent, by_id[parent].get('classes'))
print('siblings', children.get(parent, [])[:20])
for sid in children.get(parent, []):
    e=by_id[sid]
    if e.get('tag')=='button':
        print('arrow btn', sid, e.get('styles',{}), e.get('classes'))
