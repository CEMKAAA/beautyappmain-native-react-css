import json
import io

with open(r'Fresh/Magza.json','r',encoding='utf-8') as f:
    data=json.load(f)

# find greek address text ids
out=[]
for e in data['elements']:
    txt=(e.get('text') or '').strip()
    if 'Χανδακος' in txt or 'Χίος' in txt:
        out.append((e['id'], e.get('tag'), txt, e.get('classes') or '', e.get('styles',{})))

with open(r'Fresh/_magza_addr.txt','w',encoding='utf-8') as f:
    for row in out:
        f.write(str(row)+'\n')
print('wrote Fresh/_magza_addr.txt', len(out))
