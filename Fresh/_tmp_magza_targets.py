import json

target_texts = [
    '1.144','Get directions','Other businesses in Rural North Aegean',
    'Featured','Services','Service','Hair Treatment','HAIR TREATMENT',
    'Closed opens on Tuesday'
]

with open(r'Fresh/Magza.json','r',encoding='utf-8') as f:
    data=json.load(f)

by_id={e['id']:e for e in data['elements']}
children={}
for e in data['elements']:
    children.setdefault(e.get('parentId'), []).append(e['id'])

for e in data['elements']:
    txt=(e.get('text') or '').strip()
    if txt in target_texts or any(t in txt for t in ['1.144','Get directions','Other businesses in Rural North Aegean','Closed opens on Tuesday']):
        print('TEXT', e['id'], e.get('tag'), txt, e.get('classes'))

# find greek address line
for e in data['elements']:
    txt=(e.get('text') or '').strip()
    if 'Χανδακος' in txt or 'Χίος' in txt:
        print('ADDR', e['id'], e.get('tag'), txt, e.get('classes'))

# find any nodes with "book" text
for e in data['elements']:
    txt=(e.get('text') or '').strip().lower()
    if txt == 'book' or txt.startswith('book '):
        print('BOOK', e['id'], e.get('tag'), e.get('text'), e.get('classes'))

# find service tabs list (likely buttons with text)
for e in data['elements']:
    txt=(e.get('text') or '').strip()
    if txt in ['Featured','Μαλλιά','HAIR TREATMENT']:
        print('SERVICE TAB', e['id'], e.get('tag'), txt, e.get('classes'))

