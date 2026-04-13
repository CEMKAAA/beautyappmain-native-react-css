import json

with open(r'Fresh/MarketPlaceJson.json','r',encoding='utf-8') as f:
    data=json.load(f)

elements=data['elements']
by_id={e['id']:e for e in elements}
children={}
for e in elements:
    children.setdefault(e.get('parentId'), []).append(e['id'])

def find_text(t):
    return [e for e in elements if (e.get('text') or '').strip()==t]

for t in ['Book local selfcare services','Reviews','Search','appointments booked today','The top-rated destination for selfcare']:
    hits=find_text(t)
    print(t, [h['id'] for h in hits])

# find nodes with text containing 'appointments booked today'
for e in elements:
    txt=(e.get('text') or '').strip()
    if 'appointments booked today' in txt:
        print('appt line', e['id'], txt)

# find nodes with 1 billion+ or numbers? print elements with text containing 'billion' or '130,000'
for e in elements:
    txt=(e.get('text') or '').strip()
    if 'billion' in txt or '130,000' in txt or '120+ countries' in txt or '450,000' in txt:
        print('metric', e['id'], txt)

# locate reviews carousel: find Reviews header id then find descendant with overflow-x scroll
rev=find_text('Reviews')
if rev:
    rid=rev[0]['id']
    # climb to section
    cur=rid
    for i in range(6):
        node=by_id.get(cur)
        print('rev ancestor', cur, node.get('tag'), node.get('styles',{}))
        cur=node.get('parentId')
        if cur is None: break

# find any elements with overflow-x scroll
scrolls=[e for e in elements if (e.get('styles') or {}).get('overflow-x')=='scroll']
print('scroll containers', len(scrolls))
print([s['id'] for s in scrolls[:10]])

# get parents for scroll containers near Reviews by searching within same section
