import { useState, useEffect } from 'react';
import { localDateStr } from '../utils/dateUtils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { ToastContainer, useToast } from '../components/Toast';
import './SeasonalHours.css';

const DAY_NAMES = ['', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const DAY_SHORT = ['', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];


export default function SeasonalHours() {
    const { tenantUser } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toasts, addToast, dismissToast } = useToast();

    const [branchId, setBranchId] = useState(null);
    const [alwaysDays, setAlwaysDays] = useState([]); // always saatler (şablon)
    const [alwaysBreaks, setAlwaysBreaks] = useState([]); // always molalar (şablon)
    const [periods, setPeriods] = useState([]); // Dönemler
    const [deletedPeriodGroupIds, setDeletedPeriodGroupIds] = useState([]);
    const [deletedBreakIds, setDeletedBreakIds] = useState([]);

    // Accordion: sadece 1 dönem açık
    const [expandedPeriod, setExpandedPeriod] = useState(null);
    // İç collapse (gün kartı, mola kartları)
    const [collapsedSections, setCollapsedSections] = useState({});

    const toggleCollapse = (key) => {
        setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));
    };


    useEffect(() => {
        if (tenantUser?.tenant_id) loadData();
    }, [tenantUser]);

    // ─── Load ───
    const loadData = async () => {
        try {
            const { data: branch } = await supabase
                .from('branches').select('id')
                .eq('tenant_id', tenantUser.tenant_id)
                .limit(1).single();

            if (!branch) { addToast('error', 'Şube bulunamadı.'); setLoading(false); return; }
            setBranchId(branch.id);

            // Always saatleri (şablon için)
            const { data: alwaysData } = await supabase
                .from('branch_working_hours')
                .select('*, branch_breaks(*)')
                .eq('branch_id', branch.id)
                .eq('schedule_type', 'always')
                .order('day_of_week');

            const formattedAlways = (alwaysData || []).map((wh) => ({
                day_of_week: wh.day_of_week,
                is_open: wh.is_open,
                open_time: wh.open_time ? wh.open_time.slice(0, 5) : '09:00',
                close_time: wh.close_time ? wh.close_time.slice(0, 5) : '19:00',
            }));
            setAlwaysDays(formattedAlways);

            // Always molaları (şablon)
            const alwaysBrks = [];
            (alwaysData || []).forEach((wh) => {
                (wh.branch_breaks || []).forEach((b) => {
                    alwaysBrks.push({
                        day_of_week: wh.day_of_week,
                        is_active: b.is_active,
                        break_start: b.break_start ? b.break_start.slice(0, 5) : '12:00',
                        break_end: b.break_end ? b.break_end.slice(0, 5) : '13:00',
                        break_name: b.break_name || 'Öğle Arası',
                        is_default: b.is_default || false,
                    });
                });
            });
            setAlwaysBreaks(alwaysBrks);

            // Period verilerini yükle
            const { data: periodData } = await supabase
                .from('branch_working_hours')
                .select('*, branch_breaks(*)')
                .eq('branch_id', branch.id)
                .eq('schedule_type', 'period')
                .order('valid_from')
                .order('day_of_week');

            // period_group_id'ye göre grupla
            const groupMap = {};
            (periodData || []).forEach((wh) => {
                const gid = wh.period_group_id;
                if (!groupMap[gid]) {
                    groupMap[gid] = {
                        groupId: gid,
                        name: wh.period_name || '',
                        valid_from: wh.valid_from || '',
                        valid_to: wh.valid_to || '',
                        isNew: false,
                        days: [],
                        breakGroups: [],
                    };
                }
                groupMap[gid].days.push({
                    id: wh.id,
                    day_of_week: wh.day_of_week,
                    is_open: wh.is_open,
                    open_time: wh.open_time ? wh.open_time.slice(0, 5) : '09:00',
                    close_time: wh.close_time ? wh.close_time.slice(0, 5) : '19:00',
                });

                // Molaları topla
                (wh.branch_breaks || []).forEach((b) => {
                    const existing = groupMap[gid].breakGroups.find((bg) => bg.name === (b.break_name || 'Öğle Arası'));
                    const brkEntry = {
                        id: b.id,
                        wh_id: wh.id,
                        day_of_week: wh.day_of_week,
                        is_active: b.is_active,
                        break_start: b.break_start ? b.break_start.slice(0, 5) : '12:00',
                        break_end: b.break_end ? b.break_end.slice(0, 5) : '13:00',
                        is_default: b.is_default || false,
                        isNew: false,
                    };

                    if (existing) {
                        existing.breaks.push(brkEntry);
                    } else {
                        groupMap[gid].breakGroups.push({
                            name: b.break_name || 'Öğle Arası',
                            key: `${gid}-${b.break_name || 'Öğle Arası'}`,
                            isDefault: b.is_default || false,
                            breaks: [brkEntry],
                        });
                    }
                });
            });

            // Sort days & breaks
            Object.values(groupMap).forEach((p) => {
                p.days.sort((a, b) => a.day_of_week - b.day_of_week);
                p.breakGroups.forEach((bg) => bg.breaks.sort((a, b) => a.day_of_week - b.day_of_week));
            });

            setPeriods(Object.values(groupMap));
        } catch (err) {
            console.error('loadData error:', err);
            addToast('error', 'Veriler yüklenirken hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    // ─── Add New Period (copy always template) ───
    const addPeriod = () => {
        const newGroupId = crypto.randomUUID();
        const now = new Date();
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        const formatDate = (d) => localDateStr(d);

        // Always saatleri kopyala
        const newDays = alwaysDays.map((ad) => ({
            id: `temp-day-${newGroupId}-${ad.day_of_week}`,
            day_of_week: ad.day_of_week,
            is_open: ad.is_open,
            open_time: ad.open_time,
            close_time: ad.close_time,
            isNew: true,
        }));

        // Always molaları grupla ve kopyala
        const brkGroupMap = {};
        alwaysBreaks.forEach((ab) => {
            if (!brkGroupMap[ab.break_name]) {
                brkGroupMap[ab.break_name] = {
                    name: ab.break_name,
                    key: `${newGroupId}-${ab.break_name}`,
                    isDefault: ab.is_default,
                    breaks: [],
                };
            }
            const dayEntry = newDays.find((d) => d.day_of_week === ab.day_of_week);
            brkGroupMap[ab.break_name].breaks.push({
                id: `temp-brk-${newGroupId}-${ab.day_of_week}-${ab.break_name}`,
                wh_id: dayEntry?.id || '',
                day_of_week: ab.day_of_week,
                is_active: ab.is_active,
                break_start: ab.break_start,
                break_end: ab.break_end,
                is_default: ab.is_default,
                isNew: true,
            });
        });

        Object.values(brkGroupMap).forEach((bg) => bg.breaks.sort((a, b) => a.day_of_week - b.day_of_week));

        const newPeriod = {
            groupId: newGroupId,
            name: '',
            valid_from: formatDate(now),
            valid_to: formatDate(nextMonth),
            isNew: true,
            days: newDays,
            breakGroups: Object.values(brkGroupMap),
        };

        setPeriods((prev) => [...prev, newPeriod]);
        setExpandedPeriod(newGroupId);
        addToast('info', 'Yeni dönem eklendi — isim ve tarihleri doldurun', 3000);
    };

    // ─── Period Handlers ───
    const updatePeriodField = (groupId, field, value) => {
        setPeriods((prev) => prev.map((p) => p.groupId === groupId ? { ...p, [field]: value } : p));
    };

    const updatePeriodDay = (groupId, dayOfWeek, field, value) => {
        setPeriods((prev) => prev.map((p) => {
            if (p.groupId !== groupId) return p;
            const newDays = p.days.map((d) => d.day_of_week === dayOfWeek ? { ...d, [field]: value } : d);
            let newBreakGroups = p.breakGroups;
            if (field === 'is_open') {
                newBreakGroups = p.breakGroups.map((bg) => ({
                    ...bg,
                    breaks: bg.breaks.map((b) => b.day_of_week === dayOfWeek ? { ...b, is_active: value } : b),
                }));
            }
            return { ...p, days: newDays, breakGroups: newBreakGroups };
        }));
    };

    const updatePeriodBreakGroupName = (groupId, breakKey, newName) => {
        setPeriods((prev) => prev.map((p) => {
            if (p.groupId !== groupId) return p;
            return { ...p, breakGroups: p.breakGroups.map((bg) => bg.key === breakKey ? { ...bg, name: newName } : bg) };
        }));
    };

    const updatePeriodBreak = (groupId, breakKey, dayOfWeek, field, value) => {
        setPeriods((prev) => prev.map((p) => {
            if (p.groupId !== groupId) return p;
            return {
                ...p, breakGroups: p.breakGroups.map((bg) => {
                    if (bg.key !== breakKey) return bg;
                    return { ...bg, breaks: bg.breaks.map((b) => b.day_of_week === dayOfWeek ? { ...b, [field]: value } : b) };
                })
            };
        }));
    };

    const addPeriodBreakGroup = (groupId) => {
        setPeriods((prev) => prev.map((p) => {
            if (p.groupId !== groupId) return p;
            const brkKey = `${groupId}-new-${Date.now()}`;
            const newBreaks = p.days.map((d) => ({
                id: `temp-brk-${brkKey}-${d.day_of_week}`,
                wh_id: d.id,
                day_of_week: d.day_of_week,
                is_active: d.is_open,
                break_start: '15:00',
                break_end: '15:30',
                is_default: false,
                isNew: true,
            }));
            return { ...p, breakGroups: [...p.breakGroups, { name: '', key: brkKey, isDefault: false, breaks: newBreaks }] };
        }));
        addToast('info', 'Mola eklendi', 2000);
    };

    const removePeriodBreakGroup = (groupId, breakKey) => {
        setPeriods((prev) => prev.map((p) => {
            if (p.groupId !== groupId) return p;
            const bg = p.breakGroups.find((b) => b.key === breakKey);
            if (bg?.isDefault) {
                addToast('warning', 'Varsayılan mola silinemez', 3000);
                return p;
            }
            if (bg) {
                const existingIds = bg.breaks.filter((b) => !b.isNew).map((b) => b.id);
                if (existingIds.length > 0) setDeletedBreakIds((prev) => [...prev, ...existingIds]);
            }
            return { ...p, breakGroups: p.breakGroups.filter((b) => b.key !== breakKey) };
        }));
    };

    const removePeriod = (groupId) => {
        const period = periods.find((p) => p.groupId === groupId);
        if (!period) return;

        if (!period.isNew) {
            setDeletedPeriodGroupIds((prev) => [...prev, groupId]);
            // Mola ID'lerini de sil
            period.breakGroups.forEach((bg) => {
                const ids = bg.breaks.filter((b) => !b.isNew).map((b) => b.id);
                if (ids.length > 0) setDeletedBreakIds((prev) => [...prev, ...ids]);
            });
        }

        setPeriods((prev) => prev.filter((p) => p.groupId !== groupId));
        addToast('info', `"${period.name || 'İsimsiz dönem'}" silindi`, 2500);
    };

    // ─── Validation ───
    const timeToMinutes = (t) => {
        if (!t) return 0;
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    };

    const validate = () => {
        for (const period of periods) {
            const label = period.name || 'İsimsiz dönem';

            if (!period.name.trim()) return 'Tüm dönemlere isim verilmelidir';
            if (!period.valid_from || !period.valid_to) return `${label}: Başlangıç ve bitiş tarihi gerekli`;
            if (period.valid_from >= period.valid_to) return `${label}: Başlangıç tarihi bitişten önce olmalı`;

            // Tarih çakışma kontrolü
            for (const other of periods) {
                if (other.groupId === period.groupId) continue;
                if (period.valid_from < other.valid_to && period.valid_to > other.valid_from) {
                    return `"${label}" ve "${other.name || 'İsimsiz'}" dönemleri tarih aralığı çakışıyor`;
                }
            }

            // Çalışma saatleri
            for (const day of period.days) {
                if (!day.is_open) continue;
                const open = timeToMinutes(day.open_time);
                const close = timeToMinutes(day.close_time);
                if (open >= close) return `${label} — ${DAY_NAMES[day.day_of_week]}: Açılış saati kapanıştan önce olmalı`;
            }

            // Mola isimleri
            for (const bg of period.breakGroups) {
                if (!bg.name.trim()) return `${label}: Tüm molalara isim verilmelidir`;
            }

            // Mola saatleri
            for (const bg of period.breakGroups) {
                for (const brk of bg.breaks) {
                    if (!brk.is_active) continue;
                    const day = period.days.find((d) => d.day_of_week === brk.day_of_week);
                    if (!day || !day.is_open) continue;

                    const bs = timeToMinutes(brk.break_start);
                    const be = timeToMinutes(brk.break_end);
                    if (bs >= be) return `${label} — ${bg.name} — ${DAY_NAMES[brk.day_of_week]}: Mola başlangıcı bitişten önce olmalı`;
                    if (be - bs < 5) return `${label} — ${bg.name} — ${DAY_NAMES[brk.day_of_week]}: Mola en az 5 dakika olmalı`;

                    const dayOpen = timeToMinutes(day.open_time);
                    const dayClose = timeToMinutes(day.close_time);
                    if (bs < dayOpen || be > dayClose) return `${label} — ${bg.name} — ${DAY_NAMES[brk.day_of_week]}: Mola çalışma saatleri içinde olmalı`;
                }
            }

            // Aynı gün mola çakışması
            for (let d = 1; d <= 7; d++) {
                const dayBreaks = [];
                for (const bg of period.breakGroups) {
                    const brk = bg.breaks.find((b) => b.day_of_week === d);
                    if (brk && brk.is_active) {
                        dayBreaks.push({ name: bg.name, start: timeToMinutes(brk.break_start), end: timeToMinutes(brk.break_end) });
                    }
                }
                dayBreaks.sort((a, b) => a.start - b.start);
                for (let i = 0; i < dayBreaks.length - 1; i++) {
                    if (dayBreaks[i].end > dayBreaks[i + 1].start) {
                        return `${label} — ${DAY_NAMES[d]}: "${dayBreaks[i].name}" ve "${dayBreaks[i + 1].name}" çakışıyor`;
                    }
                }
            }
        }
        return null;
    };

    // ─── Save ───
    const handleSave = async () => {
        const err = validate();
        if (err) { addToast('error', err, 5000); return; }

        setSaving(true);
        try {
            // 1) Silinen molaları sil
            if (deletedBreakIds.length > 0) {
                await supabase.from('branch_breaks').delete().in('id', deletedBreakIds);
            }

            // 2) Silinen dönemleri sil (working_hours → cascade breaks)
            if (deletedPeriodGroupIds.length > 0) {
                for (const gid of deletedPeriodGroupIds) {
                    await supabase.from('branch_working_hours').delete().eq('period_group_id', gid);
                }
            }

            // 3) Her dönemi kaydet
            for (const period of periods) {
                if (period.isNew) {
                    // Yeni dönem: 7 gün insert et
                    const whIdMap = {}; // day_of_week -> new wh id
                    for (const day of period.days) {
                        const { data: inserted, error: insErr } = await supabase
                            .from('branch_working_hours')
                            .insert({
                                branch_id: branchId,
                                day_of_week: day.day_of_week,
                                is_open: day.is_open,
                                open_time: day.is_open ? day.open_time : null,
                                close_time: day.is_open ? day.close_time : null,
                                schedule_type: 'period',
                                period_group_id: period.groupId,
                                period_name: period.name.trim(),
                                valid_from: period.valid_from,
                                valid_to: period.valid_to,
                            })
                            .select('id')
                            .single();

                        if (insErr) { addToast('error', `Dönem kaydedilemedi: ${insErr.message}`); setSaving(false); return; }
                        whIdMap[day.day_of_week] = inserted.id;
                    }

                    // Molaları insert et
                    for (const bg of period.breakGroups) {
                        for (const brk of bg.breaks) {
                            const whId = whIdMap[brk.day_of_week];
                            await supabase.from('branch_breaks').insert({
                                working_hours_id: whId,
                                is_active: brk.is_active,
                                break_start: brk.is_active ? brk.break_start : null,
                                break_end: brk.is_active ? brk.break_end : null,
                                break_name: bg.name.trim(),
                                is_default: brk.is_default,
                            });
                        }
                    }
                } else {
                    // Mevcut dönem: güncelle
                    for (const day of period.days) {
                        await supabase.from('branch_working_hours').update({
                            is_open: day.is_open,
                            open_time: day.is_open ? day.open_time : null,
                            close_time: day.is_open ? day.close_time : null,
                            period_name: period.name.trim(),
                            valid_from: period.valid_from,
                            valid_to: period.valid_to,
                        }).eq('id', day.id);
                    }

                    for (const bg of period.breakGroups) {
                        for (const brk of bg.breaks) {
                            const payload = {
                                is_active: brk.is_active,
                                break_start: brk.is_active ? brk.break_start : null,
                                break_end: brk.is_active ? brk.break_end : null,
                                break_name: bg.name.trim(),
                            };
                            if (brk.isNew) {
                                await supabase.from('branch_breaks').insert({ working_hours_id: brk.wh_id, ...payload, is_default: false });
                            } else {
                                await supabase.from('branch_breaks').update(payload).eq('id', brk.id);
                            }
                        }
                    }
                }
            }

            addToast('success', 'Dönemsel çalışma saatleri kaydedildi!');
            setDeletedPeriodGroupIds([]);
            setDeletedBreakIds([]);
            await loadData();
        } catch (e) {
            console.error(e);
            addToast('error', 'Bir hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    // ─── Helpers ───
    const isExpired = (validTo) => validTo && new Date(validTo) < new Date();
    const isActive = (validFrom, validTo) => {
        const now = new Date();
        return validFrom && validTo && new Date(validFrom) <= now && now <= new Date(validTo);
    };

    const formatDateTR = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
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

    return (
        <div className="seasonal-hours">
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />

            <div className="page-header">
                <button className="back-btn" onClick={() => navigate('/settings')}>← Ayarlara Dön</button>
                <h1>📅 Dönemsel Çalışma Saatleri</h1>
                <p className="text-muted">Tatil, sezon ve özel dönemler için farklı çalışma saatleri belirleyin</p>
            </div>

            {periods.length === 0 && !loading && (
                <div className="sh-empty">
                    <span className="sh-empty-icon">📅</span>
                    <h3>Henüz dönem eklenmemiş</h3>
                    <p>Yeni bir dönem ekleyerek özel çalışma saatleri tanımlayabilirsiniz</p>
                </div>
            )}

            {/* ═══ DÖNEM KARTLARI ═══ */}
            {periods.map((period) => {
                const expanded = expandedPeriod === period.groupId;
                const expired = isExpired(period.valid_to);
                const active = isActive(period.valid_from, period.valid_to);

                return (
                    <div key={period.groupId} className={`sh-period-card ${expired ? 'sh-period-card--expired' : ''} ${active ? 'sh-period-card--active' : ''}`}>
                        {/* Period Header */}
                        <div className="sh-period-header" onClick={() => setExpandedPeriod(expanded ? null : period.groupId)}>
                            <div className="sh-period-header-left">
                                <span className="sh-period-icon">{expired ? '🔴' : active ? '🟢' : '🟡'}</span>
                                <div className="sh-period-info">
                                    <h3>{period.name || 'İsimsiz Dönem'}</h3>
                                    <span className="sh-period-dates">
                                        {formatDateTR(period.valid_from)} — {formatDateTR(period.valid_to)}
                                    </span>
                                </div>
                                {expired && <span className="sh-badge sh-badge--expired">Süresi Dolmuş</span>}
                                {active && <span className="sh-badge sh-badge--active">Aktif</span>}
                            </div>
                            <span className={`sh-collapse-arrow ${!expanded ? 'sh-collapse-arrow--collapsed' : ''}`}>▼</span>
                        </div>

                        {/* Expanded Content */}
                        {expanded && (
                            <div className="sh-period-body">
                                {/* İsim + Tarih */}
                                <div className="sh-meta-row">
                                    <div className="sh-meta-field">
                                        <label>Dönem Adı</label>
                                        <input
                                            type="text"
                                            value={period.name}
                                            onChange={(e) => updatePeriodField(period.groupId, 'name', e.target.value)}
                                            placeholder="Yaz Sezonu, Ramazan..."
                                            className="sh-input"
                                            maxLength={100}
                                        />
                                    </div>
                                    <div className="sh-meta-field">
                                        <label>Başlangıç</label>
                                        <input
                                            type="date"
                                            value={period.valid_from}
                                            onChange={(e) => updatePeriodField(period.groupId, 'valid_from', e.target.value)}
                                            className="sh-input"
                                        />
                                    </div>
                                    <div className="sh-meta-field">
                                        <label>Bitiş</label>
                                        <input
                                            type="date"
                                            value={period.valid_to}
                                            onChange={(e) => updatePeriodField(period.groupId, 'valid_to', e.target.value)}
                                            className="sh-input"
                                        />
                                    </div>
                                </div>

                                {/* Çalışma Günleri */}
                                <div className="sh-inner-card">
                                    <div className="sh-inner-header" onClick={() => toggleCollapse(`${period.groupId}-days`)}>
                                        <span>📆 Çalışma Günleri</span>
                                        <span className={`sh-collapse-arrow ${collapsedSections[`${period.groupId}-days`] ? 'sh-collapse-arrow--collapsed' : ''}`}>▼</span>
                                    </div>
                                    {!collapsedSections[`${period.groupId}-days`] && (
                                        <div className="sh-rows">
                                            {period.days.map((day) => (
                                                <div key={day.day_of_week} className={`sh-row ${!day.is_open ? 'sh-row--closed' : ''}`}>
                                                    <div className="sh-row-left">
                                                        <span className="sh-day-badge">{DAY_SHORT[day.day_of_week]}</span>
                                                        <span className="sh-day-name">{DAY_NAMES[day.day_of_week]}</span>
                                                    </div>
                                                    <div className="sh-row-center">
                                                        {day.is_open ? (
                                                            <div className="sh-time-pair">
                                                                <input type="time" className="sh-time-input" value={day.open_time}
                                                                    onChange={(e) => updatePeriodDay(period.groupId, day.day_of_week, 'open_time', e.target.value)} />
                                                                <span className="sh-sep">—</span>
                                                                <input type="time" className="sh-time-input" value={day.close_time}
                                                                    onChange={(e) => updatePeriodDay(period.groupId, day.day_of_week, 'close_time', e.target.value)} />
                                                            </div>
                                                        ) : (
                                                            <span className="sh-closed-text">Kapalı</span>
                                                        )}
                                                    </div>
                                                    <div className="sh-row-right">
                                                        <label className="sh-toggle">
                                                            <input type="checkbox" checked={day.is_open}
                                                                onChange={(e) => updatePeriodDay(period.groupId, day.day_of_week, 'is_open', e.target.checked)} />
                                                            <span className="sh-toggle-slider" />
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Mola Kartları */}
                                {period.breakGroups.map((bg) => (
                                    <div key={bg.key} className={`sh-inner-card sh-inner-card--break ${bg.isDefault ? 'sh-inner-card--default' : ''}`}>
                                        <div className="sh-inner-header" onClick={() => toggleCollapse(`${period.groupId}-${bg.key}`)}>
                                            <div className="sh-inner-header-left">
                                                <span>{bg.isDefault ? '🍽️' : '☕'}</span>
                                                <div className="sh-break-name-wrap" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        type="text"
                                                        className="sh-break-name-input"
                                                        value={bg.name}
                                                        onChange={(e) => updatePeriodBreakGroupName(period.groupId, bg.key, e.target.value)}
                                                        placeholder="Mola ismi..."
                                                        maxLength={50}
                                                        readOnly={bg.isDefault}
                                                    />
                                                </div>
                                                {bg.isDefault && <span className="sh-default-badge">Varsayılan</span>}
                                            </div>
                                            <div className="sh-inner-header-right" onClick={(e) => e.stopPropagation()}>
                                                {!bg.isDefault && (
                                                    <button className="sh-delete-btn" onClick={() => removePeriodBreakGroup(period.groupId, bg.key)}>🗑️ Sil</button>
                                                )}
                                            </div>
                                            <span className={`sh-collapse-arrow ${collapsedSections[`${period.groupId}-${bg.key}`] ? 'sh-collapse-arrow--collapsed' : ''}`}>▼</span>
                                        </div>
                                        {!collapsedSections[`${period.groupId}-${bg.key}`] && (
                                            <div className="sh-rows">
                                                {bg.breaks.map((brk) => {
                                                    const day = period.days.find((d) => d.day_of_week === brk.day_of_week);
                                                    const dayOpen = day?.is_open ?? false;
                                                    return (
                                                        <div key={brk.day_of_week} className={`sh-row ${!dayOpen ? 'sh-row--day-closed' : ''} ${!brk.is_active ? 'sh-row--closed' : ''}`}>
                                                            <div className="sh-row-left">
                                                                <span className="sh-day-badge sh-day-badge--break">{DAY_SHORT[brk.day_of_week]}</span>
                                                                <span className="sh-day-name">{DAY_NAMES[brk.day_of_week]}</span>
                                                                {!dayOpen && <span className="sh-day-closed-tag">Gün kapalı</span>}
                                                            </div>
                                                            <div className="sh-row-center">
                                                                {brk.is_active && dayOpen ? (
                                                                    <div className="sh-time-pair">
                                                                        <input type="time" className="sh-time-input sh-time-input--break" value={brk.break_start}
                                                                            onChange={(e) => updatePeriodBreak(period.groupId, bg.key, brk.day_of_week, 'break_start', e.target.value)} />
                                                                        <span className="sh-sep">—</span>
                                                                        <input type="time" className="sh-time-input sh-time-input--break" value={brk.break_end}
                                                                            onChange={(e) => updatePeriodBreak(period.groupId, bg.key, brk.day_of_week, 'break_end', e.target.value)} />
                                                                    </div>
                                                                ) : (
                                                                    <span className="sh-closed-text">{dayOpen ? 'Pasif' : '—'}</span>
                                                                )}
                                                            </div>
                                                            <div className="sh-row-right">
                                                                {dayOpen && (
                                                                    <label className="sh-toggle sh-toggle--small">
                                                                        <input type="checkbox" checked={brk.is_active}
                                                                            onChange={(e) => updatePeriodBreak(period.groupId, bg.key, brk.day_of_week, 'is_active', e.target.checked)} />
                                                                        <span className="sh-toggle-slider" />
                                                                    </label>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <button type="button" className="sh-add-break-btn" onClick={() => addPeriodBreakGroup(period.groupId)}>
                                    + Yeni Mola Ekle
                                </button>

                                <div className="sh-period-footer">
                                    <button type="button" className="sh-remove-period-btn" onClick={() => removePeriod(period.groupId)}>
                                        🗑️ Dönemi Sil
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Yeni Dönem Ekle */}
            <button type="button" className="sh-add-period-btn" onClick={addPeriod}>
                + Yeni Dönem Ekle
            </button>

            {/* Save */}
            {periods.length > 0 && (
                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/settings')}>İptal</button>
                    <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                        {saving ? 'Kaydediliyor...' : '💾 Değişiklikleri Kaydet'}
                    </button>
                </div>
            )}
        </div>
    );
}
