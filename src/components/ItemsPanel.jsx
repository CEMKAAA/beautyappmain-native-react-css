import React, { useState, useRef, useEffect } from 'react';
import './ItemsPanel.css';

/* ═══════════════════════════════════════════════════
   DUMMY PRODUCT DATA
   ═══════════════════════════════════════════════════ */
const PRODUCTS = [
    {
        id: 1,
        name: 'Test',
        date: '19 Feb 2026',
        price: 'TRY 100',
        image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=264&h=264&fit=crop',
        category: 'products',
    },
];

const MEMBERSHIPS = [];
const SERVICES = [
    { id: 1, name: 'Hair Color', date: 'Thu 19 Feb', provider: 'Furkan Kem', price: 'TRY 57', color: '#A5DFF8' },
    { id: 2, name: 'Pedicure', date: 'Thu 19 Feb', provider: 'Furkan Kem', price: 'TRY 244', color: '#A5DFF8' },
    { id: 3, name: 'Manicure', date: 'Wed 18 Feb', provider: 'Furkan Kem', price: 'TRY 25', color: '#A5DFF8' },
];

/* Tab configs — Products(1), Memberships, Services(3) */
const TABS = [
    { id: 'products', label: 'Products', count: 1 },
    { id: 'memberships', label: 'Memberships', count: null },
    { id: 'services', label: 'Services', count: 3 },
];

/* ═══════════════════════════════════════════════════
   ItemsPanel Component
   ═══════════════════════════════════════════════════ */
export default function ItemsPanel() {
    const [activeTab, setActiveTab] = useState('products');
    const tabListRef = useRef(null);
    const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, transform: 'translateX(0)' });

    /* ── Animate tab indicator ── */
    useEffect(() => {
        if (!tabListRef.current) return;
        const activeEl = tabListRef.current.querySelector('.itm-tab--active');
        if (activeEl) {
            const listRect = tabListRef.current.getBoundingClientRect();
            const tabRect = activeEl.getBoundingClientRect();
            setIndicatorStyle({
                width: tabRect.width,
                transform: `translateX(${tabRect.left - listRect.left}px)`,
            });
        }
    }, [activeTab]);

    /* ── Get items for active tab ── */
    const getActiveItems = () => {
        switch (activeTab) {
            case 'products': return PRODUCTS;
            case 'memberships': return MEMBERSHIPS;
            case 'services': return SERVICES;
            default: return [];
        }
    };

    const items = getActiveItems();

    return (
        /* el-0: Root container */
        <div className="itm-root">
            {/* el-1: Grid layout container */}
            <div className="itm-grid">

                {/* el-2: Header slot (sticky, top:0, z:7) */}
                <div className="itm-header-slot">
                    {/* el-3: Header bg spacer */}
                    <div className="itm-header-bg" />
                </div>

                {/* el-4: Scroll header overlay (sticky, z:10) */}
                <div className="itm-scroll-header">
                    {/* el-5: Floating header bar (opacity:0 hidden) */}
                    <div className="itm-floating-header">
                        {/* el-6: Header inner flex row */}
                        <div className="itm-header-row">
                            {/* el-7: Back button (hidden) */}
                            <div className="itm-back-btn" />
                            {/* el-8: Title wrapper */}
                            <div className="itm-scroll-title-wrap">
                                {/* el-9: "Items" scroll title */}
                                <span className="itm-scroll-title">Items</span>
                            </div>
                            {/* el-10: Right action wrapper (24×24, empty) */}
                            <div className="itm-header-action">
                                {/* el-11: Icon wrapper (empty - no Sell button) */}
                                <span className="itm-header-icon" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* el-12: Title area */}
                <div className="itm-title-area">
                    {/* el-13: Hidden prefix */}
                    <div className="itm-title-prefix" />
                    {/* el-14: Title padding wrapper */}
                    <div className="itm-title-padding">
                        {/* el-15: Title grid */}
                        <div className="itm-title-grid">
                            {/* el-16: Action slot (empty, 0px) */}
                            <div className="itm-title-action" />
                            {/* el-17: Title slot */}
                            <div className="itm-title-slot">
                                {/* el-18: Hidden div */}
                                <div className="itm-title-hidden" />
                                {/* el-19: Title inner flex */}
                                <div className="itm-title-inner">
                                    {/* el-20: "Items" page title */}
                                    <h1 className="itm-page-title">Items</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* el-21: Title overlap spacer */}
                    <div className="itm-title-spacer" />
                </div>

                {/* el-22: Body area */}
                <div className="itm-body">
                    {/* el-23: Content flex container */}
                    <div className="itm-content">

                        {/* ── TAB BAR (el-24 → el-41) ── */}
                        <div className="itm-tabs">
                            {/* el-25: Left fade gradient */}
                            <div className="itm-fade itm-fade--left" />

                            {/* el-26: Tab scroll container */}
                            <div className="itm-tabs-scroll">
                                {/* el-27: Left spacer */}
                                <div className="itm-tab-spacer itm-tab-spacer--left" />

                                {/* el-28: Tab indicator (animated black pill) */}
                                <div
                                    className="itm-tab-indicator"
                                    style={indicatorStyle}
                                />

                                {/* el-29: Tab list */}
                                <ul className="itm-tab-list" role="tablist" ref={tabListRef}>
                                    {TABS.map(tab => (
                                        <li
                                            key={tab.id}
                                            className={`itm-tab ${activeTab === tab.id ? 'itm-tab--active' : ''}`}
                                            role="tab"
                                            aria-selected={activeTab === tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                        >
                                            {/* el-31/35/37: Tab text */}
                                            <span className="itm-tab-text">{tab.label}</span>
                                            {/* el-32/38: Count badge */}
                                            {tab.count != null && (
                                                <div className="itm-tab-badge">
                                                    <span className="itm-tab-badge-text">{tab.count}</span>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>

                                {/* el-40: Right spacer */}
                                <div className="itm-tab-spacer itm-tab-spacer--right" />
                            </div>

                            {/* el-41: Right fade gradient */}
                            <div className="itm-fade itm-fade--right" />
                        </div>

                        {/* ── TAB PANEL (el-42) ── */}
                        <div className="itm-panel" role="tabpanel">
                            {/* el-43: List container */}
                            <div className="itm-list">
                                {items.length === 0 ? (
                                    <div className="itm-empty">No items</div>
                                ) : activeTab === 'services' ? (
                                    /* ═══ SERVICE CARDS ═══ */
                                    items.map(item => (
                                        /* el-0: Root wrapper — NO border, just padding */
                                        <div className="itm-svc-card" key={item.id}>
                                            {/* el-1: Top section — bar + info+price */}
                                            <div className="itm-svc-top">
                                                {/* el-2: Color bar wrapper */}
                                                <div className="itm-svc-bar-wrap" aria-hidden="true">
                                                    {/* el-3: Color bar itself */}
                                                    <div
                                                        className="itm-svc-bar"
                                                        style={{ backgroundColor: item.color }}
                                                    />
                                                </div>

                                                {/* el-4: Info + price container */}
                                                <div className="itm-svc-content">
                                                    {/* el-5: Inner row — text col + price */}
                                                    <div className="itm-svc-row">
                                                        {/* el-6: Text wrapper */}
                                                        <div className="itm-svc-text-wrap">
                                                            {/* el-7: Text column */}
                                                            <div className="itm-svc-text-col">
                                                                {/* el-8: Service name */}
                                                                <p className="itm-svc-name">{item.name}</p>
                                                                {/* el-9: Meta row */}
                                                                <div className="itm-svc-meta">
                                                                    {/* el-10: Date */}
                                                                    <p className="itm-svc-date">{item.date}</p>
                                                                    {/* el-11: Dot + provider wrap */}
                                                                    <div className="itm-svc-meta-sep">
                                                                        {/* el-12: Dot */}
                                                                        <p className="itm-svc-dot">•</p>
                                                                        {/* el-13: Provider */}
                                                                        <p className="itm-svc-provider">with {item.provider}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* el-14: Price wrapper */}
                                                        <div className="itm-svc-price-wrap">
                                                            {/* el-15: Price */}
                                                            <p className="itm-svc-price">{item.price}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* el-16: Actions row */}
                                            <div className="itm-svc-actions">
                                                {/* el-17: View sale button */}
                                                <button className="itm-action-btn">
                                                    {/* el-18: Button inner */}
                                                    <div className="itm-action-inner">
                                                        {/* el-19: Label wrap */}
                                                        <span className="itm-action-label-wrap">
                                                            {/* el-20: Label */}
                                                            <span className="itm-action-label">View sale</span>
                                                        </span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    /* ═══ PRODUCT CARDS (& others) ═══ */
                                    items.map(item => (
                                        <div className="itm-card" key={item.id}>
                                            <button className="itm-card-btn" aria-label={`View ${item.name}`} />

                                            <div className="itm-card-content">
                                                <p className="itm-card-title">{item.name}</p>
                                                <div className="itm-card-subtitle">
                                                    <p className="itm-card-date">{item.date}</p>
                                                    <p className="itm-card-dot">•</p>
                                                    <p className="itm-card-price">{item.price}</p>
                                                </div>
                                                <div className="itm-card-actions">
                                                    <button className="itm-action-btn">
                                                        <div className="itm-action-inner">
                                                            <span className="itm-action-label-wrap">
                                                                <span className="itm-action-label">Sell</span>
                                                            </span>
                                                        </div>
                                                    </button>
                                                    <button className="itm-action-btn">
                                                        <div className="itm-action-inner">
                                                            <span className="itm-action-label-wrap">
                                                                <span className="itm-action-label">View sale</span>
                                                            </span>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="itm-card-img-container">
                                                <div className="itm-card-img-wrap">
                                                    <picture className="itm-card-picture">
                                                        <img
                                                            className="itm-card-img"
                                                            src={item.image}
                                                            alt={item.name}
                                                        />
                                                    </picture>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
