import React, { useState, useRef, useEffect, useCallback } from 'react';
import './AddMemberModal.css';

/* ═══════════════════════════════════════════════════
   SVG Paths — exact from computed-styles.json
   ═══════════════════════════════════════════════════ */

// el-17: Close X icon
const SVG_CLOSE = "M9.293 9.293a1 1 0 0 1 1.414 0L16 14.586l5.293-5.293a1 1 0 1 1 1.414 1.414L17.414 16l5.293 5.293a1 1 0 0 1-1.414 1.414L16 17.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L14.586 16l-5.293-5.293a1 1 0 0 1 0-1.414";

// el-49: Person outline icon (exact from reference)
const SVG_PERSON = "M28.865 26.5c-1.904-3.291-4.837-5.651-8.261-6.77a9 9 0 1 0-9.208 0c-3.424 1.117-6.357 3.477-8.261 6.77a1 1 0 1 0 1.731 1C7.221 23.43 11.384 21 16 21s8.779 2.43 11.134 6.5a1 1 0 1 0 1.731-1M9 12a7 7 0 1 1 7 7 7.007 7.007 0 0 1-7-7";

// el-56: Pencil/edit icon (exact from reference)
const SVG_EDIT = "M21 4a2 2 0 0 0-1.422.593l-15 15A1.99 1.99 0 0 0 4 20.998v5.588a2 2 0 0 0 2 2h5.588c.324 0 .537-.058.758-.15.242-.099.462-.244.647-.429l15-15a2 2 0 0 0 0-2.843l-5.571-5.57A2 2 0 0 0 21 4m-4 6L6 21v5.586h5.586l11-11zm1.414-1.414L24 14.172l2.58-2.592-5.585-5.575z";

// el-344/el-999: Chevron down
const SVG_CHEVRON_DOWN = "M9.043 12.293a1 1 0 0 1 1.414 0L16 17.836l5.543-5.543a1 1 0 0 1 1.414 1.414l-6.25 6.25a1 1 0 0 1-1.414 0l-6.25-6.25a1 1 0 0 1 0-1.414";

// el-891: Calendar icon
const SVG_CALENDAR = "M22 4a1 1 0 1 1 2 0v2h2a3 3 0 0 1 3 3v17a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h2V4a1 1 0 0 1 2 0v2h12zM6 8a1 1 0 0 0-1 1v3h22V9a1 1 0 0 0-1-1zm-1 6v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V14z";


/* ═══════════════════════════════════════════════════
   Country Codes — from el-84 options
   ═══════════════════════════════════════════════════ */
const COUNTRY_CODES = [
    { code: '+93', flag: '🇦🇫', label: 'Afghanistan (+93)' },
    { code: '+355', flag: '🇦🇱', label: 'Albania (+355)' },
    { code: '+213', flag: '🇩🇿', label: 'Algeria (+213)' },
    { code: '+376', flag: '🇦🇩', label: 'Andorra (+376)' },
    { code: '+244', flag: '🇦🇴', label: 'Angola (+244)' },
    { code: '+54', flag: '🇦🇷', label: 'Argentina (+54)' },
    { code: '+374', flag: '🇦🇲', label: 'Armenia (+374)' },
    { code: '+61', flag: '🇦🇺', label: 'Australia (+61)' },
    { code: '+43', flag: '🇦🇹', label: 'Austria (+43)' },
    { code: '+994', flag: '🇦🇿', label: 'Azerbaijan (+994)' },
    { code: '+973', flag: '🇧🇭', label: 'Bahrain (+973)' },
    { code: '+880', flag: '🇧🇩', label: 'Bangladesh (+880)' },
    { code: '+375', flag: '🇧🇾', label: 'Belarus (+375)' },
    { code: '+32', flag: '🇧🇪', label: 'Belgium (+32)' },
    { code: '+55', flag: '🇧🇷', label: 'Brazil (+55)' },
    { code: '+359', flag: '🇧🇬', label: 'Bulgaria (+359)' },
    { code: '+1', flag: '🇨🇦', label: 'Canada (+1)' },
    { code: '+56', flag: '🇨🇱', label: 'Chile (+56)' },
    { code: '+86', flag: '🇨🇳', label: 'China (+86)' },
    { code: '+57', flag: '🇨🇴', label: 'Colombia (+57)' },
    { code: '+385', flag: '🇭🇷', label: 'Croatia (+385)' },
    { code: '+357', flag: '🇨🇾', label: 'Cyprus (+357)' },
    { code: '+420', flag: '🇨🇿', label: 'Czechia (+420)' },
    { code: '+45', flag: '🇩🇰', label: 'Denmark (+45)' },
    { code: '+20', flag: '🇪🇬', label: 'Egypt (+20)' },
    { code: '+372', flag: '🇪🇪', label: 'Estonia (+372)' },
    { code: '+358', flag: '🇫🇮', label: 'Finland (+358)' },
    { code: '+33', flag: '🇫🇷', label: 'France (+33)' },
    { code: '+995', flag: '🇬🇪', label: 'Georgia (+995)' },
    { code: '+49', flag: '🇩🇪', label: 'Germany (+49)' },
    { code: '+30', flag: '🇬🇷', label: 'Greece (+30)' },
    { code: '+852', flag: '🇭🇰', label: 'Hong Kong (+852)' },
    { code: '+36', flag: '🇭🇺', label: 'Hungary (+36)' },
    { code: '+354', flag: '🇮🇸', label: 'Iceland (+354)' },
    { code: '+91', flag: '🇮🇳', label: 'India (+91)' },
    { code: '+62', flag: '🇮🇩', label: 'Indonesia (+62)' },
    { code: '+98', flag: '🇮🇷', label: 'Iran (+98)' },
    { code: '+964', flag: '🇮🇶', label: 'Iraq (+964)' },
    { code: '+353', flag: '🇮🇪', label: 'Ireland (+353)' },
    { code: '+972', flag: '🇮🇱', label: 'Israel (+972)' },
    { code: '+39', flag: '🇮🇹', label: 'Italy (+39)' },
    { code: '+81', flag: '🇯🇵', label: 'Japan (+81)' },
    { code: '+962', flag: '🇯🇴', label: 'Jordan (+962)' },
    { code: '+7', flag: '🇰🇿', label: 'Kazakhstan (+7)' },
    { code: '+254', flag: '🇰🇪', label: 'Kenya (+254)' },
    { code: '+82', flag: '🇰🇷', label: 'South Korea (+82)' },
    { code: '+965', flag: '🇰🇼', label: 'Kuwait (+965)' },
    { code: '+371', flag: '🇱🇻', label: 'Latvia (+371)' },
    { code: '+961', flag: '🇱🇧', label: 'Lebanon (+961)' },
    { code: '+370', flag: '🇱🇹', label: 'Lithuania (+370)' },
    { code: '+352', flag: '🇱🇺', label: 'Luxembourg (+352)' },
    { code: '+60', flag: '🇲🇾', label: 'Malaysia (+60)' },
    { code: '+52', flag: '🇲🇽', label: 'Mexico (+52)' },
    { code: '+212', flag: '🇲🇦', label: 'Morocco (+212)' },
    { code: '+31', flag: '🇳🇱', label: 'Netherlands (+31)' },
    { code: '+64', flag: '🇳🇿', label: 'New Zealand (+64)' },
    { code: '+234', flag: '🇳🇬', label: 'Nigeria (+234)' },
    { code: '+47', flag: '🇳🇴', label: 'Norway (+47)' },
    { code: '+968', flag: '🇴🇲', label: 'Oman (+968)' },
    { code: '+92', flag: '🇵🇰', label: 'Pakistan (+92)' },
    { code: '+51', flag: '🇵🇪', label: 'Peru (+51)' },
    { code: '+63', flag: '🇵🇭', label: 'Philippines (+63)' },
    { code: '+48', flag: '🇵🇱', label: 'Poland (+48)' },
    { code: '+351', flag: '🇵🇹', label: 'Portugal (+351)' },
    { code: '+974', flag: '🇶🇦', label: 'Qatar (+974)' },
    { code: '+40', flag: '🇷🇴', label: 'Romania (+40)' },
    { code: '+7', flag: '🇷🇺', label: 'Russia (+7)' },
    { code: '+966', flag: '🇸🇦', label: 'Saudi Arabia (+966)' },
    { code: '+381', flag: '🇷🇸', label: 'Serbia (+381)' },
    { code: '+65', flag: '🇸🇬', label: 'Singapore (+65)' },
    { code: '+421', flag: '🇸🇰', label: 'Slovakia (+421)' },
    { code: '+386', flag: '🇸🇮', label: 'Slovenia (+386)' },
    { code: '+27', flag: '🇿🇦', label: 'South Africa (+27)' },
    { code: '+34', flag: '🇪🇸', label: 'Spain (+34)' },
    { code: '+46', flag: '🇸🇪', label: 'Sweden (+46)' },
    { code: '+41', flag: '🇨🇭', label: 'Switzerland (+41)' },
    { code: '+886', flag: '🇹🇼', label: 'Taiwan (+886)' },
    { code: '+66', flag: '🇹🇭', label: 'Thailand (+66)' },
    { code: '+90', flag: '🇹🇷', label: 'Turkey (+90)' },
    { code: '+380', flag: '🇺🇦', label: 'Ukraine (+380)' },
    { code: '+971', flag: '🇦🇪', label: 'United Arab Emirates (+971)' },
    { code: '+44', flag: '🇬🇧', label: 'United Kingdom (+44)' },
    { code: '+1', flag: '🇺🇸', label: 'United States (+1)' },
    { code: '+84', flag: '🇻🇳', label: 'Vietnam (+84)' },
];

/* ═══════════════════════════════════════════════════
   Countries — from el-624 options
   ═══════════════════════════════════════════════════ */
const COUNTRIES = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia',
    'Australia', 'Austria', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Belarus', 'Belgium',
    'Brazil', 'Bulgaria', 'Canada', 'Chile', 'China', 'Colombia', 'Croatia', 'Cyprus',
    'Czechia', 'Denmark', 'Egypt', 'Estonia', 'Finland', 'France', 'Georgia', 'Germany',
    'Greece', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq',
    'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'South Korea',
    'Kuwait', 'Latvia', 'Lebanon', 'Lithuania', 'Luxembourg', 'Malaysia', 'Mexico',
    'Morocco', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 'Oman', 'Pakistan',
    'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia',
    'Saudi Arabia', 'Serbia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa',
    'Spain', 'Sweden', 'Switzerland', 'Taiwan', 'Thailand', 'Turkey', 'Ukraine',
    'United Arab Emirates', 'United Kingdom', 'United States', 'Vietnam',
];

/* ═══════════════════════════════════════════════════
   Calendar Colors — from el-902 to el-935
   ═══════════════════════════════════════════════════ */
const CALENDAR_COLORS = [
    { name: 'Blue', color: 'rgb(165, 223, 248)' },
    { name: 'Dark Blue', color: 'rgb(151, 198, 240)' },
    { name: 'Jordy Blue', color: 'rgb(155, 189, 253)' },
    { name: 'Indigo', color: 'rgb(169, 179, 254)' },
    { name: 'Lavender', color: 'rgb(183, 173, 255)' },
    { name: 'Purple', color: 'rgb(198, 171, 247)' },
    { name: 'Wisteria', color: 'rgb(228, 163, 250)' },
    { name: 'Pink', color: 'rgb(246, 162, 228)' },
    { name: 'Coral', color: 'rgb(255, 163, 186)' },
    { name: 'Blood Orange', color: 'rgb(255, 162, 117)' },
    { name: 'Orange', color: 'rgb(255, 191, 105)' },
    { name: 'Amber', color: 'rgb(254, 211, 103)' },
    { name: 'Yellow', color: 'rgb(255, 236, 120)' },
    { name: 'Lime', color: 'rgb(231, 242, 134)' },
    { name: 'Green', color: 'rgb(166, 229, 189)' },
    { name: 'Teal', color: 'rgb(108, 213, 203)' },
    { name: 'Cyan', color: 'rgb(145, 232, 238)' },
];

/* ═══════════════════════════════════════════════════
   Employment Types — from el-995 options
   ═══════════════════════════════════════════════════ */
const EMPLOYMENT_TYPES = [
    { value: 'employee', label: 'Employee' },
    { value: 'selfEmployed', label: 'Self-employed' },
    { value: 'externalLink', label: 'External link' },
];

/* ═══════════════════════════════════════════════════
   Sidebar Navigation Items
   ═══════════════════════════════════════════════════ */
const SIDEBAR_GROUPS = [
    {
        title: 'Personal',
        items: [
            { id: 'profile', label: 'Profile', active: true },
            { id: 'addresses', label: 'Addresses' },
            { id: 'emergencyContacts', label: 'Emergency contacts' },
        ],
    },
    {
        title: 'Workspace',
        items: [
            { id: 'services', label: 'Services', badge: '5' },
            { id: 'locations', label: 'Locations', badge: '1' },
            { id: 'settings', label: 'Settings' },
        ],
    },
    {
        title: 'Pay',
        items: [
            { id: 'wages', label: 'Wages and timesheets' },
            { id: 'commissions', label: 'Commissions' },
            { id: 'payRuns', label: 'Pay runs' },
        ],
    },
];


/* ═══════════════════════════════════════════════════
   AddMemberModal Component
   ═══════════════════════════════════════════════════ */
export default function AddMemberModal({ isOpen, onClose }) {
    // Form state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneCode, setPhoneCode] = useState('+90');
    const [phone, setPhone] = useState('');
    const [additionalPhoneCode, setAdditionalPhoneCode] = useState('+90');
    const [additionalPhone, setAdditionalPhone] = useState('');
    const [country, setCountry] = useState('');
    const [birthdayDayMonth, setBirthdayDayMonth] = useState('');
    const [birthdayYear, setBirthdayYear] = useState('');
    const [selectedColor, setSelectedColor] = useState(0); // Cornflower default
    const [jobTitle, setJobTitle] = useState('');
    const [startDateDayMonth, setStartDateDayMonth] = useState('');
    const [startDateYear, setStartDateYear] = useState('');
    const [endDateDayMonth, setEndDateDayMonth] = useState('');
    const [endDateYear, setEndDateYear] = useState('');
    const [employmentType, setEmploymentType] = useState('');
    const [teamMemberId, setTeamMemberId] = useState('');
    const [notes, setNotes] = useState('');
    const [activeNav, setActiveNav] = useState('profile');
    const [headerScrolled, setHeaderScrolled] = useState(false);

    // Refs
    const scrollRef = useRef(null);
    const dialogRef = useRef(null);

    // Get current phone code display — reference shows just "+90" format
    const getPhoneCodeDisplay = (code) => {
        return code;
    };

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

    // Handle phone code select change
    const handlePhoneCodeChange = (setter) => (e) => {
        setter(e.target.value);
    };

    // Handle employment type change
    const handleEmploymentTypeChange = (e) => {
        setEmploymentType(e.target.value);
    };

    // Handle country change
    const handleCountryChange = (e) => {
        setCountry(e.target.value);
    };

    return (
        <div className={`am-overlay ${isOpen ? 'am-overlay--open' : ''}`}>
            <div className="am-transform">
                <div className="am-scroll" ref={scrollRef}>
                    <div className="am-dialog" role="dialog" tabIndex={-1} ref={dialogRef}>

                        {/* ── Sticky Header (el-5) ── */}
                        <div className={`am-header ${headerScrolled ? 'am-header--scrolled' : ''}`}>
                            <div className="am-header__inner">
                                {/* Title (el-8/el-9) */}
                                <div className="am-header__title-col">
                                    <span className="am-header__title">Add team member</span>
                                </div>

                                {/* Buttons (el-10/el-11) */}
                                <div className="am-header__actions">
                                    <div className="am-header__btn-row">
                                        {/* Close button (el-14) — text only, no icon */}
                                        <button type="button" className="am-btn-close" onClick={onClose}>
                                            <div className="am-btn-close__inner">
                                                <span className="am-btn-close__text">Close</span>
                                            </div>
                                        </button>

                                        {/* Add button (el-18) */}
                                        <button type="button" className="am-btn-add">
                                            <div className="am-btn-add__inner">
                                                <span className="am-btn-add__text">Add</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Main Content (el-23) ── */}
                        <div className="am-content">
                            {/* Big title spanning full width (el-27/el-31) */}
                            <h1 className="am-page-title">Add team member</h1>

                            <div className="am-grid">

                                {/* ════════════════════════════════════
                                   CONTENT COLUMN
                                   ════════════════════════════════════ */}
                                <div className="am-main">

                                    {/* ── Profile Section (el-35) ── */}
                                    <div>
                                        <h2 className="am-section__title">Profile</h2>
                                        <p className="am-section__desc">Manage your team member's personal profile</p>

                                        <div className="am-form-grid">
                                            {/* Avatar (el-44) */}
                                            <div className="am-avatar-container">
                                                <div className="am-avatar">
                                                    <span className="am-avatar__person">
                                                        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                                            <path d={SVG_PERSON} fillRule="evenodd" clipRule="evenodd" />
                                                        </svg>
                                                    </span>
                                                    <button type="button" className="am-avatar__edit">
                                                        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                                            <path d={SVG_EDIT} fillRule="evenodd" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* First name (el-58, span 6) */}
                                            <div className="am-span-6">
                                                <div className="am-field">
                                                    <div className="am-field__label">
                                                        <span className="am-field__label-text">First name <span className="am-field__label-required">*</span></span>
                                                    </div>
                                                    <div className="am-input-wrap">
                                                        <input
                                                            type="text"
                                                            className="am-input"
                                                            value={firstName}
                                                            onChange={(e) => setFirstName(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Last name (el-65, span 6) */}
                                            <div className="am-span-6">
                                                <div className="am-field">
                                                    <div className="am-field__label">
                                                        <span className="am-field__label-text">Last name</span>
                                                    </div>
                                                    <div className="am-input-wrap">
                                                        <input
                                                            type="text"
                                                            className="am-input"
                                                            value={lastName}
                                                            onChange={(e) => setLastName(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Email (el-72, span 6) */}
                                            <div className="am-span-6">
                                                <div className="am-field">
                                                    <div className="am-field__label">
                                                        <span className="am-field__label-text">Email <span className="am-field__label-required">*</span></span>
                                                    </div>
                                                    <div className="am-input-wrap">
                                                        <input
                                                            type="email"
                                                            className="am-input"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Phone number (el-79, span 6) */}
                                            <div className="am-span-6">
                                                <div className="am-field">
                                                    <div className="am-field__label">
                                                        <span className="am-field__label-text">Phone number</span>
                                                    </div>
                                                    <div className="am-phone-group">
                                                        {/* Country code prefix (el-80) */}
                                                        <div className="am-phone-prefix">
                                                            <div className="am-phone-prefix__display">
                                                                <span className="am-phone-prefix__text">
                                                                    {getPhoneCodeDisplay(phoneCode)}
                                                                </span>
                                                            </div>
                                                            <select
                                                                className="am-phone-prefix__select"
                                                                value={phoneCode}
                                                                onChange={handlePhoneCodeChange(setPhoneCode)}
                                                                aria-label="Phone country code"
                                                            >
                                                                {COUNTRY_CODES.map(c => (
                                                                    <option key={`ph-${c.code}-${c.flag}`} value={c.code}>
                                                                        {c.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <div className="am-phone-prefix__chevron">
                                                                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d={SVG_CHEVRON_DOWN} fillRule="evenodd" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        {/* Phone input (el-345) */}
                                                        <div className="am-input-wrap">
                                                            <input
                                                                type="tel"
                                                                className="am-input"
                                                                value={phone}
                                                                onChange={(e) => setPhone(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Additional phone (el-347, span 6) */}
                                            <div className="am-span-6">
                                                <div className="am-field">
                                                    <div className="am-field__label">
                                                        <span className="am-field__label-text">Additional phone number</span>
                                                    </div>
                                                    <div className="am-phone-group">
                                                        <div className="am-phone-prefix">
                                                            <div className="am-phone-prefix__display">
                                                                <span className="am-phone-prefix__text">
                                                                    {getPhoneCodeDisplay(additionalPhoneCode)}
                                                                </span>
                                                            </div>
                                                            <select
                                                                className="am-phone-prefix__select"
                                                                value={additionalPhoneCode}
                                                                onChange={handlePhoneCodeChange(setAdditionalPhoneCode)}
                                                                aria-label="Additional phone country code"
                                                            >
                                                                {COUNTRY_CODES.map(c => (
                                                                    <option key={`aph-${c.code}-${c.flag}`} value={c.code}>
                                                                        {c.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <div className="am-phone-prefix__chevron">
                                                                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d={SVG_CHEVRON_DOWN} fillRule="evenodd" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div className="am-input-wrap">
                                                            <input
                                                                type="tel"
                                                                className="am-input"
                                                                value={additionalPhone}
                                                                onChange={(e) => setAdditionalPhone(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Country (el-618, span 6) */}
                                            <div className="am-span-6">
                                                <div className="am-field">
                                                    <div className="am-field__label">
                                                        <span className="am-field__label-text">Country</span>
                                                    </div>
                                                    <div className="am-select-wrap">
                                                        <div className="am-select__display">
                                                            {country ? (
                                                                <span className="am-select__value">{country}</span>
                                                            ) : (
                                                                <span className="am-select__placeholder">Select country</span>
                                                            )}
                                                        </div>
                                                        <select
                                                            className="am-select__native"
                                                            value={country}
                                                            onChange={handleCountryChange}
                                                            aria-label="Country / Nationality"
                                                        >
                                                            <option value="">Select country</option>
                                                            {COUNTRIES.map(c => (
                                                                <option key={c} value={c}>{c}</option>
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

                                            {/* Birthday + Year (span 6, two labeled fields side by side) */}
                                            <div className="am-span-6">
                                                <div className="am-date-grid">
                                                    <div className="am-date-col-8">
                                                        <div className="am-field">
                                                            <div className="am-field__label">
                                                                <span className="am-field__label-text">Birthday</span>
                                                            </div>
                                                            <div className="am-input-wrap">
                                                                <input
                                                                    type="text"
                                                                    className="am-input"
                                                                    placeholder="Day and month"
                                                                    value={birthdayDayMonth}
                                                                    onChange={(e) => setBirthdayDayMonth(e.target.value)}
                                                                />
                                                                <div className="am-input-suffix">
                                                                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d={SVG_CALENDAR} fillRule="evenodd" clipRule="evenodd" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="am-date-col-4">
                                                        <div className="am-field">
                                                            <div className="am-field__label">
                                                                <span className="am-field__label-text">Year</span>
                                                            </div>
                                                            <div className="am-input-wrap">
                                                                <input
                                                                    type="text"
                                                                    className="am-input"
                                                                    placeholder="Year"
                                                                    value={birthdayYear}
                                                                    onChange={(e) => setBirthdayYear(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Color picker (el-898, span 12) */}
                                            <div className="am-color-container">
                                                <span className="am-color-label">Calendar color</span>
                                                <div className="am-color-grid">
                                                    {CALENDAR_COLORS.map((c, idx) => (
                                                        <div
                                                            key={c.name}
                                                            className={`am-color-swatch ${selectedColor === idx ? 'am-color-swatch--selected' : ''}`}
                                                            title={c.name}
                                                            onClick={() => setSelectedColor(idx)}
                                                        >
                                                            <div
                                                                className="am-color-swatch__inner"
                                                                style={{ backgroundColor: c.color }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Separator */}
                                            <hr className="am-separator" />

                                            {/* Job title (el-937, span 6) */}
                                            <div className="am-span-6">
                                                <div className="am-field">
                                                    <div className="am-field__label">
                                                        <span className="am-field__label-text">Job title</span>
                                                    </div>
                                                    <div className="am-input-wrap">
                                                        <input
                                                            type="text"
                                                            className="am-input"
                                                            value={jobTitle}
                                                            onChange={(e) => setJobTitle(e.target.value)}
                                                        />
                                                    </div>
                                                    <p className="am-field__helper">
                                                        Visible to clients online
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── HR between sections ── */}
                                    <hr className="am-section-separator" />

                                    {/* ── Work Details Section ── */}
                                    <div>
                                        <h2 className="am-section__title">Work details</h2>
                                        <p className="am-section__desc">Manage your team member's start date, and employment details</p>

                                        <div className="am-form-grid">
                                            {/* Start date + Year (span 6) */}
                                            <div className="am-span-6">
                                                <div className="am-date-grid">
                                                    <div className="am-date-col-8">
                                                        <div className="am-field">
                                                            <div className="am-field__label">
                                                                <span className="am-field__label-text">Start date</span>
                                                            </div>
                                                            <div className="am-input-wrap">
                                                                <input
                                                                    type="text"
                                                                    className="am-input"
                                                                    placeholder="Day and month"
                                                                    value={startDateDayMonth}
                                                                    onChange={(e) => setStartDateDayMonth(e.target.value)}
                                                                />
                                                                <div className="am-input-suffix">
                                                                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d={SVG_CALENDAR} fillRule="evenodd" clipRule="evenodd" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="am-date-col-4">
                                                        <div className="am-field">
                                                            <div className="am-field__label">
                                                                <span className="am-field__label-text">Year</span>
                                                            </div>
                                                            <div className="am-input-wrap">
                                                                <input
                                                                    type="text"
                                                                    className="am-input"
                                                                    placeholder="Year"
                                                                    value={startDateYear}
                                                                    onChange={(e) => setStartDateYear(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* End date + Year (span 6) */}
                                            <div className="am-span-6">
                                                <div className="am-date-grid">
                                                    <div className="am-date-col-8">
                                                        <div className="am-field">
                                                            <div className="am-field__label">
                                                                <span className="am-field__label-text">End date</span>
                                                            </div>
                                                            <div className="am-input-wrap">
                                                                <input
                                                                    type="text"
                                                                    className="am-input"
                                                                    placeholder="Day and month"
                                                                    value={endDateDayMonth}
                                                                    onChange={(e) => setEndDateDayMonth(e.target.value)}
                                                                />
                                                                <div className="am-input-suffix">
                                                                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d={SVG_CALENDAR} fillRule="evenodd" clipRule="evenodd" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="am-date-col-4">
                                                        <div className="am-field">
                                                            <div className="am-field__label">
                                                                <span className="am-field__label-text">Year</span>
                                                            </div>
                                                            <div className="am-input-wrap">
                                                                <input
                                                                    type="text"
                                                                    className="am-input"
                                                                    placeholder="Year"
                                                                    value={endDateYear}
                                                                    onChange={(e) => setEndDateYear(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Employment type (span 6) */}
                                            <div className="am-span-6">
                                                <div className="am-field">
                                                    <div className="am-field__label">
                                                        <span className="am-field__label-text">Employment type</span>
                                                    </div>
                                                    <div className="am-select-wrap">
                                                        <div className="am-select__display">
                                                            {employmentType ? (
                                                                <span className="am-select__value">
                                                                    {EMPLOYMENT_TYPES.find(t => t.value === employmentType)?.label}
                                                                </span>
                                                            ) : (
                                                                <span className="am-select__placeholder">Select an option</span>
                                                            )}
                                                        </div>
                                                        <select
                                                            className="am-select__native"
                                                            value={employmentType}
                                                            onChange={handleEmploymentTypeChange}
                                                            aria-label="Employment type"
                                                        >
                                                            <option value="">Select an option</option>
                                                            {EMPLOYMENT_TYPES.map(t => (
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

                                            {/* Team member ID (span 6) */}
                                            <div className="am-span-6">
                                                <div className="am-field">
                                                    <div className="am-field__label">
                                                        <span className="am-field__label-text">Team member ID</span>
                                                    </div>
                                                    <div className="am-input-wrap">
                                                        <input
                                                            type="text"
                                                            className="am-input"
                                                            value={teamMemberId}
                                                            onChange={(e) => setTeamMemberId(e.target.value)}
                                                        />
                                                    </div>
                                                    <p className="am-field__helper">
                                                        An identifier used for external systems like payroll
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Notes (span 12) */}
                                            <div className="am-span-12">
                                                <div className="am-field">
                                                    <div className="am-field__label">
                                                        <span className="am-field__label-text">Notes</span>
                                                        <span className="am-field__label-counter">{notes.length}/1000</span>
                                                    </div>
                                                    <div className="am-textarea-wrap">
                                                        <textarea
                                                            className="am-textarea"
                                                            placeholder="Add a private note only viewable in the team member list"
                                                            value={notes}
                                                            onChange={(e) => {
                                                                if (e.target.value.length <= 1000) {
                                                                    setNotes(e.target.value);
                                                                }
                                                            }}
                                                            maxLength={1000}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ════════════════════════════════════
                                   SIDEBAR COLUMN (el-1017)
                                   ════════════════════════════════════ */}
                                <div className="am-sidebar">
                                    <div className="am-sidebar__inner">
                                        <nav className="am-nav" id="navigation">
                                            <div className="am-nav__card">
                                                <div className="am-nav__border" />
                                                <div className="am-nav__content" id="inner-navigation">
                                                    <ul className="am-nav__list">
                                                        {SIDEBAR_GROUPS.map((group, groupIdx) => (
                                                            <React.Fragment key={group.title}>
                                                                <li className="am-nav__group">
                                                                    {/* Group header */}
                                                                    <div className="am-nav__group-header">
                                                                        <span className="am-nav__group-title">{group.title}</span>
                                                                    </div>
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
