export const GIRIS_HEADER_NAV_ITEMS = [
  { key: 'business-types', label: 'Business types', type: 'button' },
  { key: 'features', label: 'Features', type: 'button' },
  { key: 'pricing', label: 'Pricing', type: 'link', href: 'https://www.fresha.com/pricing' },
];

export const GIRIS_MENU_BUSINESS_ITEMS = [
  { key: 'login', label: 'Log in or sign up', action: 'auth', accent: true },
  { key: 'home', label: 'Home', action: 'home' },
  { key: 'download', label: 'Download the app', action: 'download' },
  { key: 'blog', label: 'Blog', href: 'https://www.fresha.com/blog' },
  { key: 'support', label: 'Help and support', href: 'https://www.fresha.com/help-center/get-support' },
];

export const GIRIS_LANGUAGE_OPTIONS = [
  { code: 'id', label: 'Bahasa Indonesia', region: 'Indonesia' },
  { code: 'ms', label: 'Bahasa Melayu', region: 'Malaysia' },
  { code: 'cs', label: 'cestina', region: 'Ceska republika' },
  { code: 'da', label: 'dansk', region: 'Danmark' },
  { code: 'de', label: 'Deutsch', region: 'Deutschland' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'espanol', region: 'Espana' },
  { code: 'fr', label: 'francais', region: 'France' },
  { code: 'hr', label: 'hrvatski', region: 'Hrvatska' },
  { code: 'it', label: 'italiano', region: 'Italia' },
  { code: 'lt', label: 'lietuviu', region: 'Lietuva' },
  { code: 'hu', label: 'magyar', region: 'Magyarorszag' },
  { code: 'nl', label: 'Nederlands', region: 'Nederland' },
  { code: 'no', label: 'norsk bokmal', region: 'Norge' },
  { code: 'pl', label: 'polski', region: 'Polska' },
  { code: 'pt-BR', label: 'Portugues', region: 'Brasil' },
  { code: 'ro', label: 'romana', region: 'Romania' },
  { code: 'sl', label: 'slovenscina', region: 'Slovenija' },
  { code: 'fi', label: 'suomi', region: 'Suomi' },
  { code: 'sv', label: 'svenska', region: 'Sverige' },
  { code: 'vi', label: 'Tieng Viet', region: 'Viet Nam' },
  { code: 'el', label: 'Ellinika', region: 'Ellada' },
  { code: 'bg', label: 'balgarski', region: 'Balgariya' },
  { code: 'ru', label: 'russkiy', region: 'Rossiya' },
  { code: 'uk', label: 'ukrayinska', region: 'Ukrayina' },
  { code: 'ar', label: 'al-arabiyya' },
  { code: 'th', label: 'thai', region: 'Thailand' },
  { code: 'zh-CN', label: 'zhongwen', region: 'China' },
  { code: 'zh-HK', label: 'zhongwen', region: 'Hong Kong' },
  { code: 'ja', label: 'nihongo', region: 'Japan' },
  { code: 'tr', label: 'Turkce', region: 'Turkiye' },
];

export const GIRIS_SUGGESTED_LANGUAGE_CODES = ['de', 'en', 'tr'];

export const GIRIS_LANGUAGE_LABEL_TO_CODE = GIRIS_LANGUAGE_OPTIONS.reduce((acc, option) => {
  acc[option.label] = option.code;
  return acc;
}, {});
