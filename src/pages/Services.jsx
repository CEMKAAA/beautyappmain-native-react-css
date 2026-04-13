import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { ToastContainer, useToast } from '../components/Toast';
import './Services.css';

export default function Services() {
    const { tenantUser } = useAuth();
    const navigate = useNavigate();
    const { toasts, addToast, dismissToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Data
    const [branchId, setBranchId] = useState(null);
    const [branchGenderId, setBranchGenderId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [defaultServices, setDefaultServices] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [genders, setGenders] = useState([]);

    // Filters
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // Accordion
    const [expandedCats, setExpandedCats] = useState({});

    // Catalog modal
    const [showCatalog, setShowCatalog] = useState(false);
    const [catalogSearch, setCatalogSearch] = useState('');
    const [catalogExpanded, setCatalogExpanded] = useState({});
    const [selectedDefaults, setSelectedDefaults] = useState([]);

    // Edit modal
    const [showModal, setShowModal] = useState(false);
    const [modalTab, setModalTab] = useState('general');
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ title: '', category_id: '', show_online: true, is_active: true });
    const [variants, setVariants] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState([]);

    // Delete
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // ─── Add Method Selection ───
    const [showAddChoice, setShowAddChoice] = useState(false);

    // ─── Category Add ───
    const [showCatAdd, setShowCatAdd] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [savingCat, setSavingCat] = useState(false);

    // ─── Category Manage ───
    const [showCatManage, setShowCatManage] = useState(false);
    const [editingCatId, setEditingCatId] = useState(null);
    const [editCatName, setEditCatName] = useState('');

    useEffect(() => {
        if (tenantUser?.tenant_id) loadData();
    }, [tenantUser]);

    // ─── Load ───
    const loadData = async () => {
        try {
            setLoading(true);

            // Get branch
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
            const [catRes, svcRes, defRes, staffRes, genderRes] = await Promise.all([
                supabase.from('service_categories').select('*').eq('is_active', true).order('name'),
                supabase.from('branch_services').select(`
                    *,
                    branch_service_variants (*),
                    branch_service_staff (*, tenant_staff:staff_id (id, first_name, last_name, color))
                `).eq('branch_id', branch.id).order('title'),
                supabase.from('default_services').select('*').eq('is_active', true).order('title'),
                supabase.from('tenant_staff').select('id, first_name, last_name, color, is_active, client_gender_id, client_genders:genders!tenant_staff_client_gender_id_fkey(code, label)')
                    .eq('branch_id', branch.id).eq('is_active', true).order('first_name'),
                supabase.from('genders').select('*').order('label'),
            ]);

            setCategories(catRes.data || []);
            setServices(svcRes.data || []);
            setDefaultServices(defRes.data || []);
            setStaffList(staffRes.data || []);
            setGenders(genderRes.data || []);

            // Auto-expand categories that have services
            const usedCats = {};
            (svcRes.data || []).forEach(s => { if (s.category_id) usedCats[s.category_id] = true; });
            setExpandedCats(usedCats);

        } catch (err) {
            addToast('error', 'Veriler yüklenirken hata oluştu.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ─── Gender helpers ───
    const getVariantGenders = () => {
        if (!branchGenderId || genders.length === 0) return genders.filter(g => g.code !== 'unisex');
        const branchGender = genders.find(g => g.id === branchGenderId);
        if (!branchGender) return genders.filter(g => g.code !== 'unisex');
        if (branchGender.code === 'unisex') return genders.filter(g => g.code !== 'unisex');
        return [branchGender];
    };

    // ─── Add Category ───
    const addCategory = async () => {
        if (!newCatName.trim()) return;
        setSavingCat(true);
        try {
            const { error } = await supabase.from('service_categories').insert({
                name: newCatName.trim(),
                is_system: false,
            });
            if (error) throw error;
            addToast('success', `"${newCatName.trim()}" kategorisi eklendi!`);
            setNewCatName('');
            setShowCatAdd(false);
            await loadData();
        } catch (err) {
            addToast('error', 'Kategori eklenemedi: ' + err.message);
        } finally {
            setSavingCat(false);
        }
    };

    // ─── Update / Delete Category ───
    const startEditCat = (cat) => {
        setEditingCatId(cat.id);
        setEditCatName(cat.name);
    };

    const cancelEditCat = () => {
        setEditingCatId(null);
        setEditCatName('');
    };

    const updateCategory = async (catId) => {
        if (!editCatName.trim()) return;
        try {
            const { error } = await supabase.from('service_categories').update({ name: editCatName.trim() }).eq('id', catId);
            if (error) throw error;
            addToast('success', 'Kategori güncellendi!');
            setEditingCatId(null);
            setEditCatName('');
            await loadData();
        } catch (err) {
            addToast('error', 'Güncellenemedi: ' + err.message);
        }
    };

    const deleteCategory = async (catId) => {
        // Check if category has services
        const used = services.some(s => s.category_id === catId);
        if (used) {
            addToast('error', 'Bu kategoride hizmetler var. Önce hizmetlerin kategorisini değiştirin.');
            return;
        }
        try {
            const { error } = await supabase.from('service_categories').delete().eq('id', catId);
            if (error) throw error;
            addToast('success', 'Kategori silindi!');
            await loadData();
        } catch (err) {
            addToast('error', 'Silinemedi: ' + err.message);
        }
    };

    // ─── Catalog ───
    const openCatalog = () => {
        setShowCatalog(true);
        setCatalogSearch('');
        setSelectedDefaults([]);
        // Auto-expand all
        const exp = {};
        categories.forEach(c => { exp[c.id] = true; });
        setCatalogExpanded(exp);
    };

    const isAlreadyImported = (defId) => {
        return services.some(s => s.default_service_id === defId);
    };

    const toggleDefaultSelect = (defId) => {
        setSelectedDefaults(prev =>
            prev.includes(defId) ? prev.filter(id => id !== defId) : [...prev, defId]
        );
    };

    const importSelected = async () => {
        if (selectedDefaults.length === 0) return;
        setSaving(true);
        try {
            const variantGenders = getVariantGenders();
            for (const defId of selectedDefaults) {
                const def = defaultServices.find(d => d.id === defId);
                if (!def) continue;

                // Insert service
                const { data: newSvc, error: svcErr } = await supabase
                    .from('branch_services')
                    .insert({
                        branch_id: branchId,
                        category_id: def.category_id,
                        default_service_id: def.id,
                        title: def.title,
                    })
                    .select()
                    .single();

                if (svcErr) { addToast('error', `${def.title} eklenemedi: ${svcErr.message}`); continue; }

                // Insert variants
                const variantRows = variantGenders.map(g => ({
                    service_id: newSvc.id,
                    gender_id: g.id,
                }));
                if (variantRows.length > 0) {
                    await supabase.from('branch_service_variants').insert(variantRows);
                }
            }

            addToast('success', `${selectedDefaults.length} hizmet eklendi!`);
            setShowCatalog(false);
            await loadData();
        } catch (err) {
            addToast('error', 'Bir hata oluştu.');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    // ─── Edit Modal ───
    const openNew = () => {
        setEditingId(null);
        setForm({ title: '', category_id: '', show_online: true, is_active: true });
        const variantGenders = getVariantGenders();
        setVariants(variantGenders.map(g => ({
            id: null, gender_id: g.id, duration_min: '', price_amount: '', is_active: true
        })));
        setSelectedStaff([]);
        setModalTab('general');
        setShowModal(true);
    };

    const openEdit = (svc) => {
        setEditingId(svc.id);
        setForm({
            title: svc.title,
            category_id: svc.category_id || '',
            show_online: svc.show_online,
            is_active: svc.is_active,
        });
        // Load existing variants
        const existingVars = (svc.branch_service_variants || []).map(v => ({
            id: v.id,
            gender_id: v.gender_id,
            duration_min: v.duration_min ?? '',
            price_amount: v.price_amount ?? '',
            is_active: v.is_active,
        }));
        // Add missing variants for current branch gender
        const variantGenders = getVariantGenders();
        variantGenders.forEach(g => {
            if (!existingVars.find(v => v.gender_id === g.id)) {
                existingVars.push({ id: null, gender_id: g.id, duration_min: '', price_amount: '', is_active: true });
            }
        });
        setVariants(existingVars);
        // Load existing staff
        setSelectedStaff((svc.branch_service_staff || []).map(s => s.staff_id));
        setModalTab('general');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setForm({ title: '', category_id: '', show_online: true, is_active: true });
        setVariants([]);
        setSelectedStaff([]);
    };

    // ─── Save ───
    const saveService = async () => {
        if (!form.title.trim()) { addToast('error', 'Hizmet adı zorunludur.'); return; }
        setSaving(true);
        try {
            let serviceId = editingId;

            if (editingId) {
                // Update
                const { error } = await supabase
                    .from('branch_services')
                    .update({
                        title: form.title.trim(),
                        category_id: form.category_id || null,
                        show_online: form.show_online,
                        is_active: form.is_active,
                    })
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                // Insert
                const { data: newSvc, error } = await supabase
                    .from('branch_services')
                    .insert({
                        branch_id: branchId,
                        title: form.title.trim(),
                        category_id: form.category_id || null,
                        show_online: form.show_online,
                        is_active: form.is_active,
                    })
                    .select()
                    .single();
                if (error) throw error;
                serviceId = newSvc.id;
            }

            // Save variants
            for (const v of variants) {
                const varData = {
                    service_id: serviceId,
                    gender_id: v.gender_id,
                    duration_min: v.duration_min ? parseInt(v.duration_min) : null,
                    price_amount: v.price_amount ? parseFloat(v.price_amount) : null,
                    is_active: v.is_active,
                };
                if (v.id) {
                    await supabase.from('branch_service_variants').update(varData).eq('id', v.id);
                } else {
                    await supabase.from('branch_service_variants').upsert(varData, { onConflict: 'service_id,gender_id' });
                }
            }

            // Save staff assignments
            // Delete removed
            const existing = editingId
                ? (services.find(s => s.id === editingId)?.branch_service_staff || [])
                : [];
            const existingStaffIds = existing.map(s => s.staff_id);
            const toDelete = existingStaffIds.filter(id => !selectedStaff.includes(id));
            const toInsert = selectedStaff.filter(id => !existingStaffIds.includes(id));

            if (toDelete.length > 0) {
                await supabase.from('branch_service_staff')
                    .delete()
                    .eq('service_id', serviceId)
                    .in('staff_id', toDelete);
            }
            if (toInsert.length > 0) {
                await supabase.from('branch_service_staff')
                    .insert(toInsert.map(sid => ({ service_id: serviceId, staff_id: sid })));
            }

            addToast('success', editingId ? 'Hizmet güncellendi!' : 'Hizmet oluşturuldu!');
            closeModal();
            await loadData();
        } catch (err) {
            addToast('error', 'Kayıt sırasında hata: ' + err.message);
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    // ─── Delete ───
    const deleteService = async (id) => {
        try {
            const { error } = await supabase.from('branch_services').delete().eq('id', id);
            if (error) throw error;
            addToast('success', 'Hizmet silindi.');
            setDeleteConfirm(null);
            await loadData();
        } catch (err) {
            addToast('error', 'Silinemedi: ' + err.message);
        }
    };

    // ─── Filtering ───
    const filteredServices = services.filter(s => {
        if (search && !s.title.toLowerCase().includes(search.toLowerCase())) return false;
        if (filterCategory && s.category_id !== filterCategory) return false;
        if (filterStatus === 'active' && !s.is_active) return false;
        if (filterStatus === 'inactive' && s.is_active) return false;
        if (filterStatus === 'incomplete') {
            const hasPrice = (s.branch_service_variants || []).some(v => v.price_amount != null);
            if (hasPrice) return false;
        }
        return true;
    });

    const groupedServices = () => {
        const grouped = {};
        const uncategorized = [];

        filteredServices.forEach(s => {
            if (s.category_id) {
                if (!grouped[s.category_id]) grouped[s.category_id] = [];
                grouped[s.category_id].push(s);
            } else {
                uncategorized.push(s);
            }
        });

        return { grouped, uncategorized };
    };

    const getGenderLabel = (genderId) => {
        const g = genders.find(x => x.id === genderId);
        return g ? g.label : '';
    };

    const getGenderIcon = (genderId) => {
        const g = genders.find(x => x.id === genderId);
        if (!g) return '';
        if (g.code === 'female') return '👩';
        if (g.code === 'male') return '👨';
        return '👥';
    };

    // ─── Catalog filtered ───
    const filteredDefaults = defaultServices.filter(d =>
        !catalogSearch || d.title.toLowerCase().includes(catalogSearch.toLowerCase())
    );

    // ─── Loading ───
    if (loading) {
        return (
            <div className="svc-page">
                <div className="loading-screen">
                    <div className="loading-spinner"></div>
                    <p>Yükleniyor...</p>
                </div>
            </div>
        );
    }

    const { grouped, uncategorized } = groupedServices();

    return (
        <div className="svc-page">
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />

            {/* Header */}
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate('/settings')}>← Ayarlara Dön</button>
                <h1>💇 Hizmet Yönetimi</h1>
                <p className="text-muted">Şubenizin sunduğu hizmetleri tanımlayın ve yönetin</p>
            </div>

            {/* Toolbar */}
            <div className="svc-toolbar">
                <div className="svc-toolbar-left">
                    <div className="svc-search-box">
                        <span className="svc-search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Hizmet ara..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                        <option value="">Tüm Kategoriler</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                        <option value="">Tüm Durumlar</option>
                        <option value="active">Aktif</option>
                        <option value="inactive">Pasif</option>
                        <option value="incomplete">Eksik</option>
                    </select>
                </div>
                <button className="svc-add-btn" onClick={() => setShowAddChoice(true)}>+ Hizmet Ekle</button>
            </div>

            {/* Service Count */}
            <div className="svc-count">
                {filteredServices.length} hizmet {search || filterCategory || filterStatus ? '(filtrelenmiş)' : ''}
            </div>

            {/* Service List */}
            <div className="svc-list">
                {filteredServices.length === 0 && (
                    <div className="svc-empty">
                        <div className="svc-empty-icon">💇</div>
                        <h3>Henüz hizmet eklenmemiş</h3>
                        <p>Hazır listeden seçerek veya sıfırdan oluşturarak hizmet ekleyebilirsiniz.</p>
                        <button className="svc-add-btn" onClick={() => setShowAddChoice(true)}>+ İlk Hizmeti Ekle</button>
                    </div>
                )}

                {categories.filter(c => grouped[c.id]?.length > 0).map(cat => (
                    <div key={cat.id} className="svc-category-group">
                        <div
                            className="svc-category-header"
                            onClick={() => setExpandedCats(prev => ({ ...prev, [cat.id]: !prev[cat.id] }))}
                        >
                            <span className="svc-cat-toggle">{expandedCats[cat.id] ? '▼' : '▶'}</span>
                            <span className="svc-cat-name">{cat.name}</span>
                            <span className="svc-cat-count">{grouped[cat.id].length} hizmet</span>
                        </div>

                        {expandedCats[cat.id] && (
                            <div className="svc-category-items">
                                {grouped[cat.id].map(svc => renderServiceCard(svc))}
                            </div>
                        )}
                    </div>
                ))}

                {uncategorized.length > 0 && (
                    <div className="svc-category-group">
                        <div className="svc-category-header"
                            onClick={() => setExpandedCats(prev => ({ ...prev, none: !prev.none }))}
                        >
                            <span className="svc-cat-toggle">{expandedCats.none ? '▼' : '▶'}</span>
                            <span className="svc-cat-name">Kategorisiz</span>
                            <span className="svc-cat-count">{uncategorized.length} hizmet</span>
                        </div>
                        {expandedCats.none && (
                            <div className="svc-category-items">
                                {uncategorized.map(svc => renderServiceCard(svc))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Add Choice Modal */}
            {showAddChoice && (
                <div className="svc-overlay" onClick={() => setShowAddChoice(false)}>
                    <div className="svc-choice-modal" onClick={e => e.stopPropagation()}>
                        <h2>Hizmet Nasıl Eklemek İstersiniz?</h2>
                        <div className="svc-choice-cards">
                            <div className="svc-choice-card" onClick={() => { setShowAddChoice(false); openCatalog(); }}>
                                <div className="svc-choice-icon">📋</div>
                                <h3>Hazır Listeden Seç</h3>
                                <p>Kategorilere göre hazır hizmetlerden seçin</p>
                            </div>
                            <div className="svc-choice-card" onClick={() => { setShowAddChoice(false); openNew(); }}>
                                <div className="svc-choice-icon">✏️</div>
                                <h3>Sıfırdan Oluştur</h3>
                                <p>Kendi hizmetinizi tanımlayın</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Catalog Modal */}
            {showCatalog && (
                <div className="svc-overlay" onClick={() => setShowCatalog(false)}>
                    <div className="svc-catalog-modal" onClick={e => e.stopPropagation()}>
                        <div className="svc-modal-header">
                            <h2>📋 Hazır Hizmet Kataloğu</h2>
                            <button className="svc-modal-close" onClick={() => setShowCatalog(false)}>✕</button>
                        </div>

                        <div className="svc-catalog-search">
                            <span>🔍</span>
                            <input
                                placeholder="Hizmet ara..."
                                value={catalogSearch}
                                onChange={e => setCatalogSearch(e.target.value)}
                            />
                        </div>

                        <div className="svc-catalog-list">
                            {categories.filter(c => filteredDefaults.some(d => d.category_id === c.id)).map(cat => (
                                <div key={cat.id} className="svc-catalog-cat">
                                    <div className="svc-catalog-cat-header"
                                        onClick={() => setCatalogExpanded(prev => ({ ...prev, [cat.id]: !prev[cat.id] }))}
                                    >
                                        <span>{catalogExpanded[cat.id] ? '▼' : '▶'}</span>
                                        <span className="svc-catalog-cat-name">{cat.name}</span>
                                        <span className="svc-catalog-cat-count">
                                            {filteredDefaults.filter(d => d.category_id === cat.id).length}
                                        </span>
                                    </div>
                                    {catalogExpanded[cat.id] && (
                                        <div className="svc-catalog-items">
                                            {filteredDefaults.filter(d => d.category_id === cat.id).map(def => {
                                                const imported = isAlreadyImported(def.id);
                                                return (
                                                    <label key={def.id} className={`svc-catalog-item ${imported ? 'svc-catalog-item--imported' : ''}`}>
                                                        <input
                                                            type="checkbox"
                                                            checked={imported || selectedDefaults.includes(def.id)}
                                                            disabled={imported}
                                                            onChange={() => toggleDefaultSelect(def.id)}
                                                        />
                                                        <span className="svc-catalog-item-title">{def.title}</span>
                                                        {imported && <span className="svc-catalog-imported-badge">✓ Ekli</span>}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="svc-catalog-footer">
                            <span className="svc-catalog-selected-count">
                                {selectedDefaults.length} hizmet seçildi
                            </span>
                            <div className="svc-catalog-actions">
                                <button className="svc-btn-secondary" onClick={() => setShowCatalog(false)}>İptal</button>
                                <button
                                    className="svc-btn-primary"
                                    disabled={selectedDefaults.length === 0 || saving}
                                    onClick={importSelected}
                                >
                                    {saving ? 'Ekleniyor...' : `✓ Seçilenleri Ekle (${selectedDefaults.length})`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showModal && (
                <div className="svc-overlay" onClick={closeModal}>
                    <div className="svc-edit-modal" onClick={e => e.stopPropagation()}>
                        <div className="svc-modal-header">
                            <h2>{editingId ? '✏️ Hizmet Düzenle' : '➕ Yeni Hizmet'}</h2>
                            <button className="svc-modal-close" onClick={closeModal}>✕</button>
                        </div>

                        {/* Tabs */}
                        <div className="svc-modal-tabs">
                            {['general', 'pricing', 'staff'].map(tab => (
                                <button
                                    key={tab}
                                    className={`svc-modal-tab ${modalTab === tab ? 'svc-modal-tab--active' : ''}`}
                                    onClick={() => setModalTab(tab)}
                                >
                                    {tab === 'general' && '📝 Genel'}
                                    {tab === 'pricing' && '💰 Fiyatlandırma'}
                                    {tab === 'staff' && '👥 Personel'}
                                </button>
                            ))}
                        </div>

                        <div className="svc-modal-body">
                            {/* General Tab */}
                            {modalTab === 'general' && (
                                <div className="svc-form">
                                    <div className="svc-field">
                                        <label>Hizmet Adı</label>
                                        <input
                                            type="text"
                                            value={form.title}
                                            onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                                            placeholder="Örn: Saç Kesimi"
                                        />
                                    </div>
                                    <div className="svc-field">
                                        <label>Kategori</label>
                                        <div className="svc-cat-select-row">
                                            <select
                                                value={form.category_id}
                                                onChange={e => setForm(prev => ({ ...prev, category_id: e.target.value }))}
                                            >
                                                <option value="">Kategori seçin</option>
                                                {categories.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                            <button type="button" className="svc-cat-manage-btn" onClick={() => setShowCatManage(true)} title="Kategorileri yönet">⚙</button>
                                        </div>
                                    </div>
                                    <div className="svc-toggles">
                                        <label className="svc-toggle-row">
                                            <span>Online randevuda göster</span>
                                            <div className={`svc-switch ${form.show_online ? 'svc-switch--on' : ''}`}
                                                onClick={() => setForm(prev => ({ ...prev, show_online: !prev.show_online }))}>
                                                <div className="svc-switch-thumb"></div>
                                            </div>
                                        </label>
                                        <label className="svc-toggle-row">
                                            <span>Aktif</span>
                                            <div className={`svc-switch ${form.is_active ? 'svc-switch--on' : ''}`}
                                                onClick={() => setForm(prev => ({ ...prev, is_active: !prev.is_active }))}>
                                                <div className="svc-switch-thumb"></div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Pricing Tab */}
                            {modalTab === 'pricing' && (
                                <div className="svc-pricing">
                                    {variants.length === 0 && (
                                        <p className="svc-pricing-empty">Şubenizin cinsiyet ayarına göre varyant bulunamadı.</p>
                                    )}
                                    {variants.map((v, idx) => (
                                        <div key={v.gender_id} className="svc-variant-card">
                                            <div className="svc-variant-header">
                                                <span className="svc-variant-gender">
                                                    {getGenderIcon(v.gender_id)} {getGenderLabel(v.gender_id)}
                                                </span>
                                                <label className="svc-variant-active">
                                                    <span>Aktif</span>
                                                    <div className={`svc-switch ${v.is_active ? 'svc-switch--on' : ''}`}
                                                        onClick={() => {
                                                            const updated = [...variants];
                                                            updated[idx] = { ...updated[idx], is_active: !updated[idx].is_active };
                                                            setVariants(updated);
                                                        }}>
                                                        <div className="svc-switch-thumb"></div>
                                                    </div>
                                                </label>
                                            </div>
                                            <div className="svc-variant-fields">
                                                <div className="svc-field">
                                                    <label>Süre (dk)</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={v.duration_min}
                                                        onChange={e => {
                                                            const updated = [...variants];
                                                            updated[idx] = { ...updated[idx], duration_min: e.target.value };
                                                            setVariants(updated);
                                                        }}
                                                        placeholder="30"
                                                    />
                                                </div>
                                                <div className="svc-field">
                                                    <label>Fiyat (₺)</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={v.price_amount}
                                                        onChange={e => {
                                                            const updated = [...variants];
                                                            updated[idx] = { ...updated[idx], price_amount: e.target.value };
                                                            setVariants(updated);
                                                        }}
                                                        placeholder="150.00"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Staff Tab */}
                            {modalTab === 'staff' && (
                                <div className="svc-staff-assign">
                                    <p className="svc-staff-info">Bu hizmeti yapabilen personelleri seçin:</p>
                                    {staffList.length === 0 && (
                                        <p className="svc-staff-empty">Henüz aktif personel bulunmuyor.</p>
                                    )}
                                    <label className="svc-staff-item svc-staff-selectall">
                                        <input
                                            type="checkbox"
                                            checked={staffList.length > 0 && selectedStaff.length === staffList.length}
                                            onChange={e => {
                                                setSelectedStaff(e.target.checked ? staffList.map(s => s.id) : []);
                                            }}
                                        />
                                        <span className="svc-staff-name">Tümünü Seç</span>
                                    </label>
                                    {staffList.map(staff => (
                                        <label key={staff.id} className="svc-staff-item">
                                            <input
                                                type="checkbox"
                                                checked={selectedStaff.includes(staff.id)}
                                                onChange={e => {
                                                    setSelectedStaff(prev =>
                                                        e.target.checked
                                                            ? [...prev, staff.id]
                                                            : prev.filter(id => id !== staff.id)
                                                    );
                                                }}
                                            />
                                            <span
                                                className="svc-staff-color"
                                                style={{ backgroundColor: staff.color || '#6366f1' }}
                                            ></span>
                                            <span className="svc-staff-name">
                                                {staff.first_name} {staff.last_name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="svc-modal-footer">
                            <button className="svc-btn-secondary" onClick={closeModal}>İptal</button>
                            <button className="svc-btn-primary" onClick={saveService} disabled={saving}>
                                {saving ? 'Kaydediliyor...' : '💾 Kaydet'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteConfirm && (
                <div className="svc-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="svc-delete-modal" onClick={e => e.stopPropagation()}>
                        <h3>🗑️ Hizmeti Sil</h3>
                        <p>
                            <strong>"{deleteConfirm.title}"</strong> hizmetini silmek istediğinize emin misiniz?
                            Fiyat bilgileri ve personel atamaları da silinecektir.
                        </p>
                        <div className="svc-delete-actions">
                            <button className="svc-btn-secondary" onClick={() => setDeleteConfirm(null)}>İptal</button>
                            <button className="svc-btn-danger" onClick={() => deleteService(deleteConfirm.id)}>Sil</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Category Manage Modal */}
            {showCatManage && (
                <div className="svc-overlay" onClick={() => { setShowCatManage(false); cancelEditCat(); }}>
                    <div className="svc-catmanage-modal" onClick={e => e.stopPropagation()}>
                        <div className="svc-modal-header">
                            <h2>📂 Kategori Yönetimi</h2>
                            <button className="svc-modal-close" onClick={() => { setShowCatManage(false); cancelEditCat(); }}>✕</button>
                        </div>
                        <div className="svc-catmanage-body">
                            {categories.length === 0 && (
                                <p className="svc-staff-empty">Henüz kategori yok.</p>
                            )}
                            {categories.map(cat => {
                                const svcCount = services.filter(s => s.category_id === cat.id).length;
                                const isEditing = editingCatId === cat.id;
                                return (
                                    <div key={cat.id} className="svc-catmanage-item">
                                        {isEditing ? (
                                            <div className="svc-catmanage-edit-row">
                                                <input
                                                    type="text"
                                                    value={editCatName}
                                                    onChange={e => setEditCatName(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && updateCategory(cat.id)}
                                                    autoFocus
                                                />
                                                <button className="svc-btn-primary svc-cat-save-btn" onClick={() => updateCategory(cat.id)}>✓</button>
                                                <button className="svc-btn-secondary svc-cat-cancel-btn" onClick={cancelEditCat}>✕</button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="svc-catmanage-info">
                                                    <span className="svc-catmanage-name">{cat.name}</span>
                                                    <span className="svc-catmanage-count">{svcCount} hizmet</span>
                                                    {cat.is_system && <span className="svc-catmanage-system">🔒 Sistem</span>}
                                                </div>
                                                {!cat.is_system && (
                                                    <div className="svc-catmanage-actions">
                                                        <button className="svc-card-btn svc-card-btn--edit" onClick={() => startEditCat(cat)} title="Düzenle">✏️</button>
                                                        <button className="svc-card-btn svc-card-btn--delete" onClick={() => deleteCategory(cat.id)} title="Sil">🗑️</button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="svc-catmanage-footer">
                            <div className="svc-cat-add-row" style={{ flex: 1 }}>
                                <input
                                    type="text"
                                    placeholder="Yeni kategori adı..."
                                    value={newCatName}
                                    onChange={e => setNewCatName(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && addCategory()}
                                />
                                <button className="svc-btn-primary svc-cat-save-btn" onClick={addCategory} disabled={savingCat || !newCatName.trim()}>
                                    {savingCat ? '...' : '+ Ekle'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    // ─── Service Card Renderer ───
    function renderServiceCard(svc) {
        const vars = svc.branch_service_variants || [];
        const staffAssigned = svc.branch_service_staff || [];
        const hasPrice = vars.some(v => v.price_amount != null);

        return (
            <div key={svc.id} className={`svc-card ${!svc.is_active ? 'svc-card--inactive' : ''}`}>
                <div className="svc-card-main">
                    <div className="svc-card-info">
                        <h4 className="svc-card-title">{svc.title}</h4>
                        <div className="svc-card-variants">
                            {vars.filter(v => v.is_active).map(v => (
                                <span key={v.id} className="svc-card-variant">
                                    {getGenderIcon(v.gender_id)}{' '}
                                    {v.duration_min ? `${v.duration_min}dk` : '—'}{' · '}
                                    {v.price_amount != null ? `₺${Number(v.price_amount).toFixed(0)}` : '—'}
                                </span>
                            ))}
                            {!hasPrice && <span className="svc-card-warning">⚠️ Fiyat belirlenmemiş</span>}
                        </div>
                        <div className="svc-card-meta">
                            <span className="svc-card-staff">
                                👥 {staffAssigned.length > 0
                                    ? staffAssigned.map(s => s.tenant_staff?.first_name).filter(Boolean).join(', ')
                                    : 'Atanmamış'}
                            </span>
                            <span className={`svc-card-status ${svc.is_active ? 'svc-card-status--active' : 'svc-card-status--inactive'}`}>
                                {svc.is_active ? '🟢 Aktif' : '🔴 Pasif'}
                            </span>
                            {!svc.show_online && <span className="svc-card-badge">🔒 Online Gizli</span>}
                        </div>
                    </div>
                    <div className="svc-card-actions">
                        <button className="svc-card-btn svc-card-btn--edit" onClick={() => openEdit(svc)} title="Düzenle">✏️</button>
                        <button className="svc-card-btn svc-card-btn--delete" onClick={() => setDeleteConfirm(svc)} title="Sil">🗑️</button>
                    </div>
                </div>
            </div>
        );
    }
}
