import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { ToastContainer, useToast } from '../components/Toast';
import './Services.css';

export default function DefaultServices() {
    const { tenantUser } = useAuth();
    const navigate = useNavigate();
    const { toasts, addToast, dismissToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [expandedCats, setExpandedCats] = useState({});

    // Filters
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ title: '', category_id: '', is_active: true });

    // Delete
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Category management
    const [showCatManage, setShowCatManage] = useState(false);
    const [showCatAdd, setShowCatAdd] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [savingCat, setSavingCat] = useState(false);
    const [editingCatId, setEditingCatId] = useState(null);
    const [editCatName, setEditCatName] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [catRes, svcRes] = await Promise.all([
                supabase.from('service_categories').select('*').eq('is_active', true).order('name'),
                supabase.from('default_services').select('*').order('title'),
            ]);
            setCategories(catRes.data || []);
            setServices(svcRes.data || []);

            const exp = {};
            (svcRes.data || []).forEach(s => { if (s.category_id) exp[s.category_id] = true; });
            setExpandedCats(exp);
        } catch (err) {
            addToast('error', 'Veriler yüklenirken hata oluştu.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ─── Category CRUD ───
    const addCategory = async () => {
        if (!newCatName.trim()) return;
        setSavingCat(true);
        try {
            const { error } = await supabase.from('service_categories').insert({ name: newCatName.trim(), is_system: false });
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

    const updateCategory = async (catId) => {
        if (!editCatName.trim()) return;
        try {
            const { error } = await supabase.from('service_categories').update({ name: editCatName.trim() }).eq('id', catId);
            if (error) throw error;
            addToast('success', 'Kategori güncellendi!');
            setEditingCatId(null);
            await loadData();
        } catch (err) {
            addToast('error', 'Güncellenemedi: ' + err.message);
        }
    };

    const deleteCategory = async (catId) => {
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

    // ─── Service CRUD ───
    const openNew = () => {
        setEditingId(null);
        setForm({ title: '', category_id: '', is_active: true });
        setShowModal(true);
    };

    const openEdit = (svc) => {
        setEditingId(svc.id);
        setForm({ title: svc.title, category_id: svc.category_id || '', is_active: svc.is_active });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setForm({ title: '', category_id: '', is_active: true });
    };

    const saveService = async () => {
        if (!form.title.trim()) { addToast('error', 'Hizmet adı zorunludur.'); return; }
        if (!form.category_id) { addToast('error', 'Kategori seçiniz.'); return; }
        setSaving(true);
        try {
            const payload = {
                title: form.title.trim(),
                category_id: form.category_id,
                is_active: form.is_active,
            };
            if (editingId) {
                const { error } = await supabase.from('default_services').update(payload).eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('default_services').insert(payload);
                if (error) throw error;
            }
            addToast('success', editingId ? 'Hizmet güncellendi!' : 'Hizmet eklendi!');
            closeModal();
            await loadData();
        } catch (err) {
            addToast('error', 'Kayıt sırasında hata: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const deleteService = async (id) => {
        try {
            const { error } = await supabase.from('default_services').delete().eq('id', id);
            if (error) throw error;
            addToast('success', 'Hizmet silindi.');
            setDeleteConfirm(null);
            await loadData();
        } catch (err) {
            addToast('error', 'Silinemedi: ' + err.message);
        }
    };

    // ─── Filtering ───
    const filtered = services.filter(s => {
        if (search && !s.title.toLowerCase().includes(search.toLowerCase())) return false;
        if (filterCategory && s.category_id !== filterCategory) return false;
        return true;
    });

    const grouped = {};
    const uncategorized = [];
    filtered.forEach(s => {
        if (s.category_id) {
            if (!grouped[s.category_id]) grouped[s.category_id] = [];
            grouped[s.category_id].push(s);
        } else {
            uncategorized.push(s);
        }
    });

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

    return (
        <div className="svc-page">
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />

            {/* Header */}
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate('/admin')}>← Yönetim Paneline Dön</button>
                <h1>💇 Default Servis Yönetimi</h1>
                <p className="text-muted">Tüm şubelerin kullanabileceği hazır hizmet kataloğunu yönetin</p>
            </div>

            {/* Toolbar */}
            <div className="svc-toolbar">
                <div className="svc-toolbar-left">
                    <div className="svc-search-box">
                        <span className="svc-search-icon">🔍</span>
                        <input type="text" placeholder="Hizmet ara..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                        <option value="">Tüm Kategoriler</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="svc-add-btn" style={{ background: 'var(--color-secondary, #6c757d)' }} onClick={() => setShowCatManage(true)}>⚙ Kategoriler</button>
                    <button className="svc-add-btn" onClick={openNew}>+ Hizmet Ekle</button>
                </div>
            </div>

            {/* Count */}
            <div className="svc-count">{filtered.length} hizmet {search || filterCategory ? '(filtrelenmiş)' : ''}</div>

            {/* Service List */}
            <div className="svc-list">
                {filtered.length === 0 && (
                    <div className="svc-empty">
                        <div className="svc-empty-icon">💇</div>
                        <h3>Henüz default hizmet eklenmemiş</h3>
                        <p>Şubelerin kullanabileceği hazır hizmetler ekleyin.</p>
                        <button className="svc-add-btn" onClick={openNew}>+ İlk Hizmeti Ekle</button>
                    </div>
                )}

                {categories.filter(c => grouped[c.id]?.length > 0).map(cat => (
                    <div key={cat.id} className="svc-category-group">
                        <div className="svc-category-header" onClick={() => setExpandedCats(prev => ({ ...prev, [cat.id]: !prev[cat.id] }))}>
                            <span className="svc-cat-toggle">{expandedCats[cat.id] ? '▼' : '▶'}</span>
                            <span className="svc-cat-name">{cat.name}</span>
                            <span className="svc-cat-count">{grouped[cat.id].length} hizmet</span>
                        </div>
                        {expandedCats[cat.id] && (
                            <div className="svc-category-items">
                                {grouped[cat.id].map(svc => (
                                    <div key={svc.id} className={`svc-card ${!svc.is_active ? 'svc-card--inactive' : ''}`}>
                                        <div className="svc-card-main" onClick={() => openEdit(svc)}>
                                            <div className="svc-card-title">{svc.title}</div>
                                            <div className="svc-card-meta">
                                                {!svc.is_active && <span className="svc-badge svc-badge--inactive">Pasif</span>}
                                            </div>
                                        </div>
                                        <div className="svc-card-actions">
                                            <button className="svc-action-btn" onClick={() => openEdit(svc)} title="Düzenle">✏️</button>
                                            {deleteConfirm === svc.id ? (
                                                <div className="svc-delete-confirm">
                                                    <button className="svc-delete-yes" onClick={() => deleteService(svc.id)}>✓ Sil</button>
                                                    <button className="svc-delete-no" onClick={() => setDeleteConfirm(null)}>✕</button>
                                                </div>
                                            ) : (
                                                <button className="svc-action-btn svc-action-btn--danger" onClick={() => setDeleteConfirm(svc.id)} title="Sil">🗑️</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {uncategorized.length > 0 && (
                    <div className="svc-category-group">
                        <div className="svc-category-header" onClick={() => setExpandedCats(prev => ({ ...prev, none: !prev.none }))}>
                            <span className="svc-cat-toggle">{expandedCats.none ? '▼' : '▶'}</span>
                            <span className="svc-cat-name">Kategorisiz</span>
                            <span className="svc-cat-count">{uncategorized.length} hizmet</span>
                        </div>
                        {expandedCats.none && (
                            <div className="svc-category-items">
                                {uncategorized.map(svc => (
                                    <div key={svc.id} className={`svc-card ${!svc.is_active ? 'svc-card--inactive' : ''}`}>
                                        <div className="svc-card-main" onClick={() => openEdit(svc)}>
                                            <div className="svc-card-title">{svc.title}</div>
                                        </div>
                                        <div className="svc-card-actions">
                                            <button className="svc-action-btn" onClick={() => openEdit(svc)}>✏️</button>
                                            {deleteConfirm === svc.id ? (
                                                <div className="svc-delete-confirm">
                                                    <button className="svc-delete-yes" onClick={() => deleteService(svc.id)}>✓ Sil</button>
                                                    <button className="svc-delete-no" onClick={() => setDeleteConfirm(null)}>✕</button>
                                                </div>
                                            ) : (
                                                <button className="svc-action-btn svc-action-btn--danger" onClick={() => setDeleteConfirm(svc.id)}>🗑️</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Edit/Add Modal */}
            {showModal && (
                <div className="svc-overlay" onClick={closeModal}>
                    <div className="svc-edit-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <div className="svc-modal-header">
                            <h2>{editingId ? '✏️ Hizmet Düzenle' : '➕ Yeni Default Hizmet'}</h2>
                            <button className="svc-modal-close" onClick={closeModal}>✕</button>
                        </div>
                        <div className="svc-modal-body">
                            <div className="svc-form">
                                <div className="svc-field">
                                    <label>Hizmet Adı</label>
                                    <input type="text" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Örn: Saç Kesimi" />
                                </div>
                                <div className="svc-field">
                                    <label>Kategori</label>
                                    <select value={form.category_id} onChange={e => setForm(prev => ({ ...prev, category_id: e.target.value }))}>
                                        <option value="">Kategori seçin</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="svc-toggles">
                                    <label className="svc-toggle-row">
                                        <span>Aktif</span>
                                        <div className={`svc-switch ${form.is_active ? 'svc-switch--on' : ''}`} onClick={() => setForm(prev => ({ ...prev, is_active: !prev.is_active }))}>
                                            <div className="svc-switch-thumb"></div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="svc-modal-footer">
                            <button className="svc-btn-secondary" onClick={closeModal}>İptal</button>
                            <button className="svc-btn-primary" onClick={saveService} disabled={saving}>
                                {saving ? 'Kaydediliyor...' : (editingId ? '💾 Güncelle' : '✓ Ekle')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Category Manage Modal */}
            {showCatManage && (
                <div className="svc-overlay" onClick={() => setShowCatManage(false)}>
                    <div className="svc-edit-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <div className="svc-modal-header">
                            <h2>⚙ Kategori Yönetimi</h2>
                            <button className="svc-modal-close" onClick={() => setShowCatManage(false)}>✕</button>
                        </div>
                        <div className="svc-modal-body">
                            <div style={{ marginBottom: '16px' }}>
                                <button className="svc-add-btn" onClick={() => setShowCatAdd(true)} style={{ fontSize: '14px', padding: '8px 16px' }}>+ Yeni Kategori</button>
                            </div>

                            {showCatAdd && (
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                    <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Kategori adı" style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--glass-border)' }} onKeyDown={e => e.key === 'Enter' && addCategory()} />
                                    <button className="svc-btn-primary" onClick={addCategory} disabled={savingCat} style={{ padding: '8px 16px' }}>{savingCat ? '...' : '✓'}</button>
                                    <button className="svc-btn-secondary" onClick={() => { setShowCatAdd(false); setNewCatName(''); }} style={{ padding: '8px 16px' }}>✕</button>
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {categories.map(cat => (
                                    <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                                        {editingCatId === cat.id ? (
                                            <>
                                                <input type="text" value={editCatName} onChange={e => setEditCatName(e.target.value)} style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--glass-border)' }} onKeyDown={e => e.key === 'Enter' && updateCategory(cat.id)} />
                                                <button onClick={() => updateCategory(cat.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>✓</button>
                                                <button onClick={() => setEditingCatId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>✕</button>
                                            </>
                                        ) : (
                                            <>
                                                <span style={{ flex: 1 }}>{cat.name}</span>
                                                {cat.is_system && <span style={{ fontSize: '11px', opacity: 0.5, padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}>Sistem</span>}
                                                {!cat.is_system && (
                                                    <>
                                                        <button onClick={() => { setEditingCatId(cat.id); setEditCatName(cat.name); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>✏️</button>
                                                        <button onClick={() => deleteCategory(cat.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>🗑️</button>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
