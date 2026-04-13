import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { ToastContainer, useToast } from '../components/Toast';
import './FaqSettings.css';

export default function FaqSettings() {
    const { tenantUser } = useAuth();
    const navigate = useNavigate();
    const { toasts, addToast, dismissToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [branchId, setBranchId] = useState(null);
    const [faqs, setFaqs] = useState([]);

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        question: '',
        answer: '',
        show_on_booking: true,
        is_active: true,
    });

    // Delete
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Expanded accordion
    const [expandedId, setExpandedId] = useState(null);

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

            const { data, error } = await supabase
                .from('branch_faqs')
                .select('*')
                .eq('branch_id', branch.id)
                .order('created_at');

            if (error) throw error;
            setFaqs(data || []);
        } catch (err) {
            console.error(err);
            addToast('error', 'Veriler yüklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    // ─── Modal ───
    const openNew = () => {
        setEditingId(null);
        setForm({ question: '', answer: '', show_on_booking: true, is_active: true });
        setShowModal(true);
    };

    const openEdit = (faq) => {
        setEditingId(faq.id);
        setForm({
            question: faq.question,
            answer: faq.answer,
            show_on_booking: faq.show_on_booking,
            is_active: faq.is_active,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
    };

    // ─── Save ───
    const saveFaq = async () => {
        if (!form.question.trim()) { addToast('error', 'Soru alanı zorunludur.'); return; }
        if (!form.answer.trim()) { addToast('error', 'Cevap alanı zorunludur.'); return; }

        setSaving(true);
        try {
            const payload = {
                question: form.question.trim(),
                answer: form.answer.trim(),
                show_on_booking: form.show_on_booking,
                is_active: form.is_active,
            };

            if (editingId) {
                const { error } = await supabase.from('branch_faqs').update(payload).eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('branch_faqs').insert({ ...payload, branch_id: branchId });
                if (error) throw error;
            }

            addToast('success', editingId ? 'Soru güncellendi!' : 'Soru oluşturuldu!');
            closeModal();
            await loadData();
        } catch (err) {
            addToast('error', 'Kayıt sırasında hata: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    // ─── Delete ───
    const deleteFaq = async (id) => {
        try {
            const { error } = await supabase.from('branch_faqs').delete().eq('id', id);
            if (error) throw error;
            addToast('success', 'Soru silindi.');
            setDeleteConfirm(null);
            await loadData();
        } catch (err) {
            addToast('error', 'Silinemedi: ' + err.message);
        }
    };

    if (loading) {
        return (
            <div className="faq-page">
                <div className="faq-loading">
                    <div className="faq-spinner"></div>
                    <p>Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="faq-page">
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />

            {/* Header */}
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate('/settings')}>← Ayarlara Dön</button>
                <h1>❓ SSS Ayarları</h1>
                <p className="text-muted">Sıkça sorulan sorularınızı yönetin</p>
            </div>

            {/* Toolbar */}
            <div className="faq-toolbar">
                <span className="faq-count">{faqs.length} soru</span>
                <button className="faq-add-btn" onClick={openNew}>+ Yeni Soru Ekle</button>
            </div>

            {/* FAQ List */}
            <div className="faq-list">
                {faqs.length === 0 ? (
                    <div className="faq-empty">
                        <div className="faq-empty-icon">❓</div>
                        <h3>Henüz soru eklenmemiş</h3>
                        <p>Müşterilerinizin sıkça sorduğu soruları ekleyin.</p>
                    </div>
                ) : (
                    faqs.map(faq => (
                        <div key={faq.id} className={`faq-item ${!faq.is_active ? 'faq-item--inactive' : ''}`}>
                            <div
                                className="faq-item-header"
                                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                            >
                                <div className="faq-item-left">
                                    <span className={`faq-chevron ${expandedId === faq.id ? 'faq-chevron--open' : ''}`}>▸</span>
                                    <span className="faq-item-question">{faq.question}</span>
                                </div>
                                <div className="faq-item-meta">
                                    {!faq.is_active && <span className="faq-badge faq-badge--inactive">Pasif</span>}
                                    {faq.show_on_booking && <span className="faq-badge faq-badge--booking">Randevu Sayfası</span>}
                                    <button className="faq-action-btn" onClick={e => { e.stopPropagation(); openEdit(faq); }}>✏️</button>
                                    <button className="faq-action-btn faq-action-btn--delete" onClick={e => { e.stopPropagation(); setDeleteConfirm(faq); }}>🗑️</button>
                                </div>
                            </div>
                            {expandedId === faq.id && (
                                <div className="faq-item-answer">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="faq-overlay" onClick={closeModal}>
                    <div className="faq-modal" onClick={e => e.stopPropagation()}>
                        <div className="faq-modal-header">
                            <h2>{editingId ? '✏️ Soruyu Düzenle' : '❓ Yeni Soru'}</h2>
                            <button className="faq-modal-close" onClick={closeModal}>×</button>
                        </div>

                        <div className="faq-modal-body">
                            {/* Question */}
                            <div className="faq-form-group">
                                <label>Soru</label>
                                <input
                                    className="faq-form-input"
                                    type="text"
                                    maxLength={300}
                                    placeholder="Ör: Randevumu nasıl iptal edebilirim?"
                                    value={form.question}
                                    onChange={e => setForm(prev => ({ ...prev, question: e.target.value }))}
                                />
                                <span className="faq-char-count">{form.question.length}/300</span>
                            </div>

                            {/* Answer */}
                            <div className="faq-form-group">
                                <label>Cevap</label>
                                <textarea
                                    className="faq-form-textarea"
                                    rows={5}
                                    placeholder="Sorunun cevabını yazın..."
                                    value={form.answer}
                                    onChange={e => setForm(prev => ({ ...prev, answer: e.target.value }))}
                                />
                            </div>

                            {/* Show on Booking */}
                            <div className="faq-form-group">
                                <div className="faq-toggle-row">
                                    <div>
                                        <label>Randevu Sayfasında Göster</label>
                                        <p className="faq-form-desc">Bu soru online randevu sayfasında görüntülensin mi?</p>
                                    </div>
                                    <button
                                        type="button"
                                        className={`faq-toggle ${form.show_on_booking ? 'faq-toggle--on' : ''}`}
                                        onClick={() => setForm(prev => ({ ...prev, show_on_booking: !prev.show_on_booking }))}
                                    >
                                        <span className="faq-toggle-knob" />
                                    </button>
                                </div>
                            </div>

                            {/* Active */}
                            <div className="faq-form-group">
                                <div className="faq-toggle-row">
                                    <div>
                                        <label>Durum</label>
                                        <p className="faq-form-desc">Soru aktif/pasif</p>
                                    </div>
                                    <button
                                        type="button"
                                        className={`faq-toggle ${form.is_active ? 'faq-toggle--on' : ''}`}
                                        onClick={() => setForm(prev => ({ ...prev, is_active: !prev.is_active }))}
                                    >
                                        <span className="faq-toggle-knob" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="faq-modal-footer">
                            <button className="faq-btn-cancel" onClick={closeModal}>İptal</button>
                            <button className="faq-btn-save" onClick={saveFaq} disabled={saving}>
                                {saving ? 'Kaydediliyor...' : '💾 Kaydet'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteConfirm && (
                <div className="faq-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="faq-delete-modal" onClick={e => e.stopPropagation()}>
                        <h3>Soruyu Sil</h3>
                        <p>
                            <strong style={{ color: '#fff' }}>"{deleteConfirm.question}"</strong> sorusu silinecek. Bu işlem geri alınamaz.
                        </p>
                        <div className="faq-delete-actions">
                            <button className="faq-btn-cancel" onClick={() => setDeleteConfirm(null)}>Vazgeç</button>
                            <button className="faq-btn-danger" onClick={() => deleteFaq(deleteConfirm.id)}>Sil</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
