import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BusinessSetup.css';

/* ============================================================
   SVG Icons (from computed-styles.json SVG path data)
   ============================================================ */

/** Back arrow icon (20×20) — el-13/14/15/16 */
const BackArrowIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L7.41421 10L11.7071 14.2929C12.0976 14.6834 12.0976 15.3166 11.7071 15.7071C11.3166 16.0976 10.6834 16.0976 10.2929 15.7071L5.29289 10.7071C4.90237 10.3166 4.90237 9.68342 5.29289 9.29289L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z" />
    </svg>
);

/** Breadcrumb dot separator (20×20) */
const DotIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="2" />
    </svg>
);

/** External link arrow icon (16×16) — el-62 etc. */
const ExternalArrowIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.33333 3.33333C5.33333 2.96514 5.63181 2.66667 6 2.66667H12.6667C13.0349 2.66667 13.3333 2.96514 13.3333 3.33333V10C13.3333 10.3682 13.0349 10.6667 12.6667 10.6667C12.2985 10.6667 12 10.3682 12 10V5.21895L3.80474 13.4142C3.54439 13.6746 3.12228 13.6746 2.86193 13.4142C2.60158 13.1539 2.60158 12.7318 2.86193 12.4714L11.0572 4.27614H6.27614C5.90795 4.27614 5.60948 3.97767 5.60948 3.60948L5.33333 3.33333Z" />
    </svg>
);

/** Facebook icon (20×20) — el-122/123 from computed-styles.json */
const FacebookIcon = () => (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.575 28.9c6.436-.779 11.423-6.259 11.423-12.904C28.998 8.818 23.178 3 16 3S3.002 8.818 3.002 15.996c0 6.096 4.196 11.212 9.858 12.616v-8.643h-2.683v-3.973h2.683v-1.711c0-4.424 2.001-6.473 6.343-6.473.821 0 2.24.161 2.823.322v3.598a17 17 0 0 0-1.503-.046c-2.131 0-2.953.805-2.953 2.906v1.404h4.248l-.728 3.972h-3.514z" />
    </svg>
);

/** Instagram icon (20×20) — el-132/133 from computed-styles.json */
const InstagramIcon = () => (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 5.342c3.471 0 3.882.013 5.253.076 1.268.057 1.956.269 2.414.447.607.236 1.04.518 1.495.972.455.455.737.888.972 1.495.179.458.39 1.147.448 2.414.063 1.371.076 1.782.076 5.254 0 3.47-.013 3.882-.076 5.253-.058 1.267-.27 1.956-.448 2.414a4 4 0 0 1-.972 1.495 4 4 0 0 1-1.495.972c-.458.178-1.146.39-2.414.447-1.37.063-1.782.076-5.253.076s-3.882-.013-5.253-.076c-1.268-.057-1.956-.269-2.414-.447a4 4 0 0 1-1.495-.972 4 4 0 0 1-.972-1.495c-.179-.458-.39-1.147-.448-2.414-.062-1.371-.075-1.782-.075-5.253s.013-3.883.075-5.254c.058-1.267.27-1.956.448-2.414.236-.607.517-1.04.972-1.495a4 4 0 0 1 1.495-.972c.458-.178 1.146-.39 2.414-.447 1.37-.062 1.782-.076 5.253-.076M16 3c-3.53 0-3.973.015-5.36.078-1.384.063-2.329.283-3.155.604a6.4 6.4 0 0 0-2.303 1.5 6.4 6.4 0 0 0-1.5 2.303c-.321.827-.54 1.772-.604 3.155C3.015 12.027 3 12.47 3 16s.015 3.974.078 5.36c.063 1.384.283 2.329.604 3.155.333.855.777 1.58 1.5 2.303a6.4 6.4 0 0 0 2.303 1.5c.827.321 1.772.54 3.155.604 1.386.063 1.83.078 5.36.078s3.974-.015 5.36-.078c1.384-.063 2.329-.283 3.155-.605a6.4 6.4 0 0 0 2.303-1.5 6.4 6.4 0 0 0 1.5-2.302c.321-.826.54-1.772.604-3.155.063-1.386.078-1.83.078-5.36s-.015-3.973-.078-5.36c-.063-1.384-.283-2.329-.605-3.155a6.4 6.4 0 0 0-1.5-2.303 6.4 6.4 0 0 0-2.302-1.5c-.826-.321-1.772-.54-3.155-.604C19.974 3.015 19.53 3 16 3m0 6.324a6.675 6.675 0 1 0 0 13.351 6.675 6.675 0 0 0 0-13.35m0 11.01a4.333 4.333 0 1 1 0-8.667 4.333 4.333 0 0 1 0 8.667M22.94 7.5a1.56 1.56 0 1 0-.001 3.12 1.56 1.56 0 0 0 0-3.12" />
    </svg>
);

/** X (Twitter) icon (20×20) — el-142/143 from computed-styles.json */
const XTwitterIcon = () => (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="m18.42 14.01 9.468-11.007h-2.243l-8.222 9.557-6.566-9.557H3.283l9.93 14.452-9.93 11.542h2.244l8.682-10.092 6.935 10.092h7.573zm-3.074 3.572-1.006-1.439-8.005-11.45h3.447l6.46 9.24 1.006 1.44 8.398 12.012h-3.447z" />
    </svg>
);

/** Website / Globe icon (20×20) — el-152/153 from computed-styles.json */
const WebsiteIcon = () => (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M19.429 3.457C24.944 4.96 29 10.007 29 16c0 2.022-.462 3.937-1.285 5.643a1 1 0 0 1-.088.18l-.006.01c-2.084 4.144-6.319 7.02-11.238 7.161a1 1 0 0 1-.169.004L16 29C8.82 29 3 23.18 3 16S8.82 3 16 3c1.105 0 2.177.138 3.201.397q.117.017.227.06M5 16c0-1.786.426-3.473 1.181-4.965l1.305 3.471a1.99 1.99 0 0 0 1.454 1.272l2.675.574.471.981.009.018a2.03 2.03 0 0 0 1.778 1.111h.163l-.96 2.154a2 2 0 0 0 .35 2.173l2.352 2.544-.322 1.654C9.633 26.703 5 21.893 5 16m2.923-6.016L8.956 7.55A10.96 10.96 0 0 1 16 5c.826 0 1.63.091 2.404.264l.944 1.709-3.356 3.035-1.55.854h-2.655a2.012 2.012 0 0 0-1.844 1.218l-.651 1.547zm4.107 4.412-.818-.176.58-1.358h2.697c.303 0 .634-.091.917-.241l1.552-.858a2 2 0 0 0 .383-.279l3.365-3.04a2.01 2.01 0 0 0 .536-2.117A11 11 0 0 1 27 16c0 1.35-.244 2.645-.689 3.84l-5.792-3.563a1.9 1.9 0 0 0-.794-.282l-2.85-.386a1.98 1.98 0 0 0-1.915.853l-1.071-.003-.473-.975a1.99 1.99 0 0 0-1.386-1.088m13.409 7.256a11 11 0 0 1-7.927 5.245l.232-1.179a2.025 2.025 0 0 0-.491-1.741l-2.354-2.54 1.715-3.845 2.853.387z" />
    </svg>
);


/* ============================================================
   Data
   ============================================================ */

const SIDEBAR_MENU = [
    { id: 'business-details', label: 'Business details', active: true },
    { id: 'locations', label: 'Locations', active: false },
    { id: 'client-sources', label: 'Client sources', active: false },
];

const SHORTCUTS = [
    { id: 'service-menu', label: 'Service menu' },
    { id: 'product-list', label: 'Product list' },
    { id: 'memberships', label: 'Memberships' },
    { id: 'client-list', label: 'Client list' },
];

const BUSINESS_INFO_FIELDS = [
    { label: 'Business name', value: 'Hasan' },
    { label: 'Country', value: 'Turkey' },
    { label: 'Currency', value: 'TRY' },
    { label: 'Tax calculation', value: 'Retail prices include tax' },
    { label: 'Team default language', value: '🇺🇸 English (US)' },
    { label: 'Client default language', value: '🇺🇸 English (US)' },
];

const EXTERNAL_LINKS = [
    { label: 'Facebook', value: '', href: '#', field: 'facebookPage' },
    { label: 'X (Twitter)', value: '', href: '#', field: 'twitterPage' },
    { label: 'Instagram', value: '', href: '#', field: 'instagramPage' },
    { label: 'Website', value: '', href: '#', field: 'website' },
];


/* ============================================================
   Edit Business Drawer — Full-screen overlay
   (computed-styles.json el-0 → el-157)
   ============================================================ */

const EditBusinessDrawer = ({ isOpen, onClose }) => {
    const [taxCalc, setTaxCalc] = useState('include');

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Escape key listener
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    return (
        <div className={`ebd-overlay${isOpen ? ' ebd-overlay--open' : ''}`} role="dialog" tabIndex="-1">
            {/* el-1: Transform panel (slides in) */}
            <div className="ebd-panel">
                {/* el-2: Scroll container */}
                <div className="ebd-scroll">
                    {/* el-3: Surface */}
                    <div className="ebd-surface">

                        {/* ===== STICKY HEADER (el-4 → el-17) ===== */}
                        <div className="ebd-header">
                            <div className="ebd-header-inner">
                                {/* Spacer to push buttons right */}
                                <div className="ebd-title-region"></div>

                                {/* el-9: Action buttons */}
                                <div className="ebd-header-actions">
                                    {/* Close button (el-11) */}
                                    <button className="ebd-close-btn" type="button" onClick={onClose}>
                                        <div className="ebd-close-inner">
                                            <span className="ebd-close-label">Close</span>
                                        </div>
                                    </button>

                                    {/* Save button (el-15) */}
                                    <button className="ebd-save-btn" type="submit">
                                        <div className="ebd-save-inner">
                                            <span className="ebd-save-label">Save</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ===== FORM BODY (el-18→el-32) ===== */}
                        <div className="ebd-body">
                            {/* el-22: Grid with title/content areas */}
                            <div className="ebd-body-grid">
                                {/* el-23: Title area */}
                                <div className="ebd-body-title-area">
                                    <h1 className="ebd-hero-title">Edit business details</h1>
                                </div>
                            </div>
                            <div className="ebd-content">

                                {/* ===== SECTION 1: Business info (el-33 → el-50) ===== */}
                                <div className="ebd-section">
                                    <div className="ebd-section-head">
                                        <p className="ebd-section-title">Business info</p>
                                        <p className="ebd-section-desc">
                                            Choose the name displayed on your online booking profile, sales receipts and messages to clients.
                                        </p>
                                    </div>

                                    <div className="ebd-grid">
                                        {/* Business name — spans 12 cols */}
                                        <div className="ebd-col-12">
                                            <div className="ebd-field">
                                                <label className="ebd-label">
                                                    <span>Business name</span>
                                                </label>
                                                <div className="ebd-input-wrap">
                                                    <input
                                                        className="ebd-input"
                                                        type="text"
                                                        placeholder="Enter business name"
                                                        name="businessName"
                                                        defaultValue="Hasan"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Country/Currency info box — spans 12 cols */}
                                        <div className="ebd-col-12">
                                            <div className="ebd-info-box">
                                                Your country is set to <strong>Turkey</strong> with <strong>TRY</strong> currency.
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                {/* ===== DIVIDER ===== */}
                                <hr className="ebd-divider" />


                                {/* ===== SECTION 2: Tax calculation (el-52 → el-77) ===== */}
                                <div className="ebd-section">
                                    <div className="ebd-section-head">
                                        <p className="ebd-section-title">Tax calculation</p>
                                        <p className="ebd-section-desc">
                                            Choose how to apply taxes to prices in sales and reporting calculation.{' '}
                                            <a className="ebd-link" href="https://support.fresha.com" target="_blank" rel="noopener noreferrer">
                                                Learn more.
                                            </a>
                                        </p>
                                    </div>

                                    <div className="ebd-radio-group">
                                        {/* Radio option 1: Exclude */}
                                        <label
                                            className={`ebd-radio-option${taxCalc === 'exclude' ? ' selected' : ''}`}
                                            onClick={() => setTaxCalc('exclude')}
                                        >
                                            <input
                                                className="ebd-radio-native"
                                                type="radio"
                                                name="taxCalculation"
                                                value="exclude"
                                                checked={taxCalc === 'exclude'}
                                                onChange={() => setTaxCalc('exclude')}
                                            />
                                            <div className="ebd-radio-indicator" />
                                            <div className="ebd-radio-text">
                                                <span className="ebd-radio-title">Retail prices exclude tax</span>
                                                <span className="ebd-radio-desc">Tax = Retail * Tax</span>
                                                <span className="ebd-radio-example">e.g. 20% tax on a $10 item costs $2</span>
                                            </div>
                                        </label>

                                        {/* Radio option 2: Include */}
                                        <label
                                            className={`ebd-radio-option${taxCalc === 'include' ? ' selected' : ''}`}
                                            onClick={() => setTaxCalc('include')}
                                        >
                                            <input
                                                className="ebd-radio-native"
                                                type="radio"
                                                name="taxCalculation"
                                                value="include"
                                                checked={taxCalc === 'include'}
                                                onChange={() => setTaxCalc('include')}
                                            />
                                            <div className="ebd-radio-indicator" />
                                            <div className="ebd-radio-text">
                                                <span className="ebd-radio-title">Retail prices include tax</span>
                                                <span className="ebd-radio-desc">Tax = (Tax rate * Retail price) / (1 + Tax rate)</span>
                                                <span className="ebd-radio-example">e.g. 20% tax on a $10 item costs $1.67</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>


                                {/* ===== DIVIDER ===== */}
                                <hr className="ebd-divider" />


                                {/* ===== SECTION 3: Language settings (el-79 → el-106) ===== */}
                                <div className="ebd-section">
                                    <div className="ebd-section-head">
                                        <p className="ebd-section-title">Language settings</p>
                                        <p className="ebd-section-desc">
                                            Choose the default language for clients and team members.
                                        </p>
                                    </div>

                                    <div className="ebd-grid">
                                        {/* Team default language — spans 6 cols */}
                                        <div className="ebd-col-6">
                                            <div className="ebd-field">
                                                <label className="ebd-label">
                                                    <span>Team default language</span>
                                                </label>
                                                <div className="ebd-input-wrap">
                                                    <input
                                                        className="ebd-input readonly"
                                                        type="text"
                                                        placeholder="Select team language"
                                                        name="teamLanguageLocale"
                                                        defaultValue=""
                                                        readOnly
                                                    />
                                                    <div className="ebd-input-suffix">
                                                        <button className="ebd-input-edit-btn" type="button">
                                                            <span>Edit</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Client default language — spans 6 cols */}
                                        <div className="ebd-col-6">
                                            <div className="ebd-field">
                                                <label className="ebd-label">
                                                    <span>Client default language</span>
                                                </label>
                                                <div className="ebd-input-wrap">
                                                    <input
                                                        className="ebd-input readonly"
                                                        type="text"
                                                        placeholder="Select client language"
                                                        name="clientLanguageLocale"
                                                        defaultValue=""
                                                        readOnly
                                                    />
                                                    <div className="ebd-input-suffix">
                                                        <button className="ebd-input-edit-btn" type="button">
                                                            <span>Edit</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Language info box — spans 12 cols */}
                                        <div className="ebd-lang-info-box">
                                            <span>Team members and clients can override the language displayed to them in their settings.</span>
                                        </div>
                                    </div>
                                </div>


                                {/* ===== DIVIDER ===== */}
                                <hr className="ebd-divider" />


                                {/* ===== SECTION 4: External links (el-108 → el-154) ===== */}
                                <div className="ebd-section">
                                    <div className="ebd-section-head">
                                        <p className="ebd-section-title">External links</p>
                                        <p className="ebd-section-desc">
                                            Add your company website and social media links for sharing with clients.
                                        </p>
                                    </div>

                                    <div className="ebd-grid">
                                        {/* Facebook */}
                                        <div className="ebd-col-12">
                                            <div className="ebd-field">
                                                <label className="ebd-label">
                                                    <span>Facebook</span>
                                                </label>
                                                <div className="ebd-input-wrap ebd-input-with-prefix">
                                                    <div className="ebd-input-prefix">
                                                        <FacebookIcon />
                                                    </div>
                                                    <input
                                                        className="ebd-input"
                                                        type="text"
                                                        placeholder="facebook.com/yoursite"
                                                        name="facebookPage"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Instagram */}
                                        <div className="ebd-col-12">
                                            <div className="ebd-field">
                                                <label className="ebd-label">
                                                    <span>Instagram</span>
                                                </label>
                                                <div className="ebd-input-wrap ebd-input-with-prefix">
                                                    <div className="ebd-input-prefix">
                                                        <InstagramIcon />
                                                    </div>
                                                    <input
                                                        className="ebd-input"
                                                        type="text"
                                                        placeholder="instagram.com/yoursite"
                                                        name="instagramPage"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* X (Twitter) */}
                                        <div className="ebd-col-12">
                                            <div className="ebd-field">
                                                <label className="ebd-label">
                                                    <span>X (Twitter)</span>
                                                </label>
                                                <div className="ebd-input-wrap ebd-input-with-prefix">
                                                    <div className="ebd-input-prefix">
                                                        <XTwitterIcon />
                                                    </div>
                                                    <input
                                                        className="ebd-input"
                                                        type="text"
                                                        placeholder="x.com/yoursite"
                                                        name="twitterPage"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Website */}
                                        <div className="ebd-col-12">
                                            <div className="ebd-field">
                                                <label className="ebd-label">
                                                    <span>Website</span>
                                                </label>
                                                <div className="ebd-input-wrap ebd-input-with-prefix">
                                                    <div className="ebd-input-prefix">
                                                        <WebsiteIcon />
                                                    </div>
                                                    <input
                                                        className="ebd-input"
                                                        type="text"
                                                        placeholder="yoursite.com"
                                                        name="website"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


/* ============================================================
   Component
   ============================================================ */

const BusinessSetup = () => {
    const navigate = useNavigate();
    const [showEditDrawer, setShowEditDrawer] = useState(false);

    return (
        <div className="bs-page"> {/* el-0 */}
            <div className="bs-scroll"> {/* el-1 */}
                <div className="bs-inner"> {/* el-2 */}
                    <div className="bs-padded"> {/* el-3 */}
                        <div className="bs-center"> {/* el-4 */}
                            <div className="bs-spacer-top" /> {/* el-5 */}
                            <div className="bs-grid-wrap"> {/* el-6 */}
                                <div className="bs-grid"> {/* el-7 */}

                                    {/* ===== TITLE AREA (el-8 → el-27) ===== */}
                                    <div className="bs-title-area"> {/* el-8 */}
                                        <div className="bs-title-content"> {/* el-9 */}

                                            {/* Back Button (el-10 → el-21) */}
                                            <button
                                                className="bs-back-button"
                                                type="button"
                                                onClick={() => navigate('/test4')}
                                            > {/* el-10 */}
                                                <div className="bs-back-inner"> {/* el-11 */}
                                                    <span className="bs-back-icon"> {/* el-12 */}
                                                        <BackArrowIcon />
                                                    </span>
                                                    <span className="bs-back-label-wrap"> {/* el-17 */}
                                                        <span className="bs-back-label">Back</span> {/* el-18 */}
                                                    </span>
                                                </div>
                                            </button>

                                            {/* Breadcrumbs (el-22 → el-27) */}
                                            <nav className="bs-breadcrumb" aria-label="Breadcrumb"> {/* el-22 */}
                                                <ol className="bs-breadcrumb-list"> {/* el-23 */}
                                                    <li className="bs-breadcrumb-item"> {/* el-24 */}
                                                        <a
                                                            className="bs-breadcrumb-link"
                                                            href="#"
                                                            onClick={(e) => { e.preventDefault(); navigate('/test4'); }}
                                                        >
                                                            Workspace settings
                                                        </a>
                                                    </li>
                                                    <li className="bs-breadcrumb-item" aria-hidden="true">
                                                        <span className="bs-breadcrumb-dot">
                                                            <DotIcon />
                                                        </span>
                                                    </li>
                                                    <li className="bs-breadcrumb-item"> {/* el-26 */}
                                                        <span className="bs-breadcrumb-current">Business setup</span> {/* el-27 */}
                                                    </li>
                                                </ol>
                                            </nav>

                                        </div>
                                    </div>


                                    {/* ===== SIDEBAR (el-28 → el-85) ===== */}
                                    <div className="bs-sidebar-area"> {/* el-28 */}
                                        <div className="bs-sidebar-sticky"> {/* el-29 */}
                                            <div className="bs-sidebar-card"> {/* el-30 */}
                                                <div className="bs-sidebar-border" /> {/* el-31 */}
                                                <div className="bs-sidebar-inner"> {/* el-32 */}

                                                    {/* Header + Menu group 1 (el-33 → el-52) */}
                                                    <div className="bs-sidebar-header"> {/* el-33 */}
                                                        <h2 className="bs-sidebar-title">Business setup</h2> {/* el-34 */}
                                                        <ul className="bs-menu-list"> {/* el-35 */}
                                                            <div className="bs-menu-group"> {/* el-36 */}
                                                                {SIDEBAR_MENU.map((item) => (
                                                                    <li key={item.id} className="bs-menu-item"> {/* el-37/43/47 */}
                                                                        <button
                                                                            className={`bs-menu-link${item.active ? ' active' : ''}`}
                                                                            type="button"
                                                                        >
                                                                            <span className="bs-menu-text">{item.label}</span>
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                            </div>
                                                        </ul>
                                                    </div>

                                                    <hr className="bs-menu-divider" /> {/* el-51/52 */}

                                                    {/* Shortcuts section (el-53 → el-85) */}
                                                    <div className="bs-sidebar-header"> {/* el-53 */}
                                                        <div className="bs-shortcuts-header"> {/* el-54 */}
                                                            <h2 className="bs-shortcuts-title">Shortcuts</h2> {/* el-55 */}
                                                        </div>
                                                        <ul className="bs-menu-list"> {/* el-56 */}
                                                            {SHORTCUTS.map((item, idx) => (
                                                                <React.Fragment key={item.id}>
                                                                    <li className="bs-menu-item"> {/* el-57/64/71/78 */}
                                                                        <a
                                                                            className="bs-shortcut-link"
                                                                            href="#"
                                                                            onClick={(e) => e.preventDefault()}
                                                                        >
                                                                            <span className="bs-shortcut-text">{item.label}</span>
                                                                            <span className="bs-external-icon"> {/* el-61/68/75/82 */}
                                                                                <ExternalArrowIcon />
                                                                            </span>
                                                                        </a>
                                                                    </li>
                                                                    {idx < SHORTCUTS.length - 1 ? (
                                                                        <hr className="bs-menu-divider" />
                                                                    ) : (
                                                                        <hr className="bs-menu-divider-hidden" /> /* el-85 hidden */
                                                                    )}
                                                                </React.Fragment>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    {/* ===== CONTENT (el-86 → el-157) ===== */}
                                    <div className="bs-content-area"> {/* el-86 */}

                                        {/* Content Header (el-87 → el-95) */}
                                        <div className="bs-content-header"> {/* el-87/88 */}
                                            <h1 className="bs-content-heading">Business details</h1> {/* el-91 */}
                                            <p className="bs-content-description"> {/* el-92 */}
                                                Manage business details like your business name, country, currency and more.{' '}
                                                <a className="bs-learn-more" href="#" onClick={(e) => e.preventDefault()}>
                                                    Learn more
                                                </a> {/* el-93 */}
                                            </p>
                                        </div>


                                        {/* Business Info Card (el-96 → el-131) */}
                                        <div className="bs-info-card"> {/* el-96 */}
                                            <div className="bs-info-card-border" /> {/* el-98 */}
                                            <div className="bs-info-card-inner"> {/* el-99 */}

                                                {/* Section header: Business Info + Edit (el-100 → el-106) */}
                                                <div className="bs-info-section-header"> {/* el-100 */}
                                                    <div className="bs-info-section-title-wrap"> {/* el-101 */}
                                                        <h2 className="bs-info-section-title">Business Info</h2> {/* el-102 */}
                                                    </div>
                                                    <button
                                                        className="bs-edit-button"
                                                        type="button"
                                                        onClick={() => setShowEditDrawer(true)}
                                                    > {/* el-103 */}
                                                        <div className="bs-edit-inner"> {/* el-104 */}
                                                            <span className="bs-edit-label-wrap"> {/* el-105 */}
                                                                <span className="bs-edit-label">Edit</span> {/* el-106 */}
                                                            </span>
                                                        </div>
                                                    </button>
                                                </div>

                                                {/* 12-column grid with key-value pairs (el-107 → el-131) */}
                                                <div className="bs-info-grid"> {/* el-107 */}
                                                    {BUSINESS_INFO_FIELDS.map((field) => (
                                                        <div key={field.label} className="bs-info-field"> {/* el-108/112/116/120/124/128 */}
                                                            <div className="bs-field-content"> {/* el-109/113/117/121/125/129 */}
                                                                <p className="bs-field-label">{field.label}</p> {/* el-110/114/118/122/126/130 */}
                                                                <p className="bs-field-value">{field.value}</p> {/* el-111/115/119/123/127/131 */}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Divider (el-132) */}
                                                <hr className="bs-card-divider" />

                                                {/* External Links Section (el-133 → el-156) */}
                                                <div className="bs-external-header"> {/* el-133 */}
                                                    <div className="bs-external-title-wrap"> {/* el-134 */}
                                                        <h2 className="bs-external-title">External links</h2> {/* el-135 */}
                                                    </div>
                                                </div>

                                                <div className="bs-external-grid"> {/* el-136 */}
                                                    {EXTERNAL_LINKS.map((link) => (
                                                        <div key={link.label} className="bs-external-field"> {/* el-137/142/147/152 */}
                                                            <div className="bs-external-field-content"> {/* el-138/143/148/153 */}
                                                                <p className="bs-field-label">{link.label}</p> {/* el-139/144/149/154 */}
                                                                <p className="bs-field-value"> {/* el-140/145/150/155 */}
                                                                    {link.value || (
                                                                        <a
                                                                            className="bs-add-link"
                                                                            href="#"
                                                                            onClick={(e) => e.preventDefault()}
                                                                        >
                                                                            Add
                                                                        </a>
                                                                    )} {/* el-141/146/151/156 */}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>
                            <div className="bs-spacer-bottom" /> {/* el-157 */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Business Drawer */}
            <EditBusinessDrawer
                isOpen={showEditDrawer}
                onClose={() => setShowEditDrawer(false)}
            />
        </div>
    );
};

export default BusinessSetup;

