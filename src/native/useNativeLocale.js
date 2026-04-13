import { useEffect, useMemo, useState } from 'react';
import { getNativeCopy } from './content';

const STORAGE_KEY = 'fresha-native-locale';

export function useNativeLocale() {
  const [locale, setLocale] = useState(() => {
    if (typeof window === 'undefined') return 'tr';
    return window.localStorage.getItem(STORAGE_KEY) || 'tr';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const copy = useMemo(() => getNativeCopy(locale), [locale]);

  return { locale, setLocale, copy };
}
