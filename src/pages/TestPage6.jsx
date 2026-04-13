import React, { useState, useRef, useCallback, useMemo } from 'react';
import './TestPage6.css';
import AddCategoryModal from '../components/AddCategoryModal';
import AddServiceModal from './AddServiceModal';

/* ─── SVG Icon Paths ─── */
const ICON_CHEVRON_DOWN = "M9.043 12.293a1 1 0 0 1 1.414 0L16 17.836l5.543-5.543a1 1 0 0 1 1.414 1.414l-6.25 6.25a1 1 0 0 1-1.414 0l-6.25-6.25a1 1 0 0 1 0-1.414";
const ICON_SEARCH = "M14.5 5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19M3 14.5C3 8.149 8.149 3 14.5 3S26 8.149 26 14.5c0 2.816-1.012 5.395-2.692 7.394l5.4 5.399a1 1 0 0 1-1.415 1.414l-5.399-5.399c-2 1.68-4.578 2.692-7.394 2.692C8.149 26 3 20.851 3 14.5";
const ICON_FILTER = "M7 4a1 1 0 0 1 1 1v11h2a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2h2V5a1 1 0 0 1 1-1m9 0a1 1 0 0 1 1 1v5h2a1 1 0 1 1 0 2h-6a1 1 0 1 1 0-2h2V5a1 1 0 0 1 1-1m9 0a1 1 0 0 1 1 1v15h2a1 1 0 1 1 0 2h-6a1 1 0 1 1 0-2h2V5a1 1 0 0 1 1-1m-9 10a1 1 0 0 1 1 1v12a1 1 0 1 1-2 0V15a1 1 0 0 1 1-1m-9 6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1m18 4a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1";
const ICON_MANAGE = "M26.707 10.707a1 1 0 0 1-1.414 0L23 8.414V26a1 1 0 1 1-2 0V8.414l-2.293 2.293a1 1 0 0 1-1.414-1.414l4-4a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414m-12 10.586a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L9 23.586V6a1 1 0 1 1 2 0v17.586l2.293-2.293a1 1 0 0 1 1.414 0";
const ICON_DRAG = "M11.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M20.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M11.5 17.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M20.5 17.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M11.5 26a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M20.5 26a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3";
const ICON_THREE_DOT = "M16 23.333A2.333 2.333 0 1 1 16 28a2.333 2.333 0 0 1 0-4.667M16 13.667a2.333 2.333 0 1 1 0 4.666 2.333 2.333 0 0 1 0-4.666M16 4a2.333 2.333 0 1 1 0 4.667A2.333 2.333 0 0 1 16 4";

/* ─── Initial Data ─── */
const INITIAL_CATEGORIES = [
    {
        id: 'hair-styling',
        name: 'Hair & styling',
        services: [
            { id: 'svc-1', name: 'Haircut', duration: '50min', price: 'TRY 40', color: 'rgb(165, 223, 248)' },
            { id: 'svc-2', name: 'Hair Color', duration: '55min', price: 'TRY 57', color: 'rgb(165, 223, 248)' },
        ]
    },
    {
        id: 'nails',
        name: 'Nails',
        services: [
            { id: 'svc-3', name: 'Manicure', duration: '30min', price: 'TRY 25', color: 'rgb(165, 223, 248)' },
            { id: 'svc-4', name: 'Pedicure', duration: '40min', price: 'TRY 30', color: 'rgb(165, 223, 248)' },
            { id: 'svc-5', name: 'Manicure & Pedicure', duration: '50min', price: 'TRY 45', color: 'rgb(165, 223, 248)' },
        ]
    },
];

const SIDEBAR_ITEMS = [
    { id: 'all', label: 'All categories', count: 5, active: true },
    { id: 'hair-styling', label: 'Hair & styling', count: 2, active: false },
    { id: 'nails', label: 'Nails', count: 3, active: false },
];

/* ─── Heights from JSON ─── */
const HEADER_HEIGHT = 44;      /* el-109: 28px content + 16px padding-bottom */
const CARD_HEIGHT = 108;       /* el-127: 96px card + 12px padding-bottom */
const LAST_CARD_HEIGHT = 128;  /* el-163: 96px card + 32px padding-bottom (extra gap before next cat) */

/* ─── Reusable Icon Component ─── */
function SvgIcon({ d, size = 20, viewBox = "0 0 32 32", fillRule, clipRule }) {
    return (
        <svg viewBox={viewBox} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d={d} fillRule={fillRule || undefined} clipRule={clipRule || undefined} />
        </svg>
    );
}

/* ─── Build flat list from categories ─── */
function buildFlatList(categories) {
    const items = [];
    categories.forEach((cat, catIdx) => {
        items.push({ type: 'header', id: `header-${cat.id}`, name: cat.name, catId: cat.id });
        cat.services.forEach((svc, svcIdx) => {
            const isLastInCategory = svcIdx === cat.services.length - 1;
            const isLastCategory = catIdx === categories.length - 1;
            items.push({
                type: 'card',
                id: svc.id,
                service: svc,
                catId: cat.id,
                isLastInCategory: isLastInCategory && !isLastCategory, // extra padding only if not last category
            });
        });
    });
    return items;
}

/* ─── Calculate Y positions for flat list items ─── */
function computePositions(items) {
    const positions = [];
    let y = 0;
    items.forEach((item, i) => {
        positions.push(y);
        if (item.type === 'header') {
            y += HEADER_HEIGHT;
        } else if (item.type === 'empty') {
            y += LAST_CARD_HEIGHT;
        } else {
            y += item.isLastInCategory ? LAST_CARD_HEIGHT : CARD_HEIGHT;
        }
    });
    return { positions, totalHeight: y };
}

/* ─── Reconstruct categories from flat list ─── */
function flatListToCategories(items) {
    const categories = [];
    let currentCat = null;
    items.forEach(item => {
        if (item.type === 'header') {
            currentCat = { id: item.catId, name: item.name, services: [] };
            categories.push(currentCat);
        } else if (item.type === 'card' && currentCat) {
            currentCat.services.push(item.service);
        }
    });
    return categories;
}

/* ─── Reorder flat list: move a card from one position to another ─── */
function reorderFlatList(items, fromFlatIdx, toFlatIdx) {
    // Only cards can be moved
    if (items[fromFlatIdx]?.type !== 'card') return items;
    if (fromFlatIdx === toFlatIdx) return items;

    const movedItem = items[fromFlatIdx];
    const newItems = items.filter((_, i) => i !== fromFlatIdx);

    let insertIdx;
    if (fromFlatIdx < toFlatIdx) {
        // Dragging DOWN: overIdx means "insert after this card"
        // After removing from, indices shift: original toFlatIdx is now at toFlatIdx-1
        // We want AFTER it, so insert at toFlatIdx-1 + 1 = toFlatIdx
        insertIdx = toFlatIdx;
    } else {
        // Dragging UP: overIdx means "insert before this card"
        // from is after to, so removal doesn't affect to's index
        insertIdx = toFlatIdx;
    }

    // Clamp to valid range
    if (insertIdx > newItems.length) insertIdx = newItems.length;
    if (insertIdx < 1) insertIdx = 1;

    // Note: no header-push needed. After removing the source item, insertIdx
    // naturally falls in the correct position for both UP and DOWN drags.

    newItems.splice(insertIdx, 0, movedItem);
    return recalcLastFlags(newItems);
}

function recalcLastFlags(items) {
    // First: remove any existing empty placeholders
    let result = items.filter(item => item.type !== 'empty').map(item => ({ ...item, isLastInCategory: false }));

    // Set isLastInCategory for the last card before each header
    for (let i = 0; i < result.length; i++) {
        if (result[i].type === 'card') {
            const nextItem = result[i + 1];
            if (!nextItem || nextItem.type === 'header') {
                if (nextItem && nextItem.type === 'header') {
                    result[i].isLastInCategory = true;
                }
            }
        }
    }

    // Insert empty placeholders after headers that have no cards
    const withEmpty = [];
    for (let i = 0; i < result.length; i++) {
        withEmpty.push(result[i]);
        if (result[i].type === 'header') {
            const next = result[i + 1];
            // If next item is another header or end of list, this category is empty
            if (!next || next.type === 'header') {
                withEmpty.push({
                    type: 'empty',
                    id: `empty-${result[i].catId}`,
                    catId: result[i].catId,
                });
            }
        }
    }

    return withEmpty;
}

/* ─── Sortable Content List ─── */
function SortableContentList({ categories, onCategoriesChange }) {
    const [flatList, setFlatList] = useState(() => buildFlatList(categories));
    const [dragState, setDragState] = useState(null);
    const containerRef = useRef(null);
    const dragRef = useRef(null);
    const draggedElRef = useRef(null);   // direct DOM ref for dragged card
    const shadowElRef = useRef(null);    // direct DOM ref for drop shadow

    // Sync flatList when categories change externally
    // (Not needed for internal reorders since we update locally)

    const { positions, totalHeight } = useMemo(() => computePositions(flatList), [flatList]);

    /* ─── Simulated final positions (reorder simulation for exact positions) ─── */
    const activeDragIdx = dragState?.dragIdx ?? null;
    const activeOverIdx = dragState?.overIdx ?? null;

    const { settleTarget, simPosMap } = useMemo(() => {
        if (activeDragIdx == null || activeOverIdx == null || activeDragIdx === activeOverIdx)
            return { settleTarget: null, simPosMap: null };

        const simulatedList = reorderFlatList(flatList, activeDragIdx, activeOverIdx);

        // Filter: only keep items that exist in the CURRENT flatList.
        // This prevents phantom gaps from new empties created by recalcLastFlags.
        const currentIds = new Set(flatList.map(item => item.id));
        const filteredSim = simulatedList.filter(item => currentIds.has(item.id));
        const { positions: newPos } = computePositions(filteredSim);

        // Build map: item.id → final position
        const map = {};
        filteredSim.forEach((item, i) => { map[item.id] = newPos[i]; });

        // Items in current flatList that were REMOVED in simulation (e.g., old empties):
        // collapse them to their category header's position so they visually disappear
        const simIds = new Set(simulatedList.map(item => item.id));
        flatList.forEach((item) => {
            if (!simIds.has(item.id) && item.type === 'empty') {
                const headerKey = `header-${item.catId}`;
                if (map[headerKey] != null) {
                    map[item.id] = map[headerKey]; // collapse onto header
                }
            }
        });

        const draggedId = flatList[activeDragIdx].id;
        const target = map[draggedId];
        return {
            settleTarget: target ?? positions[activeDragIdx],
            simPosMap: map,
        };
    }, [activeDragIdx, activeOverIdx, flatList, positions]);

    /* ─── Store settleTarget in ref so pointerUp can access latest ─── */
    const settleTargetRef = useRef(null);
    settleTargetRef.current = settleTarget;

    /* ─── Drag Handlers ─── */
    const handlePointerDown = useCallback((e, flatIdx) => {
        if (e.button !== 0) return;
        if (flatList[flatIdx]?.type !== 'card') return;
        e.preventDefault();
        e.stopPropagation();

        const pos = positions[flatIdx];
        dragRef.current = {
            startY: e.clientY,
            startFlatIdx: flatIdx,
            currentFlatIdx: flatIdx,
            offsetY: 0,
            originalPos: pos,
        };

        setDragState({
            dragIdx: flatIdx,
            overIdx: flatIdx,
            offsetY: 0,
        });

        e.target.setPointerCapture?.(e.pointerId);
    }, [flatList, positions]);

    const handlePointerMove = useCallback((e) => {
        if (!dragRef.current) return;
        e.preventDefault();

        const ref = dragRef.current;
        const dy = e.clientY - ref.startY;
        ref.offsetY = dy;

        // ── PERF: Update dragged card position directly via DOM (bypass React) ──
        if (draggedElRef.current) {
            const newY = ref.originalPos + dy;
            draggedElRef.current.style.transform = `translateY(${newY}px)`;
        }

        // Calculate overIdx
        const draggedCenterY = ref.originalPos + (CARD_HEIGHT / 2) + dy;
        const startIdx = ref.startFlatIdx;
        let overIdx = startIdx;

        if (dy > 0) {
            for (let i = startIdx + 1; i < flatList.length; i++) {
                const h = flatList[i].type === 'header' ? HEADER_HEIGHT
                    : flatList[i].type === 'empty' ? LAST_CARD_HEIGHT
                        : (flatList[i].isLastInCategory ? LAST_CARD_HEIGHT : CARD_HEIGHT);
                const centerY = positions[i] + h / 2;
                if (draggedCenterY > centerY) {
                    overIdx = i;
                } else {
                    break;
                }
            }
            if (flatList[overIdx]?.type === 'header' && overIdx + 1 < flatList.length && flatList[overIdx + 1]?.type === 'empty') {
                overIdx = overIdx + 1;
            }
        } else if (dy < 0) {
            for (let i = startIdx - 1; i >= 0; i--) {
                const h = flatList[i].type === 'header' ? HEADER_HEIGHT
                    : flatList[i].type === 'empty' ? LAST_CARD_HEIGHT
                        : (flatList[i].isLastInCategory ? LAST_CARD_HEIGHT : CARD_HEIGHT);
                const centerY = positions[i] + h / 2;
                if (draggedCenterY < centerY) {
                    overIdx = i;
                } else {
                    break;
                }
            }
            if (flatList[overIdx]?.type === 'header' && overIdx - 1 >= 0 && flatList[overIdx - 1]?.type === 'empty') {
                overIdx = overIdx - 1;
            }
        }

        // ── PERF: Only trigger React re-render when overIdx ACTUALLY changes ──
        if (overIdx !== ref.currentFlatIdx) {
            ref.currentFlatIdx = overIdx;
            setDragState({
                dragIdx: startIdx,
                overIdx: overIdx,
                offsetY: dy,
            });
        }
    }, [flatList, positions]);

    const handlePointerUp = useCallback((e) => {
        if (!dragRef.current) return;
        e.preventDefault();

        const ref = dragRef.current;
        const from = ref.startFlatIdx;
        const to = ref.currentFlatIdx;

        // ── Settle animation: move dragged card to target via DOM ──
        const target = settleTargetRef.current ?? positions[from];
        if (draggedElRef.current) {
            draggedElRef.current.style.transition = 'transform 0.25s cubic-bezier(0.2, 0, 0, 1)';
            draggedElRef.current.style.transform = `translateY(${target}px)`;
        }

        dragRef.current = null;

        setDragState(prev => prev ? { ...prev, settling: true } : null);

        setTimeout(() => {
            // Clean up direct DOM styles
            if (draggedElRef.current) {
                draggedElRef.current.style.transition = '';
                draggedElRef.current = null;
            }
            if (from !== to) {
                const newList = reorderFlatList(flatList, from, to);
                setFlatList(newList);
                onCategoriesChange(flatListToCategories(newList));
            }
            setDragState(null);
        }, 250);
    }, [flatList, onCategoriesChange, positions]);

    /* ─── Position calculation for each item during drag ─── */
    const getItemTransform = useCallback((flatIdx) => {
        if (!dragState) {
            return {
                y: positions[flatIdx],
                transition: 'transform 0.25s cubic-bezier(0.2, 0, 0, 1)',
                zIndex: 1,
                isDragging: false,
            };
        }

        const { dragIdx, offsetY } = dragState;

        // Dragged card: position managed by DOM ref, but we still need
        // to provide initial values for the render
        if (flatIdx === dragIdx) {
            if (dragState.settling) {
                return {
                    y: settleTarget ?? positions[dragIdx],
                    transition: 'transform 0.25s cubic-bezier(0.2, 0, 0, 1)',
                    zIndex: 100,
                    isDragging: false,
                };
            }
            return {
                y: positions[flatIdx] + offsetY,
                transition: 'none',
                zIndex: 100,
                isDragging: true,
            };
        }

        // All other items: use simulated final position if available
        const item = flatList[flatIdx];
        const finalY = simPosMap?.[item.id];

        return {
            y: finalY ?? positions[flatIdx],
            transition: 'transform 0.25s cubic-bezier(0.2, 0, 0, 1)',
            zIndex: 1,
            isDragging: false,
        };
    }, [dragState, flatList, positions, settleTarget, simPosMap]);

    return (
        <div
            ref={containerRef}
            className={`tp6-sortable-container${dragState ? ' tp6-is-dragging' : ''}`}
            style={{ height: `${totalHeight}px` }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
        >
            {/* Drop-target shadow */}
            {dragState && (() => {
                const { dragIdx, overIdx } = dragState;
                const shadowY = settleTarget ?? positions[dragIdx];
                return (
                    <div
                        ref={shadowElRef}
                        className="tp6-drop-target-shadow"
                        style={{
                            position: 'absolute',
                            left: 0,
                            width: '760px',
                            height: '96px',
                            transform: `translateY(${shadowY}px)`,
                            transition: dragIdx === overIdx
                                ? 'none'
                                : 'transform 0.25s cubic-bezier(0.2, 0, 0, 1)',
                            zIndex: 0,
                        }}
                    />
                );
            })()}
            {flatList.map((item, idx) => {
                const transform = getItemTransform(idx);
                const itemHeight = item.type === 'header' ? HEADER_HEIGHT :
                    (item.isLastInCategory ? LAST_CARD_HEIGHT : CARD_HEIGHT);

                if (item.type === 'header') {
                    return (
                        <div
                            key={item.id}
                            className="tp6-flat-item tp6-flat-header"
                            style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                width: '760px',
                                height: `${itemHeight}px`,
                                transform: `translateY(${transform.y}px)`,
                                transition: transform.transition,
                                zIndex: transform.zIndex,
                            }}
                        >
                            <div className="tp6-cat-section-header">
                                <div className="tp6-cat-section-header-area" role="button" tabIndex={0}>
                                    <div className="tp6-cat-header-row">
                                        <div className="tp6-cat-header-inner">
                                            <div className="tp6-cat-header-content">
                                                <div className="tp6-cat-header-left">
                                                    <div className="tp6-cat-header-title-row">
                                                        <p className="tp6-cat-header-title">{item.name}</p>
                                                    </div>
                                                </div>
                                                <div className="tp6-cat-actions-wrap">
                                                    <div>
                                                        <button className="tp6-cat-actions-btn" type="button">
                                                            <div className="tp6-cat-actions-pill">
                                                                <span className="tp6-cat-actions-content">
                                                                    <span className="tp6-cat-actions-label">Actions</span>
                                                                </span>
                                                                <span className="tp6-cat-actions-icon-wrap">
                                                                    <span className="tp6-cat-actions-icon-inner">
                                                                        <SvgIcon d={ICON_CHEVRON_DOWN} fillRule="evenodd" clipRule="evenodd" />
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
                            </div>
                        </div>
                    );
                }

                /* ─── Empty Category Placeholder ─── */
                if (item.type === 'empty') {
                    const isDropTarget = dragState && dragState.overIdx === idx;
                    return (
                        <div
                            key={item.id}
                            className="tp6-flat-item tp6-flat-empty"
                            style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                width: '760px',
                                height: '96px',
                                transform: `translateY(${transform.y}px)`,
                                transition: transform.transition,
                                zIndex: transform.zIndex,
                                opacity: isDropTarget ? 0 : 1,
                            }}
                        >
                            <div className="tp6-empty-category">
                                <span className="tp6-empty-category-text">No services</span>
                            </div>
                        </div>
                    );
                }

                /* ─── Card Item ─── */
                const svc = item.service;
                return (
                    <div
                        key={item.id}
                        ref={transform.isDragging ? (el) => { draggedElRef.current = el; } : undefined}
                        className={`tp6-flat-item tp6-flat-card${transform.isDragging ? ' tp6-dragging' : ''}`}
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            width: '760px',
                            height: `${itemHeight}px`,
                            paddingBottom: item.isLastInCategory ? '32px' : '12px',
                            transform: `translateY(${transform.y}px)`,
                            transition: transform.transition,
                            zIndex: transform.zIndex,
                        }}
                    >
                        <div className="tp6-card-drag-row" role="button" tabIndex={0}>
                            <div className="tp6-card-drag-container">
                                {/* Drag handle */}
                                <div
                                    className="tp6-drag-handle"
                                    onPointerDown={(e) => handlePointerDown(e, idx)}
                                >
                                    <span className="tp6-drag-handle-icon">
                                        <SvgIcon d={ICON_DRAG} size={28} />
                                    </span>
                                </div>

                                {/* Card body */}
                                <div className="tp6-card-body-wrap">
                                    <div className="tp6-card-body-inner">
                                        <div className="tp6-card">
                                            <button className="tp6-card-btn" type="button" tabIndex={-1} aria-label={svc.name}></button>
                                            <div className="tp6-card-color-bar-wrap">
                                                <div className="tp6-card-color-bar" style={{ backgroundColor: svc.color }}></div>
                                            </div>
                                            <div className="tp6-card-content">
                                                <div className="tp6-card-info">
                                                    <p className="tp6-card-title">{svc.name}</p>
                                                    <p className="tp6-card-subtitle">{svc.duration}</p>
                                                </div>
                                                <div className="tp6-card-right">
                                                    <div className="tp6-card-price-wrap">
                                                        <span className="tp6-card-price">
                                                            <bdi>{svc.price}</bdi>
                                                        </span>
                                                    </div>
                                                    <div className="tp6-card-menu-wrap">
                                                        <button className="tp6-card-menu-btn" type="button">
                                                            <div className="tp6-card-menu-btn-face">
                                                                <span className="tp6-card-menu-icon">
                                                                    <SvgIcon d={ICON_THREE_DOT} />
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
                    </div>
                );
            })}
        </div>
    );
}

/* ─── Main Component ─── */
export default function TestPage6() {
    const [categories, setCategories] = useState(INITIAL_CATEGORIES);
    const [addCatOpen, setAddCatOpen] = useState(false);
    const [addMemberOpen, setAddMemberOpen] = useState(false);

    const handleCategoriesChange = useCallback((newCats) => {
        setCategories(newCats);
    }, []);

    const handleAddCategory = useCallback((data) => {
        console.log('Add category:', data);
        setAddCatOpen(false);
    }, []);

    return (
        <div className="tp6-root"> {/* el-0 */}
            <div className="tp6-bg-wrapper"> {/* el-1 */}
                <div className="tp6-bg-overlay"></div> {/* el-2 */}
                <div className="tp6-main"> {/* el-3 */}
                    <div className="tp6-center-wrapper"> {/* el-4 */}
                        <div className="tp6-padded"> {/* el-5 */}
                            <div className="tp6-grid-outer"> {/* el-6 — CSS Grid */}

                                {/* ─── HEADER (el-7 → el-34) — grid-area: title ─── */}
                                <div className="tp6-header"> {/* el-7 */}
                                    <div className="tp6-header-inner"> {/* el-8 */}
                                        <div className="tp6-header-left"> {/* el-9 */}
                                            <div className="tp6-title-row"> {/* el-10 */}
                                                <p className="tp6-title">Service menu</p> {/* el-11 */}
                                            </div>
                                            <p className="tp6-desc"> {/* el-12 */}
                                                View and manage the services offered by your business.{' '}
                                                <a className="tp6-learn-more" href="#"> {/* el-13 */}
                                                    Learn more
                                                </a>
                                            </p>
                                        </div>

                                        <div className="tp6-actions-row"> {/* el-14 */}
                                            <div className="tp6-actions-group"> {/* el-15 */}
                                                <div className="tp6-options-wrapper"> {/* el-16 */}
                                                    <button className="tp6-btn-options" type="button"> {/* el-17 */}
                                                        <div className="tp6-btn-options-pill"> {/* el-18 */}
                                                            <span className="tp6-btn-options-inner"> {/* el-19 */}
                                                                <span className="tp6-btn-options-label">Options</span> {/* el-20 */}
                                                            </span>
                                                            <span className="tp6-btn-options-icon-wrap"> {/* el-21 */}
                                                                <span className="tp6-btn-options-icon-inner"> {/* el-22 */}
                                                                    <SvgIcon d={ICON_CHEVRON_DOWN} fillRule="evenodd" clipRule="evenodd" />
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </button>
                                                </div>

                                                <div className="tp6-add-wrapper"> {/* el-25 */}
                                                    <div className="tp6-add-wrapper-inner"> {/* el-26 */}
                                                        <button className="tp6-btn-add" type="button" aria-label="Add" onClick={() => setAddMemberOpen(true)}> {/* el-27 */}
                                                            <div className="tp6-btn-add-pill"> {/* el-28 */}
                                                                <span className="tp6-btn-add-inner"> {/* el-29 */}
                                                                    <span className="tp6-btn-add-label">Add</span> {/* el-30 */}
                                                                </span>
                                                                <span className="tp6-btn-add-icon-wrap"> {/* el-31 */}
                                                                    <span className="tp6-btn-add-icon-inner"> {/* el-32 */}
                                                                        <SvgIcon d={ICON_CHEVRON_DOWN} fillRule="evenodd" clipRule="evenodd" />
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

                                {/* ─── CONTENT AREA (el-35 → el-325) — grid-area: content ─── */}
                                <div className="tp6-content-area"> {/* el-35 */}
                                    <div className="tp6-two-col-grid"> {/* el-36 */}

                                        {/* ─── SEARCH ROW ─── */}
                                        <div className="tp6-search-row"> {/* el-37 */}
                                            <div className="tp6-search-container"> {/* el-38 */}
                                                <div className="tp6-search-bar"> {/* el-39 */}
                                                    <div className="tp6-search-bar-border"></div>
                                                    <div className="tp6-search-bar-inner"> {/* el-41 */}
                                                        <div className="tp6-search-row-inner"> {/* el-42 */}
                                                            <div className="tp6-search-left"> {/* el-43 */}
                                                                <div className="tp6-search-input-group"> {/* el-44 */}
                                                                    <div className="tp6-search-input-wrap"> {/* el-48 */}
                                                                        <div className="tp6-search-icon-area">
                                                                            <span className="tp6-search-icon-outer">
                                                                                <SvgIcon d={ICON_SEARCH} fillRule="evenodd" clipRule="evenodd" />
                                                                            </span>
                                                                        </div>
                                                                        <input
                                                                            className="tp6-search-input"
                                                                            type="text"
                                                                            placeholder="Search service name"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <button className="tp6-pill-btn" type="button">
                                                                    <div className="tp6-pill-btn-face">
                                                                        <span className="tp6-pill-btn-content">
                                                                            <span className="tp6-pill-btn-label">Filters</span>
                                                                        </span>
                                                                        <span className="tp6-pill-btn-icon-wrap">
                                                                            <span className="tp6-pill-btn-icon-inner">
                                                                                <SvgIcon d={ICON_FILTER} fillRule="evenodd" clipRule="evenodd" />
                                                                            </span>
                                                                        </span>
                                                                    </div>
                                                                </button>
                                                            </div>

                                                            <div className="tp6-manage-order-wrap">
                                                                <button className="tp6-pill-btn" type="button">
                                                                    <div className="tp6-pill-btn-face">
                                                                        <span className="tp6-pill-btn-icon-wrap">
                                                                            <span className="tp6-pill-btn-icon-inner">
                                                                                <SvgIcon d={ICON_MANAGE} fillRule="evenodd" clipRule="evenodd" />
                                                                            </span>
                                                                        </span>
                                                                        <span className="tp6-pill-btn-content">
                                                                            <span className="tp6-pill-btn-label">Manage order</span>
                                                                        </span>
                                                                    </div>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ─── SIDEBAR ─── */}
                                        <div className="tp6-sidebar"> {/* el-70 */}
                                            <div className="tp6-sidebar-inner">
                                                <div className="tp6-sidebar-card">
                                                    <div className="tp6-sidebar-card-border"></div>
                                                    <div className="tp6-sidebar-padding">
                                                        <ul className="tp6-sidebar-list-group">
                                                            <li className="tp6-sidebar-list-item">
                                                                <span className="tp6-sidebar-header">
                                                                    <span className="tp6-sidebar-header-inner">
                                                                        <span className="tp6-sidebar-header-title">Categories</span>
                                                                    </span>
                                                                </span>

                                                                <ul className="tp6-cat-list">
                                                                    {SIDEBAR_ITEMS.map((item) => (
                                                                        <li
                                                                            key={item.id}
                                                                            className={`tp6-cat-item ${item.active ? 'active' : ''}`}
                                                                        >
                                                                            <button className="tp6-cat-item-btn" type="button" tabIndex={0}></button>
                                                                            <span className="tp6-cat-item-text-wrap">
                                                                                <span className="tp6-cat-item-text-inner">
                                                                                    <span className="tp6-cat-item-text">{item.label}</span>
                                                                                </span>
                                                                            </span>
                                                                            <div className="tp6-cat-item-count">
                                                                                <span className="tp6-cat-item-count-text">{item.count}</span>
                                                                            </div>
                                                                        </li>
                                                                    ))}

                                                                    <li className="tp6-add-cat-item">
                                                                        <button className="tp6-add-cat-item-btn" type="button" tabIndex={0} onClick={() => setAddCatOpen(true)}></button>
                                                                        <span className="tp6-add-cat-text-wrap">
                                                                            <span className="tp6-add-cat-text-inner">
                                                                                <span className="tp6-add-cat-text">Add category</span>
                                                                            </span>
                                                                        </span>
                                                                    </li>
                                                                </ul>

                                                                <div className="tp6-hidden" aria-hidden="true"></div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ─── CONTENT (el-106 → el-325) ─── */}
                                        <div className="tp6-content"> {/* el-106 */}
                                            <div className="tp6-content-scroll-outer"> {/* el-107 */}
                                                <div className="tp6-content-scroll"> {/* el-108 */}
                                                    <SortableContentList
                                                        categories={categories}
                                                        onCategoriesChange={handleCategoriesChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="tp6-hidden"></div> {/* el-325 */}
            <AddCategoryModal
                open={addCatOpen}
                onClose={() => setAddCatOpen(false)}
                onAdd={handleAddCategory}
            />
            <AddServiceModal
                isOpen={addMemberOpen}
                onClose={() => setAddMemberOpen(false)}
            />
        </div>
    );
}
