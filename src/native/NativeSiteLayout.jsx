import { Link } from 'react-router-dom';
import './NativeSiteLayout.css';

const navItems = [
  { key: 'home', to: '/giris-native' },
  { key: 'marketplace', to: '/marketplace-native' },
  { key: 'store', to: '/magza-native' },
  { key: 'auth', to: '/auth-native' },
];

export default function NativeSiteLayout({
  copy,
  locale,
  setLocale,
  children,
  accent = 'home',
  compact = false,
}) {
  return (
    <div className={`fn-shell fn-shell--${accent}`}>
      <header className={`fn-header ${compact ? 'fn-header--compact' : ''}`}>
        <div className="fn-header__inner">
          <Link className="fn-brand" to="/giris-native">
            <span className="fn-brand__mark">F</span>
            <span className="fn-brand__text">Fresha Native</span>
          </Link>

          <nav className="fn-nav" aria-label="Primary">
            {navItems.map((item) => (
              <Link key={item.key} className="fn-nav__link" to={item.to}>
                {copy.nav[item.key]}
              </Link>
            ))}
          </nav>

          <div className="fn-header__actions">
            <div className="fn-locale" role="group" aria-label={copy.nav.localeLabel}>
              <button
                type="button"
                className={`fn-locale__button ${locale === 'tr' ? 'is-active' : ''}`}
                onClick={() => setLocale('tr')}
              >
                TR
              </button>
              <button
                type="button"
                className={`fn-locale__button ${locale === 'en' ? 'is-active' : ''}`}
                onClick={() => setLocale('en')}
              >
                EN
              </button>
            </div>

            <Link className="fn-button fn-button--primary" to="/auth-native">
              {copy.nav.cta}
            </Link>
          </div>
        </div>
      </header>

      <main className="fn-main">{children}</main>

      <footer className="fn-footer">
        <div className="fn-footer__inner">
          <div>
            <p className="fn-footer__title">{copy.footer.title}</p>
            <p className="fn-footer__note">{copy.footer.note}</p>
          </div>

          <div className="fn-footer__links">
            {copy.footer.links.map((link) => (
              <span key={link}>{link}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
