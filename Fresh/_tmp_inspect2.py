import json

with open(r'Fresh/MarketPlaceJson.json','r',encoding='utf-8') as f:
    data=json.load(f)

by_id={e['id']:e for e in data['elements']}
children={}
for e in data['elements']:
    children.setdefault(e.get('parentId'), []).append(e['id'])

# appointments booked today number likely sibling of el-185
appt=by_id['el-185']
parent=appt.get('parentId')
print('appt parent', parent, by_id[parent].get('tag'), by_id[parent].get('styles',{}), by_id[parent].get('classes'))
print('siblings of appt')
for cid in children.get(parent, []):
    e=by_id[cid]
    t=(e.get('text') or '').strip()
    if t:
        print(' ', cid, e.get('tag'), t, e.get('styles',{}))

# Search input
search=by_id['el-42']
print('\nsearch el-42', search.get('tag'), search.get('styles',{}), search.get('classes'))
print('search parent', search.get('parentId'), by_id[search.get('parentId')].get('styles',{}), by_id[search.get('parentId')].get('classes'))

# Reviews text overflow: find a review card text elements (maybe long sentences) in reviews section
# pick elements under reviews scroll container el-1398 that have long text
rev_scroll='el-1398'
print('\nreview text samples')
for cid in children.get(rev_scroll, [])[:5]:
    # traverse descendants for text
    stack=[cid]
    while stack:
        nid=stack.pop()
        e=by_id[nid]
        txt=(e.get('text') or '').strip()
        if txt and len(txt)>60:
            print(' ', nid, txt[:80], 'styles', e.get('styles',{}))
            break
        stack.extend(children.get(nid, []))

# Metrics (1 billion+, etc) inspect styles
for mid in ['el-2175','el-2180','el-2184','el-2188']:
    e=by_id[mid]
    print('\nmetric', mid, e.get('text'), e.get('styles',{}), e.get('classes'))
    p=e.get('parentId')
    print(' parent', p, by_id[p].get('styles',{}), by_id[p].get('classes'))
