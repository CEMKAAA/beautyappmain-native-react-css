import React, { useState, useEffect, useRef, useCallback } from 'react';
import './TestPage2.css';

/* ─── SVG Icons ─── */
const SearchIcon = () => (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChevronRight = () => (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const BackArrow = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const PersonPlusIcon = () => (
    <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.6667 24.5V22.1667C18.6667 20.929 18.175 19.742 17.2998 18.8668C16.4247 17.9917 15.2377 17.5 14 17.5H5.83333C4.59566 17.5 3.40868 17.9917 2.53351 18.8668C1.65834 19.742 1.16667 20.929 1.16667 22.1667V24.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.91667 12.8333C12.4939 12.8333 14.5833 10.7439 14.5833 8.16667C14.5833 5.5894 12.4939 3.5 9.91667 3.5C7.3394 3.5 5.25 5.5894 5.25 8.16667C5.25 10.7439 7.3394 12.8333 9.91667 12.8333Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M23.3333 9.33333V15.1667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M26.25 12.25H20.4167" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const EmptyCartIcon = () => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="16" width="48" height="40" rx="4" fill="rgb(240, 240, 255)" stroke="rgb(105, 80, 243)" strokeWidth="2" />
        <path d="M8 24H56" stroke="rgb(105, 80, 243)" strokeWidth="2" />
        <circle cx="20" cy="20" r="2" fill="rgb(105, 80, 243)" />
        <circle cx="28" cy="20" r="2" fill="rgb(105, 80, 243)" />
        <rect x="20" y="32" width="24" height="3" rx="1.5" fill="rgb(190, 185, 252)" />
        <rect x="24" y="39" width="16" height="3" rx="1.5" fill="rgb(190, 185, 252)" />
        <path d="M24 12L32 4L40 12" stroke="rgb(105, 80, 243)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const PlusIcon = () => (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 4.16667V15.8333M4.16667 10H15.8333" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CartPlusIcon = () => (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.5 2.5H4.16667L6.23333 12.0833C6.30978 12.4513 6.51065 12.7806 6.80232 13.0156C7.09399 13.2506 7.45862 13.3768 7.83333 13.3733H15.1667C15.5414 13.3768 15.906 13.2506 16.1977 13.0156C16.4894 12.7806 16.6902 12.4513 16.7667 12.0833L17.9333 6.25H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="7.91667" cy="16.6667" r="0.833" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="15.4167" cy="16.6667" r="0.833" stroke="currentColor" strokeWidth="1.5" />
    </svg>
);

const WalkInIcon = () => (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="6" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M14 12L18 14L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 14V20L15 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 20L21 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 16L14 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ClientSearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SpinnerIcon = () => (
    <svg className="qs-tab-spinner" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="2" opacity="0.25" />
        <path d="M14.5 8C14.5 4.41015 11.5899 1.5 8 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const CheckCircle = () => (
    <svg className="qs-tab-check" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="4" fill="currentColor" opacity="0.35" />
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.846 3.403a2.157 2.157 0 0 1 3.05 3.05l-.86.86-3.05-3.05.86-.86Z" />
        <path d="M12.576 5.674l-7.93 7.93a1.685 1.685 0 0 0-.453.823l-.62 2.788a.474.474 0 0 0 .566.566l2.788-.62c.311-.069.6-.222.824-.454l7.93-7.928-3.105-3.105Z" />
    </svg>
);

const TrashIcon = () => (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
        <path fillRule="evenodd" d="M10.879 3.545A3 3 0 0 1 13 2.667h6a3 3 0 0 1 3 3v1h5a1 1 0 1 1 0 2h-1v18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-18H5a1 1 0 0 1 0-2h5v-1a3 3 0 0 1 .879-2.122M8 8.667v18h16v-18zm12-2h-8v-1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1zm-7 6a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0v-8a1 1 0 0 1 1-1m5 1a1 1 0 1 1 2 0v8a1 1 0 1 1-2 0z" clipRule="evenodd" />
    </svg>
);

const SortIcon = () => (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12.5L10 17.5L15 12.5" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 7.5L10 2.5L15 7.5" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const FilterIcon = () => (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 10H15M2.5 5H17.5M7.5 15H12.5" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const KebabDotsIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="5" r="1.5" fill="currentColor" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        <circle cx="12" cy="19" r="1.5" fill="currentColor" />
    </svg>
);

const RemoveIcon = () => (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.16667 10H15.8333" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/* ─── Modal-specific SVG Icons ─── */
const ModalCloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.3 5.71a1 1 0 0 0-1.42 0L12 10.59 7.12 5.71A1 1 0 0 0 5.7 7.12L10.59 12 5.7 16.88a1 1 0 1 0 1.42 1.42L12 13.41l4.88 4.89a1 1 0 0 0 1.42-1.42L13.41 12l4.89-4.88a1 1 0 0 0 0-1.41Z" />
    </svg>
);

const MinusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M5 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const PlusIcon2 = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const ModalTrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 21c-.55 0-1.02-.196-1.412-.587A1.926 1.926 0 0 1 5 19V6H4V4h5V3h6v1h5v2h-1v13c0 .55-.196 1.021-.587 1.413A1.926 1.926 0 0 1 17 21H7ZM17 6H7v13h10V6ZM9 17h2V8H9v9Zm4 0h2V8h-2v9Z" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" />
    </svg>
);

const ChevronUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M14.77 12.79a.75.75 0 0 1-1.06-.02L10 8.832l-3.71 3.938a.75.75 0 1 1-1.08-1.04l4.25-4.5a.75.75 0 0 1 1.08 0l4.25 4.5a.75.75 0 0 1-.02 1.06Z" />
    </svg>
);

/* ─── Data ─── */
const TABS = ['Quick Sale', 'Appointments', 'Services', 'Products', 'Memberships', 'Gift cards'];

const TAB_ITEMS = {
    'Quick Sale': [
        { name: 'Manicure & Pedicure', price: 'TRY 45', duration: '60min', color: 'rgb(165, 223, 248)' },
        { name: 'Haircut', price: 'TRY 40', duration: '50min', color: 'rgb(165, 223, 248)' },
        { name: 'Hair Color', price: 'TRY 57', duration: '55min', color: 'rgb(165, 223, 248)' },
        { name: 'Manicure', price: 'TRY 25', duration: '30min', color: 'rgb(165, 223, 248)' },
        { name: 'Pedicure', price: 'TRY 30', duration: '35min', color: 'rgb(165, 223, 248)' },
    ],
    'Appointments': [],
    'Services': [],
    'Products': [],
    'Memberships': [],
    'Gift cards': [],
};

const SERVICES_CATEGORIES = [
    { name: 'Hair & styling', count: 2, color: 'rgb(165, 223, 248)' },
    { name: 'Nails', count: 3, color: 'rgb(165, 223, 248)' },
];

const CATEGORY_SERVICES = {
    'Hair & styling': [
        { name: 'Hair Color', duration: '55min', price: 'TRY 57', color: 'rgb(165, 223, 248)' },
        { name: 'Haircut', duration: '50min', price: 'TRY 40', color: 'rgb(165, 223, 248)' },
    ],
    'Nails': [
        { name: 'Manicure', duration: '30min', price: 'TRY 25', color: 'rgb(165, 223, 248)' },
        { name: 'Pedicure', duration: '45min', price: 'TRY 30', color: 'rgb(165, 223, 248)' },
        { name: 'Gel Nails', duration: '60min', price: 'TRY 50', color: 'rgb(165, 223, 248)' },
    ],
};

const APPOINTMENT_DATA = [
    {
        id: 1,
        client: 'Walk-In',
        time: '10:10 – 11:45',
        price: 'TRY 87',
        services: [
            { duration: '45min', staff: 'Furkan Kem', name: 'Pedicure' },
            { duration: '45min', staff: 'Furkan Kem', name: 'Hair Color' },
        ],
    },
    {
        id: 2,
        client: 'Ayşe Yılmaz',
        time: '12:00 – 13:00',
        price: 'TRY 120',
        services: [
            { duration: '60min', staff: 'Furkan Kem', name: 'Manicure & Pedicure' },
        ],
    },
    {
        id: 3,
        client: 'Mehmet Kaya',
        time: '14:30 – 15:15',
        price: 'TRY 40',
        services: [
            { duration: '45min', staff: 'Furkan Kem', name: 'Haircut' },
        ],
    },
];

const PRODUCTS_DATA = [
    {
        id: 1,
        name: 'Test',
        price: 'TRY 100',
        stock: 'Out of stock',
        image: 'https://cdn-partners.fresha.com/assets-v2/static/image/placeholder-product.png',
    },
];

/* ─── Sub-Components ─── */

const Breadcrumbs = () => (
    <ul className="qs-breadcrumbs">
        <li className="qs-breadcrumb-item">
            <a className="qs-breadcrumb-link" href="#cart">
                <span>Cart</span>
                <span className="qs-breadcrumb-chevron"><ChevronRight /></span>
            </a>
        </li>
        <li className="qs-breadcrumb-item">
            <div className="qs-breadcrumb-disabled">
                <span>Tip</span>
                <span className="qs-breadcrumb-chevron"><ChevronRight /></span>
            </div>
        </li>
        <li className="qs-breadcrumb-item">
            <div className="qs-breadcrumb-disabled">
                <span>Payment</span>
            </div>
        </li>
    </ul>
);

const TabBar = ({ activeTab, onTabChange, isSearching, searchLoading, tabsWithResults, tabCounts }) => {
    // When searching, show "All" + only tabs that have results
    const searchTabs = isSearching
        ? TABS.filter(t => tabsWithResults.includes(t))
        : TABS;

    const displayTabs = isSearching ? ['All', ...searchTabs] : TABS;
    const currentActive = isSearching ? (activeTab === 'All' ? 'All' : activeTab) : activeTab;

    // Total count for "All" tab
    const totalCount = isSearching ? Object.values(tabCounts).reduce((a, b) => a + b, 0) : 0;

    // Sliding indicator refs
    const tabRefs = useRef({});
    const indicatorRef = useRef(null);

    useEffect(() => {
        const activeEl = tabRefs.current[currentActive];
        const indicator = indicatorRef.current;
        if (activeEl && indicator) {
            const listEl = activeEl.parentElement;
            const listRect = listEl.getBoundingClientRect();
            const tabRect = activeEl.getBoundingClientRect();
            indicator.style.transform = `translateX(${tabRect.left - listRect.left}px)`;
            indicator.style.width = `${tabRect.width}px`;
        }
    }, [currentActive, displayTabs]);

    return (
        <div className="qs-tabs-wrapper">
            <div className="qs-tabs-container">
                <div className="qs-tabs-scroll">
                    {/* Sliding indicator behind active tab */}
                    <div className="qs-tab-indicator" ref={indicatorRef} />
                    <ul className="qs-tabs-list">
                        {displayTabs.map((tab) => {
                            const count = tab === 'All' ? totalCount : (tabCounts[tab] || 0);
                            return (
                                <li
                                    key={tab}
                                    ref={el => { tabRefs.current[tab] = el; }}
                                    className={`qs-tab ${currentActive === tab ? 'active' : ''}`}
                                    onClick={() => onTabChange(tab)}
                                >
                                    <span className="qs-tab-label">{tab}</span>
                                    {isSearching && searchLoading && <SpinnerIcon />}
                                    {isSearching && !searchLoading && count > 0 && (
                                        <span className="qs-tab-count">{count}</span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const ServiceCard = ({ service, searchMode, onAdd }) => (
    <div className={`qs-service-card ${searchMode ? 'search-mode' : ''}`}>
        <button className="qs-service-card-btn" aria-label={`Add ${service.name}`} onClick={() => onAdd && onAdd(service)} />
        <div className="qs-service-color-bar">
            <div className="qs-service-color-bar-inner" style={{ backgroundColor: service.color }} />
        </div>
        <div className="qs-service-info">
            <div className="qs-service-text">
                <p className="qs-service-name">{service.name}</p>
                {service.duration && <p className="qs-service-duration">{service.duration}</p>}
            </div>
            <span className="qs-service-price">{service.price}</span>
        </div>
    </div>
);

/* Category Section for search results */
const CategorySection = ({ category, items, searchQuery }) => {
    const filtered = items.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filtered.length === 0) return null;
    return (
        <div className="qs-category-section">
            <div className="qs-category-header">
                <span className="qs-category-title">{category}</span>
                <span className="qs-category-count">{filtered.length}</span>
            </div>
            <div className="qs-service-grid">
                {filtered.map((service, idx) => (
                    <ServiceCard key={idx} service={service} searchMode />
                ))}
            </div>
        </div>
    );
};

/* ─── Appointment Card ─── */
const AppointmentCard = ({ appointment, isSelected, onSelect }) => (
    <div className="qs-appt-card-outer">
        <div className={`qs-appt-card ${isSelected ? 'selected' : ''}`}>
            <button className="qs-appt-card-overlay" onClick={() => onSelect(appointment.id)} />
            <div className="qs-appt-card-content">
                <div className="qs-appt-row-top">
                    <div className="qs-appt-client-info">
                        <h3 className="qs-appt-client-name">{appointment.client}</h3>
                        <h4 className="qs-appt-time">{appointment.time}</h4>
                    </div>
                    <h3 className="qs-appt-price">{appointment.price}</h3>
                </div>
                <div className="qs-appt-services">
                    {appointment.services.map((svc, idx) => (
                        <h4 key={idx} className="qs-appt-service-line">
                            {svc.duration} &bull; {svc.staff} &bull; {svc.name}
                        </h4>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

/* ─── Appointments Tab Content ─── */
const AppointmentsContent = () => {
    const [selectedAppt, setSelectedAppt] = useState(null);

    return (
        <div className="qs-appointments-content">
            {/* Section header */}
            <div className="qs-appt-section-header">
                <div className="qs-appt-section-left">
                    <div className="qs-appt-section-label-wrap">
                        <p className="qs-appt-section-label">Earlier today</p>
                    </div>
                </div>
                <div className="qs-appt-section-actions">
                    <button className="qs-appt-btn-outlined">
                        <span className="qs-appt-btn-label">Today</span>
                        <span className="qs-appt-btn-icon"><SortIcon /></span>
                    </button>
                    <button className="qs-appt-btn-icon-only" aria-label="Filters">
                        <span className="qs-appt-btn-icon"><FilterIcon /></span>
                    </button>
                </div>
            </div>

            {/* Appointment cards */}
            <div className="qs-appt-cards-list">
                {APPOINTMENT_DATA.map(appt => (
                    <AppointmentCard
                        key={appt.id}
                        appointment={appt}
                        isSelected={selectedAppt === appt.id}
                        onSelect={setSelectedAppt}
                    />
                ))}
            </div>
        </div>
    );
};

/* ─── Service Category Card (Services tab) ─── */
const ServiceCategoryCard = ({ category, onClick }) => (
    <div className="qs-svc-cat-card" onClick={onClick}>
        <button className="qs-svc-cat-card-btn" aria-label={`View ${category.name}`} />
        <div className="qs-svc-cat-color-bar">
            <div className="qs-svc-cat-color-bar-inner" style={{ backgroundColor: category.color }} />
        </div>
        <div className="qs-svc-cat-info">
            <div className="qs-svc-cat-main">
                <div className="qs-svc-cat-name-wrap">
                    <p className="qs-svc-cat-name">{category.name}</p>
                </div>
                <div className="qs-svc-cat-badge">
                    <span className="qs-svc-cat-badge-text">{category.count}</span>
                </div>
            </div>
            <div className="qs-svc-cat-arrow">
                <span className="qs-svc-cat-arrow-icon"><ChevronRight /></span>
            </div>
        </div>
    </div>
);

/* ─── Category Detail Panel (sub-drawer, el-48) ─── */
const CategoryDetailPanel = ({ isOpen, category, onBack, onAddService }) => {
    const services = category ? (CATEGORY_SERVICES[category.name] || []) : [];
    return (
        <div className={`qs-cat-detail${isOpen ? ' open' : ''}`}>
            {/* el-49: plain wrapper */}
            <div className="qs-cat-detail-row">
                {/* el-50: flex column wrapper */}
                <div className="qs-cat-detail-content">
                    {/* Sticky Header — el-51 */}
                    <div className="qs-cat-detail-header">
                        <div className="qs-cat-detail-header-inner">
                            {/* Back button wrapper — el-53 */}
                            <div className="qs-cat-detail-back-wrap">
                                <button className="qs-cat-detail-back-btn" onClick={onBack} aria-label="Go back">
                                    <div className="qs-cat-detail-back-inner">
                                        <span className="qs-cat-detail-back-label">Go back</span>
                                        <span className="qs-cat-detail-back-icon-wrap">
                                            <span className="qs-cat-detail-back-icon"><BackArrow /></span>
                                        </span>
                                    </div>
                                </button>
                            </div>
                            {/* Title — el-66 */}
                            <div className="qs-cat-detail-title-wrap">
                                <p className="qs-cat-detail-title">{category ? category.name : ''}</p>
                            </div>
                        </div>
                    </div>

                    {/* Service list — el-71 */}
                    <div className="qs-cat-detail-list">
                        <div className="qs-cat-detail-list-inner">
                            <div className="qs-cat-detail-grid">
                                {services.map((svc, idx) => (
                                    <div key={idx} className="qs-service-card qs-cat-detail-card">
                                        <button className="qs-service-card-btn" aria-label={`Add ${svc.name}`} onClick={() => onAddService && onAddService(svc)} />
                                        <div className="qs-service-color-bar">
                                            <div className="qs-service-color-bar-inner" style={{ backgroundColor: svc.color }} />
                                        </div>
                                        <div className="qs-service-info">
                                            <div className="qs-service-text">
                                                <p className="qs-service-name">{svc.name}</p>
                                                <p className="qs-service-duration"><span>{svc.duration}</span></p>
                                            </div>
                                            <div className="qs-service-price-wrap">
                                                <div className="qs-service-price-inner">
                                                    <span className="qs-service-price"><bdi>{svc.price}</bdi></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── Services Tab Content ─── */
const ServicesContent = ({ onCategorySelect }) => (
    <div className="qs-services-content">
        <div className="qs-svc-cat-list">
            {SERVICES_CATEGORIES.map((cat, idx) => (
                <ServiceCategoryCard key={idx} category={cat} onClick={() => onCategorySelect(cat)} />
            ))}
        </div>
    </div>
);

/* ─── Product Card (el-141) ─── */
const ProductCard = ({ product, onAdd }) => (
    <div className="qs-product-card">
        <button className="qs-product-card-btn" aria-label={`Add ${product.name}`} onClick={() => onAdd && onAdd(product)} />
        {/* el-143: Image wrapper */}
        <div className="qs-product-image-wrap">
            <picture className="qs-product-picture">
                <img
                    className="qs-product-img"
                    src={product.image}
                    alt={product.name}
                />
            </picture>
        </div>
        {/* el-146: Info section */}
        <div className="qs-product-info">
            {/* el-147: Text block */}
            <div className="qs-product-text">
                {/* el-148 + el-149: Product name */}
                <div className="qs-product-name-wrap">
                    <p className="qs-product-name">{product.name}</p>
                </div>
                {/* el-150: Price + Stock row */}
                <div className="qs-product-meta">
                    <span className="qs-product-price">
                        <bdi>{product.price}</bdi>
                    </span>
                    {product.stock && (
                        <>
                            <p className="qs-product-dot">•</p>
                            <p className="qs-product-stock">{product.stock}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    </div>
);

/* ─── Products Tab Content ─── */
const ProductsContent = ({ onAddProduct }) => (
    <div className="qs-products-content">
        <div className="qs-product-grid">
            {PRODUCTS_DATA.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={onAddProduct} />
            ))}
        </div>
    </div>
);

const ClientCard = ({ onClick, selectedClient, onChangeClient, onRemoveClient }) => {
    const [actionsOpen, setActionsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        if (!actionsOpen) return;
        const handleOutsideClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setActionsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [actionsOpen]);

    // Unselected state — original "Add client" card
    if (!selectedClient || selectedClient.type === 'walkin') {
        const label = selectedClient?.type === 'walkin' ? 'Walk-In' : 'Add client';
        const subtitle = selectedClient?.type === 'walkin' ? 'Walk-in client' : 'Leave empty for walk-ins';
        return (
            <div className="qs-client-card">
                <button className="qs-client-card-overlay" aria-label="Add client" onClick={onClick} />
                <div className="qs-client-info">
                    <p className="qs-client-title">{label}</p>
                    <p className="qs-client-subtitle">{subtitle}</p>
                </div>
                <div className="qs-client-avatar">
                    <PersonPlusIcon />
                </div>
            </div>
        );
    }

    // Selected state — el-0..24 client card from JSON
    const client = selectedClient.client || { name: 'Client', email: '', initial: 'C' };
    return (
        <div className="cc-selected-root">
            <div className="cc-selected-inner">
                <div className="cc-selected-card">
                    <div className="cc-selected-layout">
                        {/* Left info section (el-5..20) */}
                        <div className="cc-selected-info-section">
                            <div className="cc-selected-info-stack">
                                <div className="cc-selected-info-col">
                                    <div className="cc-selected-name-col">
                                        <p className="cc-selected-name">{client.name}</p>
                                        <p className="cc-selected-email">{client.email}</p>
                                    </div>
                                    <div className="cc-selected-actions-area">
                                        <div className="cc-selected-actions-wrap" ref={dropdownRef}>
                                            <button
                                                className="cc-actions-btn"
                                                onClick={() => setActionsOpen(!actionsOpen)}
                                            >
                                                <div className="cc-actions-btn-inner">
                                                    <span className="cc-actions-btn-content">
                                                        <span className="cc-actions-btn-label">Actions</span>
                                                    </span>
                                                    <span className="cc-actions-btn-chevron">
                                                        <span className="cc-actions-chevron-icon">
                                                            {actionsOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                                        </span>
                                                    </span>
                                                </div>
                                            </button>

                                            {/* Actions Dropdown Popup (div[234]) */}
                                            {actionsOpen && (
                                                <div className="cc-dropdown">
                                                    <div className="cc-dropdown-inner">
                                                        <button
                                                            className="cc-dropdown-item"
                                                            onClick={() => { setActionsOpen(false); }}
                                                        >
                                                            <span className="cc-dropdown-item-icon">
                                                                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M17 18C17 14.134 13.866 11 10 11C6.13401 11 3 14.134 3 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            </span>
                                                            <span className="cc-dropdown-item-label">View profile</span>
                                                        </button>
                                                        <button
                                                            className="cc-dropdown-item"
                                                            onClick={() => {
                                                                setActionsOpen(false);
                                                                if (onChangeClient) onChangeClient();
                                                            }}
                                                        >
                                                            <span className="cc-dropdown-item-icon">
                                                                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M13 3L17 7L7 17H3V13L13 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            </span>
                                                            <span className="cc-dropdown-item-label">Change client</span>
                                                        </button>
                                                        <hr className="cc-dropdown-separator" />
                                                        <button
                                                            className="cc-dropdown-item cc-dropdown-item--danger"
                                                            onClick={() => {
                                                                setActionsOpen(false);
                                                                if (onRemoveClient) onRemoveClient();
                                                            }}
                                                        >
                                                            <span className="cc-dropdown-item-label cc-dropdown-label--danger">Remove from checkout</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right avatar section (el-21..24) */}
                        <div className="cc-selected-avatar-section">
                            <div className="cc-selected-avatar-circle">
                                <div className="cc-selected-avatar-inner">
                                    <span className="cc-selected-avatar-letter">{client.initial}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── Client Selection Panel (el-223..294) — slides over cart ─── */
const DUMMY_CLIENTS = [
    { id: 1, name: 'Jane Doe', email: 'jane@example.com', initial: 'J' },
    { id: 2, name: 'John Doe', email: 'john@example.com', initial: 'J' },
];

const ClientSelectionPanel = ({ open, onClose, onSelectClient }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredClients = DUMMY_CLIENTS.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`csp-root ${open ? 'csp-root--open' : ''}`}>
            {/* Header — sticky search area (el-225..236) */}
            <div className="csp-header">
                <div className="csp-header-pad">
                    <div className="csp-field-wrap">
                        <label className="csp-field-label"></label>
                        <div className="csp-input-row">
                            <div className="csp-input-box">
                                <div className="csp-input-prefix">
                                    <span className="csp-search-icon">
                                        <ClientSearchIcon />
                                    </span>
                                </div>
                                <input
                                    className="csp-input"
                                    type="text"
                                    placeholder="Search existing client"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Body (el-237..294) */}
            <div className="csp-body">
                <div className="csp-body-inner">
                    {/* Primary list: Add new client + Walk-In (el-239) */}
                    <ul className="csp-primary-list">
                        {/* Add new client (el-240..253) */}
                        <div className="csp-list-item">
                            <button className="csp-list-item-btn" onClick={() => onSelectClient && onSelectClient({ type: 'new' })}></button>
                            <div className="csp-list-item-grid">
                                <div className="csp-list-item-prefix">
                                    <div className="csp-list-item-avatar-wrap">
                                        <div className="csp-list-item-avatar-outer">
                                            <div className="csp-list-item-avatar csp-avatar--icon">
                                                <div className="csp-avatar-inner">
                                                    <span className="csp-avatar-icon-slot">
                                                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M16 8V24M8 16H24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="csp-list-item-main">
                                    <div className="csp-list-item-content">
                                        <h3 className="csp-list-item-title">Add new client</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Walk-In (el-254..267) */}
                        <div className="csp-list-item">
                            <button className="csp-list-item-btn" onClick={() => { onSelectClient && onSelectClient({ type: 'walkin' }); onClose && onClose(); }}></button>
                            <div className="csp-list-item-grid">
                                <div className="csp-list-item-prefix">
                                    <div className="csp-list-item-avatar-wrap">
                                        <div className="csp-list-item-avatar-outer">
                                            <div className="csp-list-item-avatar csp-avatar--icon">
                                                <div className="csp-avatar-inner">
                                                    <span className="csp-avatar-icon-slot">
                                                        <WalkInIcon />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="csp-list-item-main">
                                    <div className="csp-list-item-content">
                                        <h3 className="csp-list-item-title">Walk-In</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ul>

                    {/* Separator (el-268) */}
                    <hr className="csp-separator" />

                    {/* Client list (el-269..294) */}
                    <ul className="csp-client-list">
                        {filteredClients.map(client => (
                            <div className="csp-list-item" key={client.id}>
                                <button className="csp-list-item-btn" onClick={() => { onSelectClient && onSelectClient({ type: 'existing', client }); onClose && onClose(); }}></button>
                                <div className="csp-list-item-grid">
                                    <div className="csp-list-item-prefix">
                                        <div className="csp-list-item-avatar-wrap">
                                            <div className="csp-list-item-avatar-outer">
                                                <div className="csp-list-item-avatar csp-avatar--letter">
                                                    <div className="csp-avatar-letter-inner">
                                                        <span className="csp-avatar-letter">{client.initial}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="csp-list-item-main">
                                        <div className="csp-list-item-content">
                                            <h3 className="csp-list-item-title">{client.name}</h3>
                                            <h4 className="csp-list-item-subtitle">{client.email}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const EmptyCartState = () => (
    <div className="qs-empty-state">
        <div className="qs-empty-content">
            <div className="qs-empty-image">
                <EmptyCartIcon />
            </div>
            <div className="qs-empty-text">
                <p className="qs-empty-title">Your cart is empty</p>
                <p className="qs-empty-description">
                    Tap an item to add to cart or add an existing client for smart recommendations
                </p>
            </div>
        </div>
    </div>
);

/* ─── Edit Cart Item Modal (el-0 → el-104) ─── */
const EditCartItemModal = ({ item, onClose, onApply, onRemove }) => {
    const priceNum = parseInt((item?.price || '').replace(/[^0-9]/g, ''), 10) || 0;
    const [price, setPrice] = useState(priceNum.toString());
    const [quantity, setQuantity] = useState(1);
    const [teamMember, setTeamMember] = useState('Furkan Kem');

    useEffect(() => {
        if (item) {
            const p = parseInt((item.price || '').replace(/[^0-9]/g, ''), 10) || 0;
            setPrice(p.toString());
            setQuantity(1);
            setTeamMember('Furkan Kem');
        }
    }, [item]);

    if (!item) return null;

    const itemTotal = (parseFloat(price) || 0) * quantity;

    return (
        /* el-0 */
        <div className="edit-modal-overlay" onClick={onClose}>
            {/* el-1 */}
            <div className="edit-modal-scroll">
                {/* el-2 */}
                <div className="edit-modal-center">
                    {/* el-3 */}
                    <div className="edit-modal-card" onClick={(e) => e.stopPropagation()}>
                        {/* el-4 */}
                        <div className="edit-modal-header">
                            {/* el-5 */}
                            <div className="edit-modal-header-row">
                                {/* el-6 */}
                                <div className="edit-modal-title-wrap">
                                    {/* el-7 */}
                                    <p className="edit-modal-title">Edit {item.name}</p>
                                </div>
                                {/* el-8 */}
                                <button className="edit-modal-close-btn" onClick={onClose} aria-label="Close modal">
                                    {/* el-9 */}
                                    <div className="edit-modal-close-inner">
                                        {/* el-10 */}
                                        <span className="edit-modal-sr-only">
                                            {/* el-11 */}
                                            <span className="edit-modal-sr-text">Close modal</span>
                                        </span>
                                        {/* el-12 */}
                                        <span className="edit-modal-icon-outer">
                                            {/* el-13 */}
                                            <span className="edit-modal-icon-inner">
                                                {/* el-14, el-15 */}
                                                <ModalCloseIcon />
                                            </span>
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* el-17 */}
                        <div className="edit-modal-body">
                            {/* el-18 */}
                            <div className="edit-modal-body-wrap">
                                {/* el-19 */}
                                <div className="edit-modal-body-col">
                                    {/* el-20 */}
                                    <section className="edit-modal-section">
                                        {/* el-21 */}
                                        <div className="edit-modal-form">
                                            {/* el-22 */}
                                            <div className="edit-modal-form-group">
                                                {/* el-23 */}
                                                <div className="edit-modal-grid">
                                                    {/* el-24: Row 1 — Price + Quantity */}
                                                    <div className="edit-modal-row-price-qty">
                                                        {/* el-25: Price Field */}
                                                        <div className="edit-modal-field-price">
                                                            {/* el-26 */}
                                                            <div className="edit-modal-label-row">
                                                                {/* el-27 */}
                                                                <label className="edit-modal-label">Price</label>
                                                            </div>
                                                            {/* el-28 */}
                                                            <div className="edit-modal-input-box">
                                                                {/* el-29 */}
                                                                <div className="edit-modal-input-prefix">TRY</div>
                                                                {/* el-30 */}
                                                                <input
                                                                    className="edit-modal-input"
                                                                    type="text"
                                                                    value={price}
                                                                    onChange={(e) => setPrice(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* el-31: Quantity Field */}
                                                        <div className="edit-modal-field-qty">
                                                            {/* el-32 */}
                                                            <label className="edit-modal-qty-label">
                                                                {/* el-33 */}
                                                                <span className="edit-modal-qty-label-text">Quantity</span>
                                                            </label>
                                                            {/* el-34 */}
                                                            <div className="edit-modal-stepper-row">
                                                                {/* el-35 */}
                                                                <div className="edit-modal-qty-input-box">
                                                                    {/* el-36 */}
                                                                    <input
                                                                        className="edit-modal-qty-input"
                                                                        type="number"
                                                                        value={quantity}
                                                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                                                    />
                                                                </div>
                                                                {/* el-37 */}
                                                                <div className="edit-modal-stepper-btns">
                                                                    {/* el-38 */}
                                                                    <div className="edit-modal-stepper-pad">
                                                                        {/* el-39 */}
                                                                        <button
                                                                            className="edit-modal-stepper-btn"
                                                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                                                            aria-label="Decrease value"
                                                                        >
                                                                            {/* el-40 */}
                                                                            <div className="edit-modal-stepper-btn-inner">
                                                                                {/* el-41 */}
                                                                                <span className="edit-modal-sr-only">
                                                                                    <span className="edit-modal-sr-text">Decrease value</span>
                                                                                </span>
                                                                                {/* el-43 */}
                                                                                <span className="edit-modal-stepper-icon-outer">
                                                                                    {/* el-44 */}
                                                                                    <span className="edit-modal-stepper-icon-inner">
                                                                                        {/* el-45, el-46 */}
                                                                                        <MinusIcon />
                                                                                    </span>
                                                                                </span>
                                                                            </div>
                                                                        </button>
                                                                    </div>
                                                                    {/* el-47 */}
                                                                    <div className="edit-modal-stepper-pad">
                                                                        {/* el-48 */}
                                                                        <button
                                                                            className="edit-modal-stepper-btn"
                                                                            onClick={() => setQuantity(q => q + 1)}
                                                                            aria-label="Increase value"
                                                                        >
                                                                            {/* el-49 */}
                                                                            <div className="edit-modal-stepper-btn-inner">
                                                                                {/* el-50 */}
                                                                                <span className="edit-modal-sr-only">
                                                                                    <span className="edit-modal-sr-text">Increase value</span>
                                                                                </span>
                                                                                {/* el-52 */}
                                                                                <span className="edit-modal-stepper-icon-outer">
                                                                                    {/* el-53 */}
                                                                                    <span className="edit-modal-stepper-icon-inner">
                                                                                        {/* el-54, el-55 */}
                                                                                        <PlusIcon2 />
                                                                                    </span>
                                                                                </span>
                                                                            </div>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* el-56: Row 2 — Discounts */}
                                                    <div className="edit-modal-field-discount">
                                                        {/* el-57 */}
                                                        <label className="edit-modal-qty-label">
                                                            {/* el-58 */}
                                                            <span className="edit-modal-qty-label-text">Discounts</span>
                                                        </label>
                                                        {/* el-59 */}
                                                        <div className="edit-modal-select-disabled">
                                                            {/* el-60 */}
                                                            <div className="edit-modal-select-value edit-modal-select-value--disabled">
                                                                {/* el-61 */}
                                                                <span className="edit-modal-select-text">None available</span>
                                                            </div>
                                                            {/* el-62 */}
                                                            <div className="edit-modal-chevron-wrap edit-modal-chevron-wrap--disabled">
                                                                {/* el-63 */}
                                                                <span className="edit-modal-chevron-icon">
                                                                    {/* el-64, el-65 */}
                                                                    <ChevronDownIcon />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* el-66: Row 3 — Team member */}
                                                    <div className="edit-modal-field-team">
                                                        {/* el-67 */}
                                                        <label className="edit-modal-qty-label">
                                                            {/* el-68 */}
                                                            <span className="edit-modal-qty-label-text">Team member</span>
                                                        </label>
                                                        {/* el-69 */}
                                                        <div className="edit-modal-select-box">
                                                            {/* el-70 */}
                                                            <div className="edit-modal-select-value">
                                                                {/* el-71 */}
                                                                <span className="edit-modal-select-text">{teamMember}</span>
                                                            </div>
                                                            {/* el-72 */}
                                                            <select
                                                                className="edit-modal-native-select"
                                                                value={teamMember}
                                                                onChange={(e) => setTeamMember(e.target.value)}
                                                            >
                                                                {/* el-73 */}
                                                                <option value="Wendy Smith (Demo)">Wendy Smith (Demo)</option>
                                                                {/* el-74 */}
                                                                <option value="Furkan Kem">Furkan Kem</option>
                                                            </select>
                                                            {/* el-75 */}
                                                            <div className="edit-modal-chevron-wrap">
                                                                {/* el-76 */}
                                                                <span className="edit-modal-chevron-icon">
                                                                    {/* el-77, el-78 */}
                                                                    <ChevronDownIcon />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>

                        {/* el-82 */}
                        <div className="edit-modal-footer">
                            {/* el-83 */}
                            <div className="edit-modal-footer-row">
                                {/* el-84 → el-90 */}
                                <div className="edit-modal-total-section">
                                    <div className="edit-modal-total-wrap">
                                        {/* el-86 */}
                                        <p className="edit-modal-total-label">Item total</p>
                                        {/* el-87 */}
                                        <div className="edit-modal-total-price-row">
                                            {/* el-88 */}
                                            <div className="edit-modal-total-price-val">
                                                {/* el-89 */}
                                                <span className="edit-modal-total-price">
                                                    {/* el-90 */}
                                                    <bdi>TRY {itemTotal}</bdi>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* el-91 → el-104 */}
                                <div className="edit-modal-actions-section">
                                    {/* el-92 */}
                                    <div className="edit-modal-actions-row">
                                        {/* el-93 */}
                                        <button
                                            className="edit-modal-delete-btn"
                                            onClick={() => { onRemove(item.cartId); onClose(); }}
                                            aria-label="Remove item"
                                        >
                                            {/* el-94 */}
                                            <div className="edit-modal-delete-inner">
                                                {/* el-95 */}
                                                <span className="edit-modal-sr-only">
                                                    <span className="edit-modal-sr-text-danger">Remove item</span>
                                                </span>
                                                {/* el-97 */}
                                                <span className="edit-modal-delete-icon-outer">
                                                    {/* el-98 */}
                                                    <span className="edit-modal-delete-icon-inner">
                                                        {/* el-99, el-100 */}
                                                        <ModalTrashIcon />
                                                    </span>
                                                </span>
                                            </div>
                                        </button>
                                        {/* el-101 */}
                                        <button
                                            className="edit-modal-apply-btn"
                                            onClick={() => { onApply({ ...item, price: `TRY ${itemTotal}` }); onClose(); }}
                                        >
                                            {/* el-102 */}
                                            <div className="edit-modal-apply-inner">
                                                {/* el-103 */}
                                                <span className="edit-modal-apply-content">
                                                    {/* el-104 */}
                                                    <span className="edit-modal-apply-text">Apply</span>
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
    );
};

/* ─── Edit Cart Panel (sliding side panel, like EditServicePanel) ─── */
const EditCartPanel = ({ item, open, onClose, onApply, onRemove }) => {
    const priceNum = item ? parseInt((item.price || '').replace(/[^0-9]/g, ''), 10) : 0;
    const [price, setPrice] = useState(priceNum.toString());
    const [quantity, setQuantity] = useState(1);
    const [teamMember, setTeamMember] = useState('Furkan Kem');

    useEffect(() => {
        if (item) {
            const p = parseInt((item.price || '').replace(/[^0-9]/g, ''), 10) || 0;
            setPrice(p.toString());
            setQuantity(1);
            setTeamMember('Furkan Kem');
        }
    }, [item]);

    const itemTotal = (parseFloat(price) || 0) * quantity;

    return (
        <div className={`ecp-root${open ? ' ecp-root--open' : ''}`}>

            {/* ── Header ── */}
            <div className="ecp-header-area">
                <div className="ecp-header-inner">
                    <div className="ecp-header-row">
                        {/* Back button */}
                        <div className="ecp-back-wrap">
                            <button className="ecp-back-btn" onClick={onClose}>
                                <div className="ecp-back-btn-inner">
                                    <span className="ecp-back-icon-slot">
                                        <BackArrow />
                                    </span>
                                    <span className="ecp-back-label-wrap">
                                        <span className="ecp-back-label">Back</span>
                                    </span>
                                </div>
                            </button>
                        </div>
                        {/* Title (fades in on scroll) */}
                        <div className="ecp-header-title-wrap">
                            <span className="ecp-header-title">Edit service</span>
                        </div>
                        {/* Right spacer */}
                        <div className="ecp-header-right">
                            <span style={{ width: 24, height: 24 }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Title area ── */}
            <div className="ecp-title-area">
                <div className="ecp-title-pad">
                    <div className="ecp-title-grid">
                        <div className="ecp-title-slot">
                            <div className="ecp-title-flex">
                                <h1 className="ecp-h1">Edit service</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="ecp-body">
                <div className="ecp-body-inner">
                    <form className="ecp-form" onSubmit={e => e.preventDefault()}>
                        <div className="ecp-grid">

                            {/* ── Row 1: Price + Quantity ── */}
                            <div className="edit-modal-row-price-qty">
                                {/* Price Field */}
                                <div className="edit-modal-field-price">
                                    <div className="edit-modal-label-row">
                                        <label className="edit-modal-label">Price</label>
                                    </div>
                                    <div className="edit-modal-input-box">
                                        <div className="edit-modal-input-prefix">TRY</div>
                                        <input
                                            className="edit-modal-input"
                                            type="text"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Quantity Field */}
                                <div className="edit-modal-field-qty">
                                    <label className="edit-modal-qty-label">
                                        <span className="edit-modal-qty-label-text">Quantity</span>
                                    </label>
                                    <div className="edit-modal-stepper-row">
                                        <div className="edit-modal-qty-input-box">
                                            <input
                                                className="edit-modal-qty-input"
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            />
                                        </div>
                                        <div className="edit-modal-stepper-btns">
                                            <div className="edit-modal-stepper-pad">
                                                <button
                                                    className="edit-modal-stepper-btn"
                                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                                    aria-label="Decrease value"
                                                >
                                                    <div className="edit-modal-stepper-btn-inner">
                                                        <span className="edit-modal-sr-only">
                                                            <span className="edit-modal-sr-text">Decrease value</span>
                                                        </span>
                                                        <span className="edit-modal-stepper-icon-outer">
                                                            <span className="edit-modal-stepper-icon-inner">
                                                                <MinusIcon />
                                                            </span>
                                                        </span>
                                                    </div>
                                                </button>
                                            </div>
                                            <div className="edit-modal-stepper-pad">
                                                <button
                                                    className="edit-modal-stepper-btn"
                                                    onClick={() => setQuantity(q => q + 1)}
                                                    aria-label="Increase value"
                                                >
                                                    <div className="edit-modal-stepper-btn-inner">
                                                        <span className="edit-modal-sr-only">
                                                            <span className="edit-modal-sr-text">Increase value</span>
                                                        </span>
                                                        <span className="edit-modal-stepper-icon-outer">
                                                            <span className="edit-modal-stepper-icon-inner">
                                                                <PlusIcon2 />
                                                            </span>
                                                        </span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Row 2: Discounts (disabled) ── */}
                            <div className="edit-modal-field-discount">
                                <label className="edit-modal-qty-label">
                                    <span className="edit-modal-qty-label-text">Discounts</span>
                                </label>
                                <div className="edit-modal-select-disabled">
                                    <div className="edit-modal-select-value edit-modal-select-value--disabled">
                                        <span className="edit-modal-select-text">None available</span>
                                    </div>
                                    <div className="edit-modal-chevron-wrap edit-modal-chevron-wrap--disabled">
                                        <span className="edit-modal-chevron-icon">
                                            <ChevronDownIcon />
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* ── Row 3: Team member ── */}
                            <div className="edit-modal-field-team">
                                <label className="edit-modal-qty-label">
                                    <span className="edit-modal-qty-label-text">Team member</span>
                                </label>
                                <div className="edit-modal-select-box">
                                    <div className="edit-modal-select-value">
                                        <span className="edit-modal-select-text">{teamMember}</span>
                                    </div>
                                    <select
                                        className="edit-modal-native-select"
                                        value={teamMember}
                                        onChange={(e) => setTeamMember(e.target.value)}
                                    >
                                        <option value="Wendy Smith (Demo)">Wendy Smith (Demo)</option>
                                        <option value="Furkan Kem">Furkan Kem</option>
                                    </select>
                                    <div className="edit-modal-chevron-wrap">
                                        <span className="edit-modal-chevron-icon">
                                            <ChevronDownIcon />
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>
            </div>

            {/* ── Footer ── */}
            <div className="ecp-footer">
                <div className="ecp-footer-inner">
                    <div className="ecp-footer-content">
                        <div className="ecp-footer-col">
                            {/* Total summary row */}
                            <div className="ecp-total-row">
                                <p className="ecp-total-label">Total</p>
                                <div className="ecp-total-right">
                                    <p className="ecp-total-duration">{item?.duration || '30min'}</p>
                                    <div className="ecp-total-price-wrap">
                                        <span className="ecp-total-price">
                                            <bdi>TRY {itemTotal}</bdi>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* Action buttons */}
                            <div className="ecp-actions-row">
                                {/* Delete button */}
                                <button className="ecp-delete-btn" type="button" onClick={() => { if (item && onRemove) { onRemove(item.cartId); onClose(); } }}>
                                    <div className="ecp-delete-btn-inner">
                                        <span className="ecp-delete-sr">
                                            <span>Delete</span>
                                        </span>
                                        <span className="ecp-delete-icon-slot">
                                            <span className="ecp-delete-icon">
                                                <ModalTrashIcon />
                                            </span>
                                        </span>
                                    </div>
                                </button>
                                {/* Apply button */}
                                <button className="ecp-apply-btn" type="button" onClick={() => {
                                    if (item && onApply) {
                                        onApply({ ...item, price: `TRY ${price}`, quantity });
                                    }
                                    onClose();
                                }}>
                                    <div className="ecp-apply-btn-inner">
                                        <span className="ecp-apply-label-wrap">
                                            <span className="ecp-apply-label">Apply</span>
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

/* ─── Cart Item (from TestPage service card structure) ─── */
const CartItem = ({ item, index, onRemove, onEdit }) => {
    const subtitle = item.duration
        ? `${item.duration} · Furkan Kem`
        : 'Furkan Kem';
    return (
        <div className="qs-ci-anim" style={{ animationDelay: `${index * 0.05}s` }}>
            <div className="drawer-service-item svc-card-wrapper">
                <div className="drawer-service-hover-bg" />
                <button className="drawer-service-btn" aria-label={`Edit ${item.name}`} />
                <div className="drawer-service-row">
                    <div className="drawer-service-bar-col">
                        <div className="drawer-service-bar" style={{ backgroundColor: item.color || '#DDDDDD' }} />
                    </div>
                    <div className="drawer-service-content">
                        <div className="drawer-service-info">
                            <div className="drawer-service-name-block">
                                <p className="drawer-service-name">{item.name}</p>
                                <p className="drawer-service-duration">{subtitle}</p>
                            </div>
                            <div className="drawer-service-price-block svc-card-price-area">
                                <div className="drawer-service-price-inner svc-card-price-main">
                                    <div className="drawer-service-price-row">
                                        <span className="drawer-service-price">
                                            <bdi>{item.price}</bdi>
                                        </span>
                                    </div>
                                </div>
                                {/* Hover actions (Edit / Remove) */}
                                <div className="svc-card-hover-actions">
                                    <button className="svc-card-hover-action-btn" aria-label="Edit" onClick={(e) => { e.stopPropagation(); onEdit && onEdit(item); }}>
                                        <span className="svc-card-hover-action-icon">
                                            <EditIcon />
                                        </span>
                                    </button>
                                    <button className="svc-card-hover-action-btn" aria-label="Remove" onClick={(e) => { e.stopPropagation(); onRemove && onRemove(item.cartId); }}>
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
        </div>
    );
};

/* ─── Cart Summary (el-187) ─── */
const CartSummary = ({ subtotal, payments = [], onRemovePayment }) => (
    <div className="qs-cs-outer">
        <div className="qs-cs-stack">
            <div className="qs-cs-row">
                <p className="qs-cs-label">Subtotal</p>
                <p className="qs-cs-value">TRY {subtotal.toLocaleString()}</p>
            </div>
            <div className="qs-cs-row">
                <p className="qs-cs-label">Tax</p>
                <p className="qs-cs-value">TRY 0</p>
            </div>
            <div className="qs-cs-total-row">
                <div className="qs-cs-total-inner">
                    <p className="qs-cs-total-label">Total</p>
                    <p className="qs-cs-total-value">TRY {subtotal.toLocaleString()}</p>
                </div>
            </div>
            {payments.length > 0 && (
                <>
                    <div className="qs-cs-divider-wrap">
                        <hr className="qs-cs-divider" />
                    </div>
                    <div className="qs-cs-transactions">
                        {payments.map((txn) => (
                            <div className="qs-cs-txn-row" key={txn.id}>
                                <div className="qs-cs-txn-left">
                                    <p className="qs-cs-txn-name">{txn.method}</p>
                                    <button
                                        className="qs-cs-txn-delete"
                                        aria-label={`Remove ${txn.method} payment`}
                                        onClick={() => onRemovePayment && onRemovePayment(txn.id)}
                                    >
                                        <span className="qs-cs-txn-delete-icon">
                                            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                                                <path fillRule="evenodd" d="M10.879 3.545A3 3 0 0 1 13 2.667h6a3 3 0 0 1 3 3v1h5a1 1 0 1 1 0 2h-1v18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-18H5a1 1 0 0 1 0-2h5v-1a3 3 0 0 1 .879-2.122M8 8.667v18h16v-18zm12-2h-8v-1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1zm-7 6a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0v-8a1 1 0 0 1 1-1m5 1a1 1 0 1 1 2 0v8a1 1 0 1 1-2 0z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                                <p className="qs-cs-txn-amount">TRY {txn.amount}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    </div>
);

/* ─── Kebab Dropdown SVG Icons (exact paths from source HTML, viewBox 0 0 32 32) ─── */
const KbdTipIcon = () => (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <path d="M23 11.196V10.5C23 7.365 18.271 5 12 5S1 7.365 1 10.5v5c0 2.611 3.281 4.686 8 5.308v.692c0 3.135 4.729 5.5 11 5.5s11-2.365 11-5.5v-5c0-2.588-3.177-4.665-8-5.304m6 5.304c0 1.652-3.849 3.5-9 3.5q-.7 0-1.385-.046C21.311 18.97 23 17.375 23 15.5v-2.283c3.734.557 6 2.067 6 3.283M9 18.781v-2.973q1.494.194 3 .192a23 23 0 0 0 3-.193v2.974c-.993.147-1.996.22-3 .219a20.4 20.4 0 0 1-3-.219m12-5.04V15.5c0 1.049-1.551 2.175-4 2.859v-2.922c1.614-.39 2.98-.973 4-1.696M12 7c5.151 0 9 1.848 9 3.5S17.151 14 12 14s-9-1.848-9-3.5S6.849 7 12 7m-9 8.5v-1.759c1.02.723 2.386 1.305 4 1.697v2.92c-2.449-.683-4-1.81-4-2.858m8 6v-.521q.492.02 1 .021.727-.001 1.424-.044a15 15 0 0 0 1.576.47v2.933c-2.449-.684-4-1.81-4-2.859m6 3.281V21.8a22.973 22.973 0 0 0 6 .008v2.973c-1.99.292-4.01.292-6 0m8-.422v-2.922c1.614-.39 2.98-.973 4-1.696V21.5c0 1.049-1.551 2.175-4 2.859" />
    </svg>
);
const KbdDiscountIcon = () => (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <path fillRule="evenodd" d="M15.145 2.256a2 2 0 0 1 1.8.55l13.046 13.046a1.99 1.99 0 0 1 0 2.834L18.686 29.99a1.987 1.987 0 0 1-2.834 0L2.806 16.945a2 2 0 0 1-.55-1.8v-.003L4.27 5.054a1 1 0 0 1 .785-.785l10.088-2.012zm.385 1.963L6.1 6.1 4.22 15.53l13.05 13.05 11.31-11.311z" clipRule="evenodd" />
        <path d="M10.5 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
    </svg>
);
const KbdNoteIcon = () => (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <path fillRule="evenodd" d="M10 2a1 1 0 0 1 1 1v1h4V3a1 1 0 1 1 2 0v1h4V3a1 1 0 1 1 2 0v1h2a2 2 0 0 1 2 2v19a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V6a2 2 0 0 1 2-2h2V3a1 1 0 0 1 1-1M9 6H7v19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6h-2v1a1 1 0 1 1-2 0V6h-4v1a1 1 0 1 1-2 0V6h-4v1a1 1 0 1 1-2 0zm2 10a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2h-8a1 1 0 0 1-1-1m0 4a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2h-8a1 1 0 0 1-1-1" clipRule="evenodd" />
    </svg>
);
const KbdChargeIcon = () => (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <path d="M16 3a13 13 0 1 0 13 13A13.013 13.013 0 0 0 16 3m0 24a11 11 0 1 1 11-11 11.01 11.01 0 0 1-11 11m5-8.5a3.5 3.5 0 0 1-3.5 3.5H17v1a1 1 0 0 1-2 0v-1h-2a1 1 0 0 1 0-2h4.5a1.5 1.5 0 1 0 0-3h-3a3.5 3.5 0 1 1 0-7h.5V9a1 1 0 0 1 2 0v1h2a1 1 0 0 1 0 2h-4.5a1.5 1.5 0 1 0 0 3h3a3.5 3.5 0 0 1 3.5 3.5" />
    </svg>
);

const KEBAB_MENU_ITEMS = [
    { id: 'add_tip', label: 'Add tip', Icon: KbdTipIcon, group: 1 },
    { id: 'add_cart_discount', label: 'Add cart discount', Icon: KbdDiscountIcon, group: 1 },
    { id: 'edit_sale_note', label: 'Edit sale note', Icon: KbdNoteIcon, group: 1 },
    { id: 'add_service_charge', label: 'Add service charge', Icon: KbdChargeIcon, group: 1 },
    { id: 'save_draft', label: 'Save as draft', group: 2 },
    { id: 'cancel_sale', label: 'Cancel sale', group: 2, danger: true },
];

/* ─── Edit Note Modal (el-0 → el-35) ─── */
const EditNoteCloseIcon = () => (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <path fillRule="evenodd" d="M7.293 7.293a1 1 0 0 1 1.414 0L16 14.586l7.293-7.293a1 1 0 1 1 1.414 1.414L17.414 16l7.293 7.293a1 1 0 0 1-1.414 1.414L16 17.414l-7.293 7.293a1 1 0 0 1-1.414-1.414L14.586 16 7.293 8.707a1 1 0 0 1 0-1.414" clipRule="evenodd" />
    </svg>
);

const EditNoteModal = ({ open, onClose, noteValue, onNoteChange, onApply }) => {
    const maxLen = 200;
    if (!open) return null;
    return (
        /* el-0 */
        <div className="enm-backdrop" onClick={onClose}>
            {/* el-1 */}
            <div className="enm-scroll">
                {/* el-2 */}
                <div className="enm-center">
                    {/* el-3 */}
                    <div className="enm-card" onClick={e => e.stopPropagation()}>
                        {/* el-4: header */}
                        <div className="enm-header">
                            {/* el-5 */}
                            <div className="enm-header-inner">
                                {/* el-6 */}
                                <div className="enm-title-wrap">
                                    {/* el-7 */}
                                    <p className="enm-title">Edit note</p>
                                </div>
                                {/* el-8 */}
                                <button className="enm-close-btn" onClick={onClose}>
                                    {/* el-9 */}
                                    <div className="enm-close-inner">
                                        {/* el-10 */}
                                        <span className="enm-close-sr">
                                            {/* el-11 */}
                                            <span>Close modal</span>
                                        </span>
                                        {/* el-12 */}
                                        <span className="enm-close-icon-outer">
                                            {/* el-13 */}
                                            <span className="enm-close-icon-wrap">
                                                {/* el-14, el-15 */}
                                                <EditNoteCloseIcon />
                                            </span>
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </div>
                        {/* el-17: body */}
                        <div className="enm-body">
                            {/* el-18 */}
                            <div className="enm-body-wrap">
                                {/* el-19 */}
                                <div className="enm-content">
                                    {/* el-20 */}
                                    <section className="enm-section">
                                        {/* el-21 */}
                                        <div className="enm-section-inner">
                                            {/* el-22 */}
                                            <div className="enm-field">
                                                {/* el-23 */}
                                                <label className="enm-label-row">
                                                    {/* el-24 */}
                                                    <span className="enm-label">Sale note</span>
                                                    {/* el-25 */}
                                                    <span className="enm-counter">{noteValue.length}/{maxLen}</span>
                                                </label>
                                                {/* el-26 */}
                                                <div className="enm-textarea-border">
                                                    {/* el-27 */}
                                                    <textarea
                                                        className="enm-textarea"
                                                        value={noteValue}
                                                        onChange={e => {
                                                            if (e.target.value.length <= maxLen) onNoteChange(e.target.value);
                                                        }}
                                                        maxLength={maxLen}
                                                    />
                                                </div>
                                                {/* el-28 */}
                                                <p className="enm-help-text">Note will be added to the sale receipt</p>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                            {/* el-29 */}
                            <div className="enm-spacer" />
                        </div>
                        {/* el-30: hidden */}
                        {/* el-31: footer */}
                        <div className="enm-footer">
                            {/* el-32 */}
                            <button className="enm-apply-btn" onClick={onApply}>
                                {/* el-33 */}
                                <div className="enm-apply-inner">
                                    {/* el-34 */}
                                    <span className="enm-apply-text-wrap">
                                        {/* el-35 */}
                                        <span className="enm-apply-text">Apply</span>
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── TRY coin icon for toggle ─── */
const AcdTryIcon = () => (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <path d="M23 11.196V10.5C23 7.365 18.271 5 12 5S1 7.365 1 10.5v5c0 2.611 3.281 4.686 8 5.308v.692c0 3.135 4.729 5.5 11 5.5s11-2.365 11-5.5v-5c0-2.588-3.177-4.665-8-5.304m6 5.304c0 1.652-3.849 3.5-9 3.5q-.7 0-1.385-.046C21.311 18.97 23 17.375 23 15.5v-2.283c3.734.557 6 2.067 6 3.283M9 18.781v-2.973q1.494.194 3 .192a23 23 0 0 0 3-.193v2.974c-.993.147-1.996.22-3 .219a20.4 20.4 0 0 1-3-.219m12-5.04V15.5c0 1.049-1.551 2.175-4 2.859v-2.922c1.614-.39 2.98-.973 4-1.696M12 7c5.151 0 9 1.848 9 3.5S17.151 14 12 14s-9-1.848-9-3.5S6.849 7 12 7m-9 8.5v-1.759c1.02.723 2.386 1.305 4 1.697v2.92c-2.449-.683-4-1.81-4-2.858m8 6v-.521q.492.02 1 .021.727-.001 1.424-.044a15 15 0 0 0 1.576.47v2.933c-2.449-.684-4-1.81-4-2.859m6 3.281V21.8a22.973 22.973 0 0 0 6 .008v2.973c-1.99.292-4.01.292-6 0m8-.422v-2.922c1.614-.39 2.98-.973 4-1.696V21.5c0 1.049-1.551 2.175-4 2.859" />
    </svg>
);

/* ─── Percent icon for toggle ─── */
const AcdPercentIcon = () => (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <path fillRule="evenodd" d="M9.5 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M5 9.5a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0m19.293-3.207a1 1 0 1 1 1.414 1.414l-18 18a1 1 0 0 1-1.414-1.414zM22.5 20a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M18 22.5a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0" clipRule="evenodd" />
    </svg>
);

/* ─── Add Cart Discount Modal (el-0 → el-62) ─── */
const AddCartDiscountModal = ({ open, onClose, discountType, onToggleType, discountAmount, onAmountChange, total, onAdd }) => {
    if (!open) return null;
    const numAmount = parseFloat(discountAmount) || 0;
    const discounted = discountType === 'percent'
        ? Math.max(0, total - (total * numAmount / 100))
        : Math.max(0, total - numAmount);
    return (
        /* el-0: backdrop */
        <div className="enm-backdrop" onClick={onClose}>
            {/* el-1: scroll */}
            <div className="enm-scroll">
                {/* el-2: center */}
                <div className="enm-center">
                    {/* el-3: card */}
                    <div className="enm-card" onClick={e => e.stopPropagation()}>
                        {/* el-4: header */}
                        <div className="enm-header">
                            {/* el-5 */}
                            <div className="enm-header-inner">
                                {/* el-6: title wrap */}
                                <div className="enm-title-wrap" style={{ height: 'auto' }}>
                                    {/* el-7 */}
                                    <p className="enm-title" style={{ height: 'auto', maxWidth: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                        {/* el-8 */}
                                        <div className="acd-title-inner">
                                            {/* el-9 */}
                                            <div className="acd-title-row">
                                                {/* el-10 */}
                                                <div className="acd-title-col">
                                                    {/* el-11 */}
                                                    <div className="acd-title-text-row">
                                                        {/* el-12 */}
                                                        <p className="acd-title">Add cart discount</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </p>
                                    {/* el-13: subtitle */}
                                    <span className="acd-subtitle">Taxes will be recalculated after the discount has been applied.</span>
                                </div>
                                {/* el-15: close button */}
                                <button className="enm-close-btn" onClick={onClose}>
                                    {/* el-16 */}
                                    <div className="enm-close-inner">
                                        {/* el-17 */}
                                        <span className="enm-close-sr">
                                            {/* el-18 */}
                                            <span>Close modal</span>
                                        </span>
                                        {/* el-19 */}
                                        <span className="enm-close-icon-outer">
                                            {/* el-20 */}
                                            <span className="enm-close-icon-wrap">
                                                {/* el-21, el-22 */}
                                                <EditNoteCloseIcon />
                                            </span>
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </div>
                        {/* el-23: form */}
                        <form className="enm-form" onSubmit={e => e.preventDefault()} style={{ display: 'contents' }}>
                            {/* el-25: body */}
                            <div className="enm-body">
                                {/* el-26 */}
                                <div className="enm-body-wrap">
                                    {/* el-27 */}
                                    <div className="enm-content">
                                        {/* el-28: section */}
                                        <section className="enm-section">
                                            {/* el-29: grid */}
                                            <div className="acd-grid">
                                                {/* el-30: field */}
                                                <div className="acd-field">
                                                    {/* el-31: label */}
                                                    <label className="acd-label-row">
                                                        {/* el-32 */}
                                                        <span className="acd-label">Amount</span>
                                                    </label>
                                                    {/* el-33: input + toggle row */}
                                                    <div className="acd-input-row">
                                                        {/* el-34: input border */}
                                                        <div className="acd-input-border">
                                                            {/* el-35: prefix */}
                                                            <div className="acd-prefix">
                                                                {/* el-36 */}
                                                                <span className="acd-prefix-text">{discountType === 'percent' ? '%' : 'TRY'}</span>
                                                            </div>
                                                            {/* el-37: input */}
                                                            <input
                                                                className="acd-input"
                                                                type="number"
                                                                min="0"
                                                                value={discountAmount}
                                                                onChange={e => onAmountChange(e.target.value)}
                                                                placeholder="0"
                                                            />
                                                        </div>
                                                        {/* el-38: toggle */}
                                                        <div className="acd-toggle">
                                                            {/* el-39: TRY button */}
                                                            <button
                                                                type="button"
                                                                className={`acd-toggle-btn${discountType === 'amount' ? ' acd-toggle-btn--active' : ''}`}
                                                                onClick={() => onToggleType('amount')}
                                                            >
                                                                {/* el-40 */}
                                                                <p className="acd-toggle-sr">TRY</p>
                                                                {/* el-41 */}
                                                                <span className="acd-toggle-icon"><AcdTryIcon /></span>
                                                            </button>
                                                            {/* el-44: % button */}
                                                            <button
                                                                type="button"
                                                                className={`acd-toggle-btn${discountType === 'percent' ? ' acd-toggle-btn--active' : ''}`}
                                                                onClick={() => onToggleType('percent')}
                                                            >
                                                                {/* el-45 */}
                                                                <p className="acd-toggle-sr">%</p>
                                                                {/* el-46 */}
                                                                <span className="acd-toggle-icon"><AcdPercentIcon /></span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                                {/* el-49: spacer */}
                                <div className="enm-spacer" />
                            </div>
                            {/* el-51: footer */}
                            <div className="enm-footer" style={{ borderTopColor: 'rgba(0,0,0,0)' }}>
                                {/* el-52 */}
                                <div className="acd-footer-inner">
                                    {/* el-53: total info */}
                                    <div className="acd-total-col">
                                        {/* el-54 */}
                                        <p className="acd-total-label">Total after discount</p>
                                        {/* el-55 */}
                                        <div className="acd-total-val-wrap">
                                            {/* el-56 */}
                                            <span className="acd-total-val">
                                                {/* el-57 */}
                                                <bdi>TRY {discounted.toFixed(2)}</bdi>
                                            </span>
                                        </div>
                                    </div>
                                    {/* el-58: button group */}
                                    <div className="acd-btn-group">
                                        {/* el-59: Add button */}
                                        <button className="acd-add-btn" type="button" onClick={onAdd}>
                                            {/* el-60 */}
                                            <div className="acd-add-inner">
                                                {/* el-61 */}
                                                <span className="acd-add-text-wrap">
                                                    {/* el-62 */}
                                                    <span className="acd-add-text">Add</span>
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── Kebab Dropdown / Quick Actions Menu (el-0 → el-64) ─── */
const KebabDropdown = ({ open, onClose, onAction }) => {
    const group1 = KEBAB_MENU_ITEMS.filter(i => i.group === 1);
    const group2 = KEBAB_MENU_ITEMS.filter(i => i.group === 2);

    return (
        <>
            {/* Backdrop */}
            {open && <div className="kbd-backdrop" onClick={onClose} />}
            {/* el-2: Popover card */}
            <div className={`kbd-card ${open ? 'kbd-card--open' : ''}`}>
                {/* el-4: positioner */}
                <div className="kbd-positioner">
                    {/* el-6: content */}
                    <div className="kbd-content">
                        {/* el-7: list */}
                        <ul className="kbd-list">
                            {/* el-8: group 1 — Quick actions */}
                            <li className="kbd-group">
                                {/* el-9: section header */}
                                <span className="kbd-section-header">
                                    {/* el-10 */}
                                    <span className="kbd-section-text-wrap">
                                        {/* el-11 */}
                                        <p className="kbd-section-title">Quick actions</p>
                                    </span>
                                </span>
                                {/* el-12: items */}
                                <ul className="kbd-items">
                                    {group1.map(item => (
                                        <li key={item.id} className="kbd-item" onClick={() => { onAction && onAction(item.id); onClose(); }}>
                                            {/* icon wrapper */}
                                            <span className="kbd-icon-wrap">
                                                <item.Icon />
                                            </span>
                                            {/* text wrapper */}
                                            <span className="kbd-text-wrap">
                                                <span className="kbd-text">{item.label}</span>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            {/* el-51: divider */}
                            <div className="kbd-divider-wrap">
                                <hr className="kbd-divider" />
                            </div>
                            {/* el-53: group 2 */}
                            <li className="kbd-group">
                                <ul className="kbd-items">
                                    {group2.map(item => (
                                        <li key={item.id} className="kbd-item" onClick={() => { onAction && onAction(item.id); onClose(); }}>
                                            <span className="kbd-text-wrap">
                                                <span className={`kbd-text ${item.danger ? 'kbd-text--danger' : ''}`}>{item.label}</span>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

/* ─── Cart Footer (el-199) ─── */
const CartFooter = ({ total, isPaymentView, onContinuePayment, paidAmount = 0, kebabOpen, onKebabToggle, onKebabAction }) => {
    const toPay = Math.max(0, total - paidAmount);
    const buttonLabel = isPaymentView ? 'Save' : 'Continue to payment';
    return (
        <div className="qs-cf-outer">
            <div className="qs-cf-inner">
                <div className="qs-cf-content">
                    <div className="qs-cf-stack">
                        <div className="qs-cf-topay-wrap">
                            <div className="qs-cf-topay-col">
                                <div className="qs-cf-topay-row">
                                    <p className="qs-cf-topay-label">To pay</p>
                                    <p className="qs-cf-topay-value">TRY {toPay.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="qs-cf-btns-wrap">
                            <div className="qs-cf-btns-row">
                                {/* el-0: kebab root with dropdown */}
                                <div className="kbd-root">
                                    <div className="qs-cf-options-wrap">
                                        <button className="qs-cf-options-btn" aria-label="Open options" onClick={onKebabToggle}>
                                            <div className="qs-cf-options-inner">
                                                <span className="qs-cf-options-sr">Open options</span>
                                                <span className="qs-cf-options-icon-wrap">
                                                    <span className="qs-cf-options-icon"><KebabDotsIcon /></span>
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                    <KebabDropdown
                                        open={kebabOpen}
                                        onClose={onKebabToggle}
                                        onAction={onKebabAction}
                                    />
                                </div>
                                <button
                                    className="qs-cf-pay-btn"
                                    onClick={!isPaymentView ? onContinuePayment : undefined}
                                >
                                    <div className="qs-cf-pay-inner">
                                        <span className="qs-cf-pay-text-wrap">
                                            <span className="qs-cf-pay-text">
                                                {buttonLabel}
                                            </span>
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

/* ─── Payment Selection Panel (el-237→323) ─── */
const CashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H3V6h18v12zm-9-7c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
    </svg>
);

const GiftCardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4 15.38 12 17 10.83 14.92 8H20v6z" />
    </svg>
);

const SplitPayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 10h6v2H4v-2zm0 4h6v2H4v-2zm0-8h6v2H4V6zm8 0h6v2h-6V6zm0 4h6v2h-6v-2zm0 4h6v2h-6v-2zM2 4v16h8V4H2zm18 0h-8v16h8V4z" />
    </svg>
);

const OtherPayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
);

const PAYMENT_METHODS = [
    { id: 'cash', label: 'Cash', Icon: CashIcon },
    { id: 'gift_card', label: 'Gift card', Icon: GiftCardIcon },
    { id: 'split', label: 'Split payment', Icon: SplitPayIcon },
    { id: 'other', label: 'Other', Icon: OtherPayIcon },
];

const PaymentSelectionPanel = ({ onBackToCart, onPaymentSelect }) => (
    <div className="psp-panel">
        <div className="psp-scroll">
            {/* Header */}
            <div className="psp-header">
                <div className="psp-header-inner">
                    <div className="psp-title-section">
                        <div className="psp-title-grid">
                            {/* Breadcrumb */}
                            <div className="psp-breadcrumb-row">
                                <ul className="psp-breadcrumb">
                                    <li className="psp-breadcrumb-item">
                                        <a className="psp-breadcrumb-link" onClick={onBackToCart}>
                                            <span>Cart</span>
                                            <span className="psp-breadcrumb-chevron">
                                                <ChevronRight />
                                            </span>
                                        </a>
                                    </li>
                                    <li className="psp-breadcrumb-item">
                                        <a className="psp-breadcrumb-link">
                                            <span>Tip</span>
                                            <span className="psp-breadcrumb-chevron">
                                                <ChevronRight />
                                            </span>
                                        </a>
                                    </li>
                                    <li className="psp-breadcrumb-item">
                                        <a className="psp-breadcrumb-link psp-breadcrumb-link--active">
                                            <span>Payment</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            {/* 16px gap */}
                            <div />
                            {/* Title */}
                            <div className="psp-title-row">
                                <div className="psp-title-inner">
                                    <h1 className="psp-title">Select payment</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Body — payment methods */}
            <div className="psp-body">
                <div className="psp-body-inner">
                    <div className="psp-body-padded">
                        <div className="psp-body-section">
                            <div className="psp-methods-grid">
                                {PAYMENT_METHODS.map(method => (
                                    <div className={`psp-card ${method.id === 'other' ? 'psp-card--accent' : ''}`} key={method.id}>
                                        <button className="psp-card-btn" aria-label={method.label} onClick={() => onPaymentSelect && onPaymentSelect(method.id)} />
                                        <div className="psp-card-bg" />
                                        <div className="psp-card-border" />
                                        <div className="psp-card-content">
                                            <span className={`psp-card-icon ${method.id === 'other' ? 'psp-card-icon--accent' : ''}`}>
                                                <method.Icon />
                                            </span>
                                            <div className="psp-card-label-wrap">
                                                <p className="psp-card-label">{method.label}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

/* ─── Backspace Icon for numpad ─── */
const BackspaceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7.707 4.293a1 1 0 0 0-1.414 0l-4 4a1 1 0 0 0 0 1.414l4 4a1 1 0 0 0 1.414-1.414L5.414 10l2.293-2.293a1 1 0 0 0 0-1.414ZM17 5a1 1 0 1 0-2 0v10a1 1 0 1 0 2 0V5Zm-4.293-.707a1 1 0 0 1 0 1.414L10.414 8l2.293 2.293a1 1 0 0 1-1.414 1.414l-3-3a1 1 0 0 1 0-1.414l3-3a1 1 0 0 1 1.414 0Z" />
    </svg>
);

/* ─── Cash Amount Modal (el-0 → el-149) ─── */
const CashAmountModal = ({ open, onClose, onAdd, total, staffName = 'Furkan Kem' }) => {
    const [amount, setAmount] = useState('');
    const [focused, setFocused] = useState(true);
    const inputRef = useRef(null);

    // Quick pill amounts derived from total
    const pills = total > 0 ? [
        total,
        total + 1,
        Math.ceil(total / 10) * 10,
        Math.ceil(total / 10) * 10 + 10,
        Math.ceil(total / 100) * 100 > total ? Math.ceil(total / 100) * 100 : total + 100,
    ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 5) : [10, 20, 50, 100, 500];

    const leftToPay = Math.max(0, total - (parseFloat(amount) || 0));

    const handleKey = useCallback((key) => {
        if (key === 'backspace') {
            setAmount(prev => prev.slice(0, -1));
        } else if (key === '.') {
            setAmount(prev => {
                if (prev.includes('.')) return prev;
                return prev === '' ? '0.' : prev + '.';
            });
        } else {
            setAmount(prev => {
                // Don't allow more than 2 decimal places
                const dotIdx = prev.indexOf('.');
                if (dotIdx !== -1 && prev.length - dotIdx > 2) return prev;
                return prev + key;
            });
        }
    }, []);

    const handlePill = useCallback((val) => {
        setAmount(String(val));
    }, []);

    // Auto-focus hidden input and reset amount on open
    useEffect(() => {
        if (open) {
            setAmount('');
            if (inputRef.current) inputRef.current.focus();
        }
    }, [open]);

    if (!open) return null;

    const displayValue = amount || '0';
    const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'];

    return (
        <div className="cam-overlay" onClick={onClose}>
            <div className="cam-scroll">
                <div className="cam-center">
                    <div className="cam-card" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="cam-header">
                            <div className="cam-header-inner">
                                <div className="cam-title-wrap">
                                    <p className="cam-title">Add cash amount</p>
                                </div>
                            </div>
                            <button className="cam-close-btn" onClick={onClose} aria-label="Close modal">
                                <div className="cam-close-inner">
                                    <span className="cam-close-icon-wrap">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </span>
                                </div>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="cam-body">
                            <div className="cam-body-content">
                                <div className="cam-form-section">
                                    {/* Amount */}
                                    <div className="cam-amount-wrap">
                                        <div className="cam-amount-inner">
                                            <label className="cam-amount-label">Amount</label>
                                            <div className="cam-amount-col">
                                                <div className="cam-amount-focus">
                                                    <div className="cam-amount-row">
                                                        <span className="cam-currency">TRY</span>
                                                        <div className="cam-input-container">
                                                            <span className="cam-input-sizer">{displayValue}</span>
                                                            <input
                                                                ref={inputRef}
                                                                className="cam-input"
                                                                type="text"
                                                                inputMode="decimal"
                                                                value={displayValue}
                                                                onFocus={() => setFocused(true)}
                                                                onBlur={() => setFocused(false)}
                                                                onChange={e => {
                                                                    const v = e.target.value.replace(/[^0-9.]/g, '');
                                                                    setAmount(v);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className={`cam-underline ${focused ? 'active' : ''}`} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pills */}
                                    <div className="cam-pills-wrap">
                                        <div className="cam-pills-scroll">
                                            <div className="cam-pills-row">
                                                {pills.map((val) => (
                                                    <button key={val} className="cam-pill-btn" onClick={() => handlePill(val)}>
                                                        <div className="cam-pill-inner">
                                                            <span className="cam-pill-text-wrap">
                                                                <span className="cam-pill-text">TRY {val}</span>
                                                            </span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Numpad */}
                                    <div className="cam-numpad">
                                        <div className="cam-numpad-grid">
                                            {KEYS.map((key) => (
                                                <button key={key} className="cam-key-btn" onClick={() => handleKey(key)}>
                                                    <div className="cam-key-inner">
                                                        {key === 'backspace' ? (
                                                            <div className="cam-key-icon-wrap">
                                                                <span className="cam-key-icon">
                                                                    <BackspaceIcon />
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="cam-key-text-wrap">
                                                                <span className="cam-key-text">{key}</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="cam-footer">
                            <div className="cam-footer-content">
                                <div className="cam-received-row">
                                    <p className="cam-received-label">Cash received by</p>
                                    <button className="cam-received-link">
                                        <span className="cam-received-name">{staffName}</span>
                                    </button>
                                </div>
                                <div className="cam-bottom-row">
                                    <div className="cam-left-side">
                                        <div className="cam-left-text">
                                            <p className="cam-left-label">Left to pay •&nbsp;</p>
                                            <p className="cam-left-value">TRY {leftToPay}</p>
                                        </div>
                                    </div>
                                    <div className="cam-right-side">
                                        <button className="cam-add-btn" onClick={() => onAdd && onAdd(amount)}>
                                            <div className="cam-add-inner">
                                                <span className="cam-add-text-wrap">
                                                    <span className="cam-add-text">Add</span>
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
    );
};

/* ─── Quick Sale Items Modal (QSI) ─── */
const QSI_ITEMS = [
    { id: 1, name: 'Haircut', price: 'TRY 40', color: 'rgb(165, 223, 248)' },
    { id: 2, name: 'Blow-dry', price: 'TRY 30', color: 'rgb(165, 223, 248)' },
    { id: 3, name: 'Hair Color', price: 'TRY 57', color: 'rgb(165, 223, 248)' },
    { id: 4, name: 'Manicure', price: 'TRY 25', color: 'rgb(165, 223, 248)' },
    { id: 5, name: 'Pedicure', price: 'TRY 30', color: 'rgb(165, 223, 248)' },
];
const QSI_MAX = 12;

const QsiSearchIcon = () => (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8M2 8a6 6 0 1 1 10.89 3.476l4.817 4.817a1 1 0 0 1-1.414 1.414l-4.816-4.816A6 6 0 0 1 2 8" />
    </svg>
);

const QsiTrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 21c-.55 0-1.02-.196-1.412-.587A1.926 1.926 0 0 1 5 19V6H4V4h5V3h6v1h5v2h-1v13c0 .55-.196 1.021-.587 1.413A1.926 1.926 0 0 1 17 21H7ZM17 6H7v13h10V6ZM9 17h2V8H9v9Zm4 0h2V8h-2v9Z" />
    </svg>
);

const QuickSaleItemsModal = ({ open, onClose }) => {
    const [items, setItems] = useState(QSI_ITEMS);
    const [search, setSearch] = useState('');

    const emptySlots = Math.max(0, QSI_MAX - items.length);
    const filteredItems = search.trim()
        ? items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
        : items;

    const handleDelete = (id) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    return (
        <div className={`qsi-backdrop${open ? ' qsi-open' : ''}`}>
            <div className={`qsi-transform${open ? ' qsi-open' : ''}`}>
                <div className="qsi-scroll">
                    <div className="qsi-card">
                        {/* el-4: sticky header */}
                        <div className="qsi-header">
                            <div className="qsi-header-inner">
                                <div className="qsi-header-title-area">
                                    <p className="qsi-header-title">Quick sale items</p>
                                </div>
                                <div className="qsi-btn-group">
                                    <div className="qsi-btn-row">
                                        <button className="qsi-close-btn" onClick={onClose}>
                                            <span>Close</span>
                                        </button>
                                        <button className="qsi-save-btn">
                                            <span>Save</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* el-20: body */}
                        <div className="qsi-body qsi-body-pad">
                            <div className="qsi-content">
                                {/* Title section */}
                                <div className="qsi-title-section">
                                    <h1 className="qsi-main-title">Quick sale items</h1>
                                    <p className="qsi-subtitle">Search for sellable items to add to your quick sale layout. Drag and drop to rearrange.</p>
                                </div>

                                {/* Content area */}
                                <div className="qsi-items-area">
                                    {/* Search */}
                                    <div className="qsi-search-wrap">
                                        <div className="qsi-search-box">
                                            <div className="qsi-search-icon-wrap">
                                                <span className="qsi-search-icon">
                                                    <QsiSearchIcon />
                                                </span>
                                            </div>
                                            <input
                                                className="qsi-search-input"
                                                placeholder="Search for services"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Items Grid */}
                                    <div className="qsi-grid">
                                        {filteredItems.map(item => (
                                            <div key={item.id} className="qsi-item-wrap">
                                                <div className="qsi-item-card">
                                                    <div className="qsi-accent-outer">
                                                        <div className="qsi-accent-bar" style={{ backgroundColor: item.color }} />
                                                    </div>
                                                    <div className="qsi-item-content">
                                                        <div className="qsi-item-text">
                                                            <p className="qsi-item-name">{item.name}</p>
                                                            <p className="qsi-item-price">{item.price}</p>
                                                        </div>
                                                    </div>
                                                    <div className="qsi-item-actions">
                                                        <div className="qsi-delete-wrap">
                                                            <button className="qsi-delete-btn" onClick={() => handleDelete(item.id)}>
                                                                <span className="qsi-trash-icon">
                                                                    <QsiTrashIcon />
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Empty placeholder slots */}
                                        {Array.from({ length: emptySlots }).map((_, idx) => (
                                            <div key={`empty-${idx}`} className="qsi-empty-card">
                                                <div className="qsi-empty-inner">
                                                    <div className="qsi-empty-pad" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Max items text */}
                                    <p className="qsi-max-text">Max {QSI_MAX} items</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── Drawer Component ─── */
const QuickSaleDrawer = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('Quick Sale');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [tabsWithResults, setTabsWithResults] = useState([]);
    const [tabCounts, setTabCounts] = useState({});
    const searchTimerRef = useRef(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [catPanelOpen, setCatPanelOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [panelEditItem, setPanelEditItem] = useState(null);
    const [clientPanelOpen, setClientPanelOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [paymentView, setPaymentView] = useState(false);
    const [cashModalOpen, setCashModalOpen] = useState(false);
    const [payments, setPayments] = useState([]);
    const [kebabOpen, setKebabOpen] = useState(false);
    const [noteModalOpen, setNoteModalOpen] = useState(false);
    const [saleNote, setSaleNote] = useState('');
    const [discountModalOpen, setDiscountModalOpen] = useState(false);
    const [discountType, setDiscountType] = useState('percent');
    const [discountAmount, setDiscountAmount] = useState('');
    const [qsiModalOpen, setQsiModalOpen] = useState(false);
    const paymentIdCounter = useRef(0);
    const cartIdCounter = useRef(0);
    const cartBodyRef = useRef(null);
    const cartHeaderRef = useRef(null);

    // Scroll detection for header shadow
    useEffect(() => {
        const body = cartBodyRef.current;
        const header = cartHeaderRef.current;
        if (!body || !header) return;
        const onScroll = () => {
            if (body.scrollTop > 0) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        body.addEventListener('scroll', onScroll);
        return () => body.removeEventListener('scroll', onScroll);
    }, []);

    const addToCart = useCallback((item) => {
        cartIdCounter.current += 1;
        setCartItems(prev => [...prev, { ...item, cartId: cartIdCounter.current }]);
    }, []);

    const removeFromCart = useCallback((cartId) => {
        setCartItems(prev => prev.filter(i => i.cartId !== cartId));
    }, []);

    const cartSubtotal = cartItems.reduce((sum, item) => {
        const num = parseInt((item.price || '').replace(/[^0-9]/g, ''), 10) || 0;
        return sum + num;
    }, 0);

    const paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);

    const addPayment = useCallback((method, amount) => {
        paymentIdCounter.current += 1;
        setPayments(prev => [...prev, { id: paymentIdCounter.current, method, amount }]);
    }, []);

    const removePayment = useCallback((id) => {
        setPayments(prev => prev.filter(p => p.id !== id));
    }, []);

    const handleTabChange = useCallback((tab) => {
        setActiveTab(tab);
    }, []);

    const isSearching = searchQuery.trim().length > 0;

    // Filter items for a given tab by search query
    const getFilteredItems = useCallback((tab, query) => {
        const items = TAB_ITEMS[tab] || [];
        if (!query.trim()) return items;
        return items.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));
    }, []);

    // When search query changes, simulate brief loading then resolve which tabs have results
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchLoading(false);
            setTabsWithResults([]);
            setTabCounts({});
            setActiveTab('Quick Sale');
            return;
        }

        setSearchLoading(true);
        setActiveTab('All');

        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
        searchTimerRef.current = setTimeout(() => {
            const counts = {};
            const matched = TABS.filter(tab => {
                const items = TAB_ITEMS[tab] || [];
                const filtered = items.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
                if (filtered.length > 0) {
                    counts[tab] = filtered.length;
                    return true;
                }
                return false;
            });
            setTabsWithResults(matched);
            setTabCounts(counts);
            setSearchLoading(false);
        }, 400);

        return () => {
            if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
        };
    }, [searchQuery]);

    // Get items to display for non-search single tab mode
    const displayItems = !isSearching ? (TAB_ITEMS[activeTab] || []) : [];

    return (
        <>
            {/* Backdrop overlay */}
            <div
                className={`qs-backdrop ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={`qs-drawer ${isOpen ? 'open' : ''}`}>
                {/* Close Button (floating left outside drawer) */}
                <div className="qs-close-wrapper">
                    <button className="qs-close-btn" onClick={onClose} aria-label="Close Drawer">
                        <CloseIcon />
                    </button>
                </div>

                <div className="qs-grid">
                    {/* ─── LEFT PANEL: Catalog ─── */}
                    <div className="qs-catalog-panel">
                        {paymentView ? (
                            <PaymentSelectionPanel onBackToCart={() => setPaymentView(false)} onPaymentSelect={(methodId) => { if (methodId === 'cash') setCashModalOpen(true); }} />
                        ) : (
                            <>
                                <div className="qs-catalog-scroll">
                                    {/* Header: Title + Breadcrumbs */}
                                    <div className="qs-catalog-header">
                                        <div className="qs-catalog-title-section">
                                            <div className="qs-catalog-title-grid">
                                                <Breadcrumbs />
                                                <div /> {/* 16px gap row */}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <h1 className="qs-page-title">Add to cart</h1>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Body: Search + Tabs + Cards */}
                                    <div className="qs-catalog-body">
                                        <div className="qs-catalog-content">
                                            {/* Search Bar */}
                                            <div className="qs-search-wrapper">
                                                <div className="qs-search-container">
                                                    <div className={`qs-search-field ${isSearching ? 'has-value' : ''}`}>
                                                        <div className="qs-search-icon-wrap">
                                                            <SearchIcon />
                                                        </div>
                                                        <input
                                                            className="qs-search-input"
                                                            type="text"
                                                            placeholder="Search"
                                                            value={searchQuery}
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                        />
                                                        {isSearching && (
                                                            <div className="qs-search-clear-group">
                                                                <button
                                                                    className="qs-search-clear-text"
                                                                    onClick={() => setSearchQuery('')}
                                                                >
                                                                    Clear
                                                                </button>
                                                                <button
                                                                    className="qs-search-clear-icon"
                                                                    onClick={() => setSearchQuery('')}
                                                                    aria-label="Clear search"
                                                                >
                                                                    <CloseIcon />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tab Bar */}
                                            <TabBar
                                                activeTab={activeTab}
                                                onTabChange={handleTabChange}
                                                isSearching={isSearching}
                                                searchLoading={searchLoading}
                                                tabsWithResults={tabsWithResults}
                                                tabCounts={tabCounts}
                                            />

                                            {/* Tab Content — Carousel slider */}
                                            {isSearching ? (
                                                /* Search mode: overlay on top (no carousel) */
                                                <div className="qs-items-wrapper">
                                                    {searchLoading ? (
                                                        <div className="qs-search-loading">
                                                            <SpinnerIcon />
                                                            <span>Searching...</span>
                                                        </div>
                                                    ) : activeTab === 'All' ? (
                                                        tabsWithResults.length > 0 ? (
                                                            tabsWithResults.map(tab => (
                                                                <CategorySection
                                                                    key={tab}
                                                                    category={tab}
                                                                    items={TAB_ITEMS[tab] || []}
                                                                    searchQuery={searchQuery}
                                                                />
                                                            ))
                                                        ) : (
                                                            <div className="qs-no-results-card">
                                                                <div className="qs-no-results-card-bg" />
                                                                <div className="qs-no-results-card-border" />
                                                                <div className="qs-no-results-content">
                                                                    <div className="qs-no-results-center">
                                                                        <picture className="qs-no-results-picture">
                                                                            <img
                                                                                className="qs-no-results-img"
                                                                                src="https://cdn-partners.fresha.com/assets-v2/static/image/illustration-search-file.a84cd471.png"
                                                                                alt=""
                                                                            />
                                                                        </picture>
                                                                        <div className="qs-no-results-text-wrap">
                                                                            <span className="qs-no-results-title">No results for '{searchQuery}'</span>
                                                                            <span className="qs-no-results-subtitle">Try adjusting your search</span>
                                                                        </div>
                                                                        <div className="qs-no-results-btn-wrap">
                                                                            <button className="qs-no-results-clear-btn" onClick={() => setSearchQuery('')}>
                                                                                <div className="qs-no-results-clear-btn-inner">
                                                                                    <span className="qs-no-results-clear-btn-label">Clear search</span>
                                                                                </div>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    ) : (
                                                        <CategorySection
                                                            category={activeTab}
                                                            items={TAB_ITEMS[activeTab] || []}
                                                            searchQuery={searchQuery}
                                                        />
                                                    )}
                                                </div>
                                            ) : (
                                                /* Normal mode: carousel slider */
                                                <div className="qs-tab-viewport">
                                                    <div
                                                        className="qs-tab-track"
                                                        style={{ transform: `translateX(-${TABS.indexOf(activeTab) * 100}%)` }}
                                                    >
                                                        {/* Panel 0: Quick Sale */}
                                                        <div className="qs-tab-panel">
                                                            <div className="qs-items-wrapper">
                                                                <div className="qs-service-grid">
                                                                    {(TAB_ITEMS['Quick Sale'] || []).map((service, idx) => (
                                                                        <ServiceCard key={idx} service={service} onAdd={addToCart} />
                                                                    ))}
                                                                </div>
                                                                <div className="qs-edit-link-wrapper">
                                                                    <button className="qs-edit-link" onClick={() => setQsiModalOpen(true)}>Edit items</button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Panel 1: Appointments */}
                                                        <div className="qs-tab-panel">
                                                            <AppointmentsContent />
                                                        </div>

                                                        {/* Panel 2: Services */}
                                                        <div className="qs-tab-panel">
                                                            <ServicesContent
                                                                onCategorySelect={(cat) => { setSelectedCategory(cat); setCatPanelOpen(true); }}
                                                            />
                                                        </div>

                                                        {/* Panel 3: Products */}
                                                        <div className="qs-tab-panel">
                                                            <ProductsContent onAddProduct={addToCart} />
                                                        </div>

                                                        {/* Panel 4: Memberships */}
                                                        <div className="qs-tab-panel">
                                                            <div className="qs-items-wrapper">
                                                                <div className="qs-service-grid">
                                                                    {(TAB_ITEMS['Memberships'] || []).map((service, idx) => (
                                                                        <ServiceCard key={idx} service={service} onAdd={addToCart} />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Panel 5: Gift cards */}
                                                        <div className="qs-tab-panel">
                                                            <div className="qs-items-wrapper">
                                                                <div className="qs-service-grid">
                                                                    {(TAB_ITEMS['Gift cards'] || []).map((service, idx) => (
                                                                        <ServiceCard key={idx} service={service} />
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

                                {/* Category Detail Sub-Drawer (el-48) — always rendered, slides over left panel */}
                                <CategoryDetailPanel
                                    isOpen={catPanelOpen}
                                    category={selectedCategory}
                                    onBack={() => {
                                        setCatPanelOpen(false);
                                        setTimeout(() => setSelectedCategory(null), 500);
                                    }}
                                    onAddService={addToCart}
                                />
                            </>
                        )}
                    </div>

                    {/* ─── RIGHT PANEL: Cart ─── */}
                    <div className="qs-cart-panel">
                        <div className="qs-cart-scroll">
                            <div className="qs-cart-header" ref={cartHeaderRef}>
                                <ClientCard
                                    onClick={() => setClientPanelOpen(true)}
                                    selectedClient={selectedClient}
                                    onChangeClient={() => setClientPanelOpen(true)}
                                    onRemoveClient={() => setSelectedClient(null)}
                                />
                            </div>
                            <div className="qs-cart-body" ref={cartBodyRef}>
                                {cartItems.length === 0 ? (
                                    <EmptyCartState />
                                ) : (
                                    <div className="qs-cart-full">
                                        <div className="qs-cart-items-outer">
                                            <div className="qs-cart-items-col">
                                                <div className="qs-cart-items-list">
                                                    {cartItems.map((item, idx) => (
                                                        <CartItem key={item.cartId} item={item} index={idx} onRemove={removeFromCart} onEdit={setPanelEditItem} />
                                                    ))}
                                                </div>
                                                {paymentView && (
                                                    <div className="qs-addtocart-wrap">
                                                        <button className="svc-added-add-btn">
                                                            <div className="svc-added-add-btn-inner">
                                                                <span className="svc-added-add-btn-icon-slot">
                                                                    <span className="svc-added-add-btn-icon">
                                                                        <CartPlusIcon />
                                                                    </span>
                                                                </span>
                                                                <span className="svc-added-add-btn-label-wrap">
                                                                    <span className="svc-added-add-btn-label">Add to cart</span>
                                                                </span>
                                                            </div>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <CartSummary subtotal={cartSubtotal} payments={payments} onRemovePayment={removePayment} />
                                    </div>
                                )}
                            </div>
                        </div>
                        {cartItems.length > 0 && <CartFooter total={cartSubtotal} isPaymentView={paymentView} onContinuePayment={() => setPaymentView(true)} paidAmount={paidAmount} kebabOpen={kebabOpen} onKebabToggle={() => setKebabOpen(prev => !prev)} onKebabAction={(id) => { if (id === 'edit_sale_note') setNoteModalOpen(true); if (id === 'add_cart_discount') setDiscountModalOpen(true); }} />}
                        <EditNoteModal open={noteModalOpen} onClose={() => setNoteModalOpen(false)} noteValue={saleNote} onNoteChange={setSaleNote} onApply={() => setNoteModalOpen(false)} />
                        <AddCartDiscountModal open={discountModalOpen} onClose={() => setDiscountModalOpen(false)} discountType={discountType} onToggleType={setDiscountType} discountAmount={discountAmount} onAmountChange={setDiscountAmount} total={cartSubtotal} onAdd={() => setDiscountModalOpen(false)} />

                        {/* Edit Cart Panel (slides over the cart panel) */}
                        <EditCartPanel
                            item={panelEditItem}
                            open={!!panelEditItem}
                            onClose={() => setPanelEditItem(null)}
                            onApply={(updatedItem) => {
                                setCartItems(prev => prev.map(ci => ci.cartId === updatedItem.cartId ? updatedItem : ci));
                            }}
                            onRemove={(cartId) => {
                                setCartItems(prev => prev.filter(ci => ci.cartId !== cartId));
                            }}
                        />

                        {/* Client Selection Panel (slides over the cart panel) */}
                        <ClientSelectionPanel
                            open={clientPanelOpen}
                            onClose={() => setClientPanelOpen(false)}
                            onSelectClient={(selection) => {
                                setSelectedClient(selection);
                                setClientPanelOpen(false);
                            }}
                        />
                    </div>
                </div>
            </div >

            {/* Edit Cart Item Modal */}
            {
                editingItem && (
                    <EditCartItemModal
                        item={editingItem}
                        onClose={() => setEditingItem(null)}
                        onApply={(updatedItem) => {
                            setCartItems(prev => prev.map(ci => ci.cartId === updatedItem.cartId ? updatedItem : ci));
                        }}
                        onRemove={(cartId) => {
                            setCartItems(prev => prev.filter(ci => ci.cartId !== cartId));
                        }}
                    />
                )
            }

            {/* Cash Amount Modal */}
            <CashAmountModal
                open={cashModalOpen}
                onClose={() => setCashModalOpen(false)}
                total={cartSubtotal - paidAmount}
                onAdd={(amount) => {
                    addPayment('Cash', parseFloat(amount) || 0);
                    setCashModalOpen(false);
                }}
            />

            {/* Quick Sale Items Modal */}
            <QuickSaleItemsModal open={qsiModalOpen} onClose={() => setQsiModalOpen(false)} />
        </>
    );
};

/* ─── Sales Detail Drawer Icons ─── */
const SdCloseIcon = () => (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fillRule="evenodd" d="M7.293 7.293a1 1 0 0 1 1.414 0L16 14.586l7.293-7.293a1 1 0 1 1 1.414 1.414L17.414 16l7.293 7.293a1 1 0 0 1-1.414 1.414L16 17.414l-7.293 7.293a1 1 0 0 1-1.414-1.414L14.586 16 7.293 8.707a1 1 0 0 1 0-1.414" clipRule="evenodd" /></svg>
);
const SdCheckIcon = () => (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="m29.061 9.06-16 16a1.5 1.5 0 0 1-2.125 0l-7-7a1.503 1.503 0 1 1 2.125-2.124L12 21.875 26.939 6.938a1.502 1.502 0 1 1 2.125 2.125z" /></svg>
);
const SdKebabIcon = () => (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 23.333A2.333 2.333 0 1 1 16 28a2.333 2.333 0 0 1 0-4.667M16 13.667a2.333 2.333 0 1 1 0 4.666 2.333 2.333 0 0 1 0-4.666M16 4a2.333 2.333 0 1 1 0 4.667A2.333 2.333 0 0 1 16 4" /></svg>
);
const SdDetailsIcon = () => (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fillRule="evenodd" d="M3.252 5.92a2 2 0 0 1 1.415-.587h22a2 2 0 0 1 2 2v19a1 1 0 0 1-1.448.895l-3.552-1.777-3.553 1.777a1 1 0 0 1-.895 0l-3.552-1.777-3.553 1.777a1 1 0 0 1-.895 0L7.667 25.45l-3.553 1.777a1 1 0 0 1-1.447-.895v-19a2 2 0 0 1 .585-1.414m23.415 1.413h-22v17.382l2.552-1.276a1 1 0 0 1 .895 0l3.553 1.776 3.552-1.776a1 1 0 0 1 .895 0l3.553 1.776 3.552-1.776a1 1 0 0 1 .895 0l2.553 1.276zm-18.5 6a1 1 0 0 1 1-1h13a1 1 0 0 1 0 2h-13a1 1 0 0 1-1-1m0 4a1 1 0 0 1 1-1h13a1 1 0 0 1 0 2h-13a1 1 0 0 1-1-1" clipRule="evenodd" /></svg>
);
const SdActivityIcon = () => (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fillRule="evenodd" d="M3 7a2 2 0 0 1 2-2h22a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm24 0H5v18h22zM13.571 9a1 1 0 0 1 .893.62l4.12 10.044 2.074-3.852a1 1 0 0 1 .88-.526H24a1 1 0 1 1 0 2h-1.864l-2.794 5.188a1 1 0 0 1-1.806-.094l-4.078-9.941-2.098 4.286a1 1 0 0 1-.899.56H8a1 1 0 1 1 0-2h1.838L12.64 9.56a1 1 0 0 1 .931-.56" clipRule="evenodd" /></svg>
);
const SdRefundIcon = () => (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fillRule="evenodd" d="M17.948 6.193a10 10 0 1 0 5.12 16.875 1 1 0 1 1 1.414 1.414 12 12 0 1 1 0-16.964l2.543 2.535v-3.59a1 1 0 1 1 2 0v6a1 1 0 0 1-1 1h-6a1 1 0 1 1 0-2h3.58l-2.537-2.531a10 10 0 0 0-5.12-2.74" clipRule="evenodd" /></svg>
);
const SdEditIcon = () => (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fillRule="evenodd" d="M21 4a2 2 0 0 0-1.422.593l-15 15A1.99 1.99 0 0 0 4 20.998v5.588a2 2 0 0 0 2 2h5.588c.324 0 .537-.058.758-.15.242-.099.462-.244.647-.429l15-15a2 2 0 0 0 0-2.843l-5.571-5.57A2 2 0 0 0 21 4m-4 6L6 21v5.586h5.586l11-11zm1.414-1.414L24 14.172l2.58-2.592-5.585-5.575z" clipRule="evenodd" /></svg>
);
const SdNoteIcon = () => (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fillRule="evenodd" d="M10 2a1 1 0 0 1 1 1v1h4V3a1 1 0 1 1 2 0v1h4V3a1 1 0 1 1 2 0v1h2a2 2 0 0 1 2 2v19a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V6a2 2 0 0 1 2-2h2V3a1 1 0 0 1 1-1M9 6H7v19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6h-2v1a1 1 0 1 1-2 0V6h-4v1a1 1 0 1 1-2 0V6h-4v1a1 1 0 1 1-2 0zm2 10a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2h-8a1 1 0 0 1-1-1m0 4a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2h-8a1 1 0 0 1-1-1" clipRule="evenodd" /></svg>
);
const SdEmailIcon = () => (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fillRule="evenodd" d="M6.69 2.185a2 2 0 0 1 1.167.24L28.97 14.25a2 2 0 0 1 0 3.5L7.857 29.575a2 2 0 0 1-2.85-2.423L8.982 16 5.007 4.85a2 2 0 0 1 .587-2.198 2 2 0 0 1 1.096-.467m.2 1.992L10.75 15h7.3a1 1 0 0 1 0 2h-7.3L6.89 27.825l21.107-11.822z" clipRule="evenodd" /></svg>
);
const SdPrintIcon = () => (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M25 14.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" /><path fillRule="evenodd" d="M8 4a1 1 0 0 0-1 1v4H5.662C3.999 9 2.5 10.275 2.5 12v10a1 1 0 0 0 1 1H7v4.5a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V23h3.5a1 1 0 0 0 1-1V12c0-1.725-1.498-3-3.163-3H25V5a1 1 0 0 0-1-1zm-2.338 7h20.675c.711 0 1.163.525 1.163 1v9H25v-2a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v2H4.5v-9c0-.475.452-1 1.162-1M9 9h14V6H9zm0 11h14v6.5H9z" clipRule="evenodd" /></svg>
);
const SdPdfIcon = () => (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fillRule="evenodd" d="M5.586 3.586A2 2 0 0 1 7 3h12a1 1 0 0 1 .707.293l7 7A1 1 0 0 1 27 11v5a1 1 0 1 1-2 0v-4h-6a1 1 0 0 1-1-1V5H7v11a1 1 0 1 1-2 0V5a2 2 0 0 1 .586-1.414M20 6.414 23.586 10H20zM5 21a1 1 0 0 1 1-1h2a3 3 0 0 1 0 6H7v1a1 1 0 1 1-2 0zm2 3h1a1 1 0 0 0 0-2H7zm6.25-3a1 1 0 0 1 1-1H16a4 4 0 1 1 0 8h-1.75a1 1 0 0 1-1-1zm2 1v4H16a2 2 0 0 0 0-4zm7.25-1a1 1 0 0 1 1-1H27a1 1 0 1 1 0 2h-2.5v1.5h2a1 1 0 1 1 0 2h-2V27a1 1 0 1 1-2 0z" clipRule="evenodd" /></svg>
);


/* ─── SVG Icons for Activity Tab ─── */
const SdMoneyIcon = () => (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fillRule="evenodd" d="M5 5a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h22a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm22 2H5v18h22zm-6.5 9a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0M16 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" clipRule="evenodd" /></svg>
);
const SdSmallCheckIcon = () => (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fillRule="evenodd" d="M13.488 4.43a.75.75 0 0 1 .082 1.058l-6 7a.75.75 0 0 1-1.1.04l-3-3a.75.75 0 0 1 1.06-1.06l2.427 2.426 5.473-6.382a.75.75 0 0 1 1.058-.082" clipRule="evenodd" /></svg>
);
const SdChevronDownIcon = () => (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 13.207 4.147 7.353a.5.5 0 0 1 .707-.707L10 11.793l5.147-5.147a.5.5 0 0 1 .707.707z" clipRule="evenodd" /></svg>
);

/* ─── Sale Details Options Dropdown ─── */
const SD_OPTIONS_MENU_ITEMS = [
    { id: 'refundSale', label: 'Refund sale', Icon: SdRefundIcon, group: 1 },
    { id: 'goToEditSale', label: 'Edit sale details', Icon: SdEditIcon, group: 1 },
    { id: 'goToAddNoteModal', label: 'Add a note', Icon: SdNoteIcon, group: 1 },
    { id: 'goToEmailModal', label: 'Email', Icon: SdEmailIcon, group: 2 },
    { id: 'print', label: 'Print', Icon: SdPrintIcon, group: 2 },
    { id: 'downloadPdf', label: 'Download PDF', Icon: SdPdfIcon, group: 2 },
    { id: 'goToVoidModal', label: 'Void sale', group: 3, danger: true },
];

const SdOptionsDropdown = ({ open, onClose, onAction }) => {
    const group1 = SD_OPTIONS_MENU_ITEMS.filter(i => i.group === 1);
    const group2 = SD_OPTIONS_MENU_ITEMS.filter(i => i.group === 2);
    const group3 = SD_OPTIONS_MENU_ITEMS.filter(i => i.group === 3);

    return (
        <>
            {open && <div className="kbd-backdrop" onClick={onClose} />}
            <div className={`kbd-card sd-kbd-card ${open ? 'kbd-card--open' : ''}`}>
                <div className="kbd-positioner">
                    <div className="kbd-content">
                        <ul className="kbd-list">
                            {/* Group 1: Quick actions */}
                            <li className="kbd-group">
                                <span className="kbd-section-header">
                                    <span className="kbd-section-text-wrap">
                                        <p className="kbd-section-title">Quick actions</p>
                                    </span>
                                </span>
                                <ul className="kbd-items">
                                    {group1.map(item => (
                                        <li key={item.id} className="kbd-item" onClick={() => { onAction && onAction(item.id); onClose(); }}>
                                            <span className="kbd-icon-wrap"><item.Icon /></span>
                                            <span className="kbd-text-wrap">
                                                <span className="kbd-text">{item.label}</span>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            {/* Divider */}
                            <div className="kbd-divider-wrap"><hr className="kbd-divider" /></div>
                            {/* Group 2: Email / Print / PDF */}
                            <li className="kbd-group">
                                <ul className="kbd-items">
                                    {group2.map(item => (
                                        <li key={item.id} className="kbd-item" onClick={() => { onAction && onAction(item.id); onClose(); }}>
                                            <span className="kbd-icon-wrap"><item.Icon /></span>
                                            <span className="kbd-text-wrap">
                                                <span className="kbd-text">{item.label}</span>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            {/* Divider */}
                            <div className="kbd-divider-wrap"><hr className="kbd-divider" /></div>
                            {/* Group 3: Danger zone */}
                            <li className="kbd-group">
                                <ul className="kbd-items">
                                    {group3.map(item => (
                                        <li key={item.id} className="kbd-item" onClick={() => { onAction && onAction(item.id); onClose(); }}>
                                            <span className="kbd-text-wrap">
                                                <span className={`kbd-text ${item.danger ? 'kbd-text--danger' : ''}`}>{item.label}</span>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

/* ─── Sale Details Drawer Component ─── */
const SaleDetailsDrawer = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('details');
    const [sdOptionsOpen, setSdOptionsOpen] = useState(false);
    return (
        <>
            {/* Backdrop */}
            <div className={`sd-backdrop${isOpen ? ' sd-open' : ''}`} onClick={onClose} />

            {/* el-0: Root drawer */}
            <div className={`sd-root${isOpen ? ' sd-open' : ''}`}>
                {/* el-1: Grid shell */}
                <div className="sd-shell">

                    {/* el-2: Close button zone */}
                    <div className="sd-close-zone">
                        {/* el-3: Close button */}
                        <button className="sd-close-btn" onClick={onClose}>
                            {/* el-4: Close button inner */}
                            <div className="sd-close-inner">
                                {/* el-5: SR-only label */}
                                <span className="sd-sr-only">
                                    {/* el-6 */}
                                    <span>Close Drawer</span>
                                </span>
                                {/* el-7: Icon wrapper */}
                                <span className="sd-close-icon-outer">
                                    {/* el-8 */}
                                    <span className="sd-close-icon-inner">
                                        {/* el-9: SVG, el-10: path */}
                                        <SdCloseIcon />
                                    </span>
                                </span>
                            </div>
                        </button>
                    </div>

                    {/* el-11: Main panel */}
                    <div className="sd-panel">
                        {/* el-12: Content grid */}
                        <div className="sd-content-grid">

                            {/* el-13: Header bg */}
                            <div className="sd-header-bg">
                                {/* el-14 */}
                                <div className="sd-header-bg-fill" />
                            </div>

                            {/* el-15: Header overlay zone */}
                            <div className="sd-header-overlay-zone">
                                {/* el-16: Header overlay */}
                                <div className="sd-header-overlay">
                                    {/* el-17 */}
                                    <div className="sd-header-overlay-inner">
                                        {/* el-18: Hidden back btn */}
                                        <div className="sd-hidden" />
                                        {/* el-19: Title area */}
                                        <div className="sd-overlay-title-area">
                                            {/* el-20 */}
                                            <span className="sd-overlay-title-text">Sale details</span>
                                        </div>
                                        {/* el-21: Right actions */}
                                        <div className="sd-overlay-right" />
                                        {/* el-22: Hidden close btn */}
                                        <div className="sd-hidden" />
                                    </div>
                                </div>
                            </div>

                            {/* el-23: Title section */}
                            <div className="sd-title-section">
                                {/* el-24: Hidden */}
                                <div className="sd-hidden" />
                                {/* el-25: Title padding */}
                                <div className="sd-title-pad">
                                    {/* el-26: Title grid */}
                                    <div className="sd-title-grid">

                                        {/* el-48: Badge area (grid-row:1, grid-col:1) */}
                                        <div className="sd-badge-area">
                                            {/* el-49: Completed badge — always visible */}
                                            <div className="sd-completed-badge">
                                                {/* el-50: Check icon wrap */}
                                                <span className="sd-badge-icon-wrap">
                                                    <SdCheckIcon />
                                                </span>
                                                {/* el-53: Badge text */}
                                                <span className="sd-badge-text">Completed</span>
                                            </div>
                                        </div>

                                        {/* el-27: Action area (grid-row:1, grid-col:2) */}
                                        <div className="sd-action-area">
                                            {/* el-28: Buttons row */}
                                            <div className="sd-buttons-row">
                                                {/* el-29: Primary action btn */}
                                                <button className="sd-rebook-btn">
                                                    {/* el-30 */}
                                                    <div className="sd-rebook-inner">
                                                        {/* el-31 */}
                                                        <span className="sd-rebook-label-wrap">
                                                            {/* el-32 */}
                                                            <span className="sd-rebook-text">Rebook</span>
                                                        </span>
                                                    </div>
                                                </button>
                                                {/* el-33: Options btn wrapper */}
                                                <div className="kbd-root">
                                                    <div className="sd-options-wrap">
                                                        <button className="sd-options-btn" onClick={() => setSdOptionsOpen(prev => !prev)}>
                                                            <div className="sd-options-inner">
                                                                <span className="sd-sr-only">
                                                                    <span>Open options</span>
                                                                </span>
                                                                <span className="sd-options-icon-outer">
                                                                    <span className="sd-options-icon-inner">
                                                                        <SdKebabIcon />
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        </button>
                                                    </div>
                                                    <SdOptionsDropdown
                                                        open={sdOptionsOpen}
                                                        onClose={() => setSdOptionsOpen(false)}
                                                        onAction={(id) => { console.log('SD action:', id); }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* el-42: Title text area (grid-row:3) */}
                                        <div className="sd-title-text-area">
                                            {/* el-43: Hidden */}
                                            <div className="sd-hidden" />
                                            {/* el-44: Title flex */}
                                            <div className="sd-title-flex">
                                                {/* el-45: Title col */}
                                                <div className="sd-title-col">
                                                    {/* el-46 */}
                                                    <p className="sd-sale-heading">Sale</p>
                                                    {/* el-47 */}
                                                    <p className="sd-sale-date">Thu 19 Feb 2026 • Hasan</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* el-54: Scroll trigger area */}
                                        <div className="sd-scroll-trigger" />
                                    </div>
                                </div>
                            </div>

                            {/* el-52: Body section */}
                            <div className="sd-body">
                                {activeTab === 'details' ? (
                                    /* ── Details Tab Body ── */
                                    <div className="sd-body-content">

                                        {/* ── Customer Card ── */}
                                        <div className="sd-customer-card">
                                            <a className="sd-customer-link" href="#" />
                                            <div className="sd-customer-bg" />
                                            <div className="sd-customer-border" />
                                            <div className="sd-customer-inner">
                                                <div className="sd-customer-info">
                                                    <p className="sd-customer-name">Jane Doe</p>
                                                    <p className="sd-customer-email">jane@example.com</p>
                                                </div>
                                                <div className="sd-avatar-circle">
                                                    <div className="sd-avatar-inner">
                                                        <span className="sd-avatar-letter">J</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── Sale Details Card ── */}
                                        <div className="sd-details-card">
                                            <div className="sd-details-bg">
                                                <div className="sd-details-inner">
                                                    <div className="sd-details-content">

                                                        <div className="sd-sale-header">
                                                            <p className="sd-sale-number">Sale #2</p>
                                                            <p className="sd-sale-card-date">Thu 19 Feb 2026</p>
                                                        </div>

                                                        <div className="sd-services-section">
                                                            <div className="sd-service-wrap">
                                                                <div className="sd-service-row">
                                                                    <div className="sd-service-info">
                                                                        <span className="sd-service-name-wrap">
                                                                            <p className="sd-service-name">Hair Color</p>
                                                                        </span>
                                                                        <span className="sd-service-detail">11:00, 19 Feb 2026 • 55min • Furkan Kem</span>
                                                                    </div>
                                                                    <div className="sd-service-price-col">
                                                                        <div className="sd-service-price-row">
                                                                            <div className="sd-service-price-align">
                                                                                <div className="sd-service-price-inner">
                                                                                    <span className="sd-service-price-span">
                                                                                        <bdi className="sd-service-price-bdi">TRY 57</bdi>
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="sd-service-wrap">
                                                                <div className="sd-service-row">
                                                                    <div className="sd-service-info">
                                                                        <span className="sd-service-name-wrap">
                                                                            <p className="sd-service-name">Pedicure</p>
                                                                        </span>
                                                                        <span className="sd-service-detail">11:55, 19 Feb 2026 • 30min • Furkan Kem</span>
                                                                    </div>
                                                                    <div className="sd-service-price-col">
                                                                        <div className="sd-service-price-row">
                                                                            <div className="sd-service-price-align">
                                                                                <div className="sd-service-price-inner">
                                                                                    <span className="sd-service-price-span">
                                                                                        <bdi className="sd-service-price-bdi">TRY 30</bdi>
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="sd-service-wrap">
                                                                <div className="sd-service-row">
                                                                    <div className="sd-service-info">
                                                                        <span className="sd-service-name-wrap">
                                                                            <p className="sd-service-name">Hair Color</p>
                                                                        </span>
                                                                        <span className="sd-service-detail">12:25, 19 Feb 2026 • 55min • Furkan Kem</span>
                                                                    </div>
                                                                    <div className="sd-service-price-col">
                                                                        <div className="sd-service-price-row">
                                                                            <div className="sd-service-price-align">
                                                                                <div className="sd-service-price-inner">
                                                                                    <span className="sd-service-price-span">
                                                                                        <bdi className="sd-service-price-bdi">TRY 57</bdi>
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="sd-service-wrap">
                                                                <div className="sd-service-row">
                                                                    <div className="sd-service-info">
                                                                        <span className="sd-service-name-wrap">
                                                                            <p className="sd-service-name-alt">
                                                                                <a className="sd-service-link" href="#">Test</a>
                                                                            </p>
                                                                        </span>
                                                                        <span className="sd-service-detail">Furkan Kem</span>
                                                                    </div>
                                                                    <div className="sd-service-price-col">
                                                                        <div className="sd-service-price-row">
                                                                            <div className="sd-service-price-align">
                                                                                <div className="sd-service-price-inner">
                                                                                    <span className="sd-service-price-span">
                                                                                        <bdi className="sd-service-price-bdi">TRY 100</bdi>
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <hr className="sd-divider" />

                                                        <div className="sd-totals-section">
                                                            <div className="sd-totals-col">
                                                                <div className="sd-total-row">
                                                                    <p className="sd-subtotal-label">Subtotal</p>
                                                                    <span className="sd-subtotal-value">
                                                                        <bdi className="sd-subtotal-bdi">TRY 244</bdi>
                                                                    </span>
                                                                </div>
                                                                <div className="sd-total-row">
                                                                    <p className="sd-total-label">Total</p>
                                                                    <span className="sd-total-value">
                                                                        <bdi className="sd-total-bdi">TRY 244</bdi>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <hr className="sd-divider" />

                                                        <div className="sd-payment-section">
                                                            <div className="sd-payment-wrap">
                                                                <div className="sd-payment-row">
                                                                    <div className="sd-payment-info">
                                                                        <span className="sd-payment-name-wrap">
                                                                            <div className="sd-paid-with-row">
                                                                                <p className="sd-paid-label">Paid with</p>
                                                                                <p className="sd-method-label">Other</p>
                                                                            </div>
                                                                        </span>
                                                                        <span className="sd-payment-date">Thu 19 Feb 2026 at 16:25</span>
                                                                    </div>
                                                                    <div className="sd-payment-amount-col">
                                                                        <span className="sd-payment-amount-span">
                                                                            <bdi className="sd-payment-amount-bdi">TRY 244</bdi>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <hr className="sd-divider" />

                                                        <div className="sd-notes-section">
                                                            <div className="sd-notes-inner">
                                                                <div className="sd-notes-col">
                                                                    <p className="sd-notes-title">Sale notes</p>
                                                                    <p className="sd-notes-text">sdgdsgsdgds</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="sd-details-border" />
                                        </div>

                                    </div>
                                ) : (
                                    /* ── Activity Tab Body ── */
                                    <div className="sd-activity-body">
                                        {/* el-54: Timeline ordered list */}
                                        <ol className="sd-timeline-list">
                                            {/* el-55: Month group */}
                                            <li className="sd-timeline-month-group">
                                                {/* el-56: Month label */}
                                                <span className="sd-timeline-month">February</span>

                                                {/* el-57: Inner events list */}
                                                <ol className="sd-timeline-events">

                                                    {/* ── Timeline Item 1: Payment ── */}
                                                    <li className="sd-timeline-item">
                                                        {/* el-59: Timeline indicator column */}
                                                        <div className="sd-timeline-indicator">
                                                            {/* el-60: Dot */}
                                                            <span className="sd-timeline-dot" />
                                                            {/* el-61: Line */}
                                                            <span className="sd-timeline-line" />
                                                        </div>

                                                        {/* el-62: Event content */}
                                                        <div className="sd-timeline-content">
                                                            {/* el-63→64: Card wrapper */}
                                                            <div className="sd-timeline-card">
                                                                <div className="sd-timeline-card-bg">
                                                                    {/* el-65: Border overlay */}
                                                                    <div className="sd-timeline-card-border" />
                                                                    {/* el-66: Card inner */}
                                                                    <div className="sd-timeline-card-inner">
                                                                        {/* el-67: Top section */}
                                                                        <div className="sd-timeline-card-top">
                                                                            {/* el-68: Row */}
                                                                            <div className="sd-timeline-card-row">
                                                                                {/* el-69: Info col */}
                                                                                <div className="sd-timeline-card-info">
                                                                                    <p className="sd-timeline-card-title">TRY 10 paid by cash</p>
                                                                                    <p className="sd-timeline-card-date">Yesterday at 16:28</p>
                                                                                </div>
                                                                                {/* el-72→81: Avatar */}
                                                                                <div className="sd-timeline-avatar-wrap">
                                                                                    <div className="sd-timeline-avatar">
                                                                                        <div className="sd-timeline-avatar-inner">
                                                                                            <span className="sd-timeline-avatar-icon">
                                                                                                <SdMoneyIcon />
                                                                                            </span>
                                                                                        </div>
                                                                                        {/* el-78→88: Green check badge */}
                                                                                        <div className="sd-timeline-badge-pos">
                                                                                            <div className="sd-timeline-badge-wrap">
                                                                                                <div className="sd-timeline-badge-outer">
                                                                                                    <div className="sd-timeline-badge">
                                                                                                        <span className="sd-timeline-badge-icon">
                                                                                                            <SdSmallCheckIcon />
                                                                                                        </span>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {/* el-89: Description */}
                                                                        <p className="sd-timeline-card-desc">Payment taken by Furkan Kem</p>
                                                                        {/* el-90→98: Actions button */}
                                                                        <div className="sd-timeline-actions-wrap">
                                                                            <button className="sd-timeline-actions-btn">
                                                                                <div className="sd-timeline-actions-inner">
                                                                                    <span className="sd-timeline-actions-label-wrap">
                                                                                        <span className="sd-timeline-actions-text">Actions</span>
                                                                                    </span>
                                                                                    <span className="sd-timeline-actions-icon-outer">
                                                                                        <span className="sd-timeline-actions-icon-inner">
                                                                                            <SdChevronDownIcon />
                                                                                        </span>
                                                                                    </span>
                                                                                </div>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    {/* ── Timeline Item 2: Sale Created ── */}
                                                    <li className="sd-timeline-item">
                                                        {/* el-100: Timeline indicator column */}
                                                        <div className="sd-timeline-indicator">
                                                            <span className="sd-timeline-dot" />
                                                            <span className="sd-timeline-line" />
                                                        </div>

                                                        {/* el-103: Event content */}
                                                        <div className="sd-timeline-content sd-timeline-content-last">
                                                            <div className="sd-timeline-card">
                                                                <div className="sd-timeline-card-bg">
                                                                    <div className="sd-timeline-card-border" />
                                                                    <div className="sd-timeline-card-inner">
                                                                        <div className="sd-timeline-card-top">
                                                                            <div className="sd-timeline-card-row">
                                                                                <div className="sd-timeline-card-info">
                                                                                    <p className="sd-timeline-card-title">Sale 3 created</p>
                                                                                    <p className="sd-timeline-card-date">Yesterday at 16:27</p>
                                                                                </div>
                                                                                {/* el-113→122: User avatar with image */}
                                                                                <div className="sd-timeline-user-avatar">
                                                                                    <div className="sd-timeline-user-avatar-inner">
                                                                                        <picture className="sd-timeline-user-picture">
                                                                                            <img className="sd-timeline-user-img" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVQAAAFUCAMAAABMTDSHAAAAwFBMVEVca8Baab9YZ75dbMCDj8+iqtuhqdtda8BebcG6weT///+7weW5v+S6wOS5wOT+/v/7/P77+/23vePw8vmvt+Cdptqep9qCjc/m6PV3g8pbar/n6fZ5hctaar/m6fV9ic1fbsFhb8L19vvL0Ou/xefAxeeLldKpsd5ZaL/5+v34+Pz4+fylrt3v8fmosN2UntaVn9ZbasB4hMvp6/Z5hstdbMGmrtzg4/Pd4PLf4vPKz+pzgMlmdMRue8dte8dreMamNVb8AAAAAW9yTlQBz6J3mgAAAjpJREFUeNrt3NlSU1EQQFEQVHCeFUTFGXHEefb//8rCN0yeEnadpFjrC07v6rzkVvXKCgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAn0eqpwurosYZaWz99JrB+dvRgI21sniucXxs92NCoF5KoF0UVVdSFJ6qoy0FUUZeDqKIuB1GLqJdEPf6oE5t6+crV+V0T9YjrN27emtvt0XONjTrx87+zdWp1btuj5xobdWJT7+7cG/2oZSdqQNSAqAFRA6IGRA2IGhA1IGpA1ICoAVEDogZEDYgaEDUgakDUgKgBUQOiBkQNiBoQNSBqQNSAqAFRA6IGRA2IGhA1IGpA1ICoAVEDogZEDYgaEDUwGfX+zsk+f3YMpmzqg92Hs9oYPc5imIz66PGTp7N6ZskPHe8Rhed7o+dZCKIGRA2IGhA1IGpA1ICoAVEDogZEDYgamHKW7sX+jF7uvxL10GTU12/evpvV1sHoeRbClD+p3+9tz0rTf3xOCYgaEDUgakDUgKgBUQOiBkQNiBoQNSBqQNSAqAFRA6IGRA2IGhA1IGpA1ICoAVEDogZEDYgaEDUgakDUgKgBUQOiBkQNiBoQNSBqQNSAqAFRA6IGRA2IGhA1IGpA1ICoAVEDogZEDYgaEDUgakDUgKiBjc3/o374KOqcPn3+8vWIb99/uC41r5+/fh/1Z3f0k5bfwYTRLwIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACm+Au0iwKUZoixvwAAAABJRU5ErkJggg==" alt="" />
                                                                                        </picture>
                                                                                    </div>
                                                                                    {/* el-117→122: Green check badge */}
                                                                                    <div className="sd-timeline-badge-pos-user">
                                                                                        <div className="sd-timeline-badge-wrap">
                                                                                            <div className="sd-timeline-badge-outer">
                                                                                                <div className="sd-timeline-badge">
                                                                                                    <span className="sd-timeline-badge-icon">
                                                                                                        <SdSmallCheckIcon />
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {/* el-123: Description */}
                                                                        <p className="sd-timeline-card-desc">Completed by Furkan Kem</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>

                                                </ol>
                                            </li>
                                        </ol>
                                        {/* el-124: Footer text */}
                                        <p className="sd-timeline-footer">Activity for this sale in the last 90 days</p>
                                    </div>
                                )}
                            </div>

                            {/* el-156: Left sidebar */}
                            <div className="sd-sidebar">
                                {/* el-157: Mobile nav (hidden) */}
                                <div className="sd-hidden" />
                                {/* el-158: Spacer */}
                                <div style={{ width: '131px' }} />
                                {/* el-159: Nav list */}
                                <ul className="sd-nav-list">

                                    {/* Details tab */}
                                    <li className="sd-nav-item">
                                        <button className="sd-nav-btn" onClick={() => setActiveTab('details')}>
                                            <div className={`sd-nav-indicator${activeTab === 'details' ? ' sd-active' : ''}`} />
                                            <div className="sd-nav-content">
                                                <div className="sd-nav-icon-area">
                                                    <div className="sd-nav-badge-dot" />
                                                    <span className={`sd-nav-icon-wrap${activeTab === 'details' ? ' sd-icon-active' : ' sd-icon-inactive'}`}>
                                                        <SdDetailsIcon />
                                                    </span>
                                                </div>
                                                <p className={`sd-nav-label${activeTab === 'details' ? ' sd-active' : ' sd-inactive'}`}>Details</p>
                                            </div>
                                        </button>
                                    </li>

                                    {/* Activity tab */}
                                    <li className="sd-nav-item">
                                        <button className="sd-nav-btn" onClick={() => setActiveTab('activity')}>
                                            <div className={`sd-nav-indicator${activeTab === 'activity' ? ' sd-active' : ''}`} />
                                            <div className="sd-nav-content">
                                                <div className="sd-nav-icon-area">
                                                    <div className="sd-nav-badge-dot" />
                                                    <span className={`sd-nav-icon-wrap${activeTab === 'activity' ? ' sd-icon-active' : ' sd-icon-inactive'}`}>
                                                        <SdActivityIcon />
                                                    </span>
                                                </div>
                                                <p className={`sd-nav-label${activeTab === 'activity' ? ' sd-active' : ' sd-inactive'}`}>Activity</p>
                                            </div>
                                        </button>
                                    </li>

                                </ul>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

/* ─── Main Page Component ─── */
const TestPage2 = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [modalItem, setModalItem] = useState(null);
    const [saleDetailsOpen, setSaleDetailsOpen] = useState(false);

    // Dummy item for testing the modal standalone
    const dummyItem = {
        cartId: 999,
        name: 'Test Hizmet',
        price: 'TRY 250',
        duration: '30min',
        color: '#6950f3',
    };

    return (
        <div className="test-page-2">
            <div className="test-page-2-content">
                <h1 className="test-page-2-title">Quick Sale Test</h1>
                <p className="test-page-2-subtitle">Fresha Quick Sale drawer replication</p>

                <button
                    className="qs-open-btn"
                    onClick={() => setDrawerOpen(true)}
                >
                    <PlusIcon />
                    <span>Quick Sale</span>
                </button>

                <button
                    className="qs-open-btn"
                    style={{ marginLeft: '16px' }}
                    onClick={() => setModalItem(dummyItem)}
                >
                    <EditIcon />
                    <span>Edit Cart Item</span>
                </button>

                <button
                    className="qs-open-btn"
                    style={{ marginLeft: '16px' }}
                    onClick={() => setSaleDetailsOpen(true)}
                >
                    <span>Sale Details</span>
                </button>
            </div>

            <QuickSaleDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />

            <SaleDetailsDrawer
                isOpen={saleDetailsOpen}
                onClose={() => setSaleDetailsOpen(false)}
            />



            {/* Standalone Edit Cart Item Modal */}
            {modalItem && (
                <EditCartItemModal
                    item={modalItem}
                    onClose={() => setModalItem(null)}
                    onApply={(updatedItem) => {
                        console.log('Modal applied:', updatedItem);
                        setModalItem(null);
                    }}
                    onRemove={(cartId) => {
                        console.log('Modal removed:', cartId);
                        setModalItem(null);
                    }}
                />
            )}
        </div>
    );
};

export default TestPage2;
