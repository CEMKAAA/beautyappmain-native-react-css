import React, { useState, useEffect, useCallback } from 'react';
import './TestPage9.css';
import AppointmentsPanel from '../components/AppointmentsPanel';
import SalesPanel from '../components/SalesPanel';
import ItemsPanel from '../components/ItemsPanel';

/* ═══════════════════════════════════════════════════════════
   SVG Icons — Exact paths from computed-styles.json
   ═══════════════════════════════════════════════════════════ */

/* el-10: Close X icon (viewBox 0 0 32 32) */
const SVG_CLOSE = "M7.293 7.293a1 1 0 0 1 1.414 0L16 14.586l7.293-7.293a1 1 0 1 1 1.414 1.414L17.414 16l7.293 7.293a1 1 0 0 1-1.414 1.414L16 17.414l-7.293 7.293a1 1 0 0 1-1.414-1.414L14.586 16 7.293 8.707a1 1 0 0 1 0-1.414";

/* el-33: Chevron down (viewBox 0 0 32 32) */
const SVG_CHEVRON_DOWN = "M9.043 12.293a1 1 0 0 1 1.414 0L16 17.836l5.543-5.543a1 1 0 0 1 1.414 1.414l-6.25 6.25a1 1 0 0 1-1.414 0l-6.25-6.25a1 1 0 0 1 0-1.414";

/* el-48: Pronouns icon — gender symbol (viewBox 0 0 32 32) */
const SVG_PRONOUN = "M26 3h-5a1 1 0 1 0 0 2h2.586l-3.143 3.144A8 8 0 1 0 14 21.935V24h-3a1 1 0 0 0 0 2h3v3a1 1 0 0 0 2 0v-3h3a1 1 0 0 0 0-2h-3v-2.065a7.99 7.99 0 0 0 5.73-12.25L25 6.414V9a1 1 0 0 0 2 0V4a1 1 0 0 0-1-1M15 20a6 6 0 1 1 6-6 6.006 6.006 0 0 1-6 6";

/* el-65/66: Person + plus icon (viewBox 0 0 32 32, two paths) */
const SVG_PERSON_PLUS_PART1 = "M5 12.5a8.5 8.5 0 1 1 13.006 7.209c2.671.874 4.964 2.512 6.76 4.648a1 1 0 1 1-1.531 1.286C20.835 22.79 17.48 21 13.5 21s-7.335 1.79-9.734 4.643a1 1 0 1 1-1.531-1.286c1.795-2.136 4.088-3.774 6.759-4.648A8.5 8.5 0 0 1 5 12.5M13.5 6a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13";
const SVG_PERSON_PLUS_PART2 = "M29 14a1 1 0 1 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0-2h-2z";

/* Cake icon (viewBox 0 0 32 32) — el-56 */
const SVG_CAKE = "M16.655.244c-.37-.32-.92-.325-1.296-.011l-.002.001-.006.005a6 6 0 0 0-.275.245c-.167.154-.396.374-.65.645-.498.531-1.134 1.3-1.57 2.174-.43.86-.746 1.984-.324 3.11C12.9 7.394 13.74 8.15 15 8.69V10H6.252a3.99 3.99 0 0 0-4.002 4.002v1.66A5.4 5.4 0 0 0 4 19.63V26a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2v-6.371a5.4 5.4 0 0 0 1.75-3.967v-1.66A3.99 3.99 0 0 0 25.748 10H17V8.68c1.22-.546 2.026-1.305 2.377-2.278.402-1.114.103-2.227-.31-3.086-.42-.872-1.032-1.64-1.512-2.173a13 13 0 0 0-.876-.877L16.663.25l-.005-.004zm-.662 6.691c1.037-.418 1.385-.886 1.503-1.212.139-.386.077-.898-.231-1.54-.303-.627-.774-1.233-1.195-1.7l-.084-.092-.1.105c-.44.469-.928 1.075-1.242 1.701-.32.64-.379 1.141-.239 1.514.121.323.487.8 1.588 1.224M6.25 12h-.004a1.99 1.99 0 0 0-1.996 1.996v1.666c0 1.855 1.517 3.376 3.317 3.338a3.25 3.25 0 0 0 3.183-3.25 1 1 0 0 1 2 0 3.25 3.25 0 0 0 6.5 0 1 1 0 0 1 2 0A3.25 3.25 0 0 0 24.433 19c1.8.038 3.317-1.483 3.317-3.338v-1.666A1.99 1.99 0 0 0 25.754 12H6.25m14 6.833A5.25 5.25 0 0 1 16 21a5.25 5.25 0 0 1-4.25-2.167A5.25 5.25 0 0 1 6 20.778V26h20v-5.222a5.1 5.1 0 0 1-1.608.222 5.25 5.25 0 0 1-4.142-2.167";

/* Info circle icon (viewBox 0 0 32 32) — 3 paths from JSON el-174/175/176 */
const SVG_INFO_CIRCLE = "M16 5C9.925 5 5 9.925 5 16s4.925 11 11 11 11-4.925 11-11S22.075 5 16 5M3 16C3 8.82 8.82 3 16 3s13 5.82 13 13-5.82 13-13 13S3 23.18 3 16";
const SVG_INFO_I = "M14 15a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v6a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1v-6a1 1 0 0 1-1-1";
const SVG_INFO_DOT = "M15.75 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3";


/* ═══════════════════════════════════════════════════════════
   NAV MENU CONFIG
   ═══════════════════════════════════════════════════════════ */
const MENU_ITEMS = [
    { id: 'overview', label: 'Overview' },
    { id: 'appointments', label: 'Appointments', badge: 2 },
    { id: 'sales', label: 'Sales', badge: 1 },
    { id: 'client-details', label: 'Client details' },
    { id: 'items', label: 'Items', badge: 4 },
    { id: 'documents', label: 'Documents', hasSubmenu: true },
    { id: 'wallet', label: 'Wallet' },
    { id: 'loyalty', label: 'Loyalty' },
    { id: 'reviews', label: 'Reviews' },
];


/* ═══════════════════════════════════════════════════════════
   ClientDetailsDrawer Component
   ═══════════════════════════════════════════════════════════ */
export default function ClientDetailsDrawer({ isOpen, onClose, client }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimatingIn, setIsAnimatingIn] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [expandedMenus, setExpandedMenus] = useState({});

    /* ── Open / Close animation ── */
    useEffect(() => {
        if (isOpen) {
            // Mount first, then trigger CSS transition on next frame
            setIsVisible(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsAnimatingIn(true);
                });
            });
        } else if (isVisible) {
            // Trigger closing animation
            setIsAnimatingIn(false);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 300); // match transition duration
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleClose = useCallback(() => {
        setIsAnimatingIn(false);
        setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, 300);
    }, [onClose]);

    const handleBackdropClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    }, [handleClose]);

    const toggleSubmenu = (id) => {
        setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (!isVisible) return null;

    const name = client?.name || 'Unknown';
    const email = client?.email || '';
    const initials = name.charAt(0).toUpperCase();

    return (
        <>
            {/* ── BACKDROP ── */}
            <div
                className={`cd-backdrop ${isAnimatingIn ? 'cd-backdrop--visible' : ''}`}
                onClick={handleBackdropClick}
            />

            {/* ── DIALOG (el-0) ── */}
            <div
                className={`cd-dialog ${isAnimatingIn ? 'cd-dialog--open' : ''}`}
                role="dialog"
                tabIndex={-1}
            >
                {/* ── GRID SHELL (el-1) ── */}
                <div className="cd-grid">

                    {/* ── CLOSE BUTTON (el-2 → el-10) ── */}
                    <div className="cd-close-wrap">
                        <button className="cd-close-btn" onClick={handleClose} aria-label="Close drawer">
                            <div className="cd-close-btn__inner">
                                <span className="cd-sr-only">Close Drawer</span>
                                <span className="cd-action-btn__icon">
                                    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d={SVG_CLOSE} fillRule="evenodd" clipRule="evenodd" />
                                    </svg>
                                </span>
                            </div>
                        </button>
                    </div>

                    {/* ══════════════════════════════════
              SECONDARY PANEL (el-11)
              546px = 330px profile + 216px menu
              ══════════════════════════════════ */}
                    <div className="cd-secondary">
                        <div className="cd-sec-grid">

                            {/* ── HEADER AREA (el-13) ── 
                  Sticky, 330px, avatar + name + email + actions */}
                            <div className="cd-header-area">
                                <div className="cd-header-area__inner">
                                    <div className="cd-profile">

                                        {/* Avatar + Name + Email block (el-16) */}
                                        <div className="cd-avatar-wrap">
                                            <div className="cd-avatar-stack">
                                                <div className="cd-avatar">
                                                    <div className="cd-avatar__inner">
                                                        <span className="cd-avatar__initials">{initials}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="cd-client-name">{name}</p>
                                            <div className="cd-email-wrap">
                                                <button className="cd-email-btn">{email}</button>
                                            </div>
                                            <div className="cd-tags-row" />
                                        </div>

                                        {/* Action buttons (el-26) */}
                                        <div className="cd-actions">
                                            {/* "Actions" dropdown */}
                                            <button className="cd-action-btn">
                                                <div className="cd-action-btn__inner">
                                                    <span className="cd-action-btn__label">
                                                        <span className="cd-action-btn__text">Actions</span>
                                                        <span className="cd-action-btn__icon">
                                                            <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                <path d={SVG_CHEVRON_DOWN} fillRule="evenodd" clipRule="evenodd" />
                                                            </svg>
                                                        </span>
                                                    </span>
                                                </div>
                                            </button>

                                            {/* el-36 wrapper → "Book now" button */}
                                            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                                <button className="cd-action-btn">
                                                    <div className="cd-action-btn__inner cd-action-btn__inner--dark">
                                                        <span className="cd-action-btn__label">
                                                            <span className="cd-action-btn__text">Book now</span>
                                                        </span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {/* ── TITLE AREA (el-41) — Divider ── */}
                            <div className="cd-title-area">
                                <hr />
                            </div>

                            {/* ── BODY AREA (el-42) — Info rows ── */}
                            <div className="cd-body-area">

                                {/* Info section with icon rows (el-44) — gap 16px */}
                                <div className="cd-info-section cd-info-section--spaced">

                                    {/* el-45: Add pronouns */}
                                    <div className="cd-info-item">
                                        <span className="cd-info-item__icon">
                                            <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d={SVG_PRONOUN} fillRule="evenodd" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                        <button className="cd-info-item__link">Add pronouns</button>
                                    </div>

                                    {/* el-53: Add date of birth */}
                                    <div className="cd-info-item">
                                        <span className="cd-info-item__icon">
                                            <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d={SVG_CAKE} fillRule="evenodd" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                        <button className="cd-info-item__link">Add date of birth</button>
                                    </div>

                                    {/* el-61: Created date with person+ icon */}
                                    <div className="cd-info-item">
                                        <span className="cd-info-item__icon">
                                            <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d={SVG_PERSON_PLUS_PART1} fillRule="evenodd" clipRule="evenodd" />
                                                <path d={SVG_PERSON_PLUS_PART2} />
                                            </svg>
                                        </span>
                                        <p className="cd-info-item__text">Created {client?.createdDate || 'Feb 2025'}</p>
                                    </div>

                                </div>

                            </div>

                            {/* ══════════════════════════════════
                  MENU AREA (el-69)
                  216px, full height, border-left 12px
                  ══════════════════════════════════ */}
                            <div className="cd-menu-area">
                                <ul className="cd-menu-list" role="tablist">
                                    <li className="cd-menu-group">
                                        <ul className="cd-menu-group__list">
                                            {MENU_ITEMS.map((item) => (
                                                <React.Fragment key={item.id}>
                                                    <li
                                                        className={`cd-menu-item ${activeTab === item.id ? 'cd-menu-item--active' : ''}`}
                                                        onClick={() => {
                                                            setActiveTab(item.id);
                                                            if (item.hasSubmenu) toggleSubmenu(item.id);
                                                        }}
                                                    >
                                                        <button className="cd-menu-item__btn" tabIndex={0} />
                                                        <div className="cd-menu-item__content">
                                                            <span className="cd-menu-item__text">
                                                                <p className="cd-menu-item__label">{item.label}</p>
                                                            </span>
                                                        </div>
                                                        {item.badge != null && (
                                                            <div className="cd-menu-item__badge">
                                                                <span className="cd-menu-item__badge-text">{item.badge}</span>
                                                            </div>
                                                        )}
                                                        {item.hasSubmenu && (
                                                            <span className={`cd-menu-item__chevron ${expandedMenus[item.id] ? 'cd-menu-item__chevron--open' : ''}`}>
                                                                <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d={SVG_CHEVRON_DOWN} fillRule="evenodd" clipRule="evenodd" />
                                                                </svg>
                                                            </span>
                                                        )}
                                                    </li>
                                                    {item.hasSubmenu && (
                                                        <ul className={`cd-submenu ${expandedMenus[item.id] ? 'cd-submenu--open' : ''}`}>
                                                            {/* Sub-items would go here */}
                                                        </ul>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </ul>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>

                    {/* ══════════════════════════════════
              PRIMARY PANEL (el-141)
              480px, bg #f9f9f9
              ══════════════════════════════════ */}
                    <div className="cd-primary">
                        {activeTab === 'appointments' ? (
                            <AppointmentsPanel />
                        ) : activeTab === 'sales' ? (
                            <SalesPanel />
                        ) : activeTab === 'items' ? (
                            <ItemsPanel />
                        ) : (
                            <div className="cd-primary__scroll">

                                {/* Sticky header */}
                                <div className="cd-primary__header">
                                    <div className="cd-primary__header-inner">
                                        <div className="cd-primary__header-grid">
                                            <div className="cd-primary__title-slot">
                                                <h1 className="cd-primary__title">{MENU_ITEMS.find(m => m.id === activeTab)?.label || 'Overview'}</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Body content */}
                                <div className="cd-primary__body">
                                    <div className="cd-primary__content">

                                        {/* ── Wallet section ── */}
                                        <div className="cd-section">
                                            <div className="cd-section__header">
                                                <h3 className="cd-section__title">Wallet</h3>
                                                <a className="cd-section__link" href="#wallet">View wallet</a>
                                            </div>
                                            <div className="cd-card">
                                                <div className="cd-card__inner">
                                                    <div className="cd-card__border" />
                                                    <div className="cd-card__content">
                                                        <div className="cd-card__body">
                                                            <div className="cd-card__label-row">
                                                                <p className="cd-card__label">Balance</p>
                                                                <div className="cd-card__info-icon" role="tooltip">
                                                                    <div className="cd-card__info-icon-inner">
                                                                        <span aria-hidden="true" className="cd-card__info-icon-span">
                                                                            <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d={SVG_INFO_CIRCLE} fillRule="evenodd" clipRule="evenodd" />
                                                                                <path d={SVG_INFO_I} fillRule="evenodd" clipRule="evenodd" />
                                                                                <path d={SVG_INFO_DOT} />
                                                                            </svg>
                                                                        </span>
                                                                    </div>
                                                                    <span className="cd-tooltip">Overall balance of client's wallet</span>
                                                                </div>
                                                            </div>
                                                            <div className="cd-card__value-row">
                                                                <p className="cd-card__value">TRY 0</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── Summary section ── */}
                                        <div className="cd-section">
                                            <p className="cd-section__title">Summary</p>

                                            {/* Total sales card (full width) */}
                                            <div className="cd-card">
                                                <div className="cd-card__inner">
                                                    <div className="cd-card__border" />
                                                    <div className="cd-card__content">
                                                        <div className="cd-card__body">
                                                            <div className="cd-card__label-row">
                                                                <p className="cd-card__label">Total sales</p>
                                                                <div className="cd-card__info-icon" role="tooltip">
                                                                    <div className="cd-card__info-icon-inner">
                                                                        <span aria-hidden="true" className="cd-card__info-icon-span">
                                                                            <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d={SVG_INFO_CIRCLE} fillRule="evenodd" clipRule="evenodd" />
                                                                                <path d={SVG_INFO_I} fillRule="evenodd" clipRule="evenodd" />
                                                                                <path d={SVG_INFO_DOT} />
                                                                            </svg>
                                                                        </span>
                                                                    </div>
                                                                    <span className="cd-tooltip">Total of all completed sales</span>
                                                                </div>
                                                            </div>
                                                            <div className="cd-card__value-row">
                                                                <p className="cd-card__value">TRY 244</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Row 1: Appointments + Rating (el-198) */}
                                            <div className="cd-stat-grid">
                                                {/* Appointments */}
                                                <div className="cd-stat-grid__cell">
                                                    <div className="cd-card">
                                                        <div className="cd-card__inner">
                                                            <div className="cd-card__border" />
                                                            <div className="cd-card__content">
                                                                <div className="cd-card__body">
                                                                    <div className="cd-card__label-row">
                                                                        <p className="cd-card__label">Appointments</p>
                                                                        <div className="cd-card__info-icon" role="tooltip">
                                                                            <div className="cd-card__info-icon-inner">
                                                                                <span aria-hidden="true" className="cd-card__info-icon-span">
                                                                                    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d={SVG_INFO_CIRCLE} fillRule="evenodd" clipRule="evenodd" />
                                                                                        <path d={SVG_INFO_I} fillRule="evenodd" clipRule="evenodd" />
                                                                                        <path d={SVG_INFO_DOT} />
                                                                                    </svg>
                                                                                </span>
                                                                            </div>
                                                                            <span className="cd-tooltip">Total completed appointments</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="cd-card__value-row">
                                                                        <p className="cd-card__value">2</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Rating */}
                                                <div className="cd-stat-grid__cell">
                                                    <div className="cd-card">
                                                        <div className="cd-card__inner">
                                                            <div className="cd-card__border" />
                                                            <div className="cd-card__content">
                                                                <div className="cd-card__body">
                                                                    <div className="cd-card__label-row">
                                                                        <p className="cd-card__label">Rating</p>
                                                                        <div className="cd-card__info-icon" role="tooltip">
                                                                            <div className="cd-card__info-icon-inner">
                                                                                <span aria-hidden="true" className="cd-card__info-icon-span">
                                                                                    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d={SVG_INFO_CIRCLE} fillRule="evenodd" clipRule="evenodd" />
                                                                                        <path d={SVG_INFO_I} fillRule="evenodd" clipRule="evenodd" />
                                                                                        <path d={SVG_INFO_DOT} />
                                                                                    </svg>
                                                                                </span>
                                                                            </div>
                                                                            <span className="cd-tooltip">Average customer rating</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="cd-card__value-row">
                                                                        <p className="cd-card__value">-</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Row 2: Canceled + No show (el-235) */}
                                            <div className="cd-stat-grid">
                                                {/* Canceled */}
                                                <div className="cd-stat-grid__cell">
                                                    <div className="cd-card">
                                                        <div className="cd-card__inner">
                                                            <div className="cd-card__border" />
                                                            <div className="cd-card__content">
                                                                <div className="cd-card__body">
                                                                    <div className="cd-card__label-row">
                                                                        <p className="cd-card__label">Canceled</p>
                                                                        <div className="cd-card__info-icon" role="tooltip">
                                                                            <div className="cd-card__info-icon-inner">
                                                                                <span aria-hidden="true" className="cd-card__info-icon-span">
                                                                                    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d={SVG_INFO_CIRCLE} fillRule="evenodd" clipRule="evenodd" />
                                                                                        <path d={SVG_INFO_I} fillRule="evenodd" clipRule="evenodd" />
                                                                                        <path d={SVG_INFO_DOT} />
                                                                                    </svg>
                                                                                </span>
                                                                            </div>
                                                                            <span className="cd-tooltip">Total canceled appointments</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="cd-card__value-row">
                                                                        <p className="cd-card__value">0</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* No show */}
                                                <div className="cd-stat-grid__cell">
                                                    <div className="cd-card">
                                                        <div className="cd-card__inner">
                                                            <div className="cd-card__border" />
                                                            <div className="cd-card__content">
                                                                <div className="cd-card__body">
                                                                    <div className="cd-card__label-row">
                                                                        <p className="cd-card__label">No show</p>
                                                                        <div className="cd-card__info-icon" role="tooltip">
                                                                            <div className="cd-card__info-icon-inner">
                                                                                <span aria-hidden="true" className="cd-card__info-icon-span">
                                                                                    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d={SVG_INFO_CIRCLE} fillRule="evenodd" clipRule="evenodd" />
                                                                                        <path d={SVG_INFO_I} fillRule="evenodd" clipRule="evenodd" />
                                                                                        <path d={SVG_INFO_DOT} />
                                                                                    </svg>
                                                                                </span>
                                                                            </div>
                                                                            <span className="cd-tooltip">Total no-show appointments</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="cd-card__value-row">
                                                                        <p className="cd-card__value">0</p>
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
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}
