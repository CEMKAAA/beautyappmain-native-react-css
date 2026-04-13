import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { ToastContainer, useToast } from '../components/Toast';
import './Packages.css';

export default function Packages() {
    const { tenantUser } = useAuth();
    const navigate = useNavigate();
    const { toasts, addToast, dismissToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Data
    const [branchId, setBranchId] = useState(null);
    const [branchGenderId, setBranchGenderId] = useState(null);
    const [genders, setGenders] = useState([]);
    const [packageGroups, setPackageGroups] = useState([]);
    const [serviceVariants, setServiceVariants] = useState([]); // all branch service variants with service info

    // Filters
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ title: '', gender_id: '', is_active: true });
    const [rows, setRows] = useState([]); // { service_variant_id, quantity, price_amount }

    // Delete
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // ─── Load ───
    useEffect(() => {
        if (tenantUser?.tenant_id) loadData();
    }, [tenantUser]);

    const loadData = async () => {
        try {
            // Get branch (same pattern as Services.jsx)
            const { data: branch } = await supabase
                .from('branches')
                .select('id, target_gender_id')
                .eq('tenant_id', tenantUser.tenant_id)
                .limit(1)
                .single();

            if (!branch) { addToast('error', 'Şube bulunamadı.'); setLoading(false); return; }
            setBranchId(branch.id);
            setBranchGenderId(branch.target_gender_id);

            // Parallel loads
            const [genderRes, groupRes, variantRes] = await Promise.all([
                // Load genders
                supabase.from('genders').select('*').order('sort_order'),
                // Load package groups with their packages
                supabase.from('package_groups').select(`
                    *,
                    genders(id, code, label),
                    packages(
                        *,
                        branch_service_variants(
                            id, gender_id, duration_min, price_amount,
                            branch_services(id, title)
                        )
                    )
                `).eq('branch_id', branch.id).order('created_at', { ascending: false }),
                // Load all active service variants for this branch (for the picker)
                supabase.from('branch_service_variants').select(`
                    id, gender_id, duration_min, price_amount, is_active,
                    branch_services!inner(id, title, branch_id, is_active)
                `).eq('branch_services.branch_id', branch.id)
                    .eq('branch_services.is_active', true)
                    .eq('is_active', true),
            ]);

            setGenders(genderRes.data || []);
            setPackageGroups(groupRes.data || []);
            setServiceVariants(variantRes.data || []);
        } catch (err) {
            console.error(err);
            addToast('error', 'Veriler yüklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    // ─── Gender helpers ───
    const getGenderIcon = (genderId) => {
        const g = genders.find(x => x.id === genderId);
        if (!g) return '';
        if (g.code === 'female') return '👩';
        if (g.code === 'male') return '👨';
        return '👥';
    };

    const getGenderLabel = (genderId) => {
        const g = genders.find(x => x.id === genderId);
        return g ? g.label : '';
    };

    const getVariantGenders = () => {
        if (!branchGenderId || genders.length === 0) return genders.filter(g => g.code !== 'unisex');
        const branchGender = genders.find(g => g.id === branchGenderId);
        if (!branchGender) return genders.filter(g => g.code !== 'unisex');
        if (branchGender.code === 'unisex') return genders.filter(g => g.code !== 'unisex');
        return [branchGender];
    };

    // Variants filtered by a specific gender
    const getVariantsForGender = (genderId) => {
        return serviceVariants.filter(v => v.gender_id === genderId);
    };

    // Get already-selected variant IDs (for duplicate prevention)
    const getSelectedVariantIds = (excludeIdx) => {
        return rows
            .filter((_, i) => i !== excludeIdx)
            .map(r => r.service_variant_id)
            .filter(Boolean);
    };

    // ─── Modal ───
    const openNew = () => {
        const availableGenders = getVariantGenders();
        setEditingId(null);
        setForm({
            title: '',
            gender_id: availableGenders.length === 1 ? availableGenders[0].id : '',
            is_active: true,
        });
        setRows([{ service_variant_id: '', quantity: 1, price_amount: '' }]);
        setShowModal(true);
    };

    const openEdit = (group) => {
        setEditingId(group.id);
        setForm({
            title: group.title || '',
            gender_id: group.gender_id || '',
            is_active: group.is_active,
        });
        setRows(
            (group.packages || []).map(p => ({
                id: p.id,
                service_variant_id: p.service_variant_id,
                quantity: p.quantity || 1,
                price_amount: p.price_amount != null ? p.price_amount : '',
            }))
        );
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setForm({ title: '', gender_id: '', is_active: true });
        setRows([]);
    };

    const addRow = () => {
        setRows(prev => [...prev, { service_variant_id: '', quantity: 1, price_amount: '' }]);
    };

    const removeRow = (idx) => {
        setRows(prev => prev.filter((_, i) => i !== idx));
    };

    const updateRow = (idx, field, value) => {
        setRows(prev => prev.map((r, i) => {
            if (i !== idx) return r;
            const updated = { ...r, [field]: value };
            // Auto-fill price from variant when selecting a service
            if (field === 'service_variant_id' && value) {
                const variant = serviceVariants.find(v => v.id === value);
                if (variant?.price_amount != null && !r.price_amount) {
                    updated.price_amount = variant.price_amount;
                }
            }
            return updated;
        }));
    };

    // ─── Save ───
    const savePackage = async () => {
        if (!form.title.trim()) { addToast('error', 'Paket adı zorunludur.'); return; }
        if (!form.gender_id) { addToast('error', 'Cinsiyet seçimi zorunludur.'); return; }
        if (rows.length === 0) { addToast('error', 'En az bir hizmet ekleyin.'); return; }
        const validRows = rows.filter(r => r.service_variant_id);
        if (validRows.length === 0) { addToast('error', 'Hizmet seçimi yapılmalıdır.'); return; }

        setSaving(true);
        try {
            let groupId = editingId;

            if (editingId) {
                // Update group
                const { error } = await supabase
                    .from('package_groups')
                    .update({
                        title: form.title.trim(),
                        gender_id: form.gender_id,
                        is_active: form.is_active,
                    })
                    .eq('id', editingId);
                if (error) throw error;

                // Delete old packages and re-insert
                await supabase.from('packages').delete().eq('group_id', editingId);
            } else {
                // Insert group
                const { data: newGroup, error } = await supabase
                    .from('package_groups')
                    .insert({
                        branch_id: branchId,
                        title: form.title.trim(),
                        gender_id: form.gender_id,
                        is_active: form.is_active,
                    })
                    .select()
                    .single();
                if (error) throw error;
                groupId = newGroup.id;
            }

            // Insert packages
            const packageRows = validRows.map(r => ({
                group_id: groupId,
                branch_id: branchId,
                service_variant_id: r.service_variant_id,
                quantity: r.quantity ? parseInt(r.quantity) : 1,
                price_amount: r.price_amount !== '' ? parseFloat(r.price_amount) : null,
                is_active: true,
            }));

            const { error: pkgErr } = await supabase.from('packages').insert(packageRows);
            if (pkgErr) throw pkgErr;

            addToast('success', editingId ? 'Paket güncellendi!' : 'Paket oluşturuldu!');
            closeModal();
            await loadData();
        } catch (err) {
            addToast('error', 'Kayıt hatası: ' + err.message);
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    // ─── Delete ───
    const deletePackage = async (id) => {
        try {
            const { error } = await supabase.from('package_groups').delete().eq('id', id);
            if (error) throw error;
            addToast('success', 'Paket silindi.');
            setDeleteConfirm(null);
            await loadData();
        } catch (err) {
            addToast('error', 'Silinemedi: ' + err.message);
        }
    };

    // ─── Filtering ───
    const filtered = packageGroups.filter(g => {
        if (search && !g.title?.toLowerCase().includes(search.toLowerCase())) return false;
        if (filterStatus === 'active' && !g.is_active) return false;
        if (filterStatus === 'inactive' && g.is_active) return false;
        if (filterStatus === 'incomplete') {
            const hasAllPrices = (g.packages || []).every(p => p.price_amount != null);
            if (hasAllPrices && (g.packages || []).length > 0) return false;
        }
        return true;
    });

    // ─── Variant display name ───
    const getVariantDisplayName = (variant) => {
        if (!variant) return 'Bilinmeyen';
        const svcTitle = variant.branch_services?.title || 'Hizmet';
        return svcTitle;
    };

    // ─── Loading ───
    if (loading) {
        return (
            <div className="pkg-page">
                <div className="loading-screen">
                    <div className="loading-spinner"></div>
                    <p>Yükleniyor...</p>
                </div>
            </div>
        );
    }

    const availableGenders = getVariantGenders();

    return (
        <div className="pkg-page">
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />

            {/* Header */}
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate('/settings')}>← Ayarlara Dön</button>
                <h1>🎀 Paket Yönetimi</h1>
                <p className="text-muted">Hizmet paketleri oluşturun ve yönetin</p>
            </div>

            {/* Toolbar */}
            <div className="pkg-toolbar">
                <div className="pkg-toolbar-left">
                    <div className="pkg-search-box">
                        <span className="pkg-search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Paket ara..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                        <option value="">Tüm Durumlar</option>
                        <option value="active">Aktif</option>
                        <option value="inactive">Pasif</option>
                        <option value="incomplete">Eksik</option>
                    </select>
                </div>
                <button className="pkg-add-btn" onClick={openNew}>+ Paket Oluştur</button>
            </div>

            {/* Count */}
            <div className="pkg-count">
                {filtered.length} paket {search || filterStatus ? '(filtrelenmiş)' : ''}
            </div>

            {/* Package List */}
            <div className="pkg-list">
                {filtered.length === 0 && (
                    <div className="pkg-empty">
                        <div className="pkg-empty-icon">🎀</div>
                        <h3>Henüz paket oluşturulmamış</h3>
                        <p>Hizmetlerinizi paketleyerek müşterilerinize avantajlı teklifler sunun.</p>
                        <button className="pkg-add-btn" onClick={openNew}>+ İlk Paketi Oluştur</button>
                    </div>
                )}

                {filtered.map(group => {
                    const pkgs = group.packages || [];
                    const total = pkgs.reduce((sum, p) => sum + (p.price_amount != null ? Number(p.price_amount) : 0), 0);
                    const allHavePrice = pkgs.every(p => p.price_amount != null) && pkgs.length > 0;

                    return (
                        <div key={group.id} className={`pkg-card ${!group.is_active ? 'pkg-card--inactive' : ''}`}>
                            <div className="pkg-card-header">
                                <div className="pkg-card-title-area">
                                    <h3 className="pkg-card-title">{group.title}</h3>
                                    <span className="pkg-card-gender">
                                        {getGenderIcon(group.gender_id)} {group.genders?.label || ''}
                                    </span>
                                    <span className={`pkg-card-status ${group.is_active ? 'pkg-card-status--active' : 'pkg-card-status--inactive'}`}>
                                        {group.is_active ? '🟢 Aktif' : '🔴 Pasif'}
                                    </span>
                                </div>
                                <div className="pkg-card-actions">
                                    <button className="pkg-card-btn" onClick={() => openEdit(group)} title="Düzenle">✏️</button>
                                    <button className="pkg-card-btn pkg-card-btn--delete" onClick={() => setDeleteConfirm(group)} title="Sil">🗑️</button>
                                </div>
                            </div>

                            <div className="pkg-card-items">
                                {pkgs.map(p => (
                                    <div key={p.id} className="pkg-item">
                                        <span className="pkg-item-name">
                                            {getVariantDisplayName(p.branch_service_variants)}
                                        </span>
                                        <div className="pkg-item-details">
                                            <span className="pkg-item-qty">{p.quantity} seans</span>
                                            {p.price_amount != null
                                                ? <span className="pkg-item-price">₺{Number(p.price_amount).toFixed(0)}</span>
                                                : <span className="pkg-item-price pkg-item-price--missing">⚠️ Fiyat Yok</span>
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {pkgs.length > 0 && (
                                <div className="pkg-card-total">
                                    <span className="pkg-card-total-label">Toplam:</span>
                                    <span className="pkg-card-total-amount">
                                        {allHavePrice ? `₺${total.toFixed(0)}` : '—'}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Create / Edit Modal */}
            {showModal && (
                <div className="pkg-overlay" onClick={closeModal}>
                    <div className="pkg-modal" onClick={e => e.stopPropagation()}>
                        <div className="pkg-modal-header">
                            <h2>{editingId ? '✏️ Paketi Düzenle' : '🎀 Yeni Paket'}</h2>
                            <div className="pkg-modal-header-right">
                                <div className="pkg-toggle-row">
                                    <span className="pkg-toggle-label">{form.is_active ? 'Aktif' : 'Pasif'}</span>
                                    <button
                                        type="button"
                                        className={`pkg-toggle-switch ${form.is_active ? 'pkg-toggle-switch--on' : ''}`}
                                        onClick={() => setForm(prev => ({ ...prev, is_active: !prev.is_active }))}
                                    >
                                        <span className="pkg-toggle-knob" />
                                    </button>
                                </div>
                                <button className="pkg-modal-close" onClick={closeModal}>×</button>
                            </div>
                        </div>

                        <div className="pkg-modal-body">
                            {/* Title */}
                            <div className="pkg-form-group">
                                <label>Paket Adı</label>
                                <input
                                    className="pkg-form-input"
                                    type="text"
                                    placeholder="Ör: Saç Bakım Paketi"
                                    value={form.title}
                                    onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                                />
                            </div>

                            {/* Gender */}
                            <div className="pkg-form-group">
                                <label>Cinsiyet</label>
                                <select
                                    className="pkg-form-select"
                                    value={form.gender_id}
                                    onChange={e => {
                                        setForm(prev => ({ ...prev, gender_id: e.target.value }));
                                        // Reset service selections when gender changes
                                        setRows([{ service_variant_id: '', quantity: 1, price_amount: '' }]);
                                    }}
                                    disabled={availableGenders.length === 1}
                                >
                                    <option value="">Seçiniz</option>
                                    {availableGenders.map(g => (
                                        <option key={g.id} value={g.id}>
                                            {g.code === 'female' ? '👩' : '👨'} {g.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Service Rows */}
                            <div className="pkg-form-group">
                                <div className="pkg-svc-picker-label">
                                    <label>Paket İçeriği</label>
                                    <button
                                        className="pkg-svc-add-row-btn"
                                        onClick={addRow}
                                        disabled={!form.gender_id}
                                    >
                                        + Hizmet Ekle
                                    </button>
                                </div>

                                {!form.gender_id ? (
                                    <div className="pkg-svc-empty">Önce cinsiyet seçin</div>
                                ) : rows.length === 0 ? (
                                    <div className="pkg-svc-empty">Henüz hizmet eklenmedi. Yukarıdaki butona tıklayarak hizmet ekleyin.</div>
                                ) : (
                                    <div className="pkg-svc-rows">
                                        {rows.map((row, idx) => {
                                            const genderVariants = getVariantsForGender(form.gender_id);
                                            const selectedIds = getSelectedVariantIds(idx);
                                            const selectedVariant = serviceVariants.find(v => v.id === row.service_variant_id);
                                            return (
                                                <div key={idx} className="pkg-svc-card">
                                                    <div className="pkg-svc-card-header">
                                                        <span className="pkg-svc-card-num">{idx + 1}</span>
                                                        <button
                                                            className="pkg-svc-remove-btn"
                                                            onClick={() => removeRow(idx)}
                                                            title="Kaldır"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                    <div className="pkg-svc-card-field">
                                                        <label>Hizmet</label>
                                                        <select
                                                            value={row.service_variant_id}
                                                            onChange={e => updateRow(idx, 'service_variant_id', e.target.value)}
                                                        >
                                                            <option value="">Hizmet seçin...</option>
                                                            {genderVariants.map(v => (
                                                                <option
                                                                    key={v.id}
                                                                    value={v.id}
                                                                    disabled={selectedIds.includes(v.id)}
                                                                >
                                                                    {v.branch_services?.title || 'Hizmet'}
                                                                    {v.duration_min ? ` — ${v.duration_min} dk` : ''}
                                                                    {v.price_amount != null ? ` — ₺${Number(v.price_amount).toFixed(0)}` : ''}
                                                                    {selectedIds.includes(v.id) ? ' ✓ Eklendi' : ''}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="pkg-svc-card-row">
                                                        <div className="pkg-svc-card-field">
                                                            <label>Seans Sayısı</label>
                                                            <div className="pkg-svc-qty-wrapper">
                                                                <button
                                                                    type="button"
                                                                    className="pkg-svc-qty-btn"
                                                                    onClick={() => updateRow(idx, 'quantity', Math.max(1, (parseInt(row.quantity) || 1) - 1))}
                                                                >
                                                                    −
                                                                </button>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    value={row.quantity}
                                                                    onChange={e => updateRow(idx, 'quantity', e.target.value)}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="pkg-svc-qty-btn"
                                                                    onClick={() => updateRow(idx, 'quantity', (parseInt(row.quantity) || 1) + 1)}
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="pkg-svc-card-field">
                                                            <label>Paket Fiyatı (₺)</label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                placeholder={selectedVariant?.price_amount != null ? `Normal: ₺${Number(selectedVariant.price_amount).toFixed(0)}` : '₺ Fiyat girin'}
                                                                value={row.price_amount}
                                                                onChange={e => updateRow(idx, 'price_amount', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    {selectedVariant && row.price_amount && Number(row.price_amount) < Number(selectedVariant.price_amount) * (parseInt(row.quantity) || 1) && (
                                                        <div className="pkg-svc-card-discount">
                                                            💰 {Math.round((1 - Number(row.price_amount) / (Number(selectedVariant.price_amount) * (parseInt(row.quantity) || 1))) * 100)}% indirimli
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pkg-modal-footer">
                            <button className="pkg-btn-cancel" onClick={closeModal}>İptal</button>
                            <button className="pkg-btn-save" onClick={savePackage} disabled={saving}>
                                {saving ? 'Kaydediliyor...' : (editingId ? 'Güncelle' : 'Oluştur')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteConfirm && (
                <div className="pkg-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="pkg-delete-modal" onClick={e => e.stopPropagation()}>
                        <h3>Paketi Sil</h3>
                        <p>"{deleteConfirm.title}" paketini silmek istediğinize emin misiniz?</p>
                        <div className="pkg-delete-actions">
                            <button className="pkg-btn-cancel" onClick={() => setDeleteConfirm(null)}>İptal</button>
                            <button className="pkg-btn-danger" onClick={() => deletePackage(deleteConfirm.id)}>Evet, Sil</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
