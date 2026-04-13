import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { ToastContainer, useToast } from '../components/Toast';
import './TagSettings.css';

const DEFAULT_COLORS = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
    '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
    '#64748b', '#a855f7',
];

export default function TagSettings() {
    const { tenantUser } = useAuth();
    const navigate = useNavigate();
    const { toasts, addToast, dismissToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [branchId, setBranchId] = useState(null);
    const [activeTab, setActiveTab] = useState('customer');

    // Data
    const [customerTags, setCustomerTags] = useState([]);
    const [appointmentTags, setAppointmentTags] = useState([]);

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [modalType, setModalType] = useState('customer'); // 'customer' | 'appointment'
    const [form, setForm] = useState({
        title: '',
        color: '#6366f1',
        is_active: true,
        // Customer-specific
        cash_parapuan_pct: '',
        card_parapuan_pct: '',
        discount_enabled: false,
        discount_pct: '',
    });

    // Delete
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        if (tenantUser?.tenant_id) loadData();
    }, [tenantUser]);

    const loadData = async () => {
        try {
            setLoading(true);

            const { data: branch } = await supabase
                .from('branches')
                .select('id')
                .eq('tenant_id', tenantUser.tenant_id)
                .single();

            if (!branch) { addToast('error', 'Şube bulunamadı.'); setLoading(false); return; }
            setBranchId(branch.id);

            const [custRes, apptRes] = await Promise.all([
                supabase.from('customer_tags').select('*').eq('branch_id', branch.id).order('created_at'),
                supabase.from('appointment_tags').select('*').eq('branch_id', branch.id).order('created_at'),
            ]);

            setCustomerTags(custRes.data || []);
            setAppointmentTags(apptRes.data || []);
        } catch (err) {
            console.error(err);
            addToast('error', 'Veriler yüklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    // ─── Modal ───
    const openNew = (type) => {
        setModalType(type);
        setEditingId(null);
        setForm({
            title: '',
            color: '#6366f1',
            is_active: true,
            cash_parapuan_pct: '',
            card_parapuan_pct: '',
            discount_enabled: false,
            discount_pct: '',
        });
        setShowModal(true);
    };

    const openEdit = (tag, type) => {
        setModalType(type);
        setEditingId(tag.id);
        setForm({
            title: tag.title,
            color: tag.color || '#6366f1',
            is_active: tag.is_active,
            cash_parapuan_pct: tag.cash_parapuan_pct ?? '',
            card_parapuan_pct: tag.card_parapuan_pct ?? '',
            discount_enabled: tag.discount_enabled ?? false,
            discount_pct: tag.discount_pct ?? '',
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
    };

    // ─── Save ───
    const saveTag = async () => {
        if (!form.title.trim()) { addToast('error', 'Etiket adı zorunludur.'); return; }
        setSaving(true);

        try {
            const table = modalType === 'customer' ? 'customer_tags' : 'appointment_tags';

            if (modalType === 'customer') {
                const payload = {
                    title: form.title.trim(),
                    color: form.color,
                    is_active: form.is_active,
                    cash_parapuan_pct: form.cash_parapuan_pct !== '' ? parseFloat(form.cash_parapuan_pct) : null,
                    card_parapuan_pct: form.card_parapuan_pct !== '' ? parseFloat(form.card_parapuan_pct) : null,
                    discount_enabled: form.discount_enabled,
                    discount_pct: form.discount_enabled && form.discount_pct !== '' ? parseFloat(form.discount_pct) : null,
                };

                if (editingId) {
                    const { error } = await supabase.from(table).update(payload).eq('id', editingId);
                    if (error) throw error;
                } else {
                    const { error } = await supabase.from(table).insert({ ...payload, branch_id: branchId });
                    if (error) throw error;
                }
            } else {
                const payload = {
                    title: form.title.trim(),
                    color: form.color,
                    is_active: form.is_active,
                };

                if (editingId) {
                    const { error } = await supabase.from(table).update(payload).eq('id', editingId);
                    if (error) throw error;
                } else {
                    const { error } = await supabase.from(table).insert({ ...payload, branch_id: branchId });
                    if (error) throw error;
                }
            }

            addToast('success', editingId ? 'Etiket güncellendi!' : 'Etiket oluşturuldu!');
            closeModal();
            await loadData();
        } catch (err) {
            if (err.message?.includes('uq_')) {
                addToast('error', 'Bu isimde bir etiket zaten mevcut.');
            } else {
                addToast('error', 'Kayıt sırasında hata: ' + err.message);
            }
        } finally {
            setSaving(false);
        }
    };

    // ─── Delete ───
    const deleteTag = async (id, type) => {
        try {
            const table = type === 'customer' ? 'customer_tags' : 'appointment_tags';
            const { error } = await supabase.from(table).delete().eq('id', id);
            if (error) throw error;
            addToast('success', 'Etiket silindi.');
            setDeleteConfirm(null);
            await loadData();
        } catch (err) {
            addToast('error', 'Silinemedi: ' + err.message);
        }
    };

    // ─── Render ───
    const currentTags = activeTab === 'customer' ? customerTags : appointmentTags;

    if (loading) {
        return (
            <div className="tag-page">
                <div className="tag-loading">
                    <div className="tag-spinner"></div>
                    <p>Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="tag-page">
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />

            {/* Header */}
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate('/settings')}>← Ayarlara Dön</button>
                <h1>🏷️ Etiket Ayarları</h1>
                <p className="text-muted">Müşteri ve randevu etiketlerini yönetin</p>
            </div>

            {/* Tabs */}
            <div className="tag-tabs">
                <button
                    className={`tag-tab ${activeTab === 'customer' ? 'tag-tab--active' : ''}`}
                    onClick={() => setActiveTab('customer')}
                >
                    👤 Müşteri Etiketleri
                    <span className="tag-tab-count">{customerTags.length}</span>
                </button>
                <button
                    className={`tag-tab ${activeTab === 'appointment' ? 'tag-tab--active' : ''}`}
                    onClick={() => setActiveTab('appointment')}
                >
                    📅 Randevu Etiketleri
                    <span className="tag-tab-count">{appointmentTags.length}</span>
                </button>
            </div>

            {/* Toolbar */}
            <div className="tag-toolbar">
                <button className="tag-add-btn" onClick={() => openNew(activeTab)}>
                    + Yeni Etiket
                </button>
            </div>

            {/* Tag List */}
            <div className="tag-list">
                {currentTags.length === 0 ? (
                    <div className="tag-empty">
                        <div className="tag-empty-icon">🏷️</div>
                        <h3>Henüz etiket oluşturulmamış</h3>
                        <p>Yukarıdaki butona tıklayarak ilk etiketi oluşturun.</p>
                    </div>
                ) : (
                    currentTags.map(tag => (
                        <div key={tag.id} className={`tag-item ${!tag.is_active ? 'tag-item--inactive' : ''}`}>
                            <div className="tag-item-left">
                                <span className="tag-color-dot" style={{ background: tag.color || '#6366f1' }} />
                                <div className="tag-item-info">
                                    <span className="tag-item-title">{tag.title}</span>
                                    <div className="tag-item-badges">
                                        {!tag.is_active && <span className="tag-badge tag-badge--inactive">Pasif</span>}
                                        {activeTab === 'customer' && tag.discount_enabled && (
                                            <span className="tag-badge tag-badge--discount">%{tag.discount_pct} İndirim</span>
                                        )}
                                        {activeTab === 'customer' && (tag.cash_parapuan_pct > 0 || tag.card_parapuan_pct > 0) && (
                                            <span className="tag-badge tag-badge--parapuan">Özel Parapuan</span>
                                        )}
                                        {activeTab === 'customer' && tag.auto_enabled && (
                                            <span className="tag-badge tag-badge--auto">Otomatik</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="tag-item-actions">
                                <button className="tag-edit-btn" onClick={() => openEdit(tag, activeTab)}>✏️</button>
                                <button className="tag-delete-btn" onClick={() => setDeleteConfirm({ id: tag.id, type: activeTab, title: tag.title })}>🗑️</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="tag-overlay" onClick={closeModal}>
                    <div className="tag-modal" onClick={e => e.stopPropagation()}>
                        <div className="tag-modal-header">
                            <h2>{editingId ? '✏️ Etiketi Düzenle' : '🏷️ Yeni Etiket'}</h2>
                            <button className="tag-modal-close" onClick={closeModal}>×</button>
                        </div>

                        <div className="tag-modal-body">
                            {/* Title */}
                            <div className="tag-form-group">
                                <label>Etiket Adı</label>
                                <input
                                    className="tag-form-input"
                                    type="text"
                                    placeholder={modalType === 'customer' ? 'Ör: VIP, Sadık Müşteri' : 'Ör: Online, Tekrar'}
                                    value={form.title}
                                    onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                                />
                            </div>

                            {/* Color */}
                            <div className="tag-form-group">
                                <label>Renk</label>
                                <div className="tag-color-picker">
                                    {DEFAULT_COLORS.map(c => (
                                        <button
                                            key={c}
                                            type="button"
                                            className={`tag-color-swatch ${form.color === c ? 'tag-color-swatch--active' : ''}`}
                                            style={{ background: c }}
                                            onClick={() => setForm(prev => ({ ...prev, color: c }))}
                                        />
                                    ))}
                                </div>
                                {/* Preview */}
                                <div className="tag-preview">
                                    <span className="tag-preview-chip" style={{ background: form.color + '22', color: form.color, borderColor: form.color + '44' }}>
                                        {form.title || 'Önizleme'}
                                    </span>
                                </div>
                            </div>

                            {/* Active Toggle */}
                            <div className="tag-form-group">
                                <div className="tag-toggle-row">
                                    <div>
                                        <label>Durum</label>
                                        <p className="tag-form-desc">Etiket aktif/pasif</p>
                                    </div>
                                    <button
                                        type="button"
                                        className={`tag-toggle ${form.is_active ? 'tag-toggle--on' : ''}`}
                                        onClick={() => setForm(prev => ({ ...prev, is_active: !prev.is_active }))}
                                    >
                                        <span className="tag-toggle-knob" />
                                    </button>
                                </div>
                            </div>

                            {/* Customer-specific fields */}
                            {modalType === 'customer' && (
                                <>
                                    {/* Parapuan Section */}
                                    <div className="tag-form-section">
                                        <h3>💰 Parapuan Oranları</h3>
                                        <p className="tag-form-section-desc">Bu etikete sahip müşterilere özel parapuan oranı (boş bırakılırsa genel ayar geçerli)</p>
                                        <div className="tag-form-row">
                                            <div className="tag-form-group tag-form-group--half">
                                                <label>Nakit Parapuan %</label>
                                                <input
                                                    className="tag-form-input"
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="0.5"
                                                    placeholder="Genel ayar"
                                                    value={form.cash_parapuan_pct}
                                                    onChange={e => setForm(prev => ({ ...prev, cash_parapuan_pct: e.target.value }))}
                                                />
                                            </div>
                                            <div className="tag-form-group tag-form-group--half">
                                                <label>Kart Parapuan %</label>
                                                <input
                                                    className="tag-form-input"
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="0.5"
                                                    placeholder="Genel ayar"
                                                    value={form.card_parapuan_pct}
                                                    onChange={e => setForm(prev => ({ ...prev, card_parapuan_pct: e.target.value }))}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Discount Section */}
                                    <div className="tag-form-section">
                                        <div className="tag-toggle-row">
                                            <div>
                                                <h3>🎁 İndirim</h3>
                                                <p className="tag-form-section-desc">Bu etiketteki müşterilere otomatik indirim</p>
                                            </div>
                                            <button
                                                type="button"
                                                className={`tag-toggle ${form.discount_enabled ? 'tag-toggle--on' : ''}`}
                                                onClick={() => setForm(prev => ({ ...prev, discount_enabled: !prev.discount_enabled }))}
                                            >
                                                <span className="tag-toggle-knob" />
                                            </button>
                                        </div>
                                        {form.discount_enabled && (
                                            <div className="tag-form-group" style={{ marginTop: 12 }}>
                                                <label>İndirim Oranı (%)</label>
                                                <input
                                                    className="tag-form-input tag-form-input--short"
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="1"
                                                    placeholder="Ör: 10"
                                                    value={form.discount_pct}
                                                    onChange={e => setForm(prev => ({ ...prev, discount_pct: e.target.value }))}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Auto Section - Coming Soon */}
                                    <div className="tag-form-section tag-form-section--disabled">
                                        <div className="tag-section-coming">
                                            <div>
                                                <h3>🤖 Otomatik Etiketleme</h3>
                                                <p className="tag-form-section-desc">Belirli kriterleri sağlayan müşterilere otomatik etiket ata</p>
                                            </div>
                                            <span className="tag-coming-badge">Yakında</span>
                                        </div>
                                        <div className="tag-auto-preview">
                                            <div className="tag-auto-item">
                                                <span>Minimum Toplam Harcama</span>
                                                <span className="tag-auto-value">₺ —</span>
                                            </div>
                                            <div className="tag-auto-item">
                                                <span>Minimum Randevu Sayısı</span>
                                                <span className="tag-auto-value">—</span>
                                            </div>
                                            <div className="tag-auto-item">
                                                <span>Minimum Ürün Harcaması</span>
                                                <span className="tag-auto-value">₺ —</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="tag-modal-footer">
                            <button className="tag-btn-cancel" onClick={closeModal}>İptal</button>
                            <button className="tag-btn-save" onClick={saveTag} disabled={saving}>
                                {saving ? 'Kaydediliyor...' : '💾 Kaydet'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteConfirm && (
                <div className="tag-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="tag-delete-modal" onClick={e => e.stopPropagation()}>
                        <h3>Etiketi Sil</h3>
                        <p>
                            <strong style={{ color: '#fff' }}>"{deleteConfirm.title}"</strong> etiketi silinecek. Bu işlem geri alınamaz.
                        </p>
                        <div className="tag-delete-actions">
                            <button className="tag-btn-cancel" onClick={() => setDeleteConfirm(null)}>Vazgeç</button>
                            <button className="tag-btn-danger" onClick={() => deleteTag(deleteConfirm.id, deleteConfirm.type)}>Sil</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
