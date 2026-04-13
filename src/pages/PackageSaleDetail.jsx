import { useState, useEffect, useMemo } from 'react';
import { localDateStr } from '../utils/dateUtils';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { ToastContainer, useToast } from '../components/Toast';
import './PackageSaleDetail.css';

/* Tüm yöntemler — detay tabında geçmiş ödemeleri göstermek için */
const ALL_METHODS = [
    { value: 'cash', label: 'Nakit', icon: '💵' },
    { value: 'card', label: 'Kredi Kartı', icon: '💳' },
    { value: 'transfer', label: 'Havale / EFT', icon: '🏦' },
    { value: 'credit', label: 'Parapuan', icon: '⭐' },
];

const TABS = [
    { key: 'lines', icon: '📦', label: 'Paket İçeriği' },
    { key: 'usage', icon: '📊', label: 'Kullanım Geçmişi' },
    { key: 'payments', icon: '💳', label: 'Ödemeler' },
    { key: 'refunds', icon: '↩️', label: 'İade Geçmişi' },
];

export default function PackageSaleDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { tenantUser } = useAuth();
    const { toasts, addToast, dismissToast } = useToast();

    const [activeTab, setActiveTab] = useState('lines');
    const [sale, setSale] = useState(null);
    const [loading, setLoading] = useState(true);

    // Related data
    const [saleLines, setSaleLines] = useState([]);
    const [payments, setPayments] = useState([]);
    const [redemptions, setRedemptions] = useState([]);
    const [refundedLines, setRefundedLines] = useState({}); // { lineId: refundedQty }
    const [refundSales, setRefundSales] = useState([]); // [{id, total_amount, sale_date, ...}]
    const [refundPayments, setRefundPayments] = useState([]); // payments from refund ledger entries
    const [refundLineDetails, setRefundLineDetails] = useState({}); // { refundSaleId: [lines] }
    const [refundRewardTxns, setRefundRewardTxns] = useState({}); // { refundSaleId: [txns] }
    const [confirmDeleteRefund, setConfirmDeleteRefund] = useState(null); // refund sale object
    const [deletingRefund, setDeletingRefund] = useState(false);

    // ─── Load Sale ───
    useEffect(() => {
        if (id && tenantUser?.tenant_id) loadSale();
    }, [id, tenantUser]);

    const loadSale = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('sales')
                .select(`
                    *,
                    customer:customers(id, first_name, last_name, phone_e164, gender_id, birth_date),
                    staff:tenant_staff!sales_staff_id_fkey(first_name, last_name)
                `)
                .eq('id', id)
                .is('removed_at', null)
                .single();
            if (error) throw error;
            setSale(data);
            await loadRelatedData(data);
        } catch (err) {
            console.error('Sale load error:', err);
            addToast('Satış yüklenirken hata oluştu.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const loadRelatedData = async (saleData) => {
        try {
            const [linesRes, ledgerRes] = await Promise.all([
                supabase
                    .from('sale_lines')
                    .select('*')
                    .eq('sale_id', saleData.id)
                    .is('removed_at', null)
                    .order('created_at'),
                supabase
                    .from('customer_ledger_entries')
                    .select('id')
                    .eq('source_type', 'sale')
                    .eq('source_id', saleData.id)
                    .is('removed_at', null)
                    .single(),
            ]);

            const lines = linesRes.data || [];
            setSaleLines(lines);

            if (ledgerRes.data) {
                const { data: payData } = await supabase
                    .from('payments')
                    .select('*')
                    .eq('ledger_entry_id', ledgerRes.data.id)
                    .order('paid_at');
                setPayments((payData || []).map(p => ({ ...p, _isDeleted: !!p.removed_at })));
            } else {
                setPayments([]);
            }

            if (lines.length > 0) {
                const lineIds = lines.map(l => l.id);
                const { data: redemData } = await supabase
                    .from('package_redemptions')
                    .select('*')
                    .in('entitlement_sale_line_id', lineIds)
                    .order('redeemed_at');
                setRedemptions(redemData || []);
            } else {
                setRedemptions([]);
            }

            // ─── Load refund sales for this sale ───
            const { data: refSales } = await supabase
                .from('sales')
                .select('id, total_amount, sale_date, created_at, removed_at')
                .eq('ref_sale_id', saleData.id)
                .eq('sale_kind', 'package_refund')
                .order('created_at');

            setRefundSales(refSales || []);

            if (refSales && refSales.length > 0) {
                const refundSaleIds = refSales.map(rs => rs.id);
                const activeRefundSaleIds = refSales.filter(rs => !rs.removed_at).map(rs => rs.id);

                // Fetch ALL refund sale_lines (including soft-deleted) for display
                const { data: refLines } = await supabase
                    .from('sale_lines')
                    .select('id, sale_id, ref_sale_line_id, item_name_snap, quantity, unit_price, price_snap, applied_discount_amount, removed_at')
                    .in('sale_id', refundSaleIds);

                const map = {};
                const lineDetailsMap = {};
                (refLines || []).forEach(rl => {
                    // Only count ACTIVE refund lines toward refundedLines (Paket İçeriği tab)
                    if (rl.ref_sale_line_id && !rl.removed_at && activeRefundSaleIds.includes(rl.sale_id)) {
                        map[rl.ref_sale_line_id] = (map[rl.ref_sale_line_id] || 0) + Number(rl.quantity);
                    }
                    // But include ALL lines in lineDetails for İade Geçmişi display
                    if (!lineDetailsMap[rl.sale_id]) lineDetailsMap[rl.sale_id] = [];
                    lineDetailsMap[rl.sale_id].push(rl);
                });
                setRefundedLines(map);
                setRefundLineDetails(lineDetailsMap);

                // Load refund payments via ledger entries (include soft-deleted)
                const { data: refLedgers } = await supabase
                    .from('customer_ledger_entries')
                    .select('id, source_id, removed_at')
                    .eq('source_type', 'sale')
                    .in('source_id', refundSaleIds);

                if (refLedgers && refLedgers.length > 0) {
                    const refLedgerIds = refLedgers.map(l => l.id);
                    const { data: refPayData } = await supabase
                        .from('payments')
                        .select('*')
                        .in('ledger_entry_id', refLedgerIds)
                        .order('paid_at');
                    // Tag each refund payment with its source refund sale + deleted flag
                    const tagged = (refPayData || []).map(p => {
                        const ledger = refLedgers.find(l => l.id === p.ledger_entry_id);
                        const refSaleId = ledger?.source_id;
                        const parentRefund = refSales.find(rs => rs.id === refSaleId);
                        return {
                            ...p,
                            _isRefund: true,
                            _refundSaleId: refSaleId,
                            _isDeleted: !!parentRefund?.removed_at,
                        };
                    });
                    setRefundPayments(tagged);
                } else {
                    setRefundPayments([]);
                }

                // Load reward transactions linked to refund payments (include soft-deleted)
                const allRefPayIds = [
                    ...(refLedgers || []).map(l => l.id)
                ];
                if (allRefPayIds.length > 0) {
                    // Get all payments for refund ledgers (include soft-deleted)
                    const { data: allRefPays } = await supabase
                        .from('payments')
                        .select('id, ledger_entry_id')
                        .in('ledger_entry_id', allRefPayIds);
                    const refPaymentIds = (allRefPays || []).map(p => p.id);
                    if (refPaymentIds.length > 0) {
                        const { data: rewardTxns } = await supabase
                            .from('customer_reward_transactions')
                            .select('id, kind, points, payment_id, note')
                            .in('payment_id', refPaymentIds);
                        // Group by refund sale id
                        const rewardMap = {};
                        (rewardTxns || []).forEach(txn => {
                            const pay = allRefPays.find(p => p.id === txn.payment_id);
                            const ledger = (refLedgers || []).find(l => l.id === pay?.ledger_entry_id);
                            const refSaleId = ledger?.source_id;
                            if (refSaleId) {
                                if (!rewardMap[refSaleId]) rewardMap[refSaleId] = [];
                                rewardMap[refSaleId].push(txn);
                            }
                        });
                        setRefundRewardTxns(rewardMap);
                    } else {
                        setRefundRewardTxns({});
                    }
                } else {
                    setRefundRewardTxns({});
                }
            } else {
                setRefundedLines({});
                setRefundPayments([]);
                setRefundLineDetails({});
                setRefundRewardTxns({});
            }
        } catch (err) {
            console.error('Related data load error:', err);
        }
    };

    // ─── Computed ───
    const paymentTotal = useMemo(() =>
        payments.filter(p => !p._isDeleted).reduce((s, p) => s + Number(p.amount), 0), [payments]);

    const activeRefundSales = useMemo(() =>
        refundSales.filter(r => !r.removed_at), [refundSales]);

    const refundedTotal = useMemo(() =>
        activeRefundSales.reduce((s, r) => s + Number(r.total_amount), 0), [activeRefundSales]);

    const isFullyRefunded = useMemo(() => {
        if (saleLines.length === 0) return false;
        return saleLines.every(line => {
            const refundedQty = refundedLines[line.id] || 0;
            return refundedQty >= Number(line.quantity);
        });
    }, [saleLines, refundedLines]);

    const netPaid = useMemo(() => paymentTotal - refundedTotal, [paymentTotal, refundedTotal]);

    const effectiveTotal = useMemo(() =>
        saleLines.reduce((sum, line) => {
            const refundedQty = refundedLines[line.id] || 0;
            const remainingQty = Math.max(0, Number(line.quantity) - refundedQty);
            return sum + remainingQty * Number(line.unit_price);
        }, 0), [saleLines, refundedLines]);

    const remaining = useMemo(() =>
        isFullyRefunded ? 0 : Math.max(0, effectiveTotal - netPaid), [effectiveTotal, netPaid, isFullyRefunded]);

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

    // ─── Loading State ───
    if (loading) {
        return (
            <div className="psd-page">
                <div className="psd-loading">
                    <div className="spinner" />
                    <span>Satış yükleniyor...</span>
                </div>
            </div>
        );
    }

    if (!sale) {
        return (
            <div className="psd-page">
                <button className="psd-back-btn" onClick={() => navigate('/package-sales')}>
                    ← Paket Satışları
                </button>
                <div className="psd-empty">
                    <div className="psd-empty-icon">❌</div>
                    <h3>Satış bulunamadı</h3>
                    <p>Bu ID ile eşleşen satış kaydı yok.</p>
                </div>
            </div>
        );
    }

    const customerName = `${sale.customer?.first_name || ''} ${sale.customer?.last_name || ''}`.trim();

    // ═══════ TAB RENDERERS ═══════

    const renderLines = () => (
        <div className="psd-lines">
            {saleLines.length === 0 ? (
                <div className="psd-empty-tab">
                    <div className="psd-empty-icon">📦</div>
                    <p>Satış kalemi bulunamadı.</p>
                </div>
            ) : (
                saleLines.map(line => {
                    const used = redemptions
                        .filter(r => r.entitlement_sale_line_id === line.id)
                        .reduce((s, r) => s + Number(r.quantity), 0);
                    const total = Number(line.quantity);
                    const refundedQty = refundedLines[line.id] || 0;
                    const pct = total > 0 ? (used / total) * 100 : 0;
                    const remainingQty = total - used - refundedQty;

                    return (
                        <div key={line.id} className={`psd-line-card${refundedQty >= total ? ' psd-line-refunded' : ''}`}>
                            <div className="psd-line-top">
                                <div className="psd-line-info">
                                    <span className="psd-line-title">{line.item_name_snap || '—'}</span>
                                    <span className="psd-line-meta">
                                        {formatMoney(line.unit_price)} × {total} adet
                                        {Number(line.price_snap) > Number(line.unit_price) + (Number(line.applied_discount_amount) || 0) / Number(line.quantity) &&
                                            <span className="psd-line-discount"> (Liste: {formatMoney(line.price_snap)})</span>
                                        }
                                        {Number(line.applied_discount_amount) > 0 &&
                                            <span className="psd-line-discount"> (İndirim: {formatMoney(Number(line.applied_discount_amount) / Number(line.quantity))})</span>
                                        }
                                    </span>
                                </div>
                                <div className="psd-line-status">
                                    {refundedQty > 0 && (
                                        <span className="psd-line-badge refunded">
                                            ↩ {refundedQty} adet iade
                                        </span>
                                    )}
                                    <span className={`psd-line-badge ${refundedQty >= total ? 'refunded' : remainingQty <= 0 ? 'used' : 'remaining'}`}>
                                        {refundedQty >= total ? 'İade Edildi' : remainingQty <= 0 ? 'Tamamlandı' : `${remainingQty} kalan`}
                                    </span>
                                </div>
                            </div>
                            <div className="psd-line-progress">
                                <div className="psd-progress-bar">
                                    <div className="psd-progress-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
                                </div>
                                <span className="psd-progress-text">{used} / {total} kullanıldı</span>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );

    const renderUsage = () => (
        <div className="psd-usage">
            {redemptions.length === 0 ? (
                <div className="psd-empty-tab">
                    <div className="psd-empty-icon">📊</div>
                    <p>Henüz kullanım yok.</p>
                </div>
            ) : (
                redemptions.map(r => {
                    const line = saleLines.find(l => l.id === r.entitlement_sale_line_id);
                    return (
                        <div key={r.id} className="psd-usage-card">
                            <div className="psd-usage-icon">✅</div>
                            <div className="psd-usage-info">
                                <span className="psd-usage-title">{line?.item_name_snap || 'Hizmet'}</span>
                                <span className="psd-usage-date">{formatDateTime(r.redeemed_at)}</span>
                            </div>
                            <span className="psd-usage-qty">{Number(r.quantity)} seans</span>
                        </div>
                    );
                })
            )}
        </div>
    );

    const renderPayments = () => {
        // Merge and sort payments + refund payments by date
        const allEntries = [
            ...payments.map(p => ({ ...p, _isRefund: false })),
            ...refundPayments,
        ].sort((a, b) => new Date(a.paid_at) - new Date(b.paid_at));

        return (
            <div className="psd-payments">
                <div className="psd-payment-summary">
                    <div className="psd-summary-row">
                        <span>Toplam Tutar</span>
                        <span className="psd-summary-value">{formatMoney(sale.total_amount)}</span>
                    </div>
                    <div className="psd-summary-row">
                        <span>Ödenen</span>
                        <span className="psd-summary-value positive">{formatMoney(paymentTotal)}</span>
                    </div>
                    {refundedTotal > 0 && (
                        <div className="psd-summary-row">
                            <span>İade Edilen</span>
                            <span className="psd-summary-value" style={{ color: '#f59e0b' }}>-{formatMoney(refundedTotal)}</span>
                        </div>
                    )}
                    <div className="psd-summary-row total">
                        <span>Kalan Borç</span>
                        <span className={`psd-summary-value ${remaining > 0 ? 'negative' : 'positive'}`}>
                            {formatMoney(remaining)}
                        </span>
                    </div>
                </div>

                <div className="psd-payment-list">
                    <h4 className="psd-section-title">Ödeme & İade Geçmişi</h4>
                    {allEntries.length === 0 ? (
                        <div className="psd-empty-tab">
                            <div className="psd-empty-icon">💳</div>
                            <p>Henüz ödeme yok.</p>
                        </div>
                    ) : (
                        allEntries.map(p => (
                            <div key={p.id} className={`psd-payment-card${p._isRefund ? ' psd-payment-refund' : ''}${p._isDeleted ? ' psd-payment-deleted' : ''}`}>
                                <div className="psd-payment-icon">
                                    {p._isDeleted ? '🚫' : p._isRefund ? '↩️' : (ALL_METHODS.find(m => m.value === p.method)?.icon || '💰')}
                                </div>
                                <div className="psd-payment-info">
                                    <span className="psd-payment-method">
                                        {p._isRefund ? 'İade' : (ALL_METHODS.find(m => m.value === p.method)?.label || p.method)}
                                        {p._isRefund && ` (${ALL_METHODS.find(m => m.value === p.method)?.label || p.method})`}
                                        {p._isDeleted && <span className="psd-deleted-badge">İptal Edildi</span>}
                                    </span>
                                    <span className="psd-payment-date">{formatDateTime(p.paid_at)}</span>
                                </div>
                                <span className={`psd-payment-amount${p._isRefund ? ' refund' : ''}${p._isDeleted ? ' deleted' : ''}`}>
                                    {p._isRefund ? '-' : '+'}{formatMoney(p.amount)}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    // ─── Delete Refund (soft delete — cascade) ───
    const deleteRefund = async (refundSale) => {
        setDeletingRefund(true);
        const now = new Date().toISOString();
        try {
            // 1. Find refund ledger entry
            const { data: refLedger } = await supabase
                .from('customer_ledger_entries')
                .select('id')
                .eq('source_type', 'sale')
                .eq('source_id', refundSale.id)
                .is('removed_at', null)
                .single();

            if (refLedger) {
                // 2. Find payments linked to this ledger
                const { data: refPays } = await supabase
                    .from('payments')
                    .select('id')
                    .eq('ledger_entry_id', refLedger.id)
                    .is('removed_at', null);

                const payIds = (refPays || []).map(p => p.id);

                // 3. Soft-delete reward transactions linked to these payments
                if (payIds.length > 0) {
                    await supabase
                        .from('customer_reward_transactions')
                        .update({ removed_at: now })
                        .in('payment_id', payIds)
                        .is('removed_at', null);
                }

                // 4. Soft-delete payments
                if (payIds.length > 0) {
                    await supabase.from('payments').update({ removed_at: now }).in('id', payIds);
                }

                // 5. Soft-delete ledger entry
                await supabase.from('customer_ledger_entries').update({ removed_at: now }).eq('id', refLedger.id);
            }

            // 6. Soft-delete refund sale lines
            await supabase.from('sale_lines').update({ removed_at: now }).eq('sale_id', refundSale.id).is('removed_at', null);

            // 7. Soft-delete refund sale
            await supabase.from('sales').update({ removed_at: now }).eq('id', refundSale.id);

            addToast('İade başarıyla iptal edildi!', 'success');
            setConfirmDeleteRefund(null);
            setLoading(true);
            await loadSale();
        } catch (err) {
            console.error('Delete refund error:', err);
            addToast('İade iptal edilirken hata: ' + (err.message || err), 'error');
        } finally {
            setDeletingRefund(false);
        }
    };

    // ─── Render: İade Geçmişi ───
    const renderRefunds = () => {
        if (refundSales.length === 0) {
            return (
                <div className="psd-refunds">
                    <div className="psd-empty-tab">
                        <div className="psd-empty-icon">↩️</div>
                        <p>Bu satışa ait iade bulunmuyor.</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="psd-refunds">
                {refundSales.map((rs, idx) => {
                    const rsLines = refundLineDetails[rs.id] || [];
                    const rsPayments = refundPayments.filter(p => p._refundSaleId === rs.id);
                    const rsRewards = refundRewardTxns[rs.id] || [];
                    const isDeleted = !!rs.removed_at;
                    const today = localDateStr();
                    const isSameDay = rs.sale_date === today;
                    const canDelete = !isDeleted && isSameDay;

                    return (
                        <div key={rs.id} className={`psd-refund-card${isDeleted ? ' deleted' : ''}`}>
                            <div className="psd-refund-header">
                                <div className="psd-refund-header-left">
                                    <span className="psd-refund-icon">{isDeleted ? '🚫' : '↩️'}</span>
                                    <div className="psd-refund-title-group">
                                        <span className="psd-refund-title">
                                            İade #{idx + 1}
                                            {isDeleted && <span className="psd-refund-cancelled-badge">İptal Edildi</span>}
                                        </span>
                                        <span className="psd-refund-date">{formatDate(rs.sale_date)}</span>
                                    </div>
                                </div>
                                <div className="psd-refund-header-right">
                                    <span className="psd-refund-amount">{formatMoney(rs.total_amount)}</span>
                                    {canDelete && (
                                        <button
                                            className="psd-refund-delete-btn"
                                            title="İadeyi İptal Et"
                                            onClick={() => setConfirmDeleteRefund(rs)}
                                        >🗑️</button>
                                    )}
                                </div>
                            </div>

                            {/* Refund lines */}
                            <div className="psd-refund-lines">
                                {rsLines.map(line => (
                                    <div key={line.id} className="psd-refund-line">
                                        <span className="psd-refund-line-name">{line.item_name_snap}</span>
                                        <span className="psd-refund-line-detail">
                                            {Number(line.quantity)} adet × {formatMoney(line.unit_price)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Refund payments */}
                            <div className="psd-refund-footer">
                                {rsPayments.map(p => (
                                    <span key={p.id} className="psd-refund-pay-badge">
                                        {ALL_METHODS.find(m => m.value === p.method)?.icon || '💰'}{' '}
                                        {ALL_METHODS.find(m => m.value === p.method)?.label || p.method}{' '}
                                        {formatMoney(p.amount)}
                                    </span>
                                ))}
                                {rsRewards.filter(t => t.kind === 'redeem').map(t => (
                                    <span key={t.id} className="psd-refund-reward-badge clawback">
                                        ⭐ -{t.points} puan geri alındı
                                    </span>
                                ))}
                                {rsRewards.filter(t => t.kind === 'earn').map(t => (
                                    <span key={t.id} className="psd-refund-reward-badge earn">
                                        ⭐ +{t.points} puan iade edildi
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'lines': return renderLines();
            case 'usage': return renderUsage();
            case 'payments': return renderPayments();
            case 'refunds': return renderRefunds();
            default: return null;
        }
    };

    return (
        <div className="psd-page">
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />

            <button className="psd-back-btn" onClick={() => navigate('/package-sales')}>
                ← Paket Satışları
            </button>

            <div className="psd-header-card">
                <div className="psd-header-icon">📦</div>
                <div className="psd-header-info">
                    <h2 className="psd-header-name">{customerName || 'Bilinmeyen Müşteri'}</h2>
                    <div className="psd-header-meta">
                        <div className="psd-meta-item">
                            <span className="psd-meta-icon">📱</span>
                            {sale.customer?.phone_e164 || '—'}
                        </div>
                        <div className="psd-meta-item">
                            <span className="psd-meta-icon">📅</span>
                            {formatDate(sale.sale_date)}
                        </div>
                        {sale.staff && (
                            <div className="psd-meta-item">
                                <span className="psd-meta-icon">👤</span>
                                {sale.staff.first_name} {sale.staff.last_name || ''}
                            </div>
                        )}
                        {sale.expires_at && (
                            <div className="psd-meta-item">
                                <span className="psd-meta-icon">⏰</span>
                                Son: {formatDate(sale.expires_at)}
                            </div>
                        )}
                    </div>
                    {sale.notes && (
                        <div className="psd-header-notes">
                            <span className="psd-notes-icon">📝</span>
                            <span className="psd-notes-text">{sale.notes}</span>
                        </div>
                    )}
                </div>
                <div className="psd-header-stats">
                    <div className="psd-stat">
                        <span className="psd-stat-label">Toplam</span>
                        <span className="psd-stat-value">{formatMoney(sale.total_amount)}</span>
                    </div>
                    <div className="psd-stat">
                        <span className="psd-stat-label">Ödenen</span>
                        <span className="psd-stat-value positive">{formatMoney(paymentTotal)}</span>
                    </div>
                    {refundedTotal > 0 && (
                        <div className="psd-stat">
                            <span className="psd-stat-label">İade</span>
                            <span className="psd-stat-value" style={{ color: '#f59e0b' }}>-{formatMoney(refundedTotal)}</span>
                        </div>
                    )}
                    <div className="psd-stat">
                        <span className="psd-stat-label">Borç</span>
                        <span className={`psd-stat-value ${remaining > 0 ? 'negative' : 'positive'}`}>
                            {formatMoney(remaining)}
                        </span>
                    </div>
                </div>
            </div>

            {sale.extra_discount_source && (
                <div className="psd-discount-banner">
                    {sale.extra_discount_source === 'birthday' ? '🎂' : '🏷️'}
                    {' '}
                    {sale.extra_discount_source === 'birthday' ? 'Doğum Günü İndirimi' : 'Etiket İndirimi'}
                    {sale.extra_discount_pct && ` — %${sale.extra_discount_pct}`}
                    {sale.extra_discount_amount && ` (${formatMoney(sale.extra_discount_amount)})`}
                </div>
            )}

            <div className="psd-tabs-nav">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        className={`psd-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        <span className="psd-tab-icon">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="psd-tab-content" key={activeTab}>
                {renderTabContent()}
            </div>

            {/* ─── Delete Refund Confirmation ─── */}
            {confirmDeleteRefund && (
                <div className="psd-confirm-overlay" onClick={() => !deletingRefund && setConfirmDeleteRefund(null)}>
                    <div className="psd-confirm-dialog" onClick={e => e.stopPropagation()}>
                        <div className="psd-confirm-icon">⚠️</div>
                        <h3>İadeyi İptal Et</h3>
                        <p>
                            <strong>{formatMoney(confirmDeleteRefund.total_amount)}</strong> tutarındaki iade iptal edilecek.
                            Orijinal satış iade öncesi durumuna dönecektir.
                        </p>
                        <div className="psd-confirm-actions">
                            <button
                                className="psd-confirm-cancel"
                                onClick={() => setConfirmDeleteRefund(null)}
                                disabled={deletingRefund}
                            >Vazgeç</button>
                            <button
                                className="psd-confirm-delete"
                                onClick={() => deleteRefund(confirmDeleteRefund)}
                                disabled={deletingRefund}
                            >{deletingRefund ? 'İptal ediliyor...' : 'İadeyi İptal Et'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
