import { useState, useRef, useEffect } from 'react';
import './Reports.css';
import ReportDetailDrawer from './ReportDetailDrawer';

/* ============================
   SVG ICON COMPONENTS
   All paths from computed-styles.json
   ============================ */

// Sidebar icons - LTR versions (el-24/25)
const AllReportsIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 8a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H11a1 1 0 0 1-1-1m0 8a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H11a1 1 0 0 1-1-1m0 8a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H11a1 1 0 0 1-1-1" fillRule="evenodd" clipRule="evenodd" />
    <path d="M5.5 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M5.5 17.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M5.5 25.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
  </svg>
);

const FavouritesIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M29.9 11.162a2 2 0 0 0-1.726-1.375l-7.422-.64-2.91-6.92a1.994 1.994 0 0 0-3.678 0l-2.901 6.92-7.43.644a2 2 0 0 0-1.14 3.508l5.638 4.928-1.69 7.318a2 2 0 0 0 2.98 2.168l6.374-3.876 6.387 3.876a2 2 0 0 0 2.98-2.168l-1.69-7.326 5.637-4.92a2 2 0 0 0 .591-2.137m-1.902.625-5.636 4.92a2 2 0 0 0-.635 1.965l1.693 7.33-6.382-3.875a1.99 1.99 0 0 0-2.067 0l-6.374 3.876 1.683-7.326a2 2 0 0 0-.635-1.964l-5.64-4.918v-.011l7.43-.643a2 2 0 0 0 1.668-1.219l2.9-6.912 2.9 6.912a2 2 0 0 0 1.668 1.219l7.43.643v.008z" />
  </svg>
);

const DashboardsIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.5 5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v20h1a1 1 0 1 1 0 2h-25a1 1 0 1 1 0-2h1v-8a1 1 0 0 1 1-1h6v-5a1 1 0 0 1 1-1h6zm0 7h-5v13h5zm2 13h5V6h-5zm-9 0v-7h-5v7z" fillRule="evenodd" clipRule="evenodd" />
  </svg>
);

const StandardIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 7a2 2 0 0 1 2-2h22a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm6 0H5v18h4zm2 0v18h4V7zm6 0v18h4V7zm6 0v18h4V7z" fillRule="evenodd" clipRule="evenodd" />
  </svg>
);

const PremiumIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 28a1 1 0 0 1-1 1h-4a1 1 0 0 1 0-2h4a1 1 0 0 1 1 1m-3-14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m11.953 5.479-1.546 6.954a2 2 0 0 1-3.188 1.138L19.814 25h-7.625L8.78 27.571a2 2 0 0 1-3.189-1.139L4.047 19.48a2.01 2.01 0 0 1 .415-1.714l3.57-4.283c.12-1.573.482-3.12 1.072-4.583 1.612-4.043 4.5-6.579 5.671-7.482a2 2 0 0 1 2.45 0c1.167.903 4.059 3.44 5.671 7.482a15.4 15.4 0 0 1 1.072 4.584l3.57 4.282a2.01 2.01 0 0 1 .415 1.714M12.429 23h7.142c2.64-4.692 3.134-9.185 1.468-13.36C19.569 5.955 16.81 3.625 16 3c-.814.625-3.571 2.955-5.041 6.64-1.664 4.175-1.17 8.668 1.47 13.36m-1.875.731q-2.02-3.67-2.45-7.211L6 19.045 7.545 26l.022-.016zM26 19.045l-2.104-2.525q-.428 3.535-2.445 7.211l2.982 2.25.022.016z" />
  </svg>
);

const CustomIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 5C9.925 5 5 9.925 5 16c0 2.805 1.05 5.365 2.778 7.308a10 10 0 0 1 4.51-3.594 6 6 0 1 1 7.425 0 10 10 0 0 1 4.51 3.594A10.96 10.96 0 0 0 27 16c0-6.075-4.925-11-11-11m8.747 20.617A12.97 12.97 0 0 0 29 16c0-7.18-5.82-13-13-13S3 8.82 3 16c0 3.811 1.64 7.24 4.253 9.617q.05.053.108.098A12.95 12.95 0 0 0 16 29a12.95 12.95 0 0 0 8.639-3.285 1 1 0 0 0 .108-.098m-2.005-.925a8 8 0 0 0-13.484 0A10.95 10.95 0 0 0 16 27c2.54 0 4.88-.861 6.742-2.308M16.067 19a4 4 0 1 0-.134-8 4 4 0 0 0 .134 8" />
  </svg>
);

const TargetsIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M27.734 10.395a13.013 13.013 0 1 1-3.275-4.27l2.834-2.835a1 1 0 1 1 1.415 1.415l-12 12a1 1 0 1 1-1.415-1.415l3.465-3.465a5 5 0 1 0 2.233 3.886 1.002 1.002 0 1 1 2-.112 7 7 0 1 1-2.797-5.206l2.844-2.844a10.985 10.985 0 1 0 2.89 3.709 1 1 0 1 1 1.806-.863" />
  </svg>
);

const FolderPlusIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 5a1 1 0 0 1 1 1v9h9a1 1 0 1 1 0 2h-9v9a1 1 0 1 1-2 0v-9H6a1 1 0 1 1 0-2h9V6a1 1 0 0 1 1-1" />
  </svg>
);

// Search icon (el-159)
const SearchIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5 5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19M3 14.5C3 8.149 8.149 3 14.5 3S26 8.149 26 14.5c0 2.816-1.012 5.395-2.692 7.394l5.4 5.399a1 1 0 0 1-1.415 1.414l-5.399-5.399c-2 1.68-4.578 2.692-7.394 2.692C8.149 26 3 20.851 3 14.5" fillRule="evenodd" clipRule="evenodd" />
  </svg>
);

// Chevron down (el-170)
const ChevronDownIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.043 12.293a1 1 0 0 1 1.414 0L16 17.836l5.543-5.543a1 1 0 0 1 1.414 1.414l-6.25 6.25a1 1 0 0 1-1.414 0l-6.25-6.25a1 1 0 0 1 0-1.414" fillRule="evenodd" clipRule="evenodd" />
  </svg>
);

// Sort icon (el-179)
const SortIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 8a1 1 0 0 1 1-1h17a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1m18 5a1 1 0 0 1 1 1v9.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-5 5a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 1.414-1.414L22 23.586V14a1 1 0 0 1 1-1M5 16a1 1 0 0 1 1-1h9a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1m0 8a1 1 0 0 1 1-1h7a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1" fillRule="evenodd" clipRule="evenodd" />
  </svg>
);

// Star icon (el-234 — used on all cards)
const StarIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M29.9 11.162a2 2 0 0 0-1.726-1.375l-7.422-.64-2.91-6.92a1.994 1.994 0 0 0-3.678 0l-2.901 6.92-7.43.644a2 2 0 0 0-1.14 3.508l5.638 4.928-1.69 7.318a2 2 0 0 0 2.98 2.168l6.374-3.876 6.387 3.876a2 2 0 0 0 2.98-2.168l-1.69-7.326 5.637-4.92a2 2 0 0 0 .591-2.137m-1.902.625-5.636 4.92a2 2 0 0 0-.635 1.965l1.693 7.33-6.382-3.875a1.99 1.99 0 0 0-2.067 0l-6.374 3.876 1.683-7.326a2 2 0 0 0-.635-1.964l-5.64-4.918v-.011l7.43-.643a2 2 0 0 0 1.668-1.219l2.9-6.912 2.9 6.912a2 2 0 0 0 1.668 1.219l7.43.643v.008z" />
  </svg>
);

/* ============================
   DATA — SIDEBAR MENU ITEMS
   ============================ */
const SIDEBAR_ITEMS = [
  { id: 'all', label: 'All reports', count: '53', icon: AllReportsIcon, active: true },
  { id: 'favourites', label: 'Favourites', count: '0', icon: FavouritesIcon },
  { id: 'dashboards', label: 'Dashboards', count: '3', icon: DashboardsIcon },
  { id: 'standard', label: 'Standard', count: '45', icon: StandardIcon },
  { id: 'premium', label: 'Premium', count: '8', icon: PremiumIcon },
  { id: 'custom', label: 'Custom', count: '0', icon: CustomIcon },
  { id: 'targets', label: 'Targets', count: '', icon: TargetsIcon },
];

/* ============================
   DATA — TAB BAR
   ============================ */
const TABS = [
  { id: 'all', label: 'All reports' },
  { id: 'sales', label: 'Sales' },
  { id: 'finance', label: 'Finance' },
  { id: 'appointments', label: 'Appointments' },
  { id: 'team', label: 'Team' },
  { id: 'clients', label: 'Clients' },
  { id: 'inventory', label: 'Inventory' },
];

/* ============================
   DATA — REPORT CARDS (8 cards from JSON)
   All SVG paths, titles, descriptions, premium status
   ============================ */
const REPORT_CARDS = [
  {
    id: 'performance-dashboard',
    title: 'Performance dashboard',
    desc: 'Dashboard of your business performance.',
    isPremium: false,
    iconFill: '#1f8900',
    iconPaths: [
      { d: 'M18.5 5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v20h1a1 1 0 1 1 0 2h-25a1 1 0 1 1 0-2h1v-8a1 1 0 0 1 1-1h6v-5a1 1 0 0 1 1-1h6zm0 7h-5v13h5zm2 13h5V6h-5zm-9 0v-7h-5v7z', fillRule: 'evenodd', clipRule: 'evenodd' },
    ],
  },
  {
    id: 'performance-over-time',
    title: 'Performance over time',
    desc: 'View of key business metrics by Location or Team Member over time',
    isPremium: true,
    iconFill: '#6950f3',
    iconPaths: [
      { d: 'M4 5a1 1 0 0 1 1 1v13.586l6.293-6.293a1 1 0 0 1 1.414 0L16 16.586 23.586 9H21a1 1 0 1 1 0-2h5a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-2.586l-8.293 8.293a1 1 0 0 1-1.414 0L12 15.414l-7 7V25h23a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1' },
    ],
  },
  {
    id: 'sales-summary',
    title: 'Sales summary',
    desc: 'Sales quantities and value, excluding tips and gift card sales.',
    isPremium: false,
    iconFill: '#6950f3',
    iconPaths: [
      { d: 'M15.145 2.256a2 2 0 0 1 1.8.55l13.046 13.046a1.99 1.99 0 0 1 0 2.834L18.686 29.99a1.99 1.99 0 0 1-2.834 0L2.806 16.945a2 2 0 0 1-.55-1.8v-.003L4.27 5.054a1 1 0 0 1 .785-.785l10.088-2.012zm.385 1.963L6.1 6.1 4.22 15.53l13.05 13.05 11.31-11.311z', fillRule: 'evenodd', clipRule: 'evenodd' },
      { d: 'M10.5 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3' },
    ],
  },
  {
    id: 'finance-summary',
    title: 'Finance summary',
    desc: 'High-level summary of sales, payments and liabilities',
    isPremium: false,
    iconFill: '#6950f3',
    iconPaths: [
      { d: 'M16 11a5 5 0 1 0 0 10 5 5 0 0 0 0-10m0 8a3 3 0 1 1 0-5.999A3 3 0 0 1 16 19M30 7H2a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h28a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1m-5.794 16H7.794A7.1 7.1 0 0 0 3 18.206v-4.412A7.1 7.1 0 0 0 7.794 9h16.412A7.1 7.1 0 0 0 29 13.794v4.412A7.1 7.1 0 0 0 24.206 23M29 11.671A5.1 5.1 0 0 1 26.329 9H29zM5.671 9A5.1 5.1 0 0 1 3 11.671V9zM3 20.329A5.1 5.1 0 0 1 5.671 23H3zM26.329 23A5.1 5.1 0 0 1 29 20.329V23z' },
    ],
  },
  {
    id: 'appointments-summary',
    title: 'Appointments summary',
    desc: 'General overview of appointment trends and patterns, including cancellations and no-shows.',
    isPremium: false,
    iconFill: '#6950f3',
    iconPaths: [
      { d: 'M10 2a1 1 0 0 1 1 1v1h10V3a1 1 0 1 1 2 0v1h3a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V3a1 1 0 0 1 1-1M9 6H6v4h20V6h-3v1a1 1 0 1 1-2 0V6H11v1a1 1 0 1 1-2 0zm17 6H6v14h20z', fillRule: 'evenodd', clipRule: 'evenodd' },
    ],
  },
  {
    id: 'attendance-summary',
    title: 'Attendance summary',
    desc: "Overview of team members' punctuality and attendance for their shifts",
    isPremium: false,
    iconFill: '#6950f3',
    iconPaths: [
      { d: 'M30.6 18.8a1 1 0 0 1-1.4-.2A6.45 6.45 0 0 0 24 16a1 1 0 0 1 0-2 3 3 0 1 0-2.905-3.75 1 1 0 0 1-1.937-.5 5 5 0 1 1 8.217 4.939 8.5 8.5 0 0 1 3.429 2.71A1 1 0 0 1 30.6 18.8m-6.735 7.7a1 1 0 1 1-1.73 1 7.125 7.125 0 0 0-12.27 0 1 1 0 1 1-1.73-1 9 9 0 0 1 4.217-3.74 6 6 0 1 1 7.296 0 9 9 0 0 1 4.217 3.74M16 22a4 4 0 1 0 0-8 4 4 0 0 0 0 8m-7-7a1 1 0 0 0-1-1 3 3 0 1 1 2.905-3.75 1 1 0 0 0 1.938-.5 5 5 0 1 0-8.218 4.939 8.5 8.5 0 0 0-3.425 2.71A1 1 0 1 0 2.8 18.6 6.45 6.45 0 0 1 8 16a1 1 0 0 0 1-1' },
    ],
  },
  {
    id: 'client-summary',
    title: 'Client summary',
    desc: 'Overview of new, returning and walk-in clients with appointments in the chosen timeframe',
    isPremium: true,
    iconFill: '#6950f3',
    iconPaths: [
      { d: 'M11.5 15a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M20.5 15a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3' },
      { d: 'M16 5C9.925 5 5 9.925 5 16s4.925 11 11 11 11-4.925 11-11S22.075 5 16 5M3 16C3 8.82 8.82 3 16 3s13 5.82 13 13-5.82 13-13 13S3 23.18 3 16m7.298 2.135a1 1 0 0 1 1.367.363 5.01 5.01 0 0 0 8.67 0 1 1 0 0 1 1.73 1.004 7.013 7.013 0 0 1-12.13 0 1 1 0 0 1 .363-1.367' },
    ],
  },
  {
    id: 'stock-movement',
    title: 'Stock movement summary',
    desc: 'Summary of stock inflow and outflow.',
    isPremium: false,
    iconFill: '#6950f3',
    iconPaths: [
      { d: 'M15.408 14.822a1 1 0 0 0-1 1v3.637l-.068.104a7.5 7.5 0 0 0-.586 1.103c-.418.964-.819 2.374-.819 4.222 0 1.844.4 3.38.8 4.456.2.54.401.967.556 1.264a8 8 0 0 0 .269.476l.006.01.002.003.002.002c.184.284.5.455.838.455h11.786c.338 0 .654-.171.838-.455v-.001l.002-.001.002-.004.006-.01a2 2 0 0 0 .077-.127q.074-.124.192-.348c.155-.297.356-.724.556-1.264.4-1.076.8-2.612.8-4.456 0-1.848-.402-3.258-.82-4.222a7.5 7.5 0 0 0-.654-1.206v-3.638a1 1 0 0 0-1-1zm1 3.967h9.785v-1.967h-9.785zm-.476 2c-.1.166-.22.39-.343.672-.319.736-.654 1.876-.654 3.427 0 1.556.338 2.854.674 3.76.14.374.277.68.39.906h10.604c.112-.226.25-.532.39-.906.336-.906.674-2.204.674-3.76 0-1.55-.336-2.69-.655-3.427a6 6 0 0 0-.342-.672z' },
      { d: 'M21.716 18.581H19.71zM16.792 18.582h-2zM11.563 23.026a4 4 0 0 1-.375-.547c-.57-.977-.986-2.457-.986-4.201s.417-3.224.986-4.2c.598-1.026 1.131-1.166 1.31-1.166.118 0 .383.06.719.381h2.445c-.785-1.463-1.912-2.38-3.163-2.38-2.373 0-4.297 3.297-4.297 7.365 0 3.417 1.357 6.29 3.198 7.123v-.02c0-.868.062-1.653.163-2.355' },
      { d: 'M7.563 1.103a1 1 0 0 1 .743-.33h8.314a1 1 0 0 1 .994 1.103l-.417 4.018c.304.238.721.584 1.188 1.03.933.893 2.091 2.211 2.926 3.882.278.555.415 1.297.49 2.061q.02.207.034.426H19.83l-.02-.233c-.07-.71-.181-1.148-.287-1.36-.7-1.398-1.69-2.535-2.521-3.33a14 14 0 0 0-1.203-1.027H9.05q-.09.06-.211.147c-.282.202-.672.504-1.098.894-.861.79-1.819 1.898-2.356 3.24-.092.231-.181.69-.23 1.408a27 27 0 0 0-.025 2.502c.057 1.918.246 4.206.475 6.417a200 200 0 0 0 .944 7.603h5.337c.188.794.406 1.468.604 2H5.686a1 1 0 0 1-.99-.85l-.006-.049-.097-.662a201.766 201.766 0 0 1-.976-7.835c-.231-2.231-.426-4.576-.485-6.565-.029-.994-.025-1.915.029-2.698.051-.756.154-1.477.369-2.013.69-1.727 1.881-3.074 2.86-3.972A14 14 0 0 1 7.72 5.83l-.409-3.955a1 1 0 0 1 .252-.773m7.947 1.67-.267 2.57H9.681l-.266-2.57z', fillRule: 'evenodd', clipRule: 'evenodd' },
    ],
  },
];

/* ============================
   SIDEBAR COMPONENT
   ============================ */
function Sidebar({ activeItem, onItemClick }) {
  return (
    <div className="fresha-sidebar">
      <div className="fresha-sidebar__sticky">
        <div className="fresha-sidebar__card">
          <div className="fresha-sidebar__border-overlay" />
          <div className="fresha-sidebar__content">
            <ul className="fresha-sidebar__list">
              {/* Section: Reports title */}
              <li className="fresha-sidebar__group">
                <span className="fresha-sidebar__section-header">
                  <span className="fresha-sidebar__section-title-wrap">
                    <p className="fresha-sidebar__section-title">Reports</p>
                  </span>
                </span>
                <ul className="fresha-sidebar__menu">
                  {SIDEBAR_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li
                        key={item.id}
                        className={`fresha-sidebar__item ${activeItem === item.id ? 'fresha-sidebar__item--active' : ''}`}
                        onClick={() => onItemClick(item.id)}
                      >
                        <button className="fresha-sidebar__item-btn" type="button" />
                        <span className="fresha-sidebar__item-icon">
                          <Icon />
                        </span>
                        <span className="fresha-sidebar__item-text-wrap">
                          <span className="fresha-sidebar__item-text">{item.label}</span>
                        </span>
                        {item.count !== undefined && item.count !== '' && (
                          <div className="fresha-sidebar__item-badge">
                            <span className="fresha-sidebar__item-badge-text">{item.count}</span>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
              {/* Separator: el-101 → el-102 */}
              <li className="fresha-sidebar__group fresha-sidebar__divider-group" aria-hidden="true">
                <hr className="fresha-sidebar__hr" />
              </li>
              {/* Section: Folders — el-103 */}
              <li className="fresha-sidebar__group">
                <span className="fresha-sidebar__section-header">
                  <span className="fresha-sidebar__section-title-wrap">
                    <p className="fresha-sidebar__section-title" style={{ fontSize: '17px', lineHeight: '24px', height: '24px' }}>Folders</p>
                  </span>
                </span>
                <ul className="fresha-sidebar__menu">
                  <li className="fresha-sidebar__item" onClick={() => { }}>
                    <button className="fresha-sidebar__item-btn" type="button" />
                    <span className="fresha-sidebar__item-icon" style={{ color: 'rgb(105, 80, 243)' }}>
                      <svg viewBox="0 0 32 32" fill="rgb(105, 80, 243)" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 5a1 1 0 0 1 1 1v9h9a1 1 0 1 1 0 2h-9v9a1 1 0 1 1-2 0v-9H6a1 1 0 1 1 0-2h9V6a1 1 0 0 1 1-1" style={{ fill: 'rgb(105, 80, 243)' }} />
                      </svg>
                    </span>
                    <span className="fresha-sidebar__item-text-wrap">
                      <span className="fresha-sidebar__item-text" style={{ color: 'rgb(105, 80, 243)' }}>Create new folder</span>
                    </span>
                  </li>
                </ul>
              </li>
              {/* Separator: el-117 → el-118 */}
              <li className="fresha-sidebar__group fresha-sidebar__divider-group" aria-hidden="true">
                <hr className="fresha-sidebar__hr" />
              </li>
              {/* Section: Data connector — el-119 (own section, no title) */}
              <li className="fresha-sidebar__group">
                <ul className="fresha-sidebar__menu">
                  <li className="fresha-sidebar__item" onClick={() => { }}>
                    <button className="fresha-sidebar__item-btn" type="button" />
                    <span className="fresha-sidebar__data-connector-img">
                      <picture>
                        <img
                          src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHBhdGggZmlsbD0idXJsKCNhKSIgZD0iTTAgMGg2NHY2NEgweiIvPjxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0ibTM1LjA2NiAyMC45NjgtMy4wNzMgMy4wNzJhMS4yNSAxLjI1IDAgMSAxLTEuNzY3LTEuNzY3bDMuMDkzLTMuMDk0LjA0Mi0uMDRhOC4xNCA4LjE0IDAgMCAxIDExLjUgMTEuNWwtNC40NiA0LjQ0N2E4LjEyIDguMTIgMCAwIDEtNS43NDUgMi4zODUgOC4xIDguMSAwIDAgMS01Ljc0NS0yLjM4NSAxLjI1IDEuMjUgMCAwIDEgMS43NzEtMS43NjUgNS42MSA1LjYxIDAgMCAwIDcuOTQ4IDBsNC40MDMtNC4zODdhNS42NCA1LjY0IDAgMCAwLTcuOTY3LTcuOTY2bS01LjcyMiA4LjA2YTUuNiA1LjYgMCAwIDAtMy45NzQgMS42NTFsLTQuNDAzIDQuMzg3YTUuNjQgNS42NCAwIDAgMCA3Ljk2OCA3Ljk2NmwzLjA3Mi0zLjA3MmExLjI1IDEuMjUgMCAxIDEgMS43NjggMS43NjhMMzAuNjggNDQuODJsLS4wNDIuMDRhOC4xNDEgOC4xNDEgMCAwIDEtMTEuNS0xMS41bDQuNDYtNC40NDZhOC4xMiA4LjEyIDAgMCAxIDUuNzQ1LTIuMzg2IDguMSA4LjEgMCAwIDEgNS43NDUgMi4zODYgMS4yNSAxLjI1IDAgMCAxLTEuNzcxIDEuNzY0IDUuNiA1LjYgMCAwIDAtMy45NzQtMS42NSIgY2xpcC1ydWxlPSJldmVub2RkIi8+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJhIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTYyLjgwNTYgNjQgLTc1LjI5NjcgLTc5LjkyNiA2NCAwKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM5RkNFMDAiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMxRjg5MDAiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48L3N2Zz4="
                          alt="Data connector addon"
                        />
                      </picture>
                    </span>
                    <span className="fresha-sidebar__item-text-wrap">
                      <span className="fresha-sidebar__item-text">Data connector</span>
                    </span>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================
   TAB BAR COMPONENT
   ============================ */
function TabBar({ activeTab, onTabChange }) {
  const tabsRef = useRef({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const el = tabsRef.current[activeTab];
    if (el) {
      setIndicatorStyle({
        left: el.offsetLeft,
        width: el.offsetWidth,
      });
    }
  }, [activeTab]);

  return (
    <div className="fresha-tabs">
      {/* Sliding indicator */}
      <div className="fresha-tabs__indicator" style={indicatorStyle} />
      {TABS.map((tab) => (
        <button
          key={tab.id}
          ref={(el) => { tabsRef.current[tab.id] = el; }}
          className={`fresha-tabs__tab ${activeTab === tab.id ? 'fresha-tabs__tab--active' : ''}`}
          onClick={() => onTabChange(tab.id)}
          role="tab"
          aria-selected={activeTab === tab.id}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/* ============================
   REPORT CARD COMPONENT
   ============================ */
function ReportCard({ card, onClick }) {
  return (
    <div className="fresha-card" onClick={() => onClick && onClick(card)}>
      <button className="fresha-card__btn" type="button" />
      <div className="fresha-card__grid">
        {/* Prefix: Icon */}
        <div className="fresha-card__prefix">
          <div className="fresha-card__icon-grid">
            <div className="fresha-card__icon-wrap">
              <div className="fresha-card__icon-tooltip">
                <div className="fresha-card__icon-inner">
                  <div className="fresha-card__icon-overlay">
                    <div className="fresha-card__icon-circle">
                      <div className="fresha-card__icon-svg-wrap">
                        <span className="fresha-card__icon-span">
                          <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            {card.iconPaths.map((p, i) => (
                              <path
                                key={i}
                                d={p.d}
                                fill={card.iconFill}
                                fillRule={p.fillRule || undefined}
                                clipRule={p.clipRule || undefined}
                              />
                            ))}
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main: Title & Desc */}
        <div className="fresha-card__main">
          <div className="fresha-card__main-inner">
            <div className="fresha-card__main-content">
              <div className="fresha-card__main-text-wrap">
                <h3 className="fresha-card__title">{card.title}</h3>
                <h4 className="fresha-card__desc">{card.desc}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Suffix: Premium badge + Star */}
        <div className="fresha-card__suffix">
          <div className="fresha-card__suffix-inner">
            {card.isPremium && (
              <div className="fresha-card__premium-badge">
                <span className="fresha-card__premium-text">Premium</span>
              </div>
            )}
            <div>
              <button className="fresha-card__star-btn" type="button" title="Add to favorites">
                <div className="fresha-card__star-btn-inner">
                  <span className="fresha-card__star-icon">
                    <StarIcon />
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================
   MAIN REPORTS PAGE
   ============================ */
export default function Reports() {
  const [activeItem, setActiveItem] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleBack = () => {
    setSelectedCard(null);
  };

  const filteredCards = REPORT_CARDS.filter((card) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return card.title.toLowerCase().includes(q) || card.desc.toLowerCase().includes(q);
    }
    return true;
  });

  /* ── DETAIL PAGE ── tüm sayfa bu oluyor ── */
  if (selectedCard) {
    return (
      <ReportDetailDrawer
        reportCard={selectedCard}
        onBack={handleBack}
      />
    );
  }

  /* ── REPORTS LIST PAGE ── */
  return (
    <div className="fresha-reports">
      <div className="fresha-reports__inner">
        <div className="fresha-reports__center">
          <div className="fresha-reports__grid">
            {/* SIDEBAR */}
            <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />

            {/* CONTENT */}
            <div className="fresha-content">
              <div className="fresha-content__inner">
                {/* HEADER */}
                <div className="fresha-header">
                  <div className="fresha-header__left">
                    <div className="fresha-header__title-row">
                      <p className="fresha-header__title">Reporting and analytics</p>
                      <div className="fresha-header__count-wrap">
                        <div className="fresha-header__count-badge">
                          <span className="fresha-header__count-text">53</span>
                        </div>
                      </div>
                    </div>
                    <p className="fresha-header__subtitle">
                      Access all of your Fresha reports.{' '}
                      <a className="fresha-header__link" href="https://www.fresha.com/help-center/knowledge-base/reports" target="_blank" rel="noreferrer">
                        Learn more
                      </a>
                    </p>
                  </div>
                  <div>
                    <button className="fresha-header__add-btn" type="button">
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* TOOLBAR + TABS + CARDS wrapper: el-146 (gap: 0) */}
                <div className="fresha-content__body">
                  {/* TOOLBAR */}
                  <div className="fresha-toolbar">
                    <div className="fresha-toolbar__search">
                      <span className="fresha-toolbar__search-icon">
                        <SearchIcon />
                      </span>
                      <input
                        className="fresha-toolbar__search-input"
                        type="text"
                        placeholder="Search by report name or description"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="fresha-toolbar__spacer" />
                    <button className="fresha-toolbar__dropdown" type="button">
                      <span>Created by</span>
                      <span className="fresha-toolbar__dropdown-icon">
                        <ChevronDownIcon />
                      </span>
                    </button>
                    <button className="fresha-toolbar__dropdown" type="button">
                      <span>Category</span>
                      <span className="fresha-toolbar__dropdown-icon">
                        <SortIcon />
                      </span>
                    </button>
                  </div>

                  {/* TAB BAR */}
                  <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

                  {/* REPORT CARDS */}
                  <div className="fresha-cards">
                    {filteredCards.map((card) => (
                      <ReportCard key={card.id} card={card} onClick={handleCardClick} />
                    ))}
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

