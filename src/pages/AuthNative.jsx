import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthNativeTree from './generated/AuthNativeTree';
import './AuthNative.css';
import './generated/auth-native-generated.css';

const BACK_ROUTE = '/giris-native';
const BACK_BUTTON_ID = 'el-5';

const BUTTON_ALERTS = {
  'el-29': 'Devam et buttonuna basildi',
  'el-39': 'Facebook ile devam et buttonuna basildi',
  'el-48': 'Google ile devam et buttonuna basildi',
};

const TEXT_TRANSLATIONS = new Map([
  ['Fresha for professionals', 'Profesyoneller icin Fresha'],
  ['Create an account or log in to manage your business.', 'Isletmeni yonetmek icin hesap olustur veya giris yap.'],
  ['Continue', 'Devam et'],
  ['OR', 'VEYA'],
  ['Continue with Facebook', 'Facebook ile devam et'],
  ['Continue with Google', 'Google ile devam et'],
  ['Are you a customer looking to book an appointment?', 'Randevu almak isteyen bir musteri misin?'],
  ['Go to Fresha for customers', 'Musteriler icin Fresha sayfasina git'],
  ['This site is protected by reCAPTCHA', 'Bu site reCAPTCHA ile korunmaktadir'],
  ['Privacy Policy', 'Gizlilik Politikasi'],
  ['Terms of Service', 'Hizmet Sartlari'],
  ['Support', 'Destek'],
  ['English (US)', 'Turkce'],
]);

function translateText(value) {
  if (typeof value !== 'string') return value;
  return TEXT_TRANSLATIONS.get(value) || value;
}

export default function AuthNative() {
  const navigate = useNavigate();
  const [lastAction, setLastAction] = useState('');

  useEffect(() => {
    const shell = document.querySelector('.ara-shell');
    if (!(shell instanceof HTMLElement)) return undefined;

    const onClick = (event) => {
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (!target) return;

      const el = target.closest('[data-el-id]');
      if (!(el instanceof HTMLElement)) return;
      const id = el.dataset.elId;
      if (!id) return;

      if (id === BACK_BUTTON_ID) {
        event.preventDefault();
        event.stopPropagation();
        navigate(BACK_ROUTE);
        return;
      }

      const clickMessage = BUTTON_ALERTS[id];
      if (clickMessage) {
        event.preventDefault();
        event.stopPropagation();
        setLastAction(clickMessage);
        window.alert(clickMessage);
      }
    };

    shell.addEventListener('click', onClick);
    return () => shell.removeEventListener('click', onClick);
  }, [navigate]);

  return (
    <div className="ara-shell" data-last-action={lastAction || undefined}>
      <AuthNativeTree translateText={translateText} />
    </div>
  );
}

