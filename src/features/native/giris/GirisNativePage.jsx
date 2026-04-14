import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../pages/generated/giris-native-generated.css';
import './GirisHeroOwned.css';
import './GirisTopRatedOwned.css';
import './GirisBossOwned.css';
import './GirisFinalCtaOwned.css';
import './GirisNativePage.css';
import GirisHeader from './GirisHeader';
import GirisHeaderMenu from './GirisHeaderMenu';
import GirisLanguageModal from './GirisLanguageModal';
import GirisHeroSection from './GirisHeroSection';
import GirisTopRatedSection from './GirisTopRatedSection';
import GirisBossSection from './GirisBossSection';
import GirisFinalCtaSection from './GirisFinalCtaSection';
import { GIRIS_LANGUAGE_OPTIONS } from './girisNativeData';

const CAROUSEL_BINDINGS = [
  { trackId: 'el-410', prevButtonId: 'el-1058', nextButtonId: 'el-1063' },
  { trackId: 'el-1075', prevButtonId: 'el-1128', nextButtonId: 'el-1133' },
];

const AUTH_NATIVE_ROUTE = '/auth-native';
const DOWNLOAD_APP_SECTION_ID = 'el-2021';
const AUTH_CTA_IDS = new Set(['el-4', 'el-179', 'el-2015']);

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
  trackEl.scrollBy({ left: step * direction, behavior: 'smooth' });
}

export default function GirisNativePage() {
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const menuButtonRef = useRef(null);
  const menuPanelRef = useRef(null);
  const languageModalRef = useRef(null);

  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 72, right: 20 });
  const [activeLanguageCode, setActiveLanguageCode] = useState('en');

  const activeLanguage = useMemo(
    () =>
      GIRIS_LANGUAGE_OPTIONS.find((option) => option.code === activeLanguageCode) ||
      GIRIS_LANGUAGE_OPTIONS.find((option) => option.code === 'en'),
    [activeLanguageCode],
  );

  const translateText = useCallback((value) => value, []);

  const updateMenuPosition = useCallback(() => {
    const menuButton = menuButtonRef.current;
    if (!(menuButton instanceof HTMLElement)) return;

    const rect = menuButton.getBoundingClientRect();
    setMenuPosition({
      top: Math.round(rect.bottom + 10),
      right: Math.max(12, Math.round(window.innerWidth - rect.right)),
    });
  }, []);

  const closeHeaderMenu = useCallback(() => setIsHeaderMenuOpen(false), []);
  const closeLanguageModal = useCallback(() => setIsLanguageModalOpen(false), []);

  const goToAuthPage = useCallback(() => {
    setIsHeaderMenuOpen(false);
    navigate(AUTH_NATIVE_ROUTE);
  }, [navigate]);

  const goHome = useCallback(() => {
    setIsHeaderMenuOpen(false);
    navigate('/giris-native');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const goToDownloadSection = useCallback(() => {
    setIsHeaderMenuOpen(false);

    const section = pageRef.current?.querySelector(`[data-el-id="${DOWNLOAD_APP_SECTION_ID}"]`);
    if (section instanceof HTMLElement) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const openLanguageModal = useCallback(() => {
    setIsHeaderMenuOpen(false);
    setIsLanguageModalOpen(true);
  }, []);

  const handleLanguageSelect = useCallback((code) => {
    setActiveLanguageCode(code);
    setIsLanguageModalOpen(false);
  }, []);

  useEffect(() => {
    const page = pageRef.current;
    if (!(page instanceof HTMLElement)) return undefined;

    const cleanups = [];

    for (const binding of CAROUSEL_BINDINGS) {
      const trackEl = page.querySelector(`[data-el-id="${binding.trackId}"]`);
      const prevBtn = page.querySelector(`[data-el-id="${binding.prevButtonId}"]`);
      const nextBtn = page.querySelector(`[data-el-id="${binding.nextButtonId}"]`);

      if (!(trackEl instanceof HTMLElement)) continue;

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
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  useEffect(() => {
    const page = pageRef.current;
    if (!(page instanceof HTMLElement)) return undefined;

    const onClick = (event) => {
      const target = event.target instanceof HTMLElement ? event.target : null;
      const el = target?.closest('[data-el-id]');
      const id = el?.getAttribute('data-el-id');

      if (!id) return;

      if (AUTH_CTA_IDS.has(id)) {
        event.preventDefault();
        goToAuthPage();
      }
    };

    page.addEventListener('click', onClick);
    return () => page.removeEventListener('click', onClick);
  }, [goToAuthPage]);

  useEffect(() => {
    if (!isHeaderMenuOpen) return undefined;

    updateMenuPosition();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsHeaderMenuOpen(false);
    };

    const onPointerDown = (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      if (menuPanelRef.current?.contains(target)) return;
      if (menuButtonRef.current?.contains(target)) return;

      setIsHeaderMenuOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', updateMenuPosition, { passive: true });

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', updateMenuPosition);
    };
  }, [isHeaderMenuOpen, updateMenuPosition]);

  useEffect(() => {
    if (!isLanguageModalOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeLanguageModal();
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
  }, [closeLanguageModal, isLanguageModalOpen]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = isLanguageModalOpen ? 'hidden' : previousOverflow || '';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isLanguageModalOpen]);

  return (
    <div className="gra-shell" ref={pageRef}>
      <GirisHeader
        menuButtonRef={menuButtonRef}
        onMenuToggle={() => {
          updateMenuPosition();
          setIsHeaderMenuOpen((prev) => !prev);
        }}
      />

      <section className="gra-native-hero" aria-label="Hero section">
        <GirisHeroSection translateText={translateText} />
      </section>

      <section className="gra-native-top-rated" aria-label="Top rated by the industry">
        <GirisTopRatedSection translateText={translateText} />
      </section>

      <section className="gra-native-boss" aria-label="Boss your business">
        <GirisBossSection translateText={translateText} />
      </section>

      <section className="gra-native-final-cta" aria-label="Final call to action">
        <GirisFinalCtaSection translateText={translateText} />
      </section>

      {isHeaderMenuOpen ? (
        <div
          ref={menuPanelRef}
          className="gra-header-dropdown"
          role="menu"
          aria-label="Site menu"
          style={{ top: `${menuPosition.top}px`, right: `${menuPosition.right}px` }}
        >
          <GirisHeaderMenu
            languageLabel={activeLanguage?.label || 'English'}
            onAuth={goToAuthPage}
            onHome={goHome}
            onDownload={goToDownloadSection}
            onOpenLanguage={openLanguageModal}
          />
        </div>
      ) : null}

      {isLanguageModalOpen ? (
        <div className="gra-language-overlay">
          <div className="gra-language-modal" ref={languageModalRef}>
            <GirisLanguageModal
              activeLanguageCode={activeLanguageCode}
              onClose={closeLanguageModal}
              onSelectLanguage={handleLanguageSelect}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
