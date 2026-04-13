import { useState, useEffect, useRef, useMemo, useCallback, forwardRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { ToastContainer, useToast } from '../components/Toast';
import './AppointmentCalendar.css';

// ─── Staff Colors (Fresha light pastel) ───
const STAFF_COLORS = [
    { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
    { bg: '#fce7f3', border: '#ec4899', text: '#9d174d' },
    { bg: '#dcfce7', border: '#22c55e', text: '#166534' },
    { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
    { bg: '#cffafe', border: '#06b6d4', text: '#155e75' },
    { bg: '#f3e8ff', border: '#a855f7', text: '#6b21a8' },
    { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' },
    { bg: '#ccfbf1', border: '#14b8a6', text: '#134e4a' },
];

const AVATAR_COLORS = [
    '#6366f1', '#ec4899', '#22c55e', '#f59e0b',
    '#06b6d4', '#a855f7', '#ef4444', '#14b8a6',
];

const VIEW_MODES = [
    { key: 'day', label: 'Gün' },
    { key: '3day', label: '3 Gün' },
    { key: 'week', label: 'Hafta' },
    { key: 'month', label: 'Ay' },
];

const HOUR_HEIGHT = 96; // px per hour (Fresha: 24px label + 72px margin = 96px)
const START_HOUR = 0;
const END_HOUR = 24;

// ─── Helpers ───
const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const DAY_NAMES = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const DAY_NAMES_SHORT = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

function formatDate(d) {
    return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function getToolbarDateLabel(date, mode) {
    switch (mode) {
        case 'day':
            return formatDate(date);
        case '3day': {
            const end = new Date(date);
            end.setDate(end.getDate() + 2);
            if (date.getMonth() === end.getMonth()) {
                return `${date.getDate()} - ${end.getDate()} ${MONTHS[date.getMonth()]}`;
            }
            return `${date.getDate()} ${MONTHS[date.getMonth()]} - ${end.getDate()} ${MONTHS[end.getMonth()]}`;
        }
        case 'week': {
            const end = new Date(date);
            end.setDate(end.getDate() + 6);
            if (date.getMonth() === end.getMonth()) {
                return `${date.getDate()} - ${end.getDate()} ${MONTHS[date.getMonth()]}`;
            }
            return `${date.getDate()} ${MONTHS[date.getMonth()]} - ${end.getDate()} ${MONTHS[end.getMonth()]}`;
        }
        case 'month':
            return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
        default:
            return formatDate(date);
    }
}

function formatTime(h, m) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

function getInitials(name) {
    return name?.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || '?';
}

function minutesToLabel(m) {
    if (m >= 60) {
        const h = Math.floor(m / 60);
        const min = m % 60;
        return min > 0 ? `${h}s ${min}dk` : `${h} saat`;
    }
    return `${m} dakika`;
}

function formatCurrency(v) {
    if (v == null) return '–';
    return `₺${Number(v).toFixed(2)}`;
}

// ─── Main Component ───
export default function AppointmentCalendar() {
    const { tenantUser } = useAuth();
    const { toasts, addToast, dismissToast } = useToast();
    const gridRef = useRef(null);

    // Core state
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('day');

    // Data
    const [staff, setStaff] = useState([]);
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [branchId, setBranchId] = useState(null);
    const [settings, setSettings] = useState({ appointment_interval_min: 15 });

    // Filter
    const [selectedStaffIds, setSelectedStaffIds] = useState([]);
    const [staffDropdownOpen, setStaffDropdownOpen] = useState(false);
    const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
    const [addDropdownOpen, setAddDropdownOpen] = useState(false);

    // Drawer
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerPanel, setDrawerPanel] = useState('services'); // 'services' | 'detail' | 'customer' | 'editService'
    const [pickMode, setPickMode] = useState(false);

    // Draft appointment
    const [draft, setDraft] = useState(null);
    const [editingServiceIdx, setEditingServiceIdx] = useState(null);
    const [editForm, setEditForm] = useState({});

    // Search
    const [svcSearch, setSvcSearch] = useState('');
    const [custSearch, setCustSearch] = useState('');

    // ─── Load Data ───
    useEffect(() => {
        if (tenantUser?.tenant_id) loadAllData();
    }, [tenantUser]);

    const loadAllData = async () => {
        try {
            setLoading(true);
            const { data: branch } = await supabase
                .from('branches')
                .select('id')
                .eq('tenant_id', tenantUser.tenant_id)
                .single();

            if (!branch) {
                addToast('error', 'Şube bulunamadı.');
                return;
            }
            setBranchId(branch.id);

            const [staffRes, svcRes, catRes, custRes, settingsRes] = await Promise.all([
                supabase.from('tenant_staff').select('id, first_name, last_name')
                    .eq('tenant_id', tenantUser.tenant_id).eq('is_active', true).order('first_name'),
                supabase.from('branch_service_variants')
                    .select('id, price_amount, duration_min, is_active, service_id, branch_services!inner(id, title, category_id, is_active, branch_id, service_categories(id, name))')
                    .eq('branch_services.branch_id', branch.id).eq('is_active', true).eq('branch_services.is_active', true),
                supabase.from('service_categories').select('id, name').order('name'),
                supabase.from('customers').select('id, first_name, last_name, email, phone_e164')
                    .eq('branch_id', branch.id).order('first_name'),
                supabase.from('branch_appointment_settings').select('*')
                    .eq('branch_id', branch.id).single(),
            ]);

            const staffList = staffRes.data || [];
            setStaff(staffList);
            setSelectedStaffIds(staffList.map(s => s.id));
            setServices(svcRes.data || []);
            setCategories(catRes.data || []);
            setCustomers(custRes.data || []);
            if (settingsRes.data) setSettings(settingsRes.data);
        } catch (err) {
            addToast('error', 'Veri yüklenirken hata: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // ─── Load Appointments ───
    useEffect(() => {
        if (branchId) loadAppointments();
    }, [branchId, currentDate, viewMode]);

    const loadAppointments = async () => {
        const { start, end } = getDateRange();
        const { data, error } = await supabase
            .from('appointments')
            .select(`
                id, customer_id, appointment_at, status, type, note,
                customers(id, first_name, last_name),
                appointment_services(
                    id, service_variant_id, staff_id, sequence_no, status,
                    duration_min, price_snapshot, start_at, end_at,
                    duration_snapshot, original_price, service_name_snapshot,
                    branch_service_variants(id, branch_services(title))
                )
            `)
            .eq('branch_id', branchId)
            .gte('appointment_at', start.toISOString())
            .lte('appointment_at', end.toISOString())
            .is('cancelled_at', null)
            .order('appointment_at');

        if (error) {
            addToast('error', 'Randevular yüklenirken hata.');
        } else {
            setAppointments(data || []);
        }
    };

    const getDateRange = () => {
        const start = new Date(currentDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);

        switch (viewMode) {
            case 'day': end.setDate(end.getDate() + 1); break;
            case '3day': end.setDate(end.getDate() + 3); break;
            case 'week': end.setDate(end.getDate() + 7); break;
            case 'month':
                start.setDate(1);
                end.setMonth(end.getMonth() + 1);
                end.setDate(0);
                end.setDate(end.getDate() + 1);
                break;
        }
        return { start, end };
    };

    // ─── Filtered Staff ───
    const filteredStaff = useMemo(() =>
        staff.filter(s => selectedStaffIds.includes(s.id)),
        [staff, selectedStaffIds]);

    // ─── Categorized Services ───
    const categorizedServices = useMemo(() => {
        const map = {};
        (services || []).forEach(sv => {
            const catName = sv.branch_services?.service_categories?.name || 'Diğer';
            if (!map[catName]) map[catName] = [];
            const fullName = sv.branch_services?.title || '';
            if (svcSearch && !fullName.toLowerCase().includes(svcSearch.toLowerCase())) return;
            map[catName].push({ ...sv, fullName });
        });
        return map;
    }, [services, svcSearch]);

    // ─── Filtered Customers ───
    const filteredCustomers = useMemo(() => {
        if (!custSearch) return customers;
        const q = custSearch.toLowerCase();
        return customers.filter(c =>
            `${c.first_name} ${c.last_name}`.toLowerCase().includes(q) ||
            (c.email && c.email.toLowerCase().includes(q)) ||
            (c.phone && c.phone.includes(q))
        );
    }, [customers, custSearch]);

    // ─── Navigation ───
    const navigate = (dir) => {
        const d = new Date(currentDate);
        switch (viewMode) {
            case 'day': d.setDate(d.getDate() + dir); break;
            case '3day': d.setDate(d.getDate() + dir * 3); break;
            case 'week': d.setDate(d.getDate() + dir * 7); break;
            case 'month': d.setMonth(d.getMonth() + dir); break;
        }
        setCurrentDate(d);
    };

    const goToday = () => setCurrentDate(new Date());

    // ─── Click on Calendar ───
    const handleCalendarClick = (staffId, hour, minute) => {
        const appointmentAt = new Date(currentDate);
        appointmentAt.setHours(hour, minute, 0, 0);

        setDraft({
            customer_id: null,
            customer: null,
            appointment_at: appointmentAt,
            services: [],
        });
        setDrawerPanel('services');
        setDrawerOpen(true);
        setPickMode(false);
        if (staffId) {
            // Pre-select staff for the first service
            setDraft(prev => ({ ...prev, _defaultStaffId: staffId }));
        }
    };

    // ─── Add Service to Draft ───
    const addServiceToDraft = (variant) => {
        const staffId = draft?._defaultStaffId || staff[0]?.id;
        const staffMember = staff.find(s => s.id === staffId);
        const prevServices = draft?.services || [];

        // Calculate start time
        let startAt;
        if (prevServices.length > 0) {
            const lastSvc = prevServices[prevServices.length - 1];
            startAt = new Date(lastSvc.end_at);
        } else {
            startAt = new Date(draft.appointment_at);
        }

        const endAt = new Date(startAt);
        endAt.setMinutes(endAt.getMinutes() + variant.duration_min);

        const fullName = variant.branch_services?.title || '';

        const newService = {
            service_variant_id: variant.id,
            staff_id: staffId,
            staff_name: staffMember ? `${staffMember.first_name} ${staffMember.last_name}` : '',
            sequence_no: prevServices.length + 1,
            duration_min: variant.duration_min,
            duration_snapshot: variant.duration_min,
            price_snapshot: variant.price_amount,
            original_price: variant.price_amount,
            service_name_snapshot: fullName,
            start_at: startAt.toISOString(),
            end_at: endAt.toISOString(),
            status: 'scheduled',
        };

        setDraft(prev => ({
            ...prev,
            services: [...prev.services, newService],
        }));
        setDrawerPanel('detail');
    };

    // ─── Remove Service from Draft ───
    const removeServiceFromDraft = (idx) => {
        setDraft(prev => {
            const updated = [...prev.services];
            updated.splice(idx, 1);
            // Recalculate times
            return { ...prev, services: recalcTimes(updated, prev.appointment_at) };
        });
    };

    // ─── Recalc sequential times ───
    const recalcTimes = (svcs, baseTime) => {
        let cursor = new Date(baseTime);
        return svcs.map((s, i) => {
            const start = new Date(cursor);
            const end = new Date(start);
            end.setMinutes(end.getMinutes() + s.duration_min);
            cursor = end;
            return { ...s, sequence_no: i + 1, start_at: start.toISOString(), end_at: end.toISOString() };
        });
    };

    // ─── Select Customer ───
    const selectCustomer = (customer) => {
        setDraft(prev => ({
            ...prev,
            customer_id: customer?.id || null,
            customer: customer || null,
        }));
        setDrawerPanel('detail');
        setCustSearch('');
    };

    // ─── Edit Service ───
    const openEditService = (idx) => {
        const svc = draft.services[idx];
        setEditingServiceIdx(idx);
        setEditForm({
            staff_id: svc.staff_id,
            price_snapshot: svc.price_snapshot,
            duration_min: svc.duration_min,
            start_hour: new Date(svc.start_at).getHours(),
            start_minute: new Date(svc.start_at).getMinutes(),
        });
        setDrawerPanel('editService');
    };

    const applyEditService = () => {
        setDraft(prev => {
            const updated = [...prev.services];
            const svc = { ...updated[editingServiceIdx] };
            const staffMember = staff.find(s => s.id === editForm.staff_id);

            svc.staff_id = editForm.staff_id;
            svc.staff_name = staffMember ? `${staffMember.first_name} ${staffMember.last_name}` : '';
            svc.price_snapshot = Number(editForm.price_snapshot);
            svc.duration_min = Number(editForm.duration_min);

            const startAt = new Date(svc.start_at);
            startAt.setHours(editForm.start_hour, editForm.start_minute, 0, 0);
            svc.start_at = startAt.toISOString();
            const endAt = new Date(startAt);
            endAt.setMinutes(endAt.getMinutes() + svc.duration_min);
            svc.end_at = endAt.toISOString();

            updated[editingServiceIdx] = svc;

            // Recalculate subsequent services
            for (let i = editingServiceIdx + 1; i < updated.length; i++) {
                const prevEnd = new Date(updated[i - 1].end_at);
                const thisStart = prevEnd;
                const thisEnd = new Date(thisStart);
                thisEnd.setMinutes(thisEnd.getMinutes() + updated[i].duration_min);
                updated[i] = { ...updated[i], start_at: thisStart.toISOString(), end_at: thisEnd.toISOString() };
            }

            return { ...prev, services: updated };
        });
        setDrawerPanel('detail');
        setEditingServiceIdx(null);
    };

    // ─── Save Appointment (Create or Update) ───
    const saveAppointment = async () => {
        if (!draft || draft.services.length === 0) {
            addToast('error', 'En az bir hizmet eklemelisiniz.');
            return;
        }

        try {
            const isUpdate = !!draft.id;
            let appointmentId = draft.id;

            if (isUpdate) {
                // UPDATE existing appointment
                const { error: updErr } = await supabase
                    .from('appointments')
                    .update({
                        customer_id: draft.customer_id || null,
                        appointment_at: draft.appointment_at.toISOString(),
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', appointmentId);

                if (updErr) throw updErr;

                // Delete old services and re-insert
                const { error: delErr } = await supabase
                    .from('appointment_services')
                    .delete()
                    .eq('appointment_id', appointmentId);

                if (delErr) throw delErr;
            } else {
                // CREATE new appointment
                const { data: appt, error: apptErr } = await supabase
                    .from('appointments')
                    .insert({
                        branch_id: branchId,
                        customer_id: draft.customer_id || null,
                        type: 'appointment',
                        appointment_at: draft.appointment_at.toISOString(),
                        status: 'booked',
                        source: 'panel',
                        created_by: tenantUser.id,
                    })
                    .select()
                    .single();

                if (apptErr) throw apptErr;
                appointmentId = appt.id;
            }

            // Insert services (for both create & update)
            const svcRows = draft.services.map(s => ({
                branch_id: branchId,
                appointment_id: appointmentId,
                service_variant_id: s.service_variant_id,
                staff_id: s.staff_id,
                sequence_no: s.sequence_no,
                duration_min: s.duration_min,
                duration_snapshot: s.duration_snapshot,
                price_snapshot: s.price_snapshot,
                original_price: s.original_price,
                service_name_snapshot: s.service_name_snapshot,
                start_at: s.start_at,
                end_at: s.end_at,
                status: 'scheduled',
            }));

            const { error: svcErr } = await supabase
                .from('appointment_services')
                .insert(svcRows);

            if (svcErr) throw svcErr;

            addToast('success', isUpdate ? 'Randevu güncellendi!' : 'Randevu kaydedildi!');
            setDrawerOpen(false);
            setDraft(null);
            await loadAppointments();
        } catch (err) {
            addToast('error', 'Kayıt hatası: ' + err.message);
        }
    };

    // ─── Cancel Appointment ───
    const cancelAppointment = async () => {
        if (!draft?.id) return;
        if (!confirm('Bu randevuyu iptal etmek istediğinize emin misiniz?')) return;

        try {
            const { error } = await supabase
                .from('appointments')
                .update({
                    status: 'cancelled',
                    cancelled_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .eq('id', draft.id);

            if (error) throw error;

            addToast('success', 'Randevu iptal edildi.');
            setDrawerOpen(false);
            setDraft(null);
            await loadAppointments();
        } catch (err) {
            addToast('error', 'İptal hatası: ' + err.message);
        }
    };

    // ─── Total Price ───
    const draftTotal = useMemo(() => {
        if (!draft) return 0;
        return draft.services.reduce((sum, s) => sum + (Number(s.price_snapshot) || 0), 0);
    }, [draft]);

    const draftTotalDuration = useMemo(() => {
        if (!draft) return 0;
        return draft.services.reduce((sum, s) => sum + (Number(s.duration_min) || 0), 0);
    }, [draft]);

    // ─── Appointment blocks for a staff on a day ───
    const getBlocksForStaff = useCallback((staffId, date) => {
        return appointments.filter(appt => {
            const services = appt.appointment_services || [];
            return services.some(s => {
                const sDate = new Date(s.start_at);
                return s.staff_id === staffId && isSameDay(sDate, date);
            });
        }).flatMap(appt => {
            const customer = appt.customers;
            const custName = customer ? `${customer.first_name} ${customer.last_name}` : 'Randevusuz Giriş';
            return (appt.appointment_services || [])
                .filter(s => s.staff_id === staffId && isSameDay(new Date(s.start_at), date))
                .map(s => ({
                    ...s,
                    appointmentId: appt.id,
                    customerName: custName,
                    serviceName: s.service_name_snapshot ||
                        (s.branch_service_variants?.branch_services?.title || ''),
                    status: appt.status,
                }));
        });
    }, [appointments]);

    // ─── Draft blocks for preview ───
    const getDraftBlocksForStaff = useCallback((staffId, date) => {
        if (!draft) return [];
        return draft.services
            .filter(s => s.staff_id === staffId && isSameDay(new Date(s.start_at), date))
            .map(s => ({
                ...s,
                customerName: draft.customer ? `${draft.customer.first_name} ${draft.customer.last_name}` : 'Randevusuz Giriş',
                serviceName: s.service_name_snapshot,
                isDraft: true,
            }));
    }, [draft]);

    // ─── Click off dropdown ───
    useEffect(() => {
        const handler = (e) => {
            if (addDropdownOpen && !e.target.closest('.cal-add-wrap')) setAddDropdownOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [addDropdownOpen]);

    // ─── Scroll to business hours on load ───
    useEffect(() => {
        if (!loading && gridRef.current) {
            setTimeout(() => {
                gridRef.current.scrollTop = 8 * HOUR_HEIGHT; // Scroll to 08:00
            }, 100);
        }
    }, [loading, viewMode]);

    // ─── Render ───
    if (loading) {
        return (
            <div className="cal-container">
                <div className="cal-loading">
                    <div className="cal-loading-spinner" />
                    <span>Takvim yükleniyor...</span>
                </div>
                <ToastContainer toasts={toasts} dismissToast={dismissToast} />
            </div>
        );
    }

    return (
        <div className="cal-container">
            {/* Pick Mode Bar */}
            {pickMode && (
                <div className="cal-pick-bar">
                    <span>Rezervasyon yapmak için bir zaman seçin.</span>
                    <button className="cal-pick-bar-btn" onClick={() => setPickMode(false)}>Kapat</button>
                </div>
            )}

            {/* ═══ Toolbar (Fresha-exact) ═══ */}
            <div className="cal-toolbar">
                <div className="cal-toolbar-left">
                    {/* Today button */}
                    <button className="cal-btn" onClick={goToday}>Bugün</button>

                    {/* Navigation button group (joined: ◀ | date | ▶) */}
                    <div className="cal-btn-group" role="group">
                        <button className="cal-btn cal-btn-group-item" onClick={() => navigate(-1)} aria-label="Önceki">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button className="cal-btn cal-btn-group-item cal-btn-group-date" onClick={() => { }}>
                            {getToolbarDateLabel(currentDate, viewMode)}
                        </button>
                        <button className="cal-btn cal-btn-group-item" onClick={() => navigate(1)} aria-label="Sonraki">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    {/* Staff Filter dropdown */}
                    <div className="cal-staff-filter">
                        <button
                            className={`cal-staff-filter-btn${staffDropdownOpen ? ' is-open' : ''}`}
                            onClick={() => setStaffDropdownOpen(!staffDropdownOpen)}
                        >
                            <span>
                                {selectedStaffIds.length === staff.length ? 'Tüm takım' :
                                    selectedStaffIds.length === 1 ? staff.find(s => s.id === selectedStaffIds[0])?.first_name :
                                        selectedStaffIds.length === 0 ? 'Takım seç' :
                                            `${selectedStaffIds.length} kişi`}
                            </span>
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        {staffDropdownOpen && (
                            <>
                                <div className="cal-staff-overlay" onClick={() => setStaffDropdownOpen(false)} />
                                <div className="cal-staff-dropdown">
                                    {/* Tüm takım option */}
                                    <div className="cal-staff-dropdown-group">
                                        <button
                                            className={`cal-staff-option${selectedStaffIds.length === staff.length ? ' cal-staff-option--active' : ''}`}
                                            onClick={() => {
                                                setSelectedStaffIds(staff.map(s => s.id));
                                                setStaffDropdownOpen(false);
                                            }}
                                        >
                                            <span className="cal-staff-option-icon">
                                                <svg fill="currentColor" viewBox="0 0 32 32">
                                                    <path d="M30.6 18.8a1 1 0 0 1-1.4-.2A6.45 6.45 0 0 0 24 16a1 1 0 0 1 0-2 3 3 0 1 0-2.905-3.75 1 1 0 0 1-1.937-.5 5 5 0 1 1 8.217 4.939 8.5 8.5 0 0 1 3.429 2.71A1 1 0 0 1 30.6 18.8m-6.735 7.7a1 1 0 1 1-1.73 1 7.125 7.125 0 0 0-12.27 0 1 1 0 1 1-1.73-1 9 9 0 0 1 4.217-3.74 6 6 0 1 1 7.296 0 9 9 0 0 1 4.217 3.74M16 22a4 4 0 1 0 0-8 4 4 0 0 0 0 8m-7-7a1 1 0 0 0-1-1 3 3 0 1 1 2.905-3.75 1 1 0 0 0 1.938-.5 5 5 0 1 0-8.218 4.939 8.5 8.5 0 0 0-3.425 2.71A1 1 0 1 0 2.8 18.6 6.45 6.45 0 0 1 8 16a1 1 0 0 0 1-1" />
                                                </svg>
                                            </span>
                                            <span>Tüm takım</span>
                                        </button>
                                    </div>

                                    {/* Divider */}
                                    <div className="cal-staff-divider" />

                                    {/* Team members section */}
                                    <div className="cal-staff-section-header">
                                        <span className="cal-staff-section-label">Takım üyeleri</span>
                                        <button className="cal-staff-clear" onClick={() => {
                                            setSelectedStaffIds([]);
                                        }}>
                                            Temizle
                                        </button>
                                    </div>
                                    <div className="cal-staff-dropdown-group">
                                        {staff.map((s, i) => (
                                            <label key={s.id} className="cal-staff-member">
                                                <span className="cal-staff-cb">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedStaffIds.includes(s.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedStaffIds(prev => [...prev, s.id]);
                                                            } else {
                                                                setSelectedStaffIds(prev => prev.filter(id => id !== s.id));
                                                            }
                                                        }}
                                                    />
                                                    <span className="cal-staff-cb-box">
                                                        <span className="cal-staff-cb-check">
                                                            <span className="cal-staff-cb-check-v" />
                                                            <span className="cal-staff-cb-check-h" />
                                                        </span>
                                                    </span>
                                                </span>
                                                <span className="cal-staff-avatar-sm" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                                                    {getInitials(`${s.first_name} ${s.last_name}`)}
                                                </span>
                                                <span className="cal-staff-name">{s.first_name} {s.last_name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                </div>

                <div className="cal-toolbar-right">


                    {/* View mode dropdown (Fresha-style) */}
                    <div className="cal-view-filter">
                        <div className="cal-btn-group" role="group">
                            <button className="cal-btn cal-btn-group-item cal-btn-group-icon" title="Varsayılan görünüme sıfırla" onClick={() => setViewMode('day')}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M14.5 5.5C13.3 4.3 11.7 3.5 10 3.5C6.4 3.5 3.5 6.4 3.5 10C3.5 13.6 6.4 16.5 10 16.5C13 16.5 15.5 14.5 16.3 11.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M16.5 3.5V7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button
                                className={`cal-btn cal-btn-group-item cal-btn-group-view${viewDropdownOpen ? ' is-open' : ''}`}
                                onClick={() => setViewDropdownOpen(!viewDropdownOpen)}
                            >
                                <span>{VIEW_MODES.find(v => v.key === viewMode)?.label || 'Gün'}</span>
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginLeft: 2 }}>
                                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                        {viewDropdownOpen && (
                            <>
                                <div className="cal-view-overlay" onClick={() => setViewDropdownOpen(false)} />
                                <div className="cal-view-dropdown">
                                    {/* Day */}
                                    <button
                                        className={`cal-view-option${viewMode === 'day' ? ' cal-view-option--active' : ''}`}
                                        onClick={() => { setViewMode('day'); setViewDropdownOpen(false); }}
                                    >
                                        <span className="cal-view-option-icon">
                                            <svg fill="currentColor" viewBox="0 0 32 32">
                                                <path fillRule="evenodd" d="M4 5a1 1 0 0 1 1-1h22a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1m0 6a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm22 0H6v10h20zM4 27a1 1 0 0 1 1-1h22a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                        <span>Gün</span>
                                    </button>
                                    {/* 3 Day */}
                                    <button
                                        className={`cal-view-option${viewMode === '3day' ? ' cal-view-option--active' : ''}`}
                                        onClick={() => { setViewMode('3day'); setViewDropdownOpen(false); }}
                                    >
                                        <span className="cal-view-option-icon">
                                            <svg fill="currentColor" viewBox="0 0 32 32">
                                                <path fillRule="evenodd" d="M3 7a2 2 0 0 1 2-2h22a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm8 0H5v18h6zm2 0v18h6V7zm8 0v18h6V7z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                        <span>3 Gün</span>
                                    </button>
                                    {/* Week */}
                                    <button
                                        className={`cal-view-option${viewMode === 'week' ? ' cal-view-option--active' : ''}`}
                                        onClick={() => { setViewMode('week'); setViewDropdownOpen(false); }}
                                    >
                                        <span className="cal-view-option-icon">
                                            <svg fill="currentColor" viewBox="0 0 32 32">
                                                <path fillRule="evenodd" d="M3 7a2 2 0 0 1 2-2h22a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm6 0H5v18h4zm2 0v18h4V7zm6 0v18h4V7zm6 0v18h4V7z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                        <span>Hafta</span>
                                    </button>
                                    {/* Month */}
                                    <button
                                        className={`cal-view-option${viewMode === 'month' ? ' cal-view-option--active' : ''}`}
                                        onClick={() => { setViewMode('month'); setViewDropdownOpen(false); }}
                                    >
                                        <span className="cal-view-option-icon">
                                            <svg fill="currentColor" viewBox="0 0 32 32">
                                                <path fillRule="evenodd" d="M10 2a1 1 0 0 1 1 1v1h10V3a1 1 0 1 1 2 0v1h3a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V3a1 1 0 0 1 1-1M9 6H6v4h20V6h-3v1a1 1 0 1 1-2 0V6H11v1a1 1 0 1 1-2 0zm17 6H6v14h20zM9 16a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1m5.5 0a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1m5.5 0a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1M9 22a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1m5.5 0a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1m5.5 0a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                        <span>Ay</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Add Button (Fresha-style — #0D0D0D) */}
                    <div className="cal-add-wrap">
                        <button
                            className={`cal-btn cal-btn--primary${addDropdownOpen ? ' is-open' : ''}`}
                            onClick={() => setAddDropdownOpen(!addDropdownOpen)}
                        >
                            <span>Ekle</span>
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginLeft: 4 }}>
                                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        {addDropdownOpen && (
                            <>
                                <div className="cal-add-overlay" onClick={() => setAddDropdownOpen(false)} />
                                <div className="cal-add-dropdown">
                                    {/* Randevu (Appointment) */}
                                    <button className="cal-add-option" onClick={() => {
                                        setPickMode(true);
                                        setAddDropdownOpen(false);
                                    }}>
                                        <span className="cal-add-option-icon">
                                            <svg fill="currentColor" viewBox="0 0 32 32">
                                                <path fillRule="evenodd" d="M10 2a1 1 0 0 1 1 1v1h10V3a1 1 0 1 1 2 0v1h3a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V3a1 1 0 0 1 1-1M9 6H6v4h20V6h-3v1a1 1 0 1 1-2 0V6H11v1a1 1 0 1 1-2 0zm17 6H6v14h20zm-10 2.5a1 1 0 0 1 1 1V18h2.5a1 1 0 1 1 0 2H17v2.5a1 1 0 1 1-2 0V20h-2.5a1 1 0 1 1 0-2H15v-2.5a1 1 0 0 1 1-1" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                        <span>Randevu ekle</span>
                                    </button>
                                    {/* Engellenen Süre (Blocked time) */}
                                    <button className="cal-add-option" onClick={() => {
                                        setAddDropdownOpen(false);
                                    }}>
                                        <span className="cal-add-option-icon">
                                            <svg fill="currentColor" viewBox="0 0 32 32">
                                                <path fillRule="evenodd" d="M10 2a1 1 0 0 1 1 1v1h10V3a1 1 0 1 1 2 0v1h3a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V3a1 1 0 0 1 1-1M9 6H6v4h20V6h-3v1a1 1 0 1 1-2 0V6H11v1a1 1 0 1 1-2 0zm17 6H6v14h20zm-13.707 3.293a1 1 0 0 1 1.414 0L16 17.586l2.293-2.293a1 1 0 0 1 1.414 1.414L17.414 19l2.293 2.293a1 1 0 0 1-1.414 1.414L16 20.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L14.586 19l-2.293-2.293a1 1 0 0 1 0-1.414" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                        <span>Bloklu zaman ekle</span>
                                    </button>
                                    {/* Satış (Sale) */}
                                    <button className="cal-add-option" onClick={() => {
                                        setAddDropdownOpen(false);
                                    }}>
                                        <span className="cal-add-option-icon">
                                            <svg fill="currentColor" viewBox="0 0 32 32">
                                                <path fillRule="evenodd" d="M15.145 2.256a2 2 0 0 1 1.8.55l13.046 13.046a1.99 1.99 0 0 1 0 2.834L18.686 29.99a1.99 1.99 0 0 1-2.834 0L2.806 16.945a2 2 0 0 1-.55-1.8v-.003L4.27 5.054a1 1 0 0 1 .785-.785l10.088-2.012zm.385 1.963L6.1 6.1 4.22 15.53l13.05 13.05 11.31-11.311z" clipRule="evenodd" />
                                                <path d="M10.5 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                                            </svg>
                                        </span>
                                        <span>Satış ekle</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            {viewMode === 'day' && (
                <DayView
                    ref={gridRef}
                    staff={filteredStaff}
                    date={currentDate}
                    getBlocksForStaff={getBlocksForStaff}
                    getDraftBlocksForStaff={getDraftBlocksForStaff}
                    onSlotClick={handleCalendarClick}
                    pickMode={pickMode}
                    onAppointmentClick={(apptId) => {
                        // Open existing appointment
                        const appt = appointments.find(a => a.id === apptId);
                        if (appt) {
                            const customer = appt.customers;
                            setDraft({
                                id: appt.id,
                                customer_id: appt.customer_id,
                                customer: customer,
                                appointment_at: new Date(appt.appointment_at),
                                services: (appt.appointment_services || []).map(s => {
                                    const sm = staff.find(st => st.id === s.staff_id);
                                    return {
                                        ...s,
                                        staff_name: sm ? `${sm.first_name} ${sm.last_name}` : '',
                                        service_name_snapshot: s.service_name_snapshot || s.branch_service_variants?.branch_services?.title || '',
                                    };
                                }),
                            });
                            setDrawerPanel('detail');
                            setDrawerOpen(true);
                        }
                    }}
                />
            )}

            {/* 3-Day View */}
            {viewMode === '3day' && (
                <ThreeDayView
                    ref={gridRef}
                    staff={filteredStaff}
                    currentDate={currentDate}
                    onAppointmentClick={(apptId) => {
                        const appt = appointments.find(a => a.id === apptId);
                        if (appt) {
                            const customer = appt.customers;
                            setDraft({
                                id: appt.id,
                                customer_id: appt.customer_id,
                                customer: customer,
                                appointment_at: new Date(appt.appointment_at),
                                services: (appt.appointment_services || []).map(s => {
                                    const sm = staff.find(st => st.id === s.staff_id);
                                    return {
                                        ...s,
                                        staff_name: sm ? `${sm.first_name} ${sm.last_name}` : '',
                                        service_name_snapshot: s.service_name_snapshot || s.branch_service_variants?.branch_services?.title || '',
                                    };
                                }),
                            });
                            setDrawerPanel('detail');
                            setDrawerOpen(true);
                        }
                    }}
                    onSlotClick={handleCalendarClick}
                />
            )}

            {/* Week View */}
            {viewMode === 'week' && (
                <ThreeDayView
                    ref={gridRef}
                    staff={filteredStaff}
                    currentDate={currentDate}
                    dayCount={7}
                    onAppointmentClick={(apptId) => {
                        const appt = appointments.find(a => a.id === apptId);
                        if (appt) {
                            const customer = appt.customers;
                            setDraft({
                                id: appt.id,
                                customer_id: appt.customer_id,
                                customer: customer,
                                appointment_at: new Date(appt.appointment_at),
                                services: (appt.appointment_services || []).map(s => {
                                    const sm = staff.find(st => st.id === s.staff_id);
                                    return {
                                        ...s,
                                        staff_name: sm ? `${sm.first_name} ${sm.last_name}` : '',
                                        service_name_snapshot: s.service_name_snapshot || s.branch_service_variants?.branch_services?.title || '',
                                    };
                                }),
                            });
                            setDrawerPanel('detail');
                            setDrawerOpen(true);
                        }
                    }}
                    onSlotClick={handleCalendarClick}
                />
            )}

            {/* MonthView */}
            {viewMode === 'month' && (
                <MonthView
                    currentDate={currentDate}
                    onDayClick={(date) => {
                        setCurrentDate(date);
                        setViewMode('day');
                    }}
                />
            )}

            {/* ═══ FRESHA-STYLE DRAWER ═══ */}
            {drawerOpen && (
                <>
                    {/* Floating Close + Expand buttons (on calendar, left of drawer) */}
                    <div className="cal-drawer-float-btns">
                        <button className="cal-drawer-float-btn" onClick={() => { setDrawerOpen(false); setDraft(null); setPickMode(false); }}>✕</button>
                    </div>

                    <div className="cal-drawer">
                        {/* ─── LEFT STRIP: Customer ─── */}
                        <div className="cal-drawer-left" onClick={() => {
                            if (drawerPanel !== 'customer') setDrawerPanel('customer');
                        }} style={{ cursor: 'pointer' }}>
                            <div className={`cal-drawer-left-icon ${draft?.customer ? 'cal-drawer-left-icon--filled' : ''}`}>
                                {draft?.customer
                                    ? getInitials(`${draft.customer.first_name} ${draft.customer.last_name}`)
                                    : '👤'}
                            </div>
                            <span className="cal-drawer-left-label">
                                {draft?.customer
                                    ? `${draft.customer.first_name} ${draft.customer.last_name}`
                                    : 'Müşteri ekle'}
                            </span>
                            <span className="cal-drawer-left-sublabel">
                                {draft?.customer
                                    ? ''
                                    : 'Ya da rezervasyonsuz gelenler için boş bırakın.'}
                            </span>

                        </div>

                        {/* ─── RIGHT PANEL: Content ─── */}
                        <div className="cal-drawer-right">
                            {/* Panel Header */}
                            <div className="cal-drawer-header">
                                {(drawerPanel === 'editService' || drawerPanel === 'customer') && (
                                    <button className="cal-drawer-back" onClick={() => setDrawerPanel(draft?.services?.length > 0 ? 'detail' : 'services')}>
                                        ← Geri
                                    </button>
                                )}
                                <span className="cal-drawer-title">
                                    {drawerPanel === 'services' && 'Bir hizmet seçin'}
                                    {drawerPanel === 'detail' && (
                                        <>
                                            <div className="cal-detail-date-row">
                                                <span className="cal-detail-date">{formatDate(draft?.appointment_at || new Date())}</span>
                                                <span className="cal-detail-date-chevron">▾</span>
                                            </div>
                                            <div className="cal-detail-time">
                                                {draft && formatTime(draft.appointment_at.getHours(), draft.appointment_at.getMinutes())} · Tekrarlanmaz
                                            </div>
                                        </>
                                    )}
                                    {drawerPanel === 'customer' && 'Bir müşteri seçin'}
                                    {drawerPanel === 'editService' && 'Düzenleme hizmeti'}
                                </span>
                            </div>

                            {/* Panel Body */}
                            <div className="cal-drawer-body">
                                {/* Panel A: Service Picker */}
                                {drawerPanel === 'services' && (
                                    <div>
                                        <div className="cal-svc-search-wrap">
                                            <span className="cal-svc-search-icon">🔍</span>
                                            <input
                                                className="cal-svc-search"
                                                placeholder="Hizmet adına göre ara..."
                                                value={svcSearch}
                                                onChange={e => setSvcSearch(e.target.value)}
                                            />
                                        </div>
                                        {Object.entries(categorizedServices).map(([cat, items]) => (
                                            <div key={cat} className="cal-svc-category">
                                                <div className="cal-svc-category-title">
                                                    {cat}
                                                    <span className="cal-svc-category-count">{items.length}</span>
                                                </div>
                                                {items.map(sv => (
                                                    <button key={sv.id} className="cal-svc-item" onClick={() => addServiceToDraft(sv)}>
                                                        <div className="cal-svc-item-info">
                                                            <span className="cal-svc-item-name">{sv.fullName}</span>
                                                            <span className="cal-svc-item-duration">{sv.duration_min} dakika</span>
                                                        </div>
                                                        <span className="cal-svc-item-price">{formatCurrency(sv.price_amount)}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Panel B: Appointment Detail */}
                                {drawerPanel === 'detail' && draft && (
                                    <div>
                                        {/* Services */}
                                        <div className="cal-detail-section-title">Hizmetler</div>
                                        {draft.services.map((svc, idx) => {
                                            const staffMember = staff.find(st => st.id === svc.staff_id);
                                            const staffIdx = staff.indexOf(staffMember);
                                            return (
                                                <div key={idx} className="cal-detail-service">
                                                    <div className="cal-detail-svc-left">
                                                        <div className="cal-detail-svc-bar" style={{ background: STAFF_COLORS[staffIdx >= 0 ? staffIdx % STAFF_COLORS.length : 0]?.border || '#6366f1' }} />
                                                        <div className="cal-detail-svc-info">
                                                            <div className="cal-detail-svc-name">{svc.service_name_snapshot}</div>
                                                            <div className="cal-detail-svc-meta">
                                                                {formatTime(new Date(svc.start_at).getHours(), new Date(svc.start_at).getMinutes())} · {svc.duration_min}dk · {svc.staff_name || (staffMember ? `${staffMember.first_name} ${staffMember.last_name}` : '')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="cal-detail-svc-right">
                                                        <span className="cal-detail-svc-price">{formatCurrency(svc.price_snapshot)}</span>
                                                        <div className="cal-detail-svc-btns">
                                                            <button className="cal-detail-svc-btn" onClick={() => openEditService(idx)}>✏️</button>
                                                            <button className="cal-detail-svc-btn cal-detail-svc-btn--delete" onClick={() => removeServiceFromDraft(idx)}>🗑️</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Add More Service */}
                                        <button className="cal-add-svc-btn" onClick={() => { setDrawerPanel('services'); setSvcSearch(''); }}>
                                            <span className="cal-add-svc-icon">+</span> Hizmet ekle
                                        </button>

                                        {draft.services.length > 0 && (
                                            <div className="cal-detail-duration-total">
                                                {minutesToLabel(draftTotalDuration)}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Panel C: Customer Picker */}
                                {drawerPanel === 'customer' && (
                                    <div>
                                        <div className="cal-svc-search-wrap">
                                            <span className="cal-svc-search-icon">🔍</span>
                                            <input
                                                className="cal-svc-search"
                                                placeholder="Müşteri arayın..."
                                                value={custSearch}
                                                onChange={e => setCustSearch(e.target.value)}
                                            />
                                        </div>

                                        <button className="cal-cust-walkin" onClick={() => selectCustomer(null)}>
                                            🚶 Randevusuz Giriş
                                        </button>

                                        <div className="cal-cust-list">
                                            {filteredCustomers.map(c => (
                                                <button key={c.id} className="cal-cust-item" onClick={() => selectCustomer(c)}>
                                                    <div className="cal-cust-avatar">
                                                        {getInitials(`${c.first_name} ${c.last_name}`)}
                                                    </div>
                                                    <div>
                                                        <div className="cal-cust-name">{c.first_name} {c.last_name}</div>
                                                        <div className="cal-cust-contact">{c.phone_e164 || c.email}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Panel D: Edit Service */}
                                {drawerPanel === 'editService' && editingServiceIdx !== null && (
                                    <div>
                                        <div className="cal-edit-service-selector">
                                            <span className="cal-edit-service-name">
                                                {draft.services[editingServiceIdx]?.service_name_snapshot}, {editForm.duration_min} dakika
                                            </span>
                                            <span className="cal-edit-arrow">›</span>
                                        </div>

                                        {/* Staff */}
                                        <div className="cal-edit-field">
                                            <label className="cal-edit-label">Takım üyesi</label>
                                            <div className="cal-edit-staff-row">
                                                <div className="cal-edit-staff-avatar" style={{ background: AVATAR_COLORS[staff.findIndex(s => s.id === editForm.staff_id) % AVATAR_COLORS.length] || '#6366f1' }}>
                                                    {(() => {
                                                        const s = staff.find(s => s.id === editForm.staff_id);
                                                        return s ? getInitials(`${s.first_name} ${s.last_name}`) : '?';
                                                    })()}
                                                </div>
                                                <select
                                                    className="cal-edit-select"
                                                    style={{ background: 'transparent', border: 'none', flex: 1, padding: 0 }}
                                                    value={editForm.staff_id || ''}
                                                    onChange={e => setEditForm(p => ({ ...p, staff_id: e.target.value }))}
                                                >
                                                    {staff.map(s => (
                                                        <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="cal-edit-field">
                                            <label className="cal-edit-label">Hizmet fiyatı</label>
                                            <input
                                                className="cal-edit-input"
                                                type="number"
                                                value={editForm.price_snapshot || ''}
                                                onChange={e => setEditForm(p => ({ ...p, price_snapshot: e.target.value }))}
                                            />
                                        </div>

                                        {/* Start Time & Duration */}
                                        <div className="cal-edit-field">
                                            <div className="cal-edit-row">
                                                <div>
                                                    <label className="cal-edit-label">Başlangıç saati</label>
                                                    <select
                                                        className="cal-edit-select"
                                                        value={`${editForm.start_hour}:${editForm.start_minute}`}
                                                        onChange={e => {
                                                            const [h, m] = e.target.value.split(':').map(Number);
                                                            setEditForm(p => ({ ...p, start_hour: h, start_minute: m }));
                                                        }}
                                                    >
                                                        {Array.from({ length: 24 * (60 / (settings.appointment_interval_min || 15)) }, (_, i) => {
                                                            const interval = settings.appointment_interval_min || 15;
                                                            const totalMin = i * interval;
                                                            const h = Math.floor(totalMin / 60);
                                                            const m = totalMin % 60;
                                                            if (h >= 24) return null;
                                                            return <option key={i} value={`${h}:${m}`}>{formatTime(h, m)}</option>;
                                                        })}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="cal-edit-label">Süre</label>
                                                    <select
                                                        className="cal-edit-select"
                                                        value={editForm.duration_min}
                                                        onChange={e => setEditForm(p => ({ ...p, duration_min: Number(e.target.value) }))}
                                                    >
                                                        {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 75, 90, 105, 120, 150, 180, 210, 240].map(m => (
                                                            <option key={m} value={m}>{minutesToLabel(m)}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </div>

                            {/* Drawer Footer */}
                            {drawerPanel === 'detail' && draft && draft.services.length > 0 && (
                                <div className="cal-drawer-footer">
                                    <div className="cal-drawer-total">
                                        <span className="cal-drawer-total-label">Toplam</span>
                                        <span className="cal-drawer-total-amount">{formatCurrency(draftTotal)}</span>
                                    </div>
                                    <div className="cal-drawer-actions">

                                        {draft.id && (
                                            <button className="cal-btn" style={{ color: '#ef4444', borderColor: '#fecaca' }} onClick={cancelAppointment}>İptal et</button>
                                        )}
                                        <button className="cal-btn cal-btn--outline" onClick={() => { setDrawerOpen(false); setDraft(null); }}>Çıkış yapmak</button>
                                        <button className="cal-btn cal-btn--primary" onClick={saveAppointment}>{draft.id ? 'Güncelle' : 'Kaydetmek'}</button>
                                    </div>
                                </div>
                            )}

                            {/* Edit Service Footer */}
                            {drawerPanel === 'editService' && editingServiceIdx !== null && (
                                <div className="cal-drawer-footer">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <button className="cal-edit-delete" onClick={() => {
                                            removeServiceFromDraft(editingServiceIdx);
                                            setDrawerPanel('detail');
                                            setEditingServiceIdx(null);
                                        }}>🗑️</button>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        <span style={{ fontSize: '0.82rem', color: '#888' }}>
                                            {editForm.duration_min}dk <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{formatCurrency(editForm.price_snapshot)}</span>
                                        </span>
                                        <button className="cal-edit-apply" onClick={applyEditService}>Uygula</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            <ToastContainer toasts={toasts} dismissToast={dismissToast} />
        </div>
    );
}

// ─── Day View Component (Fresha-exact structure) ───

const DayView = forwardRef(function DayView({
    staff, date, getBlocksForStaff, getDraftBlocksForStaff,
    onSlotClick, pickMode, onAppointmentClick
}, ref) {
    const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
    const totalHeight = hours.length * HOUR_HEIGHT; // 2304px
    const [hoveredSlot, setHoveredSlot] = useState(null);
    const [quickAction, setQuickAction] = useState(null); // { staffId, hour, minute, cellRect }
    const gridInnerRef = useRef(null);
    const popupRef = useRef(null);

    // Working hours: 10:00–19:00 (configurable later)
    const workStart = 10; // hour
    const workEnd = 19;   // hour
    const workTopPx = workStart * HOUR_HEIGHT;
    const workHeightPx = (workEnd - workStart) * HOUR_HEIGHT;

    // Handle cell click -> show quick actions popup
    const handleCellClick = useCallback((e, staffId, hour, minute) => {
        e.stopPropagation();
        // Get the clicked cell's bounding rect
        const cellEl = e.currentTarget;
        const cellRect = cellEl.getBoundingClientRect();
        setQuickAction({ staffId, hour, minute, cellRect });
    }, []);

    const closeQuickAction = useCallback(() => setQuickAction(null), []);

    // Calculate popup position: vertically centered on cell, left or right based on space
    const getPopupStyle = useCallback(() => {
        if (!quickAction) return {};
        const { cellRect } = quickAction;
        const POPUP_WIDTH = 280; // min-width from CSS
        const GAP = 10; // gap between cell edge and popup
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Measure popup height (fallback 220px)
        const popupHeight = popupRef.current?.offsetHeight || 220;

        // Vertical: center popup on cell midpoint, clamp to viewport
        const cellMidY = cellRect.top + cellRect.height / 2;
        let top = cellMidY - popupHeight / 2;
        top = Math.max(8, Math.min(top, vh - popupHeight - 8));

        // Horizontal: prefer right of cell column, fallback left
        const spaceRight = vw - cellRect.right;
        let left;
        if (spaceRight >= POPUP_WIDTH + GAP) {
            // Place to the right of cell
            left = cellRect.right + GAP;
        } else {
            // Place to the left of cell
            left = cellRect.left - POPUP_WIDTH - GAP;
            if (left < 8) left = 8; // clamp
        }

        return { position: 'fixed', top, left };
    }, [quickAction]);

    return (
        <div className="cal-day-container" ref={ref}>
            {/* ── Time Column Header (top-left corner block) ── */}
            <div className="cal-time-corner" />

            {/* ── Staff Headers (Fresha-exact: sticky top, flex row) ── */}
            <div className="cal-headers-scroll">
                <div className="cal-headers-row">
                    {staff.map((s, i) => (
                        <div key={s.id} className="cal-header-cell">
                            <div className="cal-header-cell-inner">
                                <div className="cal-header-label-wrap">
                                    <button className="cal-header-cell-btn" type="button" aria-haspopup="true" aria-expanded="false" aria-pressed="false" aria-live="polite">
                                        <div className="cal-header-trigger">
                                            {/* Avatar with ring system */}
                                            <div className="cal-header-avatar-wrap" style={{ '--avatar-color': AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                                                <div className="cal-header-avatar-inner">
                                                    <div className="cal-header-avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                                                        {getInitials(`${s.first_name} ${s.last_name}`)}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Name row without chevron icon */}
                                            <div className="cal-header-name-wrap">
                                                <p className="cal-header-name">{s.first_name} {s.last_name}</p>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Time Column (left side, scrolls vertically only) ── */}
            <div className="cal-time-col" style={{ height: totalHeight }}>
                <div className="cal-time-intervals">
                    {hours.map(h => {
                        // Check if this hour label overlaps with current time pill
                        let labelOpacity = 1;
                        if (isSameDay(date, new Date())) {
                            const now = new Date();
                            const nowMin = now.getHours() * 60 + now.getMinutes();
                            const pillTop = (nowMin / 60) * HOUR_HEIGHT;
                            const labelTop = (h - START_HOUR) * HOUR_HEIGHT;
                            const distance = Math.abs(pillTop - labelTop);
                            if (distance < 20) labelOpacity = 0;
                            else if (distance < 40) labelOpacity = (distance - 20) / 20;
                        }
                        return (
                            <div key={h} className={`cal-time-interval${h === 0 ? ' cal-time-interval--first' : ''}`}>
                                <div className="cal-time-text" style={labelOpacity < 1 ? { opacity: labelOpacity, transition: 'opacity 0.3s' } : undefined}>
                                    {formatTime(h, 0)}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="cal-time-border" />
                {/* Current time pill (Fresha-exact) */}
                {isSameDay(date, new Date()) && (() => {
                    const now = new Date();
                    const nowMin = now.getHours() * 60 + now.getMinutes();
                    const pillTop = (nowMin / 60) * HOUR_HEIGHT;
                    return (
                        <div className="cal-time-now-pill" style={{ top: pillTop }}>
                            {formatTime(now.getHours(), now.getMinutes())}
                        </div>
                    );
                })()}
            </div>

            {/* ── Grid Area (scrolls both H and V) ── */}
            <div className="cal-grid-scroll">
                <div className="cal-grid-inner" ref={gridInnerRef} style={{ height: totalHeight }}>
                    {/* Working Hours Highlight blocks (white on crosshatch bg) */}
                    {staff.map((s, i) => (
                        <div
                            key={`hl-${s.id}`}
                            className="cal-highlight"
                            style={{
                                top: workTopPx,
                                left: `calc(${i} * (100% / ${staff.length}))`,
                                width: `calc(100% / ${staff.length})`,
                                height: workHeightPx,
                            }}
                        />
                    ))}

                    {/* Column divider lines */}
                    <div className="cal-col-dividers">
                        {staff.map((s, i) => (
                            <div
                                key={`div-${s.id}`}
                                className="cal-col-divider"
                                style={{ left: `calc(${(i + 1)} * (100% / ${staff.length}))` }}
                            />
                        ))}
                    </div>

                    {/* Horizontal interval lines (every 15 min, 96 total) */}
                    <div className="cal-h-lines">
                        {Array.from({ length: hours.length * 4 }, (_, i) => {
                            const isHourStart = i % 4 === 0;
                            return (
                                <div
                                    key={i}
                                    className={`cal-h-line${isHourStart ? ' cal-h-line--hour' : ''}`}
                                    style={{ top: i * (HOUR_HEIGHT / 4) }}
                                />
                            );
                        })}
                    </div>

                    {/* Staff columns with events and slots */}
                    {staff.map((s, staffIdx) => {
                        const blocks = getBlocksForStaff(s.id, date);
                        const draftBlocks = getDraftBlocksForStaff(s.id, date);
                        const colorSet = STAFF_COLORS[staffIdx % STAFF_COLORS.length];

                        return (
                            <div
                                key={s.id}
                                className="cal-events-col"
                                style={{
                                    left: `calc(${staffIdx} * (100% / ${staff.length}))`,
                                    width: `calc(100% / ${staff.length})`,
                                }}
                            >
                                {/* Clickable slots (15-min intervals) */}
                                {hours.map(h => {
                                    const interval = 15;
                                    const slotsPerHour = 60 / interval;
                                    const cellHeight = HOUR_HEIGHT / slotsPerHour;
                                    return Array.from({ length: slotsPerHour }, (_, si) => {
                                        const minute = si * interval;
                                        const top = (h - START_HOUR) * HOUR_HEIGHT + si * cellHeight;
                                        const isHovered = hoveredSlot && hoveredSlot.staffId === s.id && hoveredSlot.h === h && hoveredSlot.si === si;
                                        const isActive = quickAction && quickAction.staffId === s.id && quickAction.hour === h && quickAction.minute === minute;
                                        return (
                                            <div
                                                key={`${h}-${si}`}
                                                className={`cal-cell-slot${isHovered ? ' cal-cell-slot--hovered' : ''}${isActive ? ' cal-cell-slot--active' : ''}`}
                                                style={{ top, height: cellHeight }}
                                                onClick={(e) => handleCellClick(e, s.id, h, minute)}
                                                onMouseEnter={() => setHoveredSlot({ staffId: s.id, h, si })}
                                                onMouseLeave={() => setHoveredSlot(null)}
                                            >
                                                <span className="cal-cell-time">{formatTime(h, minute)}</span>
                                            </div>
                                        );
                                    });
                                })}

                                {/* Saved Appointment Blocks */}
                                {blocks.map((block, bi) => {
                                    const startDate = new Date(block.start_at);
                                    const endDate = new Date(block.end_at);
                                    const startMin = startDate.getHours() * 60 + startDate.getMinutes();
                                    const endMin = endDate.getHours() * 60 + endDate.getMinutes();
                                    const top = (startMin / 60) * HOUR_HEIGHT;
                                    const height = Math.max(((endMin - startMin) / 60) * HOUR_HEIGHT, 20);

                                    return (
                                        <div
                                            key={`${block.appointmentId}-${bi}`}
                                            className="cal-appt-block"
                                            style={{
                                                top,
                                                height,
                                                background: colorSet.bg,
                                                borderLeftColor: colorSet.border,
                                                color: colorSet.text,
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onAppointmentClick(block.appointmentId);
                                            }}
                                        >
                                            <div className="cal-appt-time">
                                                {formatTime(startDate.getHours(), startDate.getMinutes())} - {formatTime(endDate.getHours(), endDate.getMinutes())}
                                            </div>
                                            {height > 30 && <div className="cal-appt-customer">{block.customerName}</div>}
                                            {height > 45 && <div className="cal-appt-service">{block.serviceName}</div>}
                                        </div>
                                    );
                                })}

                                {/* Draft Blocks (Preview) */}
                                {draftBlocks.map((block, bi) => {
                                    const startDate = new Date(block.start_at);
                                    const endDate = new Date(block.end_at);
                                    const startMin = startDate.getHours() * 60 + startDate.getMinutes();
                                    const endMin = endDate.getHours() * 60 + endDate.getMinutes();
                                    const top = (startMin / 60) * HOUR_HEIGHT;
                                    const height = Math.max(((endMin - startMin) / 60) * HOUR_HEIGHT, 20);

                                    return (
                                        <div
                                            key={`draft-${bi}`}
                                            className="cal-appt-block cal-appt-block--draft"
                                            style={{
                                                top,
                                                height,
                                                background: colorSet.bg,
                                                borderLeftColor: colorSet.border,
                                                color: colorSet.text,
                                            }}
                                        >
                                            <div className="cal-appt-time">
                                                {formatTime(startDate.getHours(), startDate.getMinutes())} - {formatTime(endDate.getHours(), endDate.getMinutes())}
                                            </div>
                                            {height > 30 && <div className="cal-appt-customer">{block.customerName}</div>}
                                            {height > 45 && <div className="cal-appt-service">{block.serviceName}</div>}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}

                    {/* Now Indicator (spans full width) */}
                    {isSameDay(date, new Date()) && (() => {
                        const now = new Date();
                        const nowMin = now.getHours() * 60 + now.getMinutes();
                        const top = (nowMin / 60) * HOUR_HEIGHT;
                        return (
                            <div className="cal-now-indicator" style={{ top }}>
                                <div className="cal-now-line" />
                                <div className="cal-now-label">
                                    {formatTime(now.getHours(), now.getMinutes())}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* ── Quick Actions Popup (Fresha-exact) ── */}
            {quickAction && (
                <>
                    <div className="cal-quick-actions-overlay" onClick={closeQuickAction} />
                    <div
                        ref={popupRef}
                        className="cal-quick-actions"
                        style={getPopupStyle()}
                    >
                        {/* Header: time + close */}
                        <div className="cal-qa-header">
                            <p className="cal-qa-time">{formatTime(quickAction.hour, quickAction.minute)}</p>
                            <button className="cal-qa-close" onClick={closeQuickAction} type="button" aria-label="Kapat">
                                <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                                    <path fillRule="evenodd" d="M7.293 7.293a1 1 0 0 1 1.414 0L16 14.586l7.293-7.293a1 1 0 1 1 1.414 1.414L17.414 16l7.293 7.293a1 1 0 0 1-1.414 1.414L16 17.414l-7.293 7.293a1 1 0 0 1-1.414-1.414L14.586 16 7.293 8.707a1 1 0 0 1 0-1.414" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        {/* Menu items */}
                        <ul className="cal-qa-menu">
                            <li>
                                <button
                                    className="cal-qa-item"
                                    onClick={() => {
                                        closeQuickAction();
                                        onSlotClick(quickAction.staffId, quickAction.hour, quickAction.minute);
                                    }}
                                    type="button"
                                >
                                    <span className="cal-qa-item-icon">
                                        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                                            <path fillRule="evenodd" d="M10 2a1 1 0 0 1 1 1v1h10V3a1 1 0 1 1 2 0v1h3a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V3a1 1 0 0 1 1-1M9 6H6v4h20V6h-3v1a1 1 0 1 1-2 0V6H11v1a1 1 0 1 1-2 0zm17 6H6v14h20z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    Randevu ekle
                                </button>
                            </li>

                            <li>
                                <button className="cal-qa-item" onClick={closeQuickAction} type="button">
                                    <span className="cal-qa-item-icon">
                                        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                                            <path fillRule="evenodd" d="M10 2a1 1 0 0 1 1 1v1h10V3a1 1 0 1 1 2 0v1h3a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V3a1 1 0 0 1 1-1M9 6H6v4h20V6h-3v1a1 1 0 1 1-2 0V6H11v1a1 1 0 1 1-2 0zm17 6H6v14h20zm-13.707 3.293a1 1 0 0 1 1.414 0L16 17.586l2.293-2.293a1 1 0 0 1 1.414 1.414L17.414 19l2.293 2.293a1 1 0 0 1-1.414 1.414L16 20.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L14.586 19l-2.293-2.293a1 1 0 0 1 0-1.414" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    Bloklu zaman ekle
                                </button>
                            </li>
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
});

// ─── Multi-Day View (Fresha-exact CSS Grid) ───
const ThreeDayView = forwardRef(function ThreeDayView({
    staff, currentDate, onAppointmentClick, onSlotClick, dayCount = 3
}, ref) {
    const [hoveredCell, setHoveredCell] = useState(null);
    const [quickAction, setQuickAction] = useState(null);
    const popupRef = useRef(null);

    const handleCellEnter = useCallback((staffIdx, dayIdx) => {
        setHoveredCell({ staffIdx, dayIdx });
    }, []);

    const handleCellLeave = useCallback(() => {
        setHoveredCell(null);
    }, []);

    const handleCellClick = useCallback((e, staffId, dayDate) => {
        e.stopPropagation();
        const cellRect = e.currentTarget.getBoundingClientRect();
        setQuickAction({ staffId, dayDate, cellRect });
    }, []);

    const closeQuickAction = useCallback(() => setQuickAction(null), []);

    const getPopupStyle = useCallback(() => {
        if (!quickAction) return {};
        const { cellRect } = quickAction;
        const POPUP_WIDTH = 280;
        const GAP = 10;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const popupHeight = popupRef.current?.offsetHeight || 220;
        const cellMidY = cellRect.top + cellRect.height / 2;
        let top = cellMidY - popupHeight / 2;
        top = Math.max(8, Math.min(top, vh - popupHeight - 8));
        const spaceRight = vw - cellRect.right;
        let left;
        if (spaceRight >= POPUP_WIDTH + GAP) {
            left = cellRect.right + GAP;
        } else {
            left = cellRect.left - POPUP_WIDTH - GAP;
            if (left < 8) left = 8;
        }
        return { position: 'fixed', top, left };
    }, [quickAction]);

    // Build days from currentDate
    const days = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return Array.from({ length: dayCount }, (_, i) => {
            const d = new Date(currentDate);
            d.setDate(d.getDate() + i);
            d.setHours(0, 0, 0, 0);
            return {
                date: d,
                dayNum: d.getDate(),
                dayName: DAY_NAMES[d.getDay()],
                dayNameShort: DAY_NAMES_SHORT[d.getDay()],
                isToday: d.getTime() === today.getTime(),
                isPast: d.getTime() < today.getTime(),
            };
        });
    }, [currentDate, dayCount]);

    return (
        <div className="cal-3day-root" ref={ref}>
            <div className="cal-3day-container">
                <div className="cal-3day-scroll">
                    <div className="cal-3day-grid" style={{ gridTemplateColumns: `80px repeat(${days.length}, 1fr)`, gridTemplateRows: `70px 0px ${staff.map(() => '1fr').join(' ')}` }}>

                        {/* Sticky corner */}
                        <div className="cal-3day-corner" />

                        {/* Day headers */}
                        {days.map((day, i) => (
                            <div
                                key={i}
                                className={`cal-3day-day-header${hoveredCell?.dayIdx === i ? ' is-hovered' : ''}`}
                                style={{ gridColumn: i + 2 }}
                            >
                                <button className="cal-3day-day-header-btn">
                                    <div className="cal-3day-day-header-content">
                                        <div className={`cal-3day-day-num-wrap${day.isToday ? ' is-today' : ''}`}>
                                            <span className={`cal-3day-day-num${day.isToday ? ' is-today' : ''}${day.isPast ? ' is-past' : ''}`}>
                                                {day.dayNum}
                                            </span>
                                        </div>
                                        <span className={`cal-3day-day-name${day.isToday ? ' is-today' : ''}${day.isPast ? ' is-past' : ''}`}>
                                            {day.dayName}
                                        </span>
                                    </div>
                                </button>
                            </div>
                        ))}

                        {/* Header shadow */}
                        <div className="cal-3day-header-shadow" />

                        {/* Staff column */}
                        <div className="cal-3day-staff-col">
                            {staff.map((s, si) => {
                                const colorIdx = si % AVATAR_COLORS.length;
                                return (
                                    <div
                                        key={s.id}
                                        className={`cal-3day-staff-entry${hoveredCell?.staffIdx === si ? ' is-hovered' : ''}`}
                                    >
                                        <div className="cal-3day-staff-cell">
                                            <button className="cal-3day-staff-btn">
                                                <div className="cal-3day-staff-info">
                                                    <div className="cal-3day-avatar-wrap" style={{ backgroundColor: AVATAR_COLORS[colorIdx] }}>
                                                        <div className="cal-3day-avatar-inner">
                                                            <div className="cal-3day-avatar-initials" style={{ backgroundColor: AVATAR_COLORS[colorIdx] }}>
                                                                {getInitials(`${s.first_name} ${s.last_name}`)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="cal-3day-staff-name-wrap">
                                                        <p className="cal-3day-staff-name">{s.first_name} {s.last_name}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="cal-3day-staff-border" />
                        </div>

                        {/* Day columns */}
                        {days.map((day, di) => (
                            <div
                                key={di}
                                className="cal-3day-day-col"
                                style={{ gridColumn: di + 2 }}
                            >
                                {staff.map((s, si) => (
                                    <div
                                        key={s.id}
                                        className={`cal-3day-cell${day.isPast ? ' is-past' : ''}${quickAction && quickAction.staffId === s.id && quickAction.dayDate.getTime() === day.date.getTime() ? ' is-active' : ''}`}
                                        onMouseEnter={() => handleCellEnter(si, di)}
                                        onMouseLeave={handleCellLeave}
                                        onClick={(e) => handleCellClick(e, s.id, day.date)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="cal-3day-cell-content">
                                            <div className="cal-3day-cell-bg" />
                                            <div className="cal-3day-cell-click" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}

                    </div>
                </div>
            </div>

            {/* Quick Actions Popup */}
            {quickAction && (
                <>
                    <div className="cal-quick-actions-overlay" onClick={closeQuickAction} />
                    <div
                        ref={popupRef}
                        className="cal-quick-actions"
                        style={getPopupStyle()}
                    >
                        <div className="cal-qa-header">
                            <p className="cal-qa-time">
                                {quickAction.dayDate.getDate()} {MONTHS[quickAction.dayDate.getMonth()]}
                            </p>
                            <button className="cal-qa-close" onClick={closeQuickAction} type="button" aria-label="Kapat">
                                <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                                    <path fillRule="evenodd" d="M7.293 7.293a1 1 0 0 1 1.414 0L16 14.586l7.293-7.293a1 1 0 1 1 1.414 1.414L17.414 16l7.293 7.293a1 1 0 0 1-1.414 1.414L16 17.414l-7.293 7.293a1 1 0 0 1-1.414-1.414L14.586 16 7.293 8.707a1 1 0 0 1 0-1.414" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <ul className="cal-qa-menu">
                            <li>
                                <button
                                    className="cal-qa-item"
                                    onClick={() => {
                                        const d = quickAction.dayDate;
                                        const sid = quickAction.staffId;
                                        closeQuickAction();
                                        if (onSlotClick) onSlotClick(sid, d.getHours() || 10, 0, d);
                                    }}
                                    type="button"
                                >
                                    <span className="cal-qa-item-icon">
                                        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                                            <path fillRule="evenodd" d="M10 2a1 1 0 0 1 1 1v1h10V3a1 1 0 1 1 2 0v1h3a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V3a1 1 0 0 1 1-1M9 6H6v4h20V6h-3v1a1 1 0 1 1-2 0V6H11v1a1 1 0 1 1-2 0zm17 6H6v14h20z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    Randevu ekle
                                </button>
                            </li>
                            <li>
                                <button className="cal-qa-item" onClick={closeQuickAction} type="button">
                                    <span className="cal-qa-item-icon">
                                        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                                            <path fillRule="evenodd" d="M10 2a1 1 0 0 1 1 1v1h10V3a1 1 0 1 1 2 0v1h3a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V3a1 1 0 0 1 1-1M9 6H6v4h20V6h-3v1a1 1 0 1 1-2 0V6H11v1a1 1 0 1 1-2 0zm17 6H6v14h20zm-13.707 3.293a1 1 0 0 1 1.414 0L16 17.586l2.293-2.293a1 1 0 0 1 1.414 1.414L17.414 19l2.293 2.293a1 1 0 0 1-1.414 1.414L16 20.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L14.586 19l-2.293-2.293a1 1 0 0 1 0-1.414" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    Bloklu zaman ekle
                                </button>
                            </li>
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
});

// ─── Monthly View ───
const MONTHS_TR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

function buildMonthGrid(year, month) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startOffset);
    const days = [];
    for (let i = 0; i < 42; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        d.setHours(0, 0, 0, 0);
        days.push({
            date: d,
            dayNum: d.getDate(),
            isToday: d.getTime() === today.getTime(),
            isPast: d.getTime() < today.getTime(),
            isCurrentMonth: d.getMonth() === month,
            monthLabel: d.getDate() === 1 ? MONTHS_TR[d.getMonth()] : null,
        });
    }
    return days;
}

function MonthView({ currentDate, onDayClick }) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = useMemo(() => buildMonthGrid(year, month), [year, month]);

    return (
        <div className="cal-month-root">
            <div className="cal-month-scroll">
                <div className="cal-month-header">
                    {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map((name, i) => (
                        <div key={i} className="cal-month-header-cell">
                            <p>{name}</p>
                        </div>
                    ))}
                </div>
                <div className="cal-month-grid">
                    {days.map((day, i) => (
                        <div
                            key={i}
                            className={`cal-month-cell${day.isPast ? ' is-past' : ''}${day.isToday ? ' is-today' : ''}${!day.isCurrentMonth ? ' is-other-month' : ''}`}
                            onClick={() => onDayClick && onDayClick(day.date)}
                        >
                            <p className={`cal-month-day-num${day.isToday ? ' is-today' : ''}`}>
                                {day.dayNum}
                                {day.monthLabel && <span className="cal-month-label"> {day.monthLabel}</span>}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
