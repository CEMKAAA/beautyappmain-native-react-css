import React, { useState, useRef, useEffect, useCallback } from 'react';
import './AddServiceModal.css';

/* ═══════════════════════════════════════════════════
   SVG Paths
   ═══════════════════════════════════════════════════ */

// Chevron down
const SVG_CHEVRON_DOWN = "M9.043 12.293a1 1 0 0 1 1.414 0L16 17.836l5.543-5.543a1 1 0 0 1 1.414 1.414l-6.25 6.25a1 1 0 0 1-1.414 0l-6.25-6.25a1 1 0 0 1 0-1.414";

// Plus icon for "Add extra time"
const SVG_PLUS = "M16 5a1 1 0 0 1 1 1v9h9a1 1 0 1 1 0 2h-9v9a1 1 0 1 1-2 0v-9H6a1 1 0 1 1 0-2h9V6a1 1 0 0 1 1-1";

// Minus icon for indeterminate checkbox (el-23 svgAttrs.d)
const SVG_MINUS = "M20 12c0 .621-.504 1.125-1.125 1.125H5.125a1.125 1.125 0 0 1 0-2.25h13.75c.621 0 1.125.504 1.125 1.125";

/* ═══════════════════════════════════════════════════
   Team Members Data
   ═══════════════════════════════════════════════════ */
const TEAM_MEMBERS = [
    { id: '5107827', name: 'Furkan Kem', initials: 'FK' },
    { id: '5107828', name: 'Wendy Smith (Demo)', initials: 'WS' },
];

/* ═══════════════════════════════════════════════════
   Sidebar Navigation Items
   ═══════════════════════════════════════════════════ */
const SIDEBAR_GROUPS = [
    {
        items: [
            { id: 'basicDetails', label: 'Basic details', active: true },
            { id: 'teamMembers', label: 'Team members', badge: '2' },
            { id: 'resources', label: 'Resources' },
            { id: 'serviceAddons', label: 'Service add-ons' },
        ],
    },
    {
        title: 'Settings',
        items: [
            { id: 'onlineBooking', label: 'Online booking' },
            { id: 'forms', label: 'Forms', badge: '1' },
            { id: 'commissions', label: 'Commissions' },
            { id: 'settings', label: 'Settings' },
        ],
    },
];

/* ═══════════════════════════════════════════════════
   Duration Options
   ═══════════════════════════════════════════════════ */
const DURATION_OPTIONS = [
    '5min', '10min', '15min', '20min', '25min', '30min',
    '35min', '40min', '45min', '50min', '55min',
    '1h', '1h 5min', '1h 10min', '1h 15min', '1h 20min', '1h 25min', '1h 30min',
    '1h 35min', '1h 40min', '1h 45min', '1h 50min', '1h 55min',
    '2h', '2h 15min', '2h 30min', '2h 45min',
    '3h', '3h 30min', '4h', '4h 30min', '5h', '6h', '7h', '8h',
];

/* ═══════════════════════════════════════════════════
   Price Type Options
   ═══════════════════════════════════════════════════ */
const PRICE_TYPES = [
    { value: 'fixed', label: 'Fixed' },
    { value: 'from', label: 'From' },
    { value: 'free', label: 'Free' },
];

/* ═══════════════════════════════════════════════════
   AddServiceModal Component
   ═══════════════════════════════════════════════════ */
export default function AddServiceModal({ isOpen, onClose }) {
    // Form state
    const [serviceName, setServiceName] = useState('');
    const [menuCategory, setMenuCategory] = useState('');
    const [treatmentType, setTreatmentType] = useState('');
    const [description, setDescription] = useState('');
    const [priceType, setPriceType] = useState('fixed');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('1h');
    const [activeNav, setActiveNav] = useState('basicDetails');
    const [headerScrolled, setHeaderScrolled] = useState(false);

    // Team members state — all checked by default
    const [checkedMembers, setCheckedMembers] = useState(
        () => new Set(TEAM_MEMBERS.map(m => m.id))
    );

    // Derived: are ALL members checked?
    const allChecked = checkedMembers.size === TEAM_MEMBERS.length;
    const someChecked = checkedMembers.size > 0 && !allChecked;

    const toggleMember = (id) => {
        setCheckedMembers(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleAll = () => {
        if (allChecked) {
            setCheckedMembers(new Set());
        } else {
            setCheckedMembers(new Set(TEAM_MEMBERS.map(m => m.id)));
        }
    };

    // Refs
    const scrollRef = useRef(null);
    const dialogRef = useRef(null);

    // Handle scroll for sticky header shadow
    const handleScroll = useCallback(() => {
        if (scrollRef.current) {
            setHeaderScrolled(scrollRef.current.scrollTop > 0);
        }
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.addEventListener('scroll', handleScroll);
            return () => el.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll, isOpen]);

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

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <div className={`am-overlay ${isOpen ? 'am-overlay--open' : ''}`}>
            <div className="am-transform">
                <div className="am-scroll" ref={scrollRef}>
                    <div className="am-dialog" role="dialog" tabIndex={-1} ref={dialogRef}>

                        {/* ── Sticky Header ── */}
                        <div className={`am-header ${headerScrolled ? 'am-header--scrolled' : ''}`}>
                            <div className="am-header__inner">
                                {/* Title */}
                                <div className="am-header__title-col">
                                    <span className="am-header__title">New service</span>
                                </div>

                                {/* Buttons */}
                                <div className="am-header__actions">
                                    <div className="am-header__btn-row">
                                        {/* Close button */}
                                        <button type="button" className="am-btn-close" onClick={onClose}>
                                            <div className="am-btn-close__inner">
                                                <span className="am-btn-close__text">Close</span>
                                            </div>
                                        </button>

                                        {/* Save button (primary) */}
                                        <button type="button" className="am-btn-add">
                                            <div className="am-btn-add__inner">
                                                <span className="am-btn-add__text">Save</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Main Content ── */}
                        <div className="am-content">
                            <h1 className="am-page-title">New service</h1>

                            <div className="am-grid">

                                {/* ════════════════════════════════════
                                   CONTENT COLUMN
                                   ════════════════════════════════════ */}
                                <div className="am-main">

                                    {/* ════════════════════════════════════
                                       BASIC DETAILS (activeNav === 'basicDetails')
                                       ════════════════════════════════════ */}
                                    {activeNav === 'basicDetails' && (
                                        <>
                                            {/* ── Basic details Section ── */}
                                            <div>
                                                <h2 className="am-section__title">Basic details</h2>

                                                <div className="am-form-grid">
                                                    {/* Service name (span 12) */}
                                                    <div className="am-span-12">
                                                        <div className="am-field">
                                                            <div className="am-field__label">
                                                                <span className="am-field__label-text">Service name</span>
                                                                <span className="am-field__label-counter">{serviceName.length}/255</span>
                                                            </div>
                                                            <div className="am-input-wrap">
                                                                <input
                                                                    type="text"
                                                                    className="am-input"
                                                                    placeholder="Add a service name, e.g. Men's Haircut"
                                                                    value={serviceName}
                                                                    onChange={(e) => {
                                                                        if (e.target.value.length <= 255) {
                                                                            setServiceName(e.target.value);
                                                                        }
                                                                    }}
                                                                    maxLength={255}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Menu category (span 6) */}
                                                    <div className="am-span-6">
                                                        <div className="am-field">
                                                            <div className="am-field__label">
                                                                <span className="am-field__label-text">Menu category</span>
                                                            </div>
                                                            <div className="am-select-wrap">
                                                                <div className="am-select__display">
                                                                    {menuCategory ? (
                                                                        <span className="am-select__value">{menuCategory}</span>
                                                                    ) : (
                                                                        <span className="am-select__placeholder">Select category</span>
                                                                    )}
                                                                </div>
                                                                <select
                                                                    className="am-select__native"
                                                                    value={menuCategory}
                                                                    onChange={(e) => setMenuCategory(e.target.value)}
                                                                    aria-label="Menu category"
                                                                >
                                                                    <option value="">Select category</option>
                                                                </select>
                                                                <div className="am-select__chevron">
                                                                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d={SVG_CHEVRON_DOWN} fillRule="evenodd" clipRule="evenodd" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <p className="am-field__helper">
                                                                The category displayed to you, and to clients online
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Treatment type (span 6) */}
                                                    <div className="am-span-6">
                                                        <div className="am-field">
                                                            <div className="am-field__label">
                                                                <span className="am-field__label-text">Treatment type</span>
                                                            </div>
                                                            <div className="am-select-wrap">
                                                                <div className="am-select__display">
                                                                    {treatmentType ? (
                                                                        <span className="am-select__value">{treatmentType}</span>
                                                                    ) : (
                                                                        <span className="am-select__placeholder">Select treatment type</span>
                                                                    )}
                                                                </div>
                                                                <select
                                                                    className="am-select__native"
                                                                    value={treatmentType}
                                                                    onChange={(e) => setTreatmentType(e.target.value)}
                                                                    aria-label="Treatment type"
                                                                >
                                                                    <option value="">Select treatment type</option>
                                                                </select>
                                                                <div className="am-select__chevron">
                                                                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d={SVG_CHEVRON_DOWN} fillRule="evenodd" clipRule="evenodd" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <p className="am-field__helper">
                                                                Used to help clients find your service on the Fresha marketplace
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Description (span 12) */}
                                                    <div className="am-span-12">
                                                        <div className="am-field">
                                                            <div className="am-field__label">
                                                                <span className="am-field__label-text">Description <span style={{ fontWeight: 400, color: 'rgb(118, 118, 118)' }}>(Optional)</span></span>
                                                                <span className="am-field__label-counter">{description.length}/1000</span>
                                                            </div>
                                                            <div className="am-textarea-wrap">
                                                                <textarea
                                                                    className="am-textarea"
                                                                    placeholder="Add a short description"
                                                                    value={description}
                                                                    onChange={(e) => {
                                                                        if (e.target.value.length <= 1000) {
                                                                            setDescription(e.target.value);
                                                                        }
                                                                    }}
                                                                    maxLength={1000}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ── HR between sections ── */}
                                            <hr className="am-section-separator" />

                                            {/* ── Pricing and duration Section ── */}
                                            <div>
                                                <h2 className="am-section__title">Pricing and duration</h2>

                                                <div className="am-form-grid">
                                                    {/* Price type (span 4) */}
                                                    <div className="am-span-4">
                                                        <div className="am-field">
                                                            <div className="am-field__label">
                                                                <span className="am-field__label-text">Price type</span>
                                                            </div>
                                                            <div className="am-select-wrap">
                                                                <div className="am-select__display">
                                                                    <span className="am-select__value">
                                                                        {PRICE_TYPES.find(t => t.value === priceType)?.label}
                                                                    </span>
                                                                </div>
                                                                <select
                                                                    className="am-select__native"
                                                                    value={priceType}
                                                                    onChange={(e) => setPriceType(e.target.value)}
                                                                    aria-label="Price type"
                                                                >
                                                                    {PRICE_TYPES.map(t => (
                                                                        <option key={t.value} value={t.value}>{t.label}</option>
                                                                    ))}
                                                                </select>
                                                                <div className="am-select__chevron">
                                                                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d={SVG_CHEVRON_DOWN} fillRule="evenodd" clipRule="evenodd" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Price (span 4) */}
                                                    <div className="am-span-4">
                                                        <div className="am-field">
                                                            <div className="am-field__label">
                                                                <span className="am-field__label-text">Price</span>
                                                            </div>
                                                            <div className="am-input-wrap as-price-input-wrap">
                                                                <span className="as-price-currency">TRY</span>
                                                                <input
                                                                    type="text"
                                                                    className="am-input as-price-input"
                                                                    placeholder="0.00"
                                                                    value={price}
                                                                    onChange={(e) => setPrice(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Duration (span 4) */}
                                                    <div className="am-span-4">
                                                        <div className="am-field">
                                                            <div className="am-field__label">
                                                                <span className="am-field__label-text">Duration</span>
                                                            </div>
                                                            <div className="am-select-wrap">
                                                                <div className="am-select__display">
                                                                    <span className="am-select__value">{duration}</span>
                                                                </div>
                                                                <select
                                                                    className="am-select__native"
                                                                    value={duration}
                                                                    onChange={(e) => setDuration(e.target.value)}
                                                                    aria-label="Duration"
                                                                >
                                                                    {DURATION_OPTIONS.map(d => (
                                                                        <option key={d} value={d}>{d}</option>
                                                                    ))}
                                                                </select>
                                                                <div className="am-select__chevron">
                                                                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d={SVG_CHEVRON_DOWN} fillRule="evenodd" clipRule="evenodd" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Add extra time + Options row (span 12) */}
                                                    <div className="am-span-12">
                                                        <div className="as-action-row">
                                                            {/* Add extra time button */}
                                                            <button type="button" className="as-btn-extra-time">
                                                                <svg className="as-btn-extra-time__icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d={SVG_PLUS} fillRule="evenodd" clipRule="evenodd" />
                                                                </svg>
                                                                <span className="as-btn-extra-time__text">Add extra time</span>
                                                            </button>

                                                            {/* Options button */}
                                                            <button type="button" className="as-btn-options">
                                                                <span className="as-btn-options__text">Options</span>
                                                                <svg className="as-btn-options__icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d={SVG_CHEVRON_DOWN} fillRule="evenodd" clipRule="evenodd" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* ════════════════════════════════════
                                       TEAM MEMBERS (activeNav === 'teamMembers')
                                       ════════════════════════════════════ */}
                                    {activeNav === 'teamMembers' && (
                                        <div className="tm-root">{/* el-0 */}
                                            <div className="tm-wrapper">{/* el-1 */}
                                                <div className="tm-content">{/* el-2 */}

                                                    {/* ── Header (el-3 → el-7) ── */}
                                                    <div className="tm-header">{/* el-3 */}
                                                        <div className="tm-header-text">{/* el-4 */}
                                                            <div className="tm-title-row">{/* el-5 */}
                                                                <p className="tm-title">Team members required</p>{/* el-6 */}
                                                            </div>
                                                            <p className="tm-subtitle">Choose which team members will perform this service</p>{/* el-7 */}
                                                        </div>
                                                    </div>

                                                    {/* ── Member list grid (el-8) ── */}
                                                    <div className="tm-list-grid">{/* el-8 */}
                                                        <div className="tm-list-wrap">{/* el-9 */}
                                                            <div className="tm-list">{/* el-12 */}

                                                                {/* ── ROW: All team members (el-13) ── */}
                                                                <div className="tm-row tm-row--all" onClick={toggleAll}>{/* el-13 */}
                                                                    <button type="button" className="tm-row__btn" tabIndex={0} />{/* el-14 */}
                                                                    <div className="tm-row__grid">{/* el-15 */}

                                                                        {/* PREFIX: checkbox */}
                                                                        <div className="tm-row__prefix">{/* el-16 */}
                                                                            <div className="tm-prefix-inner">{/* el-17 */}
                                                                                <div className="tm-prefix-flex">{/* el-18 */}
                                                                                    <label className="tm-checkbox-label">{/* el-19 */}
                                                                                        <span className={`tm-checkbox ${allChecked || someChecked ? 'tm-checkbox--checked' : 'tm-checkbox--unchecked'}`}>{/* el-20 */}
                                                                                            {/* Indeterminate = minus icon, All checked = checkmark */}
                                                                                            {someChecked && (
                                                                                                <span className="tm-checkbox__icon-wrap">{/* el-21 */}
                                                                                                    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">{/* el-22 */}
                                                                                                        <path d={SVG_MINUS} />{/* el-23 */}
                                                                                                    </svg>
                                                                                                </span>
                                                                                            )}
                                                                                            {allChecked && (
                                                                                                <span className="tm-check-container">{/* el-42 */}
                                                                                                    <span className="tm-check-v" />{/* el-43 */}
                                                                                                    <span className="tm-check-h" />{/* el-44 */}
                                                                                                </span>
                                                                                            )}
                                                                                        </span>
                                                                                        <div className="tm-sr-only">{/* el-24 */}
                                                                                            <p>All team members</p>{/* el-25 */}
                                                                                        </div>
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            className="tm-checkbox-input"
                                                                                            checked={allChecked}
                                                                                            onChange={toggleAll}
                                                                                            aria-label="All team members"
                                                                                            tabIndex={0}
                                                                                        />{/* el-26 */}
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* MAIN: text + badge */}
                                                                        <div className="tm-row__main">{/* el-27 */}
                                                                            <div className="tm-main-inner">{/* el-28 */}
                                                                                <div className="tm-main-align">{/* el-29 */}
                                                                                    <div className="tm-all-text-flex">{/* el-30 */}
                                                                                        <p className="tm-all-title">All team members</p>{/* el-31 */}
                                                                                        <div className="tm-badge">{/* el-32 */}
                                                                                            <span className="tm-badge__text">{checkedMembers.size}</span>{/* el-33 */}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                </div>

                                                                {/* ── Individual member rows ── */}
                                                                {TEAM_MEMBERS.map((member, idx) => {
                                                                    const isChecked = checkedMembers.has(member.id);
                                                                    const isLast = idx === TEAM_MEMBERS.length - 1;
                                                                    return (
                                                                        <div
                                                                            key={member.id}
                                                                            className="tm-row tm-row--member"
                                                                            onClick={() => toggleMember(member.id)}
                                                                        >{/* el-34/57 */}
                                                                            <button type="button" className="tm-row__btn" tabIndex={0} />{/* el-35/58 */}
                                                                            <div className="tm-row__grid">{/* el-36/59 */}

                                                                                {/* PREFIX: checkbox + avatar */}
                                                                                <div className="tm-row__prefix">{/* el-37/60 */}
                                                                                    <div className="tm-prefix-inner">{/* el-38/61 */}
                                                                                        <div className="tm-prefix-flex">{/* el-39/62 */}
                                                                                            <label className="tm-checkbox-label">{/* el-40/63 */}
                                                                                                <span className={`tm-checkbox ${isChecked ? 'tm-checkbox--checked' : 'tm-checkbox--unchecked'}`}>{/* el-41/64 */}
                                                                                                    {isChecked && (
                                                                                                        <span className="tm-check-container">{/* el-42 */}
                                                                                                            <span className="tm-check-v" />{/* el-43 */}
                                                                                                            <span className="tm-check-h" />{/* el-44 */}
                                                                                                        </span>
                                                                                                    )}
                                                                                                </span>
                                                                                                <div className="tm-sr-only">{/* el-45/65 */}
                                                                                                    <p>{member.name}</p>{/* el-46/66 */}
                                                                                                </div>
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    className="tm-checkbox-input"
                                                                                                    checked={isChecked}
                                                                                                    onChange={() => toggleMember(member.id)}
                                                                                                    aria-label={member.name}
                                                                                                    tabIndex={0}
                                                                                                />{/* el-47/67 */}
                                                                                            </label>

                                                                                            {/* Avatar (el-48/68) */}
                                                                                            <div className="asm-avatar">{/* el-48/68 */}
                                                                                                <div className="asm-avatar__inner">{/* el-49/69 */}
                                                                                                    <span className="asm-avatar__initials">{member.initials}</span>{/* el-50/70 */}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* MAIN: name */}
                                                                                <div className="tm-row__main">{/* el-51/71 */}
                                                                                    <div className="tm-main-inner">{/* el-52/72 */}
                                                                                        <div className="tm-main-align">{/* el-53/73 */}
                                                                                            <div className="tm-name-wrap">{/* el-54/74 */}
                                                                                                <p className="tm-name">{member.name}</p>{/* el-55/75 */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* BORDER: divider (el-56/76) */}
                                                                                {!isLast && <hr className="tm-row__divider" />}

                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}

                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>

                                {/* ════════════════════════════════════
                                   SIDEBAR COLUMN
                                   ════════════════════════════════════ */}
                                <div className="am-sidebar">
                                    <div className="am-sidebar__inner">
                                        <nav className="am-nav" id="navigation">
                                            <div className="am-nav__card">
                                                <div className="am-nav__border" />
                                                <div className="am-nav__content" id="inner-navigation">
                                                    <ul className="am-nav__list">
                                                        {SIDEBAR_GROUPS.map((group, groupIdx) => (
                                                            <React.Fragment key={group.title || `group-${groupIdx}`}>
                                                                <li className="am-nav__group">
                                                                    {/* Group header — only if title exists */}
                                                                    {group.title && (
                                                                        <div className="am-nav__group-header">
                                                                            <span className="am-nav__group-title">{group.title}</span>
                                                                        </div>
                                                                    )}
                                                                    {/* Sub list */}
                                                                    <ul className="am-nav__sublist">
                                                                        {group.items.map(item => (
                                                                            <li
                                                                                key={item.id}
                                                                                className={`am-nav__item ${activeNav === item.id ? 'am-nav__item--active' : ''}`}
                                                                                onClick={() => setActiveNav(item.id)}
                                                                            >
                                                                                <button type="button" className="am-nav__item-btn" tabIndex={0} />
                                                                                <span className="am-nav__item-text">{item.label}</span>
                                                                                {item.badge !== undefined && (
                                                                                    <span className="am-nav__badge">
                                                                                        <span className="am-nav__badge-text">{item.badge}</span>
                                                                                    </span>
                                                                                )}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </li>
                                                                {/* Divider between groups (not after last) */}
                                                                {groupIdx < SIDEBAR_GROUPS.length - 1 && (
                                                                    <li className="am-nav__divider-container">
                                                                        <hr className="am-nav__divider" />
                                                                    </li>
                                                                )}
                                                            </React.Fragment>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </nav>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
