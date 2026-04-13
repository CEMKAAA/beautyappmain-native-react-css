import json

with open(r'Fresh/MarketPlaceJson.json','r',encoding='utf-8') as f:
    data=json.load(f)

inputs=[e for e in data['elements'] if e.get('tag') in ('input','select','textarea')]
print('inputs', len(inputs))
for e in inputs[:10]:
    print(e['id'], e.get('tag'), e.get('styles',{}), e.get('classes'))

# find inputs near hero search form (ids near el-17..)
by_id={e['id']:e for e in data['elements']}
for eid in ['el-17','el-18','el-19','el-20','el-21','el-22','el-23','el-24','el-25']:
    if eid in by_id:
        e=by_id[eid]
        print('node', eid, e.get('tag'), e.get('styles',{}), e.get('classes'), e.get('attrs'))
