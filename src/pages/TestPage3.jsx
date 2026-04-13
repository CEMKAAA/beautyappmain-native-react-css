import React, { useState, useCallback } from 'react';
import './TestPage3.css';

// ======================================================
// Refund Sale Modal — Fresha Pixel-Perfect Replica
// Kaynak: Fresh/refund 1.html, computed-styles.json
// 126 element (el-0 → el-125), 1:1 hiyerarşi
// ======================================================

// Dummy data — gerçek uygulamada props olarak gelecek
const DUMMY_ITEMS = [
    { id: 1, name: 'Hair Color', subtitle: '11:00, 19 Feb 2026 with Furkan Kem', price: 57 },
    { id: 2, name: 'Pedicure', subtitle: '10:10, 19 Feb 2026 with Furkan Kem', price: 30 },
    { id: 3, name: 'Hair Color', subtitle: 'With Furkan Kem', price: 57 },
    { id: 4, name: 'Test', subtitle: 'Furkan Kem', price: 100 },
];

// Right arrow chevron SVG (Fresha design system)
const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path fill="currentColor" d="M9.29 6.71a.996.996 0 0 0 0 1.41L13.17 12l-3.88 3.88a.996.996 0 1 0 1.41 1.41l4.59-4.59a.996.996 0 0 0 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01z" />
    </svg>
);

// Currency icon SVG — el-58 (orijinal HTML'den çıkarıldı)
const CurrencyIcon = () => (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24">
        <path d="M16 3a13 13 0 1 0 13 13A13.013 13.013 0 0 0 16 3m0 24a11 11 0 1 1 11-11 11.01 11.01 0 0 1-11 11m5-8.5a3.5 3.5 0 0 1-3.5 3.5H17v1a1 1 0 0 1-2 0v-1h-2a1 1 0 0 1 0-2h4.5a1.5 1.5 0 1 0 0-3h-3a3.5 3.5 0 1 1 0-7h.5V9a1 1 0 0 1 2 0v1h2a1 1 0 0 1 0 2h-4.5a1.5 1.5 0 1 0 0 3h3a3.5 3.5 0 0 1 3.5 3.5" />
    </svg>
);

// Chevron down SVG — el-64, el-91 (orijinal HTML'den çıkarıldı)
const ChevronDownIcon = ({ size = 20 }) => (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size}>
        <path fillRule="evenodd" d="M9.043 12.293a1 1 0 0 1 1.414 0L16 17.836l5.543-5.543a1 1 0 0 1 1.414 1.414l-6.25 6.25a1 1 0 0 1-1.414 0l-6.25-6.25a1 1 0 0 1 0-1.414" clipRule="evenodd" />
    </svg>
);

// Checkmark component for checked checkbox
const CheckMark = () => (
    <>
        {/* el-67 */}
        <span className="rf-check-mark">
            {/* el-68 */}
            <span className="rf-check-v"></span>
            {/* el-69 */}
            <span className="rf-check-h"></span>
        </span>
    </>
);

// Refund reason options
const REFUND_REASONS = [
    'Choose a reason for refund',
    'Accidental charge',
    'Incorrect amount',
    'Duplicate transaction',
    'Item not available',
    "Client's request",
    'Potential fraud',
    'Other',
];

const RefundModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('item'); // 'item' | 'amount'
    const [selectedItems, setSelectedItems] = useState(new Set([1])); // Item 1 pre-selected
    const [returnToInventory, setReturnToInventory] = useState(false);

    // Refund amount tab state
    const [refundMethod, setRefundMethod] = useState('Other');
    const [refundAmount, setRefundAmount] = useState('');
    const [refundReason, setRefundReason] = useState('');

    const allSelected = selectedItems.size === DUMMY_ITEMS.length;

    const toggleAll = useCallback(() => {
        if (allSelected) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(DUMMY_ITEMS.map(i => i.id)));
        }
    }, [allSelected]);

    const toggleItem = useCallback((id) => {
        setSelectedItems(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const totalToRefund = DUMMY_ITEMS
        .filter(i => selectedItems.has(i.id))
        .reduce((sum, i) => sum + i.price, 0);

    const availableToRefund = 244; // Mock value
    const canIssueRefund = activeTab === 'amount' && refundAmount && parseFloat(refundAmount) > 0 && refundReason;

    return (
        // {/* el-0 */}
        <div className={`rf-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            {/* el-1 */}
            <div className="rf-transform" onClick={e => e.stopPropagation()}>
                {/* el-2 */}
                <div className="rf-scroll">
                    {/* el-3 */}
                    <div className="rf-panel">

                        {/* el-4 */}
                        <div className="rf-header">
                            {/* el-5 */}
                            <div className="rf-header-inner">
                                {/* el-6 */}
                                <div className="rf-header-hidden"></div>

                                {/* el-7 */}
                                <div className="rf-header-title-wrap">
                                    {/* el-8 */}
                                    <span className="rf-header-title">Refund sale</span>
                                </div>

                                {/* el-9 */}
                                <div className="rf-header-actions">
                                    {/* el-10 */}
                                    <div className="rf-btn-group">
                                        {/* el-11 */}
                                        <button className="rf-close-btn" onClick={onClose}>
                                            {/* el-12 */}
                                            <div className="rf-close-btn-inner">
                                                {/* el-13 */}
                                                <span className="rf-close-btn-content">
                                                    {/* el-14 */}
                                                    <span className="rf-close-btn-text">Close</span>
                                                </span>
                                            </div>
                                        </button>

                                        {/* el-15 */}
                                        <button className={`rf-continue-btn ${activeTab === 'amount' && !canIssueRefund ? 'disabled' : ''}`}>
                                            {/* el-16 */}
                                            <div className={`rf-continue-btn-inner ${activeTab === 'amount' && !canIssueRefund ? 'disabled' : ''}`}>
                                                {/* el-17 */}
                                                <span className="rf-continue-btn-content">
                                                    {/* el-18 */}
                                                    <span className="rf-continue-btn-text">
                                                        {activeTab === 'amount' ? 'Issue refund' : 'Continue'}
                                                    </span>
                                                </span>
                                                {activeTab !== 'amount' && (
                                                    /* el-19 */
                                                    <span className="rf-arrow-wrap">
                                                        {/* el-20 */}
                                                        <span className="rf-arrow-icon">
                                                            <span className="rf-rtl-icon">
                                                                <ArrowRightIcon />
                                                            </span>
                                                            <span className="rf-ltr-icon">
                                                                <ArrowRightIcon />
                                                            </span>
                                                        </span>
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* el-27 */}
                                <span className="rf-hidden-span"></span>
                            </div>
                        </div>

                        {/* el-28 */}
                        <div className="rf-content">
                            {/* el-29 */}
                            <div className="rf-offset"></div>

                            {/* el-30 */}
                            <div className="rf-main-grid">
                                {/* el-31 */}
                                <div className="rf-inner-grid">

                                    {/* el-32 */}
                                    <div className="rf-title-section">
                                        {/* el-33 */}
                                        <div className="rf-title-flex">
                                            {/* el-34 */}
                                            <div className="rf-heading-wrap">
                                                {/* el-35 */}
                                                <div className="rf-heading-flex">
                                                    {/* el-36 */}
                                                    <h1 className="rf-h1">Refund sale</h1>
                                                </div>
                                            </div>
                                            {/* el-37 */}
                                            <span className="rf-subtitle-wrap">
                                                {/* el-38 */}
                                                <div className="rf-subtitle-flex">
                                                    {/* el-39 */}
                                                    <p className="rf-sale-info">Sale #2 • Thursday, 19 Feb 2026 • Hasan</p>
                                                    {/* el-40 */}
                                                    <div className="rf-learn-row">
                                                        {/* el-41 */}
                                                        <a className="rf-learn-link" href="#">
                                                            {/* el-42 */}
                                                            <span className="rf-learn-text">Learn more</span>
                                                        </a>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                    </div>

                                    {/* el-43 */}
                                    <div className="rf-content-section">
                                        {/* el-44 */}
                                        <div className="rf-content-inner">

                                            {/* el-45 */}
                                            <div className="rf-tab-switcher">
                                                {/* el-46 */}
                                                <button
                                                    className={`rf-tab-btn ${activeTab === 'item' ? 'active' : ''}`}
                                                    onClick={() => setActiveTab('item')}
                                                >
                                                    {/* el-47 */}
                                                    <p className="rf-tab-text">Refund item</p>
                                                </button>
                                                {/* el-48 */}
                                                <button
                                                    className={`rf-tab-btn ${activeTab === 'amount' ? 'active' : ''}`}
                                                    onClick={() => setActiveTab('amount')}
                                                >
                                                    {/* el-49 */}
                                                    <p className="rf-tab-text">Refund amount</p>
                                                </button>
                                            </div>

                                            {/* === REFUND ITEM TAB CONTENT === */}
                                            {activeTab === 'item' && (
                                                <div className="rf-items-outer">
                                                    <div className="rf-items-wrap">
                                                        <div className="rf-items-grid">

                                                            {/* HEADER ROW */}
                                                            <div className="rf-header-row">
                                                                <label className="rf-check-label header-label">
                                                                    <span className={`rf-checkbox ${allSelected ? 'checked' : ''}`}>
                                                                        {allSelected && <CheckMark />}
                                                                    </span>
                                                                    <div className="rf-label-pad">
                                                                        <p className="rf-all-items-text" style={{ margin: 0 }}></p>
                                                                        <p className="rf-all-items-text">All items</p>
                                                                    </div>
                                                                    <p style={{ margin: 0 }}></p>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="rf-hidden-input"
                                                                        checked={allSelected}
                                                                        onChange={toggleAll}
                                                                    />
                                                                </label>
                                                                <div className="rf-amount-header">
                                                                    <p className="rf-amount-text">Amount</p>
                                                                </div>
                                                            </div>

                                                            <hr className="rf-separator" />

                                                            {DUMMY_ITEMS.map((item) => {
                                                                const isChecked = selectedItems.has(item.id);
                                                                return (
                                                                    <div className="rf-item-row" key={item.id}>
                                                                        <label className="rf-check-label item-label">
                                                                            <span className={`rf-checkbox ${isChecked ? 'checked' : ''}`}>
                                                                                {isChecked && <CheckMark />}
                                                                            </span>
                                                                            <div className="rf-label-pad">
                                                                                <p className="rf-item-name">{item.name}</p>
                                                                                <p className="rf-item-subtitle">{item.subtitle}</p>
                                                                            </div>
                                                                            <input
                                                                                type="checkbox"
                                                                                className="rf-hidden-input"
                                                                                checked={isChecked}
                                                                                onChange={() => toggleItem(item.id)}
                                                                            />
                                                                        </label>
                                                                        <div className="rf-price-wrap">
                                                                            <span className="rf-price-amount">
                                                                                <bdi className="rf-price-bdi">TRY {item.price}</bdi>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}

                                                            <hr className="rf-separator" />

                                                            <div className="rf-totals">
                                                                <div className="rf-tax-row">
                                                                    <p className="rf-tax-label">Tax</p>
                                                                    <p className="rf-tax-value">TRY 0</p>
                                                                </div>
                                                                <div className="rf-total-outer">
                                                                    <div className="rf-total-inner">
                                                                        <p className="rf-total-label">Total to refund</p>
                                                                        <p className="rf-total-value">TRY {totalToRefund}</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <hr className="rf-separator" />

                                                            <div className="rf-inventory-row">
                                                                <label className="rf-inventory-label">
                                                                    <span className="rf-checkbox disabled"></span>
                                                                    <div className="rf-label-pad">
                                                                        <p className="rf-inventory-text">Return items to inventory</p>
                                                                    </div>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="rf-hidden-input"
                                                                        checked={returnToInventory}
                                                                        onChange={() => setReturnToInventory(!returnToInventory)}
                                                                        disabled
                                                                    />
                                                                </label>
                                                            </div>

                                                            <hr className="rf-hidden-sep" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* === REFUND AMOUNT TAB CONTENT (el-42 → el-92) === */}
                                            {activeTab === 'amount' && (
                                                <div className="rfa-outer">
                                                    {/* el-43 */}
                                                    <div className="rfa-grid">
                                                        {/* el-44: ROW 1 (refund method + amount) */}
                                                        <div className="rfa-row1">
                                                            {/* el-45: refund method wrapper (span 6) */}
                                                            <div className="rfa-field-half">
                                                                {/* el-46 */}
                                                                <div className="rfa-field-col">
                                                                    {/* el-47 */}
                                                                    <label className="rfa-label-row">
                                                                        {/* el-48 */}
                                                                        <span className="rfa-label-text">Refund method</span>
                                                                    </label>
                                                                    {/* el-55: dropdown */}
                                                                    <div className="rfa-dropdown">
                                                                        {/* el-56: left icon */}
                                                                        <div className="rfa-dropdown-icon-left">
                                                                            {/* el-57 → el-58,el-59: SVG */}
                                                                            <span className="rfa-icon-wrap">
                                                                                <CurrencyIcon />
                                                                            </span>
                                                                        </div>
                                                                        {/* el-60: selected value */}
                                                                        <div className="rfa-dropdown-value">
                                                                            {/* el-61 */}
                                                                            <span className="rfa-dropdown-text">{refundMethod}</span>
                                                                        </div>
                                                                        {/* el-62: chevron */}
                                                                        <div className="rfa-dropdown-chevron">
                                                                            {/* el-63 → el-64,el-65 */}
                                                                            <span className="rfa-chevron-wrap">
                                                                                <ChevronDownIcon size={20} />
                                                                            </span>
                                                                        </div>
                                                                        {/* Hidden native select for accessibility */}
                                                                        <select
                                                                            className="rfa-hidden-select"
                                                                            value={refundMethod}
                                                                            onChange={e => setRefundMethod(e.target.value)}
                                                                        >
                                                                            <option value=""></option>
                                                                            <option value="Other">Other</option>
                                                                            <option value="Cash">Cash</option>
                                                                        </select>
                                                                    </div>
                                                                    {/* el-66 */}
                                                                    <p className="rfa-helper-text">Original payment method</p>
                                                                </div>
                                                            </div>

                                                            {/* el-67: refund amount wrapper (span 6) */}
                                                            <div className="rfa-field-half">
                                                                {/* el-68 */}
                                                                <div className="rfa-field-top">
                                                                    {/* el-69 */}
                                                                    <label className="rfa-label-text">Refund amount</label>
                                                                </div>
                                                                {/* el-70: input wrapper */}
                                                                <div className="rfa-input-wrap">
                                                                    {/* el-71 */}
                                                                    <div className="rfa-input-prefix">TRY</div>
                                                                    {/* el-72 */}
                                                                    <input
                                                                        className="rfa-input"
                                                                        type="text"
                                                                        placeholder="0,00"
                                                                        value={refundAmount}
                                                                        onChange={e => setRefundAmount(e.target.value)}
                                                                    />
                                                                </div>
                                                                {/* el-73 */}
                                                                <div className="rfa-helper-text">TRY {availableToRefund.toFixed(2)} available to refund</div>
                                                            </div>
                                                        </div>

                                                        {/* el-74: ROW 2 (reason for refund, span 12) */}
                                                        <div className="rfa-row2">
                                                            {/* el-75 */}
                                                            <label className="rfa-label-row">
                                                                {/* el-76 */}
                                                                <span className="rfa-label-text">Reason for refund</span>
                                                            </label>
                                                            {/* el-77: dropdown */}
                                                            <div className="rfa-dropdown rfa-dropdown-full">
                                                                {/* el-78 */}
                                                                <div className="rfa-dropdown-value rfa-dropdown-placeholder">
                                                                    {/* el-79 */}
                                                                    <span className="rfa-dropdown-text">
                                                                        {refundReason || 'Choose a reason for refund'}
                                                                    </span>
                                                                </div>
                                                                {/* el-80: hidden select */}
                                                                <select
                                                                    className="rfa-hidden-select"
                                                                    value={refundReason}
                                                                    onChange={e => setRefundReason(e.target.value)}
                                                                >
                                                                    {REFUND_REASONS.map((r, i) => (
                                                                        <option key={i} value={i === 0 ? '' : r}>{r}</option>
                                                                    ))}
                                                                </select>
                                                                {/* el-89: chevron */}
                                                                <div className="rfa-dropdown-chevron">
                                                                    <span className="rfa-chevron-wrap">
                                                                        <ChevronDownIcon size={20} />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* el-124 */}
                        <div className="rf-empty-div"></div>
                        {/* el-125 */}
                        <span className="rf-hidden-end"></span>

                    </div>
                </div>
            </div>
        </div>
    );
};

const TestPage3 = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="test3-page">
            <button
                className="rf-trigger-btn"
                onClick={() => setIsModalOpen(true)}
            >
                Refund Sale
            </button>

            {/* Modal — her zaman DOM'da, CSS class ile toggle (Animasyon Kuralı #4) */}
            <RefundModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default TestPage3;
