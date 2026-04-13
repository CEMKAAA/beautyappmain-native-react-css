import React, { useState } from 'react';
import './TestPage5.css';
import AddMemberModal from './AddMemberModal';
import RepeatingShiftsModal from './RepeatingShiftsModal';
import MemberDrawer from './MemberDrawer';
import FilterModal from './FilterModal';

/* ═══════════════════════════════════════════════════
   SVG Paths — exact from computed-styles.json
   ═══════════════════════════════════════════════════ */
const SVG_CHEVRON_DOWN = "M9.043 12.293a1 1 0 0 1 1.414 0L16 17.836l5.543-5.543a1 1 0 0 1 1.414 1.414l-6.25 6.25a1 1 0 0 1-1.414 0l-6.25-6.25a1 1 0 0 1 0-1.414";
const SVG_SEARCH = "M14.5 5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19M3 14.5C3 8.149 8.149 3 14.5 3S26 8.149 26 14.5c0 2.816-1.012 5.395-2.692 7.394l5.4 5.399a1 1 0 0 1-1.415 1.414l-5.399-5.399c-2 1.68-4.578 2.692-7.394 2.692C8.149 26 3 20.851 3 14.5";
const SVG_FILTERS = "M7 4a1 1 0 0 1 1 1v11h2a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2h2V5a1 1 0 0 1 1-1m9 0a1 1 0 0 1 1 1v5h2a1 1 0 1 1 0 2h-6a1 1 0 1 1 0-2h2V5a1 1 0 0 1 1-1m9 0a1 1 0 0 1 1 1v15h2a1 1 0 1 1 0 2h-6a1 1 0 1 1 0-2h2V5a1 1 0 0 1 1-1m-9 10a1 1 0 0 1 1 1v12a1 1 0 1 1-2 0V15a1 1 0 0 1 1-1m-9 6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1m18 4a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1";
const SVG_SORT_ORDER = "M5 8a1 1 0 0 1 1-1h17a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1m18 5a1 1 0 0 1 1 1v9.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-5 5a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 1.414-1.414L22 23.586V14a1 1 0 0 1 1-1M5 16a1 1 0 0 1 1-1h9a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1m0 8a1 1 0 0 1 1-1h7a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1";
const SVG_SORT_INDICATOR = "M15.293 6.626a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1-1.414 1.415L16 8.747l-4.293 4.293a1 1 0 0 1-1.414-1.415zm-5 12.334a1 1 0 0 1 1.414 0L16 23.253l4.293-4.293a1 1 0 1 1 1.414 1.414l-5 5a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 0-1.414";
const SVG_CHECKMARK = "m29.061 9.06-16 16a1.5 1.5 0 0 1-2.125 0l-7-7a1.503 1.503 0 1 1 2.125-2.124L12 21.875 26.939 6.938a1.502 1.502 0 1 1 2.125 2.125z";



/* ═══════════════════════════════════════════════════
   Team Members Data (from JSON el-136/el-138 & el-181/el-183)
   ═══════════════════════════════════════════════════ */
const TEAM_MEMBERS = [
    {
        id: '5107827',
        name: 'Furkan Kem',
        subtitle: '',
        commission: 'Commission based',
        email: 'furkankemerror@gmail.com',
        phone: '+90 534 261 77 38',
        rating: 'No reviews yet',
        avatarUrl: null,  // uses initials fallback
        initials: 'FK',
    },
    {
        id: '5118001',
        name: 'Kemerror',
        subtitle: '',
        commission: 'Commission based',
        email: 'furkankemerror@gmail.com',
        phone: '+90 534 261 77 38',
        rating: 'No reviews yet',
        avatarUrl: null,
        initials: 'K',
    },
];

/* ═══════════════════════════════════════════════════
   Checkbox Component
   ═══════════════════════════════════════════════════ */
function Checkbox({ checked, onChange, name }) {
    return (
        <label className="tm-checkbox" onClick={(e) => e.stopPropagation()}>
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
            />
            <div className="tm-checkbox__box">
                <span className="tm-checkbox__check">
                    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d={SVG_CHECKMARK} />
                    </svg>
                </span>
            </div>
        </label>
    );
}

/* ═══════════════════════════════════════════════════
   Icon Component
   ═══════════════════════════════════════════════════ */
function Icon({ d, size = 20, viewBox = "0 0 32 32", className = '' }) {
    return (
        <span className={`tm-icon-container tm-icon-container--${size} ${className}`}>
            <svg viewBox={viewBox} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d={d} fillRule="evenodd" clipRule="evenodd" />
            </svg>
        </span>
    );
}

/* ═══════════════════════════════════════════════════
   Avatar Component
   ═══════════════════════════════════════════════════ */
function Avatar({ name, avatarUrl, initials }) {
    return (
        <div className="tm-avatar">
            <div className="tm-avatar__img-wrap">
                {avatarUrl ? (
                    <img className="tm-avatar__img" src={avatarUrl} alt={`The avatar of ${name}`} />
                ) : (
                    <div className="tm-avatar__initials">{initials}</div>
                )}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   Main TestPage5 Component
   ═══════════════════════════════════════════════════ */
export default function TestPage5() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAll, setSelectedAll] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [isRepeatingShiftsOpen, setIsRepeatingShiftsOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const handleSelectAll = () => {
        if (selectedAll) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(TEAM_MEMBERS.map(m => m.id)));
        }
        setSelectedAll(!selectedAll);
    };

    const handleSelectRow = (id) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
        setSelectedAll(newSet.size === TEAM_MEMBERS.length);
    };

    const filteredMembers = TEAM_MEMBERS.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="tm-root">
            <div className="tm-inner">
                <div className="tm-content">
                    <div className="tm-content-wrapper">
                        <div className="tm-padded-inner">

                            {/* ── Page Header ── */}
                            <div className="tm-header">
                                <div className="tm-header__title-section">
                                    <div className="tm-header__title-wrapper">
                                        <div className="tm-header__title-row">
                                            <h1 className="tm-header__h1">Team members</h1>
                                            <div className="tm-header__badge">
                                                <span>{TEAM_MEMBERS.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="pd-header__subtitle">
                                        Add and manage your team members.{' '}
                                        <a href="#" className="pd-header__learn-more">Learn more</a>
                                    </p>
                                </div>

                                <div className="tm-header__suffix">
                                    <div className="tm-header__buttons">
                                        {/* Options Button (neutral, 48px) */}
                                        <div>
                                            <button type="button" className="tm-btn tm-btn--header" onClick={() => setIsRepeatingShiftsOpen(true)}>
                                                <div className="tm-btn__inner tm-btn__inner--neutral">
                                                    <span className="tm-btn__label--header">
                                                        <span className="tm-btn__text--header">Options</span>
                                                    </span>
                                                    <span className="tm-icon-wrap tm-icon-wrap--24">
                                                        <Icon d={SVG_CHEVRON_DOWN} size={24} />
                                                    </span>
                                                </div>
                                            </button>
                                        </div>

                                        {/* Add Button (primary, 48px) */}
                                        <button type="button" className="tm-btn tm-btn--header" onClick={() => setIsAddMemberOpen(true)}>
                                            <div className="tm-btn__inner tm-btn__inner--primary">
                                                <span className="tm-btn__label--header">
                                                    <span className="tm-btn__text--header tm-btn__text--primary">Add</span>
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>



                            {/* ── Table Section ── */}
                            <div className="tm-table-section">

                                {/* Sticky Header area */}
                                <div className="tm-sticky-header">

                                    {/* Toolbar */}
                                    <div className="tm-toolbar">
                                        <div className="tm-toolbar__inner">
                                            <div className="tm-toolbar__row">
                                                <div className="tm-toolbar__left">
                                                    {/* Search */}
                                                    <div className="tm-search-wrapper">
                                                        <label htmlFor="tm-search-input">
                                                            <span>Search</span>
                                                        </label>
                                                        <div className="tm-search__row">
                                                            <div className="tm-search">
                                                                <div className="tm-search__prefix">
                                                                    <Icon d={SVG_SEARCH} size={20} />
                                                                </div>
                                                                <input
                                                                    id="tm-search-input"
                                                                    type="text"
                                                                    className="tm-search__input"
                                                                    placeholder="Search team members"
                                                                    name="search"
                                                                    value={searchQuery}
                                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Filters Button */}
                                                    <div className="tm-toolbar__filters">
                                                        <button type="button" className="tm-btn tm-btn--toolbar" onClick={() => setIsFilterOpen(true)}>
                                                            <div className="tm-btn__inner tm-btn__inner--neutral">
                                                                <span className="tm-btn__label--toolbar">
                                                                    <span className="tm-btn__text--toolbar">Filters</span>
                                                                </span>
                                                                <span className="tm-icon-wrap tm-icon-wrap--20">
                                                                    <Icon d={SVG_FILTERS} size={20} />
                                                                </span>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="tm-toolbar__right">
                                                    {/* Custom order Button */}
                                                    <div>
                                                        <div>
                                                            <button type="button" className="tm-btn tm-btn--toolbar">
                                                                <div className="tm-btn__inner tm-btn__inner--neutral">
                                                                    <span className="tm-btn__label--toolbar">
                                                                        <span className="tm-btn__text--toolbar">Custom order</span>
                                                                    </span>
                                                                    <span className="tm-icon-wrap tm-icon-wrap--20">
                                                                        <Icon d={SVG_SORT_ORDER} size={20} />
                                                                    </span>
                                                                </div>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Header Table */}
                                    <table className="tm-table">
                                        <colgroup>
                                            <col className="tm-col--checkbox" />
                                            <col className="tm-col--name" />
                                            <col className="tm-col--contact" />
                                            <col className="tm-col--rating" />
                                            <col className="tm-col--actions" />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                {/* Checkbox Column Header */}
                                                <th>
                                                    <Checkbox
                                                        checked={selectedAll}
                                                        onChange={handleSelectAll}
                                                        name="allDisplayedSelected"
                                                    />
                                                </th>

                                                {/* Name Column Header (sortable) */}
                                                <th style={{ cursor: 'pointer' }}>
                                                    <div className="tm-sort-header">
                                                        <div className="tm-sort-btn" role="button" tabIndex={0}>
                                                            <p className="tm-sort-btn__text" style={{ textTransform: 'none', fontSize: 15, fontWeight: 600, color: '#0d0d0d' }}>Name</p>
                                                            <div className="tm-sort-btn__arrow">
                                                                <Icon d={SVG_SORT_INDICATOR} size={20} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </th>

                                                {/* Contact Column Header (non-sortable) */}
                                                <th>
                                                    <div className="tm-sort-header">
                                                        <div>
                                                            <p className="tm-sort-btn__text" style={{ textTransform: 'none', fontSize: 15, fontWeight: 600, color: '#0d0d0d', cursor: 'default' }}>Contact</p>
                                                        </div>
                                                    </div>
                                                </th>

                                                {/* Rating Column Header (sortable) */}
                                                <th style={{ cursor: 'pointer' }}>
                                                    <div className="tm-sort-header">
                                                        <div className="tm-sort-btn" role="button" tabIndex={0}>
                                                            <p className="tm-sort-btn__text" style={{ textTransform: 'none', fontSize: 15, fontWeight: 600, color: '#0d0d0d' }}>Rating</p>
                                                            <div className="tm-sort-btn__arrow">
                                                                <Icon d={SVG_SORT_INDICATOR} size={20} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </th>

                                                {/* 5th Column Header (empty, from el-112) */}
                                                <th className="tm-th-empty"></th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>

                                {/* Body Table */}
                                <table className="tm-table">
                                    <colgroup>
                                        <col className="tm-col--checkbox" />
                                        <col className="tm-col--name" />
                                        <col className="tm-col--contact" />
                                        <col className="tm-col--rating" />
                                        <col className="tm-col--actions" />
                                    </colgroup>
                                    <tbody>
                                        {filteredMembers.map((member) => (
                                            <tr key={member.id} onClick={() => setSelectedMember(member)} style={{ cursor: 'pointer' }}>
                                                {/* Checkbox */}
                                                <td>
                                                    <Checkbox
                                                        checked={selectedIds.has(member.id)}
                                                        onChange={() => handleSelectRow(member.id)}
                                                        name={`select-checkbox-${member.id}`}
                                                    />
                                                </td>

                                                {/* Name Cell */}
                                                <td>
                                                    <div className="tm-name-cell">
                                                        <Avatar
                                                            name={member.name}
                                                            avatarUrl={member.avatarUrl}
                                                            initials={member.initials}
                                                        />
                                                        <div className="tm-name-info">
                                                            {/* el-139: Empty paragraph holder */}
                                                            <p className="tm-name-info__empty"></p>
                                                            {/* el-138/185: Name text */}
                                                            <p className="tm-name-info__name">{member.name}</p>

                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Contact Cell */}
                                                <td>
                                                    <div className="tm-contact-cell">
                                                        <a href={`mailto:${member.email}`} className="tm-contact-link" onClick={(e) => e.stopPropagation()}>
                                                            <p>{member.email}</p>
                                                        </a>
                                                        <a href={`tel:${member.phone}`} className="tm-contact-link" onClick={(e) => e.stopPropagation()}>
                                                            <p>{member.phone}</p>
                                                        </a>
                                                    </div>
                                                </td>

                                                {/* Rating Cell */}
                                                <td>
                                                    <div className="tm-rating-cell">
                                                        <p className="tm-rating-text">{member.rating}</p>
                                                    </div>
                                                </td>

                                                {/* Actions Cell (el-159 → el-168) */}
                                                <td>
                                                    <div className="tm-actions-cell">
                                                        <button type="button" className="tm-actions-btn" onClick={(e) => e.stopPropagation()}>
                                                            <div className="tm-actions-btn__inner">
                                                                <span className="tm-actions-btn__label-wrap">
                                                                    <span className="tm-actions-btn__text">Actions</span>
                                                                </span>
                                                                <span className="tm-actions-btn__icon-wrap">
                                                                    <span className="tm-actions-btn__icon">
                                                                        <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d={SVG_CHEVRON_DOWN} fillRule="evenodd" clipRule="evenodd" />
                                                                        </svg>
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Member Modal */}
            <AddMemberModal
                isOpen={isAddMemberOpen}
                onClose={() => setIsAddMemberOpen(false)}
            />

            {/* Repeating Shifts Modal */}
            <RepeatingShiftsModal
                isOpen={isRepeatingShiftsOpen}
                onClose={() => setIsRepeatingShiftsOpen(false)}
            />

            {/* Member Drawer */}
            <MemberDrawer
                isOpen={!!selectedMember}
                onClose={() => setSelectedMember(null)}
                member={selectedMember}
            />

            {/* Filter Modal */}
            <FilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApply={(filters) => {
                    console.log('Applied filters:', filters);
                    setIsFilterOpen(false);
                }}
                onClear={() => console.log('Filters cleared')}
            />
        </div>
    );
}
