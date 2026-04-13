import { useState, useEffect, useMemo } from 'react';
import { localDateStr } from '../utils/dateUtils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { ToastContainer, useToast } from '../components/Toast';
import './PackageSales.css';

const PAYMENT_METHODS = [
    { value: 'cash', label: 'Nakit' },
    { value: 'card', label: 'Kredi Kartı' },
    { value: 'transfer', label: 'Havale / EFT' },
    { value: 'credit', label: 'Parapuan' },
];

/* Tahsilat yöntemleri — parapuan YOK (tahsilatta parapuan kullanılamaz) */
const TAHSILAT_METHODS = [
    { value: 'cash', label: 'Nakit', icon: '💵' },
    { value: 'card', label: 'Kredi Kartı', icon: '💳' },
    { value: 'transfer', label: 'Havale / EFT', icon: '🏦' },
];

const formatCurrency = (v) => {
    const n = Number(v) || 0;
    return n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺';
};

const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export default function PackageSales() {
    const { tenantUser } = useAuth();
    const { toasts, addToast, dismissToast } = useToast();

    // ─── Data ───
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [branchId, setBranchId] = useState(null);
    const [vatServiceRate, setVatServiceRate] = useState(20);
    const [promoSettings, setPromoSettings] = useState(null);

    const [sales, setSales] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [genders, setGenders] = useState([]);
    const [serviceVariants, setServiceVariants] = useState([]);
    const [packageGroups, setPackageGroups] = useState([]);
    const [packages, setPackages] = useState([]);

    // ─── Filters ───
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('');

    // ─── Modal ───
    const [showModal, setShowModal] = useState(false);
    const [wizardStep, setWizardStep] = useState(0);

    // ─── Wizard Form ───
    const [saleDate, setSaleDate] = useState(localDateStr());
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerSearch, setCustomerSearch] = useState('');
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
    const [lines, setLines] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState('');
    const [saleNotes, setSaleNotes] = useState('');
    const [hasExpiry, setHasExpiry] = useState(false);
    const [expiryDate, setExpiryDate] = useState('');
    const [lockedGenderId, setLockedGenderId] = useState(null);

    // ─── Payment ───
    const [paymentEntries, setPaymentEntries] = useState([]);

    // ─── Customer tags / discount / parapuan ───
    const [customerTags, setCustomerTags] = useState([]);
    const [parapuanBalance, setParapuanBalance] = useState(0);
    const [extraDiscount, setExtraDiscount] = useState({ pct: 0, source: null, tagId: null, label: '' });

    // ─── Import modal ───
    const [showImport, setShowImport] = useState(false);
    const [packageSearch, setPackageSearch] = useState('');

    // ─── Tahsilat modal ───
    const [collectSale, setCollectSale] = useState(null); // the sale object being collected
    const [collectEntries, setCollectEntries] = useState([]);
    const [collectPayDate, setCollectPayDate] = useState(() => localDateStr());
    const [savingTahsilat, setSavingTahsilat] = useState(false);

    // ─── İade (Refund) modal ───
    const [refundSale, setRefundSale] = useState(null);
    const [refundSelections, setRefundSelections] = useState([]);
    const [refundPaymentMethod, setRefundPaymentMethod] = useState('cash');
    const [savingRefund, setSavingRefund] = useState(false);

    // ─── Düzenleme: Birleşik Wizard (Genel Bilgiler + Hizmetler) ───
    const [editSale, setEditSale] = useState(null);
    const [editStep, setEditStep] = useState(0); // 0 = Genel Bilgiler, 1 = Hizmetler
    const [editInfoCustomerId, setEditInfoCustomerId] = useState('');
    const [editInfoDate, setEditInfoDate] = useState('');
    const [editInfoStaff, setEditInfoStaff] = useState('');
    const [editInfoNotes, setEditInfoNotes] = useState('');
    const [editInfoHasExpiry, setEditInfoHasExpiry] = useState(false);
    const [editInfoExpiryDate, setEditInfoExpiryDate] = useState('');
    const [editServiceLines, setEditServiceLines] = useState([]);
    const [savingEdit, setSavingEdit] = useState(false);
    const [confirmDeleteSale, setConfirmDeleteSale] = useState(false);
    const [confirmDeleteSaleData, setConfirmDeleteSaleData] = useState(null);

    // ─── Düzenleme: Tahsilatlar ───
    const [editPaymentsSale, setEditPaymentsSale] = useState(null);
    const [editPaymentLines, setEditPaymentLines] = useState([]); // [{...payment, _removed, _isNew, _origAmount}]
    const [savingEditPayments, setSavingEditPayments] = useState(false);
    const [openDropdownId, setOpenDropdownId] = useState(null);

    const navigate = useNavigate();

    // Close dropdown on outside click
    useEffect(() => {
        if (!openDropdownId) return;
        const handleClick = (e) => {
            if (!e.target.closest('.pkg-edit-dropdown')) setOpenDropdownId(null);
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [openDropdownId]);

    // ═══════════════════════════════════
    // LOAD DATA
    // ═══════════════════════════════════
    useEffect(() => {
        if (tenantUser?.tenant_id) loadAll();
    }, [tenantUser]);

    const loadAll = async () => {
        try {
            // Branch
            const { data: branch } = await supabase
                .from('branches')
                .select('id, vat_service_default')
                .eq('tenant_id', tenantUser.tenant_id)
                .single();

            if (!branch) return;
            setBranchId(branch.id);
            setVatServiceRate(Number(branch.vat_service_default) || 20);

            // Promo settings
            const { data: promo } = await supabase
                .from('branch_promotion_settings')
                .select('*')
                .eq('branch_id', branch.id)
                .single();
            setPromoSettings(promo);

            // Parallel loads
            const [salesRes, custRes, staffRes, gendersRes, svRes, pgRes, pkgRes] = await Promise.all([
                supabase
                    .from('sales')
                    .select(`
                        *, 
                        customer:customers(first_name, last_name, phone_e164)
                    `)
                    .eq('branch_id', branch.id)
                    .in('sale_kind', ['package_purchase', 'sale'])
                    .is('removed_at', null)
                    .order('created_at', { ascending: false }),
                supabase
                    .from('customers')
                    .select('id, first_name, last_name, phone_e164, gender_id')
                    .eq('branch_id', branch.id)
                    .eq('is_active', true)
                    .order('first_name'),
                supabase
                    .from('tenant_staff')
                    .select('id, first_name, last_name')
                    .eq('tenant_id', tenantUser.tenant_id)
                    .eq('is_active', true)
                    .order('first_name'),
                supabase.from('genders').select('*'),
                supabase
                    .from('branch_service_variants')
                    .select(`
                        id, gender_id, duration_min, price_amount, is_active,
                        service:branch_services(id, title, is_active)
                    `)
                    .eq('service.branch_id', branch.id)
                    .eq('is_active', true),
                supabase
                    .from('package_groups')
                    .select('*')
                    .eq('branch_id', branch.id)
                    .eq('is_active', true)
                    .order('title'),
                supabase
                    .from('packages')
                    .select('*')
                    .eq('branch_id', branch.id)
                    .eq('is_active', true),
            ]);

            // Enrich sales with payment & redemption totals
            if (salesRes.data?.length) {
                const saleIds = salesRes.data.map(s => s.id);
                const [linesRes, ledgerRes, refundSalesRes] = await Promise.all([
                    supabase.from('sale_lines').select('*').in('sale_id', saleIds).is('removed_at', null),
                    supabase.from('customer_ledger_entries')
                        .select('id, source_id, amount')
                        .eq('source_type', 'sale')
                        .in('source_id', saleIds)
                        .is('removed_at', null),
                    // Fetch refund sales linked to these sales
                    supabase.from('sales')
                        .select('id, ref_sale_id, total_amount')
                        .in('ref_sale_id', saleIds)
                        .in('sale_kind', ['package_refund', 'refund'])
                        .is('removed_at', null),
                ]);

                // Fetch refund sale_lines to know which original lines were refunded
                const refundSaleIds = (refundSalesRes.data || []).map(r => r.id);
                let refundLinesData = [];
                if (refundSaleIds.length) {
                    const { data: rld } = await supabase
                        .from('sale_lines')
                        .select('sale_id, ref_sale_line_id, quantity')
                        .in('sale_id', refundSaleIds)
                        .is('removed_at', null);
                    refundLinesData = rld || [];
                }

                const ledgerIds = (ledgerRes.data || []).map(l => l.id);
                let paymentsData = [];
                if (ledgerIds.length) {
                    const { data: pd } = await supabase
                        .from('payments')
                        .select('*')
                        .in('ledger_entry_id', ledgerIds)
                        .is('removed_at', null);
                    paymentsData = pd || [];
                }

                // Get entitlement lines for redemption counts
                const entitlementLineIds = (linesRes.data || [])
                    .filter(l => (l.line_kind || '').startsWith('entitlement_'))
                    .map(l => l.id);
                let redemptionsData = [];
                if (entitlementLineIds.length) {
                    const { data: rd } = await supabase
                        .from('package_redemptions')
                        .select('*')
                        .in('entitlement_sale_line_id', entitlementLineIds);
                    redemptionsData = rd || [];
                }

                salesRes.data.forEach(sale => {
                    sale._lines = (linesRes.data || []).filter(l => l.sale_id === sale.id);
                    const ledgerEntry = (ledgerRes.data || []).find(l => l.source_id === sale.id);
                    sale._ledger = ledgerEntry;
                    sale._payments = ledgerEntry
                        ? paymentsData.filter(p => p.ledger_entry_id === ledgerEntry.id)
                        : [];
                    sale._paidTotal = sale._payments.reduce((s, p) => s + Number(p.amount), 0);

                    const lineIds = sale._lines.map(l => l.id);
                    sale._redemptions = redemptionsData.filter(r => lineIds.includes(r.entitlement_sale_line_id));
                    sale._totalEntitlement = sale._lines.reduce((s, l) => s + Number(l.quantity), 0);
                    sale._totalRedeemed = sale._redemptions.reduce((s, r) => s + Number(r.quantity), 0);
                    sale._serviceCount = sale._lines.length;

                    // Refund info: how much has been refunded and which lines
                    const saleRefunds = (refundSalesRes.data || []).filter(r => r.ref_sale_id === sale.id);
                    sale._refundedTotal = saleRefunds.reduce((s, r) => s + Number(r.total_amount), 0);
                    // Per-line refunded quantities
                    const refundLineIds = saleRefunds.map(r => r.id);
                    const relevantRefundLines = refundLinesData.filter(rl => refundLineIds.includes(rl.sale_id));
                    sale._refundedLineQtys = {};
                    relevantRefundLines.forEach(rl => {
                        if (rl.ref_sale_line_id) {
                            sale._refundedLineQtys[rl.ref_sale_line_id] = (sale._refundedLineQtys[rl.ref_sale_line_id] || 0) + Number(rl.quantity);
                        }
                    });
                    // Refund status: check if ALL service line quantities are fully refunded
                    const allLinesFullyRefunded = sale._lines.length > 0 && sale._lines.every(line => {
                        const refundedQty = sale._refundedLineQtys[line.id] || 0;
                        return refundedQty >= Number(line.quantity);
                    });
                    if (allLinesFullyRefunded) {
                        sale._refundStatus = 'full';
                    } else if (sale._refundedTotal > 0) {
                        sale._refundStatus = 'partial';
                    } else {
                        sale._refundStatus = 'none';
                    }
                    // Net paid = payments minus refunds; if fully refunded, no remaining debt
                    sale._netPaid = sale._paidTotal - sale._refundedTotal;
                    // Effective total = sum of remaining (non-refunded) line values (unit_price already includes extra discount)
                    sale._effectiveTotal = sale._lines.reduce((sum, line) => {
                        const refundedQty = sale._refundedLineQtys[line.id] || 0;
                        const remainingQty = Math.max(0, Number(line.quantity) - refundedQty);
                        return sum + remainingQty * Number(line.unit_price);
                    }, 0);
                    sale._remaining = sale._refundStatus === 'full'
                        ? 0
                        : Math.max(0, sale._effectiveTotal - sale._netPaid);
                });
            }

            setSales(salesRes.data || []);
            setCustomers(custRes.data || []);
            setStaffList(staffRes.data || []);
            setGenders(gendersRes.data || []);
            setServiceVariants((svRes.data || []).filter(v => v.service?.is_active !== false));
            setPackageGroups(pgRes.data || []);
            setPackages(pkgRes.data || []);
        } catch (err) {
            console.error(err);
            addToast('error', 'Veriler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    // ═══════════════════════════════════
    // COMPUTED HELPERS
    // ═══════════════════════════════════
    const filteredSales = useMemo(() => {
        let result = [...sales];
        if (search) {
            const s = search.toLowerCase();
            result = result.filter(sale => {
                const name = `${sale.customer?.first_name || ''} ${sale.customer?.last_name || ''}`.toLowerCase();
                return name.includes(s) || sale.customer?.phone_e164?.includes(s);
            });
        }
        if (activeFilter === 'paid') result = result.filter(s => s._remaining <= 0 && s._refundStatus !== 'full');
        else if (activeFilter === 'debt') result = result.filter(s => s._remaining > 0);
        else if (activeFilter === 'refunded') result = result.filter(s => s._refundStatus === 'full' || s._refundStatus === 'partial');
        return result;
    }, [sales, search, activeFilter]);

    const customerSearchResults = useMemo(() => {
        if (!customerSearch || customerSearch.length < 2) return [];
        const s = customerSearch.toLowerCase();
        return customers.filter(c => {
            const name = `${c.first_name} ${c.last_name || ''}`.toLowerCase();
            return name.includes(s) || c.phone_e164?.includes(s);
        }).slice(0, 8);
    }, [customers, customerSearch]);

    const filteredVariants = useMemo(() => {
        if (!lockedGenderId) return serviceVariants;
        return serviceVariants.filter(v => v.gender_id === lockedGenderId);
    }, [serviceVariants, lockedGenderId]);

    const getGenderLabel = (genderId) => {
        const g = genders.find(x => x.id === genderId);
        return g ? g.label : '';
    };

    const getGenderIcon = (genderId) => {
        const g = genders.find(x => x.id === genderId);
        if (!g) return '👤';
        return g.code === 'female' ? '♀️' : g.code === 'male' ? '♂️' : '👤';

    };

    const getVariantDisplayName = (variant) => {
        if (!variant) return '—';
        const svc = variant.service?.title || '';
        const gen = getGenderLabel(variant.gender_id);
        return gen ? `${svc} (${gen})` : svc;
    };

    const findVariantById = (id) => serviceVariants.find(v => v.id === id);

    // ═══════════════════════════════════
    // LINE CALCULATIONS
    // ═══════════════════════════════════
    const lineTotals = useMemo(() => {
        let subtotal = 0;
        let totalDiscount = 0;
        const perLine = [];
        lines.forEach(line => {
            const qty = Number(line.quantity) || 0;
            const price = Number(line.unit_price) || 0;
            const snap = Number(line.price_snap) || price;
            const lineNet = price * qty;
            const taxRate = Number(line.tax_rate_snap) || vatServiceRate;
            subtotal += snap * qty;
            totalDiscount += (snap - price) * qty;
            perLine.push({ lineNet, taxRate });
        });
        const afterLineDiscount = subtotal - totalDiscount;
        // Apply extra discount (tag or birthday) on top
        const extraDiscountAmount = extraDiscount.pct > 0
            ? Math.round(afterLineDiscount * extraDiscount.pct) / 100
            : 0;
        const totalAmount = afterLineDiscount - extraDiscountAmount;
        // Tax: proportionally distribute extra discount across lines
        const sumLineNets = perLine.reduce((s, d) => s + d.lineNet, 0);
        let totalTax = 0;
        if (sumLineNets > 0) {
            perLine.forEach(d => {
                const effective = (d.lineNet / sumLineNets) * totalAmount;
                totalTax += effective - (effective / (1 + d.taxRate / 100));
            });
        }
        totalTax = Math.round(totalTax * 100) / 100;
        return { subtotal, totalDiscount, extraDiscountAmount, totalAmount, totalTax };
    }, [lines, vatServiceRate, extraDiscount]);

    const paymentTotal = useMemo(() => {
        return paymentEntries.reduce((s, e) => s + (Number(e.amount) || 0), 0);
    }, [paymentEntries]);

    // Effective parapuan rates (max of tag vs store)
    const effectiveParapuanRates = useMemo(() => {
        const storeCash = Number(promoSettings?.cash_parapuan_pct) || 0;
        const storeCard = Number(promoSettings?.card_parapuan_pct) || 0;
        let tagCash = 0, tagCard = 0;
        customerTags.forEach(t => {
            if (Number(t.cash_parapuan_pct) > tagCash) tagCash = Number(t.cash_parapuan_pct);
            if (Number(t.card_parapuan_pct) > tagCard) tagCard = Number(t.card_parapuan_pct);
        });
        return {
            cash: Math.max(storeCash, tagCash),
            card: Math.max(storeCard, tagCard),
        };
    }, [promoSettings, customerTags]);

    const rewardPoints = useMemo(() => {
        let pts = 0;
        paymentEntries.forEach(e => {
            const amt = Number(e.amount) || 0;
            // Havale/EFT uses cash rate
            if (e.method === 'cash' || e.method === 'transfer') {
                pts += Math.floor(amt * effectiveParapuanRates.cash / 100);
            } else if (e.method === 'card') {
                pts += Math.floor(amt * effectiveParapuanRates.card / 100);
            }
            // 'credit' (parapuan) earns nothing
        });
        return pts;
    }, [paymentEntries, effectiveParapuanRates]);

    // Minimum parapuan usage amount
    const minParapuan = Number(promoSettings?.min_parapuan_amount) || 0;
    // Can customer use parapuan?
    const canUseParapuan = parapuanBalance >= minParapuan && minParapuan > 0 ? true : parapuanBalance > 0 && minParapuan === 0;

    // ═══════════════════════════════════
    // WIZARD ACTIONS
    // ═══════════════════════════════════
    const openWizard = () => {
        setSaleDate(localDateStr());
        setSelectedCustomer(null);
        setCustomerSearch('');
        setLines([]);
        setSelectedStaff('');
        setSaleNotes('');
        setHasExpiry(false);
        setExpiryDate('');
        setLockedGenderId(null);
        setPaymentEntries([]);
        setCustomerTags([]);
        setParapuanBalance(0);
        setExtraDiscount({ pct: 0, source: null, tagId: null, label: '' });
        setWizardStep(0);
        setShowModal(true);
    };

    const selectCustomer = async (c) => {
        setSelectedCustomer(c);
        setCustomerSearch('');
        setShowCustomerDropdown(false);

        // Fetch customer tags
        try {
            const { data: tagLinks } = await supabase
                .from('customer_tag_assignments')
                .select('tag_id, tag:customer_tags(*)')
                .eq('customer_id', c.id);
            const tags = (tagLinks || []).map(l => l.tag).filter(Boolean);
            setCustomerTags(tags);

            // Calculate best discount: max(tag discount_pct, birthday discount_pct)
            let bestPct = 0;
            let bestSource = null;
            let bestTagId = null;
            let bestLabel = '';

            // Tag discounts
            tags.forEach(t => {
                if (t.discount_enabled && Number(t.discount_pct) > bestPct) {
                    bestPct = Number(t.discount_pct);
                    bestSource = 'tag';
                    bestTagId = t.id;
                    bestLabel = `🏷️ ${t.title} İndirimi %${Number(t.discount_pct)}`;
                }
            });

            // Birthday discount
            if (c.birth_date && promoSettings?.birthday_discount_pct) {
                const today = new Date();
                const bday = new Date(c.birth_date);
                if (today.getMonth() === bday.getMonth() && today.getDate() === bday.getDate()) {
                    const bdayPct = Number(promoSettings.birthday_discount_pct);
                    if (bdayPct > bestPct) {
                        bestPct = bdayPct;
                        bestSource = 'birthday';
                        bestTagId = null;
                        bestLabel = `🎂 Doğum Günü İndirimi %${bdayPct}`;
                    }
                }
            }

            setExtraDiscount({ pct: bestPct, source: bestSource, tagId: bestTagId, label: bestLabel });

            // Fetch parapuan balance
            const { data: rewards } = await supabase
                .from('customer_reward_transactions')
                .select('kind, points')
                .eq('customer_id', c.id)
                .is('removed_at', null);
            const bal = (rewards || []).reduce((sum, r) => {
                return sum + (r.kind === 'earn' ? Number(r.points) : -Number(r.points));
            }, 0);
            setParapuanBalance(Math.max(0, bal));
        } catch (err) {
            console.error('Customer info fetch error:', err);
            setCustomerTags([]);
            setParapuanBalance(0);
            setExtraDiscount({ pct: 0, source: null, tagId: null, label: '' });
        }
    };

    const addLine = () => {
        setLines([...lines, { service_variant_id: '', quantity: 1, unit_price: 0, price_snap: 0 }]);
    };

    const removeLine = (idx) => {
        const newLines = lines.filter((_, i) => i !== idx);
        setLines(newLines);
        // Recompute gender from the first remaining line
        if (newLines.length === 0) {
            setLockedGenderId(null);
        } else {
            const firstVariant = findVariantById(newLines[0].service_variant_id);
            setLockedGenderId(firstVariant?.gender_id || null);
        }
    };

    const updateLine = (idx, field, value) => {
        const updated = [...lines];
        updated[idx] = { ...updated[idx], [field]: value };

        if (field === 'service_variant_id' && value) {
            const variant = findVariantById(value);
            if (variant) {
                updated[idx].price_snap = Number(variant.price_amount) || 0;
                updated[idx].unit_price = Number(variant.price_amount) || 0;

                // Gender lock: set from first line with a selected variant
                if (!lockedGenderId || idx === 0) {
                    setLockedGenderId(variant.gender_id);
                }
            }
        }

        if (field === 'unit_price') {
            const snap = Number(updated[idx].price_snap) || 0;
            const newPrice = Number(value) || 0;
            if (snap > 0 && newPrice > snap) {
                updated[idx].unit_price = snap;
            }
        }

        setLines(updated);
    };

    const importPackage = (groupId) => {
        const groupPkgs = packages.filter(p => p.group_id === groupId);
        const group = packageGroups.find(g => g.id === groupId);

        if (group) setLockedGenderId(group.gender_id);

        // Filter out services already in lines
        const usedIds = new Set(lines.map(l => l.service_variant_id).filter(Boolean));
        const newLines = groupPkgs
            .filter(pkg => !usedIds.has(pkg.service_variant_id))
            .map(pkg => {
                const variant = findVariantById(pkg.service_variant_id);
                const priceSnap = Number(variant?.price_amount) || 0;
                return {
                    service_variant_id: pkg.service_variant_id,
                    quantity: pkg.quantity,
                    price_snap: priceSnap,
                    unit_price: Number(pkg.price_amount) || priceSnap,
                };
            });

        if (newLines.length === 0) {
            addToast('warning', 'Bu paketteki tüm hizmetler zaten ekli.');
            return;
        }
        setLines([...lines, ...newLines]);
        setShowImport(false);
    };

    // ═══════════════════════════════════
    // SAVE SALE
    // ═══════════════════════════════════
    const canSave = saleDate && selectedCustomer && lines.length > 0 && lines.every(l => l.service_variant_id) && selectedStaff;
    const [confirmModal, setConfirmModal] = useState(null); // { message }

    const handleSave = () => {
        if (!canSave) {
            addToast('error', 'Lütfen tüm alanları doldurun (müşteri, hizmetler, personel)');
            return;
        }
        if (lineTotals.totalAmount <= 0) {
            addToast('error', 'Toplam tutar 0₺ olamaz. Lütfen hizmet fiyatlarını kontrol edin.');
            return;
        }
        if (paymentTotal > lineTotals.totalAmount) {
            addToast('error', 'Tahsilat toplamı ödenecek tutarı aşamaz!');
            return;
        }
        // Incomplete / zero payment — show confirm modal
        if (paymentTotal < lineTotals.totalAmount) {
            const rem = lineTotals.totalAmount - paymentTotal;
            const msg = paymentTotal === 0
                ? `Hiç ödeme girilmedi. ${rem.toFixed(2)} ₺ borç olarak kaydedilecek.`
                : `Ödeme eksik: ${rem.toFixed(2)} ₺ borç kalacak.`;
            setConfirmModal({ message: msg });
            return;
        }
        doSave();
    };

    const doSave = async () => {
        setConfirmModal(null);
        setSaving(true);

        try {
            // Prepare line payload (discount distribution stays on frontend)
            const extraDiscountAmt = lineTotals.extraDiscountAmount || 0;
            const lineSumForDiscount = lines.reduce((s, l) => s + (Number(l.unit_price) || 0) * (Number(l.quantity) || 1), 0);
            const linePayload = lines.map(line => {
                const variant = findVariantById(line.service_variant_id);
                const qty = Math.max(1, Math.round(Number(line.quantity) || 1));
                const snap = Math.max(0, Number(line.price_snap) || 0);
                const linePrice = Math.max(0, Math.min(Number(line.unit_price) || 0, snap > 0 ? snap : Infinity));
                const lineNet = linePrice * qty;
                const discountShare = (extraDiscountAmt > 0 && lineSumForDiscount > 0)
                    ? Math.round((lineNet / lineSumForDiscount) * extraDiscountAmt * 100) / 100
                    : 0;
                const netPrice = Math.max(0, Math.round((linePrice - discountShare / qty) * 100) / 100);
                return {
                    service_variant_id: line.service_variant_id,
                    quantity: qty,
                    unit_price: netPrice,
                    applied_discount_amount: discountShare,
                    price_snap: snap > 0 ? snap : 0,
                    tax_rate_snap: vatServiceRate,
                    item_name_snap: variant ? getVariantDisplayName(variant) : null,
                    staff_id: selectedStaff || null,
                };
            });

            // Prepare payment payload
            const paymentPayload = paymentEntries
                .filter(e => Number(e.amount) > 0)
                .map(e => ({
                    method: e.method,
                    amount: Number(e.amount),
                    paid_at: saleDate ? new Date(saleDate).toISOString() : new Date().toISOString(),
                }));

            const { data: saleId, error } = await supabase.rpc('rpc_create_package_sale', {
                p_branch_id: branchId,
                p_customer_id: selectedCustomer.id,
                p_sale_date: saleDate,
                p_notes: saleNotes || null,
                p_staff_id: selectedStaff || null,
                p_expires_at: hasExpiry && expiryDate ? new Date(expiryDate).toISOString() : null,
                p_total_discount: lineTotals.totalDiscount + lineTotals.extraDiscountAmount,
                p_total_tax: Math.round(lineTotals.totalTax * 100) / 100,
                p_total_amount: lineTotals.totalAmount,
                p_extra_discount_pct: extraDiscount.pct || 0,
                p_extra_discount_amount: lineTotals.extraDiscountAmount || 0,
                p_extra_discount_source: extraDiscount.source || null,
                p_applied_tag_id: extraDiscount.tagId || null,
                p_created_by: tenantUser.id,
                p_tenant_id: tenantUser.tenant_id,
                p_parapuan_cash_rate: effectiveParapuanRates.cash || 0,
                p_parapuan_card_rate: effectiveParapuanRates.card || 0,
                p_lines: linePayload,
                p_payments: paymentPayload,
            });
            if (error) throw error;

            addToast('success', 'Paket satışı başarıyla oluşturuldu!');
            setShowModal(false);
            setLoading(true);
            await loadAll();
        } catch (err) {
            console.error(err);
            addToast('error', 'Satış kaydedilirken hata: ' + (err.message || err));
        } finally {
            setSaving(false);
        }
    };

    // Navigate to detail page
    const openDetail = (sale) => {
        navigate(`/package-sales/${sale.id}`);
    };

    // ─── Düzenleme: Birleşik Wizard ───
    const openEdit = (sale, e) => {
        e.stopPropagation();
        // Step 1: Genel bilgiler
        setEditInfoCustomerId(sale.customer_id || '');
        setEditInfoDate(sale.sale_date || '');
        setEditInfoStaff(sale.staff_id || '');
        setEditInfoNotes(sale.notes || '');
        setEditInfoHasExpiry(!!sale.expires_at);
        setEditInfoExpiryDate(sale.expires_at ? sale.expires_at.split('T')[0] : '');
        // Step 2: Hizmetler
        const usedMap = {};
        (sale._redemptions || []).forEach(r => {
            usedMap[r.entitlement_sale_line_id] = (usedMap[r.entitlement_sale_line_id] || 0) + Number(r.quantity);
        });
        const lines = sale._lines.map(l => {
            const used = usedMap[l.id] || 0;
            const refunded = sale._refundedLineQtys?.[l.id] || 0;
            return {
                ...l,
                service_variant_id: l.service_variant_id || '',
                price_snap: Number(l.price_snap) || 0,
                // Show base price (before extra discount) in edit input — extra discount re-applied on save
                unit_price: Number(l.unit_price) + (Number(l.applied_discount_amount) || 0) / Number(l.quantity),
                applied_discount_amount: Number(l.applied_discount_amount) || 0,
                _used: used,
                _refunded: refunded,
                _locked: used > 0,
                _fullyLocked: refunded > 0,
                _minQty: used + refunded,
                _removed: false,
                _isNew: false,
                _origQty: Number(l.quantity),
                _origPrice: Number(l.unit_price),
            };
        });
        const firstVariantId = sale._lines.find(l => l.service_variant_id)?.service_variant_id;
        if (firstVariantId) {
            const v = findVariantById(firstVariantId);
            if (v) setLockedGenderId(v.gender_id);
        }
        setEditServiceLines(lines);
        setEditStep(0);
        setConfirmDeleteSale(false);
        setEditSale(sale);
    };

    const closeEdit = () => {
        setEditSale(null);
        setEditStep(0);
        setConfirmDeleteSale(false);
    };

    const saveEdit = async (forceDelete = false) => {
        if (!editSale) return;
        const sale = editSale;
        const activeLines = editServiceLines.filter(l => !l._removed);

        // ═══ Full deletion: tüm satırlar silindiyse ═══
        if (activeLines.length === 0) {
            const hasUsage = editServiceLines.some(l => l._used > 0);
            const hasRefund = editServiceLines.some(l => l._refunded > 0);
            const hasPay = (sale._paidTotal || 0) > 0;

            if (hasUsage || hasRefund || hasPay) {
                const reasons = [];
                if (hasPay) reasons.push(`ödeme var (${formatCurrency(sale._paidTotal)})`);
                if (hasUsage) reasons.push(`${editServiceLines.reduce((s, l) => s + (l._used || 0), 0)} kullanım var`);
                if (hasRefund) reasons.push('iade yapılmış');
                addToast('error', `Bu satış silinemez: ${reasons.join(', ')}. Önce iade işlemi yapın.`);
                return;
            }

            if (!forceDelete) {
                setConfirmDeleteSale(true);
                return;
            }
            // Hard delete entire sale via RPC
            setSavingEdit(true);
            try {
                const { error } = await supabase.rpc('rpc_delete_package_sale', {
                    p_sale_id: sale.id,
                });
                if (error) throw error;

                addToast('success', 'Satış tamamen silindi.');
                closeEdit();
                await loadAll();
            } catch (err) {
                console.error(err);
                addToast('error', 'Silme hatası: ' + (err.message || err));
            } finally {
                setSavingEdit(false);
            }
            return;
        }

        // ═══ Validasyonlar ═══
        if (activeLines.some(l => !l.service_variant_id)) {
            addToast('error', 'Tüm hizmet satırlarında bir hizmet seçili olmalıdır.');
            setEditStep(1);
            return;
        }

        // unit_price in edit mode is already base price (extra discount re-added on modal open)
        const lineSumBeforeExtra = activeLines.reduce((s, l) => s + Number(l.quantity) * Number(l.unit_price), 0);
        const newSubtotal = activeLines.reduce((s, l) => s + Number(l.quantity) * Number(l.price_snap || l.unit_price), 0);
        const lineDiscount = newSubtotal - lineSumBeforeExtra;
        // Re-apply extra discount from original sale
        const extraPct = Number(sale.extra_discount_pct) || 0;
        const extraDiscountAmt = extraPct > 0 ? Math.round(lineSumBeforeExtra * extraPct) / 100 : 0;
        const newTotal = lineSumBeforeExtra - extraDiscountAmt;
        const paidSoFar = sale._netPaid || 0;
        if (newTotal <= 0) {
            addToast('error', 'Toplam tutar 0₺ olamaz. Lütfen hizmet fiyatlarını kontrol edin.');
            setEditStep(1);
            return;
        }
        if (newTotal < paidSoFar) {
            addToast('error', `Yeni toplam (${formatCurrency(newTotal)}) ödenen tutardan (${formatCurrency(paidSoFar)}) düşük olamaz. Önce iade yapın.`);
            setEditStep(1);
            return;
        }

        setSavingEdit(true);
        try {
            // Tax: proportionally distributed across lines on final amount
            const newTax = Math.round((() => {
                if (lineSumBeforeExtra <= 0) return 0;
                let tax = 0;
                activeLines.forEach(l => {
                    const lineNet = Number(l.quantity) * Number(l.unit_price);
                    const effective = (lineNet / lineSumBeforeExtra) * newTotal;
                    const taxRate = Number(l.tax_rate_snap) || vatServiceRate;
                    tax += effective - (effective / (1 + taxRate / 100));
                });
                return tax;
            })() * 100) / 100;

            // Prepare removed line IDs (existing lines marked for removal)
            const removedLineIds = editServiceLines
                .filter(l => l._removed && !l._isNew)
                .map(l => l.id);

            // Prepare updated existing lines (with recalculated discount distribution)
            const updatedLines = activeLines.filter(l => !l._isNew).map(line => {
                const lineNet = Number(line.unit_price) * Number(line.quantity);
                const discountShare = (extraDiscountAmt > 0 && lineSumBeforeExtra > 0)
                    ? Math.round((lineNet / lineSumBeforeExtra) * extraDiscountAmt * 100) / 100
                    : 0;
                const netPrice = Math.max(0, Math.round((Number(line.unit_price) - discountShare / Number(line.quantity)) * 100) / 100);
                return {
                    id: line.id,
                    quantity: Number(line.quantity),
                    unit_price: netPrice,
                    applied_discount_amount: discountShare,
                };
            }).filter(line => {
                // Only include lines that actually changed
                const orig = editServiceLines.find(l => l.id === line.id);
                return line.quantity !== orig._origQty || line.unit_price !== orig._origPrice || line.applied_discount_amount !== (Number(orig.applied_discount_amount) || 0);
            });

            // Prepare new lines
            const newLinePayload = activeLines.filter(l => l._isNew).map(l => {
                const variant = findVariantById(l.service_variant_id);
                const basePrice = Number(l.unit_price);
                const lineNet = basePrice * Number(l.quantity);
                const discountShare = (extraDiscountAmt > 0 && lineSumBeforeExtra > 0)
                    ? Math.round((lineNet / lineSumBeforeExtra) * extraDiscountAmt * 100) / 100
                    : 0;
                const netPrice = Math.max(0, Math.round((basePrice - discountShare / Number(l.quantity)) * 100) / 100);
                return {
                    service_variant_id: l.service_variant_id || null,
                    item_name_snap: variant ? getVariantDisplayName(variant) : l.item_name_snap,
                    price_snap: Number(l.price_snap) || 0,
                    tax_rate_snap: vatServiceRate,
                    quantity: Number(l.quantity),
                    unit_price: netPrice,
                    applied_discount_amount: discountShare,
                };
            });

            const { error } = await supabase.rpc('rpc_edit_package_sale', {
                p_sale_id: sale.id,
                p_customer_id: editInfoCustomerId || null,
                p_sale_date: editInfoDate || null,
                p_staff_id: editInfoStaff || null,
                p_notes: editInfoNotes || '',
                p_expires_at: editInfoHasExpiry && editInfoExpiryDate ? editInfoExpiryDate : null,
                p_total_amount: newTotal,
                p_total_discount: Math.max(0, lineDiscount) + extraDiscountAmt,
                p_total_tax: newTax,
                p_extra_discount_amount: extraDiscountAmt,
                p_old_customer_id: sale.customer_id,
                p_old_sale_date: sale.sale_date,
                p_ledger_id: sale._ledger?.id || null,
                p_removed_line_ids: removedLineIds,
                p_updated_lines: updatedLines,
                p_new_lines: newLinePayload,
            });
            if (error) throw error;

            addToast('success', 'Satış güncellendi.');
            closeEdit();
            await loadAll();
        } catch (err) {
            console.error(err);
            addToast('error', 'Güncelleme hatası: ' + (err.message || err));
        } finally {
            setSavingEdit(false);
        }
    };

    // ─── Düzenleme: Tahsilatlar ───
    const openEditPayments = async (sale, e) => {
        e.stopPropagation();
        const todayStr = localDateStr();
        // Fetch reward transactions for each payment
        const paymentIds = sale._payments.map(p => p.id);
        let rewardMap = {};
        if (paymentIds.length > 0) {
            const { data: rewards } = await supabase
                .from('customer_reward_transactions')
                .select('payment_id, kind, points')
                .in('payment_id', paymentIds)
                .is('removed_at', null);
            (rewards || []).forEach(r => {
                if (r.kind === 'earn') {
                    rewardMap[r.payment_id] = (rewardMap[r.payment_id] || 0) + Number(r.points);
                }
            });
        }
        const lines = sale._payments.map(p => ({
            ...p,
            _removed: false,
            _isToday: p.created_at ? localDateStr(new Date(p.created_at)) === todayStr : false,
            _earnedPoints: rewardMap[p.id] || 0,
        }));
        setEditPaymentsSale(sale);
        setEditPaymentLines(lines);
    };

    const saveEditPayments = async () => {
        if (!editPaymentsSale) return;
        const sale = editPaymentsSale;
        const removedPayments = editPaymentLines.filter(p => p._removed);
        if (removedPayments.length === 0) {
            setEditPaymentsSale(null);
            return;
        }

        // Min protection: total after deletion >= refundedTotal
        const activePayments = editPaymentLines.filter(p => !p._removed);
        const newPayTotal = activePayments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
        const refundedTotal = sale._refundedTotal || 0;
        if (newPayTotal < refundedTotal) {
            addToast('error', `Toplam ödemeler (${formatCurrency(newPayTotal)}) iade tutarının (${formatCurrency(refundedTotal)}) altına düşemez!`);
            return;
        }

        setSavingEditPayments(true);
        try {
            const paymentIds = removedPayments.map(p => p.id);
            const { error } = await supabase.rpc('rpc_soft_delete_payments', {
                p_payment_ids: paymentIds,
            });
            if (error) throw error;

            addToast('success', 'Tahsilatlar güncellendi.');
            setEditPaymentsSale(null);
            await loadAll();
        } catch (err) {
            console.error(err);
            addToast('error', 'Tahsilat güncelleme hatası: ' + (err.message || err));
        } finally {
            setSavingEditPayments(false);
        }
    };

    // ─── Silme ───
    const deleteSale = (sale, e) => {
        e.stopPropagation();
        // Validate: no payments, no usage, no refunds
        const hasPay = (sale._paidTotal || 0) > 0;
        const hasUsage = (sale._totalRedeemed || 0) > 0;
        const hasRefund = sale._refundStatus !== 'none';

        if (hasPay || hasUsage || hasRefund) {
            const reasons = [];
            if (hasPay) reasons.push(`ödeme var (${formatCurrency(sale._paidTotal)})`);
            if (hasUsage) reasons.push(`${sale._totalRedeemed} kullanım var`);
            if (hasRefund) reasons.push('iade yapılmış');
            addToast('error', `Bu satış silinemez: ${reasons.join(', ')}.`);
            return;
        }

        // Show confirmation popup
        setConfirmDeleteSaleData(sale);
    };

    const executeDeleteSale = async () => {
        const sale = confirmDeleteSaleData;
        if (!sale) return;
        setConfirmDeleteSaleData(null);

        try {
            const { error } = await supabase.rpc('rpc_delete_package_sale', {
                p_sale_id: sale.id,
            });
            if (error) throw error;

            addToast('success', 'Satış silindi.');
            await loadAll();
        } catch (err) {
            console.error(err);
            addToast('error', 'Silme hatası: ' + (err.message || err));
        }
    };

    // ─── Tahsilat Modal Helpers ───
    const openTahsilat = (sale, e) => {
        e.stopPropagation(); // prevent row click
        setCollectSale(sale);
        setCollectEntries([{ method: 'cash', amount: '' }]);
        setCollectPayDate(localDateStr());
    };

    const collectTotal = collectEntries.reduce((s, e) => s + (Number(e.amount) || 0), 0);
    const collectRemaining = collectSale ? Number(collectSale._remaining) : 0;

    const saveTahsilat = async () => {
        const realEntries = collectEntries.filter(e => Number(e.amount) > 0);
        if (realEntries.length === 0) {
            addToast('error', 'Lütfen en az bir tahsilat tutarı girin.');
            return;
        }
        if (collectTotal > collectRemaining) {
            addToast('error', 'Tahsilat toplamı kalan borçtan fazla olamaz!');
            return;
        }
        if (!collectSale._ledger?.id) {
            addToast('error', 'Muhasebe kaydı bulunamadı.');
            return;
        }

        setSavingTahsilat(true);
        try {
            const paymentPayload = realEntries.map(e => ({
                method: e.method,
                amount: Number(e.amount),
                paid_at: collectPayDate ? new Date(collectPayDate).toISOString() : new Date().toISOString(),
            }));

            const { error } = await supabase.rpc('rpc_collect_payment', {
                p_branch_id: branchId,
                p_customer_id: collectSale.customer_id,
                p_ledger_entry_id: collectSale._ledger.id,
                p_created_by: tenantUser.id,
                p_tenant_id: tenantUser.tenant_id,
                p_parapuan_cash_rate: effectiveParapuanRates.cash || 0,
                p_parapuan_card_rate: effectiveParapuanRates.card || 0,
                p_payments: paymentPayload,
            });
            if (error) throw error;

            addToast('success', 'Tahsilat başarıyla kaydedildi!');
            setCollectSale(null);
            setCollectEntries([]);
            setLoading(true);
            await loadAll();
        } catch (err) {
            console.error('Tahsilat save error:', err);
            addToast('error', 'Tahsilat kaydedilirken hata: ' + (err.message || err));
        } finally {
            setSavingTahsilat(false);
        }
    };

    // ─── İade (Refund) Modal Helpers ───
    const openRefund = async (sale, e) => {
        e.stopPropagation();
        // Build selection list from sale lines
        const selections = sale._lines.map(line => {
            const usedQty = sale._redemptions.filter(r => r.entitlement_sale_line_id === line.id)
                .reduce((s, r) => s + Number(r.quantity), 0);
            const refundedQty = sale._refundedLineQtys?.[line.id] || 0;
            const remainingQty = Number(line.quantity) - refundedQty;
            return {
                lineId: line.id,
                name: line.item_name_snap || 'Hizmet',
                totalQty: Number(line.quantity),
                usedQty,
                refundedQty,
                remainingQty,
                unitPrice: Number(line.unit_price),
                selected: false,
                refundQty: remainingQty,
                serviceVariantId: line.service_variant_id,

                priceSnap: line.price_snap,
                taxRateSnap: line.tax_rate_snap,
                appliedDiscountAmount: Number(line.applied_discount_amount) || 0,
            };
        }).filter(s => s.remainingQty > 0);

        // Fetch customer's current parapuan balance
        let currentBalance = 0;
        try {
            const { data: rewards } = await supabase
                .from('customer_reward_transactions')
                .select('kind, points')
                .eq('customer_id', sale.customer_id)
                .is('removed_at', null);
            currentBalance = (rewards || []).reduce((sum, r) => {
                return sum + (r.kind === 'earn' ? Number(r.points) : -Number(r.points));
            }, 0);
        } catch (err) { /* ignore */ }

        // Fetch reward transactions linked to this sale's payments
        let saleRewardTxns = [];
        if (sale._payments.length) {
            const paymentIds = sale._payments.map(p => p.id);
            try {
                const { data: rts } = await supabase
                    .from('customer_reward_transactions')
                    .select('*')
                    .in('payment_id', paymentIds)
                    .is('removed_at', null);
                saleRewardTxns = rts || [];
            } catch (err) { /* ignore */ }
        }

        // Fetch previous refund outgoing payments (to calculate available cash/parapuan)
        let previousCashOut = 0;
        let previousParapuanOut = 0;
        try {
            const { data: refSales } = await supabase
                .from('sales')
                .select('id')
                .eq('ref_sale_id', sale.id)
                .eq('sale_kind', 'package_refund')
                .is('removed_at', null);
            if (refSales?.length) {
                const refSaleIds = refSales.map(r => r.id);
                const { data: refLedgers } = await supabase
                    .from('customer_ledger_entries')
                    .select('id')
                    .in('source_id', refSaleIds)
                    .eq('source_type', 'sale')
                    .is('removed_at', null);
                if (refLedgers?.length) {
                    const refLedgerIds = refLedgers.map(l => l.id);
                    const { data: refPayments } = await supabase
                        .from('payments')
                        .select('method, amount')
                        .in('ledger_entry_id', refLedgerIds)
                        .eq('direction', 'out')
                        .is('removed_at', null);
                    (refPayments || []).forEach(p => {
                        if (p.method === 'credit') {
                            previousParapuanOut += Number(p.amount);
                        } else {
                            previousCashOut += Number(p.amount);
                        }
                    });
                }
            }
        } catch (err) { /* ignore */ }

        setRefundSale({
            ...sale,
            _parapuanBalance: Math.max(0, currentBalance),
            _rewardTxns: saleRewardTxns,
            _previousCashOut: previousCashOut,
            _previousParapuanOut: previousParapuanOut,
        });
        setRefundSelections(selections);
        setRefundPaymentMethod('cash');
    };

    // Refund calculation (cumulative approach)
    const refundCalc = useMemo(() => {
        if (!refundSale) return null;
        const selectedLines = refundSelections.filter(s => s.selected);
        const refundLineTotal = selectedLines.reduce((sum, s) => sum + (s.unitPrice * s.refundQty), 0);

        const originalTotal = Number(refundSale.total_amount);


        // ─── Kümülatif dağıtım: iade = min(hizmet toplamı, ödenen) ───
        // Real money paid in original sale
        const realPayments = refundSale._payments.filter(p => p.method !== 'credit');
        const totalRealPaid = realPayments.reduce((s, p) => s + Number(p.amount), 0);
        // Parapuan used as payment in original sale
        const parapuanPaid = refundSale._payments.filter(p => p.method === 'credit')
            .reduce((s, p) => s + Number(p.amount), 0);

        // Net paid = total paid - what was already refunded in previous refunds
        const netRealPaid = Math.max(0, totalRealPaid - (refundSale._previousCashOut || 0));
        const netParapuanPaid = Math.max(0, parapuanPaid - (refundSale._previousParapuanOut || 0));
        const netTotalPaid = netRealPaid + netParapuanPaid;

        const cumulativeRefund = Math.min(refundLineTotal, netTotalPaid);

        // Split between parapuan and real cash (PARAPUAN FIRST)
        const parapuanRefund = Math.min(cumulativeRefund, netParapuanPaid);
        let cashRefund = Math.min(Math.max(0, cumulativeRefund - parapuanRefund), netRealPaid);

        // Clawback: iade edilen nakit × earn oranı (amount-based, not ratio-based)
        const earnRate = effectiveParapuanRates.cash || 0;
        const earnedToClawback = Math.floor(cashRefund * earnRate / 100);

        // Can we clawback from current balance?
        const parapuanBalance = refundSale._parapuanBalance || 0;
        const canClawback = Math.min(earnedToClawback, parapuanBalance);
        const unrecoverable = earnedToClawback - canClawback;

        // Apply unrecoverable to cashRefund
        cashRefund = Math.max(0, cashRefund - unrecoverable);

        // ─── Validation (excess-based): müşteri hâlâ borçluysa iade engelle ───
        const refundedTotal = refundSale._refundedTotal || 0;
        const activeTotal = originalTotal - refundedTotal;
        const afterTotal = activeTotal - refundLineTotal;
        const totalExcess = Math.max(0, netTotalPaid - afterTotal);

        const hasUsedSelection = selectedLines.some(sl => sl.usedQty > 0);

        let canRefund = true;
        let blockReason = '';

        if (selectedLines.length > 0 && !hasUsedSelection) {
            if (totalExcess <= 0) {
                canRefund = false;
                blockReason = 'Seçilen hizmetler kullanılmamış ve müşterinin borcu devam ettiği için iade yapılamaz. Bu hizmetleri çıkarmak için paketi düzenleyebilirsiniz.';
            }
        }

        return {
            refundLineTotal,
            earnedToClawback,
            parapuanToReturn: parapuanRefund,
            canClawback,
            unrecoverable,
            cashRefund,
            totalRefundAmount: cumulativeRefund,
            hasSelection: selectedLines.length > 0,
            canRefund,
            blockReason,
        };
    }, [refundSale, refundSelections, effectiveParapuanRates]);

    const saveRefund = async () => {
        if (!refundSale || !refundCalc?.hasSelection) return;
        setSavingRefund(true);
        try {
            const selectedLines = refundSelections.filter(s => s.selected);

            // Compute tax on frontend (depends on per-line tax rates)
            const lineSum = selectedLines.reduce((s, sl) => s + sl.unitPrice * sl.refundQty, 0);
            let totalTax = 0;
            if (lineSum > 0) {
                selectedLines.forEach(sl => {
                    const lineNet = sl.unitPrice * sl.refundQty;
                    const effective = (lineNet / lineSum) * refundCalc.totalRefundAmount;
                    const taxRate = Number(sl.taxRateSnap) || vatServiceRate;
                    totalTax += effective - (effective / (1 + taxRate / 100));
                });
                totalTax = Math.round(totalTax * 100) / 100;
            }

            const linePayload = selectedLines.map(sl => ({
                service_variant_id: sl.serviceVariantId,
                quantity: sl.refundQty,
                unit_price: sl.unitPrice,
                price_snap: sl.priceSnap,
                tax_rate_snap: sl.taxRateSnap,
                item_name_snap: sl.name,
                ref_sale_line_id: sl.lineId,
                applied_discount_amount: sl.appliedDiscountAmount || 0,
            }));

            const { data: refundSaleId, error } = await supabase.rpc('rpc_refund_package_sale', {
                p_branch_id: branchId,
                p_customer_id: refundSale.customer_id,
                p_ref_sale_id: refundSale.id,
                p_sale_date: localDateStr(),
                p_notes: `İade - ${refundSale.customer?.first_name || ''} ${refundSale.customer?.last_name || ''}`,
                p_total_amount: refundCalc.totalRefundAmount,
                p_total_tax: totalTax,
                p_cash_refund: refundCalc.cashRefund,
                p_parapuan_return: refundCalc.parapuanToReturn,
                p_clawback_points: refundCalc.canClawback,
                p_refund_method: refundPaymentMethod,
                p_created_by: tenantUser.id,
                p_tenant_id: tenantUser.tenant_id,
                p_lines: linePayload,
            });
            if (error) throw error;

            addToast('success', 'İade başarıyla kaydedildi!');
            setRefundSale(null);
            setRefundSelections([]);
            setLoading(true);
            await loadAll();
        } catch (err) {
            console.error('Refund save error:', err);
            addToast('error', 'İade kaydedilirken hata: ' + (err.message || err));
        } finally {
            setSavingRefund(false);
        }
    };

    // ─── Edit Wizard: memoised calculations ───
    const editCalc = useMemo(() => {
        if (!editSale) return null;
        const activeLines = editServiceLines.filter(l => !l._removed);
        const editSubtotal = activeLines.reduce((s, l) => s + Number(l.quantity) * (Number(l.price_snap) || Number(l.unit_price)), 0);
        const editLineSumBeforeExtra = activeLines.reduce((s, l) => s + Number(l.quantity) * Number(l.unit_price), 0);
        const editLineDiscount = editSubtotal - editLineSumBeforeExtra;
        const editExtraPct = Number(editSale.extra_discount_pct) || 0;
        const editExtraSource = editSale.extra_discount_source;
        const editExtraDiscountAmt = editExtraPct > 0 ? Math.round(editLineSumBeforeExtra * editExtraPct) / 100 : 0;
        const editFinalTotal = editLineSumBeforeExtra - editExtraDiscountAmt;
        const editExtraLabel = editExtraSource === 'birthday' ? `🎂 Doğum Günü İndirimi (%${editExtraPct})` : `🏷️ Etiket İndirimi (%${editExtraPct})`;
        const editGenderId = (() => {
            const firstVid = editServiceLines.find(l => l.service_variant_id)?.service_variant_id;
            if (firstVid) { const v = findVariantById(firstVid); return v?.gender_id || null; }
            return null;
        })();
        const editFilteredVariants = editGenderId
            ? serviceVariants.filter(v => v.gender_id === editGenderId)
            : serviceVariants;
        return {
            activeLines, editSubtotal, editLineSumBeforeExtra, editLineDiscount,
            editExtraPct, editExtraSource, editExtraDiscountAmt, editFinalTotal,
            editExtraLabel, editGenderId, editFilteredVariants,
        };
    }, [editSale, editServiceLines, serviceVariants]);

    // ═══════════════════════════════════
    // RENDER
    // ═══════════════════════════════════
    if (loading) {
        return (
            <div className="pkg-sales-page">
                <div className="pkg-loading">
                    <div className="pkg-loading-spinner" />
                    Yükleniyor...
                </div>
            </div>
        );
    }

    return (
        <div className="pkg-sales-page">

            {/* ─── Header ─── */}
            <div className="pkg-sales-header">
                <div className="pkg-sales-header-left">
                    <h1><span>📦</span> Paket Satışları</h1>
                    <p className="pkg-sales-header-subtitle">Paket satışlarınızı yönetin ve takip edin</p>
                </div>
                <div className="pkg-sales-header-right">
                    <button className="btn-new-sale" onClick={openWizard}>+ Yeni Paket Satışı</button>
                </div>
            </div>

            {/* ─── Toolbar ─── */}
            <div className="pkg-sales-toolbar">
                <div className="pkg-sales-search">
                    <span className="pkg-sales-search-icon">🔍</span>
                    <input
                        placeholder="Müşteri adı veya telefon..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="pkg-sales-filter-group">
                    <button
                        className={`pkg-sales-filter-btn ${activeFilter === '' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('')}
                    >Tümü</button>
                    <button
                        className={`pkg-sales-filter-btn ${activeFilter === 'paid' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('paid')}
                    >Ödendi</button>
                    <button
                        className={`pkg-sales-filter-btn ${activeFilter === 'debt' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('debt')}
                    >Borçlu</button>
                    <button
                        className={`pkg-sales-filter-btn ${activeFilter === 'refunded' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('refunded')}
                    >İade</button>
                </div>
            </div>

            {/* ─── Table ─── */}
            {filteredSales.length === 0 ? (
                <div className="pkg-no-data">
                    <div className="pkg-no-data-icon">📭</div>
                    <h3>Henüz paket satışı yok</h3>
                    <p>İlk paket satışınızı oluşturmak için yukarıdaki butonu kullanın</p>
                </div>
            ) : (
                <div className="pkg-sales-table-wrap">
                    <table className="pkg-sales-table">
                        <thead>
                            <tr>
                                <th>Tarih</th>
                                <th>Müşteri</th>
                                <th>Hizmet</th>
                                <th>Kullanım</th>
                                <th className="col-amount">Toplam</th>
                                <th className="col-amount">Ödenen</th>
                                <th className="col-amount">İade</th>
                                <th className="col-amount">Borç</th>
                                <th>Geçerlilik</th>
                                <th>Durum</th>
                                <th className="col-action">Aksiyon</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSales.map(sale => {
                                const isExpired = sale.expires_at && new Date(sale.expires_at) < new Date();
                                const payStatus = sale._remaining <= 0 ? 'paid' : sale._paidTotal > 0 ? 'partial' : 'unpaid';
                                return (
                                    <tr
                                        key={sale.id}
                                        className={`pkg-sale-row ${openDropdownId === sale.id ? 'dropdown-open' : ''}`}
                                        onClick={() => openDetail(sale)}
                                    >
                                        <td className="col-date">{formatDate(sale.sale_date)}</td>
                                        <td>{sale.customer?.first_name} {sale.customer?.last_name || ''}</td>
                                        <td>{sale._serviceCount} hizmet</td>
                                        <td>{sale._totalRedeemed} / {sale._totalEntitlement}</td>
                                        <td className="col-amount">{formatCurrency(sale.total_amount)}</td>
                                        <td className="col-paid">{formatCurrency(sale._paidTotal)}</td>
                                        <td className="col-refund">{sale._refundedTotal > 0 ? formatCurrency(sale._refundedTotal) : '—'}</td>
                                        <td className="col-debt">{sale._refundStatus !== 'full' && sale._remaining > 0 ? formatCurrency(sale._remaining) : '—'}</td>
                                        <td className="col-date">{sale.expires_at ? formatDate(sale.expires_at) : '—'}</td>
                                        <td>
                                            {sale._refundStatus === 'full' && <span className="pkg-status-badge refunded">Tam İade</span>}
                                            {sale._refundStatus === 'partial' && <span className="pkg-status-badge partial-refund">Kısmi İade</span>}
                                            {sale._refundStatus === 'none' && isExpired && <span className="pkg-status-badge expired">Süresi Doldu</span>}
                                            {sale._refundStatus === 'none' && !isExpired && <span className={`pkg-status-badge ${payStatus}`}>
                                                {payStatus === 'paid' ? 'Ödendi' : 'Borçlu'}
                                            </span>}
                                        </td>
                                        <td className="col-action">
                                            <div className="pkg-action-btns">
                                                <div className={`pkg-edit-dropdown ${openDropdownId === sale.id ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
                                                    <button className="pkg-edit-btn" onClick={e => { e.stopPropagation(); setOpenDropdownId(openDropdownId === sale.id ? null : sale.id); }}>⋮</button>
                                                    {openDropdownId === sale.id && (
                                                        <div className="pkg-edit-dropdown-menu" style={{ display: 'block' }}>
                                                            {/* Satışı Düzenle: her zaman aktif */}
                                                            <button
                                                                onClick={(e) => { openEdit(sale, e); setOpenDropdownId(null); }}
                                                            >✏️ Satışı Düzenle</button>
                                                            {/* Tahsilat Ekle: sadece borç varsa */}
                                                            <button
                                                                disabled={sale._remaining <= 0}
                                                                onClick={(e) => { if (sale._remaining > 0) { openTahsilat(sale, e); setOpenDropdownId(null); } }}
                                                            >💰 Tahsilat Ekle</button>
                                                            {/* Tahsilat Geçmişi: her zaman aktif */}
                                                            <button onClick={(e) => { openEditPayments(sale, e); setOpenDropdownId(null); }}>📜 Tahsilat Geçmişi</button>
                                                            {/* İade Et: tam iade değilse aktif */}
                                                            <button
                                                                disabled={sale._refundStatus === 'full'}
                                                                onClick={(e) => { if (sale._refundStatus !== 'full') { openRefund(sale, e); setOpenDropdownId(null); } }}
                                                            >↩️ İade Et</button>
                                                            {/* Satışı Sil: hiç ödeme/iade/kullanım yoksa aktif */}
                                                            <button
                                                                className="pkg-dropdown-danger"
                                                                disabled={sale._paidTotal > 0 || sale._refundedTotal > 0 || sale._totalRedeemed > 0}
                                                                onClick={(e) => { if (sale._paidTotal <= 0 && sale._refundedTotal <= 0 && sale._totalRedeemed <= 0) { deleteSale(sale, e); setOpenDropdownId(null); } }}
                                                            >🗑️ Satışı Sil</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="pkg-table-footer">
                        <span className="pkg-table-footer-info">Toplam {filteredSales.length} kayıt</span>
                        <span className="pkg-table-footer-total">
                            Toplam: {formatCurrency(filteredSales.reduce((s, x) => s + Number(x.total_amount), 0))}
                        </span>
                    </div>
                </div>
            )
            }

            {/* ═══════════════ WIZARD MODAL ═══════════════ */}
            {
                showModal && (
                    <div className="pkg-modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="pkg-modal" onClick={e => e.stopPropagation()}>
                            <div className="pkg-modal-header">
                                <h2>📦 Yeni Paket Satışı</h2>
                                <button className="pkg-modal-close" onClick={() => setShowModal(false)}>✕</button>
                            </div>

                            {/* Step indicator */}
                            <div className="pkg-step-indicator">
                                <div className={`pkg-step ${wizardStep === 0 ? 'active' : 'completed'}`}
                                    onClick={() => wizardStep > 0 && setWizardStep(0)}>
                                    <span className="pkg-step-number">{wizardStep > 0 ? '✓' : '1'}</span>
                                    <span className="pkg-step-label">Genel Bilgiler</span>
                                </div>
                                <div className={`pkg-step-line ${wizardStep > 0 ? 'completed' : ''}`} />
                                <div className={`pkg-step ${wizardStep === 1 ? 'active' : wizardStep > 1 ? 'completed' : 'inactive'}`}
                                    onClick={() => wizardStep > 1 && setWizardStep(1)}>
                                    <span className="pkg-step-number">{wizardStep > 1 ? '✓' : '2'}</span>
                                    <span className="pkg-step-label">Hizmetler</span>
                                </div>
                                <div className={`pkg-step-line ${wizardStep > 1 ? 'completed' : ''}`} />
                                <div className={`pkg-step ${wizardStep === 2 ? 'active' : 'inactive'}`}>
                                    <span className="pkg-step-number">3</span>
                                    <span className="pkg-step-label">Ödeme</span>
                                </div>
                            </div>

                            <div className="pkg-modal-body">
                                {/* ─── STEP 1: Genel Bilgiler ─── */}
                                {wizardStep === 0 && (
                                    <div className="pkg-general-card">
                                        <div className="pkg-general-grid">
                                            <div className="pkg-form-group">
                                                <label>📅 Satış Tarihi</label>
                                                <input type="date" value={saleDate} onChange={e => setSaleDate(e.target.value)} />
                                            </div>
                                            <div className="pkg-form-group">
                                                <label>👤 Müşteri</label>
                                                {selectedCustomer ? (
                                                    <div className="pkg-selected-customer">
                                                        <div className="pkg-selected-customer-info">
                                                            <span className="pkg-selected-customer-name">
                                                                {selectedCustomer.first_name} {selectedCustomer.last_name || ''}
                                                            </span>
                                                            <span className="pkg-selected-customer-phone">
                                                                {selectedCustomer.phone_e164}
                                                            </span>
                                                        </div>
                                                        <button className="pkg-selected-customer-remove"
                                                            onClick={() => setSelectedCustomer(null)}>✕</button>
                                                    </div>
                                                ) : (
                                                    <div className="pkg-customer-search-wrap">
                                                        <input
                                                            placeholder="Müşteri ara..."
                                                            value={customerSearch}
                                                            onChange={e => { setCustomerSearch(e.target.value); setShowCustomerDropdown(true); }}
                                                            onFocus={() => setShowCustomerDropdown(true)}
                                                        />
                                                        {showCustomerDropdown && customerSearchResults.length > 0 && (
                                                            <div className="pkg-customer-dropdown">
                                                                {customerSearchResults.map(c => (
                                                                    <div key={c.id} className="pkg-customer-option"
                                                                        onClick={() => selectCustomer(c)}>
                                                                        <span className="pkg-customer-option-name">
                                                                            {c.first_name} {c.last_name || ''}
                                                                        </span>
                                                                        <span className="pkg-customer-option-phone">
                                                                            {c.phone_e164}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="pkg-form-group">
                                                <label>👤 Satıcı</label>
                                                <select value={selectedStaff} onChange={e => setSelectedStaff(e.target.value)}>
                                                    <option value="">Personel seçin...</option>
                                                    {staffList.map(s => (
                                                        <option key={s.id} value={s.id}>
                                                            {s.first_name} {s.last_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="pkg-general-notes">
                                            <div className="pkg-form-group">
                                                <label>📝 Notlar</label>
                                                <textarea value={saleNotes} onChange={e => setSaleNotes(e.target.value)}
                                                    placeholder="Satışla ilgili opsiyonel not yazabilirsiniz..." rows={2} />
                                            </div>
                                        </div>

                                        <div className="pkg-general-footer">
                                            <div className="pkg-toggle-row">
                                                <span className="pkg-toggle-label">📅 Son geçerlilik tarihi</span>
                                                <label className="pkg-toggle-switch">
                                                    <input type="checkbox" checked={hasExpiry}
                                                        onChange={e => setHasExpiry(e.target.checked)} />
                                                    <span className="pkg-toggle-slider" />
                                                </label>
                                            </div>
                                            {hasExpiry && (
                                                <div className="pkg-form-group" style={{ marginTop: 8 }}>
                                                    <input type="date" value={expiryDate}
                                                        onChange={e => setExpiryDate(e.target.value)} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* ─── STEP 2: Hizmetler ─── */}
                                {wizardStep === 1 && (
                                    <>
                                        {/* Toolbar */}
                                        <div className="pkg-services-toolbar">
                                            <div className="pkg-services-toolbar-left">
                                                <span className="pkg-services-toolbar-title">📋 Hizmet Satırları</span>
                                                {lockedGenderId && (
                                                    <div className="pkg-gender-badge">
                                                        {getGenderIcon(lockedGenderId)} {getGenderLabel(lockedGenderId)}
                                                    </div>
                                                )}
                                                <span className="pkg-services-count">{lines.length} hizmet</span>
                                            </div>
                                            <div className="pkg-services-toolbar-right">
                                                <button className="btn-import-pkg" onClick={() => setShowImport(!showImport)}>
                                                    📦 Paketten Seç
                                                </button>
                                                {(() => {
                                                    const usedIds = new Set(lines.map(l => l.service_variant_id).filter(Boolean));
                                                    const hasAvailable = filteredVariants.some(v => !usedIds.has(v.id));
                                                    return (
                                                        <button className="btn-add-line" onClick={() => {
                                                            if (!hasAvailable) {
                                                                addToast('warning', 'Eklenebilecek hizmet kalmadı. Tüm hizmetler zaten listede.');
                                                                return;
                                                            }
                                                            if (lines.some(l => !l.service_variant_id)) {
                                                                addToast('warning', 'Önce mevcut satırdaki hizmeti seçin.');
                                                                return;
                                                            }
                                                            addLine();
                                                        }}>
                                                            + Yeni Satır
                                                        </button>
                                                    );
                                                })()}
                                            </div>
                                        </div>

                                        {showImport && (
                                            <div className="pkg-import-overlay" onClick={() => { setShowImport(false); setPackageSearch(''); }}>
                                                <div className="pkg-import-modal" onClick={e => e.stopPropagation()}>
                                                    <div className="pkg-import-modal-header">
                                                        <span>📦 Kayıtlı Paket Seç</span>
                                                        <button className="pkg-import-modal-close" onClick={() => { setShowImport(false); setPackageSearch(''); }}>✕</button>
                                                    </div>
                                                    <div className="pkg-import-search">
                                                        <input
                                                            placeholder="Paket ara..."
                                                            value={packageSearch}
                                                            onChange={e => setPackageSearch(e.target.value)}
                                                            autoFocus
                                                        />
                                                    </div>
                                                    <div className="pkg-import-modal-body">
                                                        {(() => {
                                                            const filtered = packageGroups
                                                                .filter(g => !lockedGenderId || g.gender_id === lockedGenderId)
                                                                .filter(g => !packageSearch || g.title.toLowerCase().includes(packageSearch.toLowerCase()));
                                                            if (filtered.length === 0) return (
                                                                <div className="pkg-empty-state">{packageSearch ? 'Eşleşen paket bulunamadı' : 'Kayıtlı paket bulunamadı'}</div>
                                                            );
                                                            return filtered.map(g => {
                                                                const gPkgs = packages.filter(p => p.group_id === g.id);
                                                                const total = gPkgs.reduce((s, p) => s + Number(p.price_amount || 0), 0);
                                                                return (
                                                                    <div key={g.id} className="pkg-import-item"
                                                                        onClick={() => { importPackage(g.id); setShowImport(false); setPackageSearch(''); }}>
                                                                        <div className="pkg-import-item-info">
                                                                            <div className="pkg-import-item-title">
                                                                                {getGenderIcon(g.gender_id)} {g.title}
                                                                            </div>
                                                                            <div className="pkg-import-item-meta">
                                                                                {gPkgs.length} hizmet
                                                                            </div>
                                                                        </div>
                                                                        <div className="pkg-import-item-price">
                                                                            {formatCurrency(total)}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            });
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Service lines - compact table header */}
                                        {lines.length > 0 && (
                                            <div className="pkg-lines-table">
                                                <div className="pkg-lines-table-header">
                                                    <span className="pkg-col-service">Hizmet</span>
                                                    <span className="pkg-col-qty">Adet</span>
                                                    <span className="pkg-col-price">Liste ₺</span>
                                                    <span className="pkg-col-price">Satış ₺</span>
                                                    <span className="pkg-col-action"></span>
                                                </div>
                                                {lines.map((line, idx) => {
                                                    const variant = findVariantById(line.service_variant_id);
                                                    const hasDiscount = Number(line.price_snap) > 0 && Number(line.unit_price) < Number(line.price_snap);
                                                    return (
                                                        <div key={idx} className="pkg-line-row">
                                                            <div className="pkg-col-service">
                                                                <select value={line.service_variant_id}
                                                                    onChange={e => updateLine(idx, 'service_variant_id', e.target.value)}>
                                                                    <option value="">Hizmet seçin...</option>
                                                                    {filteredVariants.filter(v => v.id === line.service_variant_id || !lines.some(l => l.service_variant_id === v.id)).map(v => (
                                                                        <option key={v.id} value={v.id}>
                                                                            {getVariantDisplayName(v)}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className="pkg-col-qty">
                                                                <input type="number" min="1" value={line.quantity}
                                                                    onChange={e => updateLine(idx, 'quantity', e.target.value)} />
                                                            </div>
                                                            <div className="pkg-col-price">
                                                                <input type="number" value={line.price_snap} readOnly className="pkg-readonly-input" />
                                                            </div>
                                                            <div className="pkg-col-price">
                                                                <div className="pkg-price-cell">
                                                                    <input type="number" min="0"
                                                                        max={line.price_snap}
                                                                        value={line.unit_price}
                                                                        className={hasDiscount ? 'pkg-discount-price' : ''}
                                                                        onChange={e => updateLine(idx, 'unit_price', e.target.value)} />
                                                                    {hasDiscount && (
                                                                        <span className="pkg-line-discount-badge">
                                                                            %{Math.round((1 - Number(line.unit_price) / Number(line.price_snap)) * 100)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="pkg-col-action">
                                                                <button className="pkg-line-remove-btn"
                                                                    onClick={() => removeLine(idx)} title="Satırı sil">✕</button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {lines.length === 0 && (
                                            <div className="pkg-empty-lines">
                                                <div className="pkg-empty-lines-icon">📦</div>
                                                <div className="pkg-empty-lines-text">Henüz hizmet eklenmedi</div>
                                                <div className="pkg-empty-lines-hint">Yukarıdaki butonlardan yeni satır ekleyin veya paketten seçin</div>
                                            </div>
                                        )}

                                        {/* Summary */}
                                        {lines.length > 0 && (
                                            <div className="pkg-summary">
                                                <div className="pkg-summary-row">
                                                    <span>Ara Toplam</span>
                                                    <span>{formatCurrency(lineTotals.subtotal)}</span>
                                                </div>
                                                {lineTotals.totalDiscount > 0 && (
                                                    <div className="pkg-summary-row discount">
                                                        <span>Satır İndirimi</span>
                                                        <span>-{formatCurrency(lineTotals.totalDiscount)}</span>
                                                    </div>
                                                )}
                                                {lineTotals.extraDiscountAmount > 0 && (
                                                    <div className="pkg-summary-row discount">
                                                        <span>{extraDiscount.label}</span>
                                                        <span>-{formatCurrency(lineTotals.extraDiscountAmount)}</span>
                                                    </div>
                                                )}
                                                <div className="pkg-summary-row">
                                                    <span>KDV (%{vatServiceRate})</span>
                                                    <span>{formatCurrency(lineTotals.totalTax)}</span>
                                                </div>
                                                <div className="pkg-summary-row total">
                                                    <span>Toplam</span>
                                                    <span>{formatCurrency(lineTotals.totalAmount)}</span>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* ─── STEP 3: Ödeme ─── */}
                                {wizardStep === 2 && (
                                    <>
                                        {/* Payment Due Banner */}
                                        <div className="pkg-payment-due">
                                            <div className="pkg-payment-due-label">Ödenecek Tutar</div>
                                            <div className="pkg-payment-due-amount">{formatCurrency(lineTotals.totalAmount)}</div>
                                            {parapuanBalance > 0 && (
                                                <div className="pkg-parapuan-badge">⭐ Parapuan Bakiye: {parapuanBalance} puan{minParapuan > 0 && ` (min. ${minParapuan})`}</div>
                                            )}
                                            {extraDiscount.pct > 0 && (
                                                <div className="pkg-parapuan-badge">{extraDiscount.label}</div>
                                            )}
                                        </div>

                                        {/* Payment Toolbar */}
                                        <div className="pkg-services-toolbar">
                                            <div className="pkg-services-toolbar-left">
                                                <span className="pkg-services-toolbar-title">📦 Tahsilatlar</span>
                                                <span className="pkg-services-count">{paymentEntries.length} ödeme</span>
                                            </div>
                                            <div className="pkg-services-toolbar-right">
                                                <button className="btn-add-line"
                                                    onClick={() => {
                                                        if (paymentEntries.some(e => !Number(e.amount))) {
                                                            addToast('error', 'Önce mevcut satırın tutarını girin.');
                                                            return;
                                                        }
                                                        if (paymentTotal >= lineTotals.totalAmount) {
                                                            addToast('error', 'Tutar zaten tamamlandı, daha fazla tahsilat eklenemez.');
                                                            return;
                                                        }
                                                        const allMethods = PAYMENT_METHODS.filter(m => m.value !== 'credit' || canUseParapuan);
                                                        const usedMethods = paymentEntries.map(e => e.method);
                                                        if (allMethods.every(m => usedMethods.includes(m.value))) {
                                                            addToast('error', 'Tüm ödeme yöntemleri zaten kullanılıyor.');
                                                            return;
                                                        }
                                                        const firstUnused = allMethods.find(m => !usedMethods.includes(m.value));
                                                        if (firstUnused) setPaymentEntries([...paymentEntries, { method: firstUnused.value, amount: '' }]);
                                                    }}>
                                                    + Tahsilat Ekle
                                                </button>
                                            </div>
                                        </div>

                                        {/* Payment Rows */}
                                        {paymentEntries.length > 0 ? (
                                            <div className="pkg-lines-table">
                                                <div className="pkg-lines-table-header">
                                                    <span style={{ flex: 1 }}>Yöntem</span>
                                                    <span className="pkg-col-price">Tutar ₺</span>
                                                    <span className="pkg-col-action"></span>
                                                </div>
                                                {paymentEntries.map((entry, idx) => {
                                                    // Available methods: filter parapuan + exclude methods used by other entries
                                                    const usedByOthers = paymentEntries
                                                        .filter((_, i) => i !== idx)
                                                        .map(e => e.method);
                                                    const availableMethods = PAYMENT_METHODS.filter(m => {
                                                        if (m.value === 'credit') return canUseParapuan;
                                                        if (m.value === entry.method) return true; // always show current
                                                        return !usedByOthers.includes(m.value);
                                                    });
                                                    // Max amount this entry can have
                                                    const otherTotal = paymentEntries.reduce((s, e, i) => i === idx ? s : s + (Number(e.amount) || 0), 0);
                                                    const maxAmount = lineTotals.totalAmount - otherTotal;
                                                    // For parapuan, also cap by balance
                                                    const effectiveMax = entry.method === 'credit'
                                                        ? Math.min(maxAmount, parapuanBalance)
                                                        : maxAmount;

                                                    return (
                                                        <div key={idx} className="pkg-line-row">
                                                            <div className="pkg-col-service">
                                                                <select value={entry.method}
                                                                    onChange={e => {
                                                                        const upd = [...paymentEntries];
                                                                        upd[idx] = { ...upd[idx], method: e.target.value };
                                                                        // Reset amount if switching to parapuan and amount exceeds balance
                                                                        if (e.target.value === 'credit' && Number(upd[idx].amount) > parapuanBalance) {
                                                                            upd[idx].amount = String(parapuanBalance);
                                                                        }
                                                                        setPaymentEntries(upd);
                                                                    }}>
                                                                    {availableMethods.map(m => (
                                                                        <option key={m.value} value={m.value}>{m.label}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className="pkg-col-price">
                                                                <input type="number" min="0"
                                                                    max={effectiveMax}
                                                                    placeholder="0"
                                                                    value={entry.amount}
                                                                    onChange={e => {
                                                                        let val = e.target.value;
                                                                        // Prevent negative
                                                                        if (Number(val) < 0) val = '0';
                                                                        // Cap at max
                                                                        if (Number(val) > effectiveMax) val = String(effectiveMax);
                                                                        const upd = [...paymentEntries];
                                                                        upd[idx] = { ...upd[idx], amount: val };
                                                                        setPaymentEntries(upd);
                                                                    }} />
                                                            </div>
                                                            <div className="pkg-col-action">
                                                                <button className="pkg-line-remove-btn"
                                                                    onClick={() => setPaymentEntries(paymentEntries.filter((_, i) => i !== idx))}>
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="pkg-empty-lines">
                                                <div className="pkg-empty-lines-icon">📦</div>
                                                <div className="pkg-empty-lines-text">Henüz tahsilat eklenmedi</div>
                                                <div className="pkg-empty-lines-hint">Ödeme almadan da kayıt oluşturabilirsiniz</div>
                                            </div>
                                        )}

                                        {/* Overpayment Warning */}
                                        {paymentTotal > lineTotals.totalAmount && (
                                            <div className="pkg-overpayment-warning">
                                                ⚠️ Tahsilat toplamı ödenecek tutarı aşıyor!
                                            </div>
                                        )}

                                        {/* Remaining Balance */}
                                        <div className="pkg-payment-remaining">
                                            <span className="pkg-payment-remaining-label">Kalan Borç</span>
                                            <span className={`pkg-payment-remaining-amount ${lineTotals.totalAmount - paymentTotal <= 0 ? 'zero' : 'debt'}`}>
                                                {formatCurrency(Math.max(0, lineTotals.totalAmount - paymentTotal))}
                                            </span>
                                        </div>

                                        {rewardPoints > 0 && (
                                            <div className="pkg-reward-info">
                                                ⭐ Bu ödemeyle {rewardPoints} parapuan kazanılacak
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="pkg-modal-footer">
                                <button className="btn-secondary"
                                    onClick={() => {
                                        if (wizardStep === 0) setShowModal(false);
                                        else setWizardStep(wizardStep - 1);
                                    }}>
                                    {wizardStep === 0 ? 'İptal' : '← Geri'}
                                </button>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button className="btn-primary"
                                        disabled={
                                            wizardStep === 0 ? (!saleDate || !selectedCustomer || !selectedStaff) :
                                                wizardStep === 1 ? (lines.length === 0 || lines.some(l => !l.service_variant_id)) :
                                                    saving
                                        }
                                        onClick={() => {
                                            if (wizardStep === 0) {
                                                setWizardStep(1);
                                            } else if (wizardStep === 1) {
                                                if (lineTotals.totalAmount <= 0) {
                                                    addToast('error', 'Toplam tutar 0₺ olamaz. Lütfen hizmet fiyatlarını kontrol edin.');
                                                    return;
                                                }
                                                setPaymentEntries([]);
                                                setWizardStep(2);
                                            } else {
                                                handleSave();
                                            }
                                        }}>
                                        {wizardStep < 2 ? 'Devam →' : saving ? 'Kaydediliyor...' : 'Kaydet ve Tamamla'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* ═══════════════ CONFIRM MODAL ═══════════════ */}
            {
                confirmModal && (
                    <div className="pkg-modal-overlay" style={{ zIndex: 10000 }} onClick={() => setConfirmModal(null)}>
                        <div className="pkg-modal" style={{ maxWidth: 420, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                            <div className="pkg-modal-header">
                                <h2>⚠️ Onay</h2>
                                <button className="pkg-modal-close" onClick={() => setConfirmModal(null)}>✕</button>
                            </div>
                            <div className="pkg-modal-body" style={{ padding: '24px 20px' }}>
                                <p style={{ fontSize: 15, color: '#475569', margin: 0, lineHeight: 1.6 }}>{confirmModal.message}</p>
                                <p style={{ fontSize: 13, color: '#94a3b8', margin: '12px 0 0' }}>Devam etmek istiyor musunuz?</p>
                            </div>
                            <div className="pkg-modal-footer">
                                <button className="btn-secondary" onClick={() => setConfirmModal(null)}>İptal</button>
                                <button className="btn-primary" onClick={doSave}>Evet, Kaydet</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* ═══════════════ TAHSILAT MODAL ═══════════════ */}
            {
                collectSale && (
                    <div className="pkg-modal-overlay" style={{ zIndex: 10001 }} onClick={() => setCollectSale(null)}>
                        <div className="pkg-modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
                            <div className="pkg-modal-header">
                                <h2>📦 Tahsilat Al</h2>
                                <button className="pkg-modal-close" onClick={() => setCollectSale(null)}>✕</button>
                            </div>
                            <div className="pkg-modal-body" style={{ padding: '20px' }}>
                                {/* Customer info */}
                                <div className="pkg-tahsilat-customer">
                                    <span className="pkg-tahsilat-customer-name">
                                        {collectSale.customer?.first_name} {collectSale.customer?.last_name || ''}
                                    </span>
                                    <span className="pkg-tahsilat-customer-phone">
                                        {collectSale.customer?.phone_e164 || ''}
                                    </span>
                                </div>

                                {/* Payment Date */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0' }}>
                                    <label style={{ fontSize: '0.85rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>📦 Ödeme Tarihi</label>
                                    <input
                                        type="date"
                                        value={collectPayDate}
                                        onChange={e => setCollectPayDate(e.target.value)}
                                        style={{ flex: 1, padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', fontSize: '0.85rem' }}
                                    />
                                </div>

                                {/* Summary */}
                                <div className="pkg-tahsilat-summary">
                                    <div className="pkg-tahsilat-summary-row">
                                        <span>Toplam</span>
                                        <span>{formatCurrency(collectSale._effectiveTotal || collectSale.total_amount)}</span>
                                    </div>
                                    <div className="pkg-tahsilat-summary-row">
                                        <span>Ödenen</span>
                                        <span className="positive">{formatCurrency(collectSale._paidTotal)}</span>
                                    </div>
                                    <div className="pkg-tahsilat-summary-row remaining">
                                        <span>Kalan Borç</span>
                                        <span className="negative">{formatCurrency(collectRemaining)}</span>
                                    </div>
                                </div>

                                {/* Payment entries */}
                                <div className="pkg-tahsilat-entries">
                                    <div className="pkg-services-toolbar">
                                        <div className="pkg-services-toolbar-left">
                                            <span className="pkg-services-toolbar-title">Tahsilatlar</span>
                                            <span className="pkg-services-count">{collectEntries.length} ödeme</span>
                                        </div>
                                        <div className="pkg-services-toolbar-right">
                                            <button className="btn-add-line"
                                                onClick={() => {
                                                    if (collectEntries.some(e => !Number(e.amount))) {
                                                        addToast('error', 'Önce mevcut satırın tutarını girin.');
                                                        return;
                                                    }
                                                    if (collectTotal >= collectRemaining) {
                                                        addToast('error', 'Tutar zaten tamamlandı, daha fazla tahsilat eklenemez.');
                                                        return;
                                                    }
                                                    const usedMethods = collectEntries.map(e => e.method);
                                                    if (TAHSILAT_METHODS.every(m => usedMethods.includes(m.value))) {
                                                        addToast('error', 'Tüm ödeme yöntemleri zaten kullanılıyor.');
                                                        return;
                                                    }
                                                    const firstUnused = TAHSILAT_METHODS.find(m => !usedMethods.includes(m.value));
                                                    if (firstUnused) setCollectEntries([...collectEntries, { method: firstUnused.value, amount: '' }]);
                                                }}>
                                                + Tahsilat Ekle
                                            </button>
                                        </div>
                                    </div>

                                    {collectEntries.length > 0 && (
                                        <div className="pkg-lines-table">
                                            <div className="pkg-lines-table-header">
                                                <span style={{ flex: 1 }}>Yöntem</span>
                                                <span className="pkg-col-price">Tutar ₺</span>
                                                <span className="pkg-col-action"></span>
                                            </div>
                                            {collectEntries.map((entry, idx) => {
                                                const usedByOthers = collectEntries
                                                    .filter((_, i) => i !== idx)
                                                    .map(e => e.method);
                                                const availMethods = TAHSILAT_METHODS.filter(m =>
                                                    m.value === entry.method || !usedByOthers.includes(m.value)
                                                );
                                                const otherTotal = collectEntries.reduce((s, e, i) => i === idx ? s : s + (Number(e.amount) || 0), 0);
                                                const maxAmount = collectRemaining - otherTotal;
                                                return (
                                                    <div key={idx} className="pkg-line-row">
                                                        <div className="pkg-col-service">
                                                            <select value={entry.method}
                                                                onChange={e => {
                                                                    const upd = [...collectEntries];
                                                                    upd[idx] = { ...upd[idx], method: e.target.value };
                                                                    setCollectEntries(upd);
                                                                }}>
                                                                {availMethods.map(m => (
                                                                    <option key={m.value} value={m.value}>{m.label}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="pkg-col-price">
                                                            <input type="number" min="0"
                                                                max={maxAmount}
                                                                placeholder="0"
                                                                value={entry.amount}
                                                                onChange={e => {
                                                                    let val = e.target.value;
                                                                    if (Number(val) < 0) val = '0';
                                                                    if (Number(val) > maxAmount) val = String(maxAmount);
                                                                    const upd = [...collectEntries];
                                                                    upd[idx] = { ...upd[idx], amount: val };
                                                                    setCollectEntries(upd);
                                                                }} />
                                                        </div>
                                                        <div className="pkg-col-action">
                                                            <button className="pkg-line-remove-btn"
                                                                onClick={() => setCollectEntries(collectEntries.filter((_, i) => i !== idx))}>
                                                                ✕
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Overpayment warning */}
                                {collectTotal > collectRemaining && (
                                    <div className="pkg-overpayment-warning" style={{ marginTop: 12 }}>
                                        ⚠️ Tahsilat toplamı kalan borçtan fazla!
                                    </div>
                                )}

                                {/* Remaining after collection */}
                                {collectTotal > 0 && collectTotal <= collectRemaining && (
                                    <div className="pkg-payment-remaining" style={{ marginTop: 12 }}>
                                        <span className="pkg-payment-remaining-label">Tahsilat Sonrası Kalan</span>
                                        <span className={`pkg-payment-remaining-amount ${collectRemaining - collectTotal <= 0 ? 'zero' : 'debt'}`}>
                                            {formatCurrency(Math.max(0, collectRemaining - collectTotal))}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="pkg-modal-footer">
                                <button className="btn-secondary" onClick={() => setCollectSale(null)}>İptal</button>
                                <button className="btn-primary"
                                    disabled={savingTahsilat || collectTotal <= 0 || collectTotal > collectRemaining}
                                    onClick={saveTahsilat}>
                                    {savingTahsilat ? 'Kaydediliyor...' : 'Tahsilatı Kaydet'}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* ═══════════════ İADE (REFUND) MODAL ═══════════════ */}
            {
                refundSale && (
                    <div className="pkg-modal-overlay" style={{ zIndex: 10001 }} onClick={() => setRefundSale(null)}>
                        <div className="pkg-refund-modal" onClick={e => e.stopPropagation()}>

                            {/* ── Header ── */}
                            <div className="pkg-refund-header">
                                <h2>↩️ İade</h2>
                                <span className="pkg-refund-customer-chip">
                                    {refundSale.customer?.first_name} {refundSale.customer?.last_name || ''}
                                </span>
                                <button className="pkg-modal-close" onClick={() => setRefundSale(null)}>✕</button>
                            </div>

                            {/* ── Two-Column Body ── */}
                            <div className="pkg-refund-columns">

                                {/* LEFT: Scrollable service list */}
                                <div className="pkg-refund-col-left">
                                    <div className="pkg-refund-section-title">İade Edilecek Hizmetler</div>
                                    {refundSelections.length === 0 ? (
                                        <div className="pkg-empty-lines">
                                            <div className="pkg-empty-lines-text">Tüm hizmetler zaten iade edilmiş</div>
                                        </div>
                                    ) : (
                                        <div className="pkg-refund-line-list">
                                            {refundSelections.map((sel, idx) => (
                                                <label key={idx} className={`pkg-refund-line-row ${sel.selected ? 'selected' : ''}`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={sel.selected}
                                                        onChange={e => {
                                                            const upd = [...refundSelections];
                                                            upd[idx] = { ...upd[idx], selected: e.target.checked };
                                                            setRefundSelections(upd);
                                                        }}
                                                    />
                                                    <div className="pkg-refund-line-content">
                                                        <div className="pkg-refund-line-top">
                                                            <span className="pkg-refund-line-name">{sel.name}</span>
                                                            <span className="pkg-refund-line-price">{formatCurrency(sel.unitPrice * sel.remainingQty)}</span>
                                                        </div>
                                                        <div className="pkg-refund-line-bottom">
                                                            <span className="pkg-refund-tag remaining">{sel.totalQty} adet</span>
                                                            {sel.usedQty > 0 && <span className="pkg-refund-tag used">{sel.usedQty} kullanıldı</span>}
                                                            {sel.refundedQty > 0 && <span className="pkg-refund-tag prev">{sel.refundedQty} iade</span>}
                                                            <span className="pkg-refund-tag remaining">{sel.remainingQty} kalan</span>
                                                        </div>
                                                    </div>
                                                    {sel.selected && sel.remainingQty > 1 && (
                                                        <div className="pkg-refund-qty-inline" onClick={e => e.preventDefault()}>
                                                            <input
                                                                type="number"
                                                                min={1}
                                                                max={sel.remainingQty}
                                                                value={sel.refundQty}
                                                                onChange={e => {
                                                                    let val = Math.max(1, Math.min(sel.remainingQty, Number(e.target.value) || 1));
                                                                    const upd = [...refundSelections];
                                                                    upd[idx] = { ...upd[idx], refundQty: val };
                                                                    setRefundSelections(upd);
                                                                }}
                                                            />
                                                            <span>/ {sel.remainingQty}</span>
                                                        </div>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* RIGHT: Sticky summary panel */}
                                <div className="pkg-refund-col-right">
                                    <div className="pkg-refund-sidebar">

                                        {/* Sale stats */}
                                        <div className="pkg-refund-stats-card">
                                            <div className="pkg-refund-stat-item">
                                                <span>Toplam</span>
                                                <span>{formatCurrency(refundSale.total_amount)}</span>
                                            </div>
                                            <div className="pkg-refund-stat-item">
                                                <span>Ödenen</span>
                                                <span className="positive">{formatCurrency(refundSale._paidTotal)}</span>
                                            </div>
                                            {refundSale._refundedTotal > 0 && (
                                                <div className="pkg-refund-stat-item">
                                                    <span>Önceki İade</span>
                                                    <span className="warning">{formatCurrency(refundSale._refundedTotal)}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Warning alert */}
                                        {refundCalc?.hasSelection && !refundCalc?.canRefund && (
                                            <div className="pkg-refund-alert">
                                                <span>⚠️</span>
                                                <span>{refundCalc.blockReason}</span>
                                            </div>
                                        )}

                                        {/* Summary section */}
                                        <div className="pkg-refund-section-title">İade Özeti</div>

                                        {!refundCalc?.hasSelection ? (
                                            <div className="pkg-refund-empty-summary">
                                                <span>↰</span>
                                                <p>İade edilecek hizmetleri sol taraftan seçin</p>
                                            </div>
                                        ) : (
                                            <div className="pkg-refund-totals">
                                                <div className="pkg-refund-totals-row">
                                                    <span>İade Tutarı</span>
                                                    <span>{formatCurrency(refundCalc.refundLineTotal)}</span>
                                                </div>

                                                {refundCalc.earnedToClawback > 0 && (
                                                    <div className="pkg-refund-totals-row sub">
                                                        <span>⭐ Parapuan geri alma</span>
                                                        <span>−{refundCalc.earnedToClawback} puan</span>
                                                    </div>
                                                )}
                                                {refundCalc.parapuanToReturn > 0 && (
                                                    <div className="pkg-refund-totals-row sub green">
                                                        <span>⭐ Parapuan yükleme</span>
                                                        <span>+{refundCalc.parapuanToReturn} puan</span>
                                                    </div>
                                                )}
                                                {refundCalc.unrecoverable > 0 && (
                                                    <div className="pkg-refund-totals-row sub warn">
                                                        <span>⚠️ Bakiye yetersiz</span>
                                                        <span>−{formatCurrency(refundCalc.unrecoverable)}</span>
                                                    </div>
                                                )}

                                                <div className="pkg-refund-totals-row main">
                                                    <span>📦 Nakit/Kart İade</span>
                                                    <span>{formatCurrency(refundCalc.cashRefund)}</span>
                                                </div>

                                                {refundCalc.canRefund && refundCalc.cashRefund > 0 && (
                                                    <div className="pkg-refund-totals-row method">
                                                        <span>İade Yöntemi</span>
                                                        <select value={refundPaymentMethod} onChange={e => setRefundPaymentMethod(e.target.value)}>
                                                            {TAHSILAT_METHODS.map(m => (
                                                                <option key={m.value} value={m.value}>{m.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Action buttons */}
                                        <div className="pkg-refund-actions">
                                            <button className="btn-secondary" onClick={() => setRefundSale(null)}>İptal</button>
                                            <button className="btn-primary pkg-refund-save-btn"
                                                disabled={savingRefund || !refundCalc?.hasSelection || !refundCalc?.canRefund}
                                                onClick={saveRefund}>
                                                {savingRefund ? 'Kaydediliyor...' : '↩️ İadeyi Kaydet'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )
            }

            {/* ═══════════════ EDIT WIZARD MODAL (2 Adım) ═══════════════ */}
            {editSale && editCalc && (
                <div className="pkg-modal-overlay" onClick={closeEdit}>
                    <div className="pkg-modal" onClick={e => e.stopPropagation()}>
                        <div className="pkg-modal-header">
                            <h2>✏️ Satışı Düzenle</h2>
                            <button className="pkg-modal-close" onClick={closeEdit}>✕</button>
                        </div>
                        {/* Step indicator */}
                        <div className="pkg-step-indicator">
                            <div className={`pkg-step ${editStep === 0 ? 'active' : 'completed'}`}
                                onClick={() => editStep > 0 && setEditStep(0)}>
                                <span className="pkg-step-number">{editStep > 0 ? '✓' : '1'}</span>
                                <span className="pkg-step-label">Genel Bilgiler</span>
                            </div>
                            <div className={`pkg-step-line ${editStep > 0 ? 'completed' : ''}`} />
                            <div className={`pkg-step ${editStep === 1 ? 'active' : 'inactive'}`}>
                                <span className="pkg-step-number">2</span>
                                <span className="pkg-step-label">Hizmetler</span>
                            </div>
                        </div>

                        <div className="pkg-modal-body">
                            {/* ── ADIM 0: Genel Bilgiler ── */}
                            {editStep === 0 && (
                                <>
                                    <div className="pkg-general-grid">
                                        <div className="pkg-form-group">
                                            <label>👤 Müşteri</label>
                                            <select value={editInfoCustomerId} disabled style={{ opacity: 0.7, cursor: 'not-allowed' }}>
                                                {customers.map(c => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.first_name} {c.last_name || ''} {c.phone_e164 ? `(${c.phone_e164})` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="pkg-form-group">
                                            <label>📅 Satış Tarihi</label>
                                            <input type="date" value={editInfoDate} onChange={e => setEditInfoDate(e.target.value)} />
                                        </div>
                                        <div className="pkg-form-group">
                                            <label>👤 Satıcı</label>
                                            <select value={editInfoStaff} onChange={e => setEditInfoStaff(e.target.value)}>
                                                <option value="">Personel seçin...</option>
                                                {staffList.map(s => (
                                                    <option key={s.id} value={s.id}>
                                                        {s.first_name} {s.last_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="pkg-general-notes">
                                        <div className="pkg-form-group">
                                            <label>📝 Notlar</label>
                                            <textarea
                                                value={editInfoNotes}
                                                onChange={e => setEditInfoNotes(e.target.value)}
                                                placeholder="Satışla ilgili opsiyonel not yazabilirsiniz..."
                                                rows={2}
                                            />
                                        </div>
                                    </div>
                                    <div className="pkg-general-footer">
                                        <div className="pkg-toggle-row">
                                            <span className="pkg-toggle-label">📅 Son geçerlilik tarihi</span>
                                            <label className="pkg-toggle-switch">
                                                <input type="checkbox" checked={editInfoHasExpiry}
                                                    onChange={e => setEditInfoHasExpiry(e.target.checked)} />
                                                <span className="pkg-toggle-slider" />
                                            </label>
                                        </div>
                                        {editInfoHasExpiry && (
                                            <div className="pkg-form-group" style={{ marginTop: 8 }}>
                                                <input type="date" value={editInfoExpiryDate}
                                                    onChange={e => setEditInfoExpiryDate(e.target.value)} />
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* ── ADIM 1: Hizmetler ── */}
                            {editStep === 1 && (
                                <>
                                    {/* Toolbar */}
                                    <div className="pkg-services-toolbar">
                                        <div className="pkg-services-toolbar-left">
                                            <span className="pkg-services-toolbar-title">📋 Hizmet Satırları</span>
                                            {editCalc.editGenderId && (
                                                <div className="pkg-gender-badge">
                                                    {getGenderIcon(editCalc.editGenderId)} {getGenderLabel(editCalc.editGenderId)}
                                                </div>
                                            )}
                                            <span className="pkg-services-count">{editCalc.activeLines.length} hizmet</span>
                                        </div>
                                        <div className="pkg-services-toolbar-right">
                                            <button className="btn-import-pkg" onClick={() => setShowImport(!showImport)}>
                                                📦 Paketten Seç
                                            </button>
                                            {(() => {
                                                const usedIds = new Set(editServiceLines.map(l => l.service_variant_id).filter(Boolean));
                                                const hasAvailableEdit = editCalc.editFilteredVariants.some(v => !usedIds.has(v.id));
                                                return (
                                                    <button className="btn-add-line"
                                                        onClick={() => {
                                                            if (!hasAvailableEdit) {
                                                                addToast('warning', 'Eklenebilecek hizmet kalmadı. Tüm hizmetler zaten listede.');
                                                                return;
                                                            }
                                                            if (editServiceLines.some(l => l._isNew && !l._removed && !l.service_variant_id)) {
                                                                addToast('warning', 'Önce mevcut satırdaki hizmeti seçin.');
                                                                return;
                                                            }
                                                            setEditServiceLines(prev => [...prev, {
                                                                id: `new-${Date.now()}`,
                                                                service_variant_id: '',
                                                                item_name_snap: '',
                                                                line_kind: 'entitlement_service',
                                                                quantity: 1,
                                                                unit_price: 0,
                                                                price_snap: 0,
                                                                _used: 0,
                                                                _refunded: 0,
                                                                _locked: false,
                                                                _fullyLocked: false,
                                                                _minQty: 1,
                                                                _removed: false,
                                                                _isNew: true,
                                                                _origQty: 0,
                                                                _origPrice: 0,
                                                            }]);
                                                        }}>
                                                        + Yeni Satır
                                                    </button>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    {/* Package import overlay */}
                                    {showImport && (
                                        <div className="pkg-import-overlay" onClick={() => { setShowImport(false); setPackageSearch(''); }}>
                                            <div className="pkg-import-modal" onClick={e => e.stopPropagation()}>
                                                <div className="pkg-import-modal-header">
                                                    <span>📦 Kayıtlı Paket Seç</span>
                                                    <button className="pkg-import-modal-close" onClick={() => { setShowImport(false); setPackageSearch(''); }}>✕</button>
                                                </div>
                                                <div className="pkg-import-search">
                                                    <input placeholder="Paket ara..." value={packageSearch}
                                                        onChange={e => setPackageSearch(e.target.value)} autoFocus />
                                                </div>
                                                <div className="pkg-import-modal-body">
                                                    {(() => {
                                                        const filtered = packageGroups
                                                            .filter(g => !editCalc.editGenderId || g.gender_id === editCalc.editGenderId)
                                                            .filter(g => !packageSearch || g.title.toLowerCase().includes(packageSearch.toLowerCase()));
                                                        if (filtered.length === 0) return (
                                                            <div className="pkg-empty-state">{packageSearch ? 'Eşleşen paket bulunamadı' : 'Kayıtlı paket bulunamadı'}</div>
                                                        );
                                                        return filtered.map(g => {
                                                            const gPkgs = packages.filter(p => p.group_id === g.id);
                                                            const total = gPkgs.reduce((s, p) => s + Number(p.price_amount || 0), 0);
                                                            return (
                                                                <div key={g.id} className="pkg-import-item"
                                                                    onClick={() => {
                                                                        const usedIds = new Set(editServiceLines.map(l => l.service_variant_id).filter(Boolean));
                                                                        const newLines = gPkgs
                                                                            .filter(p => !usedIds.has(p.service_variant_id))
                                                                            .map(p => {
                                                                                const variant = findVariantById(p.service_variant_id);
                                                                                return {
                                                                                    id: `new-${Date.now()}-${Math.random()}`,
                                                                                    service_variant_id: p.service_variant_id,
                                                                                    item_name_snap: variant ? getVariantDisplayName(variant) : p.item_name_snap || '',
                                                                                    line_kind: 'entitlement_service',
                                                                                    quantity: Number(p.quantity) || 1,
                                                                                    unit_price: Number(p.price_amount) || 0,
                                                                                    price_snap: Number(variant?.price_amount) || 0,
                                                                                    _used: 0, _refunded: 0, _locked: false, _minQty: 1,
                                                                                    _removed: false, _isNew: true, _origQty: 0, _origPrice: 0,
                                                                                };
                                                                            });
                                                                        if (newLines.length === 0) {
                                                                            addToast('warning', 'Bu paketteki tüm hizmetler zaten ekli.');
                                                                            setShowImport(false);
                                                                            setPackageSearch('');
                                                                            return;
                                                                        }
                                                                        setEditServiceLines(prev => [...prev, ...newLines]);
                                                                        setShowImport(false);
                                                                        setPackageSearch('');
                                                                    }}>
                                                                    <div className="pkg-import-item-info">
                                                                        <div className="pkg-import-item-title">
                                                                            {getGenderIcon(g.gender_id)} {g.title}
                                                                        </div>
                                                                        <div className="pkg-import-item-meta">
                                                                            {gPkgs.length} hizmet
                                                                        </div>
                                                                    </div>
                                                                    <div className="pkg-import-item-price">
                                                                        {formatCurrency(total)}
                                                                    </div>
                                                                </div>
                                                            );
                                                        });
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Refund/usage info box */}
                                    {(() => {
                                        const totalRefunded = editServiceLines.reduce((s, l) => s + (l._refunded || 0), 0);
                                        const totalUsed = editServiceLines.reduce((s, l) => s + (l._used || 0), 0);
                                        const refundedAmount = editServiceLines
                                            .filter(l => l._refunded > 0)
                                            .reduce((s, l) => s + l._refunded * Number(l.unit_price), 0);
                                        if (totalRefunded === 0 && totalUsed === 0) return null;
                                        return (
                                            <div className="pkg-edit-info-box">
                                                {totalRefunded > 0 && (
                                                    <div className="pkg-edit-info-item refund">
                                                        <span>↩️ {totalRefunded} hizmet iade edildi</span>
                                                        <span className="pkg-edit-info-amount">{formatCurrency(refundedAmount)}</span>
                                                    </div>
                                                )}
                                                {totalUsed > 0 && (
                                                    <div className="pkg-edit-info-item usage">
                                                        <span>✅ {totalUsed} hizmet kullanıldı</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {/* Service lines table */}
                                    {editServiceLines.length > 0 && (
                                        <div className="pkg-lines-table">
                                            <div className="pkg-lines-table-header">
                                                <span className="pkg-col-service">Hizmet</span>
                                                <span className="pkg-col-qty">Adet</span>
                                                <span className="pkg-col-price">Liste ₺</span>
                                                <span className="pkg-col-price">Satış ₺</span>
                                                <span className="pkg-col-action"></span>
                                            </div>
                                            {editServiceLines.map((line, idx) => {
                                                const hasDiscount = Number(line.price_snap) > 0 && Number(line.unit_price) < Number(line.price_snap);
                                                const isRefunded = line._refunded > 0;
                                                const isUsed = line._used > 0;
                                                const isLocked = isUsed || isRefunded;
                                                const committed = (line._used || 0) + (line._refunded || 0);
                                                const isFullyCommitted = isLocked && Number(line.quantity) <= committed;
                                                return (
                                                    <div key={line.id || `new-${idx}`}
                                                        className={`pkg-line-row ${line._removed ? 'pkg-line-removed' : ''} ${isFullyCommitted ? (isRefunded ? 'pkg-line-refunded' : 'pkg-line-locked') : isLocked ? 'pkg-line-locked' : ''}`}
                                                    >
                                                        <div className="pkg-col-service">
                                                            {line._isNew ? (
                                                                <select value={line.service_variant_id}
                                                                    onChange={e => {
                                                                        const variantId = e.target.value;
                                                                        const variant = findVariantById(variantId);
                                                                        setEditServiceLines(prev => prev.map((l, i) => i === idx ? {
                                                                            ...l,
                                                                            service_variant_id: variantId,
                                                                            item_name_snap: variant ? getVariantDisplayName(variant) : '',
                                                                            price_snap: Number(variant?.price_amount) || 0,
                                                                            unit_price: Number(variant?.price_amount) || 0,
                                                                        } : l));
                                                                    }}>
                                                                    <option value="">Hizmet seçin...</option>
                                                                    {editCalc.editFilteredVariants.filter(v => v.id === line.service_variant_id || !editServiceLines.some(l => l !== line && l.service_variant_id === v.id)).map(v => (
                                                                        <option key={v.id} value={v.id}>
                                                                            {getVariantDisplayName(v)}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            ) : (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                                                    {isLocked && <span>🔒</span>}
                                                                    <span>{line.item_name_snap}</span>
                                                                    {isUsed && <span className="pkg-edit-tag used">✅ {line._used} kullanıldı</span>}
                                                                    {isRefunded && <span className="pkg-edit-tag refunded">↩️ {line._refunded} iade</span>}
                                                                    {!isFullyCommitted && isLocked && <span className="pkg-edit-tag" style={{ background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.25)' }}>🔓 {Number(line.quantity) - committed} serbest</span>}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="pkg-col-qty">
                                                            <input type="number"
                                                                min={line._minQty || 1}
                                                                value={line.quantity}
                                                                disabled={line._removed}
                                                                onChange={e => {
                                                                    const val = Math.max(Number(e.target.value) || 1, line._minQty || 1);
                                                                    setEditServiceLines(prev => prev.map((l, i) => i === idx ? { ...l, quantity: val } : l));
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="pkg-col-price">
                                                            <input type="number" value={line.price_snap} readOnly className="pkg-readonly-input" />
                                                        </div>
                                                        <div className="pkg-col-price">
                                                            <div className="pkg-price-cell">
                                                                <input type="number" min={0}
                                                                    max={line.price_snap > 0 ? line.price_snap : undefined}
                                                                    value={line.unit_price}
                                                                    disabled={line._removed || isLocked}
                                                                    className={hasDiscount ? 'pkg-discount-price' : ''}
                                                                    onChange={e => {
                                                                        let val = Number(e.target.value) || 0;
                                                                        const snap = Number(line.price_snap) || 0;
                                                                        if (snap > 0 && val > snap) val = snap;
                                                                        setEditServiceLines(prev => prev.map((l, i) => i === idx ? { ...l, unit_price: val } : l));
                                                                    }}
                                                                />
                                                                {hasDiscount && (
                                                                    <span className="pkg-line-discount-badge">
                                                                        %{Math.round((1 - Number(line.unit_price) / Number(line.price_snap)) * 100)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="pkg-col-action">
                                                            {!isLocked && (
                                                                <button className="pkg-line-remove-btn"
                                                                    title={line._removed ? 'Geri al' : 'Satırı sil'}
                                                                    style={line._removed ? { color: '#4ade80' } : {}}
                                                                    onClick={() => {
                                                                        if (line._isNew && !line._removed) {
                                                                            setEditServiceLines(prev => prev.filter((_, i) => i !== idx));
                                                                        } else {
                                                                            setEditServiceLines(prev => prev.map((l, i) => i === idx ? { ...l, _removed: !l._removed } : l));
                                                                        }
                                                                    }}
                                                                >
                                                                    {line._removed ? '↩️' : '✕'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Summary — same format as create wizard */}
                                    <div className="pkg-summary" style={{ marginTop: 16 }}>
                                        <div className="pkg-summary-row">
                                            <span>Mevcut Toplam</span>
                                            <span>{formatCurrency(Number(editSale.total_amount))}</span>
                                        </div>
                                        <div className="pkg-summary-row">
                                            <span>Ara Toplam</span>
                                            <span>{formatCurrency(editCalc.editSubtotal)}</span>
                                        </div>
                                        {editCalc.editLineDiscount > 0 && (
                                            <div className="pkg-summary-row discount">
                                                <span>Satır İndirimi</span>
                                                <span>-{formatCurrency(editCalc.editLineDiscount)}</span>
                                            </div>
                                        )}
                                        {editCalc.editExtraDiscountAmt > 0 && (
                                            <div className="pkg-summary-row discount">
                                                <span>{editCalc.editExtraLabel}</span>
                                                <span>-{formatCurrency(editCalc.editExtraDiscountAmt)}</span>
                                            </div>
                                        )}
                                        <div className="pkg-summary-row total">
                                            <span>Yeni Toplam</span>
                                            <span>{formatCurrency(editCalc.editFinalTotal)}</span>
                                        </div>
                                        <div className="pkg-summary-row">
                                            <span>Ödenen</span>
                                            <span style={{ color: '#4ade80' }}>{formatCurrency(editSale._netPaid || 0)}</span>
                                        </div>
                                    </div>
                                    {editCalc.editFinalTotal < (editSale._netPaid || 0) && (
                                        <div className="pkg-edit-warning">
                                            ⚠️ Yeni toplam ({formatCurrency(editCalc.editFinalTotal)}) ödenen tutardan ({formatCurrency(editSale._netPaid)}) düşük olamaz. Önce iade yapın.
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="pkg-modal-footer">
                            {confirmDeleteSale ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 12 }}>
                                    <div style={{ fontSize: '0.85rem', color: '#f87171', fontWeight: 600 }}>
                                        ⚠️ Tüm hizmetler çıkarıldı. Bu satış tamamen silinecek!
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                        <button className="btn-secondary" onClick={() => setConfirmDeleteSale(false)}>Vazgeç</button>
                                        <button style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
                                            disabled={savingEdit}
                                            onClick={() => saveEdit(true)}>
                                            {savingEdit ? 'Siliniyor...' : '🗑️ Evet, Sil'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <button className="btn-secondary" onClick={closeEdit}>İptal</button>
                                    {editStep === 0 ? (
                                        <button className="btn-primary" onClick={() => setEditStep(1)}>
                                            İleri →
                                        </button>
                                    ) : (
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button className="btn-secondary" onClick={() => setEditStep(0)}>
                                                ← Geri
                                            </button>
                                            <button className="btn-primary" disabled={
                                                savingEdit ||
                                                editServiceLines.filter(l => !l._removed).some(l => !l.service_variant_id) ||
                                                editCalc.editFinalTotal < (editSale._netPaid || 0)
                                            } onClick={() => saveEdit()}>
                                                {savingEdit ? 'Kaydediliyor...' : '💾 Kaydet'}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════ EDIT PAYMENTS MODAL ═══════════════ */}
            {
                editPaymentsSale && (() => {
                    const activePayments = editPaymentLines.filter(p => !p._removed);
                    const editPayTotal = activePayments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
                    const saleTotal = Number(editPaymentsSale.total_amount);
                    const refundedTotal = editPaymentsSale._refundedTotal || 0;
                    const effectiveTotal = saleTotal - refundedTotal;
                    const netPaid = editPayTotal - refundedTotal;
                    const remaining = Math.max(0, effectiveTotal - netPaid);
                    const hasRemovals = editPaymentLines.some(p => p._removed);
                    const belowRefund = hasRemovals && editPayTotal < refundedTotal;
                    const methodLabel = (m) => TAHSILAT_METHODS.find(t => t.value === m)?.label || m;
                    const removedLines = editPaymentLines.filter(p => p._removed);
                    const lostPoints = removedLines.reduce((s, p) => s + (p._earnedPoints || 0), 0);
                    return (
                        <div className="pkg-modal-overlay" onClick={() => setEditPaymentsSale(null)}>
                            <div className="pkg-modal" style={{ maxWidth: 620 }} onClick={e => e.stopPropagation()}>
                                <div className="pkg-modal-header">
                                    <h2>📜 Tahsilat Geçmişi</h2>
                                    <button className="pkg-modal-close" onClick={() => setEditPaymentsSale(null)}>✕</button>
                                </div>
                                <div className="pkg-modal-body" style={{ padding: '24px' }}>

                                    {/* ── Summary Cards ── */}
                                    <div style={{ display: 'grid', gridTemplateColumns: refundedTotal > 0 ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
                                        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 6, letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 500 }}>Satış</div>
                                            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#e2e8f0' }}>{formatCurrency(saleTotal)}</div>
                                        </div>
                                        {refundedTotal > 0 && (
                                            <div style={{ background: 'rgba(249,115,22,0.08)', borderRadius: 12, padding: '16px', textAlign: 'center', border: '1px solid rgba(249,115,22,0.15)' }}>
                                                <div style={{ fontSize: '0.75rem', color: '#f97316', marginBottom: 6, letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 500 }}>İade</div>
                                                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fb923c' }}>−{formatCurrency(refundedTotal)}</div>
                                            </div>
                                        )}
                                        <div style={{ background: 'rgba(74,222,128,0.06)', borderRadius: 12, padding: '16px', textAlign: 'center', border: '1px solid rgba(74,222,128,0.12)' }}>
                                            <div style={{ fontSize: '0.75rem', color: '#4ade80', marginBottom: 6, letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 500 }}>Ödenen</div>
                                            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#4ade80' }}>{formatCurrency(Math.max(0, netPaid))}</div>
                                        </div>
                                        <div style={{ background: remaining > 0 ? 'rgba(239,68,68,0.08)' : 'rgba(74,222,128,0.06)', borderRadius: 12, padding: '16px', textAlign: 'center', border: remaining > 0 ? '1px solid rgba(239,68,68,0.15)' : '1px solid rgba(74,222,128,0.12)' }}>
                                            <div style={{ fontSize: '0.75rem', color: remaining > 0 ? '#ef4444' : '#4ade80', marginBottom: 6, letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 500 }}>Kalan</div>
                                            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: remaining > 0 ? '#f87171' : '#4ade80' }}>{formatCurrency(remaining)}</div>
                                        </div>
                                    </div>

                                    {/* ── Section Title ── */}
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ fontSize: 16 }}>📦</span>
                                        <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ödeme Kayıtları</span>
                                        <span style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 10px', borderRadius: 10, fontSize: '0.75rem', fontWeight: 600 }}>{activePayments.length}</span>
                                    </div>

                                    {/* ── Payment List ── */}
                                    {editPaymentLines.length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {editPaymentLines.map((pay, idx) => {
                                                const isLocked = !pay._isToday;
                                                return (
                                                    <div key={pay.id || `pay-${idx}`}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: 12,
                                                            padding: '14px 16px', borderRadius: 12,
                                                            background: pay._removed ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.03)',
                                                            border: pay._removed ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(255,255,255,0.06)',
                                                            opacity: (isLocked && !pay._removed) ? 0.5 : 1,
                                                            transition: 'all 0.2s ease',
                                                        }}
                                                    >
                                                        {/* Method + Type */}
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{ fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 600, textDecoration: pay._removed ? 'line-through' : 'none' }}>
                                                                {methodLabel(pay.method)}
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                                                                {pay.is_initial
                                                                    ? <span style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', padding: '2px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 600 }}>📦 Paket</span>
                                                                    : <span style={{ background: 'rgba(74,222,128,0.1)', color: '#86efac', padding: '2px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 600 }}>💰 Tahsilat</span>
                                                                }
                                                                {pay._earnedPoints > 0 && (
                                                                    <span style={{ background: 'rgba(250,204,21,0.1)', color: '#fbbf24', padding: '2px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 600 }}>
                                                                        ⭐ {pay._earnedPoints} puan
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {/* Date */}
                                                        <div style={{ fontSize: '0.78rem', color: '#64748b', minWidth: 76, textAlign: 'center' }}>
                                                            {pay.paid_at ? new Date(pay.paid_at).toLocaleDateString('tr-TR') : '—'}
                                                        </div>
                                                        {/* Amount */}
                                                        <div style={{ fontSize: '1rem', fontWeight: 700, color: pay._removed ? '#ef4444' : '#e2e8f0', minWidth: 90, textAlign: 'right', textDecoration: pay._removed ? 'line-through' : 'none' }}>
                                                            {formatCurrency(Number(pay.amount) || 0)}
                                                        </div>
                                                        {/* Action */}
                                                        <div style={{ width: 36, textAlign: 'center', flexShrink: 0 }}>
                                                            {isLocked ? (
                                                                <span style={{ fontSize: 15, opacity: 0.35 }} title="Kullanılmış/iade edilmiş hizmet silinemez">🔒</span>
                                                            ) : (
                                                                <button
                                                                    style={{ background: pay._removed ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)', border: 'none', cursor: 'pointer', fontSize: 15, padding: '4px 6px', borderRadius: 6, transition: 'all 0.15s ease' }}
                                                                    title={pay._removed ? 'Geri al' : 'Sil'}
                                                                    onClick={() => setEditPaymentLines(prev => prev.map((p, i) => i === idx ? { ...p, _removed: !p._removed } : p))}
                                                                >
                                                                    {pay._removed ? '↩️' : '🗑️'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '32px 0', color: '#475569', fontSize: '0.9rem' }}>
                                            Henüz ödeme kaydı bulunmuyor.
                                        </div>
                                    )}

                                    {/* ── Warnings ── */}
                                    {hasRemovals && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
                                            {/* Parapuan loss warning — only when not blocked by refund protection */}
                                            {lostPoints > 0 && !belowRefund && (
                                                <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(250,204,21,0.08)', border: '1px solid rgba(250,204,21,0.2)', color: '#fbbf24', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <span style={{ fontSize: 18 }}>⭐</span>
                                                    <div>
                                                        <div style={{ fontWeight: 600 }}>Parapuan Kaybı</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#d4a017', marginTop: 2 }}>
                                                            Silinecek ödemelerle birlikte <strong>{lostPoints} Parapuan</strong> da geri alınacaktır.
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Refund protection warning */}
                                            {belowRefund && (
                                                <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <span style={{ fontSize: 18 }}>⚠️</span>
                                                    <div>
                                                        <div style={{ fontWeight: 600 }}>İade Koruması</div>
                                                        <div style={{ fontSize: '0.8rem', marginTop: 2 }}>
                                                            Silme sonrası toplam ({formatCurrency(editPayTotal)}) iade tutarının ({formatCurrency(refundedTotal)}) altına düşemez!
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="pkg-modal-footer">
                                    <button className="btn-secondary" onClick={() => setEditPaymentsSale(null)}>Kapat</button>
                                    {hasRemovals && (
                                        <button className="btn-primary" disabled={savingEditPayments || belowRefund} onClick={saveEditPayments}>
                                            {savingEditPayments ? 'Kaydediliyor...' : '🗑️ Seçilenleri Sil'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })()
            }

            {confirmDeleteSaleData && (
                <div className="pkg-overlay" onClick={() => setConfirmDeleteSaleData(null)}>
                    <div className="pkg-modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
                        <div className="pkg-modal-header">
                            <h3>⚠️ Satış Silinecek</h3>
                            <button className="pkg-modal-close" onClick={() => setConfirmDeleteSaleData(null)}>✕</button>
                        </div>
                        <div className="pkg-modal-body" style={{ padding: '24px', textAlign: 'center' }}>
                            <p style={{ margin: 0, fontSize: '0.95rem' }}>
                                Bu satış ve tüm ilişkili kayıtları (hizmet satırları, muhasebe kayıtları) tamamen silinecek.
                            </p>
                            <p style={{ margin: '12px 0 0', fontSize: '0.85rem', color: '#f87171', fontWeight: 600 }}>
                                Bu işlem geri alınamaz!
                            </p>
                        </div>
                        <div className="pkg-modal-footer">
                            <button className="btn-secondary" onClick={() => setConfirmDeleteSaleData(null)}>Vazgeç</button>
                            <button style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
                                onClick={executeDeleteSale}>
                                🗑️ Evet, Sil
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </div >
    );
}
