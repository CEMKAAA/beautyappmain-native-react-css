import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import './AddCategoryModal.css';

/* ── Fresha Renk Paleti ── */
const COLOR_OPTIONS = [
    { key: 'blue', label: 'Blue', color: '#a5dff8' },
    { key: 'dark_blue', label: 'Dark Blue', color: '#97c6f0' },
    { key: 'jordy_blue', label: 'Jordy Blue', color: '#9bbdfd' },
    { key: 'indigo', label: 'Indigo', color: '#a9b3fe' },
    { key: 'lavender', label: 'Lavender', color: '#b7adff' },
    { key: 'purple', label: 'Purple', color: '#c6abf7' },
    { key: 'wisteria', label: 'Wisteria', color: '#e4a3fa' },
    { key: 'pink', label: 'Pink', color: '#f6a2e4' },
    { key: 'coral', label: 'Coral', color: '#ffa3ba' },
    { key: 'blood_orange', label: 'Blood Orange', color: '#ffa275' },
    { key: 'orange', label: 'Orange', color: '#ffbf69' },
    { key: 'amber', label: 'Amber', color: '#fed367' },
    { key: 'yellow', label: 'Yellow', color: '#ffec78' },
    { key: 'lime', label: 'Lime', color: '#e7f286' },
    { key: 'green', label: 'Green', color: '#a6e5bd' },
    { key: 'teal', label: 'Teal', color: '#6cd5cb' },
    { key: 'cyan', label: 'Cyan', color: '#91e8ee' },
];

/* ── SVG Icons ── */
const CloseIcon = () => (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path d="M26.061 23.939a1.503 1.503 0 0 1-2.125 2.125L16 18.125l-7.939 7.936a1.5 1.5 0 1 1-2.122-2.122L13.876 16l-7.94-7.94a1.502 1.502 0 0 1 2.125-2.124L16 13.876l7.94-7.94a1.502 1.502 0 0 1 2.124 2.125L18.125 16z" />
    </svg>
);

const ChevronIcon = () => (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path d="M28.061 11.061 16 23.122 3.939 11.06a1.5 1.5 0 0 1 2.125-2.122L16 18.878l9.939-9.94a1.5 1.5 0 0 1 2.122 2.125z" />
    </svg>
);

const CheckIcon = () => (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path d="m29.061 9.06-16 16a1.5 1.5 0 0 1-2.125 0l-7-7a1.503 1.503 0 1 1 2.125-2.124L12 21.875 26.939 6.938a1.502 1.502 0 1 1 2.125 2.125z" />
    </svg>
);

export default function AddCategoryModal({ open, onClose, onAdd }) {
    const [name, setName] = useState('');
    const [selectedColor, setSelectedColor] = useState('blue');
    const [description, setDescription] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [headerScrolled, setHeaderScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

    const bodyRef = useRef(null);
    const observerRef = useRef(null);
    const scrollTargetRef = useRef(null);
    const nameInputRef = useRef(null);
    const selectBtnRef = useRef(null);

    const currentColor = COLOR_OPTIONS.find(c => c.key === selectedColor) || COLOR_OPTIONS[0];

    /* ── Two-phase animation: mount → make visible ── */
    useEffect(() => {
        if (open) {
            setMounted(true);
        } else {
            setVisible(false);
            const timer = setTimeout(() => setMounted(false), 250);
            return () => clearTimeout(timer);
        }
    }, [open]);

    /* Force browser to paint closed state before animating open */
    useLayoutEffect(() => {
        if (mounted && open && !visible) {
            // Force reflow so the browser paints the closed state
            document.body.offsetHeight;
            const timer = setTimeout(() => setVisible(true), 20);
            return () => clearTimeout(timer);
        }
    }, [mounted, open, visible]);

    /* ── IntersectionObserver: header shadow on scroll ── */
    useEffect(() => {
        if (!mounted) return;

        const target = scrollTargetRef.current;
        const root = bodyRef.current;
        if (!target || !root) return;

        const obs = new IntersectionObserver(
            ([entry]) => setHeaderScrolled(!entry.isIntersecting),
            { root, threshold: 0 }
        );
        obs.observe(target);
        observerRef.current = obs;

        return () => obs.disconnect();
    }, [mounted]);

    /* ── Auto-focus input on open ── */
    useEffect(() => {
        if (visible && nameInputRef.current) {
            setTimeout(() => nameInputRef.current.focus(), 50);
        }
    }, [visible]);

    /* ── Reset on unmount ── */
    useEffect(() => {
        if (!mounted) {
            setName('');
            setSelectedColor('blue');
            setDescription('');
            setDropdownOpen(false);
            setHeaderScrolled(false);
        }
    }, [mounted]);

    const handleAdd = useCallback(() => {
        if (!name.trim()) return;
        onAdd?.({
            name: name.trim(),
            color: selectedColor,
            colorHex: currentColor.color,
            description: description.trim(),
        });
    }, [name, selectedColor, currentColor, description, onAdd]);

    const handleDescriptionChange = useCallback((e) => {
        const val = e.target.value;
        if (val.length <= 255) setDescription(val);
    }, []);

    const handleSelectColor = useCallback((key) => {
        setSelectedColor(key);
        setDropdownOpen(false);
    }, []);

    const handleOverlayClick = useCallback((e) => {
        if (e.target === e.currentTarget) onClose?.();
    }, [onClose]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            if (dropdownOpen) {
                setDropdownOpen(false);
            } else {
                onClose?.();
            }
        }
    }, [dropdownOpen, onClose]);

    /* ── Toggle dropdown & calculate position ── */
    const handleToggleDropdown = useCallback(() => {
        setDropdownOpen(prev => {
            if (!prev && selectBtnRef.current) {
                const rect = selectBtnRef.current.getBoundingClientRect();
                setDropdownPos({
                    top: rect.bottom + 4,
                    left: rect.left,
                    width: rect.width,
                });
            }
            return !prev;
        });
    }, []);

    if (!mounted) return null;

    return (
        <div
            className={`acm-overlay ${!visible ? 'acm-closed' : ''}`}
            onClick={handleOverlayClick}
            onKeyDown={handleKeyDown}
        >
            <div className="acm-scroll">
                <div className="acm-center">
                    <div className="acm-panel" role="dialog" aria-modal="true" aria-label="Add category">

                        {/* ── HEADER ── */}
                        <div className={`acm-header ${headerScrolled ? 'acm-header-scrolled' : ''}`}>
                            <div className="acm-header-inner">
                                <div className="acm-header-title-wrap">
                                    <p className="acm-header-title">Add category</p>
                                </div>
                                <button className="acm-close-btn" onClick={onClose} aria-label="Close modal">
                                    <div className="acm-close-inner">
                                        <span className="acm-icon"><CloseIcon /></span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* ── BODY ── */}
                        <div className="acm-body" ref={bodyRef}>
                            {/* Big title */}
                            <div className="acm-title-section" aria-hidden="true">
                                <p className="acm-big-title">Add category</p>
                            </div>

                            {/* Scroll observer target */}
                            <div className="acm-scroll-observer" ref={scrollTargetRef} />

                            {/* Form */}
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <section className="acm-form-section">
                                    <div className="acm-fields">

                                        {/* ── Row: Category name + Color ── */}
                                        <div className="acm-row">
                                            {/* Category Name */}
                                            <div className="acm-field">
                                                <label className="acm-label-row">
                                                    <span className="acm-label">Category name</span>
                                                </label>
                                                <div className="acm-input-wrap">
                                                    <div className="acm-input-border">
                                                        <input
                                                            ref={nameInputRef}
                                                            className="acm-input"
                                                            type="text"
                                                            placeholder="e.g. Hair Services"
                                                            value={name}
                                                            onChange={e => setName(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Appointment Color */}
                                            <div className="acm-field" style={{ position: 'relative' }}>
                                                <label className="acm-label-row">
                                                    <span className="acm-label">Appointment color</span>
                                                </label>
                                                <div className="acm-input-wrap">
                                                    <button
                                                        ref={selectBtnRef}
                                                        className="acm-select-btn"
                                                        type="button"
                                                        onClick={handleToggleDropdown}
                                                        aria-haspopup="listbox"
                                                        aria-expanded={dropdownOpen}
                                                    >
                                                        <div className="acm-swatch-area">
                                                            <div
                                                                className="acm-color-circle"
                                                                style={{ backgroundColor: currentColor.color }}
                                                            />
                                                        </div>
                                                        <div className="acm-value-area">
                                                            <span className="acm-value-text">{currentColor.label}</span>
                                                        </div>
                                                        <div className="acm-chevron-area">
                                                            <span className="acm-icon-sm"><ChevronIcon /></span>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── Description ── */}
                                        <div style={{ position: 'relative' }}>
                                            <div className="acm-field">
                                                <label className="acm-label-row">
                                                    <span className="acm-label">Description</span>
                                                    <span className="acm-counter">{description.length}/255</span>
                                                </label>
                                                <div className="acm-input-wrap">
                                                    <div className="acm-input-border acm-textarea-border">
                                                        <textarea
                                                            className="acm-textarea"
                                                            value={description}
                                                            onChange={handleDescriptionChange}
                                                            maxLength={255}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* ── FOOTER ── */}
                        <div className="acm-footer">
                            <div className="acm-btn-group">
                                <button className="acm-btn" onClick={onClose}>
                                    <div className="acm-btn-cancel-inner">
                                        <span className="acm-btn-label-wrap">
                                            <span className="acm-btn-label">Cancel</span>
                                        </span>
                                    </div>
                                </button>
                                <button className="acm-btn" onClick={handleAdd}>
                                    <div className="acm-btn-add-inner">
                                        <span className="acm-btn-label-wrap">
                                            <span className="acm-btn-label">Add</span>
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ── Color Dropdown (portal-style, position: fixed) ── */}
            {dropdownOpen && (
                <div className="acm-dropdown-backdrop" onClick={() => setDropdownOpen(false)} />
            )}
            <div
                className={`acm-color-dropdown-wrap ${dropdownOpen ? 'acm-dropdown-open' : ''}`}
                style={{
                    position: 'fixed',
                    top: dropdownPos.top,
                    left: dropdownPos.left,
                    width: dropdownPos.width,
                }}
            >
                <ul className="acm-color-dropdown" role="listbox" aria-label="Appointment color">
                    {COLOR_OPTIONS.map(opt => (
                        <li
                            key={opt.key}
                            className="acm-color-option"
                            role="option"
                            aria-selected={opt.key === selectedColor}
                            onClick={() => handleSelectColor(opt.key)}
                        >
                            <span className="acm-color-option-swatch">
                                <div
                                    className="acm-color-circle"
                                    style={{ backgroundColor: opt.color }}
                                />
                            </span>
                            <span className="acm-color-option-label">{opt.label}</span>
                            {opt.key === selectedColor && (
                                <span className="acm-color-option-check">
                                    <CheckIcon />
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
