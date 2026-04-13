import React, { useState } from 'react';
import './RepeatingShiftsModal.css';

/* ═══════════════════════════════════════════════════
   SVG Icons
   ═══════════════════════════════════════════════════ */
const ChevronDownIcon = () => (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.293 13.707a1 1 0 0 1 1.414-1.414L16 17.586l5.293-5.293a1 1 0 1 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0z" fillRule="evenodd" clipRule="evenodd" />
    </svg>
);

const ShopIcon = () => (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 5C9.925 5 5 9.925 5 16s4.925 11 11 11 11-4.925 11-11S22.075 5 16 5M3 16C3 8.82 8.82 3 16 3s13 5.82 13 13-5.82 13-13 13S3 23.18 3 16" fillRule="evenodd" clipRule="evenodd" />
    </svg>
);

const InfoIcon = () => (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 5C9.925 5 5 9.925 5 16s4.925 11 11 11 11-4.925 11-11S22.075 5 16 5M3 16C3 8.82 8.82 3 16 3s13 5.82 13 13-5.82 13-13 13S3 23.18 3 16" fillRule="evenodd" clipRule="evenodd" />
        <path d="M14 15a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v6a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1v-6a1 1 0 0 1-1-1" fillRule="evenodd" clipRule="evenodd" />
        <path d="M15.75 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
    </svg>
);

const CirclePlusIcon = () => (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 5C9.925 5 5 9.925 5 16s4.925 11 11 11 11-4.925 11-11S22.075 5 16 5M3 16C3 8.82 8.82 3 16 3s13 5.82 13 13-5.82 13-13 13S3 23.18 3 16m13-6a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4h-4a1 1 0 1 1 0-2h4v-4a1 1 0 0 1 1-1" fillRule="evenodd" clipRule="evenodd" />
    </svg>
);

const TrashIcon = () => (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 4a1 1 0 0 0-.707.293L12.586 5H8a1 1 0 0 0 0 2h16a1 1 0 1 0 0-2h-4.586l-.707-.707A1 1 0 0 0 18 4zm-4 6a1 1 0 0 1 1 1v13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V11a1 1 0 1 1 2 0v13a3 3 0 0 1-3 3h-8a3 3 0 0 1-3-3V11a1 1 0 0 1 1-1m4 2a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0v-8a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0v-8a1 1 0 0 1 1-1" fillRule="evenodd" clipRule="evenodd" />
    </svg>
);

/* ═══════════════════════════════════════════════════
   Custom Checkbox
   ═══════════════════════════════════════════════════ */
function Checkbox({ checked }) {
    return (
        <span className={`rsm-checkbox rsm-focus-ring ${checked ? 'rsm-checkbox--checked' : 'rsm-checkbox--unchecked'}`}>
            <span className="rsm-checkbox__mark">
                <span className="rsm-checkbox__mark-v" />
                <span className="rsm-checkbox__mark-h" />
            </span>
        </span>
    );
}

/* ═══════════════════════════════════════════════════
   Select Component (reused for Schedule type & Ends)
   ═══════════════════════════════════════════════════ */
function SelectField({ label, name, value, placeholder, options, onChange }) {
    const isPlaceholder = !value;
    return (
        <div className="rsm-field">
            <label className="rsm-field__label">
                <span className="rsm-field__label-text">{label}</span>
            </label>
            <div className="rsm-select rsm-focus-ring">
                <div className="rsm-select__value">
                    <span className={`rsm-select__text ${isPlaceholder ? 'rsm-select__text--placeholder' : ''}`}>
                        {value || placeholder}
                    </span>
                </div>
                <select className="rsm-select__native" name={name} value={value} onChange={onChange}>
                    {placeholder && <option value="">{placeholder}</option>}
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <div className="rsm-select__chevron">
                    <span className="rsm-select__chevron-icon rsm-icon rsm-icon--20" aria-hidden="true">
                        <ChevronDownIcon />
                    </span>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   Time Select (reused for start / end time)
   ═══════════════════════════════════════════════════ */
function TimeSelect({ label, name, value, options, onChange }) {
    return (
        <div className="rsm-timefield">
            <label className="rsm-field__label rsm-sr-only">
                <span className="rsm-field__label-text">{label}</span>
            </label>
            <div className="rsm-select rsm-focus-ring">
                <div className="rsm-select__value">
                    <span className="rsm-select__text">{value}</span>
                </div>
                <select className="rsm-select__native" name={name} value={value} onChange={onChange}>
                    {options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                <div className="rsm-select__chevron">
                    <span className="rsm-select__chevron-icon rsm-icon rsm-icon--20" aria-hidden="true">
                        <ChevronDownIcon />
                    </span>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   Day Row Data
   ═══════════════════════════════════════════════════ */
const DAYS_DATA = [
    { day: 'Monday', active: true, start: '08:50', end: '19:00', duration: '10h 10min' },
    { day: 'Tuesday', active: true, start: '08:50', end: '19:00', duration: '10h 10min' },
    { day: 'Wednesday', active: true, start: '09:00', end: '19:00', duration: '10h 0min' },
    { day: 'Thursday', active: true, start: '09:00', end: '15:45', duration: '6h 45min' },
    { day: 'Friday', active: true, start: '09:00', end: '18:00', duration: '9h 0min' },
    { day: 'Saturday', active: false, start: '', end: '', duration: '' },
    { day: 'Sunday', active: false, start: '', end: '', duration: '' },
];

/* Generate time options from 00:00 to 23:45 in 5 min increments */
const TIME_OPTIONS = [];
for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 5) {
        TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
}

/* ═══════════════════════════════════════════════════
   DayRow Component
   ═══════════════════════════════════════════════════ */
function DayRow({ day, active, start, end, duration, index }) {
    return (
        <div className={`rsm-dayrow ${!active ? 'rsm-dayrow--inactive' : ''}`}>
            {/* Checkbox + day name (span 3) */}
            <div className="rsm-day__check">
                <div className="rsm-day__check-inner">
                    <label className="rsm-day__label" htmlFor={`input-weeks-${index}`}>
                        <Checkbox checked={active} />
                        <div className="rsm-day__text">
                            <p className="rsm-day__name">{day}</p>
                            {active && duration && (
                                <p className="rsm-day__duration">{duration}</p>
                            )}
                        </div>
                        <input
                            className="rsm-day__input"
                            type="checkbox"
                            id={`input-weeks-${index}`}
                            name={`weeks[0][${index}]`}
                            defaultChecked={active}
                            tabIndex={0}
                        />
                    </label>
                </div>
            </div>

            {/* Time selects (span 9) — only for active days */}
            {active && (
                <div className="rsm-day__times">
                    <div className="rsm-day__times-inner">
                        <div className="rsm-day__times-grid">
                            <TimeSelect
                                label="Choose start time"
                                name={`weeks[0][${index}][0][0]`}
                                value={start}
                                options={TIME_OPTIONS}
                                onChange={() => { }}
                            />
                            <div className="rsm-time-sep">
                                <span className="rsm-time-sep__text">to</span>
                            </div>
                            <TimeSelect
                                label="Choose end time"
                                name={`weeks[0][${index}][0][1]`}
                                value={end}
                                options={TIME_OPTIONS}
                                onChange={() => { }}
                            />
                        </div>
                        {/* Action buttons */}
                        <div className="rsm-day__actions">
                            <button type="button" className="rsm-day__action-btn rsm-btn rsm-focus-ring" aria-label="Add a shift">
                                <div className="rsm-btn__inner rsm-btn__inner--sm">
                                    <span className="rsm-sr-only"><span>Add a shift</span></span>
                                    <span className="rsm-day__action-icon rsm-icon rsm-icon--20" aria-hidden="true">
                                        <CirclePlusIcon />
                                    </span>
                                </div>
                            </button>
                            <button type="button" className="rsm-day__action-btn rsm-btn rsm-focus-ring" aria-label="Remove shift">
                                <div className="rsm-btn__inner rsm-btn__inner--sm">
                                    <span className="rsm-sr-only"><span>Remove shift</span></span>
                                    <span className="rsm-day__action-icon rsm-day__action-icon--danger rsm-icon rsm-icon--20" aria-hidden="true">
                                        <TrashIcon />
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* "Not working" text for inactive rows */}
            {!active && (
                <p className="rsm-day__notworking">Not working</p>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   RepeatingShiftsModal — Main Component
   ═══════════════════════════════════════════════════ */
export default function RepeatingShiftsModal({ isOpen, onClose }) {
    const [scheduleType, setScheduleType] = React.useState('everyWeek');
    const [endsType, setEndsType] = React.useState('');

    return (
        <div className={`rsm-overlay ${isOpen ? 'rsm-overlay--open' : 'rsm-overlay--closed'}`}
            onClick={onClose}
        >
            <div className="rsm-transform">
                <div className="rsm-scroll">
                    <div className="rsm-panel" role="dialog" tabIndex={-1} onClick={(e) => e.stopPropagation()}>

                        {/* ══ Sticky Header ══ */}
                        <div className="rsm-header">
                            <div className="rsm-header__row">
                                <div className="rsm-hidden" />
                                <div className="rsm-header__title">
                                    <span className="rsm-header__title-text">Set Furkan's repeating shifts</span>
                                </div>
                                <div className="rsm-header__actions">
                                    <div className="rsm-header__btns">
                                        <button type="button" className="rsm-btn rsm-btn--lg rsm-focus-ring" onClick={onClose}>
                                            <div className="rsm-btn__inner rsm-btn__inner--outline">
                                                <span className="rsm-btn__label">
                                                    <span className="rsm-btn__text">Close</span>
                                                </span>
                                            </div>
                                        </button>
                                        <button type="button" className="rsm-btn rsm-btn--lg rsm-focus-ring">
                                            <div className="rsm-btn__inner rsm-btn__inner--filled">
                                                <span className="rsm-btn__label" style={{ color: '#fff' }}>
                                                    <span className="rsm-btn__text" style={{ color: '#fff' }}>Save</span>
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <span className="rsm-hidden" />

                        {/* ══ Content ══ */}
                        <div className="rsm-content">
                            <div className="rsm-sentinel" />
                            <div className="rsm-grid">
                                <div className="rsm-grid__inner">

                                    {/* Title area */}
                                    <div className="rsm-title-area">
                                        <div className="rsm-title-wrap">
                                            <div style={{ height: 44 }}>
                                                <div style={{ alignItems: 'center', columnGap: 16, display: 'flex', height: 44, rowGap: 16 }}>
                                                    <h1 className="rsm-page-title">Set Furkan's repeating shifts</h1>
                                                </div>
                                            </div>
                                            <span className="rsm-subtitle">
                                                Set weekly, biweekly or custom shifts. Changes saved will apply to all upcoming shifts for the selected period.{' '}
                                                <a className="rsm-link rsm-focus-ring" href="#" target="_blank" rel="noreferrer">Learn more</a>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content area */}
                                    <div className="rsm-content-area">
                                        <div className="rsm-layout">

                                            {/* ══ Sidebar ══ */}
                                            <div className="rsm-sidebar">
                                                <div className="rsm-sidebar__inner">

                                                    {/* Staff Card */}
                                                    <div className="rsm-staff-card">
                                                        <div className="rsm-staff-card__grid">
                                                            <div className="rsm-staff-card__prefix">
                                                                <div className="rsm-staff-card__avatar-cell">
                                                                    <div className="rsm-staff-card__avatar-wrap">
                                                                        <div className="rsm-staff-card__avatar">
                                                                            <div className="rsm-staff-card__avatar-inner">
                                                                                <span className="rsm-staff-card__icon rsm-icon rsm-icon--24" aria-hidden="true">
                                                                                    <ShopIcon />
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="rsm-staff-card__main">
                                                                <div className="rsm-staff-card__row">
                                                                    <div className="rsm-staff-card__cell">
                                                                        <h3 className="rsm-staff-card__name">Hasan</h3>
                                                                    </div>
                                                                </div>
                                                                <div className="rsm-staff-card__row">
                                                                    <div className="rsm-staff-card__cell">
                                                                        <p className="rsm-staff-card__location">Kızılay, İzmir-1 Caddesi, Ankara</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Settings Card */}
                                                    <div className="rsm-settings">
                                                        <div className="rsm-settings__card">
                                                            <div className="rsm-settings__border" />
                                                            <div className="rsm-settings__body">
                                                                <div className="rsm-settings__fields">
                                                                    <SelectField
                                                                        label="Schedule type"
                                                                        name="recurringPeriodLength"
                                                                        value={scheduleType}
                                                                        onChange={(e) => setScheduleType(e.target.value)}
                                                                        options={[
                                                                            { value: 'everyWeek', label: 'Every week' },
                                                                            { value: 'every2Weeks', label: 'Every 2 weeks' },
                                                                            { value: 'every3Weeks', label: 'Every 3 weeks' },
                                                                            { value: 'every4Weeks', label: 'Every 4 weeks' },
                                                                        ]}
                                                                    />
                                                                    <div className="rsm-datefield">
                                                                        <div className="rsm-datefield__top">
                                                                            <label className="rsm-datefield__label">Start date</label>
                                                                        </div>
                                                                        <div className="rsm-datefield__input" role="button" tabIndex={0}>
                                                                            <div className="rsm-datefield__text">February 22nd, 2026</div>
                                                                            <span className="rsm-datefield__suffix" aria-hidden="true">
                                                                                <ChevronDownIcon />
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <SelectField
                                                                        label="Ends"
                                                                        name="endDateType"
                                                                        value={endsType}
                                                                        placeholder="Select an option"
                                                                        onChange={(e) => setEndsType(e.target.value)}
                                                                        options={[
                                                                            { value: 'never', label: 'Never' },
                                                                            { value: 'onDate', label: 'On a specific date' },
                                                                        ]}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Info Banner */}
                                                    <div className="rsm-info-banner">
                                                        <div className="rsm-info-banner__icon">
                                                            <span className="rsm-info-banner__icon-inner rsm-icon rsm-icon--24" aria-hidden="true">
                                                                <InfoIcon />
                                                            </span>
                                                        </div>
                                                        <div className="rsm-info-banner__body">
                                                            <span className="rsm-info-banner__text">
                                                                Team members will not be scheduled on business closed periods.
                                                            </span>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                            {/* ══ Weekly Schedule ══ */}
                                            <div className="rsm-content-area">
                                                <div className="rsm-schedule">
                                                    <div className="rsm-schedule__inner">
                                                        {/* Header */}
                                                        <div className="rsm-schedule__header">
                                                            <div className="rsm-schedule__header-text">
                                                                <div className="rsm-schedule__header-row">
                                                                    <p className="rsm-schedule__title">Weekly</p>
                                                                </div>
                                                                <p className="rsm-schedule__total">46 hours 5 minutes total</p>
                                                            </div>
                                                        </div>

                                                        {/* Days Grid */}
                                                        <div className="rsm-days">
                                                            {DAYS_DATA.map((d, i) => (
                                                                <DayRow key={d.day} index={i} {...d} />
                                                            ))}
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
            </div>
        </div>
    );
}
