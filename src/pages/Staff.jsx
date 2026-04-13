import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase, supabaseUrl } from '../config/supabase';
import { ToastContainer, useToast } from '../components/Toast';
import './Staff.css';
import './WorkingHours.css';

const DAY_NAMES = ['', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const DAY_SHORT = ['', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const DEFAULT_BREAK = 'Öğle Arası';

const STAFF_COLORS = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#ef4444',
    '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#14b8a6',
    '#06b6d4', '#3b82f6', '#a855f7', '#d946ef',
];

const emptyForm = {
    first_name: '', last_name: '', email: '', phone: '',
    staff_type_id: '', title_id: '', work_type_id: '', gender_id: '', client_gender_id: '', color: STAFF_COLORS[0],
    appointment_interval_min: '', is_online_bookable: true,
    receive_sms: false, show_in_calendar: true,
    base_salary_amount: '', service_comm_cash_pct: '', service_comm_card_pct: '',
    product_comm_cash_pct: '', product_comm_card_pct: '',
    package_comm_cash_pct: '', package_comm_card_pct: '',
    start_date: '', birth_date: '', address: '', notes: '',
    emergency_contact_name: '', emergency_contact_phone: '',
    is_active: true,
};


export default function Staff() {
    const { tenantUser } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toasts, addToast, dismissToast } = useToast();

    const [branchId, setBranchId] = useState(null);
    const [staffList, setStaffList] = useState([]);
    const [staffTypes, setStaffTypes] = useState([]);
    const [staffTitles, setStaffTitles] = useState([]);
    const [genders, setGenders] = useState([]);
    const [workTypes, setWorkTypes] = useState([]);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [modalTab, setModalTab] = useState('general');
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ ...emptyForm });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const avatarInputRef = useRef(null);

    // Working hours
    const [staffDays, setStaffDays] = useState([]);
    const [staffBreakGroups, setStaffBreakGroups] = useState([]);
    const [staffDeletedBreakIds, setStaffDeletedBreakIds] = useState([]);
    const [staffWhCollapsed, setStaffWhCollapsed] = useState({});
    const [whLoaded, setWhLoaded] = useState(false);

    // Delete confirm
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Working hours modal (separate)
    const [whModalStaff, setWhModalStaff] = useState(null);
    const [whSaving, setWhSaving] = useState(false);
    const [whDeleting, setWhDeleting] = useState(false);


    useEffect(() => {
        if (tenantUser?.tenant_id) loadData();
    }, [tenantUser]);

    const loadData = async () => {
        try {
            const [branchRes, typesRes, titlesRes, gendersRes, workTypesRes] = await Promise.all([
                supabase.from('branches').select('id').eq('tenant_id', tenantUser.tenant_id).limit(1).single(),
                supabase.from('staff_types').select('*').eq('is_active', true).order('sort_order'),
                supabase.from('staff_titles').select('*').eq('is_active', true).order('sort_order'),
                supabase.from('genders').select('*').order('label'),
                supabase.from('work_types').select('*').eq('is_active', true).order('sort_order'),
            ]);

            if (!branchRes.data) { addToast('error', 'Şube bulunamadı'); setLoading(false); return; }
            setBranchId(branchRes.data.id);
            setStaffTypes(typesRes.data || []);
            setStaffTitles(titlesRes.data || []);
            setGenders(gendersRes.data || []);
            setWorkTypes(workTypesRes.data || []);

            const { data: staff } = await supabase
                .from('tenant_staff')
                .select('*, staff_types(name), staff_titles(name), genders!tenant_staff_gender_id_fkey(label), client_genders:genders!tenant_staff_client_gender_id_fkey(label), work_types(name)')
                .eq('branch_id', branchRes.data.id)
                .is('deleted_at', null)
                .order('first_name');

            setStaffList(staff || []);
        } catch (err) {
            console.error(err);
            addToast('error', 'Veriler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    // ─── Modal ───
    const openAdd = () => {
        setEditingId(null);
        setForm({ ...emptyForm });
        setAvatarFile(null);
        setAvatarPreview(null);
        setModalTab('general');
        setShowModal(true);
    };

    const openEdit = (staff) => {
        setEditingId(staff.id);
        setForm({
            first_name: staff.first_name || '', last_name: staff.last_name || '',
            email: staff.email || '', phone: staff.phone || '',
            staff_type_id: staff.staff_type_id || '', title_id: staff.title_id || '',
            work_type_id: staff.work_type_id || '',
            gender_id: staff.gender_id || '', client_gender_id: staff.client_gender_id || '',
            color: staff.color || STAFF_COLORS[0],
            appointment_interval_min: staff.appointment_interval_min ?? '',
            is_online_bookable: staff.is_online_bookable,
            receive_sms: staff.receive_sms, show_in_calendar: staff.show_in_calendar,
            base_salary_amount: staff.base_salary_amount ?? '',
            service_comm_cash_pct: staff.service_comm_cash_pct ?? '',
            service_comm_card_pct: staff.service_comm_card_pct ?? '',
            product_comm_cash_pct: staff.product_comm_cash_pct ?? '',
            product_comm_card_pct: staff.product_comm_card_pct ?? '',
            package_comm_cash_pct: staff.package_comm_cash_pct ?? '',
            package_comm_card_pct: staff.package_comm_card_pct ?? '',

            start_date: staff.start_date || '', birth_date: staff.birth_date || '',
            address: staff.address || '', notes: staff.notes || '',
            emergency_contact_name: staff.emergency_contact_name || '',
            emergency_contact_phone: staff.emergency_contact_phone || '',
            is_active: staff.is_active,
        });
        setAvatarFile(null);
        setAvatarPreview(staff.avatar_url || null);
        setModalTab('general');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setDeleteConfirm(null);
        setForm({ ...emptyForm });
        setAvatarFile(null);
        if (avatarPreview && avatarPreview.startsWith('blob:')) URL.revokeObjectURL(avatarPreview);
        setAvatarPreview(null);
    };

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    // ─── Avatar ───
    const handleAvatarSelect = (file) => {
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { addToast('error', 'Fotoğraf 2MB\'dan küçük olmalı'); return; }
        if (avatarPreview && avatarPreview.startsWith('blob:')) URL.revokeObjectURL(avatarPreview);
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const uploadAvatar = async (staffId) => {
        if (!avatarFile || !branchId) return null;
        const ext = avatarFile.name.split('.').pop();
        const path = `${tenantUser.tenant_id}/${branchId}/${staffId}.${ext}`;
        const { error } = await supabase.storage.from('avatars').upload(path, avatarFile, { upsert: true });
        if (error) throw error;
        return `${supabaseUrl}/storage/v1/object/public/avatars/${path}`;
    };

    // ─── Save ───
    const handleSave = async () => {
        if (!form.first_name.trim()) { addToast('error', 'Ad alanı zorunludur'); return; }

        setSaving(true);
        try {
            const payload = {};
            for (const [key, val] of Object.entries(form)) {
                if (key === 'is_online_bookable' || key === 'receive_sms' || key === 'show_in_calendar' || key === 'is_active') {
                    payload[key] = val;
                } else {
                    payload[key] = val === '' ? null : val;
                }
            }
            payload.tenant_id = tenantUser.tenant_id;
            payload.branch_id = branchId;

            if (editingId) {
                // Update
                delete payload.tenant_id;
                delete payload.branch_id;

                if (avatarFile) {
                    const url = await uploadAvatar(editingId);
                    if (url) payload.avatar_url = url;
                }

                const { error } = await supabase.from('tenant_staff').update(payload).eq('id', editingId);
                if (error) {
                    if (error.message?.includes('uq_tenant_staff_email')) {
                        addToast('error', 'Bu email adresi başka bir personelde kullanılıyor', 5000);
                    } else if (error.message?.includes('uq_tenant_staff_phone')) {
                        addToast('error', 'Bu telefon numarası başka bir personelde kullanılıyor', 5000);
                    } else {
                        addToast('error', `Güncelleme hatası: ${error.message}`);
                    }
                    setSaving(false);
                    return;
                }
                addToast('success', 'Personel güncellendi');
            } else {
                // Insert
                const { data: inserted, error } = await supabase.from('tenant_staff').insert(payload).select('id').single();
                if (error) {
                    if (error.message?.includes('uq_tenant_staff_email')) {
                        addToast('error', 'Bu email adresi başka bir personelde kullanılıyor', 5000);
                    } else if (error.message?.includes('uq_tenant_staff_phone')) {
                        addToast('error', 'Bu telefon numarası başka bir personelde kullanılıyor', 5000);
                    } else {
                        addToast('error', `Kayıt hatası: ${error.message}`);
                    }
                    setSaving(false);
                    return;
                }

                if (avatarFile && inserted?.id) {
                    const url = await uploadAvatar(inserted.id);
                    if (url) {
                        await supabase.from('tenant_staff').update({ avatar_url: url }).eq('id', inserted.id);
                    }
                }
                addToast('success', 'Personel eklendi');
            }

            closeModal();
            await loadData();
        } catch (e) {
            console.error(e);
            addToast('error', 'Bir hata oluştu');
        } finally {
            setSaving(false);
        }
    };

    // ─── Staff Working Hours ───
    const loadStaffHours = async (staffId) => {
        const { data: whData } = await supabase
            .from('staff_working_hours')
            .select('*, staff_breaks(*)')
            .eq('staff_id', staffId)
            .order('day_of_week');

        if (!whData || whData.length === 0) {
            setStaffDays([]);
            setStaffBreakGroups([]);
            setWhLoaded(true);
            return;
        }

        const formatted = whData.map((wh) => ({
            id: wh.id, day_of_week: wh.day_of_week, is_open: wh.is_open,
            open_time: wh.open_time ? wh.open_time.slice(0, 5) : '09:00',
            close_time: wh.close_time ? wh.close_time.slice(0, 5) : '19:00',
        }));
        setStaffDays(formatted);

        const allBreaks = [];
        whData.forEach((wh) => (wh.staff_breaks || []).forEach((b) => {
            allBreaks.push({
                id: b.id, wh_id: wh.id, day_of_week: wh.day_of_week,
                is_active: b.is_active,
                break_start: b.break_start ? b.break_start.slice(0, 5) : '12:00',
                break_end: b.break_end ? b.break_end.slice(0, 5) : '13:00',
                break_name: b.break_name || DEFAULT_BREAK,
                is_default: b.is_default || false, isNew: false,
            });
        }));

        const groupMap = {};
        allBreaks.forEach((b) => {
            if (!groupMap[b.break_name]) groupMap[b.break_name] = { name: b.break_name, key: b.break_name, breaks: [], isDefault: b.is_default };
            groupMap[b.break_name].breaks.push(b);
        });
        Object.values(groupMap).forEach((g) => g.breaks.sort((a, b) => a.day_of_week - b.day_of_week));
        setStaffBreakGroups(Object.values(groupMap));
        setWhLoaded(true);
    };

    const initStaffHours = async (staffId) => {
        // Copy branch hours as LOCAL template (no DB write)
        const { data: branchWh } = await supabase
            .from('branch_working_hours')
            .select('*, branch_breaks(*)')
            .eq('branch_id', branchId)
            .eq('schedule_type', 'always')
            .order('day_of_week');

        const localDays = [];
        for (let d = 1; d <= 7; d++) {
            const bwh = (branchWh || []).find((w) => w.day_of_week === d);
            localDays.push({
                staff_id: staffId, day_of_week: d, isNew: true,
                is_open: bwh?.is_open ?? (d <= 6),
                open_time: bwh?.open_time ? bwh.open_time.slice(0, 5) : '09:00',
                close_time: bwh?.close_time ? bwh.close_time.slice(0, 5) : '19:00',
            });
        }
        setStaffDays(localDays);

        // Copy default breaks as local state
        const localBreaks = [];
        (branchWh || []).forEach((bwh) => {
            (bwh.branch_breaks || []).filter((b) => b.is_default).forEach((b) => {
                localBreaks.push({
                    day_of_week: bwh.day_of_week,
                    break_name: b.break_name || DEFAULT_BREAK,
                    break_start: b.break_start ? b.break_start.slice(0, 5) : '12:00',
                    break_end: b.break_end ? b.break_end.slice(0, 5) : '13:00',
                    is_default: true, is_active: b.is_active, isNew: true,
                });
            });
        });

        const groupMap = {};
        localBreaks.forEach((b) => {
            if (!groupMap[b.break_name]) groupMap[b.break_name] = { name: b.break_name, key: b.break_name, breaks: [], isDefault: b.is_default };
            groupMap[b.break_name].breaks.push(b);
        });
        Object.values(groupMap).forEach((g) => g.breaks.sort((a, b) => a.day_of_week - b.day_of_week));
        setStaffBreakGroups(Object.values(groupMap));
    };

    const updateStaffDay = (dayOfWeek, field, value) => {
        setStaffDays((prev) => prev.map((d) => {
            if (d.day_of_week !== dayOfWeek) return d;
            if (field === 'is_open' && !value) return { ...d, is_open: false };
            if (field === 'is_open' && value) return { ...d, is_open: true };
            return { ...d, [field]: value };
        }));
    };

    const updateStaffBreak = (groupKey, dayOfWeek, field, value) => {
        setStaffBreakGroups((prev) => prev.map((g) => {
            if (g.key !== groupKey) return g;
            return { ...g, breaks: g.breaks.map((b) => b.day_of_week === dayOfWeek ? { ...b, [field]: value } : b) };
        }));
    };

    const updateStaffBreakGroupName = (groupKey, newName) => {
        setStaffBreakGroups((prev) => prev.map((g) => g.key === groupKey ? { ...g, name: newName } : g));
    };

    const addStaffBreakGroup = () => {
        const existingNames = staffBreakGroups.map((g) => g.name);
        let counter = 1;
        let newName = 'Mola 1';
        while (existingNames.includes(newName)) { counter++; newName = `Mola ${counter}`; }

        const newBreaks = staffDays.map((d) => ({
            id: null, wh_id: d.id, day_of_week: d.day_of_week,
            break_start: '15:00', break_end: '15:30',
            break_name: newName, is_active: d.is_open,
            is_default: false, isNew: true,
        }));
        setStaffBreakGroups((prev) => [...prev, { name: newName, key: newName, breaks: newBreaks, isDefault: false }]);
    };

    const removeStaffBreakGroup = (groupKey) => {
        const group = staffBreakGroups.find((g) => g.key === groupKey);
        if (group) {
            const ids = group.breaks.filter((b) => b.id && !b.isNew).map((b) => b.id);
            setStaffDeletedBreakIds((prev) => [...prev, ...ids]);
        }
        setStaffBreakGroups((prev) => prev.filter((g) => g.key !== groupKey));
    };

    const toggleStaffWhCollapse = (key) => {
        setStaffWhCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const timeToMinutes = (t) => {
        if (!t) return 0;
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    };

    const validateStaffHours = () => {
        for (const day of staffDays) {
            if (!day.is_open) continue;
            const open = timeToMinutes(day.open_time);
            const close = timeToMinutes(day.close_time);
            if (open >= close) return `${DAY_NAMES[day.day_of_week]}: Açılış saati kapanıştan önce olmalı`;
        }

        for (const group of staffBreakGroups) {
            if (!group.name.trim()) return 'Tüm molalara isim verilmelidir';
        }

        for (const group of staffBreakGroups) {
            for (const brk of group.breaks) {
                if (!brk.is_active) continue;
                const day = staffDays.find((d) => d.day_of_week === brk.day_of_week);
                if (!day || !day.is_open) continue;

                const bs = timeToMinutes(brk.break_start);
                const be = timeToMinutes(brk.break_end);
                if (bs >= be) return `${group.name} — ${DAY_NAMES[brk.day_of_week]}: Mola başlangıcı bitişten önce olmalı`;
                if (be - bs < 5) return `${group.name} — ${DAY_NAMES[brk.day_of_week]}: Mola en az 5 dakika olmalı`;

                const dayOpen = timeToMinutes(day.open_time);
                const dayClose = timeToMinutes(day.close_time);
                if (bs < dayOpen || be > dayClose) return `${group.name} — ${DAY_NAMES[brk.day_of_week]}: Mola çalışma saatleri (${day.open_time}–${day.close_time}) içinde olmalı`;
            }
        }

        for (let d = 1; d <= 7; d++) {
            const dayBreaks = [];
            for (const group of staffBreakGroups) {
                const brk = group.breaks.find((b) => b.day_of_week === d);
                if (brk && brk.is_active) dayBreaks.push({ name: group.name, start: timeToMinutes(brk.break_start), end: timeToMinutes(brk.break_end) });
            }
            dayBreaks.sort((a, b) => a.start - b.start);
            for (let i = 0; i < dayBreaks.length - 1; i++) {
                if (dayBreaks[i].end > dayBreaks[i + 1].start) return `${DAY_NAMES[d]}: "${dayBreaks[i].name}" ve "${dayBreaks[i + 1].name}" molaları çakışıyor`;
            }
        }
        return null;
    };

    // ─── Working Hours Modal ───
    const openWhModal = async (staff) => {
        setWhModalStaff(staff);
        setStaffDays([]);
        setStaffBreakGroups([]);
        setStaffDeletedBreakIds([]);
        setStaffWhCollapsed({});
        setWhLoaded(false);
        await loadStaffHours(staff.id);
    };

    const closeWhModal = () => {
        setWhModalStaff(null);
        setStaffDays([]);
        setStaffBreakGroups([]);
        setStaffDeletedBreakIds([]);
        setStaffWhCollapsed({});
        setWhLoaded(false);
        setWhDeleting(false);
    };

    const deleteAllStaffHours = async (staffId) => {
        setWhDeleting(true);
        try {
            const whIds = staffDays.map(d => d.id).filter(Boolean);
            if (whIds.length > 0) {
                const { error: breakErr } = await supabase.from('staff_breaks').delete().in('working_hours_id', whIds);
                if (breakErr) { addToast('error', 'Molalar silinemedi: ' + breakErr.message); setWhDeleting(false); return; }
            }
            const { error: whErr } = await supabase.from('staff_working_hours').delete().eq('staff_id', staffId);
            if (whErr) { addToast('error', 'Çalışma saatleri silinemedi: ' + whErr.message); setWhDeleting(false); return; }

            setStaffDays([]);
            setStaffBreakGroups([]);
            setStaffDeletedBreakIds([]);
            setStaffWhCollapsed({});
            addToast('success', 'Özel çalışma saatleri silindi. Salon saatleri geçerli.');
        } catch (e) {
            console.error(e);
            addToast('error', 'Silme sırasında hata oluştu');
        } finally {
            setWhDeleting(false);
        }
    };

    const saveStaffHours = async () => {
        const validationError = validateStaffHours();
        if (validationError) { addToast('error', validationError, 5000); return false; }

        const staffId = whModalStaff?.id;
        if (!staffId) return false;

        // Check if all days are new (first-time init)
        const allNew = staffDays.every(d => d.isNew);

        if (allNew) {
            // INSERT all days at once
            const dayRows = staffDays.map(d => ({
                staff_id: staffId, day_of_week: d.day_of_week,
                is_open: d.is_open,
                open_time: d.is_open ? d.open_time : null,
                close_time: d.is_open ? d.close_time : null,
            }));
            const { data: inserted, error: dayErr } = await supabase.from('staff_working_hours').insert(dayRows).select('id, day_of_week');
            if (dayErr) { addToast('error', 'Çalışma saatleri eklenemedi: ' + dayErr.message); return false; }

            // INSERT all breaks linked to inserted day IDs
            const breakRows = [];
            for (const group of staffBreakGroups) {
                for (const brk of group.breaks) {
                    const whRow = inserted.find(r => r.day_of_week === brk.day_of_week);
                    if (whRow) {
                        breakRows.push({
                            working_hours_id: whRow.id,
                            is_active: brk.is_active,
                            break_start: brk.is_active ? brk.break_start : null,
                            break_end: brk.is_active ? brk.break_end : null,
                            break_name: group.name.trim(),
                            is_default: brk.is_default || false,
                        });
                    }
                }
            }
            if (breakRows.length > 0) {
                const { error: brkErr } = await supabase.from('staff_breaks').insert(breakRows);
                if (brkErr) { addToast('error', 'Molalar eklenemedi: ' + brkErr.message); return false; }
            }
        } else {
            // UPDATE existing days
            // Delete removed breaks
            if (staffDeletedBreakIds.length > 0) {
                const { error } = await supabase.from('staff_breaks').delete().in('id', staffDeletedBreakIds);
                if (error) { addToast('error', 'Mola silinirken hata'); return false; }
            }

            for (const day of staffDays) {
                const { error } = await supabase.from('staff_working_hours').update({
                    is_open: day.is_open,
                    open_time: day.is_open ? day.open_time : null,
                    close_time: day.is_open ? day.close_time : null,
                }).eq('id', day.id);
                if (error) { addToast('error', `${DAY_NAMES[day.day_of_week]} güncellenemedi`); return false; }
            }

            // Upsert breaks
            for (const group of staffBreakGroups) {
                for (const brk of group.breaks) {
                    const payload = {
                        is_active: brk.is_active,
                        break_start: brk.is_active ? brk.break_start : null,
                        break_end: brk.is_active ? brk.break_end : null,
                        break_name: group.name.trim(),
                    };
                    if (brk.isNew) {
                        const { error } = await supabase.from('staff_breaks').insert({ working_hours_id: brk.wh_id, ...payload });
                        if (error) { addToast('error', `Mola eklenemedi: ${error.message}`); return false; }
                    } else {
                        const { error } = await supabase.from('staff_breaks').update(payload).eq('id', brk.id);
                        if (error) { addToast('error', 'Mola güncellenemedi'); return false; }
                    }
                }
            }
        }
        setStaffDeletedBreakIds([]);
        return true;
    };


    // ─── Soft Delete ───
    const handleDelete = async (id) => {
        try {
            const staff = staffList.find(s => s.id === id);

            const { error } = await supabase
                .from('tenant_staff')
                .update({ deleted_at: new Date().toISOString(), is_active: false })
                .eq('id', id);

            if (error) { addToast('error', `Silme hatası: ${error.message}`); return; }
            addToast('success', `${staff?.first_name || 'Personel'} silindi`);
            setDeleteConfirm(null);
            await loadData();
        } catch (e) {
            addToast('error', 'Bir hata oluştu');
        }
    };

    // ─── Filtered list ───
    const filtered = staffList.filter((s) => {
        const name = `${s.first_name || ''} ${s.last_name || ''}`.toLowerCase();
        if (search && !name.includes(search.toLowerCase()) && !s.phone?.includes(search) && !s.email?.toLowerCase().includes(search.toLowerCase())) return false;
        if (filterType && s.staff_type_id !== filterType) return false;
        if (filterStatus === 'active' && !s.is_active) return false;
        if (filterStatus === 'inactive' && s.is_active) return false;
        return true;
    });

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
        <div className="staff-page">
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />

            <div className="page-header">
                <button className="back-btn" onClick={() => navigate('/settings')}>← Ayarlara Dön</button>
                <h1>👥 Personel Yönetimi</h1>
                <p className="text-muted">Çalışan ve cihazlarınızı yönetin</p>
            </div>

            {/* Toolbar */}
            <div className="staff-toolbar">
                <div className="staff-toolbar-left">
                    <div className="staff-search-box">
                        <span className="staff-search-icon">🔍</span>
                        <input type="text" placeholder="Ad, telefon veya email ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <select className="staff-filter" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="">Tüm Tipler</option>
                        {staffTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <select className="staff-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="">Tüm Durum</option>
                        <option value="active">Aktif</option>
                        <option value="inactive">Pasif</option>
                    </select>
                </div>
                <button className="staff-add-btn" onClick={openAdd}>+ Yeni Personel</button>
            </div>

            {/* Table */}
            {filtered.length === 0 ? (
                <div className="staff-empty">
                    <span className="staff-empty-icon">👥</span>
                    <h3>{staffList.length === 0 ? 'Henüz personel eklenmemiş' : 'Sonuç bulunamadı'}</h3>
                    <p>{staffList.length === 0 ? 'Yeni personel ekleyerek başlayın' : 'Arama kriterlerini değiştirin'}</p>
                </div>
            ) : (
                <div className="staff-table-wrap">
                    <table className="staff-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Ad Soyad</th>
                                <th>Tip</th>
                                <th>Telefon</th>
                                <th>Cinsiyet</th>
                                <th>Durum</th>
                                <th>İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((s) => (
                                <tr key={s.id} className={!s.is_active ? 'staff-row--inactive' : ''}>
                                    <td>
                                        <div className="staff-avatar" style={{ background: s.color || '#6366f1' }}>
                                            {s.avatar_url ? (
                                                <img src={s.avatar_url} alt="" />
                                            ) : (
                                                <span>{(s.first_name?.[0] || '?').toUpperCase()}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="staff-name-cell">
                                            <span className="staff-name">{s.first_name} {s.last_name}</span>
                                            {s.email && <span className="staff-email">{s.email}</span>}
                                        </div>
                                    </td>
                                    <td><span className="staff-type-badge">{s.staff_types?.name || '—'}</span></td>
                                    <td>{s.phone || '—'}</td>
                                    <td>{s.genders?.label || '—'}</td>
                                    <td>
                                        <span className={`staff-status ${s.is_active ? 'staff-status--active' : 'staff-status--inactive'}`}>
                                            {s.is_active ? 'Aktif' : 'Pasif'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="staff-actions">
                                            <button className="staff-action-btn" onClick={() => openWhModal(s)} title="Çalışma Saatleri">⏰</button>
                                            <button className="staff-action-btn" onClick={() => openEdit(s)} title="Düzenle">✏️</button>
                                            <button className="staff-action-btn staff-action-btn--delete" onClick={() => setDeleteConfirm(s.id)} title="Sil">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteConfirm && (
                <div className="staff-modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="staff-confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>⚠️ Personel Sil</h3>
                        <p>Bu personeli silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
                        <div className="staff-confirm-actions">
                            <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>İptal</button>
                            <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Sil</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="staff-modal-overlay" onClick={closeModal}>
                    <div className="staff-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="staff-modal-header">
                            <h2>{editingId ? '✏️ Personel Düzenle' : '➕ Yeni Personel'}</h2>
                            <button className="staff-modal-close" onClick={closeModal}>✕</button>
                        </div>

                        <div className="staff-modal-tabs">
                            <button className={`staff-modal-tab ${modalTab === 'general' ? 'staff-modal-tab--active' : ''}`} onClick={() => setModalTab('general')}>👤 Genel</button>
                            <button className={`staff-modal-tab ${modalTab === 'commission' ? 'staff-modal-tab--active' : ''}`} onClick={() => setModalTab('commission')}>💰 Komisyon</button>
                        </div>

                        <div className="staff-modal-body">
                            {modalTab === 'general' && (
                                <div className="staff-modal-general">
                                    {/* Avatar */}
                                    <div className="staff-avatar-upload" onClick={() => avatarInputRef.current?.click()}>
                                        <div className="staff-avatar-circle" style={{ background: form.color || '#6366f1' }}>
                                            {avatarPreview ? (
                                                <img src={avatarPreview} alt="" />
                                            ) : (
                                                <span>{(form.first_name?.[0] || '?').toUpperCase()}</span>
                                            )}
                                            <div className="staff-avatar-overlay">📷</div>
                                        </div>
                                        <span className="staff-avatar-hint">Fotoğraf yükle</span>
                                        <input ref={avatarInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }}
                                            onChange={(e) => { handleAvatarSelect(e.target.files[0]); e.target.value = ''; }} />
                                    </div>

                                    <div className="staff-form-grid">
                                        <div className="sfg">
                                            <label>Ad *</label>
                                            <input type="text" value={form.first_name} onChange={(e) => handleChange('first_name', e.target.value)} placeholder="Ad" />
                                        </div>
                                        <div className="sfg">
                                            <label>Soyad</label>
                                            <input type="text" value={form.last_name} onChange={(e) => handleChange('last_name', e.target.value)} placeholder="Soyad" />
                                        </div>
                                        <div className="sfg">
                                            <label>Email</label>
                                            <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="email@ornek.com" />
                                        </div>
                                        <div className="sfg">
                                            <label>Telefon</label>
                                            <input type="tel" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="05XX XXX XX XX" />
                                        </div>
                                        <div className="sfg">
                                            <label>Personel Tipi</label>
                                            <select value={form.staff_type_id} onChange={(e) => handleChange('staff_type_id', e.target.value)}>
                                                <option value="">Seçiniz</option>
                                                {staffTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="sfg">
                                            <label>Ünvan</label>
                                            <select value={form.title_id} onChange={(e) => handleChange('title_id', e.target.value)}>
                                                <option value="">Seçiniz</option>
                                                {staffTitles.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="sfg">
                                            <label>Cinsiyet</label>
                                            <select value={form.gender_id} onChange={(e) => handleChange('gender_id', e.target.value)}>
                                                <option value="">Seçiniz</option>
                                                {genders.filter(g => g.label !== 'Unisex').map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
                                            </select>
                                        </div>
                                        <div className="sfg">
                                            <label>Müşteri Cinsiyeti</label>
                                            <select value={form.client_gender_id} onChange={(e) => handleChange('client_gender_id', e.target.value)}>
                                                <option value="">Seçiniz</option>
                                                {genders.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
                                            </select>
                                        </div>
                                        <div className="sfg">
                                            <label>Çalışma Şekli</label>
                                            <select value={form.work_type_id} onChange={(e) => handleChange('work_type_id', e.target.value)}>
                                                <option value="">Seçiniz</option>
                                                {workTypes.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="sfg">
                                            <label>Doğum Tarihi</label>
                                            <input type="date" value={form.birth_date} onChange={(e) => handleChange('birth_date', e.target.value)} />
                                        </div>
                                        <div className="sfg">
                                            <label>İşe Başlama</label>
                                            <input type="date" value={form.start_date} onChange={(e) => handleChange('start_date', e.target.value)} />
                                        </div>
                                        <div className="sfg">
                                            <label>Randevu Aralığı</label>
                                            <select value={form.appointment_interval_min} onChange={(e) => handleChange('appointment_interval_min', e.target.value === '' ? '' : parseInt(e.target.value))}>
                                                <option value="">Salon ayarı kullan</option>
                                                <option value={5}>5 dakika</option>
                                                <option value={10}>10 dakika</option>
                                                <option value={15}>15 dakika</option>
                                                <option value={20}>20 dakika</option>
                                                <option value={25}>25 dakika</option>
                                                <option value={30}>30 dakika</option>
                                                <option value={45}>45 dakika</option>
                                                <option value={60}>60 dakika</option>
                                            </select>
                                        </div>
                                        <div className="sfg sfg--full">
                                            <label>Adres</label>
                                            <textarea value={form.address} onChange={(e) => handleChange('address', e.target.value)} placeholder="Adres..." rows={2} />
                                        </div>
                                        <div className="sfg">
                                            <label>Acil Kişi Adı</label>
                                            <input type="text" value={form.emergency_contact_name} onChange={(e) => handleChange('emergency_contact_name', e.target.value)} placeholder="Acil durum kişisi" />
                                        </div>
                                        <div className="sfg">
                                            <label>Acil Kişi Telefonu</label>
                                            <input type="tel" value={form.emergency_contact_phone} onChange={(e) => handleChange('emergency_contact_phone', e.target.value)} placeholder="05XX XXX XX XX" />
                                        </div>
                                        <div className="sfg sfg--full">
                                            <label>Notlar</label>
                                            <textarea value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} placeholder="Yönetici notları..." rows={2} />
                                        </div>
                                    </div>

                                    {/* Color picker */}
                                    <div className="sfg sfg--full" style={{ marginTop: 12 }}>
                                        <label>Takvim Rengi</label>
                                        <div className="staff-color-grid">
                                            {STAFF_COLORS.map((c) => (
                                                <button key={c} type="button" className={`staff-color-swatch ${form.color === c ? 'staff-color-swatch--active' : ''}`}
                                                    style={{ background: c }} onClick={() => handleChange('color', c)} />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Toggles */}
                                    <div className="staff-toggles">
                                        <label className="staff-toggle-row">
                                            <span>Online Randevu</span>
                                            <input type="checkbox" checked={form.is_online_bookable} onChange={(e) => handleChange('is_online_bookable', e.target.checked)} />
                                            <span className="staff-toggle-slider" />
                                        </label>
                                        <label className="staff-toggle-row">
                                            <span>SMS Bildirim</span>
                                            <input type="checkbox" checked={form.receive_sms} onChange={(e) => handleChange('receive_sms', e.target.checked)} />
                                            <span className="staff-toggle-slider" />
                                        </label>
                                        <label className="staff-toggle-row">
                                            <span>Takvimde Göster</span>
                                            <input type="checkbox" checked={form.show_in_calendar} onChange={(e) => handleChange('show_in_calendar', e.target.checked)} />
                                            <span className="staff-toggle-slider" />
                                        </label>
                                        <label className="staff-toggle-row">
                                            <span>Aktif</span>
                                            <input type="checkbox" checked={form.is_active} onChange={(e) => handleChange('is_active', e.target.checked)} />
                                            <span className="staff-toggle-slider" />
                                        </label>
                                    </div>
                                </div>
                            )}

                            {modalTab === 'commission' && (
                                <div className="staff-modal-commission">
                                    <div className="staff-form-grid">
                                        <div className="sfg sfg--full">
                                            <label>Baz Maaş (₺)</label>
                                            <input type="number" value={form.base_salary_amount} onChange={(e) => handleChange('base_salary_amount', e.target.value)} placeholder="0.00" step="0.01" min={0} />
                                        </div>
                                    </div>

                                    <h4 className="staff-comm-title">💇 Hizmet Komisyonu</h4>
                                    <div className="staff-form-grid">
                                        <div className="sfg">
                                            <label>Nakit (%)</label>
                                            <input type="number" value={form.service_comm_cash_pct} onChange={(e) => handleChange('service_comm_cash_pct', e.target.value)} placeholder="0" step="0.01" min={0} max={100} />
                                        </div>
                                        <div className="sfg">
                                            <label>Kart (%)</label>
                                            <input type="number" value={form.service_comm_card_pct} onChange={(e) => handleChange('service_comm_card_pct', e.target.value)} placeholder="0" step="0.01" min={0} max={100} />
                                        </div>
                                    </div>

                                    <h4 className="staff-comm-title">📦 Ürün Komisyonu</h4>
                                    <div className="staff-form-grid">
                                        <div className="sfg">
                                            <label>Nakit (%)</label>
                                            <input type="number" value={form.product_comm_cash_pct} onChange={(e) => handleChange('product_comm_cash_pct', e.target.value)} placeholder="0" step="0.01" min={0} max={100} />
                                        </div>
                                        <div className="sfg">
                                            <label>Kart (%)</label>
                                            <input type="number" value={form.product_comm_card_pct} onChange={(e) => handleChange('product_comm_card_pct', e.target.value)} placeholder="0" step="0.01" min={0} max={100} />
                                        </div>
                                    </div>

                                    <h4 className="staff-comm-title">🎁 Paket Komisyonu</h4>
                                    <div className="staff-form-grid">
                                        <div className="sfg">
                                            <label>Nakit (%)</label>
                                            <input type="number" value={form.package_comm_cash_pct} onChange={(e) => handleChange('package_comm_cash_pct', e.target.value)} placeholder="0" step="0.01" min={0} max={100} />
                                        </div>
                                        <div className="sfg">
                                            <label>Kart (%)</label>
                                            <input type="number" value={form.package_comm_card_pct} onChange={(e) => handleChange('package_comm_card_pct', e.target.value)} placeholder="0" step="0.01" min={0} max={100} />
                                        </div>
                                    </div>
                                </div>
                            )}


                        </div>

                        <div className="staff-modal-footer">
                            <button className="btn btn-secondary" onClick={closeModal}>İptal</button>
                            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                                {saving ? 'Kaydediliyor...' : editingId ? '💾 Güncelle' : '➕ Ekle'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Working Hours Modal */}
            {whModalStaff && (
                <div className="staff-modal-overlay" onClick={closeWhModal}>
                    <div className="staff-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="staff-modal-header">
                            <h2>⏰ {whModalStaff.first_name} {whModalStaff.last_name} — Çalışma Saatleri</h2>
                            <button className="staff-modal-close" onClick={closeWhModal}>✕</button>
                        </div>

                        <div className="staff-modal-body">
                            {!whLoaded ? (
                                <div className="loading-screen" style={{ minHeight: 'auto', padding: '40px 0' }}>
                                    <div className="loading-spinner" />
                                    <p>Yükleniyor...</p>
                                </div>
                            ) : staffDays.length === 0 ? (
                                <div className="staff-wh-empty">
                                    <div className="staff-wh-empty-icon">🏢</div>
                                    <h3>Salon Saatleri Kullanılıyor</h3>
                                    <p>Bu personel için özel çalışma saati tanımlanmamış.<br />Salon çalışma saatleri geçerlidir.</p>
                                    <button className="btn btn-primary" onClick={async () => {
                                        await initStaffHours(whModalStaff.id);
                                    }} style={{ marginTop: '16px' }}>
                                        🕐 Özel Çalışma Saati Ekle
                                    </button>
                                </div>
                            ) : (
                                <div className="staff-modal-hours">
                                    {/* Tümünü Sil — sadece DB'den gelen veri varsa */}
                                    {staffDays.length > 0 && !staffDays.every(d => d.isNew) && (
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                                            <button className="btn btn-danger btn-sm" onClick={() => deleteAllStaffHours(whModalStaff.id)} disabled={whDeleting || whSaving}>
                                                {whDeleting ? 'Siliniyor...' : '🗑️ Tümünü Sil'}
                                            </button>
                                        </div>
                                    )}
                                    {/* Çalışma Günleri */}
                                    <div className="wh-section-card" style={{ margin: 0 }}>
                                        <div className="wh-section-header wh-section-header--clickable" onClick={() => toggleStaffWhCollapse('days')}>
                                            <div className="wh-section-title">
                                                <span className="wh-section-icon">📆</span>
                                                <div>
                                                    <h2>Çalışma Günleri</h2>
                                                    <p>{staffDays.filter(d => d.is_open).length} gün açık</p>
                                                </div>
                                            </div>
                                            <span className={`wh-collapse-arrow ${staffWhCollapsed['days'] ? 'wh-collapse-arrow--collapsed' : ''}`}>▼</span>
                                        </div>
                                        {!staffWhCollapsed['days'] && (
                                            <div className="wh-rows wh-rows--animated">
                                                {staffDays.map((day) => (
                                                    <div key={day.day_of_week} className={`wh-row ${!day.is_open ? 'wh-row--closed' : ''}`}>
                                                        <div className="wh-row-left">
                                                            <span className="wh-day-badge">{DAY_SHORT[day.day_of_week]}</span>
                                                            <span className="wh-day-name">{DAY_NAMES[day.day_of_week]}</span>
                                                        </div>
                                                        <div className="wh-row-center">
                                                            {day.is_open ? (
                                                                <div className="wh-time-pair">
                                                                    <input type="time" className="wh-time-input" value={day.open_time} onChange={(e) => updateStaffDay(day.day_of_week, 'open_time', e.target.value)} />
                                                                    <span className="wh-sep">—</span>
                                                                    <input type="time" className="wh-time-input" value={day.close_time} onChange={(e) => updateStaffDay(day.day_of_week, 'close_time', e.target.value)} />
                                                                </div>
                                                            ) : (
                                                                <span className="wh-closed-text">Kapalı</span>
                                                            )}
                                                        </div>
                                                        <div className="wh-row-right">
                                                            <label className="wh-toggle" onClick={(e) => e.stopPropagation()}>
                                                                <input type="checkbox" checked={day.is_open} onChange={(e) => updateStaffDay(day.day_of_week, 'is_open', e.target.checked)} />
                                                                <span className="wh-toggle-slider" />
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Mola Kartları */}
                                    {staffBreakGroups.map((group) => {
                                        const sKey = `break-${group.key}`;
                                        const isCollapsed = staffWhCollapsed[sKey];
                                        const activeDays = group.breaks.filter(b => b.is_active).length;
                                        return (
                                            <div key={group.key} className={`wh-section-card wh-section-card--break ${group.isDefault ? 'wh-section-card--default' : ''}`} style={{ margin: '12px 0 0' }}>
                                                <div className="wh-section-header wh-section-header--clickable" onClick={() => toggleStaffWhCollapse(sKey)}>
                                                    <div className="wh-section-title">
                                                        <span className="wh-section-icon wh-section-icon--break">{group.isDefault ? '🍽️' : '☕'}</span>
                                                        <div className="wh-break-name-wrap" onClick={(e) => e.stopPropagation()}>
                                                            <input type="text" className="wh-break-name-input" value={group.name}
                                                                onChange={(e) => updateStaffBreakGroupName(group.key, e.target.value)}
                                                                placeholder="Mola ismi..." maxLength={50} readOnly={group.isDefault} />
                                                            <p>{activeDays} gün aktif</p>
                                                        </div>
                                                    </div>
                                                    <div className="wh-section-header-actions" onClick={(e) => e.stopPropagation()}>
                                                        {!group.isDefault && <button type="button" className="wh-delete-group-btn" onClick={() => removeStaffBreakGroup(group.key)}>🗑️ Sil</button>}
                                                        {group.isDefault && <span className="wh-default-badge">Varsayılan</span>}
                                                    </div>
                                                    <span className={`wh-collapse-arrow ${isCollapsed ? 'wh-collapse-arrow--collapsed' : ''}`}>▼</span>
                                                </div>
                                                {!isCollapsed && (
                                                    <div className="wh-rows wh-rows--animated">
                                                        {group.breaks.map((brk) => {
                                                            const day = staffDays.find(d => d.day_of_week === brk.day_of_week);
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
                                                                                <input type="time" className="wh-time-input wh-time-input--break" value={brk.break_start}
                                                                                    onChange={(e) => updateStaffBreak(group.key, brk.day_of_week, 'break_start', e.target.value)} />
                                                                                <span className="wh-sep">—</span>
                                                                                <input type="time" className="wh-time-input wh-time-input--break" value={brk.break_end}
                                                                                    onChange={(e) => updateStaffBreak(group.key, brk.day_of_week, 'break_end', e.target.value)} />
                                                                            </div>
                                                                        ) : (
                                                                            <span className="wh-closed-text">{dayOpen ? 'Pasif' : '—'}</span>
                                                                        )}
                                                                    </div>
                                                                    <div className="wh-row-right">
                                                                        {dayOpen && (
                                                                            <label className="wh-toggle wh-toggle--small">
                                                                                <input type="checkbox" checked={brk.is_active}
                                                                                    onChange={(e) => updateStaffBreak(group.key, brk.day_of_week, 'is_active', e.target.checked)} />
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

                                    <button type="button" className="wh-add-group-btn" style={{ marginTop: '12px' }} onClick={addStaffBreakGroup}>+ Yeni Mola Ekle</button>
                                </div>
                            )}
                        </div>

                        <div className="staff-modal-footer">

                            <button className="btn btn-secondary" onClick={closeWhModal}>Kapat</button>
                            {staffDays.length > 0 && (
                                <button className="btn btn-primary" onClick={async () => {
                                    setWhSaving(true);
                                    const ok = await saveStaffHours();
                                    if (ok) { addToast('success', 'Çalışma saatleri kaydedildi'); await loadStaffHours(whModalStaff.id); }
                                    setWhSaving(false);
                                }} disabled={whSaving || whDeleting}>
                                    {whSaving ? 'Kaydediliyor...' : '💾 Kaydet'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
