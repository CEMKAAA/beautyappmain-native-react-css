import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { ToastContainer, useToast } from '../components/Toast';
import './WorkingHours.css';

const DAY_NAMES = ['', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const DAY_SHORT = ['', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const DEFAULT_BREAK_NAME = 'Öğle Arası';


export default function WorkingHours() {
    const { tenantUser } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toasts, addToast, dismissToast } = useToast();

    const [days, setDays] = useState([]);
    const [breakGroups, setBreakGroups] = useState([]);
    const [deletedBreakIds, setDeletedBreakIds] = useState([]);

    // Collapse state
    const [collapsedSections, setCollapsedSections] = useState({});

    const toggleCollapse = (sectionKey) => {
        setCollapsedSections((prev) => ({
            ...prev,
            [sectionKey]: !prev[sectionKey],
        }));
    };


    useEffect(() => {
        if (tenantUser?.tenant_id) loadData();
    }, [tenantUser]);

    // ─── Load ───
    const loadData = async () => {
        try {
            const { data: branch } = await supabase
                .from('branches')
                .select('id')
                .eq('tenant_id', tenantUser.tenant_id)
                .limit(1)
                .single();

            if (!branch) {
                addToast('error', 'Şube bulunamadı.');
                setLoading(false);
                return;
            }

            const { data: whData, error: whError } = await supabase
                .from('branch_working_hours')
                .select('*, branch_breaks(*)')
                .eq('branch_id', branch.id)
                .eq('schedule_type', 'always')
                .order('day_of_week');

            if (whError) {
                addToast('error', 'Çalışma saatleri yüklenemedi.');
                setLoading(false);
                return;
            }

            const formattedDays = (whData || []).map((wh) => ({
                id: wh.id,
                day_of_week: wh.day_of_week,
                is_open: wh.is_open,
                open_time: wh.open_time ? wh.open_time.slice(0, 5) : '09:00',
                close_time: wh.close_time ? wh.close_time.slice(0, 5) : '19:00',
            }));
            setDays(formattedDays);

            const allBreaks = [];
            (whData || []).forEach((wh) => {
                (wh.branch_breaks || []).forEach((b) => {
                    allBreaks.push({
                        id: b.id,
                        wh_id: wh.id,
                        day_of_week: wh.day_of_week,
                        is_active: b.is_active,
                        break_start: b.break_start ? b.break_start.slice(0, 5) : '12:00',
                        break_end: b.break_end ? b.break_end.slice(0, 5) : '13:00',
                        break_name: b.break_name || DEFAULT_BREAK_NAME,
                        is_default: b.is_default || false,
                        isNew: false,
                    });
                });
            });

            const groupMap = {};
            allBreaks.forEach((b) => {
                if (!groupMap[b.break_name]) {
                    groupMap[b.break_name] = {
                        name: b.break_name,
                        key: b.break_name,
                        breaks: [],
                        isDefault: b.is_default,
                    };
                }
                groupMap[b.break_name].breaks.push(b);
            });

            Object.values(groupMap).forEach((g) => {
                g.breaks.sort((a, b) => a.day_of_week - b.day_of_week);
            });

            setBreakGroups(Object.values(groupMap));
        } catch (err) {
            console.error('loadData error:', err);
            addToast('error', 'Veriler yüklenirken hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    // ─── Day Handlers ───
    const updateDay = (dayOfWeek, field, value) => {
        setDays((prev) =>
            prev.map((d) =>
                d.day_of_week === dayOfWeek ? { ...d, [field]: value } : d
            )
        );

        if (field === 'is_open') {
            setBreakGroups((prev) =>
                prev.map((g) => ({
                    ...g,
                    breaks: g.breaks.map((b) =>
                        b.day_of_week === dayOfWeek
                            ? { ...b, is_active: value }
                            : b
                    ),
                }))
            );
            addToast('info', `${DAY_NAMES[dayOfWeek]} ${value ? 'açıldı — molalar aktif edildi' : 'kapatıldı — molalar pasif edildi'}`, 2500);
        }
    };

    // ─── Break Group Handlers ───
    const updateBreakGroupName = (groupKey, newName) => {
        setBreakGroups((prev) =>
            prev.map((g) =>
                g.key === groupKey ? { ...g, name: newName } : g
            )
        );
    };

    const updateBreakInGroup = (groupKey, dayOfWeek, field, value) => {
        setBreakGroups((prev) =>
            prev.map((g) =>
                g.key === groupKey
                    ? {
                        ...g,
                        breaks: g.breaks.map((b) =>
                            b.day_of_week === dayOfWeek
                                ? { ...b, [field]: value }
                                : b
                        ),
                    }
                    : g
            )
        );
    };

    const addBreakGroup = () => {
        const newKey = `new-${Date.now()}`;
        const newBreaks = days.map((d) => ({
            id: `temp-${d.day_of_week}-${Date.now()}`,
            wh_id: d.id,
            day_of_week: d.day_of_week,
            is_active: d.is_open,
            break_start: '15:00',
            break_end: '15:30',
            break_name: '',
            isNew: true,
        }));

        setBreakGroups((prev) => [
            ...prev,
            { name: '', key: newKey, breaks: newBreaks, isNew: true, isDefault: false },
        ]);
        addToast('info', 'Yeni mola eklendi — isim vermeyi unutmayın!', 3000);
    };

    const removeBreakGroup = (groupKey) => {
        const group = breakGroups.find((g) => g.key === groupKey);
        if (!group) return;

        // Öğle Arası silinemez
        if (group.isDefault) {
            addToast('warning', `"${DEFAULT_BREAK_NAME}" silinemez. Kapatmak için toggle kullanabilirsiniz.`, 4000);
            return;
        }

        const existingIds = group.breaks.filter((b) => !b.isNew).map((b) => b.id);
        if (existingIds.length > 0) {
            setDeletedBreakIds((prev) => [...prev, ...existingIds]);
        }
        setBreakGroups((prev) => prev.filter((g) => g.key !== groupKey));
        addToast('info', `"${group.name || 'İsimsiz mola'}" silindi`, 2500);
    };

    // ─── Validation ───
    const timeToMinutes = (t) => {
        if (!t) return 0;
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    };

    const validate = () => {
        for (const day of days) {
            if (!day.is_open) continue;
            const open = timeToMinutes(day.open_time);
            const close = timeToMinutes(day.close_time);
            if (open >= close) {
                return `${DAY_NAMES[day.day_of_week]}: Açılış saati kapanıştan önce olmalı`;
            }
        }

        for (const group of breakGroups) {
            if (!group.name.trim()) {
                return 'Tüm molalara isim verilmelidir';
            }
        }

        for (const group of breakGroups) {
            for (const brk of group.breaks) {
                if (!brk.is_active) continue;
                const day = days.find((d) => d.day_of_week === brk.day_of_week);
                if (!day || !day.is_open) continue;

                const bs = timeToMinutes(brk.break_start);
                const be = timeToMinutes(brk.break_end);

                if (bs >= be) {
                    return `${group.name} — ${DAY_NAMES[brk.day_of_week]}: Mola başlangıcı bitişten önce olmalı`;
                }
                if (be - bs < 5) {
                    return `${group.name} — ${DAY_NAMES[brk.day_of_week]}: Mola en az 5 dakika olmalı`;
                }

                const dayOpen = timeToMinutes(day.open_time);
                const dayClose = timeToMinutes(day.close_time);
                if (bs < dayOpen || be > dayClose) {
                    return `${group.name} — ${DAY_NAMES[brk.day_of_week]}: Mola çalışma saatleri (${day.open_time}–${day.close_time}) içinde olmalı`;
                }
            }
        }

        for (let d = 1; d <= 7; d++) {
            const dayBreaks = [];
            for (const group of breakGroups) {
                const brk = group.breaks.find((b) => b.day_of_week === d);
                if (brk && brk.is_active) {
                    dayBreaks.push({ name: group.name, start: timeToMinutes(brk.break_start), end: timeToMinutes(brk.break_end) });
                }
            }
            dayBreaks.sort((a, b) => a.start - b.start);
            for (let i = 0; i < dayBreaks.length - 1; i++) {
                if (dayBreaks[i].end > dayBreaks[i + 1].start) {
                    return `${DAY_NAMES[d]}: "${dayBreaks[i].name}" ve "${dayBreaks[i + 1].name}" molaları çakışıyor`;
                }
            }
        }

        return null;
    };

    // ─── Save ───
    const handleSave = async () => {
        const validationError = validate();
        if (validationError) {
            addToast('error', validationError, 5000);
            return;
        }

        setSaving(true);
        try {
            if (deletedBreakIds.length > 0) {
                const { error: delErr } = await supabase
                    .from('branch_breaks')
                    .delete()
                    .in('id', deletedBreakIds);

                if (delErr) {
                    addToast('error', 'Mola silinirken hata: ' + delErr.message);
                    setSaving(false);
                    return;
                }
            }

            for (const day of days) {
                const { error: whErr } = await supabase
                    .from('branch_working_hours')
                    .update({
                        is_open: day.is_open,
                        open_time: day.is_open ? day.open_time : null,
                        close_time: day.is_open ? day.close_time : null,
                    })
                    .eq('id', day.id);

                if (whErr) {
                    addToast('error', `${DAY_NAMES[day.day_of_week]} güncellenemedi.`);
                    setSaving(false);
                    return;
                }
            }

            for (const group of breakGroups) {
                for (const brk of group.breaks) {
                    const payload = {
                        is_active: brk.is_active,
                        break_start: brk.is_active ? brk.break_start : null,
                        break_end: brk.is_active ? brk.break_end : null,
                        break_name: group.name.trim(),
                    };

                    if (brk.isNew) {
                        const { error: insErr } = await supabase
                            .from('branch_breaks')
                            .insert({ working_hours_id: brk.wh_id, ...payload });
                        if (insErr) {
                            addToast('error', `${group.name} — mola eklenemedi: ${insErr.message}`);
                            setSaving(false);
                            return;
                        }
                    } else {
                        const { error: updErr } = await supabase
                            .from('branch_breaks')
                            .update(payload)
                            .eq('id', brk.id);
                        if (updErr) {
                            addToast('error', `${group.name} — mola güncellenemedi.`);
                            setSaving(false);
                            return;
                        }
                    }
                }
            }

            addToast('success', 'Çalışma saatleri başarıyla güncellendi!');
            setDeletedBreakIds([]);
            await loadData();
        } catch (err) {
            addToast('error', 'Bir hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    // ─── Render ───
    if (loading) {
        return (
            <div className="loading-screen" style={{ minHeight: 'auto', padding: '80px 0' }}>
                <div className="loading-spinner" />
                <p>Yükleniyor...</p>
            </div>
        );
    }

    const openDayCount = days.filter((d) => d.is_open).length;
    const activeBreakCount = breakGroups.filter((g) => g.breaks.some((b) => b.is_active)).length;

    return (
        <div className="working-hours">
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />

            <div className="page-header">
                <button className="back-btn" onClick={() => navigate('/settings')}>← Ayarlara Dön</button>
                <h1>🕐 Çalışma Saatleri</h1>
                <p className="text-muted">Haftalık çalışma saatlerinizi ve molaları düzenleyin</p>
            </div>

            {/* ═══ KART 1: Çalışma Günleri ═══ */}
            <div className="wh-section-card">
                <div className="wh-section-header wh-section-header--clickable" onClick={() => toggleCollapse('days')}>
                    <div className="wh-section-title">
                        <span className="wh-section-icon">📆</span>
                        <div>
                            <h2>Çalışma Günleri</h2>
                            <p>{openDayCount} gün açık</p>
                        </div>
                    </div>
                    <span className={`wh-collapse-arrow ${collapsedSections['days'] ? 'wh-collapse-arrow--collapsed' : ''}`}>▼</span>
                </div>

                {!collapsedSections['days'] && (
                    <div className="wh-rows wh-rows--animated">
                        {days.map((day) => (
                            <div key={day.day_of_week} className={`wh-row ${!day.is_open ? 'wh-row--closed' : ''}`}>
                                <div className="wh-row-left">
                                    <span className="wh-day-badge">{DAY_SHORT[day.day_of_week]}</span>
                                    <span className="wh-day-name">{DAY_NAMES[day.day_of_week]}</span>
                                </div>
                                <div className="wh-row-center">
                                    {day.is_open ? (
                                        <div className="wh-time-pair">
                                            <input
                                                type="time"
                                                className="wh-time-input"
                                                value={day.open_time}
                                                onChange={(e) => updateDay(day.day_of_week, 'open_time', e.target.value)}
                                            />
                                            <span className="wh-sep">—</span>
                                            <input
                                                type="time"
                                                className="wh-time-input"
                                                value={day.close_time}
                                                onChange={(e) => updateDay(day.day_of_week, 'close_time', e.target.value)}
                                            />
                                        </div>
                                    ) : (
                                        <span className="wh-closed-text">Kapalı</span>
                                    )}
                                </div>
                                <div className="wh-row-right">
                                    <label className="wh-toggle" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={day.is_open}
                                            onChange={(e) => updateDay(day.day_of_week, 'is_open', e.target.checked)}
                                        />
                                        <span className="wh-toggle-slider" />
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ═══ MOLA KARTLARI ═══ */}
            {breakGroups.map((group, gIdx) => {
                const sectionKey = `break-${group.key}`;
                const isCollapsed = collapsedSections[sectionKey];
                const activeDays = group.breaks.filter((b) => b.is_active).length;
                const isDefault = group.isDefault;

                return (
                    <div key={group.key} className={`wh-section-card wh-section-card--break ${isDefault ? 'wh-section-card--default' : ''}`}>
                        <div className="wh-section-header wh-section-header--clickable" onClick={() => toggleCollapse(sectionKey)}>
                            <div className="wh-section-title">
                                <span className="wh-section-icon wh-section-icon--break">
                                    {isDefault ? '🍽️' : '☕'}
                                </span>
                                <div className="wh-break-name-wrap" onClick={(e) => e.stopPropagation()}>
                                    <input
                                        type="text"
                                        className="wh-break-name-input"
                                        value={group.name}
                                        onChange={(e) => updateBreakGroupName(group.key, e.target.value)}
                                        placeholder="Mola ismi..."
                                        maxLength={50}
                                        readOnly={isDefault}
                                    />
                                    <p>{activeDays} gün aktif</p>
                                </div>
                            </div>
                            <div className="wh-section-header-actions" onClick={(e) => e.stopPropagation()}>
                                {!isDefault && (
                                    <button
                                        type="button"
                                        className="wh-delete-group-btn"
                                        onClick={() => removeBreakGroup(group.key)}
                                        title="Bu molayı sil"
                                    >
                                        🗑️ Sil
                                    </button>
                                )}
                                {isDefault && (
                                    <span className="wh-default-badge">Varsayılan</span>
                                )}
                            </div>
                            <span className={`wh-collapse-arrow ${isCollapsed ? 'wh-collapse-arrow--collapsed' : ''}`}>▼</span>
                        </div>

                        {!isCollapsed && (
                            <div className="wh-rows wh-rows--animated">
                                {group.breaks.map((brk) => {
                                    const day = days.find((d) => d.day_of_week === brk.day_of_week);
                                    const dayOpen = day?.is_open ?? false;
                                    return (
                                        <div key={brk.day_of_week} className={`wh-row ${!dayOpen ? 'wh-row--day-closed' : ''} ${!brk.is_active ? 'wh-row--closed' : ''}`}>
                                            <div className="wh-row-left">
                                                <span className="wh-day-badge wh-day-badge--break">{DAY_SHORT[brk.day_of_week]}</span>
                                                <span className="wh-day-name">{DAY_NAMES[brk.day_of_week]}</span>
                                                {!dayOpen && <span className="wh-day-closed-tag">Gün kapalı</span>}
                                            </div>
                                            <div className="wh-row-center">
                                                {brk.is_active && dayOpen ? (
                                                    <div className="wh-time-pair">
                                                        <input
                                                            type="time"
                                                            className="wh-time-input wh-time-input--break"
                                                            value={brk.break_start}
                                                            onChange={(e) => updateBreakInGroup(group.key, brk.day_of_week, 'break_start', e.target.value)}
                                                        />
                                                        <span className="wh-sep">—</span>
                                                        <input
                                                            type="time"
                                                            className="wh-time-input wh-time-input--break"
                                                            value={brk.break_end}
                                                            onChange={(e) => updateBreakInGroup(group.key, brk.day_of_week, 'break_end', e.target.value)}
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className="wh-closed-text">{dayOpen ? 'Pasif' : '—'}</span>
                                                )}
                                            </div>
                                            <div className="wh-row-right">
                                                {dayOpen && (
                                                    <label className="wh-toggle wh-toggle--small">
                                                        <input
                                                            type="checkbox"
                                                            checked={brk.is_active}
                                                            onChange={(e) => updateBreakInGroup(group.key, brk.day_of_week, 'is_active', e.target.checked)}
                                                        />
                                                        <span className="wh-toggle-slider" />
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Mola Ekle */}
            <button type="button" className="wh-add-group-btn" onClick={addBreakGroup}>
                + Yeni Mola Ekle
            </button>

            {/* Save */}
            <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/settings')}>İptal</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? 'Kaydediliyor...' : '💾 Değişiklikleri Kaydet'}
                </button>
            </div>
        </div>
    );
}
