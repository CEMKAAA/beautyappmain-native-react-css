# Giris Language Modal — Adım 6 Analiz

Kaynak: `Fresh/GirisLanguage.json`  
XPath: `/html/body/div[5]`  
Toplam element: `110`

| Element ID | Tag | Semantik Rol | Anahtar Stiller |
|---|---|---|---|
| el-0 | `div` | Dil modal root (dialog panel) | `position: fixed`, `display: flex`, `flex-direction: column`, `z-index: 102` |
| el-1 | `div` | Sticky header bar | `position: sticky`, `top: 0`, `justify-content: space-between` |
| el-4 | `button` | Kapat butonu | `cursor: pointer`, `width/height: 24px` |
| el-10 | `div` | Modal içerik sarmalayıcı | `display: flex`, `flex-direction: column`, `gap: 16px` |
| el-14 | `div` | Önerilen diller grid alanı | `display: grid`, `grid-template-columns: repeat(2, minmax(0,1fr))`, `gap: 12px` |
| el-15 | `button` | Dil kartı (önerilen) | `h: 72px`, `border`, `rounded-lg`, `bg-white` |
| el-18 | `button` | Dil kartı (English, selected snapshot) | `h: 72px`, `border`, `shadow-[0_0_0_2px_#6950f3]` |
| el-21 | `div` | Tüm diller listesi konteyneri | `display: grid`, `grid-template-columns: repeat(2,minmax(0,1fr))`, `gap: 12px` |
| el-22..el-107 | `button` | Diğer dil kartları | `72px card pattern`, `hover:bg-muted`, `border/focus variants` |

Notlar:
- `styles` + `classes` birlikte kullanıldı (hover/focus/ring davranışları sınıflardan geliyor).
- Snapshot’ta seçili kart ring’i statik geldiği için runtime seçime bağlanacak şekilde normalize edildi.
