import React, { useState } from 'react';
import './NewSales.css';

/* ─── SVG Icon Components ─── */
const ChevronDownIcon = () => (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M9.043 12.293a1 1 0 0 1 1.414 0L16 17.836l5.543-5.543a1 1 0 0 1 1.414 1.414l-6.25 6.25a1 1 0 0 1-1.414 0l-6.25-6.25a1 1 0 0 1 0-1.414" />
    </svg>
);

const PlusIcon = () => (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M16 5a1 1 0 0 1 1 1v9h9a1 1 0 1 1 0 2h-9v9a1 1 0 1 1-2 0v-9H6a1 1 0 1 1 0-2h9V6a1 1 0 0 1 1-1" />
    </svg>
);

const SearchIcon = () => (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M14.5 5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19M3 14.5C3 8.149 8.149 3 14.5 3S26 8.149 26 14.5c0 2.816-1.012 5.395-2.692 7.394l5.4 5.399a1 1 0 0 1-1.415 1.414l-5.399-5.399c-2 1.68-4.578 2.692-7.394 2.692C8.149 26 3 20.851 3 14.5" />
    </svg>
);

const CalendarIcon = () => (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M10 2a1 1 0 0 1 1 1v1h10V3a1 1 0 1 1 2 0v1h3a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V3a1 1 0 0 1 1-1M9 6H6v4h20V6h-3v1a1 1 0 1 1-2 0V6H11v1a1 1 0 1 1-2 0zm17 6H6v14h20z" />
    </svg>
);

const FilterIcon = () => (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M7 4a1 1 0 0 1 1 1v11h2a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2h2V5a1 1 0 0 1 1-1m9 0a1 1 0 0 1 1 1v5h2a1 1 0 1 1 0 2h-6a1 1 0 1 1 0-2h2V5a1 1 0 0 1 1-1m9 0a1 1 0 0 1 1 1v15h2a1 1 0 1 1 0 2h-6a1 1 0 1 1 0-2h2V5a1 1 0 0 1 1-1m-9 10a1 1 0 0 1 1 1v12a1 1 0 1 1-2 0V15a1 1 0 0 1 1-1m-9 6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1m18 4a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1" />
    </svg>
);

const SortByIcon = () => (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M5 8a1 1 0 0 1 1-1h17a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1m18 5a1 1 0 0 1 1 1v9.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-5 5a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 1.414-1.414L22 23.586V14a1 1 0 0 1 1-1M5 16a1 1 0 0 1 1-1h9a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1m0 8a1 1 0 0 1 1-1h7a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1" />
    </svg>
);

const SortIndicatorIcon = () => (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.293 6.626a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1-1.414 1.415L16 8.747l-4.293 4.293a1 1 0 0 1-1.414-1.415zm-5 12.334a1 1 0 0 1 1.414 0L16 23.253l4.293-4.293a1 1 0 1 1 1.414 1.414l-5 5a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 0-1.414" />
    </svg>
);

/* ─── Sample Data ─── */
const SALES_DATA = [
    {
        id: 6,
        client: 'Walk-In',
        status: 'Completed',
        saleDate: '22 Feb 2026, 17:04',
        tips: 'TRY 0.00',
        grossTotal: 'TRY 600.00',
    },
    {
        id: 5,
        client: 'Walk-In',
        status: 'Part Paid',
        saleDate: '22 Feb 2026, 00:39',
        tips: 'TRY 0.00',
        grossTotal: 'TRY 40.00',
    },
];

const TABLE_COLUMNS = [
    { key: 'saleNum', label: 'Sale #', sortable: true, align: 'left' },
    { key: 'client', label: 'Client', sortable: true, align: 'left' },
    { key: 'status', label: 'Status', sortable: false, align: 'left' },
    { key: 'saleDate', label: 'Sale date', sortable: true, align: 'left' },
    { key: 'tips', label: 'Tips', sortable: true, align: 'right' },
    { key: 'grossTotal', label: 'Gross total', sortable: true, align: 'right' },
];

/* ─── Sub-components ─── */

const StatusBadge = ({ status }) => {
    const statusClass =
        status === 'Completed'
            ? 'ns-badge--completed'
            : status === 'Part Paid'
                ? 'ns-badge--part-paid'
                : status === 'Unpaid'
                    ? 'ns-badge--unpaid'
                    : status === 'Voided'
                        ? 'ns-badge--voided'
                        : status === 'Refunded'
                            ? 'ns-badge--refunded'
                            : '';

    return (
        <div className={`ns-badge ${statusClass}`}>
            <span className="ns-badge__text">{status}</span>
        </div>
    );
};

const SaleRow = ({ sale }) => (
    <tr className="ns-row--highlightable">
        {/* Sale # */}
        <td>
            <a href="#" className="ns-sale-link" onClick={(e) => e.preventDefault()}>
                <span>{sale.id}</span>
            </a>
        </td>

        {/* Client */}
        <td>
            <div className="ns-cell-content">{sale.client}</div>
        </td>

        {/* Status */}
        <td className="ns-td--scrollable">
            <StatusBadge status={sale.status} />
        </td>

        {/* Sale date */}
        <td>
            <div className="ns-cell-content">{sale.saleDate}</div>
        </td>

        {/* Tips */}
        <td className="ns-td--right">
            <div className="ns-cell-content ns-cell-content--right">{sale.tips}</div>
        </td>

        {/* Gross total */}
        <td className="ns-td--right">
            <div className="ns-cell-content ns-cell-content--right">{sale.grossTotal}</div>
        </td>
    </tr>
);

const HeaderCell = ({ col }) => (
    <th style={{ textAlign: col.align }}>
        <div className={`ns-sort-area ${col.sortable ? 'ns-sort-area--sortable' : ''}`}>
            <div className={`ns-sort-row ${col.align === 'right' ? 'ns-sort-row--right' : ''}`}>
                <div className={`ns-sort-label ${col.align === 'right' ? 'ns-sort-label--right' : ''}`}>
                    {col.label}
                </div>
                {col.sortable && (
                    <div className="ns-sort-indicator">
                        <span className="ns-icon--sort">
                            <SortIndicatorIcon />
                        </span>
                    </div>
                )}
            </div>
        </div>
    </th>
);

/* ─── MAIN COMPONENT ─── */
const NewSales = () => {
    const [activeTab, setActiveTab] = useState('sales');
    const [searchValue, setSearchValue] = useState('');

    return (
        <div className="ns-root">
            {/* el-1 */}
            <div className="ns-root__inner">
                {/* el-2 */}
                <div className="ns-root__padded">
                    {/* el-3 */}
                    <div className="ns-root__constrained">
                        {/* el-4 */}
                        <div className="ns-root__main">

                            {/* ======== PAGE HEADER (el-5..25) ======== */}
                            <div className="ns-header">
                                {/* el-6: Title content column */}
                                <div className="ns-header__top">
                                    {/* el-7: Title row */}
                                    <div className="ns-header__title-group">
                                        {/* el-8 */}
                                        <h1 className="ns-header__title">Sales</h1>
                                    </div>
                                    {/* el-9: Description */}
                                    <p className="ns-header__desc">
                                        View, filter and export the history of your sales.{' '}
                                        {/* el-10: Learn more link */}
                                        <a href="https://www.fresha.com/help-center/knowledge-base/sales" target="_blank" rel="noopener noreferrer" className="ns-header__learn-more">Learn more</a>
                                    </p>
                                </div>

                                {/* el-11: Action buttons */}
                                <div className="ns-header__actions">
                                    {/* el-12: Options button wrapper */}
                                    <div className="ns-btn-wrap">
                                        <div style={{ display: 'flex' }}>
                                            <button type="button" className="ns-btn--options">
                                                <div className="ns-btn__inner">
                                                    {/* el-16: Content span */}
                                                    <span className="ns-btn__content">
                                                        {/* el-17: Label */}
                                                        <span className="ns-btn__label">Options</span>
                                                    </span>
                                                    {/* el-18: Dropdown icon */}
                                                    <span className="ns-btn__icon-wrap">
                                                        <span className="ns-icon" aria-hidden="true">
                                                            <ChevronDownIcon />
                                                        </span>
                                                    </span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* el-22: Add New button */}
                                    <button type="button" className="ns-btn--add-new">
                                        <div className="ns-btn__inner">
                                            {/* el-24: Content span */}
                                            <span className="ns-btn__content">
                                                {/* el-25: Label */}
                                                <span className="ns-btn__label">Add new</span>
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* ======== TAB BAR (el-26..38) ======== */}
                            <div className="ns-tabbar">
                                {/* el-27: Inner */}
                                <div className="ns-tabbar__inner">
                                    {/* el-28: Left gradient */}
                                    <div className="ns-tabbar__gradient--left" aria-hidden="true" />

                                    {/* el-29: Scrollable container */}
                                    <div className="ns-tabbar__scroll">
                                        {/* el-30: Left spacer */}
                                        <div className="ns-tabbar__spacer--left" />

                                        {/* el-31: Active pill indicator */}
                                        <div
                                            className="ns-tabbar__indicator"
                                            aria-hidden="true"
                                            style={{
                                                transform: activeTab === 'sales' ? 'translateX(0px)' : 'translateX(75px)',
                                                width: activeTab === 'sales' ? '71px' : '75px',
                                            }}
                                        />

                                        {/* el-32: Tab list */}
                                        <ul className="ns-tab-list" role="tablist">
                                            {/* el-33: Sales tab */}
                                            <li
                                                className={`ns-tab-item ${activeTab === 'sales' ? 'ns-tab-item--active' : 'ns-tab-item--inactive'}`}
                                                role="tab"
                                                aria-selected={activeTab === 'sales'}
                                                tabIndex={activeTab === 'sales' ? 0 : -1}
                                                title="Sales"
                                                onClick={() => setActiveTab('sales')}
                                            >
                                                {/* el-34 */}
                                                <span className="ns-tab-item__text">Sales</span>
                                            </li>

                                            {/* el-35: Drafts tab */}
                                            <li
                                                className={`ns-tab-item ${activeTab === 'drafts' ? 'ns-tab-item--active' : 'ns-tab-item--inactive'}`}
                                                role="tab"
                                                aria-selected={activeTab === 'drafts'}
                                                tabIndex={activeTab === 'drafts' ? 0 : -1}
                                                title="Drafts"
                                                onClick={() => setActiveTab('drafts')}
                                            >
                                                {/* el-36 */}
                                                <span className="ns-tab-item__text">Drafts</span>
                                            </li>
                                        </ul>

                                        {/* el-37: Right spacer */}
                                        <div className="ns-tabbar__spacer--right" />
                                    </div>

                                    {/* el-38: Right gradient */}
                                    <div className="ns-tabbar__gradient--right" aria-hidden="true" />
                                </div>
                            </div>


                            {/* ======== FILTER TOOLBAR (el-39..82) ======== */}
                            <div className="ns-filter">
                                {/* el-40: Filter inner (grey bg) */}
                                <div className="ns-filter__inner">
                                    {/* el-41: Grid toolbar */}
                                    <div className="ns-toolbar">
                                        {/* el-42: Left column */}
                                        <div className="ns-toolbar__left">
                                            {/* el-43: Inner flex row */}
                                            <div className="ns-toolbar__left-inner">
                                                {/* el-44..53: Search */}
                                                <div className="ns-search">
                                                    <div className="ns-search__wrap">
                                                        {/* el-49: Icon container */}
                                                        <div className="ns-search__icon-container">
                                                            <span className="ns-search__icon" aria-hidden="true">
                                                                <SearchIcon />
                                                            </span>
                                                        </div>
                                                        {/* el-53: Input */}
                                                        <input
                                                            type="text"
                                                            className="ns-search__input"
                                                            placeholder="Search by Sale or Client"
                                                            name="search"
                                                            value={searchValue}
                                                            onChange={(e) => setSearchValue(e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                {/* el-54..62: Today button */}
                                                <button type="button" className="ns-toolbar-btn--today">
                                                    <div className="ns-toolbar-btn">
                                                        <div className="ns-toolbar-btn__inner">
                                                            <span className="ns-toolbar-btn__content">
                                                                <span className="ns-toolbar-btn__label">Today</span>
                                                            </span>
                                                            <span className="ns-toolbar-btn__icon-wrap">
                                                                <span className="ns-toolbar-btn__icon" aria-hidden="true">
                                                                    <CalendarIcon />
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </button>

                                                {/* el-63..70: Filters button */}
                                                <button type="button" className="ns-toolbar-btn">
                                                    <div className="ns-toolbar-btn__inner">
                                                        <span className="ns-toolbar-btn__content">
                                                            <span className="ns-toolbar-btn__label">Filters</span>
                                                        </span>
                                                        <span className="ns-toolbar-btn__icon-wrap">
                                                            <span className="ns-toolbar-btn__icon" aria-hidden="true">
                                                                <FilterIcon />
                                                            </span>
                                                        </span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        {/* el-71: Center column (empty) */}
                                        <div className="ns-toolbar__center" />

                                        {/* el-72: Right column */}
                                        <div className="ns-toolbar__right">
                                            {/* el-73..82: Sort by button */}
                                            <div>
                                                <div style={{ display: 'flex' }}>
                                                    <button type="button" className="ns-toolbar-btn">
                                                        <div className="ns-toolbar-btn__inner">
                                                            <span className="ns-toolbar-btn__content">
                                                                <span className="ns-toolbar-btn__label">Sort by</span>
                                                            </span>
                                                            <span className="ns-toolbar-btn__icon-wrap">
                                                                <span className="ns-toolbar-btn__icon" aria-hidden="true">
                                                                    <SortByIcon />
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

                            {/* ======== DATA TABLE (el-83..178) ======== */}
                            <div className="ns-table-section">
                                <div className="ns-table-inner">
                                    <table className="ns-table">
                                        {/* el-86..92: Colgroup — 6 equal columns */}
                                        <colgroup>
                                            <col />
                                            <col />
                                            <col />
                                            <col />
                                            <col />
                                            <col />
                                        </colgroup>

                                        {/* el-93..138: Thead */}
                                        <thead>
                                            <tr>
                                                {TABLE_COLUMNS.map((col) => (
                                                    <HeaderCell key={col.key} col={col} />
                                                ))}
                                            </tr>
                                        </thead>

                                        {/* el-139..169: Tbody */}
                                        <tbody>
                                            {SALES_DATA.map((sale) => (
                                                <SaleRow key={sale.id} sale={sale} />
                                            ))}
                                        </tbody>

                                        {/* el-170..177: Tfoot */}
                                        <tfoot>
                                            <tr>
                                                <td colSpan={6}>
                                                    <div className="ns-pagination">
                                                        <div className="ns-pagination__children">
                                                            <div className="ns-pagination__text-wrap">
                                                                <span className="ns-pagination__text">
                                                                    Showing {SALES_DATA.length} of {SALES_DATA.length} results
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {/* el-177: Hidden loader overlay */}
                                                        <div className="ns-pagination__loader" />
                                                    </div>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {/* el-178: Scroll detection container */}
                            <div className="ns-scroll-detection" />

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewSales;

