# Fresha UI Replikasyonu — Adım Adım Kılavuz

Fresha'nın herhangi bir UI bileşenini pixel-perfect React bileşenine dönüştürme süreci.

---

## Adım 1: Kaynak HTML'i Al (Kullanıcı Sağlar)

Kullanıcı Fresha'nın canlı sayfasını tam sayfa HTML olarak kaydeder ve sağlar.

- **Araç:** Chrome → Sağ tık → "Farklı kaydet" → "Tek dosya (.html)"
- **Dosya:** `Fresh/` klasörüne kaydedilir (ör: `Fresh/tekrar düzenleme.html`)
- **Ekran görüntüsü:** Aynı isimle `.png` dosyası da sağlanır (ör: `Fresh/tekrar düzenleme.png`). Bu görüntü, yapıyı anlamak için referans olarak kullanılır — kafadan bir şey uydurmamak için.
- **Kural:** JavaScript render sonrası DOM'u kaydet, sadece kaynak kodu değil

---

## Adım 2: Hedef Elementi Bul (Kullanıcı Sağlar)

Kullanıcı hedef elementin XPath'ini Chrome DevTools ile tespit edip sağlar.

- **Araç:** Chrome DevTools → Elements → Sağ tık → "Copy XPath"
- **Çıktı:** XPath string (ör: `/html/body/div[8]`)

---

## Adım 3: Extraction Script Inject Et

Orijinal HTML dosyasına computed-styles extraction scriptini inject et ve `public/` klasörüne kopyala.

**Neden:** Sibling silme adımı gereksiz — orijinal HTML (~1.8MB) tarayıcıda rahatlıkla açılır. CSS `<style>` tagları `<head>`'de olduğundan, HTML'i sıyırmak stilleri bozabilir.

> [!CAUTION]
> Çıktı dosyasını **mutlaka `public/` klasörüne** koyun ve **`localhost` üzerinden** açın!
> `file://` protokolü localStorage'da sorun çıkarır — browser güvenlik kısıtlamaları nedeniyle localStorage çalışmaz.

**Araç:** `Fresh/strip.py` — HTML'e XPath tabanlı extraction script inject eder
```bash
python Fresh/strip.py "Fresh/kaynak.html" "/html/body/div[1]/..." "public/output.html"
```

- **Çıktı:** `public/output.html` (orijinal + inject script)
- **Açış:** `http://localhost:5173/output.html` (dev server üzerinden)

---

## Adım 4: Computed Styles Çıkar

Tüm elementlerin `getComputedStyle()` değerlerini JSON olarak kaydet.

**Neden:** CSS dosyaları 1.4MB+ ve obfuscated class isimleri var. `getComputedStyle()` browser'ın hesapladığı nihai değerleri verir — CSS değişkenleri, cascade, inheritance hepsi çözülmüş olur.

**Kural:**
1. Hedef elementin altındaki TÜM elementleri `TreeWalker` ile gez
2. Her element için `getComputedStyle()` çağır
3. Sadece varsayılandan farklı olan property'leri kaydet (default filtreleme)
4. `node.getAttribute('class')` kullan — `node.className` SVG'lerde hata verir

**Önemli property listesi:**
```
display, position, top/left/right/bottom,
width, height, min/max-width/height,
margin, padding (her yön ayrı),
background-color, background-image/size/position,
color, font-family/size/weight/style, line-height, letter-spacing,
text-align, text-overflow, text-decoration, white-space,
border (width/style/color her yön ayrı), border-radius,
box-shadow, overflow,
flex (direction/align/justify/grow/shrink/basis/wrap/gap),
grid (template-columns/rows, column/row),
z-index, opacity, visibility, transform, cursor
```

**Çıktı:** `Fresh/computed-styles.json` (~100KB, 229 element)

---

## Adım 5: localStorage ile Aktar

Browser'dan JSON'u güvenilir şekilde indirmek için iki sayfalı yöntem:

1. **Sayfa 1** (sıyrılmış HTML dosyası): Inject edilen script `getComputedStyle()` ile JSON oluşturur ve `localStorage.setItem('computed-styles', json)` ile kaydeder
2. **Sayfa 2** (`public/download-styles.html`): `localStorage.getItem()` ile okur, `data:` URI ile `.json` dosyası olarak indirir
3. **İndirilen dosyayı** `Fresh/` klasörüne taşı (ör: `Fresh/computed-styles.json`)

**Akış:**
```
localhost'tan inject edilmiş HTML'i aç → Script otomatik çalışır → localStorage'a yazar
↓
localhost'tan download-styles.html aç → "İndir" butonuna bas → computed-styles.json indirilir
↓
İndirilen JSON'u Fresh/ klasörüne koy
```

> [!IMPORTANT]
> Her iki sayfa da aynı origin'den (`http://localhost:5173`) açılmalıdır.
> `file://` kullanmayın — localStorage origin bazlı çalışır.

**Neden:** Blob URL download'u bazı tarayıcılarda dosya adını düzgün vermez. `data:` URI + `encodeURIComponent` güvenilirdir.

---

## Adım 6: JSON'u Analiz Et

Her elementin semantik rolünü belirle. Analiz tablosu şu formatta olacak:

| Element ID | Tag | Semantik Rol | Anahtar Stiller |
|---|---|---|---|
| el-0 | `div` | Root container / overlay | `position: fixed, flex, z-index: 2000` |
| el-1 | `div` | Transform wrapper | `transform, transition` |
| el-2 | `div` | Scroll container | `overflow-y: auto, flex-grow: 1` |
| el-3 | `div` | Panel (white bg) | `flex, column, box-shadow` |
| ... | ... | ... | ... |

Her component için bu tablo JSON'dan satır satır doldurulacak. `styles` VE `classes` alanları birlikte okunarak semantik rol belirlenecek (bkz. Altın Kural 2.5).

> [!IMPORTANT]
> Analiz tamamlandığında sonuçları kullanıcıya sun ve **"Devam edeyim mi?"** diye sor.
> Kullanıcı onaylamadan React + CSS yazmaya geçme.

---

## Adım 7: React + CSS Yaz

JSON'daki değerleri kullanarak temiz, anlamlı class isimleriyle CSS yaz. Fresha'nın obfuscated class'larını kısa ve okunabilir isimlere çevir:

| İsimlendirme Kuralı | Örnek |
|---|---|
| Component prefix + rol | `.rf-overlay`, `.qs-panel`, `.fc-grid` |
| Modifier class ile state | `.rf-checkbox.checked`, `.rf-tab.active` |
| Wrapper div'lere sayı ekle | `.rf-wrapper-1`, `.rf-wrapper-2` |

**Kurallar:**
- Pixel değerlerini JSON'dan birebir al (`padding: 6px`, `gap: 4px`, `font-size: 13px`)
- Renkleri `rgb()` formatında kullan (JSON'daki gibi)
- Inline style yerine CSS class kullan
- Her element için `{/* el-XX */}` comment ekle
- `styles` + `classes` birlikte okunarak CSS yazılacak (bkz. Altın Kural 2 + 2.5)

---

## Adım 8: Browser'da Doğrula

Hedef test sayfasında render'ı kontrol et. Genel kontrol listesi:

- [ ] Tüm elementler doğru pozisyonda ve boyutta mı?
- [ ] Renkler JSON ile birebir eşleşiyor mu?
- [ ] Animasyonlar çalışıyor mu? (açılma, kapanma, checkmark)
- [ ] Hover/active durumları doğru mu?
- [ ] Focus ring / box-shadow doğru mu?
- [ ] Modal/drawer tam ekran mı? (viewport-dependent değerler)
- [ ] Font boyutları ve ağırlıkları JSON ile aynı mı?
- [ ] SVG ikonlar orijinal HTML'den çıkarılmış ve doğru render ediliyor mu?

---

## Dosya Yapısı

```
Fresh/
├── 3 gün.html              # Orijinal Fresha HTML (kaynak)
├── build_all.py             # Strip + inject script
├── computed-styles.json     # 229 element computed styles
├── fresha-replication-guide.md  # Bu dosya
│
public/
├── fresha-calendar.html     # Stripped HTML + extraction script
├── download-styles.html     # localStorage → download sayfası
│
src/pages/
├── TestPage.jsx             # React replica component
├── TestPage.css             # Exact computed styles → clean CSS
```

---

## Extraction Teknik Kuralları

1. **Her zaman localhost kullan** — `file://` protokolü localStorage'da sorun çıkarır
2. **getComputedStyle kullan** — CSS dosyaları değil, browser'ın hesapladığı son değerler
3. **className yerine getAttribute('class')** — SVG elementlerde hata önler
4. **localStorage + data URI** — Blob URL download güvenilmez
5. **Default değerleri filtrele** — Boş div'le karşılaştır, sadece farklı olanları kaydet
6. **RGB değerleri birebir kullan** — Hex'e çevirme, orijinal formatı koru

---



## ⚠️ ALTIN KURAL: Yapıyı Satır Satır Analiz Et, Hiçbir Şey Uydurma

> **Bu bölüm tüm diğer kuralların üzerindedir. Süre ne kadar uzarsa uzasın, bu kurallara MUTLAKA uyulacaktır.**

### Temel İlke

`computed-styles.json` dosyasından bir UI replike edilirken, JSON'daki **her bir element satır satır, didik didik analiz edilecektir.** Kendi kafana göre yapı uydurmak, "muhtemelen şöyledir" diye varsayımda bulunmak, wrapper div'leri "gereksiz" diye atlamak **kesinlikle yasaktır.**

Yapı neyse — ne eksik ne fazla — birebir o uygulanacaktır.

### 1. Önce Tam Hiyerarşi Ağacını Çıkar

Kod yazmaya **başlamadan önce**, JSON'daki tüm elementleri okuyarak parent-child ağacını oluştur. Her element için:

- **id** → `el-XX`
- **tag** → `div`, `button`, `span`, `p`, `svg`, `path`...
- **Parent kim?** → Hangi element'in içinde?
- **Children kim?** → Altında hangi elementler var?
- **display** → `flex`, `grid`, `inline-flex`, `block`, `none`...
- **position** → `static`, `relative`, `absolute`, `sticky`, `fixed`
- **Kritik boyutlar** → `width`, `height`, `min-height`, `max-height`

Çıktı şu formatta olacak:

```
el-46 (div) — position: relative, overflow: hidden, z-index: 10
  ├── el-47 (div) — display: grid, overflow-y: auto
  │   └── ... (mevcut içerik)
  └── el-48 (div) — position: absolute, z-index: 11, transform, transition
      └── el-49 (div) — plain wrapper, 304px height
          └── el-50 (div) — display: flex, flex-direction: column, padding-bottom: 16px, gap: 8px
              ├── el-51 (div) — position: sticky, top: 0, 72px, z-index: 10
              │   └── el-52 (div) — display: flex, padding: 0 32px, gap: 24px
              │       ├── el-53 (div) — back button wrapper, 24x24
              │       │   └── el-54 (button) — 48x48, margin: -12px, radius: 999px
              │       ├── el-66 (div) — title wrapper, flex-grow: 1
              │       │   └── el-68 (p) — font: 24px/600
              │       └── el-69 (div) — right actions
              └── el-71 (div) — service list, padding: 0 32px
                  └── el-72 (div) — flex-column, gap: 32px
                      └── el-73 (div) — display: grid, 12-col, gap: 16px
                          ├── el-74 — service card 1 (span 12, 96px)
                          └── el-90 — service card 2 (span 12, 96px)
```

**Bu ağaç sadece JSON'dan okunarak oluşturulur.** Tahmin, varsayım, "mantıken şöyle olmalı" gibi yaklaşımlar YASAKTIR.

### 2. Her Element İçin CSS'i Birebir Çıkar

JSON'daki `styles` objesindeki **her bir property** CSS'e yazılacak. Atlanan property olmayacak.

**YASAK olanlar:**
- ❌ JSON'da olmayan CSS property eklemek
- ❌ JSON'daki bir property'yi "gereksiz" diye atlamak
- ❌ Değerleri yuvarlatmak veya basitleştirmek
- ❌ `display: grid` yazıp `grid-template-columns`/`grid-template-rows` yazmamak
- ❌ Wrapper div'leri "boş div" diye atlamak
- ❌ Birden fazla JSON element'ini tek bir CSS class'a sığdırmak

**ZORUNLU olanlar:**
- ✅ JSON'daki her wrapper div (el-49, el-50 gibi) için ayrı CSS class oluştur
- ✅ `display`, `position`, `width`, `height` gibi değerleri birebir kullan
- ✅ `padding`, `margin`, `gap` değerlerini tam olarak yaz
- ✅ `transition` ve `transform` değerlerini kopyala
- ✅ `overflow-x` ve `overflow-y` ayrı ayrı belirt
- ✅ `z-index` değerlerini JSON ile aynı yap

### 2.5. ⚠️ `classes` Alanını OKU — Animasyon, Hover, Focus Ring

> **`styles` objesi sadece anlık computed değerleri verir. Ama `classes` alanı dinamik davranışları içerir: animasyonlar, hover/active durumları, pseudo-elementler, transform origin'ler.**
> **Her elementin `classes` alanı `styles` kadar önemlidir. İkisi birlikte okunmazsa eksik replikasyon yapılır.**

`getComputedStyle()` şunları **YAKALAYAMAZ:**
- 🔴 `@keyframes` animasyon tanımları (sadece final state kaydedilir)
- 🔴 `:hover`, `:active`, `:focus` gibi state-dependent stiller
- 🔴 `::before`, `::after` pseudo-element stilleri
- 🔴 `transform-origin` (bazı durumlarda)
- 🔴 `animation-delay`, `animation-fill-mode` gibi animation parametreleri
- 🔴 `box-shadow: focusRing` gibi design token'lar

**Her element için `classes` string'ini tara ve şu prefix'lere bak:**

| Prefix | Anlamı | CSS Karşılığı |
|---|---|---|
| `anim_*` | Animasyon adı | `animation-name: *` |
| `anim-dur_*` | Animasyon süresi | `animation-duration: *` (`short.s` = 0.15s) |
| `anim-tmf_*` | Timing function | `animation-timing-function: *` |
| `anim-fm_*` | Fill mode | `animation-fill-mode: *` (`forwards`) |
| `anim-dly_*` | Delay | `animation-delay: *` (`short.s` = 0.15s) |
| `trf_[*]` | Initial transform | `transform: *` (`scaleY(0)`, `scaleX(0)` vb.) |
| `trf-o_*` | Transform origin | `transform-origin: *` (`top`, `left` vb.) |
| `groupHover:*` | Hover durumu | `.parent:hover .child { }` |
| `groupActive:*` | Active/pressed durumu | `.parent:active .child { }` veya checked state |
| `groupSupportHover:*` | Hover destekli cihaz | `@media (hover: hover)` |
| `before:*` | `::before` pseudo-element | `.element::before { * }` |
| `after:*` | `::after` pseudo-element | `.element::after { * }` |
| `before:bx-sh_focusRing` | Focus ring | `box-shadow: 0 0 0 2px <dark-color>` |
| `before:op_transparent` | Ring gizli | `opacity: 0` (unchecked/default state) |
| `before:op_visible` | Ring görünür | `opacity: 1` (checked/active state) |
| `before:p_25` | Ring boşluğu | 2px white gap (`box-shadow` ile dış ring) |
| `bd-w_100` → `groupActive:bd-w_200` | Border genişliği değişir | `1px` → active'de `2px` |

**Örnek — Checkbox animasyonu (el-68 classes'tan okunur):**
```
classes: "d_block w-is_[2px] h-bs_[6.5px] bg-c_[currentColor] bdr_rounded 
          trf-o_top trf_[scaleY(0)] anim_scaleYUp anim-dur_short.s 
          anim-tmf_easeOut anim-fm_forwards"
```
↓ CSS'e dönüşür:
```css
.check-v {
    transform: scaleY(0);           /* trf_[scaleY(0)] */
    transform-origin: top;          /* trf-o_top */
    animation: scaleYUp 0.15s ease-out forwards;  /* anim_* prefix'leri */
}
@keyframes scaleYUp {
    from { transform: scaleY(0); }
    to { transform: scaleY(1); }
}
```

**Örnek — Focus ring (el-66 classes'tan okunur):**
```
classes: "... bg-c_background.accent bd-c_background.accent 
          groupActive:bd-w_200 before:bx-sh_focusRing before:op_visible 
          before:p_25 before:bdr_[inherit]"
```
↓ CSS'e dönüşür:
```css
.checkbox.checked {
    border-width: 2px;  /* groupActive:bd-w_200 */
    box-shadow: 0 0 0 2px white, 0 0 0 4px rgb(13,13,13);  
    /* before:p_25 (2px white gap) + before:bx-sh_focusRing (dark ring) */
}
```

**ZORUNLU SÜREÇ:**
1. Önce `styles` objesini oku → statik CSS yaz
2. Sonra `classes` string'ini oku → prefix tablosuna göre tara
3. Animasyon varsa → `@keyframes` tanımla, initial transform set et
4. Hover/active varsa → `:hover` / `:active` / `.checked` CSS selectors yaz
5. Pseudo-element varsa → `::before` / `::after` CSS yaz
6. Focus ring varsa → `box-shadow` ile double ring yaz

### 3. JSX Yapısını JSON Ağacına 1:1 Eşle

Her JSON element'i JSX'te bir karşılık bulacak. Her JSX element'inin yanına `{/* el-XX */}` comment'i konacak:

```jsx
{/* el-48 */}
<div className="qs-cat-detail">
    {/* el-49 */}
    <div className="qs-cat-detail-row">
        {/* el-50 */}
        <div className="qs-cat-detail-content">
            {/* el-51 */}
            <div className="qs-cat-detail-header">
                {/* el-52 */}
                <div className="qs-cat-detail-header-inner">
                    ...
                </div>
            </div>
        </div>
    </div>
</div>
```

JSON'da kaç tane wrapper div varsa, JSX'te de o kadar olacak. **"Gereksiz wrapper" diye hiçbir div atlanmayacak.**

### 4. Animasyon Kuralları

CSS `transition` ile animasyon yapılacak elementler **her zaman DOM'da render edilecek.**

```jsx
// ✅ DOĞRU — her zaman render, class ile toggle
<Panel isOpen={!!selected} />

// ❌ YANLIŞ — conditional render, animasyon çalışmaz
{selected && <Panel />}
```

**Neden:** React'te `{condition && <Component />}` pattern'i kullanıldığında, bileşen DOM'a ilk eklendiğinde zaten hedef state'te olur. CSS transition sadece **mevcut bir element'in** property'si değiştiğinde çalışır. Mount anında transition tetiklenmez.

### 5. Parent-Child Pozisyonlama

Bir element `position: absolute` ise, JSON'daki parent-child ilişkisine MUTLAKA uy:

1. JSON'da hangi element'in child'ı olduğunu bul
2. O parent'ın `position: relative` olduğunu doğrula
3. Sub-drawer tüm paneli kaplayacaksa → panel container'ın direct child'ı olacak
4. Sadece bir bölümü kaplayacaksa → o bölümün container'ının child'ı olacak

**Kendi kafana göre "buraya koysam da olur" deme — JSON ne diyorsa o.**

### 6. Doğrulama Kontrol Listesi

Kod yazdıktan sonra bu listeyi kontrol et:

- [ ] JSON'daki her element için bir CSS class var mı?
- [ ] Her wrapper div JSX'te mevcut mu?
- [ ] Her CSS property JSON'dan birebir alınmış mı?
- [ ] Parent-child hiyerarşisi JSON ile eşleşiyor mu?
- [ ] Animasyonlu elementler her zaman render ediliyor mu (conditional render yok)?
- [ ] `position: absolute` elementlerin parent'ı `position: relative` mi?
- [ ] `overflow` değerleri doğru mu?
- [ ] `z-index` değerleri JSON ile aynı mı?
- [ ] `display: grid` varsa `grid-template-columns` ve `grid-template-rows` da var mı?
- [ ] `gap`, `padding`, `margin` değerleri JSON ile birebir aynı mı?
- [ ] Her elementin `classes` alanı taranmış mı? (Kural 2.5)
- [ ] Animasyonlar için `@keyframes` + initial transform var mı?
- [ ] Focus ring / double box-shadow uygulanmış mı?
- [ ] SVG'ler orijinal HTML'den çıkarılmış mı? (Kural 7)
- [ ] Viewport-dependent değerler `100%`/`100vh`'ye çevrilmiş mi? (Kural 8)

---

### 7. SVG Çıkarma Kuralı

JSON'daki SVG elementleri (`tag: "svg"`, `tag: "path"`) sadece boyut ve pozisyon bilgisi içerir — **path data (`d="..."` attribute) içermez.**

**ZORUNLU SÜREÇ:**
1. JSON'da `tag: "svg"` veya `tag: "path"` gördüğünde, `strip_drawer.py` scriptine SVG extraction özelliği ekle VEYA orijinal HTML'den ilgili SVG'yi çıkarmak için Python script kullan
2. Orijinal HTML'de hedef XPath altındaki SVG'leri bul
3. `viewBox`, `width`, `height`, `fill` attribute'larını ve `<path d="...">` data'sını çıkar
4. React'te inline SVG component olarak kullan

**Alternatif yöntem — Python extraction:**
```python
from lxml import html
tree = html.parse('Fresh/kaynak.html')
root = tree.xpath('/html/body/div[9]')[0]
svgs = root.xpath('.//svg')
for svg in svgs:
    print(html.tostring(svg, encoding='unicode'))
```

> [!CAUTION]
> **Genel bir "right arrow" SVG kullanmak YASAKTIR.** Her zaman orijinal HTML'den çıkarılan birebir SVG kullanılacak.

---

### 8. Viewport-Dependent vs Sabit Değerler

`getComputedStyle()` tüm değerleri pixel olarak hesaplar. Ama bazı pixel değerleri **viewport boyutuna bağlıdır** ve `100%`/`100vh` olmalıdır.

**Viewport-dependent olduğunu anlama kuralları:**

| Durum | Örnek | Çevir |
|---|---|---|
| `position: fixed` + `inset: 0` olan element | `width: 1440px, height: 945px` | `width: 100%, height: 100vh` |
| Fixed element'in direct child'ı | `width: 1440px, height: 945px` | `width: 100%, height: 100%` |
| Sticky header'ın genişliği | `width: 1440px` | `width: 100%` |
| `max-width` ile sınırlı content | `max-width: 1440px` | Sabit kal: `max-width: 1440px` |
| İçerik alanı genişliği | `width: 600px, max-width: 600px` | Sabit kal: `600px` (tasarım kararı) |
| Button/checkbox boyutu | `width: 24px, height: 24px` | Sabit kal: `24px` |
| Padding/gap/margin | `padding: 32px, gap: 12px` | Sabit kal (her zaman sabit) |

**Basit kural:** Eğer değer **viewport genişliği veya yüksekliğine eşit veya çok yakınsa** (±10px) → `100%`/`100vh` yap. Aksi halde sabit bırak.

---

### 9. Tekrar Eden Pattern'ler

Aynı yapıdaki elementler (örn: 4 item row) **aynı CSS class'ı paylaşabilir.** Bu, Kural 2'deki "birden fazla element'i tek class'a sığdırma yasağı"nın **istisnasıdır.**

**Paylaşım kuralı:**
- ✅ Aynı `tag`, aynı `styles`, aynı `classes`, aynı hiyerarşi derinliği → paylaşabilir
- ❌ Farklı `tag` veya farklı `styles` → ayrı class ZORUNLU
- ❌ Farklı state (checked vs unchecked) → modifier class kullan (`.checked`, `.disabled`)

**Örnek:**
```css
/* el-64, el-77, el-87, el-97 → aynı yapı, aynı class */
.rf-item-row { ... }

/* el-66 (checked) vs el-79 (unchecked) → modifier */
.rf-checkbox { ... }          /* base */
.rf-checkbox.checked { ... }  /* checked state */
.rf-checkbox.disabled { ... } /* disabled state */
```

---

### 10. `classes` Prefix Tablosu — Sürekli Genişlet

Kural 2.5'teki prefix tablosu **canlı bir referanstır.** Her yeni component replikasyonunda yeni prefix'ler keşfedilirse, tabloya eklenmelidir.

**Ekleme süreci:**
1. JSON'daki `classes` alanında tanımadığın bir prefix gördüğünde
2. Fresha'nın Panda CSS naming convention'ına göre anlamını çıkar
3. CSS karşılığını belirle
4. Kural 2.5 tablosuna ekle

**Yaygın Panda CSS naming pattern'leri:**
```
d_flex          → display: flex
pos_relative    → position: relative
w-is_300        → width (inline-size): 300 token (24px)
h-bs_300        → height (block-size): 300 token (24px)
bdr_s           → border-radius: small (4px)
bd-w_100        → border-width: 100 token (1px)
bg-c_*          → background-color: *
c_*             → color: *
p_25            → padding: 25 token (2px)
mbs_*           → margin-block-start: *
gap_150         → gap: 150 token (12px)
jc_center       → justify-content: center
ai_center       → align-items: center
flex-sh_0       → flex-shrink: 0
ov_[hidden]     → overflow: hidden
op_transparent  → opacity: 0
op_visible      → opacity: 1
trs_*           → transition-property: *
trs-dur_*       → transition-duration: *
trs-tmf_*       → transition-timing-function: *
```

---

### Özet

> **Yapı neyse birebir o. Ne eksik, ne fazla.**
> **JSON'u satır satır oku — `styles` VE `classes` alanlarını birlikte analiz et.**
> **Kendi kafandan bir şey uydurup ekleme. Varsayımda bulunma.**
> **SVG'leri orijinal HTML'den çıkar, genel icon kullanma.**
> **Viewport-dependent değerleri tanı ve `100%`/`100vh`'ye çevir.**
> **Süre ne kadar uzarsa uzasın — doğruluk her şeyden önce gelir.**
