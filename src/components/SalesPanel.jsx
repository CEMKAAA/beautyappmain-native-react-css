import React, { useState, useRef, useEffect } from 'react';
import './SalesPanel.css';

/* ═══════════════════════════════════════════════════
   SVG PATHS — From computed-styles.json (orijinal)
   ═══════════════════════════════════════════════════ */

/* el-61/62: Tag (fiyat etiketi) icon */
const SVG_TAG_BODY = "M15.145 2.256a2 2 0 0 1 1.8.55l13.046 13.046a1.99 1.99 0 0 1 0 2.834L18.686 29.99a1.987 1.987 0 0 1-2.834 0L2.806 16.945a2 2 0 0 1-.55-1.8v-.003L4.27 5.054a1 1 0 0 1 .785-.785l10.088-2.012zm.385 1.963L6.1 6.1 4.22 15.53l13.05 13.05 11.31-11.311z";
const SVG_TAG_DOT = "M10.5 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3";

/* el-49/50: Chevron down */
const SVG_CHEVRON = "M9.043 12.293a1 1 0 0 1 1.414 0L16 17.836l5.543-5.543a1 1 0 0 1 1.414 1.414l-6.25 6.25a1 1 0 0 1-1.414 0l-6.25-6.25a1 1 0 0 1 0-1.414";


/* ═══════════════════════════════════════════════════
   DUMMY SALES DATA
   ═══════════════════════════════════════════════════ */
const SALES = [
    {
        id: 1,
        title: 'Sale',
        status: 'paid',
        statusLabel: 'Paid',
        date: '19 Feb 2026',
        services: [
            { name: 'Hair Color', oldPrice: '', price: 'TRY 57' },
            { name: 'Pedicure', oldPrice: '', price: 'TRY 30' },
            { name: 'Hair Color', oldPrice: '', price: 'TRY 57' },
            { name: 'Test', oldPrice: '', price: 'TRY 100' },
        ],
        total: 'TRY 244',
    },
];

/* Tab configs */
const TABS = [
    { id: 'all', label: 'All', count: 1 },
    { id: 'paid', label: 'Paid', count: 1 },
    { id: 'drafts', label: 'Drafts', count: null },
];


/* ═══════════════════════════════════════════════════
   SalesPanel Component
   ═══════════════════════════════════════════════════ */
export default function SalesPanel() {
    const [activeTab, setActiveTab] = useState('all');
    const tabListRef = useRef(null);
    const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, transform: 'translateX(0)' });

    /* ── Update indicator position when tab changes ── */
    useEffect(() => {
        if (!tabListRef.current) return;
        const activeEl = tabListRef.current.querySelector('.sal-tab--active');
        if (activeEl) {
            const listRect = tabListRef.current.getBoundingClientRect();
            const tabRect = activeEl.getBoundingClientRect();
            setIndicatorStyle({
                width: tabRect.width,
                transform: `translateX(${tabRect.left - listRect.left}px)`,
            });
        }
    }, [activeTab]);

    /* ── Filter sales by tab ── */
    const filteredSales = activeTab === 'all'
        ? SALES
        : SALES.filter(s => s.status === activeTab);

    return (
        <div className="sal-root">
            {/* el-0 */}
            <div className="sal-grid">
                {/* el-1 */}

                {/* ── el-2: Header slot ── */}
                <div className="sal-header-slot">
                    {/* el-3 */}
                    <div className="sal-header-bg" />
                </div>

                {/* ── el-4: Scroll header overlay ── */}
                <div className="sal-scroll-header">
                    {/* el-5 */}
                    <div className="sal-floating-header">
                        {/* el-6 */}
                        <div className="sal-header-row">
                            {/* el-7 */}
                            <div className="sal-back-btn" />
                            {/* el-8 */}
                            <div className="sal-scroll-title-wrap">
                                {/* el-9 */}
                                <span className="sal-scroll-title">Sales</span>
                            </div>
                            {/* el-10 */}
                            <div className="sal-header-action">
                                {/* el-11: "Sell" button */}
                                <button className="sal-sell-btn">
                                    {/* el-12 */}
                                    <div className="sal-sell-inner">
                                        {/* el-13 */}
                                        <span className="sal-sell-label-wrap">
                                            {/* el-14 */}
                                            <span className="sal-sell-label">Sell</span>
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── el-15: Title area ── */}
                <div className="sal-title-area">
                    {/* el-16 */}
                    <div className="sal-title-prefix" />
                    {/* el-17 */}
                    <div className="sal-title-padding">
                        {/* el-18 */}
                        <div className="sal-title-grid">
                            {/* el-19: Action slot */}
                            <div className="sal-title-action">
                                {/* el-20: "Sell" button (title area) */}
                                <button className="sal-sell-btn">
                                    {/* el-21 */}
                                    <div className="sal-sell-inner">
                                        {/* el-22 */}
                                        <span className="sal-sell-label-wrap">
                                            {/* el-23 */}
                                            <span className="sal-sell-label">Sell</span>
                                        </span>
                                    </div>
                                </button>
                            </div>
                            {/* el-24 */}
                            <div className="sal-title-slot">
                                {/* el-25 */}
                                <div className="sal-title-hidden" />
                                {/* el-26 */}
                                <div className="sal-title-inner">
                                    {/* el-27 */}
                                    <h1 className="sal-page-title">Sales</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* el-28 */}
                    <div className="sal-title-spacer" />
                </div>

                {/* ── el-29: Body area ── */}
                <div className="sal-body">
                    {/* el-30 */}
                    <div className="sal-content">

                        {/* ══════════════════════════════════
                           TAB BAR (el-31 → el-50)
                           ══════════════════════════════════ */}
                        <div className="sal-tabs">
                            {/* el-31 */}
                            <div className="sal-tabs-scroll">
                                {/* el-32 */}

                                {/* el-33: Animated indicator */}
                                <div
                                    className="sal-tab-indicator"
                                    style={indicatorStyle}
                                />

                                {/* el-34: Tab list */}
                                <ul className="sal-tab-list" role="tablist" ref={tabListRef}>
                                    {TABS.map(tab => (
                                        <li
                                            key={tab.id}
                                            className={`sal-tab ${activeTab === tab.id ? 'sal-tab--active' : ''}`}
                                            role="tab"
                                            aria-selected={activeTab === tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                        >
                                            {/* el-36/40/44 */}
                                            <span className="sal-tab-text">{tab.label}</span>
                                            {/* el-37/41: Count badge */}
                                            {tab.count != null && (
                                                <div className="sal-tab-badge">
                                                    {/* el-38/42 */}
                                                    <span className="sal-tab-badge-text">{tab.count}</span>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>

                                {/* el-45: "More" button */}
                                <div className="sal-more-wrap">
                                    {/* el-46 */}
                                    <button className="sal-more-btn" role="tab">
                                        {/* el-47 */}
                                        <span className="sal-more-text">More</span>
                                        {/* el-48 */}
                                        <span className="sal-more-chevron">
                                            {/* el-49/50 */}
                                            <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d={SVG_CHEVRON} fillRule="evenodd" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ══════════════════════════════════
                           SALE LIST (el-51 → el-102)
                           ══════════════════════════════════ */}
                        <div className="sal-panel" role="tabpanel">
                            {/* el-51 */}
                            <div className="sal-list">
                                {/* el-52 */}
                                <ol className="sal-group-list">
                                    {/* el-53 */}
                                    <li className="sal-group">
                                        {/* el-54 */}
                                        <ol className="sal-day-list">
                                            {/* el-55 */}
                                            {filteredSales.map((sale, idx) => (
                                                <li className="sal-row" key={sale.id}>
                                                    {/* el-56 */}

                                                    {/* ── Timeline column (el-57) ── */}
                                                    <div className="sal-timeline">
                                                        {/* el-58: Tag icon badge */}
                                                        <div className="sal-timeline-badge">
                                                            {/* el-59 */}
                                                            <span className="sal-timeline-icon">
                                                                {/* el-60/61/62 */}
                                                                <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d={SVG_TAG_BODY} fillRule="evenodd" clipRule="evenodd" />
                                                                    <path d={SVG_TAG_DOT} />
                                                                </svg>
                                                            </span>
                                                        </div>
                                                        {/* el-63: Timeline line */}
                                                        <span className="sal-timeline-line" />
                                                    </div>

                                                    {/* ── Card area (el-64) ── */}
                                                    <div className="sal-card-outer">
                                                        {/* el-65 */}
                                                        <div className="sal-card-container">
                                                            {/* el-66: Click overlay */}
                                                            <button className="sal-card-btn" aria-label={`View ${sale.title}`} />

                                                            {/* el-67: Card visual */}
                                                            <div className="sal-card">
                                                                {/* el-68: Border overlay */}
                                                                <div className="sal-card-border" />

                                                                {/* el-69: Content */}
                                                                <div className="sal-card-padding">

                                                                    {/* ── Header (el-70) ── */}
                                                                    <div className="sal-card-header">
                                                                        {/* el-71 */}
                                                                        <p className="sal-card-title">{sale.title}</p>
                                                                        {/* el-72 */}
                                                                        <div className="sal-card-subtitle">
                                                                            {/* el-73 */}
                                                                            <p className="sal-card-date">{sale.date}</p>
                                                                            {/* el-74 */}
                                                                            <p className="sal-card-dot">•</p>
                                                                            {/* el-75 */}
                                                                            <p className={`sal-card-status sal-card-status--${sale.status}`}>{sale.statusLabel}</p>
                                                                        </div>
                                                                    </div>

                                                                    {/* ── Services (el-76) ── */}
                                                                    <div className="sal-services">
                                                                        {sale.services.map((svc, svcIdx) => (
                                                                            <div className="sal-service-row" key={svcIdx}>
                                                                                {/* el-78/83/88/93 */}
                                                                                <p className="sal-service-name">{svc.name}</p>
                                                                                {/* el-79/84/89/94 */}
                                                                                <div className="sal-price-wrap">
                                                                                    {/* el-80/85/90/95 */}
                                                                                    {svc.oldPrice && (
                                                                                        <p className="sal-price-old">{svc.oldPrice}</p>
                                                                                    )}
                                                                                    {/* el-81/86/91/96 */}
                                                                                    <p className="sal-price">{svc.price}</p>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>

                                                                    {/* ── el-97: Separator ── */}
                                                                    <hr className="sal-separator" />

                                                                    {/* ── Total (el-98) ── */}
                                                                    <div className="sal-total-section">
                                                                        {/* el-99 */}
                                                                        <div className="sal-total-row">
                                                                            {/* el-100 */}
                                                                            <div className="sal-total-label-wrap">
                                                                                {/* el-101 */}
                                                                                <p className="sal-total-label">Total</p>
                                                                            </div>
                                                                            {/* el-102 */}
                                                                            <p className="sal-total-amount">{sale.total}</p>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ol>
                                    </li>
                                </ol>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
