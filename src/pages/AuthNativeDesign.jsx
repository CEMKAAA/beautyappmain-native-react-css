import { Link } from 'react-router-dom';
import { useState } from 'react';
import NativeSiteLayout from '../native/NativeSiteLayout';
import { useNativeLocale } from '../native/useNativeLocale';
import './AuthNativeDesign.css';

export default function AuthNativeDesign() {
  const { locale, setLocale, copy } = useNativeLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => setToast(''), 2200);
  };

  return (
    <NativeSiteLayout copy={copy} locale={locale} setLocale={setLocale} accent="auth" compact>
      <section className="fn-auth fn-panel">
        <div className="fn-auth__visual">
          <span className="fn-eyebrow">Native auth</span>
          <h1>{copy.auth.sideTitle}</h1>
          <p>{copy.auth.sideDescription}</p>

          <ul className="fn-auth__visual-list">
            {copy.auth.sideBullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>

          <div className="fn-auth__visual-card">
            <span>Workspace health</span>
            <strong>99.9%</strong>
            <small>Stable UI contracts, reusable components, cleaner code ownership</small>
          </div>
        </div>

        <div className="fn-auth__formpane">
          <Link className="fn-auth__back" to="/giris-native">
            {copy.auth.back}
          </Link>

          <div className="fn-auth__head">
            <h2>{copy.auth.title}</h2>
            <p>{copy.auth.description}</p>
          </div>

          {toast ? <div className="fn-auth__toast">{toast}</div> : null}

          <form
            className="fn-auth__form"
            onSubmit={(event) => {
              event.preventDefault();
              showToast(copy.auth.toastContinue);
            }}
          >
            <label className="fn-auth__field">
              <span>{copy.auth.emailLabel}</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@business.com"
              />
            </label>

            <label className="fn-auth__field">
              <span>{copy.auth.passwordLabel}</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
              />
            </label>

            <button className="fn-button fn-button--primary fn-auth__submit" type="submit">
              {copy.auth.continue}
            </button>
          </form>

          <div className="fn-auth__divider">
            <span>{copy.auth.divider}</span>
          </div>

          <div className="fn-auth__socials">
            <button
              type="button"
              className="fn-button fn-button--secondary fn-auth__social"
              onClick={() => showToast(copy.auth.toastGoogle)}
            >
              {copy.auth.google}
            </button>
            <button
              type="button"
              className="fn-button fn-button--secondary fn-auth__social"
              onClick={() => showToast(copy.auth.toastFacebook)}
            >
              {copy.auth.facebook}
            </button>
          </div>

          <div className="fn-auth__meta">
            <span>{copy.auth.support}</span>
            <p>{copy.auth.legal}</p>
          </div>
        </div>
      </section>
    </NativeSiteLayout>
  );
}
