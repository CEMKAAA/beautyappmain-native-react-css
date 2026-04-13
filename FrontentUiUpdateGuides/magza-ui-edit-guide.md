# Magza UI Edit Guide

Bu dosya `magza-replica` sayfası için kısa hafıza notudur.
Amaç: aynı sorunları tekrar tekrar yaşamamak ve çalışan düzeni bozacak hamlelerden kaçınmak.

## Sayfa

- Route: `http://localhost:5173/magza-replica`
- JSX: `src/pages/MagzaReplica.jsx`
- CSS: `src/pages/MagzaReplica.css`
- Kaynak extraction: `Fresh/Magza.json`
- Kaynak HTML: `Fresh/MagzaPage.html`

## Genel Kural

- Bu sayfa extraction tabanlı olduğu için aynı `data-el-id` için CSS dosyasında birden fazla override birikmiş durumda.
- Yeni fix yazarken teorik olarak doğru görünen parent padding veya flow düzeltmeleri pratikte her zaman etkili olmuyor.
- Bu sayfada en güvenilir yaklaşım:
  - gerçek `data-el-id` elementini koru
  - gerekiyorsa doğrudan hedef section/container’a override ver
  - dolaylı parent-chain tahminleriyle fazla zaman kaybetme

## Kritik Bölgeler

### Services alanı

- Services wrapper: `el-121`, `el-122`
- Services list wrapper: `el-181`, `el-182`
- Kartlar:
  - `el-185`
  - `el-200`
  - `el-215`
  - `el-230`
- Gerçek `See all` bloğu:
  - wrapper: `el-245`
  - link: `el-246`
  - inner: `el-247`
  - label: `el-249`

### Team alanı

- Team section wrapper: `el-250`
- Team inner section: `el-251`
- Team title row: `el-253`

## Önemli Dersler

### 1. Gerçek `See all` kullanılmalı

- Custom bridge button eklemek kısa vadede kolay görünse de layout’ta kafa karıştırıyor.
- Tercih edilen çözüm: JSON’dan gelen gerçek services `See all` bloğunu kullanmak.
- Yani `el-245 -> el-249` zincirini koru.

### 2. `Team` ile çakışma olduğunda en stabil çözüm

- `See all` veya services parent’ına boşluk vermek bazen beklenen etkiyi oluşturmuyor.
- Bu sayfada fiilen çalışan çözüm:
  - `el-250` yani Team wrapper’ını doğrudan aşağı itmek
  - örnek: `margin-top`

Sebep:
- extraction sonrası layout akışı bazı yerlerde sabit yükseklikler yüzünden doğal akış gibi davranmıyor.
- bu yüzden doğrudan Team section’a müdahale daha güvenilir.

### 3. Çakışan override’lar çok fazla

- `MagzaReplica.css` içinde özellikle şu id’ler için birden fazla final kural olabilir:
  - `el-245`
  - `el-246`
  - `el-250`
  - `el-251`
- Yeni değişiklikten önce aynı id’yi arat:

```powershell
rg -n "el-245|el-246|el-250|el-251" src/pages/MagzaReplica.css
```

- Eğer aynı id için 3-4 farklı blok varsa önce bunu fark et, sonra en sona tek net override yaz.

## Şu Anki Güvenli Yaklaşım

### Book butonları

- Kartların sağındaki `Book` alanları extraction sonrası bozulabiliyor.
- JSX içinde JS ile plain `Book` görünümüne zorlanıyor.
- Bu kısmı değiştirirken:
  - `actionButton`
  - `actionInner`
  - `actionCell`
  zincirini birlikte düşün.

### Team üst boşluğu

- Eğer `See all` ile `Team` iç içe girerse ilk bakılacak yer:
  - `el-250`
  - `el-251`

- Güvenli fix sırası:
  1. `el-250` için `margin-top`
  2. gerekiyorsa `el-251` için `padding-top`
  3. sadece mecbursa `el-245` spacing

## Kaçınılması Gerekenler

- Sadece `padding-bottom` artırarak sorunun çözüleceğini varsayma.
- Custom temporary button ekleyip sonra gerçek extraction bloğunu gizleme.
- Aynı id için hem `display:none` hem `display:flex` gibi zıt kuralları dosyada bırakma.
- `z-index` ile layout problem çözmeye çalışma. Bu sayfada çoğu zaman sadece görsel çarpışmayı maskeliyor.

## Hızlı Tanı Checklist

- `See all` yanlış yerde mi?
  - önce `el-245` JSX içinde var mı kontrol et
  - sonra CSS’te gizleniyor mu kontrol et

- `Team` yukarı mı çıkmış?
  - `el-250` margin-top kontrol et
  - `el-251` padding-top kontrol et

- Hiçbir CSS değişikliği etki etmiyor gibi mi?
  - aynı id için daha altta daha güçlü override var mı bak
  - route gerçekten `MagzaReplica.jsx` render ediyor mu doğrula
  - hard refresh yap

## Son Not

Bu sayfa “semantic layout” gibi değil, “extracted snapshot” gibi düşünülmeli.
O yüzden burada en temiz teorik çözüm değil, en kontrollü ve tekrarlanabilir çözüm tercih edilmeli.
