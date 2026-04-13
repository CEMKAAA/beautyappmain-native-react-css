import re
path = r'src/pages/MagzaReplica.jsx'
with open(path,'r',encoding='utf-8') as f:
    s=f.read()

# Remove script blocks entirely
pattern = re.compile(r'\n\s*<script[^>]*>.*?</script>\n', re.DOTALL)
new_s = pattern.sub('\n', s)

if new_s != s:
    with open(path,'w',encoding='utf-8') as f:
        f.write(new_s)
    print('removed script blocks')
else:
    print('no script blocks found')
