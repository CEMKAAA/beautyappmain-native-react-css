import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { ToastContainer, useToast } from '../components/Toast';
import './ProductCatalog.css';

export default function ProductCatalog() {
    const { tenantUser } = useAuth();
    const navigate = useNavigate();
    const { toasts, addToast, dismissToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);

    // Filters
    const [search, setSearch] = useState('');
    const [filterBrand, setFilterBrand] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        name: '', brand_id: '', barcode: '', description: '', is_active: true,
    });

    // Delete
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        if (tenantUser?.tenant_id) loadData();
    }, [tenantUser]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [prodRes, brandRes] = await Promise.all([
                supabase.from('products').select('*, product_brands(name)').eq('tenant_id', tenantUser.tenant_id).order('name'),
                supabase.from('product_brands').select('*').eq('is_active', true).order('name'),
            ]);
            setProducts(prodRes.data || []);
            setBrands(brandRes.data || []);
        } catch (err) {
            addToast('error', 'Veriler yüklenirken hata oluştu.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ─── CRUD ───
    const openNew = () => {
        setEditingId(null);
        setForm({ name: '', brand_id: '', barcode: '', description: '', is_active: true });
        setShowModal(true);
    };

    const openEdit = (p) => {
        setEditingId(p.id);
        setForm({
            name: p.name || '',
            brand_id: p.brand_id || '',
            barcode: p.barcode || '',
            description: p.description || '',
            is_active: p.is_active,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setForm({ name: '', brand_id: '', barcode: '', description: '', is_active: true });
    };

    const saveProduct = async () => {
        if (!form.name.trim()) { addToast('error', 'Ürün adı zorunludur.'); return; }
        setSaving(true);
        try {
            const payload = {
                name: form.name.trim(),
                brand_id: form.brand_id || null,
                barcode: form.barcode.trim() || null,
                description: form.description.trim() || null,
                is_active: form.is_active,
            };
            if (editingId) {
                const { error } = await supabase.from('products').update(payload).eq('id', editingId);
                if (error) throw error;
            } else {
                payload.tenant_id = tenantUser.tenant_id;
                const { error } = await supabase.from('products').insert(payload);
                if (error) throw error;
            }
            addToast('success', editingId ? 'Ürün güncellendi!' : 'Ürün eklendi!');
            closeModal();
            await loadData();
        } catch (err) {
            addToast('error', 'Kayıt hatası: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const deleteProduct = async (id) => {
        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
            addToast('success', 'Ürün silindi.');
            setDeleteConfirm(null);
            await loadData();
        } catch (err) {
            addToast('error', 'Silinemedi: ' + err.message);
        }
    };

    // ─── Filter ───
    const filtered = products.filter(p => {
        if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (filterBrand && p.brand_id !== filterBrand) return false;
        if (filterStatus === 'active' && !p.is_active) return false;
        if (filterStatus === 'inactive' && p.is_active) return false;
        return true;
    });

    // Group by brand
    const groupedByBrand = {};
    const noBrand = [];
    filtered.forEach(p => {
        if (p.brand_id) {
            if (!groupedByBrand[p.brand_id]) groupedByBrand[p.brand_id] = [];
            groupedByBrand[p.brand_id].push(p);
        } else {
            noBrand.push(p);
        }
    });

    const getBrandName = (brandId) => {
        const b = brands.find(x => x.id === brandId);
        return b ? b.name : 'Bilinmeyen';
    };

    if (loading) {
        return (
            <div className="prod-page">
                <div className="loading-screen">
                    <div className="loading-spinner"></div>
                    <p>Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="prod-page">
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />

            {/* Header */}
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate('/admin')}>← Yönetim Paneline Dön</button>
                <h1>📦 Ürün Kataloğu</h1>
                <p className="text-muted">Tüm ürünlerinizi merkezi olarak tanımlayın</p>
            </div>

            {/* Toolbar */}
            <div className="prod-toolbar">
                <div className="prod-toolbar-left">
                    <div className="prod-search-box">
                        <span className="prod-search-icon">🔍</span>
                        <input type="text" placeholder="Ürün ara..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <select value={filterBrand} onChange={e => setFilterBrand(e.target.value)}>
                        <option value="">Tüm Markalar</option>
                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                        <option value="">Tüm Durumlar</option>
                        <option value="active">Aktif</option>
                        <option value="inactive">Pasif</option>
                    </select>
                </div>
                <button className="prod-add-btn" onClick={openNew}>+ Ürün Ekle</button>
            </div>

            {/* Count */}
            <div className="prod-count">{filtered.length} ürün {search || filterBrand || filterStatus ? '(filtrelenmiş)' : ''}</div>

            {/* Product Table */}
            {filtered.length === 0 ? (
                <div className="prod-empty">
                    <div className="prod-empty-icon">📦</div>
                    <h3>Henüz ürün eklenmemiş</h3>
                    <p>Merkezi ürün kataloğunuza ürün ekleyerek başlayın.</p>
                    <button className="prod-add-btn" onClick={openNew}>+ İlk Ürünü Ekle</button>
                </div>
            ) : (
                <div className="prod-table-wrap">
                    <table className="prod-table">
                        <thead>
                            <tr>
                                <th>Ürün Adı</th>
                                <th>Marka</th>
                                <th>Barkod</th>
                                <th>Durum</th>
                                <th style={{ width: '100px', textAlign: 'center' }}>İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(prod => (
                                <tr key={prod.id} className={!prod.is_active ? 'prod-row--inactive' : ''}>
                                    <td className="prod-cell-name" onClick={() => openEdit(prod)}>{prod.name}</td>
                                    <td>{prod.product_brands?.name && <span className="prod-cell-brand">{prod.product_brands.name}</span>}</td>
                                    <td className="prod-cell-barcode">{prod.barcode || '—'}</td>
                                    <td>
                                        {prod.is_active
                                            ? <span className="prod-status-badge prod-status--active">Aktif</span>
                                            : <span className="prod-status-badge prod-status--inactive">Pasif</span>
                                        }
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div className="prod-row-actions">
                                            <button className="prod-action-btn" onClick={() => openEdit(prod)} title="Düzenle">✏️</button>
                                            {deleteConfirm === prod.id ? (
                                                <div className="prod-delete-confirm">
                                                    <button className="prod-delete-yes" onClick={() => deleteProduct(prod.id)}>✓</button>
                                                    <button className="prod-delete-no" onClick={() => setDeleteConfirm(null)}>✕</button>
                                                </div>
                                            ) : (
                                                <button className="prod-action-btn prod-action-btn--danger" onClick={() => setDeleteConfirm(prod.id)} title="Sil">🗑️</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit/Add Modal */}
            {showModal && (
                <div className="prod-overlay" onClick={closeModal}>
                    <div className="prod-modal" onClick={e => e.stopPropagation()}>
                        <div className="prod-modal-header">
                            <h2>{editingId ? '✏️ Ürün Düzenle' : '➕ Yeni Ürün'}</h2>
                            <button className="prod-modal-close" onClick={closeModal}>✕</button>
                        </div>
                        <div className="prod-modal-body">
                            <div className="prod-form">
                                <div className="prod-field">
                                    <label>Ürün Adı *</label>
                                    <input type="text" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Örn: Saç Boyası 6.0" />
                                </div>
                                <div className="prod-field-row">
                                    <div className="prod-field">
                                        <label>Marka</label>
                                        <select value={form.brand_id} onChange={e => setForm(prev => ({ ...prev, brand_id: e.target.value }))}>
                                            <option value="">Marka seçin (opsiyonel)</option>
                                            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="prod-field">
                                        <label>Barkod</label>
                                        <input type="text" value={form.barcode} onChange={e => setForm(prev => ({ ...prev, barcode: e.target.value }))} placeholder="Opsiyonel" />
                                    </div>
                                </div>
                                <div className="prod-field">
                                    <label>Açıklama</label>
                                    <textarea value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Ürün açıklaması (opsiyonel)" rows={3} />
                                </div>
                                <div className="prod-toggles">
                                    <label className="prod-toggle-row">
                                        <span>Aktif</span>
                                        <div className={`prod-switch ${form.is_active ? 'prod-switch--on' : ''}`} onClick={() => setForm(prev => ({ ...prev, is_active: !prev.is_active }))}>
                                            <div className="prod-switch-thumb"></div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="prod-modal-footer">
                            <button className="prod-btn-secondary" onClick={closeModal}>İptal</button>
                            <button className="prod-btn-primary" onClick={saveProduct} disabled={saving}>
                                {saving ? 'Kaydediliyor...' : (editingId ? '💾 Güncelle' : '✓ Ekle')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
