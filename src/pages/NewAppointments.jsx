import React from 'react';
import './NewAppointments.css';

/* ─── SVG Icon Components ─── */

const SearchIcon = () => (
    <svg className="na-icon-svg-20" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M14.5 5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19M3 14.5C3 8.149 8.149 3 14.5 3S26 8.149 26 14.5c0 2.816-1.012 5.395-2.692 7.394l5.4 5.399a1 1 0 0 1-1.415 1.414l-5.399-5.399c-2 1.68-4.578 2.692-7.394 2.692C8.149 26 3 20.851 3 14.5" fillRule="evenodd" clipRule="evenodd" />
    </svg>
);

const CalendarIcon = () => (
    <svg className="na-icon-svg-20" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M10 2a1 1 0 0 1 1 1v1h10V3a1 1 0 1 1 2 0v1h3a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V3a1 1 0 0 1 1-1M9 6H6v4h20V6h-3v1a1 1 0 1 1-2 0V6H11v1a1 1 0 1 1-2 0zm17 6H6v14h20z" fillRule="evenodd" clipRule="evenodd" />
    </svg>
);

const FilterIcon = () => (
    <svg className="na-icon-svg-20" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M7 4a1 1 0 0 1 1 1v11h2a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2h2V5a1 1 0 0 1 1-1m9 0a1 1 0 0 1 1 1v5h2a1 1 0 1 1 0 2h-6a1 1 0 1 1 0-2h2V5a1 1 0 0 1 1-1m9 0a1 1 0 0 1 1 1v15h2a1 1 0 1 1 0 2h-6a1 1 0 1 1 0-2h2V5a1 1 0 0 1 1-1m-9 10a1 1 0 0 1 1 1v12a1 1 0 1 1-2 0V15a1 1 0 0 1 1-1m-9 6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1m18 4a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1" fillRule="evenodd" clipRule="evenodd" />
    </svg>
);

const SortIcon = () => (
    <svg className="na-icon-svg-20" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M5 8a1 1 0 0 1 1-1h17a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1m18 5a1 1 0 0 1 1 1v9.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-5 5a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 1.414-1.414L22 23.586V14a1 1 0 0 1 1-1M5 16a1 1 0 0 1 1-1h9a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1m0 8a1 1 0 0 1 1-1h7a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1" fillRule="evenodd" clipRule="evenodd" />
    </svg>
);

/* ─── Status Badge Component ─── */
const StatusBadge = ({ status }) => {
    const statusMap = {
        'Booked': {
            bg: 'rgb(234, 241, 253)',
            color: 'rgb(45, 118, 236)',
            shadow: 'rgb(234, 241, 253) 0px 0px 0px 1px inset',
        },
        'Confirmed': {
            bg: 'rgb(240, 240, 255)',
            color: 'rgb(105, 80, 243)',
            shadow: 'rgb(219, 221, 255) 0px 0px 0px 1px inset',
        },
        'Arrived': {
            bg: 'rgb(255, 247, 219)',
            color: 'rgb(183, 87, 11)',
            shadow: 'rgb(255, 239, 178) 0px 0px 0px 1px inset',
        },
        'No-show': {
            bg: 'rgb(254, 236, 235)',
            color: 'rgb(212, 22, 58)',
            shadow: 'rgb(254, 227, 226) 0px 0px 0px 1px inset',
        },
        'Started': {
            bg: 'rgb(237, 251, 233)',
            color: 'rgb(31, 137, 0)',
            shadow: 'rgb(210, 246, 201) 0px 0px 0px 1px inset',
        },
        'Completed': {
            bg: 'rgb(242, 242, 242)',
            color: 'inherit',
            shadow: 'rgb(229, 229, 229) 0px 0px 0px 1px inset',
        },
    };

    const s = statusMap[status] || statusMap['Completed'];

    return (
        <div
            className="na-status-badge"
            style={{
                backgroundColor: s.bg,
                color: s.color,
                boxShadow: s.shadow,
            }}
        >
            <span className="na-status-badge-text" style={{ color: s.color }}>
                {status}
            </span>
        </div>
    );
};

/* ─── Appointment Data ─── */
const appointmentData = [
    {
        ref: '#3C62199E',
        client: 'Walk-In',
        service: 'Hair Color',
        createdBy: 'Furkan Kem',
        createdDate: '22 Feb 2026, 17:42',
        scheduledDate: '22 Feb 2026, 18:30',
        duration: '55min',
        teamMember: 'Wendy Smith (Demo)',
        price: 'TRY 57.00',
        status: 'Booked',
    },
    {
        ref: '#3C61199E',
        client: 'Walk-In',
        service: 'Hair Color',
        createdBy: 'Furkan Kem',
        createdDate: '21 Feb 2026, 00:39',
        scheduledDate: '21 Feb 2026, 14:25',
        duration: '50min',
        teamMember: 'Furkan Kem',
        price: 'TRY 57.00',
        status: 'Confirmed',
    },
    {
        ref: '#3D500B67',
        clientLink: true,
        client: 'Jane Doe',
        service: 'Haircut',
        createdBy: 'Furkan Kem',
        createdDate: '21 Feb 2026, 18:22',
        scheduledDate: '20 Feb 2026, 11:00',
        duration: '50min',
        teamMember: 'Furkan Kem',
        price: 'TRY 40.00',
        status: 'Arrived',
    },
    {
        ref: '#D9D028EF',
        client: 'Walk-In',
        service: 'Manicure',
        createdBy: 'Furkan Kem',
        createdDate: '20 Feb 2026, 01:36',
        scheduledDate: '19 Feb 2026, 13:30',
        duration: '30min',
        teamMember: 'Furkan Kem',
        price: 'TRY 25.00',
        status: 'No-show',
    },
    {
        ref: '#D47BCF82',
        client: 'Walk-In',
        service: 'Manicure',
        createdBy: 'Furkan Kem',
        createdDate: '20 Feb 2026, 01:37',
        scheduledDate: '19 Feb 2026, 13:30',
        duration: '30min',
        teamMember: 'Wendy Smith (Demo)',
        price: 'TRY 25.00',
        status: 'Started',
    },
    {
        ref: '#7F33E99D',
        client: 'Walk-In',
        service: 'Hair Color',
        createdBy: 'Furkan Kem',
        createdDate: '20 Feb 2026, 01:35',
        scheduledDate: '19 Feb 2026, 12:15',
        duration: '55min',
        teamMember: 'Furkan Kem',
        price: 'TRY 57.00',
        status: 'Completed',
    },
    {
        ref: '#E0251908',
        client: 'Walk-In',
        service: 'Hair Color',
        createdBy: 'Furkan Kem',
        createdDate: '19 Feb 2026, 04:15',
        scheduledDate: '19 Feb 2026, 11:00',
        duration: '55min',
        teamMember: 'Furkan Kem',
        price: 'TRY 57.00',
        status: 'Completed',
    },
    {
        ref: '#878DA6C6',
        client: 'Walk-In',
        service: 'Pedicure',
        createdBy: 'Furkan Kem',
        createdDate: '19 Feb 2026, 04:15',
        scheduledDate: '19 Feb 2026, 10:10',
        duration: '45min',
        teamMember: 'Furkan Kem',
        price: 'TRY 30.00',
        status: 'Completed',
    },
];

const columns = [
    { key: 'ref', label: 'Ref #', align: 'left' },
    { key: 'client', label: 'Client', align: 'left' },
    { key: 'service', label: 'Service', align: 'left' },
    { key: 'createdBy', label: 'Created by', align: 'left' },
    { key: 'createdDate', label: 'Created Date', align: 'left' },
    { key: 'scheduledDate', label: 'Scheduled Date', align: 'left' },
    { key: 'duration', label: 'Duration', align: 'left' },
    { key: 'teamMember', label: 'Team member', align: 'left' },
    { key: 'price', label: 'Price', align: 'right' },
    { key: 'status', label: 'Status', align: 'left' },
];

/* ─── Main Component ─── */
const NewAppointments = () => {
    return (
        /* el-0: Root container */
        <div className="na-root">
            {/* el-1: Inner wrapper */}
            <div className="na-inner">
                {/* el-2: Content wrapper (positioned, z-index:9) */}
                <div className="na-content-wrapper">
                    {/* el-3: Main flex (centered, transition) */}
                    <div className="na-main-flex">
                        {/* el-4: Padded content area */}
                        <div className="na-content">
                            {/* el-5: Header area (padding-bottom:24px) */}
                            <div className="na-header-area">
                                {/* el-6: Title content (flex-grow:1, column, justify-content:center) */}
                                <div className="na-title-content">
                                    {/* el-7: Title row (align-items:center, flex, h:36px) */}
                                    <div className="na-title-row">
                                        {/* el-8: h1 */}
                                        <h1 className="na-title">Appointments</h1>
                                    </div>
                                    {/* el-9: Subtitle */}
                                    <p className="na-subtitle">View, filter and export appointments booked by your clients.</p>
                                </div>

                                {/* el-10: Export area (margin-left:16px) */}
                                <div className="na-export-area">
                                    {/* el-11: Wrapper */}
                                    <div className="na-export-group">
                                        {/* el-12: Flex wrapper */}
                                        <div className="na-export-btn-wrap">
                                            {/* el-13: Button */}
                                            <button className="na-export-btn" type="button" aria-label="Export">
                                                {/* el-14: Inner */}
                                                <div className="na-export-btn-inner">
                                                    {/* el-15: Text content span */}
                                                    <span className="na-export-btn-content">
                                                        {/* el-16: "Export" text */}
                                                        <span className="na-export-text">Export</span>
                                                    </span>
                                                    {/* el-17: Icon wrapper (sibling of el-15 under el-14) */}
                                                    <span className="na-export-icon-wrap">
                                                        {/* el-18: Icon inner */}
                                                        <span className="na-icon-span">
                                                            {/* el-19–20: Chevron SVG */}
                                                            <svg className="na-icon-svg-24" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                                                                <path d="M9.043 12.293a1 1 0 0 1 1.414 0L16 17.836l5.543-5.543a1 1 0 0 1 1.414 1.414l-6.25 6.25a1 1 0 0 1-1.414 0l-6.25-6.25a1 1 0 0 1 0-1.414" fillRule="evenodd" clipRule="evenodd" />
                                                            </svg>
                                                        </span>
                                                    </span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* el-21: Toolbar outer */}
                            <div className="na-toolbar-outer">
                                {/* el-22: Toolbar inner (gray bg) */}
                                <div className="na-toolbar">
                                    {/* el-23: Toolbar grid */}
                                    <div className="na-toolbar-grid">

                                        {/* el-24: Left toolbar section */}
                                        <div className="na-toolbar-left">
                                            {/* el-25: Search row */}
                                            <div className="na-search-row">
                                                {/* el-26: Search field outer */}
                                                <div className="na-search-field-outer">
                                                    {/* el-27: SR label */}
                                                    <label className="na-search-label">Search</label>
                                                    {/* el-29: Field row */}
                                                    <div className="na-search-field-row">
                                                        {/* el-30: Container */}
                                                        <div className="na-search-container">
                                                            {/* el-31: Icon prefix */}
                                                            <div className="na-search-icon-prefix">
                                                                {/* el-32: Icon span */}
                                                                <span className="na-search-icon-span">
                                                                    {/* el-33–34: Search SVG */}
                                                                    <SearchIcon />
                                                                </span>
                                                            </div>
                                                            {/* el-35: Input */}
                                                            <input
                                                                className="na-search-input"
                                                                type="text"
                                                                placeholder="Search by Reference or Client"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* ─ Date button ─ */}
                                                {/* el-36: Date btn outer */}
                                                <button className="na-date-btn" type="button">
                                                    {/* el-37: Group */}
                                                    <div className="na-date-btn-group">
                                                        {/* el-38: Inner */}
                                                        <div className="na-date-btn-inner">
                                                            {/* el-39: Text area */}
                                                            <span className="na-date-btn-text-area">
                                                                {/* el-40: Date text */}
                                                                <span className="na-date-text">19 Feb, 2026 - 22 Feb, 2026</span>
                                                            </span>
                                                            {/* el-41–44: Calendar icon (sibling of el-39) */}
                                                            <span className="na-date-icon-wrap">
                                                                <span className="na-icon-span-20">
                                                                    <CalendarIcon />
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </button>

                                                {/* ─ Filters button ─ */}
                                                {/* el-45: Filters btn */}
                                                <button className="na-filters-btn" type="button">
                                                    {/* el-46: Inner */}
                                                    <div className="na-filters-btn-inner">
                                                        {/* el-47: Content */}
                                                        <span className="na-filters-btn-content">
                                                            {/* el-48: Text */}
                                                            <span className="na-filters-text">Filters</span>
                                                        </span>
                                                        {/* el-49–52: Icon (sibling of el-47 under el-46) */}
                                                        <span className="na-filters-icon-wrap">
                                                            <span className="na-icon-span-20">
                                                                <FilterIcon />
                                                            </span>
                                                        </span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        {/* el-53: Center toolbar section (empty) */}
                                        <div className="na-toolbar-center" />

                                        {/* el-54: Right toolbar section */}
                                        <div className="na-toolbar-right">
                                            {/* el-55: Sort container */}
                                            <div className="na-sort-container">
                                                {/* el-56: Flex wrapper */}
                                                <div className="na-sort-flex">
                                                    {/* el-57: Sort button */}
                                                    <button className="na-sort-btn" type="button">
                                                        {/* el-58: Inner */}
                                                        <div className="na-sort-btn-inner">
                                                            {/* el-59: Content */}
                                                            <span className="na-sort-btn-content">
                                                                {/* el-60: Text */}
                                                                <span className="na-sort-text">Scheduled Date (newest first)</span>
                                                            </span>
                                                            {/* el-61–64: Icon (sibling of el-59 under el-58) */}
                                                            <span className="na-sort-icon-wrap">
                                                                <span className="na-icon-span-20">
                                                                    <SortIcon />
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

                            {/* el-65: Table container wrapper */}
                            <div className="na-table-container-outer">
                                {/* el-66: Table scroll container */}
                                <div className="na-table-scroll">
                                    {/* el-67: Table */}
                                    <table className="na-table">
                                        {/* el-68: Colgroup */}
                                        <colgroup>
                                            {columns.map((col, i) => (
                                                <col key={i} className="na-col" />
                                            ))}
                                        </colgroup>

                                        {/* el-79: Thead */}
                                        <thead className="na-thead">
                                            {/* el-80: Header row */}
                                            <tr className="na-thead-row">
                                                {columns.map((col, i) => (
                                                    <th
                                                        key={col.key}
                                                        className={`na-th ${i === 0 ? 'na-th-first' : ''} ${i === columns.length - 1 ? 'na-th-last' : ''} ${col.align === 'right' ? 'na-th-right' : ''}`}
                                                    >
                                                        {/* el-82+: Header cell inner */}
                                                        <div className="na-th-inner">
                                                            {/* el-83+: Header text wrapper */}
                                                            <div className="na-th-text-wrap">
                                                                <div className="na-th-text">{col.label}</div>
                                                            </div>
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>

                                        {/* el-133: Tbody */}
                                        <tbody className="na-tbody">
                                            {appointmentData.map((row, rowIndex) => (
                                                <tr
                                                    key={rowIndex}
                                                    className={`na-row ${rowIndex === appointmentData.length - 1 ? 'na-row-last' : ''}`}
                                                >
                                                    {/* Ref # (link) */}
                                                    <td className="na-td na-td-first">
                                                        <a className="na-ref-link" href="#">
                                                            <span className="na-ref-text">{row.ref}</span>
                                                        </a>
                                                    </td>

                                                    {/* Client */}
                                                    <td className="na-td">
                                                        {row.clientLink ? (
                                                            <a className="na-ref-link" href="#">
                                                                <span className="na-ref-text">{row.client}</span>
                                                            </a>
                                                        ) : (
                                                            <div className="na-cell-text">{row.client}</div>
                                                        )}
                                                    </td>

                                                    {/* Service */}
                                                    <td className="na-td">
                                                        <div className="na-cell-text">{row.service}</div>
                                                    </td>

                                                    {/* Created by */}
                                                    <td className="na-td">
                                                        <div className="na-cell-text">{row.createdBy}</div>
                                                    </td>

                                                    {/* Created date */}
                                                    <td className="na-td">
                                                        <div className="na-cell-text">{row.createdDate}</div>
                                                    </td>

                                                    {/* Scheduled date */}
                                                    <td className="na-td na-td-scheduled">
                                                        <div className="na-cell-text">{row.scheduledDate}</div>
                                                    </td>

                                                    {/* Duration */}
                                                    <td className="na-td">
                                                        <div className="na-cell-text">{row.duration}</div>
                                                    </td>

                                                    {/* Team member */}
                                                    <td className="na-td">
                                                        <div className="na-cell-text">{row.teamMember}</div>
                                                    </td>

                                                    {/* Price */}
                                                    <td className="na-td na-td-right">
                                                        <div className="na-cell-text">{row.price}</div>
                                                    </td>

                                                    {/* Status */}
                                                    <td className="na-td na-td-last">
                                                        <StatusBadge status={row.status} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>

                                        {/* el-320: Tfoot */}
                                        <tfoot className="na-tfoot">
                                            {/* el-321: Footer row */}
                                            <tr className="na-tfoot-row">
                                                {/* el-322: Footer cell */}
                                                <td className="na-tfoot-td" colSpan={columns.length}>
                                                    {/* el-323: Footer content */}
                                                    <div className="na-footer-content">
                                                        {/* el-324: Children */}
                                                        <div className="na-footer-children">
                                                            {/* el-325: Inner flex */}
                                                            <div className="na-footer-inner">
                                                                {/* el-326: Text */}
                                                                <span className="na-footer-text">
                                                                    Showing 8 of 8 results
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {/* el-327: Loader (hidden) */}
                                                        <div className="na-footer-loader" />
                                                    </div>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>{/* /na-table-scroll */}
                            </div>{/* /na-table-container-outer */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewAppointments;
