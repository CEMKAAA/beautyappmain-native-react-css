import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { ToastContainer, useToast } from '../components/Toast';
import './AppointmentSettings.css';

const INTERVAL_OPTIONS = [
    { value: 5, label: '5 dakika' },
    { value: 10, label: '10 dakika' },
    { value: 15, label: '15 dakika' },
    { value: 20, label: '20 dakika' },
    { value: 25, label: '25 dakika' },
    { value: 30, label: '30 dakika' },
    { value: 45, label: '45 dakika' },
    { value: 60, label: '60 dakika' },
];

const TIME_FORMAT_OPTIONS = [
    { value: 24, label: '24 Saat', example: '14:30' },
    { value: 12, label: '12 Saat', example: '2:30 PM' },
];

const REMINDER_OPTIONS = [
    { value: 15, label: '15 dakika önce' },
    { value: 30, label: '30 dakika önce' },
    { value: 60, label: '1 saat önce' },
    { value: 120, label: '2 saat önce' },
    { value: 180, label: '3 saat önce' },
    { value: 360, label: '6 saat önce' },
    { value: 720, label: '12 saat önce' },
    { value: 1440, label: '1 gün önce' },
];

export default function AppointmentSettings() {
    const { tenantUser } = useAuth();
    const navigate = useNavigate();
    const { toasts, addToast, dismissToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settingsId, setSettingsId] = useState(null);

    const [form, setForm] = useState({
        appointment_interval_min: 15,
        time_format: 24,
        reminder_enabled: false,
        reminder_before_min: 60,
        created_notification_enabled: false,
    });

    useEffect(() => {
        if (tenantUser?.tenant_id) loadSettings();
    }, [tenantUser]);

    const loadSettings = async () => {
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

            const { data: settings, error } = await supabase
                .from('branch_appointment_settings')
                .select('*')
                .eq('branch_id', branch.id)
                .single();

            if (error) throw error;

            if (settings) {
                setSettingsId(settings.id);
                setForm({
                    appointment_interval_min: settings.appointment_interval_min ?? 15,
                    time_format: settings.time_format ?? 24,
                    reminder_enabled: settings.reminder_enabled ?? false,
                    reminder_before_min: settings.reminder_before_min ?? 60,
                    created_notification_enabled: settings.created_notification_enabled ?? false,
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
                .from('branch_appointment_settings')
                .update({
                    appointment_interval_min: form.appointment_interval_min,
                    time_format: form.time_format,
                    reminder_enabled: form.reminder_enabled,
                    reminder_before_min: form.reminder_enabled ? form.reminder_before_min : null,
                    created_notification_enabled: form.created_notification_enabled,
                })
                .eq('id', settingsId);

            if (error) throw error;
            addToast('success', 'Randevu ayarları kaydedildi!');
        } catch (err) {
            addToast('error', 'Kayıt sırasında hata: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <div className="appt-page">
                <div className="appt-loading">
                    <div className="appt-spinner"></div>
                    <p>Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="appt-page">
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />

            {/* Header */}
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate('/settings')}>← Ayarlara Dön</button>
                <h1>📋 Randevu Ayarları</h1>
                <p className="text-muted">Randevu sistemi yapılandırmasını buradan yönetin</p>
            </div>

            <div className="appt-toolbar">
                <button className="appt-save-btn" onClick={saveSettings} disabled={saving}>
                    {saving ? 'Kaydediliyor...' : '💾 Kaydet'}
                </button>
            </div>

            {/* Content */}
            <div className="appt-content">
                {/* Takvim Ayarları Section */}
                <div className="appt-section">
                    <div className="appt-section-header">
                        <span className="appt-section-icon">🕐</span>
                        <div>
                            <h2>Takvim Ayarları</h2>
                            <p>Randevu takviminin görünüm ve aralık ayarları</p>
                        </div>
                    </div>

                    <div className="appt-cards">
                        {/* Appointment Interval */}
                        <div className="appt-card">
                            <div className="appt-card-icon">⏱️</div>
                            <div className="appt-card-content">
                                <label>Randevu Aralığı</label>
                                <p className="appt-card-desc">Takvimde randevu slotları kaçar dakika arayla gösterilsin</p>
                            </div>
                            <div className="appt-card-action">
                                <select
                                    className="appt-select"
                                    value={form.appointment_interval_min}
                                    onChange={e => handleChange('appointment_interval_min', parseInt(e.target.value))}
                                >
                                    {INTERVAL_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Time Format */}
                        <div className="appt-card">
                            <div className="appt-card-icon">🔢</div>
                            <div className="appt-card-content">
                                <label>Saat Formatı</label>
                                <p className="appt-card-desc">
                                    Saatlerin gösterim biçimi
                                    {form.time_format === 24 ? ' — Örnek: 14:30' : ' — Örnek: 2:30 PM'}
                                </p>
                            </div>
                            <div className="appt-card-action">
                                <div className="appt-format-toggle">
                                    {TIME_FORMAT_OPTIONS.map(opt => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            className={`appt-format-btn ${form.time_format === opt.value ? 'appt-format-btn--active' : ''}`}
                                            onClick={() => handleChange('time_format', opt.value)}
                                        >
                                            <span className="appt-format-label">{opt.label}</span>
                                            <span className="appt-format-example">{opt.example}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bildirim Ayarları Section */}
                <div className="appt-section">
                    <div className="appt-section-header">
                        <span className="appt-section-icon">🔔</span>
                        <div>
                            <h2>Bildirim Ayarları</h2>
                            <p>Randevu bildirimleri ve hatırlatma tercihleri</p>
                        </div>
                    </div>

                    <div className="appt-cards">
                        {/* Created Notification */}
                        <div className="appt-card">
                            <div className="appt-card-icon">📩</div>
                            <div className="appt-card-content">
                                <label>Randevu Oluşturma Bildirimi</label>
                                <p className="appt-card-desc">Yeni randevu oluşturulduğunda müşteriye bildirim gönder</p>
                            </div>
                            <div className="appt-card-action">
                                <button
                                    type="button"
                                    className={`appt-toggle ${form.created_notification_enabled ? 'appt-toggle--on' : ''}`}
                                    onClick={() => handleChange('created_notification_enabled', !form.created_notification_enabled)}
                                >
                                    <span className="appt-toggle-knob" />
                                </button>
                            </div>
                        </div>

                        {/* Reminder */}
                        <div className="appt-card">
                            <div className="appt-card-icon">⏰</div>
                            <div className="appt-card-content">
                                <label>Randevu Hatırlatma</label>
                                <p className="appt-card-desc">Randevu saatinden önce müşteriye hatırlatma gönder</p>
                            </div>
                            <div className="appt-card-action">
                                <button
                                    type="button"
                                    className={`appt-toggle ${form.reminder_enabled ? 'appt-toggle--on' : ''}`}
                                    onClick={() => handleChange('reminder_enabled', !form.reminder_enabled)}
                                >
                                    <span className="appt-toggle-knob" />
                                </button>
                            </div>
                        </div>

                        {/* Reminder Before - only visible when enabled */}
                        {form.reminder_enabled && (
                            <div className="appt-card appt-card--sub">
                                <div className="appt-card-icon">📅</div>
                                <div className="appt-card-content">
                                    <label>Hatırlatma Zamanı</label>
                                    <p className="appt-card-desc">Randevudan ne kadar önce hatırlatma gönderilsin</p>
                                </div>
                                <div className="appt-card-action">
                                    <select
                                        className="appt-select"
                                        value={form.reminder_before_min}
                                        onChange={e => handleChange('reminder_before_min', parseInt(e.target.value))}
                                    >
                                        {REMINDER_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Box */}
                <div className="appt-info-box">
                    <span className="appt-info-icon">ℹ️</span>
                    <div>
                        <strong>Nasıl çalışır?</strong>
                        <ul>
                            <li>Randevu aralığı, takvimde gösterilen zaman dilimlerinin uzunluğunu belirler</li>
                            <li>Saat formatı tüm randevu ekranlarındaki saat gösterimini etkiler</li>
                            <li>Hatırlatma açıksa, seçilen zamanda müşteriye otomatik bildirim gönderilir</li>
                            <li>Oluşturma bildirimi açıksa, randevu alındığında müşteri bilgilendirilir</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
