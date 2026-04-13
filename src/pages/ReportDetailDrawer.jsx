import { useRef, useState, useEffect, useCallback } from 'react';
import './ReportDetailDrawer.css';

/* ============================
   SVG ICONS from detail computed-styles.json
   ============================ */

// Back arrow (el-16, LTR icon)
const BackArrowIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.707 6.293a1 1 0 0 1 0 1.414L7.414 15H27a1 1 0 1 1 0 2H7.414l7.293 7.293a1 1 0 0 1-1.414 1.414l-9-9a1 1 0 0 1 0-1.414l9-9a1 1 0 0 1 1.414 0" fillRule="evenodd" clipRule="evenodd" />
  </svg>
);

// Star icon (el-40)
const StarIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M29.9 11.162a2 2 0 0 0-1.726-1.375l-7.422-.64-2.91-6.92a1.994 1.994 0 0 0-3.678 0l-2.901 6.92-7.43.644a2 2 0 0 0-1.14 3.508l5.638 4.928-1.69 7.318a2 2 0 0 0 2.98 2.168l6.374-3.876 6.387 3.876a2 2 0 0 0 2.98-2.168l-1.69-7.326 5.637-4.92a2 2 0 0 0 .591-2.137m-1.902.625-5.636 4.92a2 2 0 0 0-.635 1.965l1.693 7.33-6.382-3.875a1.99 1.99 0 0 0-2.067 0l-6.374 3.876 1.683-7.326a2 2 0 0 0-.635-1.964l-5.64-4.918v-.011l7.43-.643a2 2 0 0 0 1.668-1.219l2.9-6.912 2.9 6.912a2 2 0 0 0 1.668 1.219l7.43.643v.008z" />
  </svg>
);

// Chevron down (el-56)
const ChevronDownIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.043 12.293a1 1 0 0 1 1.414 0L16 17.836l5.543-5.543a1 1 0 0 1 1.414 1.414l-6.25 6.25a1 1 0 0 1-1.414 0l-6.25-6.25a1 1 0 0 1 0-1.414" fillRule="evenodd" clipRule="evenodd" />
  </svg>
);

// Filter/sliders icon (el-85)
const FiltersIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 4a1 1 0 0 1 1 1v11h2a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2h2V5a1 1 0 0 1 1-1m9 0a1 1 0 0 1 1 1v5h2a1 1 0 1 1 0 2h-6a1 1 0 1 1 0-2h2V5a1 1 0 0 1 1-1m9 0a1 1 0 0 1 1 1v15h2a1 1 0 1 1 0 2h-6a1 1 0 1 1 0-2h2V5a1 1 0 0 1 1-1m-9 10a1 1 0 0 1 1 1v12a1 1 0 1 1-2 0V15a1 1 0 0 1 1-1m-9 6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1m18 4a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1" fillRule="evenodd" clipRule="evenodd" />
  </svg>
);

// Settings/gear icon (el-101)
const SettingsIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 10a6 6 0 1 0 6 6 6.006 6.006 0 0 0-6-6m0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8m13.743-6.599a1 1 0 0 0-.487-.675l-3.729-2.125-.015-4.202a1 1 0 0 0-.353-.76 14 14 0 0 0-4.59-2.584 1 1 0 0 0-.808.074L16 5.23l-3.765-2.106a1 1 0 0 0-.809-.075 14 14 0 0 0-4.585 2.594 1 1 0 0 0-.354.759l-.018 4.206-3.729 2.125a1 1 0 0 0-.486.675 13.3 13.3 0 0 0 0 5.195 1 1 0 0 0 .486.675l3.729 2.125.015 4.202a1 1 0 0 0 .354.76 14 14 0 0 0 4.59 2.584 1 1 0 0 0 .807-.074L16 26.77l3.765 2.106a1.009 1.009 0 0 0 .809.073 14 14 0 0 0 4.585-2.592 1 1 0 0 0 .354-.759l.018-4.206 3.729-2.125a1 1 0 0 0 .486-.675 13.3 13.3 0 0 0-.003-5.19m-1.875 4.364-3.572 2.031a1 1 0 0 0-.375.375c-.072.125-.148.258-.226.383a1 1 0 0 0-.152.526l-.02 4.031c-.96.754-2.029 1.357-3.17 1.788L16.75 24.89a1 1 0 0 0-.489-.125h-.478a1 1 0 0 0-.513.125l-3.605 2.013a12 12 0 0 1-3.18-1.779L8.471 21.1a1 1 0 0 0-.152-.527 7 7 0 0 1-.225-.383 1 1 0 0 0-.375-.383l-3.575-2.036a11.3 11.3 0 0 1 0-3.532l3.565-2.035a1 1 0 0 0 .375-.375c.072-.125.149-.258.226-.383.1-.157.152-.34.152-.526l.02-4.031c.96-.754 2.029-1.357 3.17-1.788L15.25 7.11a1 1 0 0 0 .512.125h.456a1 1 0 0 0 .512-.125l3.605-2.013a12 12 0 0 1 3.18 1.779l.014 4.025a1 1 0 0 0 .152.527c.078.126.154.25.225.383.089.159.218.291.375.383l3.575 2.036c.188 1.17.19 2.364.006 3.536z" />
  </svg>
);

/* ============================
   MOCK TABLE DATA
   ============================ */
const TABLE_COLUMNS = [
  { key: 'type', label: 'Type', align: 'left' },
  { key: 'salesQty', label: 'Sales qty', align: 'right' },
  { key: 'itemsSold', label: 'Items sold', align: 'right' },
  { key: 'grossSales', label: 'Gross sales', align: 'right' },
  { key: 'totalDiscounts', label: 'Total discounts', align: 'right' },
  { key: 'refunds', label: 'Refunds', align: 'right' },
  { key: 'netSales', label: 'Net sales', align: 'right' },
  { key: 'taxes', label: 'Taxes', align: 'right' },
  { key: 'totalSales', label: 'Total sales', align: 'right' },
];

const TABLE_DATA = [
  {
    type: { value: 'Total', bold: true },
    salesQty: { value: '3', bold: true },
    itemsSold: { value: '3', bold: true },
    grossSales: { value: 'TRY 120.00', bold: true },
    totalDiscounts: { value: 'TRY 0.00', bold: true },
    refunds: { value: 'TRY 0.00', bold: true },
    netSales: { value: 'TRY 120.00', bold: true },
    taxes: { value: 'TRY 0.00', bold: true },
    totalSales: { value: 'TRY 120.00', bold: true },
    summary: true,
  },
  {
    type: { value: 'Service', bold: false, link: true },
    salesQty: { value: '3', bold: false },
    itemsSold: { value: '3', bold: false },
    grossSales: { value: 'TRY 120.00', bold: false },
    totalDiscounts: { value: 'TRY 0.00', bold: false },
    refunds: { value: 'TRY 0.00', bold: false },
    netSales: { value: 'TRY 120.00', bold: false },
    taxes: { value: 'TRY 0.00', bold: false },
    totalSales: { value: 'TRY 120.00', bold: false },
    summary: false,
  },
];

/* ============================
   ADVANCED FILTERS ICON (base64 from JSON el-90)
   ============================ */
const ADV_FILTER_SRC = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHBhdGggZmlsbD0idXJsKCNhKSIgZD0iTTAgMGg2NHY2NEgweiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik00MCAxOGEyIDIgMCAwIDEgMi0yaDRhMiAyIDAgMCAxIDIgMnYyOGEyIDIgMCAwIDEtMiAyaC00YTIgMiAwIDAgMS0yLTJ6bS0xMiA4YTIgMiAwIDAgMSAyLTJoNGEyIDIgMCAwIDEgMiAydjIwYTIgMiAwIDAgMS0yIDJoLTRhMiAyIDAgMCAxLTItMnptLTEyIDhhMiAyIDAgMCAxIDItMmg0YTIgMiAwIDAgMSAyIDJ2MTJhMiAyIDAgMCAxLTIgMmgtNGEyIDIgMCAwIDEtMi0yeiIvPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBpZD0iYSIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC02Mi44MDU2IDY0IC03NS4yOTY3IC03OS45MjYgNjQgMCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjNUI5MEVEIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNjg1NEYzIi8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PC9zdmc+";

/* ============================
   COMPONENT
   ============================ */
export default function ReportDetailDrawer({ reportCard, onBack }) {
  const cardTitle = reportCard?.title || 'Sales summary';
  const cardDesc = reportCard?.desc || 'Sales quantities and value, excluding tips and gift card sales.';
  const category = reportCard?.categoryLabel || 'Sales';

  const scrollRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      setIsScrolled(scrollRef.current.scrollLeft > 0);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="rd-page">
      {/* SCROLL CONTAINER (el-1) */}
      <div className="rd-scroll">
        {/* PADDED CONTENT (el-2) */}
        <div className="rd-padded">
          {/* GRID (el-3) */}
          <div className="rd-grid">
            {/* ── TITLE AREA (el-4 > el-5) ── */}
            <div className="rd-title-area">
              {/* BREADCRUMB ROW (el-6) */}
              <div className="rd-breadcrumb-row">
                {/* BACK BUTTON (el-7) */}
                <button className="rd-back-btn" type="button" onClick={onBack}>
                  <span className="rd-icon">
                    <BackArrowIcon />
                  </span>
                  <span>Back</span>
                </button>

                {/* BREADCRUMBS (el-19 > el-20) */}
                <nav>
                  <ol className="rd-breadcrumbs">
                    <li><a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>All reports</a></li>
                    <li><a href="#" onClick={(e) => e.preventDefault()}>{category}</a></li>
                    <li><div className="rd-crumb--current">{cardTitle}</div></li>
                  </ol>
                </nav>
              </div>

              {/* TITLE + ACTIONS ROW (el-27) */}
              <div className="rd-header-row">
                {/* TITLE COLUMN (el-28) */}
                <div className="rd-header-info">
                  {/* Title line (el-29) */}
                  <div className="rd-header-title-line">
                    <p className="rd-header-title">{cardTitle}</p>
                    {/* Star button (el-33) */}
                    <div style={{ display: 'flex', alignItems: 'center', minHeight: '36px', maxHeight: '36px' }}>
                      <button className="rd-star-btn" type="button" aria-label="Add to favorites">
                        <span className="rd-icon">
                          <StarIcon />
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Description (el-41) */}
                  <p className="rd-header-desc">
                    {cardDesc}
                    <span className="rd-tooltip-text"> Data from 20 mins ago</span>
                  </p>

                  {/* Empty p (el-44) */}
                  <p style={{ margin: 0 }} />
                </div>

                {/* OPTIONS BUTTON (el-45 > el-49) */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button className="rd-options-btn" type="button">
                    <span>Options</span>
                    <span className="rd-icon">
                      <ChevronDownIcon />
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── CONTENT AREA (el-57) ── */}
            <div className="rd-content-area">
              {/* FILTER TOOLBAR (el-58) */}
              <div className="rd-filter-toolbar">
                {/* Filter row (el-59) */}
                <div className="rd-filter-row">
                  {/* LEFT FILTERS (el-60) */}
                  <div className="rd-filter-left">
                    <button className="rd-pill-btn" type="button">
                      <span>Type</span>
                      <span className="rd-icon"><ChevronDownIcon /></span>
                    </button>
                    <button className="rd-pill-btn" type="button">
                      <span>Month to date</span>
                      <span className="rd-icon"><ChevronDownIcon /></span>
                    </button>
                    <button className="rd-pill-btn" type="button">
                      <span>Filters</span>
                      <span className="rd-icon"><FiltersIcon /></span>
                    </button>
                    <button className="rd-pill-btn rd-pill-btn--ghost" type="button">
                      <span className="rd-adv-icon">
                        <img src={ADV_FILTER_SRC} alt="Advanced filters" aria-hidden="true" />
                      </span>
                      <span>Advanced filters</span>
                    </button>
                  </div>

                  {/* RIGHT FILTERS (el-93) */}
                  <div className="rd-filter-right">
                    <button className="rd-pill-btn" type="button" aria-label="Customize">
                      <span className="rd-icon"><SettingsIcon /></span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ── TABLE (el-102 > el-103 > el-104) ── 
                   SINGLE TABLE inside a scroll container.
                   First column (Type) is position:sticky left:0.
                   thead is position:sticky top:0.
              */}
              <div className="rd-table-container">
                <div ref={scrollRef} className={`rd-table-scroll${isScrolled ? ' rd-table-scroll--scrolled' : ''}`} role="region" tabIndex={0}>
                  <table className="rd-table">
                    <colgroup>
                      {TABLE_COLUMNS.map((col, i) => (
                        <col key={col.key} className={i === 0 ? 'rd-col-first' : 'rd-col-rest'} />
                      ))}
                    </colgroup>
                    <thead>
                      <tr>
                        {TABLE_COLUMNS.map((col) => (
                          <th key={col.key}>
                            <div className="rd-th-pad">
                              <button
                                className={`rd-th-btn ${col.align === 'left' ? 'rd-th-btn--left' : 'rd-th-btn--right'}`}
                                type="button"
                              >
                                <span>{col.label}</span>
                              </button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TABLE_DATA.map((row, rowIdx) => (
                        <tr key={rowIdx} className={row.summary ? 'rd-row--summary' : 'rd-row--normal'}>
                          {TABLE_COLUMNS.map((col) => {
                            const cell = row[col.key];
                            return (
                              <td
                                key={col.key}
                                className={row.summary ? 'rd-cell--faded' : 'rd-cell--default'}
                              >
                                <p className={`rd-cell-text ${cell.bold ? 'rd-cell-text--bold' : ''} ${cell.link ? 'rd-cell-text--link' : ''} ${col.align === 'left' ? 'rd-cell-text--left' : 'rd-cell-text--right'}`}>
                                  {cell.value}
                                </p>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* FOOTER (el-266: child of el-102, border-top, padding:16px, centered) */}
                <div className="rd-table-footer">
                  <div className="rd-table-footer-inner">
                    <p className="rd-footer-text">
                      Viewing of results <span>1 - {TABLE_DATA.length}</span> of <span>{TABLE_DATA.length}</span>
                    </p>
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
