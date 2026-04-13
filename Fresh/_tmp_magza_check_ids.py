import re
path = r'src/pages/MagzaReplica.jsx'
with open(path,'r',encoding='utf-8') as f:
    s=f.read()

# find sample data-el-id occurrences
matches = re.findall(r'data-el-id="(el-\d+)"', s)
print('count', len(matches))
print('sample', matches[:10])
print('has el-130', 'el-130' in matches)
print('has el-65', 'el-65' in matches)
print('has el-78', 'el-78' in matches)
print('has el-157', 'el-157' in matches)
print('has el-169', 'el-169' in matches)
