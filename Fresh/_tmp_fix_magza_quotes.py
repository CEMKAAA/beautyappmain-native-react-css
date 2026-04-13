import re
path = r'src/pages/MagzaReplica.jsx'
with open(path,'r',encoding='utf-8') as f:
    s=f.read()

# fix className tokens like after:content_"•"
fixed = re.sub(r'content_"([^"]*)"', r'content_\1', s)

if fixed != s:
    with open(path,'w',encoding='utf-8') as f:
        f.write(fixed)
    print('fixed content_"..." tokens')
else:
    print('no changes')
