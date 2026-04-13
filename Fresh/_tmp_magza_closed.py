import json
import io

with open(r'Fresh/Magza.json','r',encoding='utf-8') as f:
    data=json.load(f)

out=[]
for e in data['elements']:
    txt=(e.get('text') or '').strip()
    if 'opens on' in txt.lower():
        out.append((e['id'], e.get('tag'), txt, e.get('classes') or '', e.get('styles',{})))

with open(r'Fresh/_magza_closed.txt','w',encoding='utf-8') as f:
    for row in out:
        f.write(str(row)+'\n')
print('wrote', len(out))
