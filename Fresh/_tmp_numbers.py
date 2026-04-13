import json,re
with open(r'Fresh/MarketPlaceJson.json','r',encoding='utf-8') as f:
    data=json.load(f)

# find texts with digits and commas near el-185 parent area
texts=[]
for e in data['elements']:
    txt=(e.get('text') or '').strip()
    if re.search(r'\d', txt):
        if len(txt)<=20:
            texts.append((e['id'], txt))

# print a few around the number (maybe 306,906)
for id,txt in texts:
    if '306' in txt or 'appointments' in txt:
        print(id, txt)

# list candidates that are just digits/commas
cand=[(i,t) for i,t in texts if re.fullmatch(r'[\d,\.\+\s]+', t)]
print('digit-only count', len(cand))
print(cand[:30])
