import { useEffect, useMemo } from 'react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import source from '../native/data/girisComputedStylesData';
import headerSource from '../native/data/girisHeaderData';
import menuSource from '../native/data/girisNavMenuData';
import languageSource from '../native/data/girisLanguageData';
import './GirisNative.css';

const TAG_ALIAS = {
  clippath: 'clipPath',
  foreignobject: 'foreignObject',
};

const VOID_TAGS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
  'path',
]);

const PSEUDO_MEANINGFUL_PROPS = [
  'display',
  'position',
  'top',
  'left',
  'right',
  'bottom',
  'width',
  'height',
  'opacity',
  'transform',
  'transition',
  'z-index',
  'background',
  'background-color',
  'box-shadow',
  'border',
  'border-color',
  'border-width',
  'border-style',
  'animation',
  'animation-name',
];

const CAROUSEL_BINDINGS = [
  {
    name: 'top-rated-by-industry',
    trackId: 'el-410',
    prevButtonId: 'el-1058',
    nextButtonId: 'el-1063',
  },
  {
    name: 'boss-your-business',
    trackId: 'el-1075',
    prevButtonId: 'el-1128',
    nextButtonId: 'el-1133',
  },
];

const TRANSLATABLE_ATTRS = new Set(['aria-label', 'title', 'placeholder', 'alt']);
const AUTH_REPLICA_ROUTE = '/auth-replica-advanced';
const AUTH_CTA_IDS = new Set(['el-4', 'el-179', 'el-2015', 'hdr-el-24']);
const HEADER_MENU_BUTTON_ID = 'hdr-el-26';
const DOWNLOAD_APP_SECTION_ID = 'el-2021';
const MENU_AUTH_LINK_ID = 'mnu-el-5';
const MENU_HOME_LINK_ID = 'mnu-el-6';
const MENU_DOWNLOAD_LINK_ID = 'mnu-el-8';
const MENU_LANGUAGE_BUTTON_ID = 'mnu-el-14';
const MENU_LANGUAGE_LABEL_ID = 'mnu-el-19';
const LANGUAGE_MODAL_CLOSE_BUTTON_ID = 'lng-el-4';

const LANGUAGE_LABEL_TO_CODE = {
  English: 'en',
  'Bahasa Indonesia': 'id',
  'Bahasa Melayu': 'ms',
  'čeština': 'cs',
  'dansk': 'da',
  'Deutsch': 'de',
  'español': 'es',
  'français': 'fr',
  'hrvatski': 'hr',
  'italiano': 'it',
  'lietuvių': 'lt',
  'magyar': 'hu',
  'Nederlands': 'nl',
  'norsk bokmål': 'nb',
  'polski': 'pl',
  'Português': 'pt',
  'română': 'ro',
  'slovenščina': 'sl',
  'suomi': 'fi',
  'svenska': 'sv',
  'Tiếng Việt': 'vi',
  'Ελληνικά': 'el',
  'български': 'bg',
  'русский': 'ru',
  'українська': 'uk',
  'العربية': 'ar',
  'ไทย': 'th',
  '中文': 'zh',
  '日本語': 'ja',
};

const TURKISH_TEXT_MAP = {
  'The #1 software for Salons and Spas': 'Salon ve Spalar için 1 Numaralı Yazılım',
  'Simple, flexible and powerful booking software for your business.':
    'İşletmeniz için basit, esnek ve güçlü rezervasyon yazılımı.',
  'Get started now': 'Hemen başlayın',
  'Watch an overview': 'Genel bakışı izleyin',
  'Partner businesses': 'İş Ortağı İşletme',
  Professionals: 'Profesyonel',
  'Appointments booked': 'Alınan Randevu',
  Countries: 'Ülke',
  'One platform, infinite possibilities': 'Tek platform, sonsuz olasılık',
  Salon: 'Salon',
  Barber: 'Berber',
  Nails: 'Tırnak',
  'Spa & sauna': 'Spa ve Sauna',
  Medspa: 'Medikal Spa',
  Massage: 'Masaj',
  'Fitness & recovery': 'Fitness ve Toparlanma',
  'Physical therapy': 'Fizik Tedavi',
  'Health practice': 'Sağlık Kliniği',
  'Tattoo & piercing': 'Dövme ve Piercing',
  'Pet grooming': 'Evcil Hayvan Bakımı',
  'Tanning studio': 'Solaryum Stüdyosu',
  'Everything you need to run your businesses': 'İşletmenizi yönetmek için ihtiyacınız olan her şey',
  Manage: 'Yönetin',
  Grow: 'Büyütün',
  'Get paid': 'Ödeme Alın',
  'All-in-one to run your business': 'İşletmenizi yönetmek için hepsi bir arada',
  software: 'yazılım',
  marketplace: 'pazaryeri',
  'Top-rated by the industry': 'Sektörün En Yüksek Puanladığı',
  'Founder of HUCKLE': 'HUCKLE Kurucusu',
  'Play video': 'Videoyu oynat',
  'Fresha is so easy to manage my team': 'Ekibimi Fresha ile yönetmek çok kolay',
  'See more': 'Daha fazlasını gör',
  'My client love it': 'Müşterilerim bayılıyor',
  'Powerful Scheduling': 'Güçlü Planlama',
  'Smart Salon Software': 'Akıllı Salon Yazılımı',
  'Booking Made Easy': 'Kolay Rezervasyon',
  'Simplify Salon Scheduling': 'Salon Planlamasını Basitleştirin',
  'Easy Payments, Bookings': 'Kolay Ödeme ve Rezervasyon',
  'Effortless Salon Management': 'Zahmetsiz Salon Yönetimi',
  'Best salon software': 'En iyi salon yazılımı',
  'Boost sales': 'Satışları artırın',
  'Smart Analytics': 'Akıllı Analitik',
  'Ultimate Salon Solution': 'Nihai Salon Çözümü',
  'Amazing software': 'Harika yazılım',
  'Recommend to all': 'Herkese tavsiye ederim',
  'Online Salon Software': 'Online Salon Yazılımı',
  'Simplify Salon Management': 'Salon Yönetimini Basitleştirin',
  "Beauty Industry’s Best": 'Güzellik Sektörünün En İyisi',
  'Advanced Salon Software': 'Gelişmiş Salon Yazılımı',
  'Top-Rated Salon Software': 'En Yüksek Puanlı Salon Yazılımı',
  Previous: 'Önceki',
  Next: 'Sonraki',
  'Boss your business': 'İşletmenin Kontrolünü Eline Al',
  'More clients': 'Daha Fazla Müşteri',
  'Fewer no-shows': 'Daha Az Gelmeme',
  'More sales': 'Daha Fazla Satış',
  'More tips': 'Daha Fazla Bahşiş',
  'Higher retention': 'Daha Yüksek Sadakat',
  'Return on investment': 'Yatırım Getirisi',
  'Booked outside business hours': 'Mesai Dışı Alınan Randevu',
  'Committed to your success': 'Başarınıza Bağlıyız',
  'Customer success manager': 'Müşteri Başarı Yöneticisi',
  'Access our network': 'Ağımıza Erişin',
  '24/7 priority support': '7/24 Öncelikli Destek',
  'Migration support': 'Veri Taşıma Desteği',
  'Tailored solutions': 'Size Özel Çözümler',
  'Expert consultation': 'Uzman Danışmanlığı',
  'Help Center': 'Yardım Merkezi',
  'Go to help center': 'Yardım Merkezine Git',
  'Contact us': 'Bize Ulaşın',
  'Frequently asked questions': 'Sıkça Sorulan Sorular',
  'A platform suitable for all': 'Herkes için uygun bir platform',
  'Hair Salon': 'Kuaför Salonu',
  'Nail Salon': 'Tırnak Salonu',
  Barbers: 'Berberler',
  'Waxing Salon': 'Ağda Salonu',
  'Eyebrow Bar': 'Kaş Stüdyosu',
  'Massage Salon': 'Masaj Salonu',
  Spa: 'Spa',
  Fitness: 'Fitness',
  'Personal Trainer': 'Kişisel Antrenör',
  'Therapy Center': 'Terapi Merkezi',
  'Tattooing & Piercing': 'Dövme ve Piercing',
  'Tanning Studios': 'Solaryum Stüdyoları',
  'What are you waiting for?': 'Neyi bekliyorsunuz?',
  'Change language': 'Dil değiştir',
  'Suggested languages': 'Önerilen diller',
  'All languages': 'Tüm diller',
  Close: 'Kapat',
  'Download our mobile apps': 'Mobil uygulamalarımızı indirin',
  'Booking app for customers': 'Müşteriler için rezervasyon uygulaması',
  'Business app for professionals': 'Profesyoneller için işletme uygulaması',
  'Hair touchup': 'Saç rötuşu',
  "Women's haircut": 'Kadın saç kesimi',
  Independent: 'Bağımsız',
  'Salon owner': 'Salon sahibi',
  'Business owner': 'İşletme sahibi',
  'Salon Owner': 'Salon Sahibi',
  'Salon owner, NYC': 'Salon sahibi, NYC',
  'Hair stylist and owner': 'Kuaför ve işletme sahibi',
  Psychotherapist: 'Psikoterapist',
  'Owner/Manager': 'Sahip/Yönetici',
  'Beauty Makeup Artist': 'Güzellik Makyaj Sanatçısı',
  'Salon General Manager': 'Salon Genel Müdürü',
  'No root element found.': 'Kök öğe bulunamadı.',
};

const TURKISH_PREFIX_MAP = [
  [
    'Everything you need to grow and thrive.',
    'Büyümek ve gelişmek için ihtiyacınız olan her şey burada. Fresha; satışları artırmak, takvimi yönetmek ve müşteri sadakati oluşturmak için güçlü araçlar sunar.',
  ],
  [
    'Fresha offers innovative features',
    'Fresha, ekip üyeleriniz ve müşterileriniz için kullanım kolaylığı, verimlilik ve daha iyi bir deneyim sunan yenilikçi özellikler sağlar.',
  ],
  [
    'Manage bookings, sales, clients, locations, team members.',
    'Randevuları, satışları, müşterileri, şubeleri ve ekip üyelerini tek yerden yönetin. Gelişmiş raporlama ve analizlerle işletmenizi detaylı izleyin.',
  ],
  [
    'Win new clients on the world’s largest beauty and wellness marketplace.',
    'Dünyanın en büyük güzellik ve wellness pazaryerinde yeni müşteriler kazanın. Pazarlama araçlarıyla onları tekrar tekrar geri getirin.',
  ],
  [
    'Get paid fast with seamless payment processing.',
    'Sorunsuz ödeme altyapısıyla hızlı tahsilat alın. Ön ödeme ile gelmeme oranını azaltın ve kasayı kolaylaştırın.',
  ],
  [
    'Most loved and the top-rated booking software for salons, spas, and other beauty and wellness businesses',
    'Salonlar, spalar ve güzellik/wellness işletmeleri tarafından en çok sevilen ve en yüksek puan alan rezervasyon yazılımı.',
  ],
  [
    'Powerful calendar with unlimited bookings, clients, locations, and much more',
    'Sınırsız randevu, müşteri, şube ve daha fazlasını destekleyen güçlü takvim altyapısı.',
  ],
  [
    'Advanced insights providing a 360 degree view of each client',
    'Her müşteri için rezervasyon davranışı, tercihleri, ödeme yöntemi, pazarlama kanalı ve yaşam boyu değeri içeren 360 derece görünüm sunan gelişmiş içgörüler.',
  ],
  [
    'Crafted to deliver a smooth experience that enhances your business and elevates your brand',
    'İşletmenizi güçlendiren ve markanızı yükselten, akıcı bir deneyim için tasarlanmıştır.',
  ],
  [
    'The most popular to grow your business',
    'İşletmenizi büyütmenin en popüler yolu.',
  ],
  [
    'Promote your business and reach new clients on the world',
    'İşletmenizi tanıtın ve dünyanın en büyük güzellik/wellness pazaryerinde yeni müşterilere ulaşın.',
  ],
  [
    'Increase your online visibility by listing your business on Fresha marketplace',
    'İşletmenizi Fresha pazaryerinde listeleyerek online görünürlüğünüzü artırın.',
  ],
  [
    'Reach millions of clients looking to book their next appointment today',
    'Bugün bir sonraki randevusunu arayan milyonlarca müşteriye ulaşın.',
  ],
  [
    'Free up time and get your clients self-booking online 24/7',
    'Zaman kazanın; müşterilerinizin 7/24 online olarak kendi randevusunu almasını sağlayın.',
  ],
  [
    "Being the world's most-loved platform doesn't happen by accident.",
    'Dünyanın en sevilen platformu olmak tesadüf değil. En iyi rezervasyon deneyimini ve üstün müşteri desteğini sunma odağımız sektör tarafından sürekli ödüllendiriliyor.',
  ],
  [
    'I work with booth renters at my top-rated salon in Manhattan, New York City.',
    'New York Manhattan’daki yüksek puanlı salonumda kabin kiralayan bir ekiple çalışıyorum. Fresha sayesinde müşterilerim profesyonel bir rezervasyon deneyimi yaşıyor.',
  ],
  [
    'Fresha is the top-rated salon software with all the advanced features',
    'Fresha, salon işletmesi için gereken gelişmiş özelliklerin tamamını sunan en yüksek puanlı yazılım.',
  ],
  [
    'This appointment scheduling software is very user friendly!',
    'Bu randevu planlama yazılımı gerçekten kullanıcı dostu. Fiyat-performans ve özellik setiyle bizi fazlasıyla memnun etti.',
  ],
  [
    'Fresha is the most advanced salon software in beauty and wellness.',
    'Fresha, güzellik ve wellness dünyasındaki en gelişmiş salon yazılımlarından biri. Planlama, POS, pazarlama ve raporlama tarafında çok güçlü.',
  ],
  [
    'I am a freelance makeup artist who has been searching tirelessly',
    'Serbest çalışan bir makyaj sanatçısı olarak aradığım tüm özellikleri Fresha’da buldum: kolay rezervasyon, müşteri takibi ve kampanya yönetimi.',
  ],
  [
    'I love that Fresha is simple and easy to use salon software.',
    'Fresha’nın en sevdiğim yanı sadeliği ve kullanım kolaylığı. Karmaşık sistemlerden geçiş yaptıktan sonra büyük rahatlık sağladı.',
  ],
  [
    'Client payments and booking appointments is now a breeze',
    'Müşteri ödemeleri ve randevu alma artık çok kolay. Özellikle başlangıç aşamasındaki işletmeler için esnek ve güçlü bir model sunuyor.',
  ],
  [
    'Fresha makes running my salon business so much easier.',
    'Fresha salonumu yönetmeyi ciddi şekilde kolaylaştırdı. Takvim, hatırlatmalar, ödeme ve stok tarafı tek yerde çok düzenli çalışıyor.',
  ],
  [
    'Fresha is the top salon software in London or the United Kingdom.',
    'Fresha, Londra ve Birleşik Krallık için en güçlü salon yazılımlarından biri. Basit arayüz, güçlü POS ve rekabetçi ödeme oranları sunuyor.',
  ],
  [
    'The smart marketing system has shown us an increase of sales',
    'Akıllı pazarlama sistemi satışlarımızı ve müşteri sadakatini artırdı. Analitik tarafı da işletmeyi daha iyi yönetmemizi sağladı.',
  ],
  [
    "The analytics and client payment features on Fresha are ahead of the game.",
    'Fresha’daki analitik ve müşteri ödeme özellikleri gerçekten sektörün önünde. POS deneyimi ve ödeme oranları da çok güçlü.',
  ],
  [
    "It's the best Salon Booking system with client management & reporting functionality",
    'Müşteri yönetimi ve raporlama yetenekleriyle en iyi salon rezervasyon sistemlerinden biri. Ekip kullanımı ve erişim kolaylığı çok başarılı.',
  ],
  [
    'Fresha has literally changed my life!',
    'Fresha gerçekten hayatımı değiştirdi. Daha çok zaman kazandım, gereksiz sabit maliyetlerden kurtuldum ve pazaryeriyle yeni müşteri akışı yakaladım.',
  ],
  [
    'Amazing scheduling system for salons and spas.',
    'Salon ve spa işletmeleri için harika bir planlama sistemi. Verimli, hızlı ve yeni başlayanlar için bile çok kolay.',
  ],
  [
    "I'm able to check my salon's appointment schedule anywhere because it's all online!",
    'Her şey online olduğu için salonun randevu planını her yerden görebiliyorum. Destek ekibi de son derece yardımcı.',
  ],
  [
    'The easiest salon software I have ever used!',
    'Kullandığım en kolay salon yazılımı. İşletme artık çok daha akıcı ilerliyor ve destek ekibi mesajlara çok hızlı dönüyor.',
  ],
  [
    'Fresha is the best software for salons, spas and massage therapists!',
    'Salonlar, spalar ve masaj terapistleri için en iyi yazılımlardan biri. Kurulumu kolay, kullanımı pratik ve ödeme süreci entegre.',
  ],
  [
    'Fresha is the best salon software for the beauty industry.',
    'Güzellik sektörü için en iyi salon yazılımlarından biri. Kurulumu ve kullanımı kolay, planlama/POS/ödeme tarafında çok güçlü.',
  ],
  [
    'Fresha has been fantastic for my salon business.',
    'Fresha salon işletmem için mükemmel oldu. Hem benim hem ekibimin adapte olması çok kısa sürdü.',
  ],
  [
    'The Fresha system is so very clever & easy to use!',
    'Fresha sistemi gerçekten akıllı ve çok kolay kullanılıyor. İşletme operasyonları, ekip verimliliği ve finans tarafında ciddi fayda sağlıyor.',
  ],
  [
    "I absolutely love Fresha. i've looked at many other booking systems for salons",
    'Fresha’yı gerçekten çok seviyorum. Birçok sistemi denedim ama geçiş yaptıktan sonra bir daha geri dönmedim.',
  ],
  [
    'At Fresha, we want to help you grow your business, attract new clients and boost sales.',
    'Fresha’da hedefimiz; işletmenizi büyütmek, yeni müşteriler çekmek ve satışları artırmak. İşletmelerin Fresha ile elde ettiği sonuçlara göz atın.',
  ],
  [
    "Win new clients and keep them coming back on the world's largest beauty and wellness marketplace.",
    'Dünyanın en büyük güzellik ve wellness pazaryerinde yeni müşteriler kazanın ve onları düzenli müşteriye dönüştürün.',
  ],
  [
    'Reduce no-shows and cancellations by taking a deposit or a full payment upfront.',
    'Ön ödeme veya tam ödeme alarak gelmeme ve iptal oranlarını azaltın.',
  ],
  [
    'Generate more sales by upselling services when clients book online.',
    'Müşteriler online rezervasyon yaparken ek hizmet önererek satışları artırın.',
  ],
  [
    'Collect more tips when clients book online via Fresha marketplace',
    'Müşteriler Fresha pazaryeri, web siteniz, Google veya sosyal medya üzerinden rezervasyon yaptığında daha fazla bahşiş toplayın.',
  ],
  [
    'Partners using Fresha experience a higher retention of clients.',
    'Fresha kullanan partnerler daha yüksek müşteri sadakati elde ediyor.',
  ],
  [
    'Most partners grow with Fresha.',
    'Partnerlerin büyük bölümü Fresha ile büyüyor.',
  ],
  [
    'Our marketplace help you capture clients looking to book outside business hours.',
    'Pazaryerimiz, mesai saatleri dışında randevu arayan müşterileri yakalamanıza yardımcı olur.',
  ],
  [
    'Every business has its own needs, and we have got you covered with a range of professional services',
    'Her işletmenin ihtiyacı farklıdır; profesyonel hizmet seçeneklerimizle tüm ihtiyaçlarınızı karşılıyoruz.',
  ],
  [
    'Get dedicated help to maximize your potential on Fresha',
    'Fresha’daki potansiyelinizi en üst düzeye çıkarmak için size özel destek alın.',
  ],
  [
    'Use an Enterprise-certified account manager to bring your business to life',
    'İşletmenizi büyütmek için kurumsal sertifikalı bir hesap yöneticisiyle çalışın.',
  ],
  [
    "Talk with our customer care team anytime. We're here to help.",
    'Müşteri destek ekibimizle istediğiniz zaman görüşün. Yardım etmek için buradayız.',
  ],
  [
    'Our team can help bring your data from other platforms',
    'Ekibimiz verilerinizi diğer platformlardan güvenle taşımaya yardımcı olur.',
  ],
  [
    'Have something in mind? Just ask us.',
    'Aklınızda bir ihtiyaç mı var? Bize söyleyin; birlikte en doğru çözümü bulalım.',
  ],
  [
    'Get direct access to product experts for guidance on all things Fresha',
    'Fresha ile ilgili tüm konularda ürün uzmanlarına doğrudan erişim sağlayın.',
  ],
  [
    'You are never alone, award winning customer support 24/7',
    'Asla yalnız değilsiniz; ödüllü müşteri desteği 7/24 yanınızda.',
  ],
  [
    'Explore and learn with our help center knowledge base.',
    'Yardım merkezi bilgi tabanımızla keşfedin ve öğrenin.',
  ],
  [
    'Contact us via email and phone and one of our team will be there to help.',
    'E-posta veya telefonla bize ulaşın; ekibimiz size yardımcı olmak için hazır.',
  ],
  [
    'What makes Fresha the leading platform for businesses in beauty and wellness?',
    'Fresha’yı güzellik ve wellness işletmeleri için lider platform yapan nedir?',
  ],
  [
    'With our global marketplace, we connect your business to millions of potential customers',
    'Global pazaryerimizle işletmenizi milyonlarca potansiyel müşteriyle buluşturuyor, büyüme için güçlü fırsatlar sunuyoruz.',
  ],
  [
    'We’re the world’s largest booking platform for beauty and wellness, trusted by over 130,000 businesses',
    '130.000’den fazla işletmenin güvendiği, güzellik ve wellness alanındaki dünyanın en büyük rezervasyon platformuyuz.',
  ],
  [
    'Businesses choose us because of our powerful, easy-to-use features',
    'İşletmeler bizi; online rezervasyon, ödeme, pazarlama ve ekip yönetimini bir arada sunan güçlü ve kolay özelliklerimiz için tercih ediyor.',
  ],
  [
    'How does Fresha help my business grow?',
    'Fresha işletmemi büyütmeye nasıl yardımcı olur?',
  ],
  [
    'We help your business grow by providing powerful tools to attract new clients',
    'Yeni müşteri kazanımı, mevcut müşteriyi elde tutma ve operasyonları sadeleştirme için güçlü araçlar sunarak işletmenizi büyütmenize yardımcı oluyoruz.',
  ],
  [
    'Are there any hidden costs?',
    'Gizli bir maliyet var mı?',
  ],
  [
    'We don’t charge any hidden costs.',
    'Gizli ücret almıyoruz. Güçlü özellikler temel pakete dahildir; ek hizmetlerde yalnızca kullandığınız kadar ödersiniz.',
  ],
  [
    'Is there a minimum commitment or contract?',
    'Minimum taahhüt ya da sözleşme var mı?',
  ],
  [
    "No, there's no minimum commitment or long-term contract.",
    'Hayır. Minimum taahhüt veya uzun süreli sözleşme yok. Esnek aylık modelle istediğiniz zaman iptal edebilirsiniz.',
  ],
  [
    'Does Fresha support businesses of all sizes?',
    'Fresha her ölçekte işletmeyi destekler mi?',
  ],
  [
    'Yes, we’re designed to support businesses of all sizes',
    'Evet. Bağımsız profesyonellerden çok şubeli büyük işletmelere kadar her ölçekte işletmeye uygun şekilde tasarlandık.',
  ],
  [
    'What types of businesses can use Fresha?',
    'Fresha’yı hangi işletmeler kullanabilir?',
  ],
  [
    'We’re designed for a wide range of businesses in the beauty, wellness, and healthcare industries.',
    'Fresha; kuaför, spa, tırnak salonu, berber, medspa, masaj ve benzeri birçok güzellik/wellness/sağlık işletmesi için uygundur.',
  ],
  [
    'How can Fresha help reduce no-shows?',
    'Fresha randevuya gelmeme oranını nasıl azaltır?',
  ],
  [
    'We help reduce no-shows by offering several key features',
    'Otomatik e-posta/SMS hatırlatmaları ve ön ödeme seçenekleriyle randevuya gelmeme oranını düşürmeye yardımcı oluyoruz.',
  ],
  [
    'Can I migrate my data from my previous system to Fresha?',
    'Önceki sistemimdeki verileri Fresha’ya taşıyabilir miyim?',
  ],
  [
    'Yes, you can migrate data from your old system to Fresha.',
    'Evet, eski sisteminizden müşteri bilgileri ve ürün envanteri gibi verileri Fresha’ya taşıyabilirsiniz. Daha kapsamlı ihtiyaçlar için ücretli geçiş paketleri de sunuyoruz.',
  ],
  [
    'Partner with Fresha and start growing your business today',
    'Fresha ile iş ortaklığı kurun ve işletmenizi bugün büyütmeye başlayın.',
  ],
  [
    'Book unforgettable beauty and wellness experiences with our mobile app',
    'Mobil uygulamamızla unutulmaz güzellik ve wellness deneyimlerini rezerve edin; iOS ve Android uygulamamızla işletmenizi her yerden yönetin.',
  ],
  [
    'Instantly book beauty and wellness experiences near you',
    'Yakınınızdaki güzellik ve wellness deneyimlerini anında rezerve edin.',
  ],
  [
    'Simple, flexible and powerful software to run your business on the go',
    'Hareket halindeyken işletmenizi yönetmek için basit, esnek ve güçlü yazılım.',
  ],
];

function normalizeLookupText(value) {
  return String(value || '')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

const NORMALIZED_TURKISH_TEXT_MAP = Object.fromEntries(
  Object.entries(TURKISH_TEXT_MAP).map(([key, value]) => [normalizeLookupText(key), value]),
);

const NORMALIZED_TURKISH_PREFIX_MAP = TURKISH_PREFIX_MAP.map(([prefix, translated]) => [
  normalizeLookupText(prefix),
  translated,
]);

function translateReplicaText(text, languageCode = 'tr') {
  if (typeof text !== 'string') return text;
  const normalized = normalizeLookupText(text);
  if (!normalized) return text;

  if (normalized.startsWith('{"@context":"https://schema.org"')) {
    return '';
  }
  if (languageCode !== 'tr') return text;

  const exact = NORMALIZED_TURKISH_TEXT_MAP[normalized];
  if (typeof exact === 'string') return exact;

  const hyphenMatch = normalized.match(/^(.*)-(\d+)$/);
  if (hyphenMatch) {
    const base = hyphenMatch[1].trim();
    const translatedBase = NORMALIZED_TURKISH_TEXT_MAP[base];
    if (translatedBase) return `${translatedBase}-${hyphenMatch[2]}`;
  }

  for (const [prefix, translated] of NORMALIZED_TURKISH_PREFIX_MAP) {
    if (normalized.startsWith(prefix)) return translated;
  }

  return text;
}

function getRenderableTag(tag) {
  if (!tag || typeof tag !== 'string') return 'div';
  const lowered = tag.toLowerCase();
  return TAG_ALIAS[lowered] || lowered;
}

function toReactAttrName(name) {
  if (!name || typeof name !== 'string') return name;

  const lowered = name.toLowerCase();
  if (lowered === 'class') return 'className';
  if (lowered === 'for') return 'htmlFor';
  if (lowered === 'tabindex') return 'tabIndex';
  if (lowered === 'srcset') return 'srcSet';
  if (lowered === 'playsinline') return 'playsInline';
  if (lowered === 'autoplay') return 'autoPlay';
  if (lowered === 'readonly') return 'readOnly';
  if (lowered === 'viewbox') return 'viewBox';
  if (lowered === 'pathlength') return 'pathLength';
  if (lowered.startsWith('aria-') || lowered.startsWith('data-')) return lowered;

  if (name.includes(':')) {
    const [prefix, rest] = name.split(':');
    return `${prefix}${rest ? rest.charAt(0).toUpperCase() + rest.slice(1) : ''}`;
  }

  if (name.includes('-')) {
    return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  }

  return name;
}

function coerceAttrValue(name, value) {
  if (value == null) return value;

  if (
    name === 'disabled' ||
    name === 'checked' ||
    name === 'readOnly' ||
    name === 'muted' ||
    name === 'loop' ||
    name === 'controls' ||
    name === 'autoPlay' ||
    name === 'playsInline' ||
    name === 'aria-hidden'
  ) {
    if (value === '' || value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
  }

  if (name === 'tabIndex' && typeof value === 'string') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? value : parsed;
  }

  return value;
}

function scopeSelector(selector) {
  return selector
    .split(',')
    .map((part) => {
      const trimmed = part.trim();
      if (!trimmed) return trimmed;
      if (trimmed.startsWith('[dir] ')) {
        return trimmed.replace(/^\[dir\]\s+/, '[dir] .gra-shell ');
      }
      if (trimmed.startsWith('html ')) {
        return trimmed.replace(/^html\s+/, 'html .gra-shell ');
      }
      if (trimmed.startsWith('.gra-shell')) {
        return trimmed;
      }
      return `.gra-shell ${trimmed}`;
    })
    .join(', ');
}

function parsePx(value) {
  if (typeof value !== 'string') return null;
  const match = value.trim().match(/^(-?\d+(?:\.\d+)?)px$/);
  if (!match) return null;
  return Number(match[1]);
}

function isMeaningfulPseudoContent(contentValue) {
  if (typeof contentValue !== 'string') return false;
  const trimmed = contentValue.trim();
  if (!trimmed) return false;
  if (trimmed === 'none' || trimmed === 'normal') return false;
  if (trimmed === '""' || trimmed === "''") return false;
  return true;
}

function serializePseudoContent(contentValue) {
  if (!isMeaningfulPseudoContent(contentValue)) {
    return '""';
  }
  const trimmed = contentValue.trim();
  if (
    trimmed.startsWith('"') ||
    trimmed.startsWith("'") ||
    trimmed.startsWith('url(') ||
    trimmed.startsWith('attr(')
  ) {
    return trimmed;
  }
  return `"${trimmed.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function shouldKeepPseudo(styleObj) {
  if (!styleObj || typeof styleObj !== 'object') return false;

  if (isMeaningfulPseudoContent(styleObj.content)) return true;

  for (const [prop, val] of Object.entries(styleObj)) {
    if (prop === 'content' || prop === 'cssVars') continue;
    if (typeof val !== 'string' || !val.trim()) continue;
    if (PSEUDO_MEANINGFUL_PROPS.some((k) => prop === k || prop.startsWith(`${k}-`))) {
      return true;
    }
  }

  if (styleObj.cssVars && typeof styleObj.cssVars === 'object') {
    return Object.keys(styleObj.cssVars).length > 0;
  }

  return false;
}

function normalizeElementStyles(styleObj, el, rootId, topLevelIds, options = {}) {
  const normalized = { ...(styleObj || {}) };
  const isRoot = el.id === rootId;
  const isTopLevel = topLevelIds.has(el.id);
  const applyRootViewportFix = options.applyRootViewportFix !== false;

  if (isRoot && applyRootViewportFix) {
    delete normalized.height;
    normalized['min-height'] = '100vh';
    normalized['overflow-y'] = 'visible';
  }

  const overflowY = normalized['overflow-y'];
  const heightPx = parsePx(normalized.height);

  if (!isRoot && (overflowY === 'auto' || overflowY === 'scroll')) {
    // Avoid nested vertical scrollbars in replica mode.
    normalized['overflow-y'] = 'visible';

    if (heightPx !== null && heightPx >= 180) {
      normalized.height = 'auto';
      delete normalized['max-height'];
    }
  }

  if (isTopLevel) {
    if (heightPx !== null && heightPx >= 500) {
      normalized.height = 'auto';
      delete normalized['max-height'];
    }

    const widthPx = parsePx(normalized.width);
    if (widthPx !== null && widthPx >= 1800) {
      normalized.width = '100%';
    }
  }

  return normalized;
}

function appendCssBlock(lines, selector, styleObj, options = {}) {
  if (!styleObj || typeof styleObj !== 'object') return;

  const declarations = [];

  for (const [prop, val] of Object.entries(styleObj)) {
    if (prop === 'content' || prop === 'cssVars') continue;
    if (typeof val === 'string' && val.trim()) {
      declarations.push(`  ${prop}: ${val};`);
    }
  }

  if (options.includePseudoContent && isMeaningfulPseudoContent(styleObj.content)) {
    declarations.unshift(`  content: ${serializePseudoContent(styleObj.content)};`);
  }

  if (styleObj.cssVars && typeof styleObj.cssVars === 'object') {
    for (const [varName, varValue] of Object.entries(styleObj.cssVars)) {
      if (
        typeof varName === 'string' &&
        varName.startsWith('--') &&
        typeof varValue === 'string' &&
        varValue.trim()
      ) {
        declarations.push(`  ${varName}: ${varValue};`);
      }
    }
  }

  if (declarations.length === 0) return;

  lines.push(`${selector} {`);
  lines.push(...declarations);
  lines.push('}');
  lines.push('');
}


function getCarouselStep(trackEl) {
  if (!trackEl) return 320;

  const rowEl = trackEl.firstElementChild;
  const firstCard = rowEl?.firstElementChild || trackEl.firstElementChild;
  const cardWidth = firstCard?.getBoundingClientRect?.().width || 0;
  const gapEl = rowEl || trackEl;
  const gapValue = window.getComputedStyle(gapEl).columnGap || '0px';
  const gap = Number.parseFloat(gapValue) || 0;

  const estimated = cardWidth > 0 ? cardWidth + gap : trackEl.clientWidth * 0.85;
  return Math.max(160, Math.round(estimated));
}

function scrollCarousel(trackEl, direction) {
  const step = getCarouselStep(trackEl);
  trackEl.scrollBy({
    left: step * direction,
    behavior: 'smooth',
  });
}
function buildDynamicCss(data, rootId, byParent, options = {}) {
  const lines = [];

  const cssVarDefaults = data?.cssVarDefaults || {};
  const elements = Array.isArray(data?.elements) ? data.elements : [];
  const keyframes = Array.isArray(data?.keyframes) ? data.keyframes : [];
  const interactiveRules = Array.isArray(data?.interactiveRules) ? data.interactiveRules : [];
  const topLevelIds = new Set(byParent.get(rootId) || []);

  lines.push('/* Dynamic stylesheet from giris-computed-styles.json (normalized) */');
  lines.push('');

  if (Object.keys(cssVarDefaults).length) {
    lines.push('.gra-shell {');
    for (const [varName, varValue] of Object.entries(cssVarDefaults)) {
      if (
        typeof varName === 'string' &&
        varName.startsWith('--') &&
        typeof varValue === 'string' &&
        varValue.trim()
      ) {
        lines.push(`  ${varName}: ${varValue};`);
      }
    }
    lines.push('}');
    lines.push('');
  }

  for (const el of elements) {
    const id = el?.id;
    if (!id || typeof id !== 'string') continue;

    const normalizedStyles = normalizeElementStyles(
      el.styles || {},
      el,
      rootId,
      topLevelIds,
      options,
    );
    appendCssBlock(lines, `.gra-${id}`, normalizedStyles);

    if (el.cssVarOverrides && typeof el.cssVarOverrides === 'object') {
      appendCssBlock(lines, `.gra-${id}`, { cssVars: el.cssVarOverrides });
    }

    if (shouldKeepPseudo(el.pseudoBefore)) {
      appendCssBlock(lines, `.gra-${id}::before`, el.pseudoBefore, { includePseudoContent: true });
    }

    if (shouldKeepPseudo(el.pseudoAfter)) {
      appendCssBlock(lines, `.gra-${id}::after`, el.pseudoAfter, { includePseudoContent: true });
    }
  }

  for (const kf of keyframes) {
    if (typeof kf?.cssText === 'string' && kf.cssText.trim()) {
      lines.push(kf.cssText);
      lines.push('');
    }
  }

  const groupedMedia = new Map();

  for (const rule of interactiveRules) {
    const selector = typeof rule?.selector === 'string' ? rule.selector.trim() : '';
    const properties = rule?.properties && typeof rule.properties === 'object' ? rule.properties : null;
    if (!selector || !properties) continue;

    const scoped = scopeSelector(selector);
    const ruleLines = [];

    for (const [prop, value] of Object.entries(properties)) {
      if (typeof value === 'string' && value.trim()) {
        ruleLines.push(`  ${prop}: ${value};`);
      }
    }

    if (!ruleLines.length) continue;

    const block = [`${scoped} {`, ...ruleLines, '}', ''].join('\n');
    const media = typeof rule.media === 'string' && rule.media.trim() ? rule.media.trim() : null;

    if (!media) {
      lines.push(block);
      continue;
    }

    if (!groupedMedia.has(media)) groupedMedia.set(media, []);
    groupedMedia.get(media).push(block);
  }

  for (const [media, blocks] of groupedMedia.entries()) {
    lines.push(`${media} {`);
    for (const block of blocks) {
      const indented = block
        .split('\n')
        .map((line) => (line ? `  ${line}` : line))
        .join('\n');
      lines.push(indented);
    }
    lines.push('}');
    lines.push('');
  }

  // Section-specific fidelity fix:
  // "What are you waiting for?" block needs full-bleed background coverage.
  lines.push('.gra-shell .gra-el-2008 {');
  lines.push('  position: relative !important;');
  lines.push('  left: auto !important;');
  lines.push('  right: auto !important;');
  lines.push('  width: 100vw !important;');
  lines.push('  min-width: 100vw !important;');
  lines.push('  max-width: none !important;');
  lines.push('  margin-left: calc(50% - 50vw) !important;');
  lines.push('  margin-right: calc(50% - 50vw) !important;');
  lines.push('}');
  lines.push('');
  lines.push('.gra-shell .gra-el-2009 {');
  lines.push('  width: 100% !important;');
  lines.push('  min-width: 100% !important;');
  lines.push('  max-width: none !important;');
  lines.push('  height: 100% !important;');
  lines.push('  object-fit: cover !important;');
  lines.push('  display: block !important;');
  lines.push('}');
  lines.push('');
  lines.push('.gra-shell .gra-el-2010 {');
  lines.push('  width: 100% !important;');
  lines.push('  min-width: 100% !important;');
  lines.push('  overflow-y: visible !important;');
  lines.push('}');
  lines.push('');

  return lines.join('\n');
}

function namespaceExtractionData(data, namespace) {
  if (!namespace || typeof namespace !== 'string') return data;

  const elements = Array.isArray(data?.elements)
    ? data.elements.map((el) => ({
        ...el,
        id: `${namespace}-${el.id}`,
        parentId: el.parentId == null ? null : `${namespace}-${el.parentId}`,
      }))
    : [];

  return {
    ...(data || {}),
    elements,
  };
}

function buildTreeState(data, options = {}) {
  const elements = Array.isArray(data?.elements) ? data.elements : [];
  const byId = new Map();
  const byParent = new Map();
  let rootId = null;

  for (const el of elements) {
    byId.set(el.id, el);
    const parent = el.parentId ?? '__ROOT__';
    if (!byParent.has(parent)) byParent.set(parent, []);
    byParent.get(parent).push(el.id);
    if (el.parentId == null && rootId == null) rootId = el.id;
  }

  return {
    rootId,
    byId,
    byParent,
    styleText: buildDynamicCss(data, rootId, byParent, options),
  };
}

function findFirstTextDescendant(startId, tree) {
  const queue = [...(tree.byParent.get(startId) || [])];
  while (queue.length) {
    const id = queue.shift();
    const el = tree.byId.get(id);
    if (!el) continue;
    const text = typeof el.text === 'string' ? el.text.trim() : '';
    if (text) return text;
    queue.push(...(tree.byParent.get(id) || []));
  }
  return '';
}

function buildLanguageOptionLookup(tree) {
  const byButtonId = new Map();
  for (const el of tree.byId.values()) {
    if (el?.tag !== 'button') continue;
    const classes = typeof el.classes === 'string' ? el.classes : '';
    const isOptionButton =
      classes.includes('h-[72px]') && classes.includes('flex-col') && classes.includes('items-start');
    if (!isOptionButton) continue;

    const label = findFirstTextDescendant(el.id, tree);
    if (!label) continue;
    byButtonId.set(el.id, {
      label,
      code: LANGUAGE_LABEL_TO_CODE[label] || 'en',
    });
  }
  return byButtonId;
}

export default function GirisNative() {
  const navigate = useNavigate();
  const menuPanelRef = useRef(null);
  const languageModalRef = useRef(null);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 72, right: 20 });
  const [activeLanguage, setActiveLanguage] = useState({
    code: 'tr',
    label: 'Türkçe',
  });

  const updateMenuPosition = () => {
    const menuButton = document.querySelector(
      `.gra-shell [data-el-id="${HEADER_MENU_BUTTON_ID}"]`,
    );
    if (!(menuButton instanceof HTMLElement)) return;
    const rect = menuButton.getBoundingClientRect();
    setMenuPosition({
      top: Math.round(rect.bottom + 10),
      right: Math.max(12, Math.round(window.innerWidth - rect.right)),
    });
  };

  const closeHeaderMenu = () => setIsHeaderMenuOpen(false);
  const closeLanguageModal = () => setIsLanguageModalOpen(false);
  const openLanguageModal = () => {
    closeHeaderMenu();
    setIsLanguageModalOpen(true);
  };
  const selectLanguage = (code, label) => {
    setActiveLanguage({
      code: code || 'en',
      label: label || 'English',
    });
    closeLanguageModal();
  };

  const goToAuthPage = () => {
    closeHeaderMenu();
    navigate(AUTH_REPLICA_ROUTE);
  };

  const goHome = () => {
    closeHeaderMenu();
    navigate('/giris-replica-advanced');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToDownloadSection = () => {
    closeHeaderMenu();
    const section = document.querySelector(`.gra-shell [data-el-id="${DOWNLOAD_APP_SECTION_ID}"]`);
    if (section instanceof HTMLElement) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const { headerTree, mainTree, menuTree, languageTree, languageOptions } = useMemo(() => {
    const namespacedHeaderData = namespaceExtractionData(headerSource, 'hdr');
    const namespacedMenuData = namespaceExtractionData(menuSource, 'mnu');
    const namespacedLanguageData = namespaceExtractionData(languageSource, 'lng');
    const languageTreeState = {
      ...buildTreeState(namespacedLanguageData, { applyRootViewportFix: false }),
      kind: 'language',
    };
    return {
      headerTree: {
        ...buildTreeState(namespacedHeaderData, { applyRootViewportFix: false }),
        kind: 'header',
      },
      mainTree: {
        ...buildTreeState(source, { applyRootViewportFix: true }),
        kind: 'main',
      },
      menuTree: {
        ...buildTreeState(namespacedMenuData, { applyRootViewportFix: false }),
        kind: 'menu',
      },
      languageTree: languageTreeState,
      languageOptions: buildLanguageOptionLookup(languageTreeState),
    };
  }, []);


  useEffect(() => {
    if (!mainTree.rootId) return undefined;

    const cleanups = [];

    for (const binding of CAROUSEL_BINDINGS) {
      const trackEl = document.querySelector(`.gra-shell [data-el-id="${binding.trackId}"]`);
      if (!(trackEl instanceof HTMLElement)) continue;

      const prevBtn = document.querySelector(`.gra-shell [data-el-id="${binding.prevButtonId}"]`);
      const nextBtn = document.querySelector(`.gra-shell [data-el-id="${binding.nextButtonId}"]`);

      if (prevBtn instanceof HTMLElement) {
        const onPrev = (event) => {
          event.preventDefault();
          scrollCarousel(trackEl, -1);
        };
        prevBtn.addEventListener('click', onPrev);
        cleanups.push(() => prevBtn.removeEventListener('click', onPrev));
      }

      if (nextBtn instanceof HTMLElement) {
        const onNext = (event) => {
          event.preventDefault();
          scrollCarousel(trackEl, 1);
        };
        nextBtn.addEventListener('click', onNext);
        cleanups.push(() => nextBtn.removeEventListener('click', onNext));
      }

    }

    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, [mainTree.rootId]);

  useEffect(() => {
    if (!isHeaderMenuOpen) return undefined;

    updateMenuPosition();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsHeaderMenuOpen(false);
      }
    };

    const onPointerDown = (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      const menuButton = document.querySelector(
        `.gra-shell [data-el-id="${HEADER_MENU_BUTTON_ID}"]`,
      );

      if (menuPanelRef.current?.contains(target)) return;
      if (menuButton instanceof HTMLElement && menuButton.contains(target)) return;

      setIsHeaderMenuOpen(false);
    };

    const onViewportChange = () => {
      updateMenuPosition();
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    window.addEventListener('resize', onViewportChange);
    window.addEventListener('scroll', onViewportChange, { passive: true });

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('resize', onViewportChange);
      window.removeEventListener('scroll', onViewportChange);
    };
  }, [isHeaderMenuOpen]);

  useEffect(() => {
    if (!isLanguageModalOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeLanguageModal();
      }
    };

    const onPointerDown = (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (languageModalRef.current?.contains(target)) return;
      closeLanguageModal();
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [isLanguageModalOpen]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (isLanguageModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = previousOverflow || '';
    }
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isLanguageModalOpen]);

  const renderNode = (id, tree) => {
    const el = tree.byId.get(id);
    if (!el) return null;

    const tag = getRenderableTag(el.tag);
    if (tag === 'script' || tag === 'style') return null;

    const classTokens = [`gra-${el.id}`];
    if (typeof el.classes === 'string' && el.classes.trim()) {
      classTokens.push(el.classes.trim());
    }

    const props = {
      key: el.id,
      className: classTokens.join(' '),
      'data-el-id': el.id,
    };

    const combinedAttrs = { ...(el.attrs || {}), ...(el.svgAttrs || {}) };
    for (const [rawName, rawValue] of Object.entries(combinedAttrs)) {
      if (rawName === 'class' || rawName === 'style') continue;
      const reactName = toReactAttrName(rawName);
      if (!reactName) continue;
      const shouldTranslateAttr =
        typeof rawValue === 'string' && TRANSLATABLE_ATTRS.has(String(rawName).toLowerCase());
      const nextValue = shouldTranslateAttr
        ? translateReplicaText(rawValue, activeLanguage.code)
        : rawValue;
      props[reactName] = coerceAttrValue(reactName, nextValue);
    }

    if (tag === 'a' && !props.href) props.href = '#';
    if (tag === 'button') props.type = props.type || 'button';
    if (tag === 'img' && !props.alt) props.alt = '';
    if (tag === 'input' && !props.type) props.type = 'text';

    if (el.id === HEADER_MENU_BUTTON_ID) {
      props.onClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        updateMenuPosition();
        setIsHeaderMenuOpen((prev) => !prev);
      };
      props['aria-expanded'] = isHeaderMenuOpen;
      props['aria-controls'] = 'gra-header-dropdown';
    }

    if (AUTH_CTA_IDS.has(el.id)) {
      if (tag === 'a') {
        props.href = AUTH_REPLICA_ROUTE;
      }
      props.onClick = (event) => {
        event.preventDefault();
        closeHeaderMenu();
        navigate(AUTH_REPLICA_ROUTE);
      };
    }

    if (el.id === MENU_AUTH_LINK_ID) {
      props.href = AUTH_REPLICA_ROUTE;
      props.onClick = (event) => {
        event.preventDefault();
        goToAuthPage();
      };
    } else if (el.id === MENU_HOME_LINK_ID) {
      props.href = '/giris-replica-advanced';
      props.onClick = (event) => {
        event.preventDefault();
        goHome();
      };
    } else if (el.id === MENU_DOWNLOAD_LINK_ID) {
      props.href = '#download-app';
      props.onClick = (event) => {
        event.preventDefault();
        goToDownloadSection();
      };
    } else if (el.id === MENU_LANGUAGE_BUTTON_ID) {
      props.onClick = (event) => {
        event.preventDefault();
        openLanguageModal();
      };
    } else if (tree.kind === 'language' && el.id === LANGUAGE_MODAL_CLOSE_BUTTON_ID) {
      props.onClick = (event) => {
        event.preventDefault();
        closeLanguageModal();
      };
    } else if (el.id.startsWith('mnu-') && (tag === 'a' || tag === 'button')) {
      props.onClick = () => {
        closeHeaderMenu();
      };
    }

    if (tree.kind === 'language' && tag === 'button') {
      const optionMeta = languageOptions.get(el.id);
      if (optionMeta) {
        props.onClick = (event) => {
          event.preventDefault();
          selectLanguage(optionMeta.code, optionMeta.label);
        };
        props.className = `${props.className} gra-language-option-button`;
        if (optionMeta.code === activeLanguage.code) {
          props.className = `${props.className} gra-language-option-selected`;
        }
      }
    }

    const children = (tree.byParent.get(el.id) || []).map((childId) => renderNode(childId, tree));
    const Tag = tag;

    if (VOID_TAGS.has(tag)) {
      return <Tag {...props} />;
    }

    const hasText = typeof el.text === 'string' && el.text.trim().length > 0;
    if (hasText) {
      let translatedText = translateReplicaText(el.text, activeLanguage.code);
      if (el.id === MENU_LANGUAGE_LABEL_ID) {
        translatedText = activeLanguage.label;
      }
      return (
        <Tag {...props}>
          {translatedText}
          {children}
        </Tag>
      );
    }

    return <Tag {...props}>{children}</Tag>;
  };

  if (!mainTree.rootId) {
    return (
      <div className="gra-shell">
        {translateReplicaText('No root element found.', activeLanguage.code)}
      </div>
    );
  }

  return (
    <div className="gra-shell">
      <style>{headerTree.styleText}</style>
      <style>{mainTree.styleText}</style>
      <style>{menuTree.styleText}</style>
      <style>{languageTree.styleText}</style>
      {headerTree.rootId ? renderNode(headerTree.rootId, headerTree) : null}
      {renderNode(mainTree.rootId, mainTree)}
      {isHeaderMenuOpen ? (
        <div
          id="gra-header-dropdown"
          ref={menuPanelRef}
          className="gra-header-dropdown"
          role="menu"
          aria-label="Site menu"
          style={{ top: `${menuPosition.top}px`, right: `${menuPosition.right}px` }}
        >
          {menuTree.rootId ? renderNode(menuTree.rootId, menuTree) : null}
        </div>
      ) : null}
      {isLanguageModalOpen ? (
        <div className="gra-language-overlay">
          <div className="gra-language-modal" ref={languageModalRef}>
            {languageTree.rootId ? renderNode(languageTree.rootId, languageTree) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}



