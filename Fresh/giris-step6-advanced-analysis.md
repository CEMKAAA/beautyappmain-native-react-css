# Giris Step 6 Analysis (Advanced JSON)

Kaynak: `Fresh/giris-computed-styles.json`

## Meta

- extractorVersion: `strip-advanced-v1`
- xpath: `/html/body/div[2]/main`
- viewport: `1920x911`
- total elements: `2147`
- interactive rules: `21`
- keyframes: `11`

## Root Tree (L1)

- el-0 (`main`) -> children: `16`
- el-1 (`h1`) | text: `The #1 software for Salons and Spas` | heading: `The #1 software for Salons and Spas`
- el-2 (`h2`) | text: `Simple, flexible and powerful booking software for your business.` | heading: `Simple, flexible and powerful booking software for your business.`
- el-3 (`div`) | text: `-` | heading: `-`
- el-10 (`div`) | text: `-` | heading: `-`
- el-174 (`div`) | text: `-` | heading: `One platform, infinite possibilities`
- el-323 (`div`) | text: `-` | heading: `Get paid`
- el-337 (`div`) | text: `-` | heading: `All-in-one to run your business`
- el-370 (`div`) | text: `-` | heading: `The most popular to grow your business`
- el-403 (`div`) | text: `-` | heading: `Top-Rated Salon Software`
- el-1068 (`div`) | text: `-` | heading: `41%`
- el-1138 (`div`) | text: `-` | heading: `Expert consultation`
- el-1161 (`div`) | text: `-` | heading: `Contact us`
- el-1185 (`div`) | text: `-` | heading: `Can I migrate my data from my previous system to Fresha?`
- el-1264 (`div`) | text: `-` | heading: `A platform suitable for all`
- el-2008 (`div`) | text: `-` | heading: `What are you waiting for?`
- el-2019 (`div`) | text: `-` | heading: `Business app for professionals`

## Semantic Role Table

| Element ID | Tag | Semantik Rol | Anahtar Stiller |
|---|---|---|---|
| el-1 | `h1` | Hero H1 | `width: 1028px, height: 156px` |
| el-2 | `h2` | Hero subtitle | `width: 1028px, height: 60px` |
| el-3 | `div` | Hero CTA grid | `display: grid, height: 48px, grid-template-columns: 944.5px 944.5px, grid-template-rows: 48px` |
| el-10 | `div` | Hero media/container | `position: relative, height: 1139.23px` |
| el-174 | `div` | Section wrapper (One platform...) | `position: relative, height: 2278.69px, overflow-x: hidden, overflow-y: auto` |
| el-323 | `div` | Section wrapper (Everything you need...) | `position: relative, height: 532px, overflow-x: hidden, overflow-y: auto` |
| el-337 | `div` | Section wrapper (All-in-one...) | `position: relative, height: 874.547px, overflow-x: hidden, overflow-y: auto` |
| el-370 | `div` | Section wrapper (Most popular...) | `position: relative, height: 874.547px, overflow-x: hidden, overflow-y: auto` |
| el-403 | `div` | Section wrapper (Top-rated...) | `height: 1002px` |
| el-1068 | `div` | Stats/KPI wrapper (Boss your business) | `height: 882px` |
| el-1138 | `div` | Support features wrapper | `position: relative, height: 612px, overflow-x: hidden, overflow-y: auto` |
| el-1161 | `div` | Support CTA/cards wrapper | `position: relative, height: 606px, overflow-x: hidden, overflow-y: auto` |
| el-1185 | `div` | FAQ wrapper | `position: relative, height: 1084px, overflow-x: hidden, overflow-y: auto` |
| el-1264 | `div` | Large content rail (A platform suitable for all) | `height: 768px` |
| el-2008 | `div` | Bottom CTA hero | `position: relative, height: 410px` |
| el-2019 | `div` | App download section | `position: relative, height: 795px, overflow-x: hidden, overflow-y: auto` |

## Scroll/Overflow Findings

| Node | overflow-y | height | Parent | Not |
|---|---|---|---|---|
| el-0 (`main`) | `auto` | `12122px` | `None` | main/root scroll |
| el-174 (`div`) | `auto` | `2278.69px` | `el-0` | nested scroll |
| el-323 (`div`) | `auto` | `532px` | `el-0` | nested scroll |
| el-337 (`div`) | `auto` | `874.547px` | `el-0` | nested scroll |
| el-370 (`div`) | `auto` | `874.547px` | `el-0` | nested scroll |
| el-404 (`div`) | `auto` | `356px` | `el-403` | nested scroll |
| el-1069 (`div`) | `auto` | `300px` | `el-1068` | nested scroll |
| el-1078 (`div`) | `auto` | `416px` | `el-1077` | nested scroll |
| el-1085 (`div`) | `auto` | `416px` | `el-1084` | nested scroll |
| el-1092 (`div`) | `auto` | `416px` | `el-1091` | nested scroll |
| el-1099 (`div`) | `auto` | `416px` | `el-1098` | nested scroll |
| el-1106 (`div`) | `auto` | `416px` | `el-1105` | nested scroll |
| el-1113 (`div`) | `auto` | `416px` | `el-1112` | nested scroll |
| el-1120 (`div`) | `auto` | `416px` | `el-1119` | nested scroll |
| el-1138 (`div`) | `auto` | `612px` | `el-0` | nested scroll |
| el-1161 (`div`) | `auto` | `606px` | `el-0` | nested scroll |
| el-1185 (`div`) | `auto` | `1084px` | `el-0` | nested scroll |
| el-2010 (`div`) | `auto` | `410px` | `el-2008` | nested scroll |
| el-2019 (`div`) | `auto` | `795px` | `el-0` | nested scroll |

## Critical Notes for Step 7

- ?oklu dikey scroll kaynaklar? var (`el-0` + nested `overflow-y:auto` wrapperlar).
- `position:absolute` overlay node say?s? y?ksek; parent-child birebir korunmal?.
- `svg/path` verisi mevcut (`path d` dolu), ikonlar? generic ile de?i?tirmemek gerekiyor.
- Advanced extraction i?inde `pseudoBefore/pseudoAfter` her node i?in dolu geliyor; Step 7'de `content:none/normal` olan pseudo bloklar? filtrelemek gerekiyor.
- Viewport extraction `1920x911`; full replica i?in viewport-dependent px de?erleri `100%/100vh` normalize edilmeli.

## Heading Inventory (for section mapping)

- el-1 (`h1`): The #1 software for Salons and Spas
- el-2 (`h2`): Simple, flexible and powerful booking software for your business.
- el-177 (`h2`): One platform, infinite possibilities
- el-325 (`h2`): Everything you need to run your businesses
- el-329 (`h3`): Manage
- el-332 (`h3`): Grow
- el-335 (`h3`): Get paid
- el-341 (`h2`): All-in-one to run your business
- el-384 (`h2`): The most popular to grow your business
- el-407 (`h2`): Top-rated by the industry
- el-455 (`h3`): Fresha is so easy to manage my team
- el-485 (`h3`): My client love it
- el-515 (`h3`): Powerful Scheduling
- el-545 (`h3`): Smart Salon Software
- el-575 (`h3`): Booking Made Easy
- el-605 (`h3`): Simplify Salon Scheduling
- el-635 (`h3`): Easy Payments, Bookings
- el-663 (`h3`): Effortless Salon Management
- el-693 (`h3`): Best salon software
- el-723 (`h3`): Boost sales
- el-751 (`h3`): Smart Analytics
- el-779 (`h3`): Ultimate Salon Solution
- el-809 (`h3`): Amazing software
- el-839 (`h3`): Recommend to all
- el-867 (`h3`): Online Salon Software
- el-897 (`h3`): Simplify Salon Management
- el-927 (`h3`): Beauty Industry’s Best
- el-957 (`h3`): Advanced Salon Software
- el-987 (`h3`): Simplify Salon Scheduling
- el-1017 (`h3`): Smart Salon Software
- el-1045 (`h3`): Top-Rated Salon Software
- el-1072 (`h2`): Boss your business
- el-1080 (`h3`): 26%
- el-1087 (`h3`): 89%
- el-1094 (`h3`): 20%
- el-1101 (`h3`): 290%
- el-1108 (`h3`): 12%
- el-1115 (`h3`): 392%
- el-1122 (`h3`): 41%
- el-1140 (`h2`): Committed to your success
- el-1144 (`h3`): Customer success manager
- el-1147 (`h3`): Access our network
- el-1150 (`h3`): 24/7 priority support
- el-1153 (`h3`): Migration support
- el-1156 (`h3`): Tailored solutions
- el-1159 (`h3`): Expert consultation
- el-1164 (`h2`): You are never alone, award winning customer support 24/7
- el-1169 (`h3`): Help Center
- el-1178 (`h3`): Contact us
- el-1187 (`h2`): Frequently asked questions
- el-1191 (`h3`): What makes Fresha the leading platform for businesses in beauty and wellness?
- el-1202 (`h3`): How does Fresha help my business grow?
- el-1211 (`h3`): Are there any hidden costs?
- el-1220 (`h3`): Is there a minimum commitment or contract?
- el-1229 (`h3`): Does Fresha support businesses of all sizes?
- el-1238 (`h3`): What types of businesses can use Fresha?
- el-1247 (`h3`): How can Fresha help reduce no-shows?
- el-1256 (`h3`): Can I migrate my data from my previous system to Fresha?
- el-1267 (`h2`): A platform suitable for all
- el-2012 (`h2`): What are you waiting for?
- el-2021 (`h2`): Download our mobile apps
- el-2028 (`h3`): Booking app for customers
- el-2084 (`h3`): Business app for professionals