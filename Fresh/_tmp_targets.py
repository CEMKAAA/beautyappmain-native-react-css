import json

TARGETS = ['Recommended','Trending','New to Fresha','Download the Fresha app']

with open(r'Fresh/MarketPlaceJson.json','r',encoding='utf-8') as f:
    data = json.load(f)

by_id = {e['id']:e for e in data['elements']}

# find matching elements (text exact)
found = []
for e in data['elements']:
    txt = (e.get('text') or '').strip()
    if txt in TARGETS:
        found.append(e)

print('found', len(found))
for e in found:
    print('\n===', e['text'], e['id'], e.get('tag'))
    cur = e['id']
    for depth in range(8):
        node = by_id.get(cur)
        if not node: break
        styles = node.get('styles',{})
        pos = styles.get('position')
        top = styles.get('top')
        bottom = styles.get('bottom')
        height = styles.get('height')
        width = styles.get('width')
        disp = styles.get('display')
        overflow = styles.get('overflow') or ''
        overflow_x = styles.get('overflow-x')
        overflow_y = styles.get('overflow-y')
        print(' ', cur, node.get('tag'), 'pos', pos, 'top', top, 'bottom', bottom, 'h', height, 'w', width, 'display', disp, 'overflow', overflow, overflow_x, overflow_y, 'class', (node.get('classes') or '')[:60])
        cur = node.get('parentId')
        if cur is None:
            break
