import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import NativeSiteLayout from '../native/NativeSiteLayout';
import { useNativeLocale } from '../native/useNativeLocale';
import './GirisNativeDesign.css';

export default function GirisNativeDesign() {
  const { locale, setLocale, copy } = useNativeLocale();
  const [featureId, setFeatureId] = useState(copy.home.featureTabs[0].id);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const activeFeature = useMemo(
    () => copy.home.featureTabs.find((item) => item.id === featureId) || copy.home.featureTabs[0],
    [copy.home.featureTabs, featureId],
  );

  const activeTestimonial = copy.home.testimonials[testimonialIndex % copy.home.testimonials.length];

  return (
    <NativeSiteLayout copy={copy} locale={locale} setLocale={setLocale} accent="home">
      <section className="fn-home-hero fn-panel fn-section">
        <div className="fn-home-hero__content">
          <span className="fn-eyebrow">{copy.home.eyebrow}</span>
          <h1>{copy.home.title}</h1>
          <p>{copy.home.description}</p>

          <div className="fn-home-hero__actions">
            <Link className="fn-button fn-button--primary" to="/auth-native">
              {copy.home.primaryCta}
            </Link>
            <Link className="fn-button fn-button--secondary" to="/marketplace-native">
              {copy.home.secondaryCta}
            </Link>
          </div>

          <div className="fn-home-hero__chips">
            {copy.home.categories.map((category) => (
              <span key={category} className="fn-chip">
                {category}
              </span>
            ))}
          </div>
        </div>

        <div className="fn-home-hero__visual">
          <div className="fn-home-statcard">
            <div className="fn-home-statcard__row">
              {copy.home.metrics.map((metric) => (
                <article key={metric.label} className="fn-home-statcard__metric">
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </article>
              ))}
            </div>

            <div className="fn-home-statcard__dashboard">
              <div className="fn-home-statcard__panel fn-home-statcard__panel--dark">
                <span>Live bookings</span>
                <strong>284</strong>
                <small>Today · +12% vs yesterday</small>
              </div>
              <div className="fn-home-statcard__panel">
                <span>Revenue</span>
                <strong>EUR 18.4K</strong>
                <small>Packages, services, and add-ons</small>
              </div>
              <div className="fn-home-statcard__panel fn-home-statcard__panel--accent">
                <span>Retention</span>
                <strong>83%</strong>
                <small>Clients rebooked in the last 30 days</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="fn-home-features fn-section">
        <div className="fn-home-sectionhead">
          <span className="fn-eyebrow">Core platform</span>
          <h2>One platform, cleaner architecture</h2>
        </div>

        <div className="fn-home-features__grid">
          <aside className="fn-home-feature-tabs fn-panel">
            {copy.home.featureTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`fn-home-feature-tabs__button ${tab.id === activeFeature.id ? 'is-active' : ''}`}
                onClick={() => setFeatureId(tab.id)}
              >
                <span>{tab.label}</span>
                <small>{tab.title}</small>
              </button>
            ))}
          </aside>

          <article className="fn-home-feature-card fn-panel">
            <span className="fn-home-feature-card__label">{activeFeature.label}</span>
            <h3>{activeFeature.title}</h3>
            <p>{activeFeature.description}</p>

            <ul className="fn-home-feature-card__list">
              {activeFeature.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="fn-home-proof fn-section">
        <div className="fn-home-sectionhead">
          <span className="fn-eyebrow">Trusted by operators</span>
          <h2>Top-rated by the industry</h2>
        </div>

        <div className="fn-home-proof__grid">
          <article className="fn-home-proof__spotlight fn-panel">
            <p className="fn-home-proof__quote">“{activeTestimonial.quote}”</p>
            <div className="fn-home-proof__author">
              <strong>{activeTestimonial.author}</strong>
              <span>{activeTestimonial.role}</span>
            </div>
            <div className="fn-home-proof__controls">
              <button
                type="button"
                className="fn-button fn-button--secondary"
                onClick={() =>
                  setTestimonialIndex((current) =>
                    current === 0 ? copy.home.testimonials.length - 1 : current - 1,
                  )
                }
              >
                &lt;
              </button>
              <button
                type="button"
                className="fn-button fn-button--secondary"
                onClick={() => setTestimonialIndex((current) => current + 1)}
              >
                &gt;
              </button>
            </div>
          </article>

          <div className="fn-home-proof__cards">
            {copy.home.businessCards.map((card) => (
              <article key={card.title} className="fn-home-proof__card fn-panel">
                <span>{card.title}</span>
                <strong>{card.value}</strong>
                <p>{card.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="fn-home-banner fn-section fn-panel">
        <div>
          <span className="fn-eyebrow">Launch path</span>
          <h2>{copy.home.finalBanner.title}</h2>
          <p>{copy.home.finalBanner.description}</p>
        </div>

        <Link className="fn-button fn-button--primary" to="/auth-native">
          {copy.home.finalBanner.cta}
        </Link>
      </section>
    </NativeSiteLayout>
  );
}
