import { useState, useEffect, useMemo } from 'react';
import { localDateStr } from '../utils/dateUtils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { ToastContainer, useToast } from '../components/Toast';
import './Customers.css';

const AVATAR_COLORS = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
    '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
];

function getAvatarColor(name) {
    if (!name) return AVATAR_COLORS[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const EMPTY_FORM = {
    first_name: '',
    last_name: '',
    phone_e164: '',
    email: '',
    birth_date: '',
    gender_id: '',
    notes: '',
    file_no: '',
    instagram_username: '',
    profession: '',
    referral_source: '',
    city_id: '',
    district_id: '',
    address_full: '',
    emergency_phone: '',
    allow_sms: true,
    allow_email: true,
    is_active: true,
};

export default function Customers() {
    const { tenantUser } = useAuth();
    const { toasts, addToast, dismissToast } = useToast();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Data
    const [loading, setLoading] = useState(true);
    const [branchId, setBranchId] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [genders, setGenders] = useState([]);
    const [customerTags, setCustomerTags] = useState([]);
    const [cities, setCities] = useState([]);
    const [allDistricts, setAllDistricts] = useState([]);

    // Search & Filter
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterGender, setFilterGender] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterTag, setFilterTag] = useState('');
    const [filterSource, setFilterSource] = useState('');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');

    // Sorting
    const [sortField, setSortField] = useState('first_name');
    const [sortDir, setSortDir] = useState('asc');

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [selectedTagId, setSelectedTagId] = useState(null); // Single tag
    const [formStep, setFormStep] = useState(0);
    const [saving, setSaving] = useState(false);

    // Delete
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // ─── Load Data ───
    useEffect(() => {
        if (tenantUser?.tenant_id) loadData();
    }, [tenantUser]);

    // Handle ?edit=<id> param from CustomerDetail page
    useEffect(() => {
        const editId = searchParams.get('edit');
        if (editId && customers.length > 0) {
            const cust = customers.find(c => c.id === editId);
            if (cust) {
                openEdit(cust);
                setSearchParams({}, { replace: true });
            }
        }
    }, [customers, searchParams]);

    const loadData = async () => {
        try {
            setLoading(true);

            const { data: branch } = await supabase
                .from('branches')
                .select('id')
                .eq('tenant_id', tenantUser.tenant_id)
                .single();

            if (!branch) {
                addToast('error', 'Şube bulunamadı.');
                setLoading(false);
                return;
            }
            setBranchId(branch.id);

            const [custRes, genderRes, tagRes, cityRes, districtRes] = await Promise.all([
                supabase
                    .from('customers')
                    .select(`
                        *,
                        gender:genders(id, code, label),
                        city:cities(id, name),
                        district:districts(id, name),
                        customer_tag_assignments(tag_id)
                    `)
                    .eq('branch_id', branch.id)
                    .order('created_at', { ascending: false }),
                supabase.from('genders').select('*').order('label'),
                supabase.from('customer_tags').select('*').eq('branch_id', branch.id).eq('is_active', true).order('title'),
                supabase.from('cities').select('*').eq('is_active', true).order('name'),
                supabase.from('districts').select('*').eq('is_active', true).order('name'),
            ]);

            setCustomers(custRes.data || []);
            setGenders(genderRes.data || []);
            setCustomerTags(tagRes.data || []);
            setCities(cityRes.data || []);
            setAllDistricts(districtRes.data || []);
        } catch (err) {
            console.error(err);
            addToast('error', 'Veriler yüklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    // ─── Districts filtered by selected city ───
    const filteredDistricts = useMemo(() => {
        if (!form.city_id) return [];
        return allDistricts.filter(d => d.city_id === form.city_id);
    }, [form.city_id, allDistricts]);

    // ─── Derived: Unique Sources ───
    const uniqueSources = useMemo(() => {
        const sources = customers.map(c => c.referral_source).filter(Boolean);
        return [...new Set(sources)].sort();
    }, [customers]);

    // ─── Active filter count ───
    const activeFilterCount = [filterGender, filterStatus, filterTag, filterSource, filterDateFrom, filterDateTo].filter(Boolean).length;

    // ─── Filtered & Sorted ───
    const filteredCustomers = useMemo(() => {
        let result = [...customers];

        // Search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(c =>
                (c.first_name || '').toLowerCase().includes(term) ||
                (c.last_name || '').toLowerCase().includes(term) ||
                (c.phone_e164 || '').includes(term) ||
                (c.email || '').toLowerCase().includes(term)
            );
        }

        // Filters
        if (filterGender) result = result.filter(c => c.gender_id === filterGender);
        if (filterStatus === 'active') result = result.filter(c => c.is_active);
        if (filterStatus === 'inactive') result = result.filter(c => !c.is_active);
        if (filterTag) result = result.filter(c =>
            c.customer_tag_assignments?.some(ta => ta.tag_id === filterTag)
        );
        if (filterSource) result = result.filter(c => c.referral_source === filterSource);

        if (filterDateFrom) {
            const from = new Date(filterDateFrom);
            result = result.filter(c => new Date(c.created_at) >= from);
        }
        if (filterDateTo) {
            const to = new Date(filterDateTo);
            to.setHours(23, 59, 59, 999);
            result = result.filter(c => new Date(c.created_at) <= to);
        }

        // Sort
        result.sort((a, b) => {
            let aVal, bVal;
            switch (sortField) {
                case 'first_name':
                    aVal = `${a.first_name} ${a.last_name || ''}`.toLowerCase();
                    bVal = `${b.first_name} ${b.last_name || ''}`.toLowerCase();
                    break;
                case 'phone_e164':
                    aVal = a.phone_e164 || '';
                    bVal = b.phone_e164 || '';
                    break;
                case 'created_at':
                    aVal = a.created_at || '';
                    bVal = b.created_at || '';
                    break;
                default:
                    aVal = a[sortField] || '';
                    bVal = b[sortField] || '';
            }
            if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [customers, searchTerm, filterGender, filterStatus, filterTag, filterSource, filterDateFrom, filterDateTo, sortField, sortDir]);

    // ─── CSV Export ───
    const exportCSV = () => {
        const rows = filteredCustomers.map(c => {
            const tagAssignment = c.customer_tag_assignments?.[0];
            const tag = tagAssignment ? getTagInfo(tagAssignment.tag_id) : null;
            const gender = genders.find(g => g.id === c.gender_id);
            const city = cities.find(ct => ct.id === c.city_id);
            const district = allDistricts.find(d => d.id === c.district_id);
            return {
                'Ad': c.first_name || '',
                'Soyad': c.last_name || '',
                'Telefon': c.phone_e164 || '',
                'E-posta': c.email || '',
                'Cinsiyet': gender?.label || '',
                'Doğum Tarihi': c.birth_date || '',
                'İl': city?.name || '',
                'İlçe': district?.name || '',
                'Etiket': tag?.title || '',
                'Durum': c.is_active ? 'Aktif' : 'Pasif',
                'Kaynak': c.referral_source || '',
                'Kayıt Tarihi': c.created_at ? new Date(c.created_at).toLocaleDateString('tr-TR') : '',
            };
        });

        if (rows.length === 0) {
            addToast('error', 'Dışa aktarılacak müşteri yok.');
            return;
        }

        const headers = Object.keys(rows[0]);
        const csvContent = [
            headers.join(';'),
            ...rows.map(r => headers.map(h => `"${(r[h] || '').toString().replace(/"/g, '""')}"`).join(';')),
        ].join('\n');

        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `musteriler_${localDateStr()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        addToast('success', `${rows.length} müşteri dışa aktarıldı.`);
    };

    // ─── Sort Handler ───
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('asc');
        }
    };

    const sortIcon = (field) => {
        if (sortField !== field) return '';
        return sortDir === 'asc' ? '↑' : '↓';
    };

    // ─── Modal Open/Close ───
    const openNew = () => {
        setEditingId(null);
        setForm({ ...EMPTY_FORM });
        setSelectedTagId(null);
        setShowModal(true);
    };

    const openEdit = (customer) => {
        setEditingId(customer.id);
        setForm({
            first_name: customer.first_name || '',
            last_name: customer.last_name || '',
            phone_e164: customer.phone_e164 || '',
            email: customer.email || '',
            birth_date: customer.birth_date || '',
            gender_id: customer.gender_id || '',
            notes: customer.notes || '',
            file_no: customer.file_no || '',
            instagram_username: customer.instagram_username || '',
            profession: customer.profession || '',
            referral_source: customer.referral_source || '',
            city_id: customer.city_id || '',
            district_id: customer.district_id || '',
            address_full: customer.address_full || '',
            emergency_phone: customer.emergency_phone || '',
            allow_sms: customer.allow_sms ?? true,
            allow_email: customer.allow_email ?? true,
            is_active: customer.is_active ?? true,
        });
        // Single tag — pick the first assignment
        const firstTag = customer.customer_tag_assignments?.[0]?.tag_id || null;
        setSelectedTagId(firstTag);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setForm({ ...EMPTY_FORM });
        setSelectedTagId(null);
        setFormStep(0);
    };

    // ─── Tag Toggle (single select) ───
    const toggleTag = (tagId) => {
        setSelectedTagId(prev => prev === tagId ? null : tagId);
    };

    // ─── City change — reset district ───
    const handleCityChange = (cityId) => {
        setForm(prev => ({ ...prev, city_id: cityId, district_id: '' }));
    };

    // ─── Save ───
    const handleSave = async () => {
        if (!form.first_name.trim()) {
            addToast('error', 'Ad alanı zorunludur.');
            return;
        }
        if (!form.phone_e164.trim()) {
            addToast('error', 'Telefon alanı zorunludur.');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                branch_id: branchId,
                tenant_id: tenantUser.tenant_id,
                first_name: form.first_name.trim(),
                last_name: form.last_name.trim() || null,
                phone_e164: form.phone_e164.trim(),
                email: form.email.trim() || null,
                birth_date: form.birth_date || null,
                gender_id: form.gender_id || null,
                notes: form.notes.trim() || null,
                file_no: form.file_no.trim() || null,
                instagram_username: form.instagram_username.trim() || null,
                profession: form.profession.trim() || null,
                referral_source: form.referral_source.trim() || null,
                city_id: form.city_id || null,
                district_id: form.district_id || null,
                address_full: form.address_full.trim() || null,
                emergency_phone: form.emergency_phone.trim() || null,
                allow_sms: form.allow_sms,
                allow_email: form.allow_email,
                is_active: form.is_active,
            };

            let customerId = editingId;

            if (editingId) {
                const { error } = await supabase
                    .from('customers')
                    .update(payload)
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                const { data, error } = await supabase
                    .from('customers')
                    .insert(payload)
                    .select('id')
                    .single();
                if (error) throw error;
                customerId = data.id;
            }

            // ─── Sync Tag (single) ───
            await supabase
                .from('customer_tag_assignments')
                .delete()
                .eq('customer_id', customerId);

            if (selectedTagId) {
                const { error: tagErr } = await supabase
                    .from('customer_tag_assignments')
                    .insert({ customer_id: customerId, tag_id: selectedTagId });
                if (tagErr) console.error('Tag sync error:', tagErr);
            }

            addToast('success', editingId ? 'Müşteri güncellendi.' : 'Müşteri eklendi.');
            closeModal();
            await loadData();
        } catch (err) {
            console.error(err);
            if (err.code === '23505') {
                addToast('error', 'Bu telefon numarası zaten kayıtlı.');
            } else {
                addToast('error', 'Kayıt sırasında hata oluştu.');
            }
        } finally {
            setSaving(false);
        }
    };

    // ─── Delete ───
    const handleDelete = async (id) => {
        try {
            const { error } = await supabase.from('customers').delete().eq('id', id);
            if (error) throw error;
            addToast('success', 'Müşteri silindi.');
            setDeleteConfirm(null);
            await loadData();
        } catch (err) {
            console.error(err);
            addToast('error', 'Silme işlemi başarısız.');
        }
    };

    // ─── Clear Filters ───
    const clearFilters = () => {
        setFilterGender('');
        setFilterStatus('');
        setFilterTag('');
        setFilterSource('');
        setFilterDateFrom('');
        setFilterDateTo('');
    };

    // ─── Get tag info by ID ───
    const getTagInfo = (tagId) => customerTags.find(t => t.id === tagId);

    // ─── Render ───
    return (
        <div className="customers-page">
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />

            {/* ─── Header ─── */}
            <div className="customers-header">
                <div className="customers-header-left">
                    <h1>
                        <span>👥</span> Müşteriler
                    </h1>
                    <p className="customers-header-subtitle">Müşteri veritabanınızı yönetin, düzenleyin ve takip edin.</p>
                </div>
                <div className="customers-header-right">
                    <button className="btn-export-csv" onClick={exportCSV} title="CSV olarak dışa aktar">
                        📥 Dışa Aktar
                    </button>
                    <button className="btn-add-customer" onClick={openNew}>
                        + Yeni Müşteri
                    </button>
                </div>
            </div>


            {/* ─── Toolbar ─── */}
            <div className="customers-toolbar">
                <div className="customers-search">
                    <span className="customers-search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="İsim, telefon veya e-posta ara..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    className={`customers-filter-btn ${showFilters || activeFilterCount > 0 ? 'active' : ''}`}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    🎛️ Filtreler
                    {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
                </button>

            </div>

            {/* ─── Filter Panel ─── */}
            {showFilters && (
                <div className="customers-filters">
                    <div className="customers-filter-group">
                        <label>Cinsiyet</label>
                        <select value={filterGender} onChange={e => setFilterGender(e.target.value)}>
                            <option value="">Tümü</option>
                            {genders.map(g => (
                                <option key={g.id} value={g.id}>{g.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="customers-filter-group">
                        <label>Durum</label>
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                            <option value="">Tümü</option>
                            <option value="active">Aktif</option>
                            <option value="inactive">Pasif</option>
                        </select>
                    </div>
                    <div className="customers-filter-group">
                        <label>Etiket</label>
                        <select value={filterTag} onChange={e => setFilterTag(e.target.value)}>
                            <option value="">Tümü</option>
                            {customerTags.map(t => (
                                <option key={t.id} value={t.id}>{t.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="customers-filter-group">
                        <label>Kaynak</label>
                        <select value={filterSource} onChange={e => setFilterSource(e.target.value)}>
                            <option value="">Tümü</option>
                            {uniqueSources.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div className="customers-filter-group">
                        <label>Kayıt Tarihi (Başlangıç)</label>
                        <input
                            type="date"
                            value={filterDateFrom}
                            onChange={e => setFilterDateFrom(e.target.value)}
                        />
                    </div>
                    <div className="customers-filter-group">
                        <label>Kayıt Tarihi (Bitiş)</label>
                        <input
                            type="date"
                            value={filterDateTo}
                            onChange={e => setFilterDateTo(e.target.value)}
                        />
                    </div>
                    {activeFilterCount > 0 && (
                        <button className="filter-clear-btn" onClick={clearFilters}>
                            ✕ Temizle
                        </button>
                    )}
                </div>
            )}

            {/* ─── Table ─── */}
            <div className="customers-table-wrapper">
                {loading ? (
                    <div className="customers-loading">
                        <div className="spinner" />
                        <span>Müşteriler yükleniyor...</span>
                    </div>
                ) : filteredCustomers.length === 0 ? (
                    <div className="customers-empty">
                        <div className="customers-empty-icon">👥</div>
                        <h3>{searchTerm || activeFilterCount > 0 ? 'Sonuç bulunamadı' : 'Henüz müşteri yok'}</h3>
                        <p>{searchTerm || activeFilterCount > 0 ? 'Arama veya filtre kriterlerini değiştirin.' : 'İlk müşterinizi eklemek için "Yeni Müşteri" butonuna tıklayın.'}</p>
                    </div>
                ) : (
                    <table className="customers-table">
                        <thead>
                            <tr>
                                <th className={sortField === 'first_name' ? 'sorted' : ''} onClick={() => handleSort('first_name')}>
                                    Müşteri <span className="sort-icon">{sortIcon('first_name')}</span>
                                </th>
                                <th className={sortField === 'phone_e164' ? 'sorted' : ''} onClick={() => handleSort('phone_e164')}>
                                    Telefon <span className="sort-icon">{sortIcon('phone_e164')}</span>
                                </th>
                                <th>Etiket</th>
                                <th>Cinsiyet</th>
                                <th>Durum</th>
                                <th className={sortField === 'created_at' ? 'sorted' : ''} onClick={() => handleSort('created_at')}>
                                    Kayıt <span className="sort-icon">{sortIcon('created_at')}</span>
                                </th>
                                <th style={{ width: 80 }}>İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map(c => {
                                const fullName = `${c.first_name} ${c.last_name || ''}`.trim();
                                const initials = `${c.first_name?.[0] || ''}${c.last_name?.[0] || ''}`.toUpperCase();
                                const firstTagAssignment = c.customer_tag_assignments?.[0];
                                const tag = firstTagAssignment ? getTagInfo(firstTagAssignment.tag_id) : null;
                                return (
                                    <tr key={c.id} onClick={() => navigate(`/customers/${c.id}`)}>
                                        <td>
                                            <div className="customer-name-cell">
                                                <div
                                                    className="customer-avatar"
                                                    style={{ backgroundColor: getAvatarColor(fullName) }}
                                                >
                                                    {initials || '?'}
                                                </div>
                                                <div className="customer-name-info">
                                                    <span className="customer-full-name">{fullName}</span>
                                                    {c.email && <span className="customer-email">{c.email}</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="customer-phone">{c.phone_e164}</span>
                                        </td>
                                        <td>
                                            {tag && (
                                                <span
                                                    className="customer-tag-badge"
                                                    style={{ backgroundColor: tag.color + '20', color: tag.color }}
                                                >
                                                    {tag.title}
                                                </span>
                                            )}
                                        </td>
                                        <td>{c.gender?.label || '—'}</td>
                                        <td>
                                            <span className={`status-badge ${c.is_active ? 'active' : 'inactive'}`}>
                                                <span className="status-dot" />
                                                {c.is_active ? 'Aktif' : 'Pasif'}
                                            </span>
                                        </td>
                                        <td>
                                            {c.created_at
                                                ? new Date(c.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
                                                : '—'
                                            }
                                        </td>
                                        <td>
                                            <div className="customer-actions" onClick={e => e.stopPropagation()}>
                                                <button className="action-btn-small" title="Düzenle" onClick={() => openEdit(c)}>✏️</button>
                                                <button
                                                    className="action-btn-small delete"
                                                    title="Sil"
                                                    onClick={() => setDeleteConfirm(c.id)}
                                                >🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}

                {/* Delete Confirm */}
                {deleteConfirm && (
                    <div className="delete-confirm-bar">
                        <span>⚠️ Bu müşteriyi silmek istediğinize emin misiniz?</span>
                        <div className="btn-group">
                            <button className="btn-delete-cancel" onClick={() => setDeleteConfirm(null)}>Vazgeç</button>
                            <button className="btn-delete-confirm" onClick={() => handleDelete(deleteConfirm)}>Sil</button>
                        </div>
                    </div>
                )}
            </div>

            {/* ═══════════ MODAL ═══════════ */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="customer-modal" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="modal-header">
                            <h2>👤 {editingId ? 'Müşteri Düzenle' : 'Yeni Müşteri'}</h2>
                            <button className="modal-close-btn" onClick={closeModal}>✕</button>
                        </div>

                        {/* Step Indicator */}
                        <div className="modal-steps">
                            {['Temel Bilgiler', 'Ek Bilgiler', 'Adres & Diğer'].map((label, i) => (
                                <button
                                    key={i}
                                    className={`modal-step-btn ${formStep === i ? 'active' : ''} ${formStep > i ? 'done' : ''}`}
                                    onClick={() => setFormStep(i)}
                                >
                                    <span className="step-num">{formStep > i ? '✓' : i + 1}</span>
                                    <span className="step-label">{label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Body */}
                        <div className="modal-body">
                            {/* ── Step 0: Temel Bilgiler ── */}
                            {formStep === 0 && (
                                <div className="form-step-content">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Ad <span className="required">*</span></label>
                                            <input
                                                type="text"
                                                value={form.first_name}
                                                onChange={e => setForm({ ...form, first_name: e.target.value })}
                                                placeholder="Ad"
                                                autoFocus
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Soyad</label>
                                            <input
                                                type="text"
                                                value={form.last_name}
                                                onChange={e => setForm({ ...form, last_name: e.target.value })}
                                                placeholder="Soyad"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Telefon <span className="required">*</span></label>
                                            <input
                                                type="tel"
                                                value={form.phone_e164}
                                                onChange={e => setForm({ ...form, phone_e164: e.target.value })}
                                                placeholder="+905551234567"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>E-posta</label>
                                            <input
                                                type="email"
                                                value={form.email}
                                                onChange={e => setForm({ ...form, email: e.target.value })}
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Doğum Tarihi</label>
                                            <input
                                                type="date"
                                                value={form.birth_date}
                                                onChange={e => setForm({ ...form, birth_date: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Cinsiyet</label>
                                            <select
                                                value={form.gender_id}
                                                onChange={e => setForm({ ...form, gender_id: e.target.value })}
                                            >
                                                <option value="">Seçiniz</option>
                                                {genders.map(g => (
                                                    <option key={g.id} value={g.id}>{g.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Step 1: Ek Bilgiler ── */}
                            {formStep === 1 && (
                                <div className="form-step-content">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Dosya No</label>
                                            <input
                                                type="text"
                                                value={form.file_no}
                                                onChange={e => setForm({ ...form, file_no: e.target.value })}
                                                placeholder="Dosya numarası"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Instagram</label>
                                            <input
                                                type="text"
                                                value={form.instagram_username}
                                                onChange={e => setForm({ ...form, instagram_username: e.target.value })}
                                                placeholder="@kullaniciadi"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Meslek</label>
                                            <input
                                                type="text"
                                                value={form.profession}
                                                onChange={e => setForm({ ...form, profession: e.target.value })}
                                                placeholder="Meslek"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Referans Kaynağı</label>
                                            <input
                                                type="text"
                                                value={form.referral_source}
                                                onChange={e => setForm({ ...form, referral_source: e.target.value })}
                                                placeholder="Instagram, arkadaş, Google..."
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row single">
                                        <div className="form-group">
                                            <label>Acil Durum Telefonu</label>
                                            <input
                                                type="tel"
                                                value={form.emergency_phone}
                                                onChange={e => setForm({ ...form, emergency_phone: e.target.value })}
                                                placeholder="+905..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Step 2: Adres & Diğer ── */}
                            {formStep === 2 && (
                                <div className="form-step-content">
                                    <div className="form-section-title">📍 Adres</div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>İl</label>
                                            <select
                                                value={form.city_id}
                                                onChange={e => handleCityChange(e.target.value)}
                                            >
                                                <option value="">İl seçiniz</option>
                                                {cities.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>İlçe</label>
                                            <select
                                                value={form.district_id}
                                                onChange={e => setForm({ ...form, district_id: e.target.value })}
                                                disabled={!form.city_id}
                                            >
                                                <option value="">{form.city_id ? 'İlçe seçiniz' : 'Önce il seçiniz'}</option>
                                                {filteredDistricts.map(d => (
                                                    <option key={d.id} value={d.id}>{d.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row single">
                                        <div className="form-group">
                                            <label>Adres (Tam)</label>
                                            <textarea
                                                value={form.address_full}
                                                onChange={e => setForm({ ...form, address_full: e.target.value })}
                                                placeholder="Tam adres bilgisi..."
                                            />
                                        </div>
                                    </div>

                                    <div className="form-section-title" style={{ marginTop: 18 }}>📝 Notlar</div>
                                    <div className="form-row single">
                                        <div className="form-group">
                                            <textarea
                                                value={form.notes}
                                                onChange={e => setForm({ ...form, notes: e.target.value })}
                                                placeholder="Müşteri ile ilgili notlar..."
                                            />
                                        </div>
                                    </div>

                                    {customerTags.length > 0 && (
                                        <div className="form-section tags-section" style={{ padding: 0, background: 'none', border: 'none' }}>
                                            <div className="form-section-title" style={{ marginTop: 18 }}>🏷️ Etiket</div>
                                            <div className="tags-available">
                                                {customerTags.map(tag => (
                                                    <span
                                                        key={tag.id}
                                                        className={`tag-chip ${selectedTagId === tag.id ? 'selected' : ''}`}
                                                        style={{
                                                            backgroundColor: tag.color + '20',
                                                            color: tag.color,
                                                        }}
                                                        onClick={() => toggleTag(tag.id)}
                                                    >
                                                        {selectedTagId === tag.id && <span className="tag-check">✓</span>}
                                                        {tag.title}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="form-section-title" style={{ marginTop: 18 }}>⚙️ İzinler & Durum</div>
                                    <div className="form-toggles">
                                        <label className="form-toggle" onClick={() => setForm({ ...form, allow_sms: !form.allow_sms })}>
                                            <div className={`toggle-switch ${form.allow_sms ? 'on' : ''}`} />
                                            SMS İzni
                                        </label>
                                        <label className="form-toggle" onClick={() => setForm({ ...form, allow_email: !form.allow_email })}>
                                            <div className={`toggle-switch ${form.allow_email ? 'on' : ''}`} />
                                            E-posta İzni
                                        </label>
                                        <label className="form-toggle" onClick={() => setForm({ ...form, is_active: !form.is_active })}>
                                            <div className={`toggle-switch ${form.is_active ? 'on' : ''}`} />
                                            Aktif Müşteri
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer with step navigation */}
                        <div className="modal-footer">
                            <div className="modal-footer-left">
                                {formStep > 0 && (
                                    <button className="btn-step-back" onClick={() => setFormStep(formStep - 1)}>
                                        ← Geri
                                    </button>
                                )}
                            </div>
                            <div className="modal-footer-right">
                                <button className="btn-cancel" onClick={closeModal}>Vazgeç</button>
                                {formStep < 2 ? (
                                    <button className="btn-step-next" onClick={() => {
                                        if (formStep === 0 && (!form.first_name.trim() || !form.phone_e164.trim())) {
                                            addToast('error', 'Ad ve Telefon alanları zorunludur.');
                                            return;
                                        }
                                        setFormStep(formStep + 1);
                                    }}>
                                        Devam →
                                    </button>
                                ) : (
                                    <button className="btn-save" onClick={handleSave} disabled={saving}>
                                        {saving ? '⏳ Kaydediliyor...' : (editingId ? '💾 Güncelle' : '✅ Kaydet')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
