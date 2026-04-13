import React, { useState, useRef, useEffect, useCallback } from 'react';
import './AddProductModal.css';

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
];

// Camera icon for Product photos
const SVG_CAMERA = "M16 20a4 4 0 1 0 0-8 4 4 0 0 0 0 8m0-2a2 2 0 1 1 0-4 2 2 0 0 1 0 4m10-7h-3.465l-1.703-2.555A2 2 0 0 0 19.168 7H12.83a2 2 0 0 0-1.664.891L9.465 11H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V13a2 2 0 0 0-2-2m0 13H6V13h4.535l2.13-3.195a.5.5 0 0 1 .166-.138L12.831 9h6.337l.002.668 2.295 3.332H26z";


/* ═══════════════════════════════════════════════════
   AddProductModal Component
   ═══════════════════════════════════════════════════ */
export default function AddProductModal({ isOpen, onClose }) {
    // ─── Product State ───
    const [productName, setProductName] = useState('');
    const [barcode, setBarcode] = useState('');
    const [brand, setBrand] = useState('');
    const [measure, setMeasure] = useState('milliliters');
    const [amount, setAmount] = useState('');
    const [shortDesc, setShortDesc] = useState('');
    const [productDesc, setProductDesc] = useState('');
    const [category, setCategory] = useState('');
    const [supplyPrice, setSupplyPrice] = useState('');
    const [retailEnabled, setRetailEnabled] = useState(true);
    const [retailPrice, setRetailPrice] = useState('');
    const [markup, setMarkup] = useState('');
    const [tax, setTax] = useState('no_tax');
    const [commissionEnabled, setCommissionEnabled] = useState(true);
    const [sku, setSku] = useState('');
    const [supplier, setSupplier] = useState('');
    const [trackStock, setTrackStock] = useState(true);
    const [currentStock, setCurrentStock] = useState('');
    const [lowStockLevel, setLowStockLevel] = useState('');
    const [reorderQty, setReorderQty] = useState('');
    const [lowStockNotify, setLowStockNotify] = useState(true);
    const [activeNav, setActiveNav] = useState('profile');
    const [headerScrolled, setHeaderScrolled] = useState(false);

    // Refs
    const scrollRef = useRef(null);
    const dialogRef = useRef(null);

    // Measure unit abbreviations
    const MEASURE_OPTIONS = [
        { value: 'milliliters', label: 'Milliliters (ml)', abbr: 'ml' },
        { value: 'liters', label: 'Liters (l)', abbr: 'l' },
        { value: 'fluid_ounces', label: 'Fluid ounces (Fl. oz.)', abbr: 'Fl. oz.' },
        { value: 'grams', label: 'Grams (g)', abbr: 'g' },
        { value: 'kilograms', label: 'Kilograms (kg)', abbr: 'kg' },
        { value: 'gallons', label: 'Gallons (gal)', abbr: 'gal' },
        { value: 'ounces', label: 'Ounces (oz)', abbr: 'oz' },
        { value: 'pounds', label: 'Pounds (lb)', abbr: 'lb' },
        { value: 'centimeters', label: 'Centimeters (cm)', abbr: 'cm' },
        { value: 'feet', label: 'Feet (ft)', abbr: 'ft' },
        { value: 'inches', label: 'Inches (in)', abbr: 'in' },
        { value: 'whole', label: 'A whole product', abbr: '' },
    ];

    const measureAbbr = MEASURE_OPTIONS.find(m => m.value === measure)?.abbr || '';

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

                        {/* ── Sticky Header (el-5) ── */}
                        <div className={`am-header ${headerScrolled ? 'am-header--scrolled' : ''}`}>
                            <div className="am-header__inner">
                                {/* Title (el-8/el-9) */}
                                <div className="am-header__title-col">
                                    <span className="am-header__title">Add new product</span>
                                </div>

                                {/* Buttons (el-10/el-11) */}
                                <div className="am-header__actions">
                                    <div className="am-header__btn-row">
                                        <button type="button" className="am-btn-close" onClick={onClose}>
                                            <div className="am-btn-close__inner">
                                                <span className="am-btn-close__text">Close</span>
                                            </div>
                                        </button>
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
                            <h1 className="am-page-title">Add new product</h1>

                            <div className="am-grid">

                                {/* ════════════════════════════════════
                                   CONTENT COLUMN
                                   ════════════════════════════════════ */}
                                <div className="am-main">

                                    {/* ══════════════════════════════════
                                       SECTION 1: BASIC INFO
                                       ══════════════════════════════════ */}
                                    <div>
                                        <h2 className="am-section__title">Basic info</h2>
                                        <p className="am-section__desc">Add and manage your product details and inventory</p>

                                        <div className="am-form-grid">
                                            {/* Product name (span 12) */}
                                            <div className="am-span-12">
                                                <div className="am-field">
                                                    <div className="am-field__label">
                                                        <span className="am-field__label-text">Product name <span className="am-field__label-required">*</span></span>
                                                    </div>
                                                    <div className="am-input-wrap">
                                                        <input
                                                            type="text"
                                                            className="am-input"
                                                            value={productName}
                                                            onChange={(e) => setProductName(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Product barcode (span 12, optional) */}
                                            <div className="am-span-12">
                                                <div className="am-field">
                                                    <div className="am-field__label">
                                                        <span className="am-field__label-text">Product barcode <span className="am-field__label-optional">(Optional)</span></span>
                                                    </div>
                                                    <div className="am-input-wrap">
                                                        <input
                                                            type="text"
                                                            className="am-input"
                                                            placeholder="UPC, EAN, GTIN"
                                                            value={barcode}
                                                            onChange={(e) => setBarcode(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Product brand (span 12 — link/select) */}
                                            <div className="am-span-12">
                                                <div className="am-field">
                                                    <div className="am-field__label">
                                                        <span className="am-field__label-text">Product brand</span>
                                                    </div>
                                                    <div className="am-select-wrap">
                                                        <div className="am-select__display">
                                                            {brand ? (
                                                                <span className="am-select__value">{brand}</span>
                                                            ) : (
                                                                <span className="am-select__placeholder">Select a brand</span>
                                                            )}
                                                        </div>
                                                        <div className="am-select__chevron">
                                                            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                                                <path d={SVG_CHEVRON_DOWN} fillRule="evenodd" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Measure (span 6) */}
                                            <div className="am-span-6">
                                                <div className="am-field">
                                                    <div className="am-field__label">
                                                        <span className="am-field__label-text">Measure</span>
                                                    </div>
                                                    <div className="am-select-wrap">
                                                        <div className="am-select__display">
                                                            <span className="am-select__value">
                                                                {MEASURE_OPTIONS.find(m => m.value === measure)?.label}
                                                            </span>
                                                        </div>
                                                        <select
                                                            className="am-select__native"
                                                            value={measure}
                                                            onChange={(e) => setMeasure(e.target.value)}
                                                            aria-label="Measure"
                                                        >
                                                            {MEASURE_OPTIONS.map(m => (
                                                                <option key={m.value} value={m.value}>{m.label}</option>
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

                                            {/* Amount (span 6, prefixed input) */}
                                            <div className="am-span-6">
                                                <div className="am-field">
                                                    <div className="am-field__label">
                                                        <span className="am-field__label-text">Amount</span>
                                                    </div>
                                                    <div className="am-input-wrap am-input-wrap--prefixed">
                                                        {measureAbbr && <span className="am-input-prefix">{measureAbbr}</span>}
                                                        <input
                                                            type="number"
                                                            className="am-input"
                                                            placeholder="0.00"
                                                            inputMode="decimal"
                                                            value={amount}
                                                            onChange={(e) => setAmount(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Short description (span 12) */}
                                            <div className="am-span-12">
                                                <div className="am-field">
                                                    <div className="am-field__label">
                                                        <span className="am-field__label-text">Short description</span>
                                                        <span className="am-field__label-counter">{shortDesc.length}/100</span>
                                                    </div>
                                                    <div className="am-input-wrap">
                                                        <input
                                                            type="text"
                                                            className="am-input"
                                                            value={shortDesc}
                                                            onChange={(e) => {
                                                                if (e.target.value.length <= 100) setShortDesc(e.target.value);
                                                            }}
                                                            maxLength={100}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Product description (span 12, textarea) */}
                                            <div className="am-span-12">
                                                <div className="am-field">
                                                    <div className="am-field__label">
                                                        <span className="am-field__label-text">Product description</span>
                                                        <span className="am-field__label-counter">{productDesc.length}/1000</span>
                                                    </div>
                                                    <div className="am-textarea-wrap">
                                                        <textarea
                                                            className="am-textarea"
                                                            value={productDesc}
                                                            onChange={(e) => {
                                                                if (e.target.value.length <= 1000) setProductDesc(e.target.value);
                                                            }}
                                                            maxLength={1000}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Product category (span 12 — link/select) */}
                                            <div className="am-span-12">
                                                <div className="am-field">
                                                    <div className="am-field__label">
                                                        <span className="am-field__label-text">Product category</span>
                                                    </div>
                                                    <div className="am-select-wrap">
                                                        <div className="am-select__display">
                                                            {category ? (
                                                                <span className="am-select__value">{category}</span>
                                                            ) : (
                                                                <span className="am-select__placeholder">Select a category</span>
                                                            )}
                                                        </div>
                                                        <div className="am-select__chevron">
                                                            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                                                <path d={SVG_CHEVRON_DOWN} fillRule="evenodd" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ══════════════════════════════════
                                       SECTION 2: PRICING
                                       ══════════════════════════════════ */}
                                    <div>
                                        <h2 className="am-section__title">Pricing</h2>

                                        <div className="am-form-grid">
                                            {/* Supply price (span 12, TRY prefix) */}
                                            <div className="am-span-12">
                                                <div className="am-field">
                                                    <div className="am-field__label">
                                                        <span className="am-field__label-text">Supply price</span>
                                                    </div>
                                                    <div className="am-input-wrap am-input-wrap--prefixed">
                                                        <span className="am-input-prefix">TRY</span>
                                                        <input
                                                            type="number"
                                                            className="am-input"
                                                            placeholder="0.00"
                                                            inputMode="decimal"
                                                            value={supplyPrice}
                                                            onChange={(e) => setSupplyPrice(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ── Retail Sales subsection ── */}
                                            <div className="am-span-12">
                                                <div className="am-subsection">
                                                    <div className="am-subsection__header">
                                                        <div className="am-subsection__text">
                                                            <span className="am-subsection__title">Retail sales</span>
                                                            <span className="am-subsection__desc">Allow sales of this product at checkout.</span>
                                                        </div>
                                                        <label className="am-toggle">
                                                            <input
                                                                type="checkbox"
                                                                className="am-toggle__input"
                                                                checked={retailEnabled}
                                                                onChange={(e) => setRetailEnabled(e.target.checked)}
                                                            />
                                                            <span className="am-toggle__track">
                                                                <span className="am-toggle__knob" />
                                                            </span>
                                                        </label>
                                                    </div>

                                                    {retailEnabled && (
                                                        <div className="am-form-grid">
                                                            {/* Retail price (span 6) */}
                                                            <div className="am-span-6">
                                                                <div className="am-field">
                                                                    <div className="am-field__label">
                                                                        <span className="am-field__label-text">Retail price</span>
                                                                    </div>
                                                                    <div className="am-input-wrap am-input-wrap--prefixed">
                                                                        <span className="am-input-prefix">TRY</span>
                                                                        <input
                                                                            type="number"
                                                                            className="am-input"
                                                                            placeholder="0.00"
                                                                            inputMode="decimal"
                                                                            value={retailPrice}
                                                                            onChange={(e) => setRetailPrice(e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Markup (span 6, % prefix) */}
                                                            <div className="am-span-6">
                                                                <div className="am-field">
                                                                    <div className="am-field__label">
                                                                        <span className="am-field__label-text">Markup</span>
                                                                    </div>
                                                                    <div className="am-input-wrap am-input-wrap--prefixed">
                                                                        <span className="am-input-prefix">%</span>
                                                                        <input
                                                                            type="number"
                                                                            className="am-input"
                                                                            placeholder="0.00"
                                                                            inputMode="decimal"
                                                                            value={markup}
                                                                            onChange={(e) => setMarkup(e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Tax (span 12) */}
                                                            <div className="am-span-12">
                                                                <div className="am-field">
                                                                    <div className="am-field__label">
                                                                        <span className="am-field__label-text">Tax</span>
                                                                    </div>
                                                                    <div className="am-select-wrap">
                                                                        <div className="am-select__display">
                                                                            <span className="am-select__value">
                                                                                {tax === 'no_tax' ? 'Default: No tax' : 'No tax'}
                                                                            </span>
                                                                        </div>
                                                                        <select
                                                                            className="am-select__native"
                                                                            value={tax}
                                                                            onChange={(e) => setTax(e.target.value)}
                                                                            aria-label="Tax"
                                                                        >
                                                                            <option value="no_tax">Default: No tax</option>
                                                                            <option value="none">No tax</option>
                                                                        </select>
                                                                        <div className="am-select__chevron">
                                                                            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d={SVG_CHEVRON_DOWN} fillRule="evenodd" clipRule="evenodd" />
                                                                            </svg>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* ── Team member commission subsection ── */}
                                            <div className="am-span-12">
                                                <div className="am-subsection">
                                                    <div className="am-subsection__header">
                                                        <div className="am-subsection__text">
                                                            <span className="am-subsection__title">Team member commission</span>
                                                            <span className="am-subsection__desc">Calculate team member commission when the product is sold.</span>
                                                        </div>
                                                        <label className="am-toggle">
                                                            <input
                                                                type="checkbox"
                                                                className="am-toggle__input"
                                                                checked={commissionEnabled}
                                                                onChange={(e) => setCommissionEnabled(e.target.checked)}
                                                            />
                                                            <span className="am-toggle__track">
                                                                <span className="am-toggle__knob" />
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ══════════════════════════════════
                                       SECTION 3: INVENTORY
                                       ══════════════════════════════════ */}
                                    <div>
                                        <h2 className="am-section__title">Inventory</h2>
                                        <p className="am-section__desc">Manage stock levels of this product through Fresha.</p>

                                        <div className="am-form-grid">
                                            {/* SKU (span 12) */}
                                            <div className="am-span-12">
                                                <div className="am-field">
                                                    <div className="am-field__label">
                                                        <span className="am-field__label-text">SKU (Stock Keeping Unit)</span>
                                                    </div>
                                                    <div className="am-input-wrap">
                                                        <input
                                                            type="text"
                                                            className="am-input"
                                                            value={sku}
                                                            onChange={(e) => setSku(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="am-field__links">
                                                        <button type="button" className="am-link-btn">Generate SKU automatically</button>
                                                        <button type="button" className="am-link-btn">Add another SKU code</button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Supplier (span 12 — link/select) */}
                                            <div className="am-span-12">
                                                <div className="am-field">
                                                    <div className="am-field__label">
                                                        <span className="am-field__label-text">Supplier</span>
                                                    </div>
                                                    <div className="am-select-wrap">
                                                        <div className="am-select__display">
                                                            {supplier ? (
                                                                <span className="am-select__value">{supplier}</span>
                                                            ) : (
                                                                <span className="am-select__placeholder">Select a supplier</span>
                                                            )}
                                                        </div>
                                                        <div className="am-select__chevron">
                                                            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                                                <path d={SVG_CHEVRON_DOWN} fillRule="evenodd" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ── Stock quantity subsection ── */}
                                            <div className="am-span-12">
                                                <div className="am-subsection">
                                                    <div className="am-subsection__header">
                                                        <div className="am-subsection__text">
                                                            <span className="am-subsection__title">Stock quantity</span>
                                                        </div>
                                                        <label className="am-toggle">
                                                            <input
                                                                type="checkbox"
                                                                className="am-toggle__input"
                                                                checked={trackStock}
                                                                onChange={(e) => setTrackStock(e.target.checked)}
                                                            />
                                                            <span className="am-toggle__track">
                                                                <span className="am-toggle__knob" />
                                                            </span>
                                                        </label>
                                                    </div>

                                                    {trackStock && (
                                                        <div className="am-form-grid">
                                                            <div className="am-span-12">
                                                                <div className="am-field">
                                                                    <div className="am-field__label">
                                                                        <span className="am-field__label-text">Current stock quantity</span>
                                                                    </div>
                                                                    <div className="am-input-wrap">
                                                                        <input
                                                                            type="number"
                                                                            className="am-input"
                                                                            placeholder="0"
                                                                            value={currentStock}
                                                                            onChange={(e) => setCurrentStock(e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* ── Low stock and reordering subsection ── */}
                                            <div className="am-span-12">
                                                <div className="am-subsection">
                                                    <div className="am-subsection__header">
                                                        <div className="am-subsection__text">
                                                            <span className="am-subsection__title">Low stock and reordering</span>
                                                            <span className="am-subsection__desc">Fresha will automatically notify you when stock is running low.</span>
                                                        </div>
                                                    </div>

                                                    <div className="am-form-grid">
                                                        {/* Low stock level (span 6) */}
                                                        <div className="am-span-6">
                                                            <div className="am-field">
                                                                <div className="am-field__label">
                                                                    <span className="am-field__label-text">Low stock level</span>
                                                                </div>
                                                                <div className="am-input-wrap">
                                                                    <input
                                                                        type="number"
                                                                        className="am-input"
                                                                        placeholder="0"
                                                                        value={lowStockLevel}
                                                                        onChange={(e) => setLowStockLevel(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Reorder quantity (span 6) */}
                                                        <div className="am-span-6">
                                                            <div className="am-field">
                                                                <div className="am-field__label">
                                                                    <span className="am-field__label-text">Reorder quantity</span>
                                                                </div>
                                                                <div className="am-input-wrap">
                                                                    <input
                                                                        type="number"
                                                                        className="am-input"
                                                                        placeholder="0"
                                                                        value={reorderQty}
                                                                        onChange={(e) => setReorderQty(e.target.value)}
                                                                    />
                                                                </div>
                                                                <p className="am-field__helper">The default amount to order</p>
                                                            </div>
                                                        </div>

                                                        {/* Receive low stock notifications toggle (span 12) */}
                                                        <div className="am-span-12">
                                                            <div className="am-subsection__header am-subsection__header--compact">
                                                                <div className="am-subsection__text">
                                                                    <span className="am-subsection__title">Receive low stock notifications</span>
                                                                </div>
                                                                <label className="am-toggle">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="am-toggle__input"
                                                                        checked={lowStockNotify}
                                                                        onChange={(e) => setLowStockNotify(e.target.checked)}
                                                                    />
                                                                    <span className="am-toggle__track">
                                                                        <span className="am-toggle__knob" />
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </div>
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

                                        {/* ── Product Photos Card ── */}
                                        <div className="am-photos">
                                            <div className="am-photos__card">
                                                <div className="am-photos__border" />
                                                <div className="am-photos__content">
                                                    <div className="am-photos__header">
                                                        <p className="am-photos__title">Product photos</p>
                                                        <p className="am-photos__desc">Drag and drop a photo to change the order.</p>
                                                    </div>
                                                    <div className="am-photos__dropzone">
                                                        <div className="am-photos__dropzone-inner">
                                                            <span className="am-photos__icon">
                                                                <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d={SVG_CAMERA} fillRule="evenodd" clipRule="evenodd" />
                                                                </svg>
                                                            </span>
                                                            <span className="am-photos__label">Add a photo</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── Navigation Card ── */}
                                        <nav className="am-nav" id="navigation">
                                            <div className="am-nav__card">
                                                <div className="am-nav__border" />
                                                <div className="am-nav__content" id="inner-navigation">
                                                    <ul className="am-nav__list">
                                                        {SIDEBAR_GROUPS.map((group, groupIdx) => (
                                                            <React.Fragment key={group.title}>
                                                                <li className="am-nav__group">
                                                                    <div className="am-nav__group-header">
                                                                        <span className="am-nav__group-title">{group.title}</span>
                                                                    </div>
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
