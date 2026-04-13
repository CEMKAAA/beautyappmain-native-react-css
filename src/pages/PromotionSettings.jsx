import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { ToastContainer, useToast } from '../components/Toast';
import './PromotionSettings.css';

export default function PromotionSettings() {
    const { tenantUser } = useAuth();
    const navigate = useNavigate();
    const { toasts, addToast, dismissToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settingsId, setSettingsId] = useState(null);

    const [form, setForm] = useState({
        cash_parapuan_pct: 0,
        card_parapuan_pct: 0,
        min_parapuan_amount: 0,
        birthday_discount_pct: 0,
    });

    useEffect(() => {
        if (tenantUser?.tenant_id) {
            loadSettings();
        }
    }, [tenantUser]);

    const loadSettings = async () => {
        try {
            setLoading(true);

            // Get branch
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

            // Get promotion settings
            const { data: settings, error } = await supabase
                .from('branch_promotion_settings')
                .select('*')
                .eq('branch_id', branch.id)
                .single();

            if (error) throw error;

            if (settings) {
                setSettingsId(settings.id);
                setForm({
                    cash_parapuan_pct: Number(settings.cash_parapuan_pct) || 0,
                    card_parapuan_pct: Number(settings.card_parapuan_pct) || 0,
                    min_parapuan_amount: Number(settings.min_parapuan_amount) || 0,
                    birthday_discount_pct: Number(settings.birthday_discount_pct) || 0,
                });
            }
        } catch (err) {
            addToast('error', 'Ayarlar yüklenirken hata: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async () => {
        if (!settingsId) {
            addToast('error', 'Ayar kaydı bulunamadı.');
            return;
        }

        setSaving(true);
        try {
            const { error } = await supabase
                .from('branch_promotion_settings')
                .update({
                    cash_parapuan_pct: form.cash_parapuan_pct,
                    card_parapuan_pct: form.card_parapuan_pct,
                    min_parapuan_amount: form.min_parapuan_amount,
                    birthday_discount_pct: form.birthday_discount_pct,
                })
                .eq('id', settingsId);

            if (error) throw error;
            addToast('success', 'Promosyon ayarları kaydedildi!');
        } catch (err) {
            addToast('error', 'Kayıt sırasında hata: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field, value) => {
        const num = value === '' ? 0 : parseFloat(value);
        if (isNaN(num) || num < 0) return;
        setForm(prev => ({ ...prev, [field]: num }));
    };

    if (loading) {
        return (
            <div className="promo-page">
                <div className="promo-loading">
                    <div className="promo-spinner"></div>
                    <p>Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="promo-page">
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />

            {/* Header */}
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate('/settings')}>← Ayarlara Dön</button>
                <h1>🎁 Promosyon Ayarları</h1>
                <p className="text-muted">Parapuan ve indirim ayarlarını yapılandırın</p>
            </div>

            <div className="promo-toolbar">
                <button className="promo-save-btn" onClick={saveSettings} disabled={saving}>
                    {saving ? 'Kaydediliyor...' : '💾 Kaydet'}
                </button>
            </div>

            {/* Content */}
            <div className="promo-content">
                {/* Parapuan Section */}
                <div className="promo-section">
                    <div className="promo-section-header">
                        <span className="promo-section-icon">💰</span>
                        <div>
                            <h2>Parapuan Ayarları</h2>
                            <p>Müşterilerinize ödeme yöntemine göre parapuan kazandırın</p>
                        </div>
                    </div>

                    <div className="promo-cards">
                        <div className="promo-card">
                            <div className="promo-card-icon">💵</div>
                            <div className="promo-card-content">
                                <label>Nakit Ödeme Parapuan</label>
                                <p className="promo-card-desc">Nakit ödeme yapan müşterilere kazandırılacak parapuan yüzdesi</p>
                            </div>
                            <div className="promo-card-input">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.5"
                                    value={form.cash_parapuan_pct}
                                    onChange={e => handleChange('cash_parapuan_pct', e.target.value)}
                                />
                                <span className="promo-unit">%</span>
                            </div>
                        </div>

                        <div className="promo-card">
                            <div className="promo-card-icon">💳</div>
                            <div className="promo-card-content">
                                <label>Kart Ödeme Parapuan</label>
                                <p className="promo-card-desc">Kartla ödeme yapan müşterilere kazandırılacak parapuan yüzdesi</p>
                            </div>
                            <div className="promo-card-input">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.5"
                                    value={form.card_parapuan_pct}
                                    onChange={e => handleChange('card_parapuan_pct', e.target.value)}
                                />
                                <span className="promo-unit">%</span>
                            </div>
                        </div>

                        <div className="promo-card">
                            <div className="promo-card-icon">🎯</div>
                            <div className="promo-card-content">
                                <label>Minimum Parapuan Kullanım</label>
                                <p className="promo-card-desc">Parapuan kullanabilmek için gerekli minimum tutar</p>
                            </div>
                            <div className="promo-card-input">
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={form.min_parapuan_amount}
                                    onChange={e => handleChange('min_parapuan_amount', e.target.value)}
                                />
                                <span className="promo-unit">₺</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Birthday Section */}
                <div className="promo-section">
                    <div className="promo-section-header">
                        <span className="promo-section-icon">🎂</span>
                        <div>
                            <h2>Doğum Günü İndirimi</h2>
                            <p>Doğum gününde müşterilerinize özel indirim sunun</p>
                        </div>
                    </div>

                    <div className="promo-cards">
                        <div className="promo-card">
                            <div className="promo-card-icon">🎉</div>
                            <div className="promo-card-content">
                                <label>Doğum Günü İndirim Oranı</label>
                                <p className="promo-card-desc">Müşterinin doğum gününde uygulanacak indirim yüzdesi</p>
                            </div>
                            <div className="promo-card-input">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="1"
                                    value={form.birthday_discount_pct}
                                    onChange={e => handleChange('birthday_discount_pct', e.target.value)}
                                />
                                <span className="promo-unit">%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="promo-info-box">
                    <span className="promo-info-icon">ℹ️</span>
                    <div>
                        <strong>Nasıl çalışır?</strong>
                        <ul>
                            <li>Müşteri ödeme yaptığında belirlenen yüzde kadar parapuan kazanır</li>
                            <li>Parapuan bakiyesi minimum tutara ulaştığında sonraki alışverişte kullanılabilir</li>
                            <li>Doğum günü indirimi, müşterinin doğum gününde otomatik uygulanır</li>
                            <li>Tüm değerler 0 olduğunda ilgili promosyon devre dışı olur</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
