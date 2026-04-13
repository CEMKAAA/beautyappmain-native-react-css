import re
path = r'src/pages/MarketPlaceReplica.jsx'
with open(path,'r',encoding='utf-8') as f:
    s = f.read()
pattern = re.compile(r'className="(mpr-el-\d+)[^"]*"')
s2 = pattern.sub(lambda m: f'className="{m.group(1)}"', s)
with open(path,'w',encoding='utf-8') as f:
    f.write(s2)
print('updated className stripping')
