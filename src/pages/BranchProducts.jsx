import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { ToastContainer, useToast } from '../components/Toast';
import './ProductCatalog.css';

export default function BranchProducts() {
    const { tenantUser } = useAuth();
    const navigate = useNavigate();
    const { toasts, addToast, dismissToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [branchId, setBranchId] = useState(null);
    const [branchProducts, setBranchProducts] = useState([]);
    const [catalogProducts, setCatalogProducts] = useState([]);
    const [brands, setBrands] = useState([]);

    // Filters
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // Add from catalog modal
    const [showCatalog, setShowCatalog] = useState(false);
    const [catalogSearch, setCatalogSearch] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);

    // Edit modal
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        purchase_price: '', sale_price: '', track_stock: true, stock_qty: '', low_stock_threshold: '', is_active: true,
    });

    // Delete
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        if (tenantUser?.tenant_id) loadData();
    }, [tenantUser]);

    const loadData = async () => {
        try {
            setLoading(true);

            // Get branch
            const { data: branch } = await supabase
                .from('branches')
                .select('id')
                .eq('tenant_id', tenantUser.tenant_id)
                .limit(1)
                .single();

            if (!branch) { addToast('error', 'Şube bulunamadı.'); setLoading(false); return; }
            setBranchId(branch.id);

            // Parallel loads
            const [bpRes, catRes, brandRes] = await Promise.all([
                supabase.from('branch_products').select('*, products(id, name, barcode, brand_id, product_brands(name))').eq('branch_id', branch.id).order('created_at', { ascending: false }),
                supabase.from('products').select('*, product_brands(name)').eq('tenant_id', tenantUser.tenant_id).eq('is_active', true).order('name'),
                supabase.from('product_brands').select('*').eq('is_active', true).order('name'),
            ]);

            setBranchProducts(bpRes.data || []);
            setCatalogProducts(catRes.data || []);
            setBrands(brandRes.data || []);
        } catch (err) {
            addToast('error', 'Veriler yüklenirken hata oluştu.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ─── Catalog (add from tenant products) ───
    const openCatalog = () => {
        setShowCatalog(true);
        setCatalogSearch('');
        setSelectedProducts([]);
    };

    const isAlreadyAdded = (productId) => branchProducts.some(bp => bp.product_id === productId);

    const toggleProductSelect = (prodId) => {
        setSelectedProducts(prev =>
            prev.includes(prodId) ? prev.filter(id => id !== prodId) : [...prev, prodId]
        );
    };

    const importSelected = async () => {
        if (selectedProducts.length === 0) return;
        setSaving(true);
        try {
            const rows = selectedProducts.map(prodId => ({
                branch_id: branchId,
                product_id: prodId,
            }));
            const { error } = await supabase.from('branch_products').insert(rows);
            if (error) throw error;

            addToast('success', `${selectedProducts.length} ürün şubeye eklendi!`);
            setShowCatalog(false);
            await loadData();
        } catch (err) {
            addToast('error', 'Eklenemedi: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const filteredCatalog = catalogProducts.filter(p => {
        if (catalogSearch && !p.name.toLowerCase().includes(catalogSearch.toLowerCase())) return false;
        return true;
    });

    // ─── Edit Modal ───
    const openEdit = (bp) => {
        setEditingId(bp.id);
        setForm({
            purchase_price: bp.purchase_price ?? '',
            sale_price: bp.sale_price ?? '',
            track_stock: bp.track_stock,
            stock_qty: bp.stock_qty ?? '',
            low_stock_threshold: bp.low_stock_threshold ?? '',
            is_active: bp.is_active,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setForm({ purchase_price: '', sale_price: '', track_stock: true, stock_qty: '', low_stock_threshold: '', is_active: true });
    };

    const saveProduct = async () => {
        setSaving(true);
        try {
            const payload = {
                purchase_price: form.purchase_price !== '' ? parseFloat(form.purchase_price) : null,
                sale_price: form.sale_price !== '' ? parseFloat(form.sale_price) : null,
                track_stock: form.track_stock,
                stock_qty: form.stock_qty !== '' ? parseInt(form.stock_qty) : 0,
                low_stock_threshold: form.low_stock_threshold !== '' ? parseInt(form.low_stock_threshold) : null,
                is_active: form.is_active,
            };

            const { error } = await supabase.from('branch_products').update(payload).eq('id', editingId);
            if (error) throw error;

            addToast('success', 'Ürün bilgileri güncellendi!');
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
            const { error } = await supabase.from('branch_products').delete().eq('id', id);
            if (error) throw error;
            addToast('success', 'Ürün şubeden kaldırıldı.');
            setDeleteConfirm(null);
            await loadData();
        } catch (err) {
            addToast('error', 'Silinemedi: ' + err.message);
        }
    };

    // ─── Filter ───
    const filtered = branchProducts.filter(bp => {
        const name = bp.products?.name || '';
        if (search && !name.toLowerCase().includes(search.toLowerCase())) return false;
        if (filterStatus === 'active' && !bp.is_active) return false;
        if (filterStatus === 'inactive' && bp.is_active) return false;
        if (filterStatus === 'low_stock' && bp.track_stock) {
            if (!bp.low_stock_threshold || bp.stock_qty > bp.low_stock_threshold) return false;
        }
        if (filterStatus === 'incomplete') {
            if (bp.sale_price != null) return false;
        }
        return true;
    });

    const getStockStatus = (bp) => {
        if (!bp.track_stock) return null;
        if (bp.stock_qty <= 0) return 'out';
        if (bp.low_stock_threshold && bp.stock_qty <= bp.low_stock_threshold) return 'low';
        return 'ok';
    };

    const editingBP = editingId ? branchProducts.find(bp => bp.id === editingId) : null;

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
                <button className="back-btn" onClick={() => navigate('/settings')}>← Ayarlara Dön</button>
                <h1>📦 Şube Ürünleri</h1>
                <p className="text-muted">Şubenize ürün ekleyin, fiyat ve stok bilgilerini yönetin</p>
            </div>

            {/* Toolbar */}
            <div className="prod-toolbar">
                <div className="prod-toolbar-left">
                    <div className="prod-search-box">
                        <span className="prod-search-icon">🔍</span>
                        <input type="text" placeholder="Ürün ara..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                        <option value="">Tüm Durumlar</option>
                        <option value="active">Aktif</option>
                        <option value="inactive">Pasif</option>
                        <option value="low_stock">Düşük Stok</option>
                        <option value="incomplete">Eksik</option>
                    </select>
                </div>
                <button className="prod-add-btn" onClick={openCatalog}>+ Katalogdan Ekle</button>
            </div>

            {/* Count */}
            <div className="prod-count">{filtered.length} ürün {search || filterStatus ? '(filtrelenmiş)' : ''}</div>

            {/* Product Table */}
            {filtered.length === 0 ? (
                <div className="prod-empty">
                    <div className="prod-empty-icon">📦</div>
                    <h3>Henüz şubeye ürün eklenmemiş</h3>
                    <p>Merkezi katalogdan ürün seçerek başlayın.</p>
                    <button className="prod-add-btn" onClick={openCatalog}>+ Katalogdan Ekle</button>
                </div>
            ) : (
                <div className="prod-table-wrap">
                    <table className="prod-table">
                        <thead>
                            <tr>
                                <th>Ürün Adı</th>
                                <th>Marka</th>
                                <th>Satış Fiyatı</th>
                                <th>Stok</th>
                                <th>Durum</th>
                                <th style={{ width: '100px', textAlign: 'center' }}>İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(bp => {
                                const stockStatus = getStockStatus(bp);
                                return (
                                    <tr key={bp.id} className={!bp.is_active ? 'prod-row--inactive' : ''}>
                                        <td className="prod-cell-name" onClick={() => openEdit(bp)}>{bp.products?.name || 'İsimsiz'}</td>
                                        <td>{bp.products?.product_brands?.name && <span className="prod-cell-brand">{bp.products.product_brands.name}</span>}</td>
                                        <td>
                                            {bp.sale_price != null
                                                ? <span className="prod-cell-price">₺{Number(bp.sale_price).toFixed(2)}</span>
                                                : <span className="prod-status-badge prod-status--warning">⚠️ Fiyat Yok</span>
                                            }
                                        </td>
                                        <td>
                                            {!bp.track_stock ? (
                                                <span className="prod-cell-barcode">Takip yok</span>
                                            ) : stockStatus === 'out' ? (
                                                <span className="prod-status-badge prod-status--inactive">⚠️ Tükendi</span>
                                            ) : stockStatus === 'low' ? (
                                                <span className="prod-status-badge prod-status--warning">⚠️ {bp.stock_qty}</span>
                                            ) : (
                                                <span>{bp.stock_qty}</span>
                                            )}
                                        </td>
                                        <td>
                                            {bp.is_active
                                                ? <span className="prod-status-badge prod-status--active">Aktif</span>
                                                : <span className="prod-status-badge prod-status--inactive">Pasif</span>
                                            }
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div className="prod-row-actions">
                                                <button className="prod-action-btn" onClick={() => openEdit(bp)} title="Düzenle">✏️</button>
                                                {deleteConfirm === bp.id ? (
                                                    <div className="prod-delete-confirm">
                                                        <button className="prod-delete-yes" onClick={() => deleteProduct(bp.id)}>✓</button>
                                                        <button className="prod-delete-no" onClick={() => setDeleteConfirm(null)}>✕</button>
                                                    </div>
                                                ) : (
                                                    <button className="prod-action-btn prod-action-btn--danger" onClick={() => setDeleteConfirm(bp.id)} title="Kaldır">🗑️</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Catalog Modal */}
            {showCatalog && (
                <div className="prod-overlay" onClick={() => setShowCatalog(false)}>
                    <div className="prod-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="prod-modal-header">
                            <h2>📋 Ürün Kataloğundan Seç</h2>
                            <button className="prod-modal-close" onClick={() => setShowCatalog(false)}>✕</button>
                        </div>

                        <div className="prod-catalog-search">
                            <span>🔍</span>
                            <input placeholder="Ürün ara..." value={catalogSearch} onChange={e => setCatalogSearch(e.target.value)} />
                        </div>

                        <div className="prod-modal-body">
                            {filteredCatalog.length === 0 && (
                                <div className="prod-catalog-empty">
                                    <p>Katalogda ürün bulunamadı.</p>
                                    <p>Önce Yönetim Paneli → Ürün Kataloğu'ndan ürün ekleyin.</p>
                                </div>
                            )}
                            <div className="prod-catalog-list">
                                {filteredCatalog.map(prod => {
                                    const added = isAlreadyAdded(prod.id);
                                    return (
                                        <label key={prod.id} className={`prod-catalog-item ${added ? 'prod-catalog-item--imported' : ''}`}>
                                            <input
                                                type="checkbox"
                                                checked={added || selectedProducts.includes(prod.id)}
                                                disabled={added}
                                                onChange={() => toggleProductSelect(prod.id)}
                                            />
                                            <span className="prod-catalog-item-title">{prod.name}</span>
                                            {prod.product_brands?.name && (
                                                <span className="prod-cell-brand">{prod.product_brands.name}</span>
                                            )}
                                            {added && <span className="prod-catalog-imported-badge">✓ Ekli</span>}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="prod-modal-footer">
                            <span className="prod-catalog-selected-count">
                                {selectedProducts.length} ürün seçildi
                            </span>
                            <button className="prod-btn-secondary" onClick={() => setShowCatalog(false)}>İptal</button>
                            <button className="prod-btn-primary" onClick={importSelected} disabled={selectedProducts.length === 0 || saving}>
                                {saving ? 'Ekleniyor...' : `✓ Seçilenleri Ekle (${selectedProducts.length})`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showModal && editingBP && (
                <div className="prod-overlay" onClick={closeModal}>
                    <div className="prod-modal" onClick={e => e.stopPropagation()}>
                        <div className="prod-modal-header">
                            <h2>✏️ {editingBP.products?.name || 'Ürün'}</h2>
                            <button className="prod-modal-close" onClick={closeModal}>✕</button>
                        </div>
                        <div className="prod-modal-body">
                            <div className="prod-form">
                                <div className="prod-field-row">
                                    <div className="prod-field">
                                        <label>Alış Fiyatı (₺)</label>
                                        <input type="number" min="0" step="0.01" value={form.purchase_price} onChange={e => setForm(prev => ({ ...prev, purchase_price: e.target.value }))} placeholder="0.00" />
                                    </div>
                                    <div className="prod-field">
                                        <label>Satış Fiyatı (₺)</label>
                                        <input type="number" min="0" step="0.01" value={form.sale_price} onChange={e => setForm(prev => ({ ...prev, sale_price: e.target.value }))} placeholder="0.00" />
                                    </div>
                                </div>

                                <div className="prod-toggles">
                                    <label className="prod-toggle-row">
                                        <span>Stok Takibi</span>
                                        <div className={`prod-switch ${form.track_stock ? 'prod-switch--on' : ''}`} onClick={() => setForm(prev => ({ ...prev, track_stock: !prev.track_stock }))}>
                                            <div className="prod-switch-thumb"></div>
                                        </div>
                                    </label>
                                </div>

                                {form.track_stock && (
                                    <div className="prod-field-row">
                                        <div className="prod-field">
                                            <label>Stok Miktarı</label>
                                            <input type="number" min="0" value={form.stock_qty} onChange={e => setForm(prev => ({ ...prev, stock_qty: e.target.value }))} placeholder="0" />
                                        </div>
                                        <div className="prod-field">
                                            <label>Min. Stok Uyarı Eşiği</label>
                                            <input type="number" min="0" value={form.low_stock_threshold} onChange={e => setForm(prev => ({ ...prev, low_stock_threshold: e.target.value }))} placeholder="5" />
                                        </div>
                                    </div>
                                )}

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
                                {saving ? 'Kaydediliyor...' : '💾 Güncelle'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
