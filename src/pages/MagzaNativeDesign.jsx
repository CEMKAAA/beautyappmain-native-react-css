import { useMemo, useState } from 'react';
import NativeSiteLayout from '../native/NativeSiteLayout';
import { useNativeLocale } from '../native/useNativeLocale';
import './MagzaNativeDesign.css';

function Stars({ count }) {
  return (
    <div className="fn-stars" aria-label={`${count} stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={`${count}-${index}`} className={index < count ? 'is-on' : ''}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function MagzaNativeDesign() {
  const { locale, setLocale, copy } = useNativeLocale();
  const [serviceIndex, setServiceIndex] = useState(0);

  const activeCategory = useMemo(
    () => copy.store.serviceCategories[serviceIndex] || copy.store.serviceCategories[0],
    [copy.store.serviceCategories, serviceIndex],
  );

  return (
    <NativeSiteLayout copy={copy} locale={locale} setLocale={setLocale} accent="store">
      <section className="fn-store-hero fn-panel fn-section">
        <div className="fn-store-hero__gallery">
          <div className="fn-store-hero__media fn-store-hero__media--main" />
          <div className="fn-store-hero__stack">
            <div className="fn-store-hero__media fn-store-hero__media--side-a" />
            <div className="fn-store-hero__media fn-store-hero__media--side-b" />
          </div>
        </div>

        <div className="fn-store-hero__content">
          <span className="fn-eyebrow">{copy.store.eyebrow}</span>
          <h1>{copy.store.title}</h1>
          <div className="fn-store-hero__meta">
            <span>{copy.store.category}</span>
            <span>{copy.store.rating}</span>
            <span>{copy.store.reviewsCount}</span>
          </div>
          <p>{copy.store.description}</p>
        </div>
      </section>

      <nav className="fn-store-booking-rail fn-panel fn-section" aria-label="Booking sections">
        {copy.store.bookingRail.map((item) => (
          <button key={item} type="button" className="fn-store-booking-rail__item">
            {item}
          </button>
        ))}
      </nav>

      <section className="fn-store-services fn-section">
        <div className="fn-home-sectionhead">
          <span className="fn-eyebrow">Menu</span>
          <h2>{copy.store.servicesTitle}</h2>
        </div>

        <div className="fn-store-services__tabs">
          {copy.store.serviceCategories.map((category, index) => (
            <button
              key={category.id}
              type="button"
              className={`fn-store-services__tab ${index === serviceIndex ? 'is-active' : ''}`}
              onClick={() => setServiceIndex(index)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="fn-store-services__cards">
          {activeCategory.items.map((item) => (
            <article key={`${activeCategory.id}-${item.title}`} className="fn-store-service-card fn-panel">
              <div className="fn-store-service-card__body">
                <h3>{item.title}</h3>
                <p>{item.duration}</p>
                <strong>{item.price}</strong>
              </div>
              <button type="button" className="fn-button fn-button--secondary">
                {copy.store.book}
              </button>
            </article>
          ))}
        </div>

        <div className="fn-store-services__seeall">
          <button type="button" className="fn-button fn-button--secondary">
            {copy.store.seeAll}
          </button>
        </div>
      </section>

      <section className="fn-store-team fn-section">
        <div className="fn-home-sectionhead">
          <span className="fn-eyebrow">People</span>
          <h2>{copy.store.teamTitle}</h2>
        </div>

        <div className="fn-grid-4">
          {copy.store.team.map((member, index) => (
            <article key={member.name} className="fn-store-team__card fn-panel">
              <div className={`fn-store-team__avatar fn-store-team__avatar--${(index % 4) + 1}`}>
                {member.name.slice(0, 1)}
              </div>
              <strong>{member.name}</strong>
              <span>{member.role}</span>
              <small>{member.rating}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="fn-store-reviews fn-section">
        <div className="fn-home-sectionhead">
          <span className="fn-eyebrow">Reputation</span>
          <h2>{copy.store.reviewsTitle}</h2>
        </div>

        <div className="fn-grid-3">
          {copy.store.reviews.map((review) => (
            <article key={review.author} className="fn-store-review-card fn-panel">
              <Stars count={review.rating} />
              <p>{review.copy}</p>
              <strong>{review.author}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="fn-store-about fn-section fn-grid-2">
        <article className="fn-store-about__card fn-panel">
          <span className="fn-eyebrow">Story</span>
          <h2>{copy.store.aboutTitle}</h2>
          <p>{copy.store.aboutCopy}</p>
        </article>

        <article className="fn-store-about__card fn-panel">
          <span className="fn-eyebrow">Visit</span>
          <h2>{copy.store.locationTitle}</h2>
          <p>{copy.store.locationCopy}</p>
          <div className="fn-store-about__related">
            <strong>{copy.store.relatedTitle}</strong>
            <div className="fn-store-about__related-list">
              <span className="fn-chip">Glow House</span>
              <span className="fn-chip">North Aegean Hair Lab</span>
              <span className="fn-chip">Skin Ritual Room</span>
            </div>
          </div>
        </article>
      </section>
    </NativeSiteLayout>
  );
}
