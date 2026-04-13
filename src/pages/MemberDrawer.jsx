import React, { useState, useEffect, useRef } from 'react';
import './MemberDrawer.css';

/* ═══════════════════════════════════════════════════
   SVG Path Constants — exact from extracted_svgs.md
   ═══════════════════════════════════════════════════ */
const SVG_CLOSE_X = "M7.293 7.293a1 1 0 0 1 1.414 0L16 14.586l7.293-7.293a1 1 0 1 1 1.414 1.414L17.414 16l7.293 7.293a1 1 0 0 1-1.414 1.414L16 17.414l-7.293 7.293a1 1 0 0 1-1.414-1.414L14.586 16 7.293 8.707a1 1 0 0 1 0-1.414";
const SVG_CHEVRON_DOWN = "M9.043 12.293a1 1 0 0 1 1.414 0L16 17.836l5.543-5.543a1 1 0 0 1 1.414 1.414l-6.25 6.25a1 1 0 0 1-1.414 0l-6.25-6.25a1 1 0 0 1 0-1.414";
const SVG_INFO_CIRCLE = [
    { d: "M16 5C9.925 5 5 9.925 5 16s4.925 11 11 11 11-4.925 11-11S22.075 5 16 5M3 16C3 8.82 8.82 3 16 3s13 5.82 13 13-5.82 13-13 13S3 23.18 3 16", rule: "evenodd" },
    { d: "M14 15a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v6a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1v-6a1 1 0 0 1-1-1", rule: "evenodd" },
    { d: "M15.75 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3", rule: null }
];
const SVG_DOWN_ARROW = "M15.293 27.707a1 1 0 0 0 1.414 0l9-9a1 1 0 0 0-1.414-1.414L17 24.586V5a1 1 0 1 0-2 0v19.586l-7.293-7.293a1 1 0 0 0-1.414 1.414z";
const SVG_UP_DOWN_ARROWS = "M26.707 10.707a1 1 0 0 1-1.414 0L23 8.414V26a1 1 0 1 1-2 0V8.414l-2.293 2.293a1 1 0 0 1-1.414-1.414l4-4a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414m-12 10.586a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L9 23.586V6a1 1 0 1 1 2 0v17.586l2.293-2.293a1 1 0 0 1 1.414 0";
const SVG_EDIT = "M21 4a2 2 0 0 0-1.422.593l-15 15A1.99 1.99 0 0 0 4 20.998v5.588a2 2 0 0 0 2 2h5.588c.324 0 .537-.058.758-.15.242-.099.462-.244.647-.429l15-15a2 2 0 0 0 0-2.843l-5.571-5.57A2 2 0 0 0 21 4m-4 6L6 21v5.586h5.586l11-11zm1.414-1.414L24 14.172l2.58-2.592-5.585-5.575z";

/* ═══════════════════════════════════════════════════
   Reusable Icon Components
   ═══════════════════════════════════════════════════ */

/* Info circle icon (3-path SVG) — used in el-65/66/67/68 pattern */
function InfoIcon({ className = '' }) {
    return (
        <span className={`md-info-tooltip__icon-wrap ${className}`}>
            <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                {SVG_INFO_CIRCLE.map((p, i) => (
                    <path key={i} d={p.d} fillRule={p.rule || undefined} clipRule={p.rule || undefined} />
                ))}
            </svg>
        </span>
    );
}

/* Badge component — shared by all metric cards */
function Badge({ variant, iconPath, text }) {
    return (
        <div className={`md-badge md-badge--${variant}`}>
            <span className="md-badge__icon-wrap">
                <span className="md-badge__icon">
                    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d={iconPath} fillRule="evenodd" clipRule="evenodd" />
                    </svg>
                </span>
            </span>
            <span className="md-badge__text">{text}</span>
        </div>
    );
}

/* Metric Card — reused for Appointments, Clients, Occupancy, Retention */
function MetricCard({ area, title, value, badgeVariant, badgeIcon, badgeText, changeText }) {
    return (
        <div className={`md-metric-card md-metric-card--${area}`}>
            {/* el-N: relative wrapper */}
            <div className="md-metric-card__relative">
                {/* el-N+1: bg container */}
                <div className="md-metric-card__bg">
                    {/* el-N+2: border overlay */}
                    <div className="md-metric-card__border"></div>
                    {/* el-N+3: content */}
                    <div className="md-metric-card__content">
                        {/* el-N+4: header row */}
                        <div className="md-metric-card__header">
                            <div className="md-metric-card__title-left">
                                <p className="md-card-title">{title}</p>
                                {/* Info tooltip */}
                                <div className="md-info-tooltip" role="tooltip">
                                    <div className="md-info-tooltip__trigger">
                                        <InfoIcon />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Value */}
                        <p className="md-metric-card__value">{value}</p>
                        {/* Change row */}
                        <div className="md-metric-card__change-row">
                            <Badge variant={badgeVariant} iconPath={badgeIcon} text={badgeText} />
                            <p className="md-metric-card__change-text">{changeText}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   Main MemberDrawer Component
   (Uses TestPage drawer infrastructure — no backdrop, 
    CSS class toggle, drawer-fab-strip close button)
   ═══════════════════════════════════════════════════ */
export default function MemberDrawer({ isOpen, onClose, member }) {
    const [mounted, setMounted] = useState(false);
    const [animating, setAnimating] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const memberRef = useRef(member);

    // Keep last valid member data while closing
    if (member) {
        memberRef.current = member;
    }
    const displayMember = member || memberRef.current;

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setAnimating(true));
            });
        } else {
            setAnimating(false);
            const t = setTimeout(() => setMounted(false), 300);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    if (!mounted) return null;

    return (
        <div
            className={`md-root${animating ? ' md-root--open' : ''}`}
            role="dialog"
            tabIndex={-1}
        >
            {/* Floating Action Buttons (same as TestPage drawer-fab-strip) */}
            <div className="md-fab-strip">
                <button className="md-fab" onClick={onClose} aria-label="Close Drawer">
                    <div className="md-fab-inner">
                        <span className="md-fab-icon-wrap">
                            <span className="md-fab-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4Z" />
                                </svg>
                            </span>
                        </span>
                    </div>
                </button>
            </div>

            {/* Main Panel (grid with sidebar + content) */}
            <div className="md-panel">

                {/* el-11: Inner Container */}
                <div className="md-inner">
                    {/* el-12: Main Grid */}
                    <div className={`md-grid${activeTab === 'personal' ? ' md-grid--personal' : ''}`}>

                        {/* ═══════════════════════════════════════════
                                LEFT SIDEBAR (el-272 → el-319)
                                ═══════════════════════════════════════════ */}
                        {/* el-272: Sidebar (sticky, w:320, bg:white, border-right) */}
                        <div className="md-sidebar">
                            {/* el-273: Padding wrapper (padding:32px all, w:319px, h:178px) */}
                            <div className="md-sidebar__profile-wrap">
                                {/* el-274: Flex column (gap:12px, w:255px) */}
                                <div className="md-profile">
                                    {/* el-275: Flex column (w:255px) */}
                                    <div className="md-profile__column">
                                        {/* el-276: Flex ROW (space-between, align:center, gap:16px, w:255px) */}
                                        <div className="md-profile__header">
                                            {/* el-277: Left column (flex-col, align:start, gap:8px, w:~109px) */}
                                            <div className="md-profile__left">
                                                {/* el-278: Name wrapper (flex-col, h:28px) */}
                                                <div className="md-profile__name-wrap">
                                                    {/* el-279: Name text (font:20px/28px, weight:600) */}
                                                    <p className="md-profile__name">{displayMember?.name?.split(' ')[0] || 'Furkan'}</p>
                                                </div>
                                                {/* el-280: Actions button wrapper (h:36px) */}
                                                <div className="md-profile__actions-wrap">
                                                    {/* el-281: Actions Button (inline-flex, rounded, h:36px) */}
                                                    <button type="button" className="md-actions-btn">
                                                        {/* el-282: Actions Inner (flex, bg:white, border, rounded, h:36px) */}
                                                        <div className="md-actions-btn__inner">
                                                            {/* el-283: Label Wrapper (flex, gap:8px) */}
                                                            <span className="md-actions-btn__label">
                                                                {/* el-284: Text ("Actions") */}
                                                                <span className="md-actions-btn__text">Actions</span>
                                                            </span>
                                                            {/* el-285: Chevron icon wrapper */}
                                                            <span className="md-actions-btn__chevron-outer">
                                                                {/* el-286: Chevron icon (flex, relative) */}
                                                                <span className="md-actions-btn__chevron-wrap">
                                                                    {/* el-287/288: SVG + Path */}
                                                                    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d={SVG_CHEVRON_DOWN} fillRule="evenodd" clipRule="evenodd" />
                                                                    </svg>
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                            {/* el-289: Avatar section (flex, padding:8px top/bottom, w:96px) */}
                                            <div className="md-avatar-section">
                                                {/* el-290: Avatar Button (relative, w:96px, h:~98px) */}
                                                <button type="button" className="md-avatar-btn">
                                                    {/* el-291: Avatar Container (inline-block, rounded, w:96px, h:96px) */}
                                                    <div className="md-avatar-container">
                                                        {/* el-292: Avatar Flex (flex, relative, justify:center, w:96px, h:96px) */}
                                                        <div className="md-avatar-flex">
                                                            {/* el-293: Avatar bg (rounded:999px, bg:#ebf8fe, border, blue ring) */}
                                                            <div className="md-avatar-img-wrap">
                                                                {/* el-294: Inner (flex, center, overflow:hidden, rounded, w:94px, h:94px) */}
                                                                <div className="md-avatar-inner">
                                                                    {/* el-295/296: Picture / Img or Initials */}
                                                                    {displayMember?.avatarUrl ? (
                                                                        <picture className="md-avatar-picture">
                                                                            <img
                                                                                className="md-avatar-img"
                                                                                src={displayMember.avatarUrl}
                                                                                alt={`The avatar of ${displayMember?.name || 'user'}`}
                                                                            />
                                                                        </picture>
                                                                    ) : (
                                                                        <div className="md-avatar-initials">
                                                                            {displayMember?.initials || displayMember?.name?.charAt(0) || 'F'}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* el-297: HR Divider (w:319px, h:1px, bg:#e5e5e5) */}
                            <hr className="md-sidebar-divider" />

                            {/* el-298: Nav section wrapper (padding:32px left/right, w:319px, h:224px) */}
                            <div className="md-nav-section">
                                {/* el-299: Nav inner (flex-col, padding:24px top/bottom, w:255px, h:224px) */}
                                <div className="md-nav-inner">
                                    {/* el-300: Nav UL (flex-col, gap:24px, negative margins, padding) */}
                                    <ul className="md-nav-list">
                                        {/* el-301: Nav Item Wrap (li) */}
                                        <li className="md-nav-item-wrap">
                                            {/* el-302: Inner UL (flex-col, gap:0, w:255px) */}
                                            <ul className="md-nav-item-inner">
                                                {/* el-303: Overview - button + span are SIBLINGS */}
                                                <li className={`md-nav-item${activeTab === 'overview' ? ' md-nav-item--active' : ''}`}>
                                                    {/* el-304: Absolute button overlay */}
                                                    <button type="button" className="md-nav-btn" onClick={() => setActiveTab('overview')} />
                                                    {/* el-305/306: Label text */}
                                                    <span className="md-nav-label-wrap">
                                                        <span className="md-nav-label">Overview</span>
                                                    </span>
                                                </li>
                                                {/* el-307: Personal */}
                                                <li className={`md-nav-item${activeTab === 'personal' ? ' md-nav-item--active' : ''}`}>
                                                    <button type="button" className="md-nav-btn" onClick={() => setActiveTab('personal')} />
                                                    <span className="md-nav-label-wrap">
                                                        <span className="md-nav-label">Personal</span>
                                                    </span>
                                                </li>
                                                {/* el-311: Workspace */}
                                                <li className="md-nav-item">
                                                    <button type="button" className="md-nav-btn" />
                                                    <span className="md-nav-label-wrap">
                                                        <span className="md-nav-label">Workspace</span>
                                                    </span>
                                                </li>
                                                {/* el-315: Pay */}
                                                <li className="md-nav-item">
                                                    <button type="button" className="md-nav-btn" />
                                                    <span className="md-nav-label-wrap">
                                                        <span className="md-nav-label">Pay</span>
                                                    </span>
                                                </li>
                                            </ul>
                                            {/* el-319: Hidden divider */}
                                            <div className="md-nav-hidden" aria-hidden="true"></div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* ═══════════════════════════════════════════
                                STICKY HEADER (el-13 → el-22)
                                ═══════════════════════════════════════════ */}
                        {/* el-13: Header BG */}
                        <div className="md-header-bg">
                            <div className="md-header-bg__inner"></div>
                        </div>

                        {/* el-15: Header Overlay */}
                        <div className="md-header-overlay">
                            {/* el-16: Header Flow */}
                            <div className="md-header-flow">
                                {/* el-17: Header Flow Inner */}
                                <div className="md-header-flow__inner">
                                    {/* el-18: Hidden Back */}
                                    <div className="md-header-flow__back"></div>
                                    {/* el-19: Title */}
                                    <div className="md-header-flow__title">
                                        <span className="md-header-flow__title-text">{activeTab === 'personal' ? 'Personal' : 'Overview'}</span>
                                    </div>
                                    {/* el-21: Actions */}
                                    <div className="md-header-flow__actions">
                                        {activeTab === 'personal' ? (
                                            <button type="button" className="md-edit-btn">
                                                <div className="md-edit-btn__inner">
                                                    <span className="md-edit-btn__icon-wrap">
                                                        <span className="md-edit-btn__icon" aria-hidden="true">
                                                            <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                <path d={SVG_EDIT} fillRule="evenodd" clipRule="evenodd" />
                                                            </svg>
                                                        </span>
                                                    </span>
                                                    <span className="md-edit-btn__label-wrap">
                                                        <span className="md-edit-btn__label">Edit</span>
                                                    </span>
                                                </div>
                                            </button>
                                        ) : (
                                            <span className="md-header-flow__action-slot"></span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ═══════════════════════════════════════════
                                TITLE SECTION (el-23 → el-32)
                                ═══════════════════════════════════════════ */}
                        <div className="md-title-section">
                            {/* el-24: Hidden */}
                            <div className="md-title-section__hidden"></div>
                            {/* el-25: Title Padded */}
                            <div className="md-title-padded">
                                {/* el-26: Title Grid */}
                                <div className="md-title-grid">
                                    {/* el-27: Action slot / Edit button */}
                                    <div className="md-title-action">
                                        {activeTab === 'personal' && (
                                            <button type="button" className="md-edit-btn">
                                                <div className="md-edit-btn__inner">
                                                    <span className="md-edit-btn__icon-wrap">
                                                        <span className="md-edit-btn__icon" aria-hidden="true">
                                                            <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                <path d={SVG_EDIT} fillRule="evenodd" clipRule="evenodd" />
                                                            </svg>
                                                        </span>
                                                    </span>
                                                    <span className="md-edit-btn__label-wrap">
                                                        <span className="md-edit-btn__label">Edit</span>
                                                    </span>
                                                </div>
                                            </button>
                                        )}
                                    </div>
                                    {/* el-28: Title Text Area */}
                                    <div className="md-title-text-area">
                                        {/* el-29: Hidden */}
                                        <div className="md-title-text-area__hidden"></div>
                                        {/* el-30: Title Text Row */}
                                        <div className="md-title-text-row">
                                            {/* el-31: H1 */}
                                            <h1 className="md-title-h1">{activeTab === 'personal' ? 'Personal' : 'Overview'}</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* el-32: Bottom Spacer */}
                            <div className="md-title-bottom"></div>
                        </div>

                        {/* ═══════════════════════════════════════════
                                BODY SECTION (el-33 → el-271)
                                ═══════════════════════════════════════════ */}
                        <div className="md-body">
                            {activeTab === 'personal' ? (
                                /* ═══════════════════════════ PERSONAL TAB ═══════════════════════════ */
                                <div id="personal" className="md-pt-body">
                                    {/* ── Profile Section ── */}
                                    <div className="md-pt-section">
                                        {/* Section Header */}
                                        <div className="md-pt-section-header">
                                            <div className="md-pt-section-header__col">
                                                <div className="md-pt-section-header__row">
                                                    <h3 className="md-pt-section-title">Profile</h3>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Fields Grid */}
                                        <div className="md-pt-fields-wrapper">
                                            <div className="md-pt-grid">
                                                {/* Full name */}
                                                <div className="md-pt-field">
                                                    <div className="md-pt-field__inner">
                                                        <p className="md-pt-field__label">Full name</p>
                                                        <p className="md-pt-field__value">{displayMember.firstName} {displayMember.lastName || 'Kem'}</p>
                                                    </div>
                                                </div>
                                                {/* Email */}
                                                <div className="md-pt-field">
                                                    <div className="md-pt-field__inner">
                                                        <p className="md-pt-field__label">Email</p>
                                                        <p className="md-pt-field__value">{displayMember.email || 'furkankem89@gmail.com'}</p>
                                                    </div>
                                                </div>
                                                {/* Phone number */}
                                                <div className="md-pt-field">
                                                    <div className="md-pt-field__inner">
                                                        <p className="md-pt-field__label">Phone number</p>
                                                        <p className="md-pt-field__value">{displayMember.phone || '+90 553 570 80 70'}</p>
                                                    </div>
                                                </div>
                                                {/* Date of birth */}
                                                <div className="md-pt-field">
                                                    <div className="md-pt-field__inner">
                                                        <p className="md-pt-field__label">Date of birth</p>
                                                        <p className="md-pt-field__value">-</p>
                                                    </div>
                                                </div>
                                                {/* Country */}
                                                <div className="md-pt-field">
                                                    <div className="md-pt-field__inner">
                                                        <p className="md-pt-field__label">Country</p>
                                                        <p className="md-pt-field__value">-</p>
                                                    </div>
                                                </div>
                                                {/* Calendar color */}
                                                <div className="md-pt-field">
                                                    <div className="md-pt-field__inner">
                                                        <p className="md-pt-field__label">Calendar color</p>
                                                        <p className="md-pt-field__value">
                                                            <span className="md-pt-color-row">
                                                                <span className="md-pt-color-dot" style={{ backgroundColor: 'rgb(165, 223, 248)' }}></span>
                                                                <span className="md-pt-color-text">Blue</span>
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* Job title */}
                                                <div className="md-pt-field">
                                                    <div className="md-pt-field__inner">
                                                        <p className="md-pt-field__label">Job title</p>
                                                        <p className="md-pt-field__value">-</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <hr className="md-pt-divider" />

                                    {/* ── Work details Section ── */}
                                    <div className="md-pt-section">
                                        {/* Section Header */}
                                        <div className="md-pt-section-header">
                                            <div className="md-pt-section-header__col">
                                                <div className="md-pt-section-header__row">
                                                    <h3 className="md-pt-section-title">Work details</h3>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Fields Grid */}
                                        <div className="md-pt-fields-wrapper">
                                            <div className="md-pt-grid">
                                                {/* Employment */}
                                                <div className="md-pt-field">
                                                    <div className="md-pt-field__inner">
                                                        <p className="md-pt-field__label">Employment</p>
                                                        <p className="md-pt-field__value">February 17th, 2026 - present</p>
                                                    </div>
                                                </div>
                                                {/* Employment type */}
                                                <div className="md-pt-field">
                                                    <div className="md-pt-field__inner">
                                                        <p className="md-pt-field__label">Employment type</p>
                                                        <p className="md-pt-field__value">-</p>
                                                    </div>
                                                </div>
                                                {/* Team member ID */}
                                                <div className="md-pt-field">
                                                    <div className="md-pt-field__inner">
                                                        <p className="md-pt-field__label">Team member ID</p>
                                                        <p className="md-pt-field__value">-</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="md-body__container">
                                    <div className="md-body__column">
                                        <div className="md-body__inner-column">
                                            {/* ── el-37: Dashboard Header ── */}
                                            <div className="md-dashboard-header">
                                                {/* el-38: Title Group */}
                                                <div className="md-dashboard-title-group">
                                                    {/* el-39 */}
                                                    <p className="md-dashboard-title">Performance dashboard</p>
                                                    {/* el-40 */}
                                                    <a href="#" className="md-dashboard-link">View full dashboard</a>
                                                </div>
                                                {/* el-41: Dropdown Wrap */}
                                                <div className="md-dropdown-wrap">
                                                    {/* el-42: Dropdown Button */}
                                                    <button type="button" className="md-dropdown-btn">
                                                        {/* el-43: Dropdown Inner */}
                                                        <div className="md-dropdown-btn__inner">
                                                            {/* el-44: Label Wrapper */}
                                                            <span className="md-dropdown-btn__label">
                                                                {/* el-45: Text */}
                                                                <span className="md-dropdown-btn__text">Week to date</span>
                                                            </span>
                                                            {/* el-46: Chevron Wrap */}
                                                            <span className="md-dropdown-btn__chevron-wrap">
                                                                {/* el-47: Chevron Icon */}
                                                                <span className="md-dropdown-btn__chevron" aria-hidden="true">
                                                                    {/* el-48/49: SVG */}
                                                                    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d={SVG_CHEVRON_DOWN} fillRule="evenodd" clipRule="evenodd" />
                                                                    </svg>
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* ── el-50: Cards Section ── */}
                                            <div className="md-cards-section">
                                                {/* el-51 */}
                                                <div className="md-cards-section__inner">
                                                    {/* el-52: Cards Grid */}
                                                    <div className="md-cards-grid">

                                                        {/* ═══════════════════════════════════════
                                                            Sales Card (el-53 → el-77 + chart)
                                                            ═══════════════════════════════════════ */}
                                                        <div className="md-sales-card">
                                                            <div className="md-sales-card__relative">
                                                                <div className="md-sales-card__bg">
                                                                    <div className="md-sales-card__border"></div>
                                                                    <div className="md-sales-card__content">
                                                                        {/* Header */}
                                                                        <div className="md-sales-card__header">
                                                                            <div className="md-sales-card__title-group">
                                                                                {/* Title row */}
                                                                                <div className="md-sales-card__title-row">
                                                                                    <div className="md-sales-card__title-left">
                                                                                        <p className="md-card-title">Sales</p>
                                                                                        <div className="md-info-tooltip" role="tooltip">
                                                                                            <div className="md-info-tooltip__trigger">
                                                                                                <InfoIcon />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                {/* Value row */}
                                                                                <div className="md-sales-card__value-row">
                                                                                    <p className="md-sales-card__value">TRY 403.00</p>
                                                                                    <Badge variant="green" iconPath={SVG_DOWN_ARROW} text="+7.6%" />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {/* Chart Area */}
                                                                        <div className="md-chart-area">
                                                                            <div className="md-chart-wrapper">
                                                                                <svg className="recharts-surface" width="368" height="220" viewBox="0 0 368 220">
                                                                                    <title></title>
                                                                                    <desc></desc>
                                                                                    <defs>
                                                                                        <clipPath id="recharts-clip">
                                                                                            <rect x="71.677" y="5" height="180" width="291.323" />
                                                                                        </clipPath>
                                                                                    </defs>
                                                                                    {/* Cartesian Grid */}
                                                                                    <g className="recharts-cartesian-grid">
                                                                                        <g className="recharts-cartesian-grid-horizontal">
                                                                                            {[185, 140, 95, 50, 5].map(y => (
                                                                                                <line key={y} className="md-chart-grid-line" x1="71.677" y1={y} x2="363" y2={y} />
                                                                                            ))}
                                                                                        </g>
                                                                                    </g>
                                                                                    {/* X-Axis */}
                                                                                    <g className="recharts-layer recharts-cartesian-axis recharts-xAxis xAxis">
                                                                                        <line className="md-chart-xaxis-line" x1="71.677" y1="185" x2="363" y2="185" />
                                                                                        <g className="recharts-cartesian-axis-ticks">
                                                                                            {[
                                                                                                { x: 95.95, label: 'Feb 16' },
                                                                                                { x: 144.51, label: 'Feb 17' },
                                                                                                { x: 193.06, label: 'Feb 18' },
                                                                                                { x: 241.62, label: 'Feb 19' },
                                                                                                { x: 290.17, label: 'Feb 20' },
                                                                                                { x: 338.72, label: 'Feb 21' },
                                                                                            ].map(tick => (
                                                                                                <g key={tick.label} className="recharts-layer recharts-cartesian-axis-tick">
                                                                                                    <g transform={`translate(${tick.x},203)`}>
                                                                                                        <foreignObject x="-24.277" y="-7" height="20" width="48.554">
                                                                                                            <p className="md-chart-xaxis-label">{tick.label}</p>
                                                                                                        </foreignObject>
                                                                                                    </g>
                                                                                                </g>
                                                                                            ))}
                                                                                        </g>
                                                                                    </g>
                                                                                    {/* Y-Axis */}
                                                                                    <g className="recharts-layer recharts-cartesian-axis recharts-yAxis yAxis">
                                                                                        <g className="recharts-cartesian-axis-ticks">
                                                                                            {[
                                                                                                { y: 185, label: 'TRY 0' },
                                                                                                { y: 140, label: 'TRY 75' },
                                                                                                { y: 95, label: 'TRY 150' },
                                                                                                { y: 50, label: 'TRY 225' },
                                                                                                { y: 9.28, label: 'TRY 300' },
                                                                                            ].map(tick => (
                                                                                                <g key={tick.label} className="recharts-layer recharts-cartesian-axis-tick">
                                                                                                    <text
                                                                                                        className="md-chart-yaxis-text recharts-text recharts-cartesian-axis-tick-value"
                                                                                                        x="50.677"
                                                                                                        y={tick.y}
                                                                                                        textAnchor="end"
                                                                                                        fontSize="13"
                                                                                                        stroke="none"
                                                                                                        fill="rgb(143, 143, 143)"
                                                                                                    >
                                                                                                        <tspan x="50.677" dy="0.355em">{tick.label}</tspan>
                                                                                                    </text>
                                                                                                </g>
                                                                                            ))}
                                                                                        </g>
                                                                                    </g>
                                                                                    {/* Bars */}
                                                                                    <g className="recharts-layer recharts-bar">
                                                                                        <g className="recharts-layer recharts-bar-rectangles">
                                                                                            {/* Feb 16 — empty */}
                                                                                            <g className="recharts-layer recharts-bar-rectangle" role="img"></g>
                                                                                            {/* Feb 17 — small bar */}
                                                                                            <g className="recharts-layer recharts-bar-rectangle" role="img">
                                                                                                <path
                                                                                                    name="Feb 17"
                                                                                                    className="md-chart-bar recharts-rectangle"
                                                                                                    d="M129.231,154.8A 4,4,0,0,1,133.231,150.8L 138.231,150.8A 4,4,0,0,1,142.231,154.8L 142.231,185L 129.231,185Z"
                                                                                                />
                                                                                            </g>
                                                                                            {/* Feb 18 — empty */}
                                                                                            <g className="recharts-layer recharts-bar-rectangle" role="img"></g>
                                                                                            {/* Feb 19 — tall bar */}
                                                                                            <g className="recharts-layer recharts-bar-rectangle" role="img">
                                                                                                <path
                                                                                                    name="Feb 19"
                                                                                                    className="md-chart-bar recharts-rectangle"
                                                                                                    d="M226.338,15.6A 4,4,0,0,1,230.338,11.6L 235.338,11.6A 4,4,0,0,1,239.338,15.6L 239.338,185L 226.338,185Z"
                                                                                                />
                                                                                            </g>
                                                                                            {/* Feb 20 — small bar */}
                                                                                            <g className="recharts-layer recharts-bar-rectangle" role="img">
                                                                                                <path
                                                                                                    name="Feb 20"
                                                                                                    className="md-chart-bar recharts-rectangle"
                                                                                                    d="M274.892,154.8A 4,4,0,0,1,278.892,150.8L 283.892,150.8A 4,4,0,0,1,287.892,154.8L 287.892,185L 274.892,185Z"
                                                                                                />
                                                                                            </g>
                                                                                            {/* Feb 21 — empty */}
                                                                                            <g className="recharts-layer recharts-bar-rectangle" role="img"></g>
                                                                                        </g>
                                                                                    </g>
                                                                                    {/* Second bar group (refund — all empty) */}
                                                                                    <g className="recharts-layer recharts-bar">
                                                                                        <g className="recharts-layer recharts-bar-rectangles">
                                                                                            <g className="recharts-layer recharts-bar-rectangle" role="img"></g>
                                                                                            <g className="recharts-layer recharts-bar-rectangle" role="img"></g>
                                                                                            <g className="recharts-layer recharts-bar-rectangle" role="img"></g>
                                                                                            <g className="recharts-layer recharts-bar-rectangle" role="img"></g>
                                                                                            <g className="recharts-layer recharts-bar-rectangle" role="img"></g>
                                                                                            <g className="recharts-layer recharts-bar-rectangle" role="img"></g>
                                                                                        </g>
                                                                                    </g>
                                                                                </svg>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* ═══════════════════════════════════════
                                                            Appointments Card (el-164 → el-190)
                                                            ═══════════════════════════════════════ */}
                                                        <MetricCard
                                                            area="B"
                                                            title="Appointments"
                                                            value="4"
                                                            badgeVariant="red"
                                                            badgeIcon={SVG_DOWN_ARROW}
                                                            badgeText="-100%"
                                                            changeText="vs prev. period"
                                                        />

                                                        {/* ═══════════════════════════════════════
                                                            Clients Card (el-191 → el-217)
                                                            ═══════════════════════════════════════ */}
                                                        <MetricCard
                                                            area="C"
                                                            title="Clients"
                                                            value="3"
                                                            badgeVariant="red"
                                                            badgeIcon={SVG_DOWN_ARROW}
                                                            badgeText="-100%"
                                                            changeText="vs prev. period"
                                                        />

                                                        {/* ═══════════════════════════════════════
                                                            Occupancy Card (el-218 → el-244)
                                                            ═══════════════════════════════════════ */}
                                                        <MetricCard
                                                            area="D"
                                                            title="Occupancy"
                                                            value="8.6%"
                                                            badgeVariant="red"
                                                            badgeIcon={SVG_DOWN_ARROW}
                                                            badgeText="-91.4%"
                                                            changeText="vs prev. period"
                                                        />

                                                        {/* ═══════════════════════════════════════
                                                            Retention Card (el-245 → el-271)
                                                            ═══════════════════════════════════════ */}
                                                        <MetricCard
                                                            area="E"
                                                            title="Retention"
                                                            value="0%"
                                                            badgeVariant="neutral"
                                                            badgeIcon={SVG_UP_DOWN_ARROWS}
                                                            badgeText="0%"
                                                            changeText="vs prev. period"
                                                        />

                                                    </div>
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
    );
}
