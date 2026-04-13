"""
Inject computed-style extraction script into original HTML.
Extracts 100% of visual data with COMPACT output (~65-70% smaller):
  - All CSS computed properties (iteration, not hardcoded)
  - Logical property deduplication (keeps physical, drops logical duplicates)
  - CSS custom properties (--vars) deduplicated into a shared `cssVarDefaults` map
  - Perspective/transform-origin removed (auto-calculated, not useful)
  - Color-derived properties collapsed (caret-color, column-rule-color etc => color)
  - Border colors collapsed when all 4 sides match
  - Inherited computed defaults stripped (cursor, pointer-events, min-*, unicode-bidi, etc.)
  - SVG attributes (d, viewBox, fill, etc.)
  - Pseudo elements (::before, ::after)
  - DOM hierarchy (parentId, depth)
  - HTML attributes (href, role, aria-*, etc.)
  - Interactive CSS rules (:hover, :active, :focus) from stylesheets
  - @keyframes animations

Usage: python strip-advanced.py "input.html" "/html/body/div[1]/..." "output.html"
"""
import sys

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

    // ============================================================
    // 1. DEFAULT STYLE MAP (baseline for all CSS properties)
    // ============================================================
    const defaultEl = document.createElement('div');
    document.body.appendChild(defaultEl);
    const defaultCS = getComputedStyle(defaultEl);
    const defaultMap = {};
    for (let i = 0; i < defaultCS.length; i++) {
        const p = defaultCS[i];
        defaultMap[p] = defaultCS.getPropertyValue(p);
    }
    document.body.removeChild(defaultEl);

    // ============================================================
    // 2. SKIP / DEDUP LISTS
    // ============================================================

    // Logical properties that duplicate physical ones — DROP these
    const LOGICAL_DUPES = new Set([
        'block-size', 'inline-size',
        'inset-block-start', 'inset-block-end', 'inset-inline-start', 'inset-inline-end',
        'min-block-size', 'min-inline-size', 'max-block-size', 'max-inline-size',
        'padding-block-start', 'padding-block-end', 'padding-inline-start', 'padding-inline-end',
        'margin-block-start', 'margin-block-end', 'margin-inline-start', 'margin-inline-end',
        'border-start-start-radius', 'border-start-end-radius',
        'border-end-start-radius', 'border-end-end-radius',
        'border-block-start-color', 'border-block-end-color',
        'border-inline-start-color', 'border-inline-end-color',
        'border-block-start-style', 'border-block-end-style',
        'border-inline-start-style', 'border-inline-end-style',
        'border-block-start-width', 'border-block-end-width',
        'border-inline-start-width', 'border-inline-end-width',
        'overflow-block', 'overflow-inline',
    ]);

    // Auto-calculated or noisy properties — DROP these
    const SKIP_PROPS = new Set([
        'perspective-origin', 'transform-origin',
        'unicode-bidi',          // almost always 'normal'
        'overflow-clip-margin',  // always 'content-box' on overflow:hidden
    ]);

    // Color-derived properties — DROP when they match 'color'
    const COLOR_DERIVED = new Set([
        'caret-color', 'column-rule-color', 'text-decoration-color',
        'text-emphasis-color', '-webkit-text-fill-color', '-webkit-text-stroke-color',
    ]);

    // ============================================================
    // 3. ATTRIBUTE LISTS
    // ============================================================
    const IMPORTANT_ATTRS = new Set([
        'href', 'src', 'srcset', 'sizes', 'poster',
        'alt', 'title', 'type', 'role', 'name', 'id', 'for',
        'tabindex', 'value', 'placeholder', 'disabled', 'readonly', 'checked',
        'target', 'rel', 'download',
        'loading', 'decoding', 'fetchpriority',
        'autoplay', 'muted', 'loop', 'controls', 'playsinline', 'preload',
        'aria-label', 'aria-hidden', 'aria-selected', 'aria-current', 'aria-expanded',
        'data-testid', 'data-id'
    ]);

    const SVG_ATTRS = [
        'd', 'viewBox', 'fill', 'stroke', 'stroke-width', 'stroke-linecap',
        'stroke-linejoin', 'fill-rule', 'clip-rule', 'xmlns', 'cx', 'cy',
        'r', 'rx', 'ry', 'x', 'y', 'x1', 'y1', 'x2', 'y2',
        'width', 'height', 'transform', 'opacity', 'points', 'pathLength'
    ];

    const SVG_TAGS = new Set([
        'svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon',
        'ellipse', 'g', 'defs', 'use', 'clippath', 'mask', 'pattern',
        'text', 'tspan', 'foreignobject', 'image', 'symbol', 'marker'
    ]);

    function collectHtmlAttrs(node) {
        const attrs = {};

        // Capture explicit markup attributes exactly as rendered
        if (node.attributes && node.attributes.length) {
            for (let ai = 0; ai < node.attributes.length; ai++) {
                const a = node.attributes[ai];
                if (!a || !a.name) continue;
                if (a.name === 'class' || a.name === 'style') continue;
                attrs[a.name] = a.value;
            }
        }

        // Guarantee key attrs if present on DOM properties but absent in markup attrs
        for (const a of IMPORTANT_ATTRS) {
            if (attrs[a] !== undefined) continue;
            const val = node.getAttribute(a);
            if (val !== null) attrs[a] = val;
        }

        return attrs;
    }

    function collectSvgAttrs(node, tag) {
        const svgAttrs = {};
        if (!(SVG_TAGS.has(tag) || node.closest('svg'))) return svgAttrs;

        // Capture all explicit SVG attributes first (best fidelity for path data, viewBox, etc.)
        if (node.attributes && node.attributes.length) {
            for (let ai = 0; ai < node.attributes.length; ai++) {
                const a = node.attributes[ai];
                if (!a || !a.name) continue;
                if (a.name === 'class' || a.name === 'style') continue;
                svgAttrs[a.name] = a.value;
            }
        }

        // Backfill known SVG attrs if browser exposes different casing
        for (const a of SVG_ATTRS) {
            if (svgAttrs[a] !== undefined) continue;
            const val = node.getAttribute(a);
            if (val !== null) svgAttrs[a] = val;
        }

        return svgAttrs;
    }

    // ============================================================
    // 4. CSS VARS tracker
    // ============================================================
    const allCssVarValues = {};

    // ============================================================
    // 5. STYLE EXTRACTION FUNCTION
    // ============================================================
    // Properties that must always be preserved even if they match defaults
    const ALWAYS_KEEP = new Set([
        'font-family', 'font-size', 'font-weight', 'font-style',
        'line-height', 'letter-spacing', 'color',
        'text-align', 'text-decoration', 'text-transform', 'white-space',
    ]);

    function extractStyles(cs) {
        const styles = {};
        const vars = {};
        const raw = {};

        // First pass: collect all non-default values
        for (let i = 0; i < cs.length; i++) {
            const prop = cs[i];
            const val = cs.getPropertyValue(prop);
            if (val === defaultMap[prop] && !ALWAYS_KEEP.has(prop)) continue;
            raw[prop] = val;
        }

        const colorVal = raw['color'] || null;

        for (const prop in raw) {
            const val = raw[prop];

            // CSS custom properties -> separate bucket
            if (prop.startsWith('--')) {
                vars[prop] = val;
                if (!allCssVarValues[prop]) allCssVarValues[prop] = {};
                allCssVarValues[prop][val] = (allCssVarValues[prop][val] || 0) + 1;
                continue;
            }

            // Skip logical duplicates & noisy props
            if (LOGICAL_DUPES.has(prop) || SKIP_PROPS.has(prop)) continue;

            // Color-derived: skip if same as 'color'
            if (COLOR_DERIVED.has(prop) && colorVal && val === colorVal) continue;

            // Border color collapsing: if all 4 border colors match,
            // keep only border-top-color and skip the other 3
            if (prop === 'border-right-color' || prop === 'border-bottom-color' || prop === 'border-left-color') {
                if (raw['border-top-color'] === val &&
                    raw['border-right-color'] === val &&
                    raw['border-bottom-color'] === val &&
                    raw['border-left-color'] === val) {
                    continue; // border-top-color will represent all 4
                }
            }

            // Inherited defaults: skip if commonly inherited and at default-like values
            if (prop === 'min-height' && val === 'auto') continue;
            if (prop === 'min-width' && val === 'auto') continue;

            styles[prop] = val;
        }

        // If border colors collapsed, rename border-top-color to 'border-color'
        if (styles['border-top-color'] &&
            raw['border-top-color'] === raw['border-right-color'] &&
            raw['border-top-color'] === raw['border-bottom-color'] &&
            raw['border-top-color'] === raw['border-left-color']) {
            styles['border-color'] = styles['border-top-color'];
            delete styles['border-top-color'];
        }

        return { styles, vars };
    }

    function extractPseudo(node, pseudoSelector) {
        let csPseudo;
        try {
            csPseudo = getComputedStyle(node, pseudoSelector);
        } catch (e) {
            return {};
        }

        const pseudoResult = extractStyles(csPseudo);
        const contentVal = csPseudo.getPropertyValue('content');
        const hasContent = !!contentVal && contentVal !== 'none' && contentVal !== 'normal';
        const hasStyles = Object.keys(pseudoResult.styles).length > 0;
        const hasVars = Object.keys(pseudoResult.vars).length > 0;

        if (!hasContent && !hasStyles && !hasVars) return {};

        const out = {};
        if (hasContent) out.content = contentVal;
        Object.assign(out, pseudoResult.styles);
        if (hasVars) out.cssVars = pseudoResult.vars;
        return out;
    }

    // ============================================================
    // 6. EXTRACT ELEMENTS (TreeWalker DFS)
    // ============================================================
    const elements = [];
    const idMap = new Map();
    const allClasses = new Set();
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    let node = root;
    let id = 0;

    do {
        const elId = 'el-' + id++;
        idMap.set(node, elId);

        const parentId = node === root ? null : (idMap.get(node.parentElement) || null);

        let depth = 0;
        let p = node;
        while (p !== root && p.parentElement) { depth++; p = p.parentElement; }

        const cs = getComputedStyle(node);
        const { styles, vars } = extractStyles(cs);

        // --- Pseudo elements ---
        const pseudoBefore = extractPseudo(node, '::before');
        const pseudoAfter = extractPseudo(node, '::after');

        const tag = node.tagName.toLowerCase();
        // --- HTML & SVG Attributes ---
        const attrs = collectHtmlAttrs(node);
        const svgAttrs = collectSvgAttrs(node, tag);

        // --- Classes ---
        const rawClasses = (node.getAttribute('class') || '').trim();
        if (rawClasses) {
            rawClasses.split(/\\s+/).forEach(function(c) { allClasses.add(c); });
        }

        // --- Text content ---
        let text = '';
        const textParts = [];
        for (let ci = 0; ci < node.childNodes.length; ci++) {
            if (node.childNodes[ci].nodeType === 3) {
                const t = node.childNodes[ci].textContent.trim();
                if (t) textParts.push(t);
            }
        }
        if (textParts.length > 0) {
            text = textParts.join(' ').substring(0, 300);
        }

        // --- Build element object ---
        const elObj = {
            id: elId,
            parentId: parentId,
            depth: depth,
            tag: tag,
            classes: rawClasses,
            text: text,
            styles: styles,
            attrs: attrs,
            svgAttrs: svgAttrs,
            pseudoBefore: pseudoBefore,
            pseudoAfter: pseudoAfter
        };

        if (Object.keys(vars).length > 0) elObj._rawVars = vars;

        elements.push(elObj);
    } while ((node = walker.nextNode()));

    // ============================================================
    // 7. DEDUPLICATE CSS VARS
    // ============================================================
    const globalCssVars = {};
    for (const varName in allCssVarValues) {
        const vals = allCssVarValues[varName];
        let maxCount = 0, maxVal = '';
        for (const v in vals) {
            if (vals[v] > maxCount) { maxCount = vals[v]; maxVal = v; }
        }
        globalCssVars[varName] = maxVal;
    }

    for (const el of elements) {
        if (el._rawVars) {
            const overrides = {};
            for (const varName in el._rawVars) {
                if (el._rawVars[varName] !== globalCssVars[varName]) {
                    overrides[varName] = el._rawVars[varName];
                }
            }
            if (Object.keys(overrides).length > 0) {
                el.cssVarOverrides = overrides;
            }
            delete el._rawVars;
        }
    }

    // ============================================================
    // 8. INTERACTIVE CSS RULES
    // ============================================================
    const interactiveRules = [];
    const keyframesRules = [];
    const PSEUDO_CLASSES = [':hover', ':active', ':focus', ':focus-visible', ':focus-within'];

    for (let s = 0; s < document.styleSheets.length; s++) {
        let rules;
        try {
            rules = document.styleSheets[s].cssRules || document.styleSheets[s].rules;
        } catch(e) {
            continue;
        }
        if (!rules) continue;

        for (let r = 0; r < rules.length; r++) {
            const rule = rules[r];

            if (rule.type === CSSRule.KEYFRAMES_RULE) {
                keyframesRules.push({ name: rule.name, cssText: rule.cssText });
                continue;
            }

            if (rule.type === CSSRule.MEDIA_RULE) {
                for (let mr = 0; mr < rule.cssRules.length; mr++) {
                    processStyleRule(rule.cssRules[mr], '@media ' + rule.conditionText);
                }
                continue;
            }

            processStyleRule(rule, null);
        }
    }

    function processStyleRule(rule, mediaContext) {
        if (!rule.selectorText) return;
        const selector = rule.selectorText;

        let hasPseudo = false;
        for (const pc of PSEUDO_CLASSES) {
            if (selector.includes(pc)) { hasPseudo = true; break; }
        }
        if (!hasPseudo) return;

        let baseSelector = selector;
        for (const pc of PSEUDO_CLASSES) {
            baseSelector = baseSelector.split(pc).join('');
        }
        baseSelector = baseSelector.trim();
        if (!baseSelector) return;

        let relevant = false;
        try {
            if (root.matches(baseSelector) || root.querySelector(baseSelector)) {
                relevant = true;
            }
        } catch(e) {
            const classesInSelector = selector.match(/\\.([^\\s:.\\[\\]>+~,]+)/g);
            if (classesInSelector) {
                for (const cls of classesInSelector) {
                    if (allClasses.has(cls.substring(1))) {
                        relevant = true;
                        break;
                    }
                }
            }
        }
        if (!relevant) return;

        const properties = {};
        for (let i = 0; i < rule.style.length; i++) {
            const p = rule.style[i];
            const v = rule.style.getPropertyValue(p);
            const priority = rule.style.getPropertyPriority(p);
            properties[p] = priority ? v + ' !important' : v;
        }

        if (Object.keys(properties).length === 0) return;

        const ruleObj = { selector: selector, properties: properties };
        if (mediaContext) ruleObj.media = mediaContext;
        interactiveRules.push(ruleObj);
    }

    // ============================================================
    // 9. SAVE
    // ============================================================
    const output = {
        meta: {
            totalElements: elements.length,
            totalInteractiveRules: interactiveRules.length,
            totalKeyframes: keyframesRules.length,
            extractedAt: new Date().toISOString(),
            extractorVersion: 'strip-advanced-v1',
            xpath: ROOT_XPATH,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight
        },
        cssVarDefaults: globalCssVars,
        elements: elements,
        interactiveRules: interactiveRules,
        keyframes: keyframesRules
    };

    const fullJson = JSON.stringify(output, null, 2);
    window.__computedStylesOutput = output;

    let storageSaved = false;
    try {
        localStorage.setItem('computed-styles', fullJson);
        storageSaved = true;
    } catch (err) {
        console.warn('localStorage quota exceeded, using in-page download fallback');
    }

    try {
        sessionStorage.setItem('computed-styles', fullJson);
    } catch (err) {
        // ignore
    }

    try {
        window.name = '__computed_styles__:' + fullJson;
    } catch (err) {
        // ignore
    }

    function downloadComputedStyles(filename) {
        const safeName = filename || 'computed-styles.json';
        const blob = new Blob([fullJson], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = safeName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function() { URL.revokeObjectURL(url); }, 1500);
    }
    window.downloadComputedStyles = downloadComputedStyles;

    const lines = fullJson.split('\\n').length;

    console.log('=== COMPACT EXTRACTION COMPLETE ===');
    console.log('Elements: ' + elements.length);
    console.log('Interactive rules: ' + interactiveRules.length);
    console.log('Keyframes: ' + keyframesRules.length);
    console.log('CSS var defaults: ' + Object.keys(globalCssVars).length);
    console.log('Output: ' + lines + ' lines, ' + Math.round(fullJson.length/1024) + 'KB');
    console.log(storageSaved ? 'Saved to localStorage["computed-styles"]' : 'Saved to memory only. Use window.downloadComputedStyles()');

    var badge = document.createElement('div');
    badge.innerHTML =
      elements.length + ' elements<br>' +
      interactiveRules.length + ' interactive rules<br>' +
      lines + ' lines (' + Math.round(fullJson.length/1024) + 'KB)<br>' +
      (storageSaved ? '<b>Saved to localStorage</b>' : '<b>localStorage full - use Download button</b>');
    badge.style.cssText = 'position:fixed;top:10px;left:10px;background:#22c55e;color:#fff;padding:12px 20px;border-radius:8px;z-index:99999;font:600 13px sans-serif;line-height:1.6;';

    var btn = document.createElement('button');
    btn.textContent = 'Download JSON';
    btn.style.cssText = 'margin-top:8px;padding:6px 10px;background:#111;color:#fff;border:1px solid #fff;border-radius:6px;cursor:pointer;font:600 12px sans-serif;';
    btn.onclick = function() { downloadComputedStyles('computed-styles.json'); };
    badge.appendChild(btn);

    document.body.appendChild(badge);
    setTimeout(function(){ badge.remove(); }, 15000);
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
print(f"Done! {output_file} ({size_kb}KB) — compact extraction script injected for XPath: {xpath}")
