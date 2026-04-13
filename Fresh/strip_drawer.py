"""
Inject computed-style extraction script into original HTML.
No stripping — keeps original HTML intact for correct CSS rendering.
Usage: python strip_drawer.py "input.html" "/html/body/div[1]/..." "output.html"
"""
import sys, shutil

input_file = sys.argv[1]
xpath = sys.argv[2]
output_file = sys.argv[3]

with open(input_file, 'r', encoding='utf-8') as f:
    content = f.read()

EXTRACT_SCRIPT = """
<script>
(function() {
    const ROOT_XPATH = '%s';
    const result = document.evaluate(ROOT_XPATH, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    const root = result.singleNodeValue;
    if (!root) { console.error('Root not found for XPath: ' + ROOT_XPATH); return; }

    const defaultEl = document.createElement('div');
    document.body.appendChild(defaultEl);
    const defaultStyles = getComputedStyle(defaultEl);
    const defaultMap = {};
    const PROPS = [
        'display','position','top','left','right','bottom',
        'width','height','min-width','max-width','min-height','max-height',
        'margin-top','margin-right','margin-bottom','margin-left',
        'padding-top','padding-right','padding-bottom','padding-left',
        'background-color','background-image','background-size','background-position',
        'color','font-family','font-size','font-weight','font-style','line-height','letter-spacing',
        'text-align','text-overflow','text-decoration','white-space','text-transform',
        'border-top-width','border-right-width','border-bottom-width','border-left-width',
        'border-top-style','border-right-style','border-bottom-style','border-left-style',
        'border-top-color','border-right-color','border-bottom-color','border-left-color',
        'border-top-left-radius','border-top-right-radius','border-bottom-right-radius','border-bottom-left-radius',
        'box-shadow','overflow-x','overflow-y',
        'flex-direction','align-items','justify-content','flex-grow','flex-shrink','flex-basis','flex-wrap','gap','row-gap','column-gap',
        'grid-template-columns','grid-template-rows','grid-column','grid-row',
        'z-index','opacity','visibility','transform','cursor',
        'transition','animation',
        'outline','box-sizing','pointer-events','user-select',
        'vertical-align','word-break','overflow-wrap'
    ];
    for (const p of PROPS) defaultMap[p] = defaultStyles.getPropertyValue(p);
    document.body.removeChild(defaultEl);

    const elements = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    let node = root;
    let id = 0;
    do {
        const cs = getComputedStyle(node);
        const styles = {};
        for (const p of PROPS) {
            const v = cs.getPropertyValue(p);
            if (v !== defaultMap[p]) styles[p] = v;
        }
        elements.push({
            id: 'el-' + id++,
            tag: node.tagName.toLowerCase(),
            classes: (node.getAttribute('class') || '').trim(),
            text: node.childNodes.length === 1 && node.childNodes[0].nodeType === 3 ? node.textContent.trim().substring(0, 100) : '',
            styles: styles
        });
    } while ((node = walker.nextNode()));

    localStorage.setItem('computed-styles', JSON.stringify(elements, null, 2));
    console.log('Saved ' + elements.length + ' elements to localStorage["computed-styles"]');

    var badge = document.createElement('div');
    badge.textContent = elements.length + ' elements saved to localStorage!';
    badge.style.cssText = 'position:fixed;top:10px;left:10px;background:#22c55e;color:#fff;padding:8px 16px;border-radius:8px;z-index:99999;font:600 14px sans-serif;';
    document.body.appendChild(badge);
    setTimeout(function(){ badge.remove(); }, 5000);
})();
</script>
""" % xpath

# Inject script before </body>
if '</body>' in content:
    content = content.replace('</body>', EXTRACT_SCRIPT + '\n</body>')
elif '</html>' in content:
    content = content.replace('</html>', EXTRACT_SCRIPT + '\n</html>')
else:
    content += EXTRACT_SCRIPT

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(content)

size_kb = len(content) // 1024
print(f"Done! {output_file} ({size_kb}KB) — extraction script injected for XPath: {xpath}")
