import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import NativeSiteLayout from '../native/NativeSiteLayout';
import { useNativeLocale } from '../native/useNativeLocale';
import './MarketPlaceNativeDesign.css';

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

export default function MarketPlaceNativeDesign() {
  const { locale, setLocale, copy } = useNativeLocale();
  const [query, setQuery] = useState('');
  const [reviewIndex, setReviewIndex] = useState(0);
  const [countryIndex, setCountryIndex] = useState(0);

  const activeReview = copy.marketplace.reviews[reviewIndex % copy.marketplace.reviews.length];
  const activeCountry = useMemo(
    () => copy.marketplace.countries[countryIndex] || copy.marketplace.countries[0],
    [copy.marketplace.countries, countryIndex],
  );

  return (
    <NativeSiteLayout copy={copy} locale={locale} setLocale={setLocale} accent="marketplace">
      <section className="fn-market-hero fn-panel fn-section">
        <div className="fn-market-hero__copy">
          <span className="fn-eyebrow">{copy.marketplace.eyebrow}</span>
          <h1>{copy.marketplace.title}</h1>
          <p>{copy.marketplace.description}</p>

          <div className="fn-market-search">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.marketplace.searchPlaceholder}
            />
            <button type="button" className="fn-button fn-button--primary">
              {copy.marketplace.searchButton}
            </button>
          </div>

          <div className="fn-market-pills">
            {copy.marketplace.pills.map((pill) => (
              <span key={pill} className="fn-chip">
                {pill}
              </span>
            ))}
          </div>
        </div>

        <div className="fn-market-hero__visual">
          <div className="fn-market-mapcard">
            <div className="fn-market-mapcard__header">
              <span>Nearby demand</span>
              <strong>306,906</strong>
            </div>
            <div className="fn-market-mapcard__body">
              <div className="fn-market-mapcard__spot fn-market-mapcard__spot--a" />
              <div className="fn-market-mapcard__spot fn-market-mapcard__spot--b" />
              <div className="fn-market-mapcard__spot fn-market-mapcard__spot--c" />
            </div>
          </div>
        </div>
      </section>

      <section className="fn-market-featured fn-section">
        <div className="fn-home-sectionhead">
          <span className="fn-eyebrow">Marketplace</span>
          <h2>{copy.marketplace.featuredTitle}</h2>
        </div>

        <div className="fn-grid-3">
          {copy.marketplace.featuredCards.map((card) => (
            <article key={card.name} className="fn-market-card fn-panel">
              <div className="fn-market-card__media">
                <span>{card.city}</span>
              </div>
              <div className="fn-market-card__body">
                <div className="fn-market-card__topline">
                  <small>{card.category}</small>
                  <strong>{card.rating}</strong>
                </div>
                <h3>{card.name}</h3>
                <p>{card.blurb}</p>
                <Link className="fn-button fn-button--secondary" to="/magza-native">
                  {copy.marketplace.visitStore}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="fn-market-reviews fn-section">
        <div className="fn-home-sectionhead">
          <span className="fn-eyebrow">Social proof</span>
          <h2>{copy.marketplace.reviewsTitle}</h2>
        </div>

        <div className="fn-market-reviews__wrap">
          <button
            type="button"
            className="fn-button fn-button--secondary fn-market-reviews__arrow"
            onClick={() =>
              setReviewIndex((current) =>
                current === 0 ? copy.marketplace.reviews.length - 1 : current - 1,
              )
            }
          >
            &lt;
          </button>

          <article className="fn-market-reviews__card fn-panel">
            <Stars count={activeReview.rating} />
            <h3>{activeReview.title}</h3>
            <p>{activeReview.copy}</p>
            <strong>{activeReview.author}</strong>
          </article>

          <button
            type="button"
            className="fn-button fn-button--secondary fn-market-reviews__arrow"
            onClick={() => setReviewIndex((current) => current + 1)}
          >
            &gt;
          </button>
        </div>
      </section>

      <section className="fn-market-cities fn-panel fn-section">
        <div className="fn-home-sectionhead">
          <span className="fn-eyebrow">Discovery</span>
          <h2>{copy.marketplace.countriesTitle}</h2>
        </div>

        <div className="fn-market-cities__tabs">
          {copy.marketplace.countries.map((country, index) => (
            <button
              key={country.name}
              type="button"
              className={`fn-market-cities__tab ${index === countryIndex ? 'is-active' : ''}`}
              onClick={() => setCountryIndex(index)}
            >
              {country.name}
            </button>
          ))}
        </div>

        <div className="fn-market-cities__grid">
          {activeCountry.cities.map((city) => (
            <article key={city} className="fn-market-cities__city">
              <h3>{city}</h3>
              <div className="fn-market-cities__links">
                {copy.marketplace.countryCategories.map((category) => (
                  <Link
                    key={`${city}-${category}`}
                    className="fn-market-cities__link"
                    to={`/magza-native?city=${encodeURIComponent(city)}&category=${encodeURIComponent(category)}`}
                  >
                    {category} in {city}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="fn-market-app fn-section fn-panel">
        <div>
          <span className="fn-eyebrow">Mobile</span>
          <h2>{copy.marketplace.appBannerTitle}</h2>
          <p>{copy.marketplace.appBannerDescription}</p>
        </div>

        <div className="fn-market-app__actions">
          <button type="button" className="fn-button fn-button--primary">
            {copy.marketplace.appBannerPrimary}
          </button>
          <button type="button" className="fn-button fn-button--secondary">
            {copy.marketplace.appBannerSecondary}
          </button>
        </div>
      </section>
    </NativeSiteLayout>
  );
}
