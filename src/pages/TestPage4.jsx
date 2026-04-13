import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TestPage4.css';

/* ============================================================
   SVG Icon components for Settings cards
   ============================================================ */
const BusinessSetupIcon = () => (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M6.742 4h18.516a2.01 2.01 0 0 1 1.913 1.441l1.79 6.285A1 1 0 0 1 29 12v2a5 5 0 0 1-2 4v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-8a5 5 0 0 1-2-4v-2a1 1 0 0 1 .038-.274l1.79-6.285A2.01 2.01 0 0 1 6.743 4m-.128 12.66a1 1 0 0 0-.235-.136A3 3 0 0 1 5 14v-1h6v1a3 3 0 0 1-4.386 2.66M7 18.9V26h18v-7.101A5 5 0 0 1 20 17a5 5 0 0 1-8 0 5 5 0 0 1-5 1.899M13 14a3 3 0 0 0 6 0v-1h-6zm13.675-3-1.422-4.992L6.757 6l-1.432 5zM27 13h-6v1a3 3 0 0 0 4.386 2.66 1 1 0 0 1 .235-.136A3 3 0 0 0 27 14z" />
    </svg>
);

const SchedulingIcon = () => (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M10 2a1 1 0 0 1 1 1v1h10V3a1 1 0 1 1 2 0v1h3a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V3a1 1 0 0 1 1-1M9 6H6v4h20V6h-3v1a1 1 0 1 1-2 0V6H11v1a1 1 0 1 1-2 0zm17 6H6v14h20z" />
    </svg>
);

const SalesIcon = () => (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M15.145 2.256a2 2 0 0 1 1.8.55l13.046 13.046a1.99 1.99 0 0 1 0 2.834L18.686 29.99a1.987 1.987 0 0 1-2.834 0L2.806 16.945a2 2 0 0 1-.55-1.8v-.003L4.27 5.054a1 1 0 0 1 .785-.785l10.088-2.012zm.385 1.963L6.1 6.1 4.22 15.53l13.05 13.05 11.31-11.311z" />
        <path d="M10.5 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
    </svg>
);

const BillingIcon = () => (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M15.476 3.148a1 1 0 0 1 1.048 0l13 8A1 1 0 0 1 29 13h-3v8h2a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2h2v-8H3a1 1 0 0 1-.524-1.852zM8 13v8h4v-8zm-1.467-2L16 5.174 25.467 11zM14 13v8h4v-8zm6 0v8h4v-8zM1 26a1 1 0 0 1 1-1h28a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1" />
    </svg>
);

const TeamIcon = () => (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M30.6 18.8a1 1 0 0 1-1.4-.2A6.45 6.45 0 0 0 24 16a1 1 0 0 1 0-2 3 3 0 1 0-2.905-3.75 1 1 0 0 1-1.937-.5 5 5 0 1 1 8.217 4.939 8.5 8.5 0 0 1 3.429 2.71A1 1 0 0 1 30.6 18.8m-6.735 7.7a1 1 0 1 1-1.73 1 7.125 7.125 0 0 0-12.27 0 1 1 0 1 1-1.73-1 9 9 0 0 1 4.217-3.74 6 6 0 1 1 7.296 0 9 9 0 0 1 4.217 3.74M16 22a4 4 0 1 0 0-8 4 4 0 0 0 0 8m-7-7a1 1 0 0 0-1-1 3 3 0 1 1 2.905-3.75 1 1 0 0 0 1.938-.5 5 5 0 1 0-8.218 4.939 8.5 8.5 0 0 0-3.425 2.71A1 1 0 1 0 2.8 18.6 6.45 6.45 0 0 1 8 16a1 1 0 0 0 1-1" />
    </svg>
);

const FormsIcon = () => (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M5.586 3.586A2 2 0 0 1 7 3h12a1 1 0 0 1 .707.293l7 7A1 1 0 0 1 27 11v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 .586-1.414M18 5H7v22h18V12h-6a1 1 0 0 1-1-1zm2 1.414L23.586 10H20zM11 17a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2h-8a1 1 0 0 1-1-1m0 4a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2h-8a1 1 0 0 1-1-1" />
    </svg>
);

const PaymentsIcon = () => (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M28 6H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2m0 2v3H4V8zm0 16H4V13h24zm-2-3a1 1 0 0 1-1 1h-4a1 1 0 0 1 0-2h4a1 1 0 0 1 1 1m-8 0a1 1 0 0 1-1 1h-2a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414" />
    </svg>
);

/* ============================================================
   Data
   ============================================================ */
const TABS = [
    { id: 'settings', label: 'Settings' },
    { id: 'online-presence', label: 'Online presence' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'other', label: 'Other' },
];

const SETTINGS_CARDS = [
    { id: 'business-setup', title: 'Business setup', desc: 'Customize business details, manage locations, and client referral sources.', Icon: BusinessSetupIcon },
    { id: 'scheduling', title: 'Scheduling', desc: 'Set your availability, manage bookable resources and online booking preferences.', Icon: SchedulingIcon },
    { id: 'sales', title: 'Sales', desc: 'Configure payment methods, taxes, receipts, service charges and gift cards.', Icon: SalesIcon },
    { id: 'billing', title: 'Billing', desc: 'Manage Fresha invoices, messaging balance, add-ons and billing.', Icon: BillingIcon },
    { id: 'team', title: 'Team', desc: 'Manage permissions, compensation and time-off.', Icon: TeamIcon },
    { id: 'forms', title: 'Forms', desc: 'Configure templates for client forms.', Icon: FormsIcon },
    { id: 'payments', title: 'Payments', desc: 'Configure payment methods, terminals and your payment policy.', Icon: PaymentsIcon },
];

const ONLINE_PRESENCE_CARDS = [
    { id: 'marketplace-profile', title: 'Marketplace profile', desc: 'Attract new clients with online bookings.' },
    { id: 'reserve-google', title: 'Reserve with Google', desc: 'Get online bookings from Google Search and Maps.' },
    { id: 'book-facebook-instagram', title: 'Book with Facebook and Instagram', desc: 'Get online bookings from your social media pages.' },
    { id: 'link-builder', title: 'Link builder', desc: 'Create shareable booking links and QR codes.' },
];

const MARKETING_CARDS = [
    { id: 'blast-marketing', title: 'Blast marketing', desc: 'Share special offers and important updates over email and text message.' },
    { id: 'automations', title: 'Automations', desc: 'Engage with your clients and keep them up to date with automations.' },
    { id: 'deals', title: 'Deals', desc: 'Reward and retain clients with discount codes, flash sales and promotion offers.' },
    { id: 'smart-pricing', title: 'Smart pricing', desc: 'Adjust your prices to charge different amounts during more or less busy hours.' },
    { id: 'sent-messages', title: 'Sent messages', desc: 'View the list of all email, text and push messages sent to your clients.' },
    { id: 'ratings-reviews', title: 'Ratings and reviews', desc: 'View star ratings and reviews left by clients after their visit.' },
];

const OTHER_CARDS = [
    { id: 'add-ons', title: 'Add-ons', desc: 'Take your business to the next level with Fresha add-ons.' },
    { id: 'integrations', title: 'Integrations', desc: 'Integrate Fresha with third party applications.' },
];

/* ============================================================
   Card components
   ============================================================ */

/** Icon card — used in Settings section (with purple SVG icon, <a> overlay) */
const IconCard = ({ title, desc, Icon, onClick }) => (
    <div className="settings-card-wrapper">
        {/* el-33 */}
        <a className="settings-card-overlay-link" href="#" onClick={(e) => { e.preventDefault(); if (onClick) onClick(); }} aria-label={title} />
        {/* el-34 */}
        <div className="settings-card-visual">
            {/* el-35 */}
            <div className="settings-card-border" />
            {/* el-36 */}
            <div className="settings-card-content-icon">
                {/* el-37 */}
                <span className="settings-card-icon">
                    <Icon />
                </span>
                {/* el-39 */}
                <div className="settings-card-text-group">
                    <p className="settings-card-title">{title}</p>
                    <p className="settings-card-desc">{desc}</p>
                </div>
            </div>
        </div>
    </div>
);

/** View card — used in Online presence, Marketing, Other sections (with "View →" footer, <button> overlay) */
const ViewCard = ({ title, desc }) => (
    <div className="settings-card-wrapper">
        <button className="settings-card-overlay-button" type="button" aria-label={title} />
        <div className="settings-card-visual">
            <div className="settings-card-border" />
            <div className="settings-card-content-view">
                <div className="settings-card-text-group">
                    <p className="settings-card-title">{title}</p>
                    <p className="settings-card-desc">{desc}</p>
                </div>
                <div className="settings-card-view-footer">
                    <p className="settings-card-view-label">View</p>
                    <span className="settings-card-view-arrow" aria-hidden="true">
                        <ArrowRightIcon />
                    </span>
                </div>
            </div>
        </div>
    </div>
);

/* ============================================================
   Main component
   ============================================================ */
const TestPage4 = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('settings');
    const tabRefs = useRef({});
    const tabListRef = useRef(null);
    const scrollRef = useRef(null);
    const pillRef = useRef(null);

    // Update pill position directly via ref (like TestPage2's TabBar)
    useEffect(() => {
        const activeEl = tabRefs.current[activeTab];
        const indicator = pillRef.current;
        if (activeEl && indicator) {
            const listEl = activeEl.parentElement;
            const listRect = listEl.getBoundingClientRect();
            const tabRect = activeEl.getBoundingClientRect();
            indicator.style.transform = `translateX(${tabRect.left - listRect.left}px)`;
            indicator.style.width = `${tabRect.width}px`;
        }
    }, [activeTab]);

    useEffect(() => {
        const handleResize = () => {
            const activeEl = tabRefs.current[activeTab];
            const indicator = pillRef.current;
            if (activeEl && indicator) {
                const listEl = activeEl.parentElement;
                const listRect = listEl.getBoundingClientRect();
                const tabRect = activeEl.getBoundingClientRect();
                indicator.style.transform = `translateX(${tabRect.left - listRect.left}px)`;
                indicator.style.width = `${tabRect.width}px`;
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [activeTab]);

    // Flag to prevent scroll listener from overriding pill during click-scroll
    const isClickScrolling = useRef(false);

    // Scroll to section on tab click
    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        isClickScrolling.current = true;
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current;
            // First tab → scroll to very top
            if (tabId === TABS[0].id) {
                scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const section = document.getElementById(tabId);
                if (section) {
                    const sectionRect = section.getBoundingClientRect();
                    const containerRect = scrollContainer.getBoundingClientRect();
                    const offsetTop = sectionRect.top - containerRect.top + scrollContainer.scrollTop;
                    scrollContainer.scrollTo({
                        top: offsetTop - 68,
                        behavior: 'smooth',
                    });
                }
            }
            clearTimeout(isClickScrolling._timer);
            isClickScrolling._timer = setTimeout(() => {
                isClickScrolling.current = false;
            }, 600);
        }
    };

    // Update active tab on scroll (only when user is manually scrolling)
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const handleScroll = () => {
            if (isClickScrolling.current) return;

            const sections = TABS.map(t => document.getElementById(t.id)).filter(Boolean);
            const containerRect = scrollContainer.getBoundingClientRect();

            // If scrolled to bottom, activate the last tab
            const atBottom = scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 2;
            if (atBottom && sections.length > 0) {
                setActiveTab(sections[sections.length - 1].id);
                return;
            }

            let currentId = 'settings';
            for (const section of sections) {
                const rect = section.getBoundingClientRect();
                if (rect.top - containerRect.top <= 80) {
                    currentId = section.id;
                }
            }
            setActiveTab(currentId);
        };

        scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
        return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="settings-page"> {/* el-0 */}
            <div className="settings-scroll" ref={scrollRef}> {/* el-1 */}
                <div className="settings-inner"> {/* el-2 */}
                    <div className="settings-center"> {/* el-4 */}
                        <div className="settings-grid-wrap"> {/* el-6/7/8 */}

                            {/* ===== HEADER (el-9) ===== */}
                            <div className="settings-header-content">
                                {/* el-10 */}
                                <h1>Workspace settings</h1>
                                {/* el-11 */}
                                <p>Manage settings for Hasan.</p>
                            </div>

                            {/* ===== TAB BAR (el-12) ===== */}
                            <div className="settings-tab-bar">
                                <div className="settings-tab-list" ref={tabListRef} role="tablist">
                                    {/* el-15 — animated pill */}
                                    <div
                                        className="settings-tab-pill"
                                        ref={pillRef}
                                    />
                                    {TABS.map((tab) => (
                                        <button
                                            key={tab.id}
                                            ref={(el) => { tabRefs.current[tab.id] = el; }}
                                            className={`settings-tab-button${activeTab === tab.id ? ' active' : ''}`}
                                            role="tab"
                                            aria-selected={activeTab === tab.id}
                                            onClick={() => handleTabClick(tab.id)}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* ===== CONTENT AREA (el-29) ===== */}
                            <div className="settings-content">
                                {/* --- Section: Settings (el-30) --- */}
                                <div className="settings-section" id="settings">
                                    <h2>Settings</h2>
                                    <div className="settings-card-grid">
                                        {SETTINGS_CARDS.map((card) => (
                                            <IconCard
                                                key={card.id}
                                                title={card.title}
                                                desc={card.desc}
                                                Icon={card.Icon}
                                                onClick={card.id === 'business-setup' ? () => navigate('/test4/business-setup') : undefined}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* --- Section: Online presence (el-110) --- */}
                                <div className="settings-section" id="online-presence">
                                    <h2>Online presence</h2>
                                    <div className="settings-card-grid">
                                        {ONLINE_PRESENCE_CARDS.map((card) => (
                                            <ViewCard key={card.id} title={card.title} desc={card.desc} />
                                        ))}
                                    </div>
                                </div>

                                {/* --- Section: Marketing (el-181) --- */}
                                <div className="settings-section" id="marketing">
                                    <h2>Marketing</h2>
                                    <div className="settings-card-grid">
                                        {MARKETING_CARDS.map((card) => (
                                            <ViewCard key={card.id} title={card.title} desc={card.desc} />
                                        ))}
                                    </div>
                                </div>

                                {/* --- Section: Other (el-286) --- */}
                                <div className="settings-section" id="other">
                                    <h2>Other</h2>
                                    <div className="settings-card-grid">
                                        {OTHER_CARDS.map((card) => (
                                            <ViewCard key={card.id} title={card.title} desc={card.desc} />
                                        ))}
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

export default TestPage4;
