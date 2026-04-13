import React, { useState } from 'react';
import './ProductFilterModal.css';

/* ═══════════════════════════════════════════════════
   SVG Paths — extracted from computed-styles.json
   ═══════════════════════════════════════════════════ */

// el-10: Close X icon
const SVG_CLOSE = "M7.293 7.293a1 1 0 0 1 1.414 0L16 14.586l7.293-7.293a1 1 0 1 1 1.414 1.414L17.414 16l7.293 7.293a1 1 0 0 1-1.414 1.414L16 17.414l-7.293 7.293a1 1 0 0 1-1.414-1.414L14.586 16 7.293 8.707a1 1 0 0 1 0-1.414z";

// el-46: Location pin icon
const SVG_LOCATION = "M16 8a5 5 0 1 0 0 10 5 5 0 0 0 0-10m0 8a3 3 0 1 1 0-5.999A3 3 0 0 1 16 16m0-14A11.013 11.013 0 0 0 5 13c0 3.925 1.814 8.085 5.25 12.031a65.255 65.255 0 0 0 4.461 4.789l.018.018a1.998 1.998 0 0 0 2.542 0l.018-.018a65.258 65.258 0 0 0 4.46-4.789C25.186 21.085 27 16.925 27 13A11.013 11.013 0 0 0 16 2m0 27.862a63.083 63.083 0 0 1-4.175-4.522C8.583 21.585 7 17.811 7 13a9 9 0 0 1 18 0c0 4.811-1.583 8.585-4.825 12.34A63.086 63.086 0 0 1 16 29.862";

// el-73/74: Calendar LTR icon (Type section)
const SVG_CALENDAR_LTR = "M22 2a1 1 0 0 0-1 1v1H11V3a1 1 0 1 0-2 0v1H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3V3a1 1 0 0 0-1-1M6 6h3v1a1 1 0 1 0 2 0V6h10v1a1 1 0 1 0 2 0V6h3v5H6zm0 7h20v13H6z";

// el-85/86: Chevron up icon (expanded section)
const SVG_CHEVRON_UP = "M15.293 12.293a1 1 0 0 1 1.414 0l6.25 6.25a1 1 0 0 1-1.414 1.414L16 14.414l-5.543 5.543a1 1 0 0 1-1.414-1.414z";

// el-57/58: Chevron down icon (collapsed section)
const SVG_CHEVRON_DOWN = "M9.043 12.293a1 1 0 0 1 1.414 0L16 17.836l5.543-5.543a1 1 0 0 1 1.414 1.414l-6.25 6.25a1 1 0 0 1-1.414 0l-6.25-6.25a1 1 0 0 1 0-1.414z";

// el-124/125/126: List LTR icon (Status section)
const SVG_LIST_LTR_LINES = "M22 8a1 1 0 0 0-1-1H5a1 1 0 0 0 0 2h16a1 1 0 0 0 1-1m0 8a1 1 0 0 0-1-1H5a1 1 0 1 0 0 2h16a1 1 0 0 0 1-1m0 8a1 1 0 0 0-1-1H5a1 1 0 1 0 0 2h16a1 1 0 0 0 1-1z";
const SVG_LIST_LTR_DOTS = "M26.5 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m0 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m0 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z";

// el-155/156: Checkmark icon (for selected menu items)
const SVG_CHECKMARK = "m29.061 9.06-16 16a1.5 1.5 0 0 1-2.125 0l-7-7a1.503 1.503 0 1 1 2.125-2.124L12 21.875 26.939 6.938a1.502 1.502 0 1 1 2.125 2.125z";


/* ═══════════════════════════════════════════════════
   Icon Component
   ═══════════════════════════════════════════════════ */
function FilterIcon({ paths, size = 24, viewBox = "0 0 32 32", className = '' }) {
    const pathsArray = Array.isArray(paths) ? paths : [paths];
    return (
        <span className={`filter-modal__icon-span ${className}`}>
            <svg viewBox={viewBox} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                {pathsArray.map((d, i) => (
                    <path key={i} d={d} fillRule="evenodd" clipRule="evenodd" />
                ))}
            </svg>
        </span>
    );
}


/* ═══════════════════════════════════════════════════
   Accordion Section Component
   ═══════════════════════════════════════════════════ */
function AccordionSection({ icon, iconPaths, title, isExpanded, onToggle, badgeCount, onClearSection, children }) {
    return (
        /* el-38/62/112: Accordion section wrapper */
        <div className="filter-modal__accordion-section">
            {/* el-39/63/113: Trigger row */}
            <div className="filter-modal__accordion-trigger-row" onClick={onToggle}>
                {/* el-40/64/114: Trigger button overlay */}
                <button type="button" className="filter-modal__accordion-btn" tabIndex={0} />

                {/* el-41/65/115: Trigger grid */}
                <div className="filter-modal__accordion-grid">
                    {/* el-42/66/116: Prefix icon */}
                    <div className="filter-modal__accordion-prefix">
                        {/* el-43/67/117: Icon cell */}
                        <div className="filter-modal__icon-cell">
                            {/* el-44~46 / el-68~74 / el-118~126: Icon */}
                            {iconPaths ? (
                                <span className="filter-modal__icon-span">
                                    {/* RTL icon hidden */}
                                    <span className="filter-modal__rtl-icon" />
                                    {/* LTR icon */}
                                    <span className="filter-modal__ltr-icon">
                                        <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            {iconPaths.map((d, i) => (
                                                <path key={i} d={d} fillRule="evenodd" clipRule="evenodd" />
                                            ))}
                                        </svg>
                                    </span>
                                    {/* Visible icon */}
                                    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        {iconPaths.map((d, i) => (
                                            <path key={i} d={d} fillRule="evenodd" clipRule="evenodd" />
                                        ))}
                                    </svg>
                                </span>
                            ) : (
                                <FilterIcon paths={icon} />
                            )}
                        </div>
                    </div>

                    {/* el-47~52 / el-75~80 / el-127~132: Main text */}
                    <div className="filter-modal__accordion-main">
                        <div className="filter-modal__accordion-main-inner">
                            <div className="filter-modal__accordion-main-content">
                                {/* el-50/78/130: h3 title */}
                                <h3 className="filter-modal__accordion-title">
                                    {/* el-51/79/131: Title flex */}
                                    <div className="filter-modal__accordion-title-flex">
                                        {/* el-52/80/132: Title text */}
                                        <p className="filter-modal__accordion-title-text">{title}</p>
                                        {/* Badge count */}
                                        {badgeCount > 0 && (
                                            <div className="filter-modal__badge">
                                                <span>{badgeCount}</span>
                                            </div>
                                        )}
                                    </div>
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* el-53~58 / el-81~86 / el-133~138: Suffix chevron */}
                    <div className="filter-modal__accordion-suffix">
                        {/* Per-section Clear button */}
                        <div className="filter-modal__accordion-suffix-meta">
                            {badgeCount > 0 && onClearSection && (
                                <button
                                    type="button"
                                    className="filter-modal__section-clear-btn"
                                    onClick={(e) => { e.stopPropagation(); onClearSection(); }}
                                >
                                    <span>Clear</span>
                                </button>
                            )}
                        </div>
                        {/* el-55/83/135: Icon cell */}
                        <div className="filter-modal__icon-cell">
                            {/* el-56/84/136: Chevron icon */}
                            <FilterIcon paths={isExpanded ? SVG_CHEVRON_UP : SVG_CHEVRON_DOWN} />
                        </div>
                    </div>
                </div>
            </div>

            {/* el-59/87/139: Collapse content */}
            <div className={isExpanded ? 'filter-modal__collapse--open' : 'filter-modal__collapse--closed'}>
                {/* el-60/88/140: Inner div */}
                <div className="filter-modal__collapse-inner">
                    {children}
                </div>
            </div>
        </div>
    );
}


/* ═══════════════════════════════════════════════════
   Checkbox Item Component (for Type section)
   ═══════════════════════════════════════════════════ */
function CheckboxItem({ label, checked, onChange }) {
    return (
        /* el-95/103: Checkbox item row */
        <div className="filter-modal__checkbox-item" onClick={onChange}>
            {/* el-96/104: Item grid */}
            <div className="filter-modal__checkbox-item-grid">
                {/* el-97/105: Prefix */}
                <div className="filter-modal__checkbox-prefix">
                    {/* el-98/106: Icon cell */}
                    <div className="filter-modal__icon-cell">
                        {/* el-99/107: Checkbox box */}
                        <span className={`filter-modal__checkbox-box ${checked ? 'filter-modal__checkbox-box--checked' : ''}`}>
                            {checked && (
                                <span className="filter-modal__check-l">
                                    <span className="filter-modal__check-l-vertical" />
                                    <span className="filter-modal__check-l-horizontal" />
                                </span>
                            )}
                        </span>
                    </div>
                </div>

                {/* el-100/108: Main text */}
                <div className="filter-modal__checkbox-main">
                    {/* el-101/109: Label */}
                    <p className="filter-modal__checkbox-label">{label}</p>
                </div>
            </div>

            {/* el-102/110: Hidden native input */}
            <input
                type="checkbox"
                className="filter-modal__checkbox-input"
                checked={checked}
                onChange={onChange}
                tabIndex={-1}
            />
        </div>
    );
}


/* ═══════════════════════════════════════════════════
   Menu Item Component (for Status section)
   ═══════════════════════════════════════════════════ */
function MenuItem({ label, selected, onClick }) {
    return (
        /* el-144/149/160: Menu item */
        <li className="filter-modal__menu-item" onClick={onClick}>
            {/* el-145/150/161: Button overlay */}
            <button type="button" className="filter-modal__menu-item-btn" tabIndex={0} />

            {/* el-146/151/162: Text block */}
            <span className="filter-modal__menu-item-text-block">
                {/* el-147/152/163: Text inner */}
                <span className="filter-modal__menu-item-text-inner">
                    {/* el-148/153/164: Label */}
                    <p className="filter-modal__menu-item-label">{label}</p>
                </span>
            </span>

            {/* el-154: Checkmark icon (laptop) */}
            <span className={`filter-modal__menu-check-icon ${!selected ? 'filter-modal__menu-check-icon--hidden' : ''}`}>
                <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d={SVG_CHECKMARK} fillRule="evenodd" clipRule="evenodd" />
                </svg>
            </span>

            {/* el-157: Mobile checkmark (hidden on laptop) */}
            <span className="filter-modal__menu-check-mobile" />
        </li>
    );
}


/* ═══════════════════════════════════════════════════
   ProductFilterModal — Main Component
   ═══════════════════════════════════════════════════ */
export default function ProductFilterModal({ isOpen, onClose, onApply, onClear }) {
    // Accordion expand state — Type and Status expanded by default
    const [expandedSections, setExpandedSections] = useState(new Set(['type', 'status']));

    // Checkbox state for Type section
    const [selectedTypes, setSelectedTypes] = useState([]);

    // Menu item state for Status section
    const [selectedStatus, setSelectedStatus] = useState('active');

    const toggleSection = (section) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            if (next.has(section)) {
                next.delete(section);
            } else {
                next.add(section);
            }
            return next;
        });
    };

    const toggleType = (type) => {
        setSelectedTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const handleClear = () => {
        setSelectedTypes([]);
        setSelectedStatus('active');
        if (onClear) onClear();
    };

    const handleApply = () => {
        if (onApply) onApply({ types: selectedTypes, status: selectedStatus });
    };

    return (
        <>
            {/* Backdrop overlay */}
            <div
                className={`filter-modal__backdrop ${isOpen ? 'filter-modal__backdrop--visible' : ''}`}
                onClick={onClose}
            />

            {/* el-0: Root overlay container */}
            <div className={`filter-modal__overlay ${isOpen ? 'filter-modal__overlay--open' : ''}`}>
                {/* el-1: Panel grid */}
                <div className="filter-modal__panel">

                    {/* el-2: Close button area (off-screen left) */}
                    <div className="filter-modal__close-area">
                        {/* el-3: Close button */}
                        <button type="button" className="filter-modal__close-btn" onClick={onClose}>
                            {/* el-4: Close button inner */}
                            <div className="filter-modal__close-btn-inner">
                                {/* el-5: sr-only label */}
                                <span className="filter-modal__close-sr">
                                    {/* el-6: sr-only text */}
                                    <span className="filter-modal__close-sr-text">Close Drawer</span>
                                </span>
                                {/* el-7: Icon wrapper */}
                                <span className="filter-modal__close-icon-wrap">
                                    {/* el-8: Icon span */}
                                    <span className="filter-modal__close-icon-span">
                                        {/* el-9~10: SVG icon */}
                                        <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d={SVG_CLOSE} fillRule="evenodd" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                </span>
                            </div>
                        </button>
                    </div>

                    {/* el-11: Content area */}
                    <div className="filter-modal__content-area">
                        {/* el-12: Content grid (5 rows) */}
                        <div className="filter-modal__content-grid">

                            {/* el-13: Header sticky (z-index 7) */}
                            <div className="filter-modal__header-sticky">
                                {/* el-14: Header bg */}
                                <div className="filter-modal__header-bg" />
                            </div>

                            {/* el-15: Header overlay (z-index 10) */}
                            <div className="filter-modal__header-overlay">
                                {/* el-16: Breadcrumb tab (hidden) */}
                                <div className="filter-modal__breadcrumb-tab">
                                    {/* el-17: Breadcrumb inner */}
                                    <div className="filter-modal__breadcrumb-inner">
                                        {/* el-18: Hidden prefix */}
                                        <div className="filter-modal__breadcrumb-hidden" />
                                        {/* el-19: Breadcrumb title wrap */}
                                        <div className="filter-modal__breadcrumb-title-wrap">
                                            {/* el-20: Breadcrumb title text */}
                                            <span className="filter-modal__breadcrumb-title">All filters</span>
                                        </div>
                                        {/* el-21: Breadcrumb action */}
                                        <div className="filter-modal__breadcrumb-action">
                                            {/* el-22: Back button (hidden) */}
                                            <button className="filter-modal__breadcrumb-back-btn" type="button" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* el-23: Title section */}
                            <div className="filter-modal__title-section">
                                {/* el-24: Hidden status bar */}
                                <div className="filter-modal__status-bar" />
                                {/* el-25: Title padding */}
                                <div className="filter-modal__title-padding">
                                    {/* el-26: Title grid */}
                                    <div className="filter-modal__title-grid">
                                        {/* el-27: Prefix (empty) */}
                                        <div className="filter-modal__title-prefix" />
                                        {/* el-28: Title cell */}
                                        <div className="filter-modal__title-cell">
                                            {/* el-29: Hidden subtitle */}
                                            <div className="filter-modal__subtitle" />
                                            {/* el-30: Title content */}
                                            <div className="filter-modal__title-content">
                                                {/* el-31: h1 */}
                                                <h1 className="filter-modal__h1">All filters</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* el-32: Decorative offset */}
                                <div className="filter-modal__title-deco" />
                            </div>

                            {/* el-33: Body */}
                            <div className="filter-modal__body">
                                {/* el-34: Body flex */}
                                <div className="filter-modal__body-flex">
                                    {/* el-35: Filter groups list */}
                                    <ul className="filter-modal__groups-list">
                                        {/* el-36: Single group container */}
                                        <li className="filter-modal__group-item">
                                            {/* el-37: Accordion items list */}
                                            <ul className="filter-modal__accordion-list">

                                                {/* ═══ LOCATIONS ACCORDION (el-38~60) — collapsed ═══ */}
                                                <AccordionSection
                                                    icon={SVG_LOCATION}
                                                    title="Locations"
                                                    isExpanded={expandedSections.has('locations')}
                                                    onToggle={() => toggleSection('locations')}
                                                >
                                                    {/* el-60: Empty content (hidden when collapsed) */}
                                                </AccordionSection>

                                                {/* el-61: Divider */}
                                                <hr className="filter-modal__divider" />

                                                {/* ═══ TYPE ACCORDION (el-62~110) — expanded ═══ */}
                                                <AccordionSection
                                                    iconPaths={[SVG_CALENDAR_LTR]}
                                                    title="Type"
                                                    isExpanded={expandedSections.has('type')}
                                                    onToggle={() => toggleSection('type')}
                                                    badgeCount={selectedTypes.length}
                                                    onClearSection={() => setSelectedTypes([])}
                                                >
                                                    {/* el-89: Checkbox list */}
                                                    <ul className="filter-modal__checkbox-list">
                                                        {/* el-90: Wrapper */}
                                                        <div className="filter-modal__checkbox-wrap">
                                                            {/* el-91/92: Items container */}
                                                            <div className="filter-modal__checkbox-items">
                                                                {/* el-93: sr-only label */}
                                                                <p className="filter-modal__section-sr-label">Type</p>
                                                                {/* el-94: Checkboxes flex */}
                                                                <div className="filter-modal__checkbox-group">
                                                                    {/* el-95~102: Bookable checkbox */}
                                                                    <CheckboxItem
                                                                        label="Bookable"
                                                                        checked={selectedTypes.includes('bookable')}
                                                                        onChange={() => toggleType('bookable')}
                                                                    />
                                                                    {/* el-103~110: Non-bookable checkbox */}
                                                                    <CheckboxItem
                                                                        label="Non-bookable"
                                                                        checked={selectedTypes.includes('non-bookable')}
                                                                        onChange={() => toggleType('non-bookable')}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </ul>
                                                </AccordionSection>

                                                {/* el-111: Divider */}
                                                <hr className="filter-modal__divider" />

                                                {/* ═══ STATUS ACCORDION (el-112~165) — expanded ═══ */}
                                                <AccordionSection
                                                    iconPaths={[SVG_LIST_LTR_LINES, SVG_LIST_LTR_DOTS]}
                                                    title="Status"
                                                    isExpanded={expandedSections.has('status')}
                                                    onToggle={() => toggleSection('status')}
                                                >
                                                    {/* el-141: Menu list */}
                                                    <ul className="filter-modal__menu-list">
                                                        {/* el-142: Wrapper */}
                                                        <div className="filter-modal__menu-wrap">
                                                            {/* el-143: Menu items flex */}
                                                            <div className="filter-modal__menu-items">
                                                                {/* el-144~148: All team members */}
                                                                <MenuItem
                                                                    label="All team members"
                                                                    selected={selectedStatus === 'all'}
                                                                    onClick={() => setSelectedStatus('all')}
                                                                />
                                                                {/* el-149~159: Active */}
                                                                <MenuItem
                                                                    label="Active"
                                                                    selected={selectedStatus === 'active'}
                                                                    onClick={() => setSelectedStatus('active')}
                                                                />
                                                                {/* el-160~164: Archived */}
                                                                <MenuItem
                                                                    label="Archived"
                                                                    selected={selectedStatus === 'archived'}
                                                                    onClick={() => setSelectedStatus('archived')}
                                                                />
                                                            </div>
                                                        </div>
                                                    </ul>
                                                </AccordionSection>

                                                {/* el-165: Last group separator (hidden) */}
                                                <div className="filter-modal__group-separator" />

                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* el-166: Footer */}
                            <div className="filter-modal__footer">
                                {/* el-167: Footer inner with shadow */}
                                <div className="filter-modal__footer-inner">
                                    {/* el-168: Footer content */}
                                    <div className="filter-modal__footer-content">
                                        {/* el-169: Button row */}
                                        <div className="filter-modal__footer-buttons">
                                            {/* el-170~173: Clear filters button */}
                                            <button
                                                type="button"
                                                className="filter-modal__btn-clear"
                                                onClick={handleClear}
                                            >
                                                {/* el-171: Button inner */}
                                                <div className="filter-modal__btn-clear-inner">
                                                    {/* el-172: Label wrap */}
                                                    <span className="filter-modal__btn-label-wrap">
                                                        {/* el-173: Text */}
                                                        <span className="filter-modal__btn-clear-text">Clear filters</span>
                                                    </span>
                                                </div>
                                            </button>

                                            {/* el-174~177: Apply button */}
                                            <button
                                                type="button"
                                                className="filter-modal__btn-apply"
                                                onClick={handleApply}
                                            >
                                                {/* el-175: Button inner */}
                                                <div className="filter-modal__btn-apply-inner">
                                                    {/* el-176: Label wrap */}
                                                    <span className="filter-modal__btn-apply-label">
                                                        {/* el-177: Text */}
                                                        <span className="filter-modal__btn-apply-text">Apply</span>
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
            </div>
        </>
    );
}
