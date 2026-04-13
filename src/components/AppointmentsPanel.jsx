import React, { useState, useRef, useEffect } from 'react';
import './AppointmentsPanel.css';

/* ═══════════════════════════════════════════════════
   SVG PATHS — From computed-styles.json (orijinal)
   ═══════════════════════════════════════════════════ */

/* el-50/51: Calendar icon */
const SVG_CALENDAR = "M10 2a1 1 0 0 1 1 1v1h10V3a1 1 0 1 1 2 0v1h3a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V3a1 1 0 0 1 1-1M9 6H6v4h20V6h-3v1a1 1 0 1 1-2 0V6H11v1a1 1 0 1 1-2 0zm17 6H6v14h20z";

/* el-38/39: Chevron down */
const SVG_CHEVRON = "M9.043 12.293a1 1 0 0 1 1.414 0L16 17.836l5.543-5.543a1 1 0 0 1 1.414 1.414l-6.25 6.25a1 1 0 0 1-1.414 0l-6.25-6.25a1 1 0 0 1 0-1.414";


/* ═══════════════════════════════════════════════════
   DUMMY APPOINTMENT DATA
   ═══════════════════════════════════════════════════ */
const APPOINTMENTS = [
    {
        id: 1,
        month: 'February',
        title: 'Appointment',
        status: 'booked',
        statusLabel: 'Booked',
        date: 'Fri 20 Feb 11:00',
        staff: 'Hasan',
        services: [
            { name: 'Haircut', price: 'TRY 40', time: '11:00', duration: '50min', staffName: 'Furkan Kem' },
        ],
    },
    {
        id: 2,
        month: 'February',
        title: 'Appointment',
        status: 'started',
        statusLabel: 'Started',
        date: 'Tue 17 Feb 13:00',
        staff: 'Hasan',
        services: [
            { name: 'Hair Color', price: 'TRY 57', time: '13:00', duration: '55min', staffName: 'Furkan Kem' },
        ],
    },
];

/* Tab configs */
const TABS = [
    { id: 'all', label: 'All' },
    { id: 'booked', label: 'Booked' },
    { id: 'confirmed', label: 'Confirmed' },
];


/* ═══════════════════════════════════════════════════
   AppointmentsPanel Component
   ═══════════════════════════════════════════════════ */
export default function AppointmentsPanel() {
    const [activeTab, setActiveTab] = useState('all');
    const tabListRef = useRef(null);
    const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, transform: 'translateX(0)' });

    /* ── Update indicator position when tab changes ── */
    useEffect(() => {
        if (!tabListRef.current) return;
        const activeEl = tabListRef.current.querySelector('.apt-tab--active');
        if (activeEl) {
            const listRect = tabListRef.current.getBoundingClientRect();
            const tabRect = activeEl.getBoundingClientRect();
            setIndicatorStyle({
                width: tabRect.width,
                transform: `translateX(${tabRect.left - listRect.left}px)`,
            });
        }
    }, [activeTab]);

    /* ── Filter appointments by tab ── */
    const filteredAppointments = activeTab === 'all'
        ? APPOINTMENTS
        : APPOINTMENTS.filter(a => a.status === activeTab);

    /* ── Group by month ── */
    const groupedByMonth = filteredAppointments.reduce((acc, apt) => {
        if (!acc[apt.month]) acc[apt.month] = [];
        acc[apt.month].push(apt);
        return acc;
    }, {});

    return (
        <div className="apt-root">
            {/* el-0 */}
            <div className="apt-grid">
                {/* el-1 */}

                {/* ── el-2: Header slot ── */}
                <div className="apt-header-slot">
                    {/* el-3 */}
                    <div className="apt-header-bg" />
                </div>

                {/* ── el-4: Scroll header overlay ── */}
                <div className="apt-scroll-header">
                    {/* el-5 */}
                    <div className="apt-floating-header">
                        {/* el-6 */}
                        <div className="apt-header-row">
                            {/* el-7 */}
                            <div className="apt-back-btn" />
                            {/* el-8 */}
                            <div className="apt-scroll-title-wrap">
                                {/* el-9 */}
                                <span className="apt-scroll-title">Appointments</span>
                            </div>
                            {/* el-10 + el-11 omitted since close is handled by parent drawer */}
                        </div>
                    </div>
                </div>

                {/* ── el-12: Title area ── */}
                <div className="apt-title-area">
                    {/* el-13 */}
                    <div className="apt-title-prefix" />
                    {/* el-14 */}
                    <div className="apt-title-padding">
                        {/* el-15 */}
                        <div className="apt-title-grid">
                            {/* el-16 */}
                            <div className="apt-title-action" />
                            {/* el-17 */}
                            <div className="apt-title-slot">
                                {/* el-18 */}
                                <div className="apt-title-hidden" />
                                {/* el-19 */}
                                <div className="apt-title-inner">
                                    {/* el-20 */}
                                    <h1 className="apt-page-title">Appointments</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* el-21 */}
                    <div className="apt-title-spacer" />
                </div>

                {/* ── el-22: Body area ── */}
                <div className="apt-body">
                    {/* el-23 */}
                    <div className="apt-content">

                        {/* ══════════════════════════════════
                           TAB BAR (el-24 → el-39)
                           ══════════════════════════════════ */}
                        <div className="apt-tabs">
                            {/* el-24 */}
                            <div className="apt-tabs-scroll">
                                {/* el-25 */}

                                {/* el-26: Animated indicator */}
                                <div
                                    className="apt-tab-indicator"
                                    style={indicatorStyle}
                                />

                                {/* el-27: Tab list */}
                                <ul className="apt-tab-list" role="tablist" ref={tabListRef}>
                                    {TABS.map(tab => (
                                        <li
                                            key={tab.id}
                                            className={`apt-tab ${activeTab === tab.id ? 'apt-tab--active' : ''}`}
                                            role="tab"
                                            aria-selected={activeTab === tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                        >
                                            {/* el-29/31/33 */}
                                            <span className="apt-tab-text">{tab.label}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* el-34: "More" button */}
                                <div className="apt-more-wrap">
                                    {/* el-35 */}
                                    <button className="apt-more-btn" role="tab">
                                        {/* el-36 */}
                                        <span className="apt-more-text">More</span>
                                        {/* el-37 */}
                                        <span className="apt-more-chevron">
                                            {/* el-38/39 */}
                                            <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d={SVG_CHEVRON} fillRule="evenodd" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ══════════════════════════════════
                           APPOINTMENT LIST (el-40 → el-135)
                           ══════════════════════════════════ */}
                        <div className="apt-panel" role="tabpanel">
                            {/* el-40 */}
                            <div className="apt-list">
                                {/* el-41 */}
                                {Object.entries(groupedByMonth).map(([month, appointments]) => (
                                    <ol className="apt-month-list" key={month}>
                                        {/* el-42 */}
                                        <li className="apt-month-group">
                                            {/* el-43 */}
                                            {/* el-44 */}
                                            <span className="apt-month-label">{month}</span>

                                            {/* el-45 */}
                                            <ol className="apt-day-list">
                                                {appointments.map((apt, idx) => (
                                                    <li className="apt-row" key={apt.id}>
                                                        {/* el-46/91 */}

                                                        {/* ── Timeline column (el-47/92) ── */}
                                                        <div className="apt-timeline">
                                                            {/* el-48/93: Calendar badge */}
                                                            <div className="apt-timeline-badge">
                                                                {/* el-49/94 */}
                                                                <span className="apt-timeline-icon">
                                                                    {/* el-50/95 + el-51/96 */}
                                                                    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d={SVG_CALENDAR} fillRule="evenodd" clipRule="evenodd" />
                                                                    </svg>
                                                                </span>
                                                            </div>
                                                            {/* el-52/97: Timeline line */}
                                                            {idx < appointments.length - 1 && (
                                                                <span className="apt-timeline-line" />
                                                            )}
                                                        </div>

                                                        {/* ── Card area (el-53/98) ── */}
                                                        <div className="apt-card-outer">
                                                            {/* el-54/99 */}
                                                            <div className="apt-card-container">
                                                                {/* el-55/100: Click overlay */}
                                                                <button className="apt-card-btn" aria-label={`View ${apt.title}`} />

                                                                {/* el-56/101: Card visual */}
                                                                <div className="apt-card">
                                                                    {/* el-57/102: Border overlay */}
                                                                    <div className="apt-card-border" />

                                                                    {/* el-58/103: Content */}
                                                                    <div className="apt-card-padding">
                                                                        {/* el-59/104 */}
                                                                        <div className="apt-card-wrap">
                                                                            {/* el-60/105 */}
                                                                            <div className="apt-card-content">

                                                                                {/* ── Header (el-61/106) ── */}
                                                                                <div className="apt-card-header">
                                                                                    {/* el-62/107 */}
                                                                                    <div className="apt-card-title-row">
                                                                                        {/* el-63/108 */}
                                                                                        <p className="apt-card-title">{apt.title}</p>
                                                                                        {/* el-64/109 */}
                                                                                        <div className={`apt-status-badge apt-status-badge--${apt.status}`}>
                                                                                            {/* el-65/110 */}
                                                                                            <span className="apt-status-text">{apt.statusLabel}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    {/* el-66/111 */}
                                                                                    <div className="apt-card-subtitle">
                                                                                        {/* el-67/112 */}
                                                                                        <p className="apt-card-date">{apt.date}</p>
                                                                                        {/* el-68/113 */}
                                                                                        <div className="apt-card-staff">
                                                                                            {/* el-69/114 */}
                                                                                            <p className="apt-card-dot">•</p>
                                                                                            {/* el-70/115 */}
                                                                                            <p className="apt-card-staff-name">{apt.staff}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* ── Services (el-71/116) ── */}
                                                                                <div className="apt-services">
                                                                                    {apt.services.map((svc, svcIdx) => (
                                                                                        <React.Fragment key={svcIdx}>
                                                                                            {/* el-72/117 */}
                                                                                            <div className="apt-service-row">
                                                                                                {/* el-73/118 */}
                                                                                                <div className="apt-service-item">
                                                                                                    {/* el-74/119 */}
                                                                                                    <div className="apt-service-group">
                                                                                                        {/* el-75/120 */}
                                                                                                        <div className="apt-service-name-row">
                                                                                                            {/* el-76/121 */}
                                                                                                            <p className="apt-service-name">{svc.name}</p>
                                                                                                            {/* el-77/122 */}
                                                                                                            <p className="apt-service-price">{svc.price}</p>
                                                                                                        </div>
                                                                                                        {/* el-78/123 */}
                                                                                                        <div className="apt-service-detail">
                                                                                                            {/* el-79/124 */}
                                                                                                            <p className="apt-service-detail-text">{svc.time}</p>
                                                                                                            {/* el-80/125 */}
                                                                                                            <p className="apt-service-detail-text">•</p>
                                                                                                            {/* el-81/126 */}
                                                                                                            <p className="apt-service-detail-text">{svc.duration}</p>
                                                                                                            {/* el-82/127 */}
                                                                                                            <p className="apt-service-detail-text">•</p>
                                                                                                            {/* el-83/128 */}
                                                                                                            <p className="apt-service-detail-text">{svc.staffName}</p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    {/* el-84/129: Separator */}
                                                                                                    <div className="apt-separator" />
                                                                                                </div>
                                                                                            </div>
                                                                                        </React.Fragment>
                                                                                    ))}
                                                                                </div>

                                                                                {/* ── Footer (el-85/130) ── */}
                                                                                <div className="apt-card-footer">
                                                                                    {/* el-86/131 */}
                                                                                    <div className="apt-checkout-wrap">
                                                                                        {/* el-87/132 */}
                                                                                        <button className="apt-checkout-btn">
                                                                                            {/* el-88/133 */}
                                                                                            <div className="apt-checkout-inner">
                                                                                                {/* el-89/134 */}
                                                                                                <span className="apt-checkout-label-wrap">
                                                                                                    {/* el-90/135 */}
                                                                                                    <span className="apt-checkout-label">Checkout</span>
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
                                                    </li>
                                                ))}
                                            </ol>
                                        </li>
                                    </ol>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
