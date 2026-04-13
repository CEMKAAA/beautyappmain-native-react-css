import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './TestPage.css';
import BlockTimeDrawer from './BlockTimeDrawer';

/* ── SVG Icons ── */
const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const MinimizeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 14h6v6M20 10h-6V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const FocusIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 9V5a2 2 0 012-2h4M15 3h4a2 2 0 012 2v4M21 15v4a2 2 0 01-2 2h-4M9 21H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const AddClientIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 11a4 4 0 100-8 4 4 0 000 8zM20 8v6M23 11h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const AddClientLargeIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 11a4 4 0 100-8 4 4 0 000 8zM20 8v6M23 11h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const WalkInIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="2" />
        <path d="M10 22l1-7M14 22l-1-7M9 12l-2 3M15 12l2 3M10 9h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChevronLeftIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const PronounsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const BirthIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="8" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M12 4v4M8 4v4M16 4v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const CreatedIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/* ── Dropdown Icons ── */
const RemoveClientIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
        <line x1="17" y1="11" x2="23" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const StaffAlertIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const AllergyIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const PatchTestIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/* ── Service Added Icons ── */
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.846 3.403a2.157 2.157 0 0 1 3.05 3.05l-.86.86-3.05-3.05.86-.86Z" />
        <path d="M12.576 5.674l-7.93 7.93a1.685 1.685 0 0 0-.453.823l-.62 2.788a.474.474 0 0 0 .566.566l2.788-.62c.311-.069.6-.222.824-.454l7.93-7.928-3.105-3.105Z" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.57 5.5h12.86" />
        <path d="M8.5 4h3a1.5 1.5 0 0 0-3 0Z" />
        <path d="M5.51 5.5l.94 10.333A3 3 0 0 0 9.44 18.5h1.12a3 3 0 0 0 2.99-2.667L14.49 5.5" />
        <path d="M8.5 8.5v6M11.5 8.5v6" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 3a.75.75 0 0 1 .75.75v5.5h5.5a.75.75 0 0 1 0 1.5h-5.5v5.5a.75.75 0 0 1-1.5 0v-5.5h-5.5a.75.75 0 0 1 0-1.5h5.5v-5.5A.75.75 0 0 1 10 3Z" />
    </svg>
);

const OptionsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    </svg>
);

/* ── Edit Service Icons ── */
const TrashIcon24 = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7h16" />
        <path d="M9 7V5.5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2V7" />
        <path d="M6 7v10a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7" />
        <path d="M10 11v5M14 11v5" />
    </svg>
);

const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.833 10H4.167M10 15.833L4.167 10 10 4.167" />
    </svg>
);

const ChevronDownSmallIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5.293 7.293a1 1 0 0 1 1.414 0L10 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414Z" />
    </svg>
);

const PersonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16.667 17.5v-1.667a3.333 3.333 0 0 0-3.334-3.333H6.667a3.333 3.333 0 0 0-3.334 3.333V17.5" />
        <circle cx="10" cy="5.833" r="3.333" />
    </svg>
);

/* ── Mock Data ── */
const SERVICES = [
    {
        category: 'Hair & styling',
        count: 2,
        items: [
            { name: 'Hair Color', duration: '55min', price: 'TRY 57', color: 'rgb(165, 223, 248)' },
            { name: 'Haircut', duration: '50min', price: 'TRY 40', color: 'rgb(165, 223, 248)' },
        ],
    },
    {
        category: 'Nails',
        count: 3,
        items: [
            { name: 'Manicure', duration: '30min', price: 'TRY 25', color: 'rgb(165, 223, 248)' },
            { name: 'Pedicure', duration: '40min', price: 'TRY 30', color: 'rgb(165, 223, 248)' },
            { name: 'Manicure & Pedicure', duration: '50min', price: 'TRY 45', color: 'rgb(165, 223, 248)' },
        ],
    },
];

const CLIENTS = [
    { id: 'new', name: 'Add new client', email: null, initial: null, type: 'add' },
    { id: 'walkin', name: 'Walk-In', email: null, initial: null, type: 'walkin' },
    { id: '1', name: 'Jack Doe', email: 'jack@example.com', initial: 'J', type: 'client' },
    { id: '2', name: 'Jane Doe', email: 'jane@example.com', initial: 'J', type: 'client' },
    { id: '3', name: 'John Doe', email: 'john@example.com', initial: 'J', type: 'client' },
];

const RECENTLY_BOOKED = [
    { name: 'Haircut', date: '17 Feb 2026', staff: 'Furkan Kem', price: 'TRY 40' },
    { name: 'Manicure', date: '9 Feb 2026', staff: 'Furkan Kem', price: 'TRY 25' },
];

/* ── Service Item ── */
const ServiceItem = ({ name, duration, price, color, onSelect }) => (
    <div className="drawer-service-item">
        <div className="drawer-service-hover-bg" />
        <button className="drawer-service-btn" onClick={() => onSelect && onSelect({ name, duration, price, color })} />
        <div className="drawer-service-row">
            <div className="drawer-service-bar-col">
                <div className="drawer-service-bar" style={{ backgroundColor: color }} />
            </div>
            <div className="drawer-service-content">
                <div className="drawer-service-info">
                    <div className="drawer-service-name-block">
                        <p className="drawer-service-name">{name}</p>
                        <p className="drawer-service-duration">{duration}</p>
                    </div>
                    <div className="drawer-service-price-block">
                        <div className="drawer-service-price-inner">
                            <div className="drawer-service-price-row">
                                <span className="drawer-service-price">
                                    <bdi>{price}</bdi>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

/* ── Category Group ── */
const CategoryGroup = ({ category, count, items, onSelectService }) => (
    <div className="drawer-category">
        <div className="drawer-category-header">
            <p className="drawer-category-title">{category}</p>
            <div className="drawer-category-badge">
                <span className="drawer-category-badge-text">{count}</span>
            </div>
        </div>
        <div className="drawer-category-items">
            {items.map((item, i) => (
                <ServiceItem key={i} {...item} onSelect={onSelectService} />
            ))}
        </div>
    </div>
);

/* ── Client Row ── */
const ClientRow = ({ client, showSeparatorAfter, onSelect }) => (
    <>
        <div className="client-row-wrap" onClick={() => onSelect?.(client)}>
            <div className="client-row">
                <div className="client-row-avatar-col">
                    {client.type === 'add' ? (
                        <div className="client-avatar-outer client-avatar-outer--icon">
                            <div className="client-avatar-circle">
                                <div className="client-avatar-inner">
                                    <span className="client-avatar-icon-lg">
                                        <AddClientLargeIcon />
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : client.type === 'walkin' ? (
                        <div className="client-avatar-outer client-avatar-outer--icon">
                            <div className="client-avatar-circle">
                                <div className="client-avatar-inner">
                                    <span className="client-avatar-icon-lg">
                                        <WalkInIcon />
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="client-avatar-outer client-avatar-outer--letter">
                            <div className="client-avatar-letter-wrap">
                                <span className="client-avatar-letter">{client.initial}</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="client-row-info">
                    <p className="client-row-name">{client.name}</p>
                    {client.email && <p className="client-row-email">{client.email}</p>}
                </div>
            </div>
        </div>
        {showSeparatorAfter && (
            <div className="client-separator-wrap">
                <div className="client-separator-line" />
            </div>
        )}
    </>
);

/* ── Recently Booked Card ── */
const RecentlyBookedCard = ({ name, date, staff, price }) => (
    <div className="rb-card">
        <div className="rb-card-content">
            <div className="rb-card-title-row">
                <p className="rb-card-title">{name}</p>
            </div>
            <div className="rb-card-details">
                <p className="rb-card-date">{date} • {staff}</p>
                <p className="rb-card-price">{price}</p>
            </div>
        </div>
    </div>
);

/* ── Service Added Panel (Step 6) ── */
const ServiceAddedPanel = ({ services = [], staff = 'Furkan Kem', isEmpty = false, onRemove, onEdit, onAddService, repeatValue = "Doesn't repeat", onRepeat }) => (
    <div className="svc-added-panel">
        <div className="svc-added-inner">
            {/* Sticky header overlay (hidden by default, shown on scroll) */}
            <div className="svc-added-header-ghost" />

            {/* Title section */}
            <div className="svc-added-title-area">
                <div className="svc-added-title-pad">
                    <div className="svc-added-title-grid">
                        <div className="svc-added-title-slot">
                            <div className="svc-added-title-flex">
                                <button className="svc-added-title-btn">
                                    <h1 className="svc-added-h1">
                                        <div className="svc-added-h1-row">
                                            <p className="svc-added-h1-text">Wed 18 Feb</p>
                                            <span className="svc-added-h1-chevron">
                                                <span className="svc-added-h1-chevron-icon">
                                                    <ChevronDownIcon />
                                                </span>
                                            </span>
                                        </div>
                                    </h1>
                                </button>
                            </div>
                        </div>
                        <div className="svc-added-desc-slot">
                            <div className="svc-added-desc">
                                <div className="svc-added-desc-row">
                                    <div className="svc-added-time-wrap">
                                        <button className="svc-added-time-btn">11:30</button>
                                    </div>
                                    <div className="svc-added-dot">•</div>
                                    <button className="svc-added-repeat-btn" onClick={onRepeat}>{repeatValue}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Separator */}
            <hr className="svc-added-separator" />

            {/* Body */}
            <div className="svc-added-body">
                <div className="svc-added-body-inner">
                    <div className="svc-added-services-section">
                        {/* Section title */}
                        <p className="svc-added-section-title">Services</p>

                        {isEmpty ? (
                            /* ── Empty state ── */
                            <>
                                {/* el-130: card container */}
                                <div className="svc-empty-card-container">
                                    {/* el-131: card bg */}
                                    <div className="svc-empty-card-bg" />
                                    {/* el-132: inset border overlay */}
                                    <div className="svc-empty-card-border" />
                                    {/* el-133: empty state content */}
                                    <div className="svc-empty-content">
                                        {/* el-134: centered column */}
                                        <div className="svc-empty-center">
                                            {/* el-135-136: image */}
                                            <picture className="svc-empty-picture">
                                                <img className="svc-empty-img" src="/empty-state-tag.png" alt="" />
                                            </picture>
                                            {/* el-137-138: text */}
                                            <div className="svc-empty-text-wrap">
                                                <span className="svc-empty-text">Add a service to save the appointment</span>
                                            </div>
                                            {/* el-139-147: Add service button */}
                                            <div className="svc-empty-btn-wrap">
                                                <button className="svc-added-add-btn" onClick={onAddService}>
                                                    <div className="svc-added-add-btn-inner">
                                                        <span className="svc-added-add-btn-icon-slot">
                                                            <span className="svc-added-add-btn-icon">
                                                                <PlusIcon />
                                                            </span>
                                                        </span>
                                                        <span className="svc-added-add-btn-label-wrap">
                                                            <span className="svc-added-add-btn-label">Add service</span>
                                                        </span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* el-148-149: empty add service row */}
                                <div className="svc-added-add-wrap">
                                    <div className="svc-added-add-grid">
                                        <div className="svc-added-add-grid-inner" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* ── Service cards + Add service button ── */
                            <>
                                <div className="svc-added-cards">
                                    {services.map((svc, idx) => (
                                        <div key={idx} className="drawer-service-item svc-card-wrapper">
                                            <div className="drawer-service-hover-bg" />
                                            <button className="drawer-service-btn" />
                                            <div className="drawer-service-row">
                                                <div className="drawer-service-bar-col">
                                                    <div className="drawer-service-bar" style={{ backgroundColor: svc.color }} />
                                                </div>
                                                <div className="drawer-service-content">
                                                    <div className="drawer-service-info">
                                                        <div className="drawer-service-name-block">
                                                            <p className="drawer-service-name">{svc.name}</p>
                                                            <p className="drawer-service-duration">
                                                                <span>11:30</span>
                                                                <span> · </span>
                                                                <span>{svc.duration}</span>
                                                                <span> · </span>
                                                                <span>{staff}</span>
                                                            </p>
                                                        </div>
                                                        <div className="drawer-service-price-block svc-card-price-area">
                                                            <div className="drawer-service-price-inner svc-card-price-main">
                                                                <div className="drawer-service-price-row">
                                                                    <span className="drawer-service-price">
                                                                        <bdi>{svc.price}</bdi>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {/* Hover actions (Edit / Remove) */}
                                                            <div className="svc-card-hover-actions">
                                                                <button className="svc-card-hover-action-btn" aria-label="Edit" onClick={() => onEdit(idx)}>
                                                                    <span className="svc-card-hover-action-icon">
                                                                        <EditIcon />
                                                                    </span>
                                                                </button>
                                                                <button className="svc-card-hover-action-btn" aria-label="Remove" onClick={() => onRemove(idx)}>
                                                                    <span className="svc-card-hover-action-icon">
                                                                        <TrashIcon />
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Add service button + total duration */}
                                <div className="svc-added-add-wrap">
                                    <div className="svc-added-add-grid">
                                        <div className="svc-added-add-grid-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div className="svc-added-add-grid-cell">
                                                <button className="svc-added-add-btn" onClick={onAddService}>
                                                    <div className="svc-added-add-btn-inner">
                                                        <span className="svc-added-add-btn-icon-slot">
                                                            <span className="svc-added-add-btn-icon">
                                                                <PlusIcon />
                                                            </span>
                                                        </span>
                                                        <span className="svc-added-add-btn-label-wrap">
                                                            <span className="svc-added-add-btn-label">Add service</span>
                                                        </span>
                                                    </div>
                                                </button>
                                            </div>
                                            {services.length > 0 && (() => {
                                                const totalMin = services.reduce((sum, s) => {
                                                    const m = parseInt(s.duration.replace(/[^0-9]/g, ''), 10);
                                                    return sum + (isNaN(m) ? 0 : m);
                                                }, 0);
                                                const h = Math.floor(totalMin / 60);
                                                const m = totalMin % 60;
                                                const label = h > 0 ? `${h}h ${m}min` : `${m}min`;
                                                return <span className="svc-added-total-duration">{label}</span>;
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Sticky footer */}
            <div className={`svc-added-footer${isEmpty ? ' svc-added-footer--disabled' : ''}`}>
                <div className="svc-added-footer-inner">
                    <div className="svc-added-footer-pad">
                        <div className="svc-added-footer-content">
                            <div className="svc-added-footer-summary">
                                {/* Total row — hidden when empty */}
                                {!isEmpty && services.length > 0 && (
                                    <div className="svc-added-total-row">
                                        <span className="svc-added-total-label">Total</span>
                                        <div className="svc-added-total-value-wrap">
                                            <span className="svc-added-total-value">
                                                <span><bdi>TRY {services.reduce((sum, s) => sum + parseInt(s.price.replace(/[^0-9]/g, ''), 10), 0)}</bdi></span>
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action buttons */}
                            <div className="svc-added-footer-actions">
                                <div className="svc-added-footer-action-item">
                                    <button className="svc-added-options-btn" aria-label="Options">
                                        <div className="svc-added-options-btn-inner">
                                            <span className="svc-added-options-btn-sr">Options</span>
                                            <span className="svc-added-options-btn-icon-slot">
                                                <span className="svc-added-options-btn-icon">
                                                    <OptionsIcon />
                                                </span>
                                            </span>
                                        </div>
                                    </button>
                                </div>
                                <button className="svc-added-checkout-btn" disabled={isEmpty}>
                                    <div className="svc-added-checkout-btn-inner">
                                        <span className="svc-added-checkout-btn-label-wrap">
                                            <span className="svc-added-checkout-btn-label">Checkout</span>
                                        </span>
                                    </div>
                                </button>
                                <button className="svc-added-save-btn" disabled={isEmpty}>
                                    <div className="svc-added-save-btn-inner">
                                        <span className="svc-added-save-btn-label-wrap">
                                            <span className="svc-added-save-btn-label">Save</span>
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

/* ── Add Service Panel (Step 7b - sliding panel) ── */
const AddServicePanel = ({ open, onClose, onSelectService, selectedClient }) => (
    <div className={`edit-svc-root${open ? ' edit-svc-root--open' : ''}`}>

        {/* ── Header with Back button ── */}
        <div className="edit-svc-header-area">
            <div className="edit-svc-header-inner">
                <div className="edit-svc-header-row">
                    <div className="edit-svc-back-wrap">
                        <button className="edit-svc-back-btn" onClick={onClose}>
                            <div className="edit-svc-back-btn-inner">
                                <span className="edit-svc-back-icon-slot">
                                    <BackArrowIcon />
                                </span>
                                <span className="edit-svc-back-label-wrap">
                                    <span className="edit-svc-back-label">Back</span>
                                </span>
                            </div>
                        </button>
                    </div>
                    <div className="edit-svc-header-title-wrap">
                        <span className="edit-svc-header-title">Add a service</span>
                    </div>
                    <div className="edit-svc-header-right">
                        <span style={{ width: 24, height: 24 }} />
                    </div>
                </div>
            </div>
        </div>

        {/* ── Title area ── */}
        <div className="edit-svc-title-area">
            <div className="edit-svc-title-pad">
                <div className="edit-svc-title-grid">
                    <div className="edit-svc-title-slot">
                        <div className="edit-svc-title-flex">
                            <h1 className="edit-svc-h1">Add a service</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* \u2500\u2500 Body with search + service list \u2500\u2500 */}
        <div className="edit-svc-body" style={{ padding: '16px 32px 32px' }}>
            <div style={{ width: '100%' }}>
                {/* Search */}
                <div className="drawer-search-sticky" style={{ position: 'relative', top: 0 }}>
                    <div className="drawer-search-col">
                        <div className="drawer-search-widget">
                            <div className="drawer-search-prefix">
                                <span className="drawer-search-icon-wrap">
                                    <SearchIcon />
                                </span>
                            </div>
                            <input
                                className="drawer-search-input"
                                type="text"
                                placeholder="Search by service name"
                            />
                        </div>
                    </div>
                </div>

                {/* Service List */}
                <div className="drawer-services-wrap">
                    <div className="drawer-services-list">
                        {SERVICES.map((cat, i) => (
                            <CategoryGroup key={i} {...cat} onSelectService={(svc) => { onSelectService(svc); onClose(); }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>

    </div>
);

/* ── Edit Service Panel (Step 8) ── */
const EditServicePanel = ({ service, staff = 'Furkan Kem', open, onClose, onDelete }) => {
    const priceNum = service ? parseInt(service.price.replace(/[^0-9]/g, ''), 10) : 0;
    return (
        <div className={`edit-svc-root${open ? ' edit-svc-root--open' : ''}`}>

            {/* ── Header (el-212–230) ── */}
            <div className="edit-svc-header-area">
                <div className="edit-svc-header-inner">
                    <div className="edit-svc-header-row">
                        {/* Back button */}
                        <div className="edit-svc-back-wrap">
                            <button className="edit-svc-back-btn" onClick={onClose}>
                                <div className="edit-svc-back-btn-inner">
                                    <span className="edit-svc-back-icon-slot">
                                        <BackArrowIcon />
                                    </span>
                                    <span className="edit-svc-back-label-wrap">
                                        <span className="edit-svc-back-label">Back</span>
                                    </span>
                                </div>
                            </button>
                        </div>
                        {/* Title (fades in on scroll) */}
                        <div className="edit-svc-header-title-wrap">
                            <span className="edit-svc-header-title">Edit service</span>
                        </div>
                        {/* Right spacer */}
                        <div className="edit-svc-header-right">
                            <span style={{ width: 24, height: 24 }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Title area (el-231–239) ── */}
            <div className="edit-svc-title-area">
                <div className="edit-svc-title-pad">
                    <div className="edit-svc-title-grid">
                        <div className="edit-svc-title-slot">
                            <div className="edit-svc-title-flex">
                                <h1 className="edit-svc-h1">Edit service</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Body (el-241–693) ── */}
            <div className="edit-svc-body">
                <div className="edit-svc-body-inner">
                    <form className="edit-svc-form" onSubmit={e => e.preventDefault()}>
                        <div className="edit-svc-grid">

                            {/* ── Service Name Card (span 12) ── */}
                            <div className="edit-svc-service-field">
                                <div className="edit-svc-service-card">
                                    <div className="edit-svc-service-border" />
                                    <div className="edit-svc-service-content">
                                        <div className="edit-svc-service-hover-bg" />
                                        <button className="edit-svc-service-btn" type="button" />
                                        <div className="edit-svc-service-row">
                                            <div className="edit-svc-service-bar-col">
                                                <div className="edit-svc-service-bar" style={{ backgroundColor: service?.color || '#ccc' }} />
                                            </div>
                                            <div className="edit-svc-service-info">
                                                <div className="edit-svc-service-details">
                                                    <div className="edit-svc-service-name-wrap">
                                                        <p className="edit-svc-service-name">
                                                            {service?.name}, {service?.duration}
                                                        </p>
                                                    </div>
                                                    <div className="edit-svc-service-chevron-area">
                                                        <div className="edit-svc-service-chevron-inner">
                                                            <span className="edit-svc-service-chevron-icon">
                                                                <ChevronRightIcon />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Team Member (span 12) ── */}
                            <div className="edit-svc-field-row">
                                <div className="edit-svc-field-inner">
                                    <label className="edit-svc-field-label">Team member</label>
                                    <div className="edit-svc-team-row">
                                        {/* Avatar thumbnail */}
                                        <div className="edit-svc-team-avatar-wrap">
                                            <div className="edit-svc-team-avatar-inner">
                                                <button className="edit-svc-team-avatar-btn" type="button" />
                                                <div className="edit-svc-team-avatar-bg">
                                                    <div className="edit-svc-team-avatar-icon-pad">
                                                        <span className="edit-svc-team-avatar-icon">
                                                            <PersonIcon />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="edit-svc-team-avatar-border" />
                                            </div>
                                        </div>
                                        {/* Select trigger */}
                                        <div className="edit-svc-team-select-wrap">
                                            <div className="edit-svc-select-trigger">
                                                <div className="edit-svc-select-prefix">
                                                    <div className="edit-svc-select-avatar">
                                                        <div className="edit-svc-select-avatar-inner">
                                                            <div className="edit-svc-select-avatar-img" style={{ backgroundColor: 'rgb(240,240,255)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'rgb(105,80,243)' }}>
                                                                {staff.split(' ').map(n => n[0]).join('')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="edit-svc-select-text">
                                                    <span>{staff}</span>
                                                </div>
                                                <div className="edit-svc-select-chevron">
                                                    <span className="edit-svc-select-chevron-icon">
                                                        <ChevronDownIcon />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Service Price (span 6) ── */}
                            <div className="edit-svc-half-field">
                                <div className="edit-svc-price-label-row">
                                    <label className="edit-svc-field-label">Service price</label>
                                </div>
                                <div className="edit-svc-input-wrap">
                                    <div className="edit-svc-input-prefix">TRY</div>
                                    <input
                                        className="edit-svc-input"
                                        type="text"
                                        defaultValue={priceNum || ''}
                                    />
                                </div>
                            </div>

                            {/* ── Discount (span 6) ── */}
                            <div className="edit-svc-discount-field">
                                <div className="edit-svc-discount-inner">
                                    <div className="edit-svc-discount-label-row">
                                        <span className="edit-svc-discount-label">Discount</span>
                                    </div>
                                    <div className="edit-svc-select-trigger">
                                        <div className="edit-svc-select-text">
                                            <span>No discount</span>
                                        </div>
                                        <div className="edit-svc-select-chevron">
                                            <span className="edit-svc-select-chevron-icon">
                                                <ChevronDownIcon />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Start Time (span 6) ── */}
                            <div className="edit-svc-discount-field">
                                <div className="edit-svc-discount-inner">
                                    <div className="edit-svc-discount-label-row">
                                        <span className="edit-svc-discount-label">Start time</span>
                                    </div>
                                    <div className="edit-svc-select-trigger">
                                        <div className="edit-svc-select-text">
                                            <span>11:40</span>
                                        </div>
                                        <div className="edit-svc-select-chevron">
                                            <span className="edit-svc-select-chevron-icon">
                                                <ChevronDownIcon />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Duration (span 6) ── */}
                            <div className="edit-svc-discount-field">
                                <div className="edit-svc-discount-inner">
                                    <div className="edit-svc-discount-label-row">
                                        <span className="edit-svc-discount-label">Duration</span>
                                    </div>
                                    <div className="edit-svc-select-trigger">
                                        <div className="edit-svc-select-text">
                                            <span>{service?.duration || '30min'}</span>
                                        </div>
                                        <div className="edit-svc-select-chevron">
                                            <span className="edit-svc-select-chevron-icon">
                                                <ChevronDownIcon />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Add Extra Time (span 12) ── */}
                            <span className="edit-svc-extra-time-slot">
                                <div className="edit-svc-extra-time-wrap">
                                    <button className="edit-svc-extra-time-btn" type="button">
                                        <div className="edit-svc-extra-time-btn-inner">
                                            <span className="edit-svc-extra-time-icon-slot">
                                                <span className="edit-svc-extra-time-icon">
                                                    <PlusIcon />
                                                </span>
                                            </span>
                                            <span className="edit-svc-extra-time-label-wrap">
                                                <span className="edit-svc-extra-time-label">Add extra time</span>
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            </span>

                        </div>
                    </form>
                </div>
            </div>

            {/* ── Footer (el-694–717) ── */}
            <div className="edit-svc-footer">
                <div className="edit-svc-footer-inner">
                    <div className="edit-svc-footer-content">
                        <div className="edit-svc-footer-col">
                            {/* Total summary row */}
                            <div className="edit-svc-total-row">
                                <p className="edit-svc-total-label">Total</p>
                                <div className="edit-svc-total-right">
                                    <p className="edit-svc-total-duration">{service?.duration || '30min'}</p>
                                    <div className="edit-svc-total-price-wrap">
                                        <span className="edit-svc-total-price">
                                            <bdi>{service?.price || 'TRY 0'}</bdi>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* Action buttons */}
                            <div className="edit-svc-actions-row">
                                {/* Delete button */}
                                <button className="edit-svc-delete-btn" type="button" onClick={onDelete}>
                                    <div className="edit-svc-delete-btn-inner">
                                        <span className="edit-svc-delete-sr">
                                            <span>Delete</span>
                                        </span>
                                        <span className="edit-svc-delete-icon-slot">
                                            <span className="edit-svc-delete-icon">
                                                <TrashIcon24 />
                                            </span>
                                        </span>
                                    </div>
                                </button>
                                {/* Apply button */}
                                <button className="edit-svc-apply-btn" type="button" onClick={onClose}>
                                    <div className="edit-svc-apply-btn-inner">
                                        <span className="edit-svc-apply-label-wrap">
                                            <span className="edit-svc-apply-label">Apply</span>
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

/* ── Client Profile (Step 4 + Step 5 Dropdown) ── */
const ClientProfile = ({ client, onRemoveClient }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const btnRef = useRef(null);

    const updatePos = useCallback(() => {
        if (!btnRef.current) return;
        const rect = btnRef.current.getBoundingClientRect();
        setDropdownPos({ top: rect.bottom + 4, left: rect.left });
    }, []);

    useEffect(() => {
        if (!dropdownOpen) return;
        updatePos();
        window.addEventListener('resize', updatePos);
        window.addEventListener('scroll', updatePos, true);
        return () => {
            window.removeEventListener('resize', updatePos);
            window.removeEventListener('scroll', updatePos, true);
        };
    }, [dropdownOpen, updatePos]);

    return (
        <div className="profile-area">
            <div className="profile-card">
                <div className="profile-info-block">
                    {/* Avatar */}
                    <div className="profile-avatar-section">
                        <div className="profile-avatar-outer">
                            <div className="profile-avatar-inner">
                                <span className="profile-avatar-letter">{client.initial}</span>
                            </div>
                        </div>
                    </div>

                    {/* Name + Email */}
                    <p className="profile-name">{client.name}</p>
                    <div className="profile-email-wrap">
                        <button className="profile-email-btn">{client.email}</button>
                    </div>

                    {/* Badge */}
                    <div className="profile-badges">
                        <div className="profile-badge-noshow">
                            <span className="profile-badge-noshow-text">1 no-show</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="profile-actions">
                    <div className={`profile-action-btn-wrap ${dropdownOpen ? 'is-open' : ''}`}>
                        <button className="profile-action-btn" ref={btnRef} onClick={() => setDropdownOpen(!dropdownOpen)}>
                            <div className="profile-action-btn-inner">
                                <span className="profile-action-btn-content">
                                    <span className="profile-action-btn-label">Actions</span>
                                </span>
                                <span className="profile-action-btn-icon-wrap">
                                    <span className="profile-action-btn-icon">
                                        <ChevronDownIcon />
                                    </span>
                                </span>
                            </div>
                        </button>

                        {/* ── Actions Dropdown Popover ── */}
                        {dropdownOpen && createPortal(
                            <>
                                <div className="actions-dropdown-overlay" onClick={() => setDropdownOpen(false)} />
                                <div className="actions-dropdown" style={dropdownPos}>
                                    <div className="actions-dropdown-content">
                                        <ul className="actions-dropdown-list">
                                            {/* Group 1: Remove client */}
                                            <li className="actions-dropdown-group">
                                                <ul className="actions-dropdown-group-list">
                                                    <li className="actions-dropdown-item" onClick={() => { setDropdownOpen(false); onRemoveClient?.(); }}>
                                                        <span className="actions-dropdown-item-icon"><RemoveClientIcon /></span>
                                                        <span className="actions-dropdown-item-label-wrap">
                                                            <span className="actions-dropdown-item-label">Remove client</span>
                                                        </span>
                                                    </li>
                                                </ul>
                                                <div className="actions-dropdown-divider-wrap">
                                                    <hr className="actions-dropdown-divider" />
                                                </div>
                                            </li>

                                            {/* Group 2: Quick actions */}
                                            <li className="actions-dropdown-group">
                                                <span className="actions-dropdown-section-header">
                                                    <span className="actions-dropdown-section-title">Quick actions</span>
                                                </span>
                                                <ul className="actions-dropdown-group-list">
                                                    <li className="actions-dropdown-item">
                                                        <span className="actions-dropdown-item-icon"><StaffAlertIcon /></span>
                                                        <span className="actions-dropdown-item-label-wrap">
                                                            <span className="actions-dropdown-item-label">Add staff alert</span>
                                                        </span>
                                                    </li>
                                                    <li className="actions-dropdown-item">
                                                        <span className="actions-dropdown-item-icon"><AllergyIcon /></span>
                                                        <span className="actions-dropdown-item-label-wrap">
                                                            <span className="actions-dropdown-item-label">Add allergy</span>
                                                        </span>
                                                    </li>
                                                    <li className="actions-dropdown-item">
                                                        <span className="actions-dropdown-item-icon"><PatchTestIcon /></span>
                                                        <span className="actions-dropdown-item-label-wrap">
                                                            <span className="actions-dropdown-item-label">Add patch test</span>
                                                        </span>
                                                    </li>
                                                </ul>
                                                <div className="actions-dropdown-divider-wrap">
                                                    <hr className="actions-dropdown-divider" />
                                                </div>
                                            </li>

                                            {/* Group 3: Edit / Block / Delete */}
                                            <li className="actions-dropdown-group">
                                                <ul className="actions-dropdown-group-list">
                                                    <li className="actions-dropdown-item">
                                                        <span className="actions-dropdown-item-label-wrap">
                                                            <span className="actions-dropdown-item-label">Edit client details</span>
                                                        </span>
                                                    </li>
                                                    <li className="actions-dropdown-item">
                                                        <span className="actions-dropdown-item-label-wrap">
                                                            <span className="actions-dropdown-item-label">Block client</span>
                                                        </span>
                                                    </li>
                                                    <li className="actions-dropdown-item">
                                                        <span className="actions-dropdown-item-label-wrap">
                                                            <span className="actions-dropdown-item-label is-danger">Delete client</span>
                                                        </span>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </>
                            , document.body)}
                    </div>
                    <button className="profile-action-btn">
                        <div className="profile-action-btn-inner">
                            <span className="profile-action-btn-content">
                                <span className="profile-action-btn-label">View profile</span>
                            </span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Divider */}
            <hr className="profile-divider" />

            {/* Info rows */}
            <div className="profile-details">
                <div className="profile-detail-row">
                    <span className="profile-detail-icon"><PronounsIcon /></span>
                    <div className="profile-detail-text">
                        <p className="profile-detail-link">Add pronouns</p>
                    </div>
                </div>
                <div className="profile-detail-row">
                    <span className="profile-detail-icon"><BirthIcon /></span>
                    <div className="profile-detail-text">
                        <p className="profile-detail-link">Add date of birth</p>
                    </div>
                </div>
                <div className="profile-detail-row">
                    <div className="profile-detail-icon-wrap">
                        <span className="profile-detail-icon"><CreatedIcon /></span>
                    </div>
                    <div className="profile-detail-text">
                        <p className="profile-detail-static">Created 17 Feb 2026</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ── Edit Repeating Panel ── */
const EditRepeatingPanel = ({ open, value, onChange, onClose }) => {
    const [localEvery, setLocalEvery] = useState('1');
    const [localPeriod, setLocalPeriod] = useState('Week');
    const [localEnds, setLocalEnds] = useState('Never');

    // Reset local state when panel opens
    useEffect(() => {
        if (open) {
            setLocalEvery('1');
            setLocalPeriod('Week');
            setLocalEnds('Never');
        }
    }, [open]);

    const handleApply = () => {
        const label = `Every ${localEvery} ${localPeriod.toLowerCase()}${parseInt(localEvery) > 1 ? 's' : ''}`;
        onChange(label);
        onClose();
    };

    /* ── Reusable select field ── */
    const SelectField = ({ label, value: val, options, onChange: onCh }) => (
        <div className="repeat-field">
            {label && (
                <label className="repeat-field-label">
                    <span>{label}</span>
                </label>
            )}
            <div className="repeat-select-wrap">
                <div className="repeat-select-display">
                    <span className="repeat-select-text">{val}</span>
                </div>
                <select
                    className="repeat-select-native"
                    value={val}
                    onChange={e => onCh(e.target.value)}
                >
                    {options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                <div className="repeat-select-arrow">
                    <span className="repeat-chevron-icon">
                        <ChevronDownSmallIcon />
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`repeat-root${open ? ' repeat-root--open' : ''}`}>

            {/* ── Header ── */}
            <div className="repeat-header-area">
                <div className="repeat-header-inner">
                    <div className="repeat-header-row">
                        {/* Back button */}
                        <div className="repeat-back-wrap">
                            <button className="repeat-back-btn" onClick={onClose}>
                                <div className="repeat-back-btn-inner">
                                    <span className="repeat-back-icon-slot">
                                        <BackArrowIcon />
                                    </span>
                                    <span className="repeat-back-label">Back</span>
                                </div>
                            </button>
                        </div>
                        {/* Title (fades in on scroll) */}
                        <div className="repeat-header-title-wrap">
                            <span className="repeat-header-title">Edit repeating options</span>
                        </div>
                        {/* Right spacer */}
                        <div className="repeat-header-right">
                            <span style={{ width: 24, height: 24 }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Title area ── */}
            <div className="repeat-title-area">
                <div className="repeat-title-pad">
                    <div className="repeat-title-grid">
                        <div className="repeat-title-slot">
                            <div className="repeat-title-flex">
                                <h1 className="repeat-h1">Edit repeating options</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="repeat-body">
                <div className="repeat-form">

                    {/* Every row */}
                    <div className="repeat-every-grid">
                        <div className="repeat-every-num">
                            <label className="repeat-field-label">
                                <span>Every</span>
                            </label>
                            <div className="repeat-select-wrap">
                                <input
                                    className="repeat-input"
                                    type="number"
                                    min="1"
                                    value={localEvery}
                                    onChange={e => setLocalEvery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="repeat-every-period">
                            <label className="repeat-field-label">
                                <span>&nbsp;</span>
                            </label>
                            <div className="repeat-select-wrap">
                                <div className="repeat-select-display">
                                    <span className="repeat-select-text">{localPeriod}</span>
                                </div>
                                <select
                                    className="repeat-select-native"
                                    value={localPeriod}
                                    onChange={e => setLocalPeriod(e.target.value)}
                                >
                                    <option value="Day">Day</option>
                                    <option value="Week">Week</option>
                                    <option value="Month">Month</option>
                                </select>
                                <div className="repeat-select-arrow">
                                    <span className="repeat-chevron-icon">
                                        <ChevronDownSmallIcon />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ends */}
                    <SelectField
                        label="Ends"
                        value={localEnds}
                        options={[
                            'Never',
                            'After 2 times', 'After 3 times', 'After 4 times', 'After 5 times',
                            'After 6 times', 'After 7 times', 'After 8 times', 'After 9 times',
                            'After 10 times', 'After 11 times', 'After 12 times', 'After 13 times',
                            'After 14 times', 'After 15 times', 'After 20 times', 'After 25 times',
                            'After 30 times', 'Specific date'
                        ]}
                        onChange={setLocalEnds}
                    />

                </div>
            </div>

            {/* ── Footer ── */}
            <div className="repeat-footer">
                <div className="repeat-footer-inner">
                    <div className="repeat-footer-pad">
                        <button className="repeat-apply-btn" onClick={handleApply}>
                            <div className="repeat-apply-btn-inner">
                                <span className="repeat-apply-label-wrap">
                                    <span className="repeat-apply-label">Apply changes</span>
                                </span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

/* ── Minimized Drawer Bar ── */
const MinimizedDrawerBar = ({ clientName, clientInitial, onExpand, onDismiss }) => (
    <div className="minimized-drawer-bar">
        <button className="minimized-drawer-expand-btn" onClick={onExpand} aria-label="Expand drawer" />
        <div className="minimized-drawer-avatar">
            <div className="minimized-drawer-avatar-inner">
                <span className="minimized-drawer-avatar-letter">{clientInitial || (clientName ? clientName[0] : '?')}</span>
            </div>
        </div>
        <p className="minimized-drawer-name">{clientName || 'New appointment'}</p>
        <button className="minimized-drawer-dismiss-btn" onClick={onDismiss} aria-label="Dismiss drawer">
            <div className="minimized-drawer-dismiss-inner">
                <span className="minimized-drawer-dismiss-icon-wrap">
                    <span className="minimized-drawer-dismiss-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4Z" />
                        </svg>
                    </span>
                </span>
            </div>
        </button>
    </div>
);

/* ── Main Page ── */
const TestPage = () => {
    const [pickMode, setPickMode] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [clientPanelOpen, setClientPanelOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [services, setServices] = useState([]);
    const [serviceRemoved, setServiceRemoved] = useState(false);
    const [editingServiceIdx, setEditingServiceIdx] = useState(null);
    const [addingService, setAddingService] = useState(false);
    const [drawerMinimized, setDrawerMinimized] = useState(false);
    const [repeatPanelOpen, setRepeatPanelOpen] = useState(false);
    const [repeatValue, setRepeatValue] = useState("Doesn't repeat");

    const handleToggleBanner = () => {
        if (pickMode) {
            setPickMode(false);
            setDrawerOpen(false);
            setClientPanelOpen(false);
            setSelectedClient(null);
            setServices([]);
        } else {
            setPickMode(true);
        }
    };

    const handleOpenDrawer = () => setDrawerOpen(true);
    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setPickMode(false);
        setClientPanelOpen(false);
        setSelectedClient(null);
        setServices([]);
        setDrawerMinimized(false);
    };

    const handleMinimizeDrawer = () => {
        setDrawerOpen(false);
        setDrawerMinimized(true);
    };

    const handleExpandDrawer = () => {
        setDrawerMinimized(false);
        setDrawerOpen(true);
    };

    const handleDismissDrawer = () => {
        setDrawerMinimized(false);
        setPickMode(false);
        setClientPanelOpen(false);
        setSelectedClient(null);
        setServices([]);
    };

    const handleSidebarClick = () => {
        if (!selectedClient) {
            setClientPanelOpen(true);
        }
    };

    const handleSelectClient = (client) => {
        if (client.type === 'client') {
            setSelectedClient(client);
            setClientPanelOpen(false);
        }
    };

    const handleRemoveClient = () => {
        setSelectedClient(null);
    };

    // First service selection (from "Select a service" panel)
    const handleSelectService = (service) => {
        setServices([service]);
        setServiceRemoved(false);
        setEditingServiceIdx(null);
        setAddingService(false);
    };

    // Add extra service (from "Add a service" sliding panel)
    const handleAddService = (service) => {
        setServices(prev => [...prev, service]);
        setServiceRemoved(false);
        setAddingService(false);
    };

    const handleRemoveService = (idx) => {
        setServices(prev => {
            const next = prev.filter((_, i) => i !== idx);
            if (next.length === 0) setServiceRemoved(true);
            return next;
        });
        setEditingServiceIdx(null);
    };

    const handleEditService = (idx) => setEditingServiceIdx(idx);
    const handleCloseEditService = () => setEditingServiceIdx(null);
    const handleDeleteService = () => {
        if (editingServiceIdx !== null) handleRemoveService(editingServiceIdx);
        setEditingServiceIdx(null);
    };

    const handleOpenAddService = () => setAddingService(true);
    const handleCloseAddService = () => setAddingService(false);

    // Determine sidebar state
    const sidebarWide = clientPanelOpen || !!selectedClient;

    const [blockTimeOpen, setBlockTimeOpen] = useState(false);

    return (
        <div className="test-root">

            {/* Toggle buttons */}
            <div style={{ display: 'flex', gap: 12, margin: 24 }}>
                <button className="test-toggle-btn" style={{ margin: 0 }} onClick={handleToggleBanner}>
                    {pickMode ? '✕ Banner Kapat' : '+ Randevu Oluştur'}
                </button>
                <button className="bt-toggle-btn" style={{ margin: 0 }} onClick={() => setBlockTimeOpen(true)}>
                    + Add blocked time
                </button>
            </div>

            {/* ─── Step 1: Pick Mode Banner ─── */}
            <div className={`pick-banner${pickMode ? ' pick-banner--open' : ''}`}>
                <span className="pick-banner-title">Select a time to book</span>
                <div className="pick-banner-actions">
                    <button className="pick-banner-btn pick-banner-btn--outline" onClick={handleOpenDrawer}>
                        View available times
                    </button>
                    <button className="pick-banner-btn pick-banner-btn--close" onClick={() => setPickMode(false)}>
                        Close
                    </button>
                </div>
            </div>

            {/* ─── Step 2, 3, 4: Drawer ─── */}
            <div className={`drawer-root${drawerOpen ? ' drawer-root--open' : ''}${sidebarWide ? ' drawer-root--wide' : ''}`}>
                <div className={`drawer-grid${sidebarWide ? ' drawer-grid--wide' : ''}`}>

                    {/* Floating action buttons */}
                    <div className="drawer-fab-strip">
                        <button className="drawer-fab" onClick={handleCloseDrawer} aria-label="Close Drawer">
                            <div className="drawer-fab-inner">
                                <span className="drawer-fab-icon-wrap">
                                    <span className="drawer-fab-icon"><CloseIcon /></span>
                                </span>
                            </div>
                        </button>
                        <button className="drawer-fab" aria-label="Minimize Drawer" onClick={handleMinimizeDrawer}>
                            <div className="drawer-fab-inner">
                                <span className="drawer-fab-icon-wrap">
                                    <span className="drawer-fab-icon"><MinimizeIcon /></span>
                                </span>
                            </div>
                        </button>
                        <button className="drawer-fab" aria-label="Focus appointment">
                            <div className="drawer-fab-inner">
                                <span className="drawer-fab-icon-wrap">
                                    <span className="drawer-fab-icon"><FocusIcon /></span>
                                </span>
                            </div>
                        </button>
                    </div>

                    {/* ── Left Sidebar ── */}
                    <div className={`drawer-sidebar${sidebarWide ? ' drawer-sidebar--wide' : ''}`}>
                        <div className={`drawer-sidebar-inner${sidebarWide ? ' drawer-sidebar-inner--wide' : ''}`}>
                            <div className={`drawer-sidebar-body${sidebarWide ? ' drawer-sidebar-body--wide' : ''}`}>

                                {/* Step 2: Collapsed sidebar */}
                                {!clientPanelOpen && !selectedClient && (
                                    <div className="drawer-sidebar-content">
                                        <div className="drawer-sidebar-card">
                                            <button className="drawer-sidebar-card-btn" onClick={handleSidebarClick} />
                                            <div className="drawer-sidebar-card-visual">
                                                <div className="drawer-sidebar-card-info">
                                                    <div className="drawer-client-avatar-wrap">
                                                        <div className="drawer-client-avatar">
                                                            <div className="drawer-client-avatar-inner">
                                                                <span className="drawer-client-avatar-icon">
                                                                    <AddClientIcon />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="drawer-client-text">
                                                        <p className="drawer-client-title">Add client</p>
                                                        <p className="drawer-client-subtitle">Or leave empty for walk-ins</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Expanded client panel */}
                                {clientPanelOpen && !selectedClient && (
                                    <div className="client-panel">
                                        <div className="client-panel-header">
                                            <div className="client-panel-header-inner">
                                                <p className="client-panel-title">Select a client</p>
                                                <div className="client-panel-search-col">
                                                    <div className="client-panel-search-widget">
                                                        <div className="client-panel-search-prefix">
                                                            <span className="drawer-search-icon-wrap">
                                                                <SearchIcon />
                                                            </span>
                                                        </div>
                                                        <input
                                                            className="client-panel-search-input"
                                                            type="text"
                                                            placeholder="Search client or leave empty"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="client-panel-list-area">
                                            <ul className="client-panel-list">
                                                {CLIENTS.map((client, i) => (
                                                    <ClientRow
                                                        key={client.id}
                                                        client={client}
                                                        showSeparatorAfter={i === 1}
                                                        onSelect={handleSelectClient}
                                                    />
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Client profile */}
                                {selectedClient && (
                                    <ClientProfile client={selectedClient} onRemoveClient={handleRemoveClient} />
                                )}

                            </div>
                        </div>
                    </div>

                    {/* ── Right Panel (480px) ── */}
                    <div className="drawer-panel">
                        {(services.length > 0 || serviceRemoved) ? (
                            <>
                                <ServiceAddedPanel services={services} isEmpty={serviceRemoved && services.length === 0} onRemove={handleRemoveService} onEdit={handleEditService} onAddService={handleOpenAddService} repeatValue={repeatValue} onRepeat={() => setRepeatPanelOpen(true)} />
                                <EditServicePanel
                                    service={editingServiceIdx !== null ? services[editingServiceIdx] : null}
                                    open={editingServiceIdx !== null}
                                    onClose={handleCloseEditService}
                                    onDelete={handleDeleteService}
                                />
                                <EditRepeatingPanel
                                    open={repeatPanelOpen}
                                    value={repeatValue}
                                    onChange={(val) => setRepeatValue(val)}
                                    onClose={() => setRepeatPanelOpen(false)}
                                />
                                <AddServicePanel
                                    open={addingService}
                                    onClose={handleCloseAddService}
                                    onSelectService={handleAddService}
                                    selectedClient={selectedClient}
                                />
                            </>
                        ) : (
                            <div className="drawer-panel-inner">
                                {/* Title area */}
                                <div className="drawer-panel-title-area">
                                    <div className="drawer-panel-title-pad">
                                        <div className="drawer-panel-title-grid">
                                            <div className="drawer-panel-title-slot">
                                                <div className="drawer-panel-title-flex">
                                                    <h1 className="drawer-panel-h1">Select a service</h1>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="drawer-panel-body">
                                    <div className="drawer-panel-body-inner">
                                        {/* Search */}
                                        <div className="drawer-search-sticky">
                                            <div className="drawer-search-col">
                                                <div className="drawer-search-widget">
                                                    <div className="drawer-search-prefix">
                                                        <span className="drawer-search-icon-wrap">
                                                            <SearchIcon />
                                                        </span>
                                                    </div>
                                                    <input
                                                        className="drawer-search-input"
                                                        type="text"
                                                        placeholder="Search by service name"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Recently Booked (Step 4 only) */}
                                        {selectedClient && (
                                            <div className="rb-section">
                                                <div className="rb-header">
                                                    <div className="rb-header-left">
                                                        <p className="rb-header-title">Recently booked</p>
                                                        <div className="drawer-category-badge">
                                                            <span className="drawer-category-badge-text">{RECENTLY_BOOKED.length}</span>
                                                        </div>
                                                    </div>
                                                    <div className="rb-header-nav">
                                                        <button className="rb-nav-btn rb-nav-btn--disabled" disabled>
                                                            <div className="rb-nav-btn-inner rb-nav-btn-inner--disabled">
                                                                <span className="rb-nav-icon"><ChevronLeftIcon /></span>
                                                            </div>
                                                        </button>
                                                        <button className="rb-nav-btn">
                                                            <div className="rb-nav-btn-inner">
                                                                <span className="rb-nav-icon"><ChevronRightIcon /></span>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="rb-carousel-wrap">
                                                    <div className="rb-carousel">
                                                        {RECENTLY_BOOKED.map((item, i) => (
                                                            <RecentlyBookedCard key={i} {...item} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Service List */}
                                        <div className="drawer-services-wrap">
                                            <div className="drawer-services-list">
                                                {SERVICES.map((cat, i) => (
                                                    <CategoryGroup key={i} {...cat} onSelectService={handleSelectService} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Minimized drawer bar */}
            {drawerMinimized && (
                <MinimizedDrawerBar
                    clientName={selectedClient?.name}
                    clientInitial={selectedClient?.initial}
                    onExpand={handleExpandDrawer}
                    onDismiss={handleDismissDrawer}
                />
            )}

            {/* Block Time Drawer */}
            <BlockTimeDrawer open={blockTimeOpen} onClose={() => setBlockTimeOpen(false)} />

        </div>
    );
};

export default TestPage;
