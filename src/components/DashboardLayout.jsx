import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';

/* ─── Fresha exact SVG icons (fill-based, viewBox 0 0 32 32) ─── */
const icons = {
    home: (
        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fillRule="evenodd" d="M14.652 3.873a2 2 0 0 1 2.697 0l10.013 9.1A2.04 2.04 0 0 1 28 14.42V26a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V14.421a2.04 2.04 0 0 1 .638-1.448zM6.003 14.44 16 5.333l9.997 9.106L26 26H6z" clipRule="evenodd" /></svg>
    ),
    calendar: (
        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fillRule="evenodd" d="M10 2a1 1 0 0 1 1 1v1h10V3a1 1 0 1 1 2 0v1h3a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V3a1 1 0 0 1 1-1M9 6H6v4h20V6h-3v1a1 1 0 1 1-2 0V6H11v1a1 1 0 1 1-2 0zm17 6H6v14h20z" clipRule="evenodd" /></svg>
    ),
    onlineBooking: (
        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fillRule="evenodd" d="M2.667 6a2 2 0 0 1 2-2h22.666a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H4.667a2 2 0 0 1-2-2zm24.666 0H4.667v20h22.666zM16 12a3 3 0 1 0 0 6 3 3 0 0 0 0-6m3.43 6.638a5 5 0 1 0-6.86 0 8 8 0 0 0-.893.423c-1.253.696-2.22 1.719-2.627 2.961a1 1 0 1 0 1.9.622c.213-.65.77-1.32 1.698-1.834.925-.514 2.107-.81 3.352-.81s2.427.296 3.352.81c.928.515 1.485 1.183 1.698 1.834a1 1 0 0 0 1.9-.622c-.406-1.242-1.374-2.265-2.627-2.96a8 8 0 0 0-.893-.424" clipRule="evenodd" /></svg>
    ),
    sales: (
        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fillRule="evenodd" d="M15.145 2.256a2 2 0 0 1 1.8.55l13.046 13.046a1.99 1.99 0 0 1 0 2.834L18.686 29.99a1.99 1.99 0 0 1-2.834 0L2.806 16.945a2 2 0 0 1-.55-1.8v-.003L4.27 5.054a1 1 0 0 1 .785-.785l10.088-2.012zm.385 1.963L6.1 6.1 4.22 15.53l13.05 13.05 11.31-11.311z" clipRule="evenodd" /><path d="M10.5 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" /></svg>
    ),
    catalog: (
        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fillRule="evenodd" d="M2.586 6.586A2 2 0 0 1 4 6h8a5 5 0 0 1 4 2q.212-.282.465-.536A5 5 0 0 1 20 6h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-8a3 3 0 0 0-3 3 1 1 0 1 1-2 0 3 3 0 0 0-3-3H4a2 2 0 0 1-2-2V8a2 2 0 0 1 .586-1.414M15 25a5 5 0 0 0-3-1H4V8h8a3 3 0 0 1 3 3zm2 0a5 5 0 0 1 3-1h8V8h-8a3 3 0 0 0-3 3z" clipRule="evenodd" /></svg>
    ),
    addons: (
        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fillRule="evenodd" d="M5 7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zm8 0H7v6h6zm4 0a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2zm8 0h-6v6h6zM5 19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zm8 0H7v6h6zm9-2a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3h-3a1 1 0 1 1 0-2h3v-3a1 1 0 0 1 1-1" clipRule="evenodd" /></svg>
    ),
    clients: (
        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M11.5 15a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M20.5 15a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" /><path fillRule="evenodd" d="M16 5C9.925 5 5 9.925 5 16s4.925 11 11 11 11-4.925 11-11S22.075 5 16 5M3 16C3 8.82 8.82 3 16 3s13 5.82 13 13-5.82 13-13 13S3 23.18 3 16m7.298 2.135a1 1 0 0 1 1.367.363 5.01 5.01 0 0 0 8.67 0 1 1 0 0 1 1.73 1.004 7.013 7.013 0 0 1-12.13 0 1 1 0 0 1 .363-1.367" clipRule="evenodd" /></svg>
    ),
    reports: (
        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fillRule="evenodd" d="M4 5a1 1 0 0 1 1 1v13.586l6.293-6.293a1 1 0 0 1 1.414 0L16 16.586 23.586 9H21a1 1 0 1 1 0-2h5a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-2.586l-8.293 8.293a1 1 0 0 1-1.414 0L12 15.414l-7 7V25h23a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1" clipRule="evenodd" /></svg>
    ),
    finance: (
        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fillRule="evenodd" d="M18.5 5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v20h1a1 1 0 1 1 0 2h-25a1 1 0 1 1 0-2h1v-8a1 1 0 0 1 1-1h6v-5a1 1 0 0 1 1-1h6zm0 7h-5v13h5zm2 13h5V6h-5zm-9 0v-7h-5v7z" clipRule="evenodd" /></svg>
    ),
    settings: (
        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 10a6 6 0 1 0 6 6 6.006 6.006 0 0 0-6-6m0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8m13.743-6.599a1 1 0 0 0-.487-.675l-3.729-2.125-.015-4.202a1 1 0 0 0-.353-.76 14 14 0 0 0-4.59-2.584 1 1 0 0 0-.808.074L16 5.23l-3.765-2.106a1 1 0 0 0-.809-.075 14 14 0 0 0-4.585 2.594 1 1 0 0 0-.353.759l-.02 4.206-3.728 2.125a1 1 0 0 0-.486.675 13.3 13.3 0 0 0 0 5.195 1 1 0 0 0 .486.675l3.729 2.125.015 4.202a1 1 0 0 0 .354.76 14 14 0 0 0 4.59 2.584 1 1 0 0 0 .807-.074L16 26.77l3.765 2.106a1.009 1.009 0 0 0 .809.073 14 14 0 0 0 4.585-2.592 1 1 0 0 0 .354-.759l.018-4.206 3.729-2.125a1 1 0 0 0 .486-.675 13.3 13.3 0 0 0-.003-5.19M27.868 18.765l-3.572 2.031a1 1 0 0 0-.375.375c-.072.125-.148.258-.226.383a1 1 0 0 0-.152.526l-.02 4.031c-.96.754-2.029 1.357-3.17 1.788L16.75 24.89a1 1 0 0 0-.489-.125h-.478a1 1 0 0 0-.513.125l-3.605 2.013a12 12 0 0 1-3.18-1.779L8.471 21.1a1 1 0 0 0-.152-.527 7 7 0 0 1-.225-.383 1 1 0 0 0-.375-.383l-3.575-2.036a11.3 11.3 0 0 1 0-3.532l3.565-2.035a1 1 0 0 0 .375-.375c.072-.125.149-.258.226-.383.1-.157.152-.34.153-.526l.018-4.031c.96-.754 2.03-1.357 3.172-1.788L15.25 7.11a1 1 0 0 0 .512.125h.456a1 1 0 0 0 .512-.125l3.605-2.013a12 12 0 0 1 3.18 1.779l.014 4.025a1 1 0 0 0 .152.527c.078.126.154.25.225.383.089.159.218.291.375.383l3.575 2.036c.188 1.17.19 2.364.006 3.536z" /></svg>
    ),
    team: (
        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M30.6 18.8a1 1 0 0 1-1.4-.2A6.45 6.45 0 0 0 24 16a1 1 0 0 1 0-2 3 3 0 1 0-2.905-3.75 1 1 0 0 1-1.937-.5 5 5 0 1 1 8.217 4.939 8.5 8.5 0 0 1 3.429 2.71A1 1 0 0 1 30.6 18.8m-6.735 7.7a1 1 0 1 1-1.73 1 7.125 7.125 0 0 0-12.27 0 1 1 0 1 1-1.73-1 9 9 0 0 1 4.217-3.74 6 6 0 1 1 7.296 0 9 9 0 0 1 4.217 3.74M16 22a4 4 0 1 0 0-8 4 4 0 0 0 0 8m-7-7a1 1 0 0 0-1-1 3 3 0 1 1 2.905-3.75 1 1 0 0 0 1.938-.5 5 5 0 1 0-8.218 4.939 8.5 8.5 0 0 0-3.425 2.71A1 1 0 1 0 2.8 18.6 6.45 6.45 0 0 1 8 16a1 1 0 0 0 1-1" /></svg>
    ),
    help: (
        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 24a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" /><path fillRule="evenodd" d="M16 5C9.925 5 5 9.925 5 16s4.925 11 11 11 11-4.925 11-11S22.075 5 16 5M3 16C3 8.82 8.82 3 16 3s13 5.82 13 13-5.82 13-13 13S3 23.18 3 16m11.278-6.657A4.5 4.5 0 1 1 17 17.888V18a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1 2.5 2.5 0 1 0-2.5-2.5 1 1 0 1 1-2 0 4.5 4.5 0 0 1 2.778-4.157" clipRule="evenodd" /></svg>
    ),
    /* ─── Header icons (from Fresha DOM) ─── */
    notification: (
        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fillRule="evenodd" d="M16.056 5a7.99 7.99 0 0 0-7.422 4.928c-.408.985-.62 1.913-.609 3.063V14c0 4.616-.968 7.395-1.896 9h19.743c-.93-1.605-1.897-4.384-1.897-9v-.887c0-4.431-3.537-8.08-7.919-8.113m-3.83-1.254A10 10 0 0 1 16.068 3h.002c5.517.042 9.905 4.619 9.905 10.113V14c0 4.333.907 6.753 1.628 7.999V22a2 2 0 0 1-1.724 3H21a5 5 0 1 1-10 0H6.122a2 2 0 0 1-1.725-3v-.001c.721-1.246 1.628-3.666 1.628-7.999v-.996c-.012-1.444.262-2.637.762-3.842a10 10 0 0 1 5.439-5.416M13 25a3 3 0 1 0 6 0z" clipRule="evenodd" /></svg>
    ),
};

/* ─── Chevron SVG for collapse button (el-13/14) ─── */
const CollapseChevron = () => (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <path d="M19.957 9.043a1 1 0 0 1 0 1.414L14.414 16l5.543 5.543a1 1 0 0 1-1.414 1.414l-6.25-6.25a1 1 0 0 1 0-1.414l6.25-6.25a1 1 0 0 1 1.414 0" fillRule="evenodd" clipRule="evenodd" />
    </svg>
);

/* ─── Submenu configurations ─── */
const submenus = {
    sales: {
        header: 'Sales',
        items: [
            { path: '/new-sales/daily', label: 'Daily sales summary' },
            { path: '/new-appointments', label: 'Appointments' },
            { path: '/new-sales', label: 'Sales' },
            { path: '/new-payments', label: 'Payments' },
            { path: '/new-sales/gift-cards', label: 'Gift cards sold' },
            { path: '/new-sales/memberships', label: 'Memberships sold' },
        ],
    },
};

export default function DashboardLayout() {
    const { user, tenantUser, signOut } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null); // 'sales' | null
    const userCollapsedRef = useRef(false); // tracks manual collapse to prevent useEffect re-open

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const closeSidebar = () => setSidebarOpen(false);

    const menuItems = [
        { path: '/dashboard', icon: icons.home, label: 'Ana Sayfa' },
        { type: 'divider' },
        { path: '/appointment-calendar', icon: icons.calendar, label: 'Takvim' },
        { path: '/appointments', icon: icons.onlineBooking, label: 'Randevular' },
        { path: '/sales', icon: icons.sales, label: 'Satışlar', submenuKey: 'sales' },
        { path: '/product-sales', icon: icons.catalog, label: 'Ürün Satışları' },
        { path: '/package-sales', icon: icons.addons, label: 'Paketler' },
        { path: '/customers', icon: icons.clients, label: 'Müşteriler' },
        { path: '/reports', icon: icons.reports, label: 'Raporlar' },
        { path: '/finance', icon: icons.finance, label: 'Finans' },
        { path: '/settings', icon: icons.settings, label: 'Ayarlar' },
    ];

    const allItems = tenantUser?.role === 'super_admin'
        ? [...menuItems, { path: '/admin', icon: icons.team, label: 'Yönetim', badge: true }]
        : menuItems;

    const userInitial = tenantUser?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || '?';

    const location = useLocation();
    const isFullPage = location.pathname === '/appointment-calendar' || location.pathname === '/test4';

    /* Auto-open submenu based on current route (but respect manual collapse) */
    useEffect(() => {
        const salesRoutes = ['/new-sales', '/new-payments', '/new-appointments']; // Covers /new-sales, /new-sales/daily, /new-sales/gift-cards, /new-sales/memberships
        if (salesRoutes.some(r => location.pathname.startsWith(r))) {
            if (!userCollapsedRef.current) {
                setActiveSubmenu('sales');
            }
        } else {
            userCollapsedRef.current = false; // reset on route change
        }
    }, [location.pathname]);

    const handleSidebarClick = (item, e) => {
        if (item.submenuKey) {
            e.preventDefault();
            if (activeSubmenu === item.submenuKey) {
                setActiveSubmenu(null);
                userCollapsedRef.current = true;
            } else {
                setActiveSubmenu(item.submenuKey);
                userCollapsedRef.current = false;
            }
        } else {
            setActiveSubmenu(null);
            userCollapsedRef.current = false;
        }
        closeSidebar();
    };

    const submenuData = activeSubmenu ? submenus[activeSubmenu] : null;
    const isSubmenuOpen = !!submenuData;

    /* Route belongs to a submenu — panel stays in DOM for the button to peek */
    const salesRoutes = ['/new-sales', '/new-payments', '/new-appointments'];
    const hasSubmenuForRoute = salesRoutes.some(r => location.pathname.startsWith(r));
    const showSubmenuPanel = isSubmenuOpen || hasSubmenuForRoute;

    return (
        <div className="layout">
            {/* ─── Header (Fresha: nvh__wrapper) ─── */}
            <header className="topbar">
                {/* Mobile menu button */}
                <button className="topbar-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <span /><span /><span />
                </button>

                {/* Logo — left side */}
                <div className="topbar-logo">
                    <span className="topbar-logo-icon">✂️</span>
                    <span className="topbar-logo-text">SalonAppy</span>
                </div>

                {/* Right side — Notification + Profile (Fresha style) */}
                <div className="topbar-right">
                    <button className="topbar-icon-btn" aria-label="Bildirimler" title="Bildirimler">
                        <span className="topbar-icon">{icons.notification}</span>
                    </button>
                    <div className="topbar-user" onClick={handleSignOut} title="Çıkış Yap">
                        <div className="topbar-user-avatar" aria-label="Kullanıcı menüsü">
                            {userInitial}
                        </div>
                    </div>
                </div>
            </header>

            {/* ─── Body ─── */}
            <div className="layout-body">
                {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

                {/* ── LEFT COLUMN: Icon Sidebar + Submenu Panel ── */}
                {/* Sidebar — Navigation Rail (Fresha: nvr__wrapper) */}
                <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
                    <div className="sidebar-scroll">
                        <div className="sidebar-content">
                            <nav className="sidebar-nav">
                                {allItems.map((item, idx) => {
                                    if (item.type === 'divider') {
                                        return (
                                            <div className="sidebar-divider" key={`divider-${idx}`}>
                                                <div className="sidebar-divider-line" />
                                            </div>
                                        );
                                    }
                                    return (
                                        <div className="sidebar-link-outer" key={item.path}>
                                            <div className="sidebar-link-inner">
                                                <NavLink
                                                    to={item.submenuKey ? '#' : item.path}
                                                    end={item.path === '/dashboard'}
                                                    className={({ isActive }) => {
                                                        const hasActiveSubmenu = item.submenuKey && activeSubmenu === item.submenuKey;
                                                        return `sidebar-link ${isActive || hasActiveSubmenu ? 'sidebar-link--active' : ''}`;
                                                    }}
                                                    onClick={(e) => handleSidebarClick(item, e)}
                                                    data-tooltip={item.label}
                                                >
                                                    <div className="sidebar-link-icon-wrap">
                                                        <span className="sidebar-link-icon" aria-hidden="true">{item.icon}</span>
                                                        {item.badge && <div className="sidebar-badge" />}
                                                    </div>
                                                    <span className="sidebar-link-label">{item.label}</span>
                                                </NavLink>
                                            </div>
                                        </div>
                                    );
                                })}
                            </nav>

                            {/* Footer — Help (Fresha: nvr__footer) */}
                            <div className="sidebar-bottom">
                                <button className="sidebar-help" data-tooltip="Yardım" type="button">
                                    <div className="sidebar-link-icon-wrap">
                                        <span className="sidebar-link-icon" aria-hidden="true">{icons.help}</span>
                                    </div>
                                    <span className="sidebar-link-label">Yardım</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                {showSubmenuPanel && (
                    <div className="submenu-animation-wrapper">
                        {/* el-100: inner wrapper */}
                        <div className="submenu-wrapper">
                            {/* el-101: button wrapper — sibling of container, peeks at sidebar edge */}
                            <div className={`submenu-btn-wrapper ${isSubmenuOpen ? 'submenu-btn-wrapper--open' : ''}`}>
                                {/* el-102: toggle button */}
                                <button
                                    className="submenu-collapse-btn"
                                    onClick={() => {
                                        if (isSubmenuOpen) {
                                            setActiveSubmenu(null);
                                            userCollapsedRef.current = true;
                                        } else {
                                            setActiveSubmenu('sales');
                                            userCollapsedRef.current = false;
                                        }
                                    }}
                                    type="button"
                                >
                                    {/* el-103: button inner (visible circle) */}
                                    <div className="submenu-collapse-inner">
                                        <span className="submenu-sr-only">
                                            {isSubmenuOpen ? 'Collapse' : 'Expand'} Navigation Menu
                                        </span>
                                        <span className={`submenu-collapse-icon ${!isSubmenuOpen ? 'submenu-collapse-icon--expand' : ''}`}>
                                            <CollapseChevron />
                                        </span>
                                    </div>
                                </button>
                            </div>

                            {/* el-114: container with border-right — width collapses on close */}
                            <div className={`submenu-container ${isSubmenuOpen ? 'submenu-container--open' : ''}`} inert={isSubmenuOpen ? undefined : ""}>
                                {/* el-115: menu wrapper */}
                                <div className={`submenu-menu ${isSubmenuOpen ? 'submenu-menu--open' : ''}`}>
                                    {/* el-116: menu list */}
                                    <div className="submenu-menu-list">
                                        <p className="submenu-header">{submenus.sales.header}</p>
                                        {submenus.sales.items.map((subItem, idx) => (
                                            <div className="submenu-item" key={idx}>
                                                <NavLink
                                                    to={subItem.path}
                                                    className={({ isActive }) =>
                                                        `submenu-link ${isActive ? 'submenu-link--selected' : ''}`
                                                    }
                                                    end
                                                >
                                                    <p className="submenu-link-text">{subItem.label}</p>
                                                </NavLink>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── RIGHT COLUMN: Content Wrapper ── */}
                <div className="content-wrapper">
                    {/* Placeholder div — expands when submenu is open to push content */}
                    <div className={`submenu-placeholder ${isSubmenuOpen ? 'submenu-placeholder--open' : showSubmenuPanel ? 'submenu-placeholder--collapsed' : ''}`} />

                    {/* Page content */}
                    <main className={`main-content ${isFullPage ? 'main-content--full' : ''}`}>
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
