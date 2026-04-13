import React from 'react';
import './NewPayments.css';

/* ====================== SVG ICONS ====================== */

/* el-20, el-43: Chevron Down icon (viewBox 0 0 32 32) */
const ChevronDownIcon = ({ size = 24, className = '' }) => (
    <svg
        className={className}
        viewBox="0 0 32 32"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size, height: size }}
    >
        <path
            d="M9.043 12.293a1 1 0 0 1 1.414 0L16 17.836l5.543-5.543a1 1 0 0 1 1.414 1.414l-6.25 6.25a1 1 0 0 1-1.414 0l-6.25-6.25a1 1 0 0 1 0-1.414"
            fillRule="evenodd"
            clipRule="evenodd"
        />
    </svg>
);

/* el-34: Search icon (viewBox 0 0 32 32) */
const SearchIcon = ({ size = 20, className = '' }) => (
    <svg
        className={className}
        viewBox="0 0 32 32"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size, height: size }}
    >
        <path
            d="M14.5 5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19M3 14.5C3 8.149 8.149 3 14.5 3S26 8.149 26 14.5c0 2.816-1.012 5.395-2.692 7.394l5.4 5.399a1 1 0 0 1-1.415 1.414l-5.399-5.399c-2 1.68-4.578 2.692-7.394 2.692C8.149 26 3 20.851 3 14.5"
            fillRule="evenodd"
            clipRule="evenodd"
        />
    </svg>
);

/* el-51: Filter sliders icon (viewBox 0 0 32 32) */
const FilterIcon = ({ size = 20, className = '' }) => (
    <svg
        className={className}
        viewBox="0 0 32 32"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size, height: size }}
    >
        <path
            d="M7 4a1 1 0 0 1 1 1v11h2a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2h2V5a1 1 0 0 1 1-1m9 0a1 1 0 0 1 1 1v5h2a1 1 0 1 1 0 2h-6a1 1 0 1 1 0-2h2V5a1 1 0 0 1 1-1m9 0a1 1 0 0 1 1 1v15h2a1 1 0 1 1 0 2h-6a1 1 0 1 1 0-2h2V5a1 1 0 0 1 1-1m-9 10a1 1 0 0 1 1 1v12a1 1 0 1 1-2 0V15a1 1 0 0 1 1-1m-9 6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1m18 4a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1"
            fillRule="evenodd"
            clipRule="evenodd"
        />
    </svg>
);

/* el-79..el-134: Sort arrow down icon (viewBox 0 0 32 32) */
const SortArrowIcon = ({ size = 16, className = '' }) => (
    <svg
        className={className}
        viewBox="0 0 32 32"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size, height: size }}
    >
        <path
            d="m26.061 19.061-9 9a1.5 1.5 0 0 1-2.125 0l-9-9a1.503 1.503 0 0 1 2.125-2.125l6.439 6.439V5a1.5 1.5 0 1 1 3 0v18.375l6.439-6.44a1.503 1.503 0 1 1 2.122 2.126"
        />
    </svg>
);

/* el-225..el-432: 3-dot menu icon (viewBox 0 0 32 32) */
const MoreDotsIcon = ({ size = 20, className = '' }) => (
    <svg
        className={className}
        viewBox="0 0 32 32"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size, height: size }}
    >
        <path
            d="M16 23.333A2.333 2.333 0 1 1 16 28a2.333 2.333 0 0 1 0-4.667M16 13.667a2.333 2.333 0 1 1 0 4.666 2.333 2.333 0 0 1 0-4.666M16 4a2.333 2.333 0 1 1 0 4.667A2.333 2.333 0 0 1 16 4"
        />
    </svg>
);

/* ====================== TABLE DATA ====================== */

const columns = [
    { key: 'date', label: 'Payment date', sortable: true, pinned: true },
    { key: 'location', label: 'Location', sortable: true },
    { key: 'ref', label: 'Ref #', sortable: true },
    { key: 'client', label: 'Client', sortable: true },
    { key: 'teamMember', label: 'Team member', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'method', label: 'Method', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true, align: 'end' },
];

/* el-156: Total row amount = TRY 884.00 */
/* el-179..el-420: 5 data rows extracted from JSON */
const paymentData = [
    {
        id: 1,
        date: '22 Feb 2026',
        location: 'Hasan',
        ref: '6',
        refLink: true,
        client: 'Walk-In',
        teamMember: 'Furkan Kem',
        teamMemberLink: true,
        type: 'Sale',
        method: 'Cash',
        amount: 'TRY 600.00',
    },
    {
        id: 2,
        date: '22 Feb 2026',
        location: 'Hasan',
        ref: '5',
        refLink: true,
        client: 'Walk-In',
        teamMember: 'Furkan Kem',
        teamMemberLink: true,
        type: 'Sale',
        method: 'Cash',
        amount: 'TRY 20.00',
    },
    {
        id: 3,
        date: '20 Feb 2026',
        location: 'Hasan',
        ref: '4',
        refLink: true,
        client: 'Walk-In',
        teamMember: 'Furkan Kem',
        teamMemberLink: true,
        type: 'Sale',
        method: 'Cash',
        amount: 'TRY 10.00',
    },
    {
        id: 4,
        date: '19 Feb 2026',
        location: 'Hasan',
        ref: '3',
        refLink: true,
        client: 'Walk-In',
        teamMember: 'Furkan Kem',
        teamMemberLink: true,
        type: 'Sale',
        method: 'Cash',
        amount: 'TRY 10.00',
    },
    {
        id: 5,
        date: '19 Feb 2026',
        location: 'Hasan',
        ref: '2',
        refLink: true,
        client: 'Jane Doe',
        clientLink: true,
        teamMember: 'Furkan Kem',
        teamMemberLink: true,
        type: 'Sale',
        method: 'Other',
        amount: 'TRY 244.00',
    },
];

const totalAmount = 'TRY 884.00';

/* ====================== SORT HEADER CELL ====================== */

/* el-72..el-139: Each header cell contains a sort button */
const SortHeaderCell = ({ label, pinned, align }) => (
    <th className={`pay-th ${pinned ? 'pinned-left' : ''} ${align === 'end' ? 'th-amount' : 'th-standard'}`}>
        {/* el-73: inner div wrapper */}
        <div>
            {/* el-74: padding wrapper */}
            <div className="pay-th-sort-wrap">
                {/* el-75: sort button */}
                <button type="button" className="pay-th-sort-btn">
                    {/* el-76: header text */}
                    <span className="pay-th-sort-text">{label}</span>
                    {/* el-77: sort icon wrapper */}
                    <span className="pay-th-sort-icon-wrap">
                        {/* el-78: icon span */}
                        <span className="pay-icon-span-16" aria-hidden="true">
                            {/* el-79: SVG */}
                            <SortArrowIcon size={16} className="pay-icon-svg-16" />
                        </span>
                    </span>
                </button>
            </div>
        </div>
    </th>
);

/* ====================== CELL RENDERERS ====================== */

/* Standard text cell (date, location, type, method) */
const TextCell = ({ value, pinned, variant = 'default' }) => (
    <td className={`pay-td ${pinned ? 'pinned-left' : 'td-standard'} variant-${variant}`}>
        {/* el-178/182/etc: text wrap p */}
        <p className="pay-cell-text-wrap">
            {/* el-179/183/etc: inner text (span to avoid p-in-p) */}
            <span className="pay-cell-text">{value}</span>
        </p>
        {/* el-180/184/etc: empty secondary p */}
        <p className="pay-cell-text-secondary"></p>
    </td>
);

/* Link cell (ref#, client*, teamMember) */
const LinkCell = ({ value, isLink, variant = 'default' }) => (
    <td className={`pay-td td-standard variant-${variant}`}>
        {/* el-186: outer text-wrap p (always present) */}
        <p className="pay-cell-text-wrap">
            {isLink ? (
                /* el-187..el-190: tooltip -> link wrapper (span not div, inside p) */
                <span className="pay-link-tooltip-wrap" role="tooltip">
                    <span className="pay-link-text-limit">
                        <span className="pay-link-text-span">
                            <a href="#" className="pay-cell-link">{value}</a>
                        </span>
                    </span>
                </span>
            ) : (
                /* plain text fallback */
                <span className="pay-cell-text">{value}</span>
            )}
        </p>
        {/* el-191: empty secondary p */}
        <p className="pay-cell-text-secondary"></p>
    </td>
);

/* Amount cell (right-aligned) */
const AmountCell = ({ value, bold, variant = 'default' }) => (
    <td className={`pay-td td-amount variant-${variant}`}>
        {/* el-171/213/264/315/366/420: text wrap p */}
        <p className="pay-cell-text-wrap text-end">
            {/* el-172/etc: inner text (span to avoid p-in-p) */}
            <span className={`pay-cell-text text-right ${bold ? 'semibold' : ''}`}>{value}</span>
        </p>
        {/* el-173/etc: empty secondary p */}
        <p className="pay-cell-text-secondary"></p>
    </td>
);

/* Actions cell with 3-dot button */
const ActionsCell = ({ variant = 'default' }) => (
    <td className={`pay-td td-actions variant-${variant}`}>
        {/* el-216: text-wrap div (contains block children, so can't be p) */}
        <div className="pay-cell-text-wrap pay-actions-text-wrap">
            {/* el-217: inner div wrapper */}
            <div className="pay-action-cell-inner">
                {/* el-218: action button */}
                <button type="button" className="pay-action-btn" aria-label="Actions">
                    {/* el-219: button inner */}
                    <div className="pay-action-btn-inner">
                        {/* el-220-221: sr-only label */}
                        <span className="pay-action-btn-label">Actions</span>
                        {/* el-222: icon outer wrapper */}
                        <span className="pay-action-icon-wrap">
                            {/* el-223: icon span */}
                            <span className="pay-icon-span-20">
                                {/* el-224-225: SVG */}
                                <MoreDotsIcon size={20} className="pay-icon-svg-20" />
                            </span>
                        </span>
                    </div>
                </button>
            </div>
        </div>
        {/* el-226: empty secondary p */}
        <p className="pay-cell-text-secondary"></p>
    </td>
);

/* Empty cell for total row (Location, Ref, Client, Team, Type, Method, Actions cols) */
const EmptyCell = ({ variant = 'pageFaded', className = 'td-standard' }) => (
    <td className={`pay-td ${className} variant-${variant}`}>
        <p className="pay-cell-text-wrap"></p>
    </td>
);

/* ====================== MAIN COMPONENT ====================== */

const NewPayments = () => {
    return (
        /* el-0: root */
        <div className="pay-root">
            {/* el-1: inner */}
            <div className="pay-inner">
                {/* el-2: content wrapper */}
                <div className="pay-content-wrapper">
                    {/* el-3: main flex */}
                    <div className="pay-main-flex">
                        {/* el-4: padded content */}
                        <div className="pay-content">

                            {/* =================== HEADER =================== */}
                            {/* el-5: header area */}
                            <div className="pay-header-area">
                                {/* el-6: title content */}
                                <div className="pay-title-content">
                                    {/* el-7: title row */}
                                    <div className="pay-title-row">
                                        {/* el-8: h1 */}
                                        <h1 className="pay-title">Payment transactions</h1>
                                    </div>
                                    {/* el-9: subtitle */}
                                    <p className="pay-subtitle">View, filter and export the history of your payments.</p>
                                </div>

                                {/* el-10: options area (suffix) */}
                                <div className="pay-options-area">
                                    {/* el-11: options group */}
                                    <div className="pay-options-group">
                                        {/* el-12: button wrapper */}
                                        <div className="pay-options-btn-wrap">
                                            {/* el-13: options button */}
                                            <button type="button" className="pay-options-btn">
                                                {/* el-14: button inner */}
                                                <div className="pay-options-btn-inner">
                                                    {/* el-15: button content span */}
                                                    <span className="pay-options-btn-content">
                                                        {/* el-16: "Options" text */}
                                                        <span className="pay-options-text">Options</span>
                                                    </span>
                                                    {/* el-17: icon wrapper */}
                                                    <span className="pay-options-icon-wrap">
                                                        {/* el-18: icon inner span */}
                                                        <span className="pay-icon-span-24" aria-hidden="true">
                                                            {/* el-19..el-20: SVG chevron down */}
                                                            <ChevronDownIcon size={24} className="pay-icon-svg-24" />
                                                        </span>
                                                    </span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* =================== TOOLBAR + TABLE =================== */}
                            {/* el-21: body wrapper (gap-16 column flex) */}
                            <div className="pay-body-wrapper">

                                {/* el-22: toolbar outer */}
                                <div className="pay-toolbar-outer">
                                    {/* el-23: toolbar (gray bg) */}
                                    <div className="pay-toolbar">
                                        {/* el-24: toolbar grid */}
                                        <div className="pay-toolbar-grid">

                                            {/* el-25: toolbar left */}
                                            <div className="pay-toolbar-left">
                                                {/* ========= SEARCH ========= */}
                                                {/* el-26: search field outer */}
                                                <div className="pay-search-field-outer">
                                                    {/* el-27: search label (sr-only) */}
                                                    <label className="pay-search-label">
                                                        {/* el-28: label text span */}
                                                        <span>Search</span>
                                                    </label>
                                                    {/* el-29: search field row */}
                                                    <div className="pay-search-field-row">
                                                        {/* el-30: search container */}
                                                        <div className="pay-search-container">
                                                            {/* el-31: search icon prefix */}
                                                            <div className="pay-search-icon-prefix">
                                                                {/* el-32: icon span */}
                                                                <span className="pay-icon-span-20" aria-hidden="true">
                                                                    {/* el-33..el-34: search SVG */}
                                                                    <SearchIcon size={20} className="pay-icon-svg-20" />
                                                                </span>
                                                            </div>
                                                            {/* el-35: search input */}
                                                            <input
                                                                type="text"
                                                                className="pay-search-input"
                                                                placeholder="Search by Sale or Client"
                                                                name="search"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* ========= DATE BUTTON ========= */}
                                                {/* el-36: date button */}
                                                <button type="button" className="pay-date-btn">
                                                    {/* el-37: date button inner */}
                                                    <div className="pay-date-btn-inner">
                                                        {/* el-38: text area */}
                                                        <span className="pay-date-btn-text-area">
                                                            {/* el-39: date text */}
                                                            <span className="pay-date-text">Feb 19, 2026 - Feb 22, 2026</span>
                                                        </span>
                                                        {/* el-40: icon wrapper */}
                                                        <span className="pay-date-icon-wrap">
                                                            {/* el-41: icon span */}
                                                            <span className="pay-icon-span-20" aria-hidden="true">
                                                                {/* el-42..el-43: chevron down SVG */}
                                                                <ChevronDownIcon size={20} className="pay-icon-svg-20" />
                                                            </span>
                                                        </span>
                                                    </div>
                                                </button>

                                                {/* ========= FILTERS BUTTON ========= */}
                                                {/* el-44: filters button */}
                                                <button type="button" className="pay-filters-btn">
                                                    {/* el-45: filters button inner */}
                                                    <div className="pay-filters-btn-inner">
                                                        {/* el-46: content span */}
                                                        <span className="pay-filters-btn-content">
                                                            {/* el-47: "Filters" text */}
                                                            <span className="pay-filters-text">Filters</span>
                                                        </span>
                                                        {/* el-48: icon wrapper */}
                                                        <span className="pay-filters-icon-wrap">
                                                            {/* el-49: icon span */}
                                                            <span className="pay-icon-span-20" aria-hidden="true">
                                                                {/* el-50..el-51: filter SVG */}
                                                                <FilterIcon size={20} className="pay-icon-svg-20" />
                                                            </span>
                                                        </span>
                                                    </div>
                                                </button>
                                            </div>

                                            {/* el-52: toolbar center (empty) */}
                                            <div className="pay-toolbar-center"></div>

                                            {/* el-53: toolbar right (empty) */}
                                            <div className="pay-toolbar-right"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* =================== TABLE =================== */}
                                {/* el-54: table outer */}
                                <div className="pay-table-outer">
                                    {/* el-55: table region wrapper */}
                                    <div className="pay-table-border-wrap" role="region">
                                        {/* el-56: table position wrapper */}
                                        <div className="pay-table-scroll">

                                            {/* el-57: sticky header wrapper */}
                                            <div className="pay-sticky-header">
                                                {/* el-58: header overflow wrapper */}
                                                <div className="pay-header-overflow">
                                                    {/* el-59: header table */}
                                                    <table className="pay-table pay-table-animate">
                                                        {/* el-60: colgroup */}
                                                        <colgroup>
                                                            {/* el-61..el-69: col elements (9 columns) */}
                                                            <col className="pay-col-date" />
                                                            <col className="pay-col-location" />
                                                            <col className="pay-col-ref" />
                                                            <col className="pay-col-client" />
                                                            <col className="pay-col-team" />
                                                            <col className="pay-col-type" />
                                                            <col className="pay-col-method" />
                                                            <col className="pay-col-amount" />
                                                            <col className="pay-col-actions" />
                                                        </colgroup>

                                                        {/* el-70: thead */}
                                                        <thead className="pay-thead">
                                                            {/* el-71: header row */}
                                                            <tr className="pay-thead-row">
                                                                {/* el-72..el-138: header cells */}
                                                                {columns.map((col) => (
                                                                    <SortHeaderCell
                                                                        key={col.key}
                                                                        label={col.label}
                                                                        pinned={col.pinned}
                                                                        align={col.align}
                                                                    />
                                                                ))}
                                                                {/* el-139: Actions header (no sort button, just text) */}
                                                                <th className="pay-th th-actions"></th>
                                                            </tr>
                                                        </thead>
                                                    </table>
                                                </div>
                                            </div>

                                            {/* el-140: body scroll wrapper */}
                                            <div className="pay-body-scroll">
                                                {/* el-141: body table section (with delayed animation) */}
                                                <table className="pay-tbody-table pay-tbody-section">
                                                    {/* el-142: colgroup (same as header) */}
                                                    <colgroup>
                                                        <col className="pay-col-date" />
                                                        <col className="pay-col-location" />
                                                        <col className="pay-col-ref" />
                                                        <col className="pay-col-client" />
                                                        <col className="pay-col-team" />
                                                        <col className="pay-col-type" />
                                                        <col className="pay-col-method" />
                                                        <col className="pay-col-amount" />
                                                        <col className="pay-col-actions" />
                                                    </colgroup>

                                                    {/* el-152: tbody */}
                                                    <tbody className="pay-tbody">
                                                        {/* el-153: Total row (variant-pageFaded) */}
                                                        <tr className="pay-tr">
                                                            {/* el-154..el-156: Date cell with "Total" */}
                                                            <td className="pay-td pinned-left variant-pageFaded">
                                                                <p className="pay-cell-text-wrap">
                                                                    <span className="pay-cell-text semibold">Total</span>
                                                                </p>
                                                                <p className="pay-cell-text-secondary"></p>
                                                            </td>
                                                            {/* el-158: Location (empty) */}
                                                            <EmptyCell variant="pageFaded" />
                                                            {/* el-160: Ref# (empty) */}
                                                            <EmptyCell variant="pageFaded" />
                                                            {/* el-162: Client (empty) */}
                                                            <EmptyCell variant="pageFaded" />
                                                            {/* el-164: Team member (empty) */}
                                                            <EmptyCell variant="pageFaded" />
                                                            {/* el-166: Type (empty) */}
                                                            <EmptyCell variant="pageFaded" />
                                                            {/* el-168: Method (empty) */}
                                                            <EmptyCell variant="pageFaded" />
                                                            {/* el-170..el-172: Amount with total */}
                                                            <AmountCell value={totalAmount} bold variant="pageFaded" />
                                                            {/* el-174: Actions (empty) */}
                                                            <EmptyCell variant="pageFaded" className="td-actions" />
                                                        </tr>

                                                        {/* el-176..el-433: Data rows */}
                                                        {paymentData.map((row) => (
                                                            <tr key={row.id} className="pay-tr">
                                                                {/* Date (pinned) */}
                                                                <TextCell value={row.date} pinned variant="default" />
                                                                {/* Location */}
                                                                <TextCell value={row.location} variant="default" />
                                                                {/* Ref# (link) */}
                                                                <LinkCell value={row.ref} isLink={row.refLink} variant="default" />
                                                                {/* Client (link or text) */}
                                                                <LinkCell value={row.client} isLink={row.clientLink} variant="default" />
                                                                {/* Team member (link) */}
                                                                <LinkCell value={row.teamMember} isLink={row.teamMemberLink} variant="default" />
                                                                {/* Type */}
                                                                <TextCell value={row.type} variant="default" />
                                                                {/* Method */}
                                                                <TextCell value={row.method} variant="default" />
                                                                {/* Amount */}
                                                                <AmountCell value={row.amount} variant="default" />
                                                                {/* Actions (3-dot) */}
                                                                <ActionsCell variant="default" />
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>  {/* close pay-body-scroll */}
                                        </div>  {/* close pay-table-scroll */}
                                    </div>  {/* close pay-table-border-wrap (el-55) */}

                                    {/* el-434: Pagination footer (direct child of pay-table-outer) */}
                                    <div className="pay-pagination">
                                        {/* el-435: pagination inner */}
                                        <div className="pay-pagination-inner">
                                            {/* el-436: sr-only results text */}
                                            <span className="pay-pagination-sr">
                                                Viewing results 1 to 5 of 5
                                            </span>
                                            {/* el-437: visible results wrapper */}
                                            <span className="pay-pagination-visible" aria-hidden="true">
                                                {/* el-438: visible text */}
                                                <p className="pay-pagination-text">
                                                    Viewing of results{' '}
                                                    {/* el-439: bold "1 - 5" */}
                                                    <span className="pay-pagination-bold">1 - 5</span>
                                                    {' '}of{' '}
                                                    {/* el-440: bold "5" */}
                                                    <span className="pay-pagination-bold">5</span>
                                                </p>
                                            </span>
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
};

export default NewPayments;
