import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { ToastContainer, useToast } from '../components/Toast';
import './CustomerDetail.css';

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

const TABS = [
    { key: 'overview', icon: '📋', label: 'Genel Bilgiler' },
    { key: 'appointments', icon: '📅', label: 'Randevular' },
    { key: 'financial', icon: '💰', label: 'Finansal Özet' },
    { key: 'ledger', icon: '📊', label: 'Hesap Hareketleri' },
    { key: 'sales', icon: '🛒', label: 'Satışlar' },
    { key: 'packages', icon: '📦', label: 'Paketler' },
    { key: 'rewards', icon: '🎯', label: 'Parapuan' },
];

const STATUS_LABELS = {
    booked: 'Planlandı',
    confirmed: 'Onaylandı',
    checked_in: 'Giriş Yapıldı',
    completed: 'Tamamlandı',
    cancelled: 'İptal',
    no_show: 'Gelmedi',
};

const SALE_KIND_LABELS = {
    appointment_checkout: 'Randevu',
    product_sale: 'Ürün Satışı',
    package_purchase: 'Paket Satışı',
    package_refund: 'Paket İade',
    refund: 'İade',
};

const LEDGER_DIR_LABELS = {
    debit: 'Borç',
    credit: 'Alacak',
};

const REWARD_KIND_LABELS = {
    earn: 'Kazanım',
    spend: 'Harcama',
    refund: 'İade',
    adjust: 'Düzeltme',
};

export default function CustomerDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { tenantUser } = useAuth();
    const { toasts, addToast, dismissToast } = useToast();

    // State
    const [activeTab, setActiveTab] = useState('overview');
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    // Tab-specific data
    const [appointments, setAppointments] = useState([]);
    const [sales, setSales] = useState([]);
    const [ledger, setLedger] = useState([]);
    const [rewards, setRewards] = useState([]);
    const [tabLoading, setTabLoading] = useState(false);

    // ─── Load Customer ───
    useEffect(() => {
        if (id && tenantUser?.tenant_id) loadCustomer();
    }, [id, tenantUser]);

    const loadCustomer = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('customers')
                .select(`
                    *,
                    gender:genders(id, code, label),
                    city:cities(id, name),
                    district:districts(id, name),
                    customer_tag_assignments(
                        tag_id,
                        tag:customer_tags(id, title, color)
                    )
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            setCustomer(data);
        } catch (err) {
            console.error(err);
            addToast('error', 'Müşteri bilgileri yüklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    // ─── Load Tab Data ───
    useEffect(() => {
        if (!customer) return;
        loadTabData(activeTab);
    }, [activeTab, customer]);

    const loadTabData = async (tab) => {
        if (tab === 'overview') return;

        setTabLoading(true);
        try {
            switch (tab) {
                case 'appointments': {
                    const { data } = await supabase
                        .from('appointments')
                        .select(`
                            *,
                            appointment_services(
                                id,
                                duration_min,
                                price_snapshot,
                                status,
                                staff:tenant_staff(id, first_name, last_name),
                                service_variant:branch_service_variants(
                                    id,
                                    service:branch_services(id, title)
                                )
                            )
                        `)
                        .eq('customer_id', id)
                        .order('appointment_at', { ascending: false });
                    setAppointments(data || []);
                    break;
                }
                case 'financial':
                case 'sales': {
                    const { data } = await supabase
                        .from('sales')
                        .select(`
                            *,
                            sale_lines(
                                id,
                                line_kind,
                                item_name_snap,
                                quantity,
                                unit_price,
                                staff:tenant_staff(id, first_name, last_name)
                            )
                        `)
                        .eq('customer_id', id)
                        .is('removed_at', null)
                        .order('sale_date', { ascending: false });
                    setSales(data || []);

                    // Also load ledger for financial tab
                    if (tab === 'financial') {
                        const { data: ledgerData } = await supabase
                            .from('customer_ledger_entries')
                            .select('*')
                            .eq('customer_id', id)
                            .is('removed_at', null)
                            .order('created_at', { ascending: false });
                        setLedger(ledgerData || []);
                    }
                    break;
                }
                case 'ledger': {
                    const { data } = await supabase
                        .from('customer_ledger_entries')
                        .select('*')
                        .eq('customer_id', id)
                        .is('removed_at', null)
                        .order('created_at', { ascending: false });
                    setLedger(data || []);
                    break;
                }
                case 'packages': {
                    // Load sales that are package purchases + redemptions
                    const { data: salesData } = await supabase
                        .from('sales')
                        .select(`
                            *,
                            sale_lines(
                                id,
                                line_kind,
                                item_name_snap,
                                quantity,
                                unit_price
                            )
                        `)
                        .eq('customer_id', id)
                        .eq('sale_kind', 'package_purchase')
                        .is('removed_at', null)
                        .order('sale_date', { ascending: false });
                    setSales(salesData || []);

                    break;
                }
                case 'rewards': {
                    const { data } = await supabase
                        .from('customer_reward_transactions')
                        .select('*')
                        .eq('customer_id', id)
                        .is('removed_at', null)
                        .order('created_at', { ascending: false });
                    setRewards(data || []);
                    break;
                }
            }
        } catch (err) {
            console.error(err);
            addToast('error', 'Sekme verileri yüklenemedi.');
        } finally {
            setTabLoading(false);
        }
    };

    // ─── Financial Summary Calculations ───
    const financialSummary = useMemo(() => {
        const totalSales = sales.reduce((sum, s) => sum + parseFloat(s.total_amount || 0), 0);
        const totalDebit = ledger.filter(l => l.direction === 'debit').reduce((sum, l) => sum + parseFloat(l.amount || 0), 0);
        const totalCredit = ledger.filter(l => l.direction === 'credit').reduce((sum, l) => sum + parseFloat(l.amount || 0), 0);
        const balance = totalCredit - totalDebit;
        const totalRewards = rewards.reduce((sum, r) => sum + (r.kind === 'earn' ? r.points : r.kind === 'spend' ? -r.points : 0), 0);
        return { totalSales, totalDebit, totalCredit, balance, totalRewards, salesCount: sales.length, appointmentCount: appointments.length };
    }, [sales, ledger, rewards, appointments]);

    // ─── KPI Calculations ───
    const kpiData = useMemo(() => {
        const completedAppts = appointments.filter(a => a.status === 'completed');
        const apptCount = completedAppts.length;

        // Average spend per visit
        const avgSpend = apptCount > 0
            ? completedAppts.reduce((sum, a) => {
                const total = (a.appointment_services || []).reduce((s, sv) => s + parseFloat(sv.price_snapshot || 0), 0);
                return sum + total;
            }, 0) / apptCount
            : 0;

        // Visit frequency (average days between visits)
        let visitFrequency = null;
        if (apptCount >= 2) {
            const dates = completedAppts
                .map(a => new Date(a.appointment_at))
                .sort((a, b) => a - b);
            const totalDays = (dates[dates.length - 1] - dates[0]) / (1000 * 60 * 60 * 24);
            visitFrequency = Math.round(totalDays / (apptCount - 1));
        }

        // Last visit
        const lastVisit = completedAppts.length > 0
            ? completedAppts.sort((a, b) => new Date(b.appointment_at) - new Date(a.appointment_at))[0]
            : null;
        let lastVisitText = null;
        if (lastVisit) {
            const daysAgo = Math.floor((new Date() - new Date(lastVisit.appointment_at)) / (1000 * 60 * 60 * 24));
            if (daysAgo === 0) lastVisitText = 'Bugün';
            else if (daysAgo === 1) lastVisitText = 'Dün';
            else lastVisitText = `${daysAgo} gün önce`;
        }

        // Most popular service
        const serviceCount = {};
        appointments.forEach(a => {
            (a.appointment_services || []).forEach(sv => {
                const name = sv.service_variant?.service?.title || 'Hizmet';
                serviceCount[name] = (serviceCount[name] || 0) + 1;
            });
        });
        const topService = Object.entries(serviceCount).sort((a, b) => b[1] - a[1])[0] || null;

        // Preferred staff
        const staffCount = {};
        appointments.forEach(a => {
            (a.appointment_services || []).forEach(sv => {
                if (sv.staff) {
                    const name = `${sv.staff.first_name} ${sv.staff.last_name || ''}`.trim();
                    staffCount[name] = (staffCount[name] || 0) + 1;
                }
            });
        });
        const topStaff = Object.entries(staffCount).sort((a, b) => b[1] - a[1])[0] || null;

        return { avgSpend, visitFrequency, lastVisitText, topService, topStaff };
    }, [appointments]);

    // ─── Format ───
    const formatDate = (d) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatDateTime = (d) => {
        if (!d) return '—';
        return new Date(d).toLocaleString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const formatMoney = (amount) => {
        return parseFloat(amount || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺';
    };

    if (loading) {
        return (
            <div className="customer-detail-page">
                <div className="tab-loading">
                    <div className="spinner" />
                    <span>Müşteri yükleniyor...</span>
                </div>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="customer-detail-page">
                <button className="detail-back-btn" onClick={() => navigate('/customers')}>
                    ← Müşteriler
                </button>
                <div className="tab-empty">
                    <div className="tab-empty-icon">❌</div>
                    <h3>Müşteri bulunamadı</h3>
                    <p>Bu ID ile eşleşen müşteri kaydı yok.</p>
                </div>
            </div>
        );
    }

    const fullName = `${customer.first_name} ${customer.last_name || ''}`.trim();
    const initials = `${customer.first_name?.[0] || ''}${customer.last_name?.[0] || ''}`.toUpperCase();
    const tag = customer.customer_tag_assignments?.[0]?.tag || null;

    // ═══════ TAB RENDERERS ═══════

    const renderOverview = () => (
        <div className="overview-grid">
            {/* Temel Bilgiler */}
            <div className="info-card">
                <div className="info-card-title">📋 Temel Bilgiler</div>
                <div className="info-row">
                    <span className="info-label">Ad Soyad</span>
                    <span className="info-value">{fullName}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Telefon</span>
                    <span className="info-value">{customer.phone_e164}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">E-posta</span>
                    <span className={`info-value ${!customer.email ? 'empty' : ''}`}>{customer.email || 'Belirtilmemiş'}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Doğum Tarihi</span>
                    <span className={`info-value ${!customer.birth_date ? 'empty' : ''}`}>{formatDate(customer.birth_date) || 'Belirtilmemiş'}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Cinsiyet</span>
                    <span className={`info-value ${!customer.gender ? 'empty' : ''}`}>{customer.gender?.label || 'Belirtilmemiş'}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Kayıt Tarihi</span>
                    <span className="info-value">{formatDate(customer.created_at)}</span>
                </div>
            </div>

            {/* Ek Bilgiler */}
            <div className="info-card">
                <div className="info-card-title">📌 Ek Bilgiler</div>
                <div className="info-row">
                    <span className="info-label">Dosya No</span>
                    <span className={`info-value ${!customer.file_no ? 'empty' : ''}`}>{customer.file_no || 'Belirtilmemiş'}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Instagram</span>
                    <span className={`info-value ${!customer.instagram_username ? 'empty' : ''}`}>{customer.instagram_username || 'Belirtilmemiş'}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Meslek</span>
                    <span className={`info-value ${!customer.profession ? 'empty' : ''}`}>{customer.profession || 'Belirtilmemiş'}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Referans Kaynağı</span>
                    <span className={`info-value ${!customer.referral_source ? 'empty' : ''}`}>{customer.referral_source || 'Belirtilmemiş'}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Acil Telefon</span>
                    <span className={`info-value ${!customer.emergency_phone ? 'empty' : ''}`}>{customer.emergency_phone || 'Belirtilmemiş'}</span>
                </div>
            </div>

            {/* Adres */}
            <div className="info-card">
                <div className="info-card-title">📍 Adres</div>
                <div className="info-row">
                    <span className="info-label">İl</span>
                    <span className={`info-value ${!customer.city ? 'empty' : ''}`}>{customer.city?.name || 'Belirtilmemiş'}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">İlçe</span>
                    <span className={`info-value ${!customer.district ? 'empty' : ''}`}>{customer.district?.name || 'Belirtilmemiş'}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Tam Adres</span>
                    <span className={`info-value ${!customer.address_full ? 'empty' : ''}`}>{customer.address_full || 'Belirtilmemiş'}</span>
                </div>
            </div>

            {/* İzinler */}
            <div className="info-card">
                <div className="info-card-title">⚙️ İzinler & Notlar</div>
                <div className="info-row">
                    <span className="info-label">SMS İzni</span>
                    <span className="info-value">{customer.allow_sms ? '✅ Evet' : '❌ Hayır'}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">E-posta İzni</span>
                    <span className="info-value">{customer.allow_email ? '✅ Evet' : '❌ Hayır'}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Durum</span>
                    <span className="info-value">{customer.is_active ? '🟢 Aktif' : '🔴 Pasif'}</span>
                </div>
                {customer.notes && (
                    <div className="info-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                        <span className="info-label">Notlar</span>
                        <span className="info-value" style={{ whiteSpace: 'pre-wrap', fontSize: '0.82rem', color: '#94a3b8' }}>{customer.notes}</span>
                    </div>
                )}
            </div>
        </div>
    );

    const renderAppointments = () => {
        if (tabLoading) return <div className="tab-loading"><div className="spinner" /><span>Yükleniyor...</span></div>;
        if (appointments.length === 0) {
            return (
                <div className="tab-empty">
                    <div className="tab-empty-icon">📅</div>
                    <h3>Henüz randevu yok</h3>
                    <p>Bu müşteriye ait randevu kaydı bulunamadı.</p>
                </div>
            );
        }

        return (
            <div className="detail-table-wrapper">
                <table className="detail-table">
                    <thead>
                        <tr>
                            <th>Tarih</th>
                            <th>Hizmetler</th>
                            <th>Personel</th>
                            <th>Süre</th>
                            <th>Tutar</th>
                            <th>Durum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(a => {
                            const services = a.appointment_services || [];
                            const totalDuration = services.reduce((s, sv) => s + (sv.duration_min || 0), 0);
                            const totalPrice = services.reduce((s, sv) => s + parseFloat(sv.price_snapshot || 0), 0);
                            const staffNames = [...new Set(services.map(sv => sv.staff ? `${sv.staff.first_name} ${sv.staff.last_name || ''}`.trim() : '').filter(Boolean))];
                            const serviceNames = services.map(sv => sv.service_variant?.service?.title || 'Hizmet').join(', ');

                            return (
                                <tr key={a.id}>
                                    <td>{formatDateTime(a.appointment_at)}</td>
                                    <td>{serviceNames || '—'}</td>
                                    <td>{staffNames.join(', ') || '—'}</td>
                                    <td>{totalDuration > 0 ? `${totalDuration} dk` : '—'}</td>
                                    <td><span className="amount-badge neutral">{formatMoney(totalPrice)}</span></td>
                                    <td>
                                        <span className={`status-pill ${a.status}`}>
                                            {STATUS_LABELS[a.status] || a.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderFinancial = () => {
        if (tabLoading) return <div className="tab-loading"><div className="spinner" /><span>Yükleniyor...</span></div>;

        return (
            <div className="financial-tab">
                {/* Özet Kartları */}
                <div className="financial-cards">
                    <div className="fin-card">
                        <div className="fin-card-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>💰</div>
                        <div className="fin-card-content">
                            <div className="fin-card-label">Toplam Harcama (Lifetime)</div>
                            <div className="fin-card-value">{formatMoney(financialSummary.totalSales)}</div>
                        </div>
                    </div>
                    <div className="fin-card">
                        <div className="fin-card-icon" style={{ background: financialSummary.balance >= 0 ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)', color: financialSummary.balance >= 0 ? '#4ade80' : '#f87171' }}>📊</div>
                        <div className="fin-card-content">
                            <div className="fin-card-label">Kalan Borç</div>
                            <div className="fin-card-value" style={{ color: financialSummary.balance >= 0 ? '#4ade80' : '#f87171' }}>
                                {formatMoney(Math.abs(financialSummary.balance))}
                            </div>
                        </div>
                    </div>
                    <div className="fin-card">
                        <div className="fin-card-icon" style={{ background: 'rgba(250, 204, 21, 0.12)', color: '#facc15' }}>🎯</div>
                        <div className="fin-card-content">
                            <div className="fin-card-label">Parapuan Bakiye</div>
                            <div className="fin-card-value" style={{ color: '#facc15' }}>{financialSummary.totalRewards} puan</div>
                        </div>
                    </div>
                </div>

                {/* KPI İstatistikleri */}
                <div className="financial-kpi-card">
                    <div className="financial-kpi-header">
                        <span className="financial-kpi-icon">📈</span>
                        <span>İstatistikler</span>
                    </div>
                    <div className="financial-kpi-grid">
                        <div className="financial-kpi-item">
                            <div className="financial-kpi-item-icon" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>💸</div>
                            <div className="financial-kpi-item-body">
                                <div className="financial-kpi-item-label">Ziyaret başına ort. harcama</div>
                                <div className="financial-kpi-item-value">{financialSummary.appointmentCount > 0 ? formatMoney(kpiData.avgSpend) : '—'}</div>
                            </div>
                        </div>
                        <div className="financial-kpi-item">
                            <div className="financial-kpi-item-icon" style={{ background: 'rgba(139, 92, 246, 0.15)' }}>🔄</div>
                            <div className="financial-kpi-item-body">
                                <div className="financial-kpi-item-label">Ziyaret sıklığı</div>
                                <div className="financial-kpi-item-value">{kpiData.visitFrequency ? `Her ${kpiData.visitFrequency} günde bir` : '—'}</div>
                            </div>
                        </div>
                        <div className="financial-kpi-item">
                            <div className="financial-kpi-item-icon" style={{ background: 'rgba(34, 197, 94, 0.15)' }}>📅</div>
                            <div className="financial-kpi-item-body">
                                <div className="financial-kpi-item-label">Son ziyaret</div>
                                <div className="financial-kpi-item-value">{kpiData.lastVisitText || '—'}</div>
                            </div>
                        </div>
                        <div className="financial-kpi-item">
                            <div className="financial-kpi-item-icon" style={{ background: 'rgba(249, 115, 22, 0.15)' }}>✂️</div>
                            <div className="financial-kpi-item-body">
                                <div className="financial-kpi-item-label">En çok aldığı hizmet</div>
                                <div className="financial-kpi-item-value">{kpiData.topService ? `${kpiData.topService[0]} (${kpiData.topService[1]} kez)` : '—'}</div>
                            </div>
                        </div>
                        <div className="financial-kpi-item">
                            <div className="financial-kpi-item-icon" style={{ background: 'rgba(236, 72, 153, 0.15)' }}>👤</div>
                            <div className="financial-kpi-item-body">
                                <div className="financial-kpi-item-label">Tercih ettiği personel</div>
                                <div className="financial-kpi-item-value">{kpiData.topStaff ? `${kpiData.topStaff[0]} (${kpiData.topStaff[1]} kez)` : '—'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderLedger = () => {
        if (tabLoading) return <div className="tab-loading"><div className="spinner" /><span>Yükleniyor...</span></div>;
        if (ledger.length === 0) {
            return (
                <div className="tab-empty">
                    <div className="tab-empty-icon">📊</div>
                    <h3>Henüz hesap hareketi yok</h3>
                    <p>Bu müşteriye ait borç/alacak kaydı bulunamadı.</p>
                </div>
            );
        }

        return (
            <div className="detail-table-wrapper">
                <table className="detail-table">
                    <thead>
                        <tr>
                            <th>Tarih</th>
                            <th>Yön</th>
                            <th>Kaynak</th>
                            <th>Tutar</th>
                            <th>Not</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ledger.map(l => (
                            <tr key={l.id}>
                                <td>{formatDateTime(l.created_at)}</td>
                                <td>
                                    <span className={`direction-badge ${l.direction}`}>
                                        {l.direction === 'debit' ? '↗️' : '↙️'} {LEDGER_DIR_LABELS[l.direction] || l.direction}
                                    </span>
                                </td>
                                <td>{l.source_type === 'sale' ? 'Satış' : l.source_type === 'manual' ? 'Manuel' : l.source_type}</td>
                                <td>
                                    <span className={`amount-badge ${l.direction === 'credit' ? 'positive' : 'negative'}`}>
                                        {l.direction === 'credit' ? '+' : '-'}{formatMoney(l.amount)}
                                    </span>
                                </td>
                                <td style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{l.note || '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderSales = () => {
        if (tabLoading) return <div className="tab-loading"><div className="spinner" /><span>Yükleniyor...</span></div>;
        if (sales.length === 0) {
            return (
                <div className="tab-empty">
                    <div className="tab-empty-icon">🛒</div>
                    <h3>Henüz satış kaydı yok</h3>
                    <p>Bu müşteriye ait satış bulunamadı.</p>
                </div>
            );
        }

        return (
            <div className="detail-table-wrapper">
                <table className="detail-table">
                    <thead>
                        <tr>
                            <th>Tarih</th>
                            <th>Tür</th>
                            <th>Kalemler</th>
                            <th>İndirim</th>
                            <th>Toplam</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map(s => {
                            const lineNames = (s.sale_lines || []).map(l => l.item_name_snap || l.line_kind).join(', ');
                            return (
                                <tr key={s.id}>
                                    <td>{formatDate(s.sale_date)}</td>
                                    <td>{SALE_KIND_LABELS[s.sale_kind] || s.sale_kind}</td>
                                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {lineNames || '—'}
                                    </td>
                                    <td>
                                        {parseFloat(s.total_discount) > 0
                                            ? <span className="amount-badge positive">-{formatMoney(s.total_discount)}</span>
                                            : '—'
                                        }
                                    </td>
                                    <td><span className="amount-badge neutral">{formatMoney(s.total_amount)}</span></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderPackages = () => {
        if (tabLoading) return <div className="tab-loading"><div className="spinner" /><span>Yükleniyor...</span></div>;
        if (sales.length === 0) {
            return (
                <div className="tab-empty">
                    <div className="tab-empty-icon">📦</div>
                    <h3>Henüz paket yok</h3>
                    <p>Bu müşteriye ait paket satışı bulunamadı.</p>
                </div>
            );
        }

        return (
            <div className="detail-table-wrapper">
                <table className="detail-table">
                    <thead>
                        <tr>
                            <th>Tarih</th>
                            <th>Paket İçeriği</th>
                            <th>Tutar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map(s => {
                            const lineNames = (s.sale_lines || []).map(l => l.item_name_snap || 'Hizmet').join(', ');
                            return (
                                <tr key={s.id}>
                                    <td>{formatDate(s.sale_date)}</td>
                                    <td>{lineNames || '—'}</td>
                                    <td><span className="amount-badge neutral">{formatMoney(s.total_amount)}</span></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderRewards = () => {
        if (tabLoading) return <div className="tab-loading"><div className="spinner" /><span>Yükleniyor...</span></div>;
        if (rewards.length === 0) {
            return (
                <div className="tab-empty">
                    <div className="tab-empty-icon">🎯</div>
                    <h3>Henüz parapuan yok</h3>
                    <p>Bu müşteriye ait parapuan işlemi bulunamadı.</p>
                </div>
            );
        }

        const totalPoints = rewards.reduce((sum, r) => {
            if (r.kind === 'earn') return sum + r.points;
            if (r.kind === 'spend') return sum - r.points;
            if (r.kind === 'refund') return sum + r.points;
            return sum;
        }, 0);

        return (
            <div>
                <div className="stats-grid" style={{ marginBottom: 20 }}>
                    <div className="stat-card">
                        <div className="stat-icon">🎯</div>
                        <div className="stat-value" style={{ color: '#facc15' }}>{totalPoints}</div>
                        <div className="stat-label">Mevcut Puan</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📥</div>
                        <div className="stat-value" style={{ color: '#4ade80' }}>
                            {rewards.filter(r => r.kind === 'earn').reduce((s, r) => s + r.points, 0)}
                        </div>
                        <div className="stat-label">Toplam Kazanım</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📤</div>
                        <div className="stat-value" style={{ color: '#f87171' }}>
                            {rewards.filter(r => r.kind === 'spend').reduce((s, r) => s + r.points, 0)}
                        </div>
                        <div className="stat-label">Toplam Harcama</div>
                    </div>
                </div>

                <div className="detail-table-wrapper">
                    <table className="detail-table">
                        <thead>
                            <tr>
                                <th>Tarih</th>
                                <th>Tür</th>
                                <th>Puan</th>
                                <th>Tutar</th>
                                <th>Not</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rewards.map(r => (
                                <tr key={r.id}>
                                    <td>{formatDateTime(r.created_at)}</td>
                                    <td>
                                        <span className={`direction-badge ${r.kind}`}>
                                            {REWARD_KIND_LABELS[r.kind] || r.kind}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`amount-badge ${r.kind === 'earn' || r.kind === 'refund' ? 'positive' : 'negative'}`}>
                                            {r.kind === 'earn' || r.kind === 'refund' ? '+' : '-'}{r.points}
                                        </span>
                                    </td>
                                    <td>{r.value_amount ? formatMoney(r.value_amount) : '—'}</td>
                                    <td style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{r.note || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview': return renderOverview();
            case 'appointments': return renderAppointments();
            case 'financial': return renderFinancial();
            case 'ledger': return renderLedger();
            case 'sales': return renderSales();
            case 'packages': return renderPackages();
            case 'rewards': return renderRewards();
            default: return null;
        }
    };

    return (
        <div className="customer-detail-page">
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />

            {/* Back */}
            <button className="detail-back-btn" onClick={() => navigate('/customers')}>
                ← Müşteriler
            </button>

            {/* Header Card */}
            <div className="customer-header-card">
                <div
                    className="customer-detail-avatar"
                    style={{ backgroundColor: getAvatarColor(fullName) }}
                >
                    {initials || '?'}
                </div>
                <div className="customer-header-info">
                    <h2 className="customer-header-name">
                        {fullName}
                        {tag && (
                            <span
                                className="customer-header-tag"
                                style={{ backgroundColor: tag.color + '20', color: tag.color }}
                            >
                                {tag.title}
                            </span>
                        )}
                    </h2>
                    <div className="customer-header-meta">
                        <div className="meta-item">
                            <span className="meta-icon">📱</span>
                            {customer.phone_e164}
                        </div>
                        {customer.email && (
                            <div className="meta-item">
                                <span className="meta-icon">✉️</span>
                                {customer.email}
                            </div>
                        )}
                        {customer.gender && (
                            <div className="meta-item">
                                <span className="meta-icon">👤</span>
                                {customer.gender.label}
                            </div>
                        )}
                        {customer.city && (
                            <div className="meta-item">
                                <span className="meta-icon">📍</span>
                                {customer.city.name}{customer.district ? ` / ${customer.district.name}` : ''}
                            </div>
                        )}
                    </div>
                </div>
                <div className="customer-header-actions">
                    <span className={`btn-header-status ${customer.is_active ? 'active' : 'inactive'}`}>
                        <span className="dot" />
                        {customer.is_active ? 'Aktif' : 'Pasif'}
                    </span>
                    <button className="btn-header-edit" onClick={() => navigate(`/customers?edit=${customer.id}`)}>
                        ✏️ Düzenle
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="customer-tabs-nav">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="customer-tab-content" key={activeTab}>
                {renderTabContent()}
            </div>
        </div>
    );
}
