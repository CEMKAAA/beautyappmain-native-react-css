import { useState, useRef, useCallback } from 'react';
import './BlockTimeDrawer.css';

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

const MoreDotsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="5" r="1.5" fill="currentColor" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        <circle cx="12" cy="19" r="1.5" fill="currentColor" />
    </svg>
);

const CalendarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChevronLeftIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CustomTypeIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const NewTypeIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="rgb(105, 80, 243)" strokeWidth="2" />
        <path d="M12 8v8M8 12h8" stroke="rgb(105, 80, 243)" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

/* ── Block Time Types ── */
const BLOCK_TIME_TYPES = [
    { id: 'custom', name: 'Custom', desc: 'New blocked time', icon: <CustomTypeIcon />, emoji: null },
    { id: 'lunch', name: 'Lunch', desc: '30min • Unpaid', icon: null, emoji: '🥪' },
    { id: 'training', name: 'Training', desc: '1h • Paid', icon: null, emoji: '📚' },
    { id: 'meeting', name: 'Meeting', desc: '1h • Paid', icon: null, emoji: '📆' },
];

/* ── Generate time slots (5-min intervals) ── */
const generateTimeSlots = () => {
    const slots = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 5) {
            const hh = String(h).padStart(2, '0');
            const mm = String(m).padStart(2, '0');
            slots.push(`${hh}:${mm}`);
        }
    }
    return slots;
};
const TIME_SLOTS = generateTimeSlots();

const FREQUENCY_OPTIONS = [
    "Doesn't repeat",
    'Every day',
    'Every week',
    'Every month',
    'Custom',
];

/* ════════════════════════════════════════════
   BlockTimeDrawer Component
   ════════════════════════════════════════════ */
const BlockTimeDrawer = ({ open, onClose }) => {
    const [selectedType, setSelectedType] = useState('custom');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('Wed, 19 Feb 2026');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('09:30');
    const [teamMember, setTeamMember] = useState('Gamze');
    const [frequency, setFrequency] = useState("Doesn't repeat");
    const [notes, setNotes] = useState('');
    const [onlineBooking, setOnlineBooking] = useState(false);
    const carouselRef = useRef(null);

    const handleCarouselScroll = useCallback((direction) => {
        if (carouselRef.current) {
            const amount = direction === 'left' ? -184 : 184;
            carouselRef.current.scrollBy({ left: amount, behavior: 'smooth' });
        }
    }, []);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`bt-drawer-backdrop${open ? ' bt-drawer-backdrop--open' : ''}`}
                onClick={onClose}
            />

            {/* Drawer root */}
            <div className={`bt-drawer-root${open ? ' bt-drawer-root--open' : ''}`}>
                {/* FAB column */}
                <div className="bt-drawer-fab-col">
                    <button className="bt-fab-btn" aria-label="Close Drawer" onClick={onClose}>
                        <div className="bt-fab-btn-inner">
                            <span className="bt-fab-icon-wrap">
                                <span className="bt-fab-icon"><CloseIcon /></span>
                            </span>
                        </div>
                    </button>
                    <button className="bt-fab-btn" aria-label="Minimize">
                        <div className="bt-fab-btn-inner">
                            <span className="bt-fab-icon-wrap">
                                <span className="bt-fab-icon"><MinimizeIcon /></span>
                            </span>
                        </div>
                    </button>
                </div>

                {/* Main panel */}
                <div className="bt-drawer-panel">
                    {/* Header */}
                    <div className="bt-drawer-header">
                        <div className="bt-drawer-title-wrap">
                            <h1 className="bt-drawer-title">Add blocked time</h1>
                        </div>
                        <div className="bt-drawer-header-actions">
                            <button className="bt-header-action-btn" title="Actions">
                                <MoreDotsIcon />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="bt-drawer-body">
                        <form className="bt-form-grid" onSubmit={(e) => e.preventDefault()}>

                            {/* ── Block time type ── */}
                            <div className="bt-col-12 bt-type-section">
                                <p className="bt-type-label">Block time type</p>
                                <div className="bt-type-carousel-wrap">
                                    <button
                                        type="button"
                                        className="bt-carousel-btn bt-carousel-btn--left"
                                        onClick={() => handleCarouselScroll('left')}
                                    >
                                        <ChevronLeftIcon />
                                    </button>

                                    <div className="bt-type-carousel" ref={carouselRef}>
                                        {BLOCK_TIME_TYPES.map((type) => (
                                            <div
                                                key={type.id}
                                                className={`bt-type-card${selectedType === type.id ? ' bt-type-card--selected' : ''}`}
                                                onClick={() => setSelectedType(type.id)}
                                            >
                                                <div className="bt-type-card-inner">
                                                    <div className="bt-type-card-icon">
                                                        {type.emoji ? type.emoji : type.icon}
                                                    </div>
                                                    <div className="bt-type-card-text">
                                                        <p className="bt-type-card-name">{type.name}</p>
                                                        <p className="bt-type-card-desc">{type.desc}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* New type card */}
                                        <div className="bt-type-card bt-type-card--new" onClick={() => { }}>
                                            <div className="bt-type-card-inner">
                                                <div className="bt-type-card-icon">
                                                    <NewTypeIcon />
                                                </div>
                                                <div className="bt-type-card-text">
                                                    <p className="bt-type-card-name">New type</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="bt-carousel-btn bt-carousel-btn--right"
                                        onClick={() => handleCarouselScroll('right')}
                                    >
                                        <ChevronRightIcon />
                                    </button>
                                </div>
                            </div>

                            {/* ── Description (Optional) ── */}
                            <div className="bt-col-12 bt-field-group">
                                <div className="bt-field-label-row">
                                    <span className="bt-field-label">
                                        <span className="bt-field-optional">(Optional)</span>
                                    </span>
                                </div>
                                <div className="bt-input-wrap">
                                    <input
                                        type="text"
                                        className="bt-input"
                                        placeholder="e.g. Lunch break"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* ── Date ── */}
                            <div className="bt-col-12 bt-field-group">
                                <div className="bt-field-label-row">
                                    <span className="bt-field-label">Date</span>
                                </div>
                                <div className="bt-input-wrap">
                                    <input
                                        type="text"
                                        className="bt-input bt-input--date"
                                        value={date}
                                        readOnly
                                    />
                                    <div className="bt-input-suffix">
                                        <CalendarIcon />
                                    </div>
                                </div>
                            </div>

                            {/* ── Start / End time ── */}
                            <div className="bt-col-12 bt-time-grid">
                                {/* Start time */}
                                <div className="bt-col-6 bt-field-group">
                                    <div className="bt-field-label-row">
                                        <span className="bt-field-label">Start time</span>
                                    </div>
                                    <div className="bt-select-wrap">
                                        <div className="bt-select-inner">
                                            <span className="bt-select-value">{startTime}</span>
                                        </div>
                                        <div className="bt-select-chevron">
                                            <ChevronDownIcon />
                                        </div>
                                        <select
                                            className="bt-select-native"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                        >
                                            {TIME_SLOTS.map((t) => (
                                                <option key={`start-${t}`} value={t}>{t}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* End time */}
                                <div className="bt-col-6 bt-field-group">
                                    <div className="bt-field-label-row">
                                        <span className="bt-field-label">End time</span>
                                    </div>
                                    <div className="bt-select-wrap">
                                        <div className="bt-select-inner">
                                            <span className="bt-select-value">{endTime}</span>
                                        </div>
                                        <div className="bt-select-chevron">
                                            <ChevronDownIcon />
                                        </div>
                                        <select
                                            className="bt-select-native"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                        >
                                            {TIME_SLOTS.map((t) => (
                                                <option key={`end-${t}`} value={t}>{t}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* ── Team members ── */}
                            <div className="bt-col-12 bt-field-group">
                                <div className="bt-field-label-row">
                                    <span className="bt-field-label">Team members</span>
                                </div>
                                <div className="bt-select-wrap">
                                    <div className="bt-team-member-inner">
                                        <div className="bt-team-avatar">
                                            <span className="bt-team-avatar-initials">G</span>
                                        </div>
                                        <span className="bt-select-value">{teamMember}</span>
                                    </div>
                                    <div className="bt-select-chevron">
                                        <ChevronDownIcon />
                                    </div>
                                </div>
                            </div>

                            {/* ── Frequency ── */}
                            <div className="bt-col-12 bt-field-group">
                                <div className="bt-field-label-row">
                                    <span className="bt-field-label">Frequency</span>
                                </div>
                                <div className="bt-select-wrap">
                                    <div className="bt-select-inner">
                                        <span className="bt-select-value">{frequency}</span>
                                    </div>
                                    <div className="bt-select-chevron">
                                        <ChevronDownIcon />
                                    </div>
                                    <select
                                        className="bt-select-native"
                                        value={frequency}
                                        onChange={(e) => setFrequency(e.target.value)}
                                    >
                                        {FREQUENCY_OPTIONS.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* ── Description / Notes textarea ── */}
                            <div className="bt-col-12 bt-field-group">
                                <div className="bt-field-label-row">
                                    <span className="bt-field-label">
                                        <span className="bt-field-optional">(Optional)</span>
                                    </span>
                                    <span className="bt-field-counter">{notes.length}/255</span>
                                </div>
                                <div className="bt-textarea-wrap">
                                    <textarea
                                        className="bt-textarea"
                                        placeholder="Add a note..."
                                        maxLength={255}
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* ── Online booking checkbox ── */}
                            <div className="bt-col-12">
                                <label className="bt-checkbox-label">
                                    <span className={`bt-checkbox-box${onlineBooking ? ' bt-checkbox-box--checked' : ''}`}>
                                        {onlineBooking && <CheckIcon />}
                                    </span>
                                    <input
                                        type="checkbox"
                                        className="bt-checkbox-input"
                                        checked={onlineBooking}
                                        onChange={(e) => setOnlineBooking(e.target.checked)}
                                    />
                                    <div className="bt-checkbox-text-wrap">
                                        <p className="bt-checkbox-text">Online booking allowed during blocked time</p>
                                    </div>
                                </label>
                            </div>

                        </form>
                    </div>

                    {/* Footer */}
                    <div className="bt-drawer-footer">
                        <div className="bt-footer-inner">
                            <div className="bt-footer-content">
                                <button type="button" className="bt-save-btn">
                                    <div className="bt-save-btn-inner">
                                        <span className="bt-save-btn-text">Save</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlockTimeDrawer;
