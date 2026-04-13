import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase, supabaseUrl } from '../config/supabase';
import './BranchSettings.css';

const SUPABASE_URL = supabaseUrl;

const TABS = [
    { id: 'general', label: '📌 Genel', title: 'Genel Bilgiler' },
    { id: 'contact', label: '📞 İletişim', title: 'İletişim Bilgileri' },
    { id: 'address', label: '📍 Adres', title: 'Adres Bilgileri' },
    { id: 'region', label: '🌍 Bölge', title: 'Bölge & Para Birimi' },
    { id: 'tax', label: '🧾 Mali', title: 'Mali Bilgiler' },
];

export default function BranchSettings() {
    const { tenantUser } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [logoPreview, setLogoPreview] = useState(null);
    const logoInputRef = useRef(null);

    const [branch, setBranch] = useState(null);

    // Lookup data
    const [categories, setCategories] = useState([]);
    const [genders, setGenders] = useState([]);
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [timezones, setTimezones] = useState([]);
    const [currencies, setCurrencies] = useState([]);

    // Form fields
    const [form, setForm] = useState({
        brand_name: '', branch_name: '', category_id: '', target_gender_id: '', description: '',
        phone: '', email: '', website_url: '', instagram_url: '', google_reviews_url: '',
        country_id: '', city_id: '', district_id: '', address_line: '', postal_code: '',
        timezone_id: '', currency_id: '',
        tax_title: '', tax_number: '', tax_office: '', tax_address: '',
        vat_default: '', vat_service_default: '', vat_product_default: '',
    });

    useEffect(() => {
        if (tenantUser?.tenant_id) {
            loadAll();
        }
    }, [tenantUser]);

    const loadAll = async () => {
        try {
            // Lookup ve branch verisini paralel yükle
            const [branchRes, catRes, genRes, cntRes, tzRes, curRes] = await Promise.all([
                supabase.from('branches').select('*').eq('tenant_id', tenantUser.tenant_id).limit(1).single(),
                supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
                supabase.from('genders').select('*').eq('is_active', true).order('sort_order'),
                supabase.from('countries').select('*').order('name'),
                supabase.from('timezones').select('*').order('label'),
                supabase.from('currencies').select('*').order('code'),
            ]);

            setCategories(catRes.data || []);
            setGenders(genRes.data || []);
            setCountries(cntRes.data || []);
            setTimezones(tzRes.data || []);
            setCurrencies(curRes.data || []);

            if (branchRes.error) {
                console.error('Branch load error:', branchRes.error);
                setError('Şube bilgileri yüklenemedi.');
            } else if (branchRes.data) {
                const d = branchRes.data;
                setBranch(d);
                setLogoPreview(d.logo_url || null);
                setForm({
                    brand_name: d.brand_name || '', branch_name: d.branch_name || '',
                    category_id: d.category_id || '', target_gender_id: d.target_gender_id || '',
                    description: d.description || '', logo_url: d.logo_url || '',
                    phone: d.phone || '', email: d.email || '',
                    website_url: d.website_url || '', instagram_url: d.instagram_url || '',
                    google_reviews_url: d.google_reviews_url || '',
                    country_id: d.country_id || '', city_id: d.city_id || '',
                    district_id: d.district_id || '', address_line: d.address_line || '',
                    postal_code: d.postal_code || '',
                    timezone_id: d.timezone_id || '', currency_id: d.currency_id || '',
                    tax_title: d.tax_title || '', tax_number: d.tax_number || '',
                    tax_office: d.tax_office || '', tax_address: d.tax_address || '',
                    vat_default: d.vat_default ?? '', vat_service_default: d.vat_service_default ?? '',
                    vat_product_default: d.vat_product_default ?? '',
                });

                // Şehir ve ilçe verilerini yükle (eğer branch'te seçili ise)
                if (d.country_id) {
                    const { data: citiesData } = await supabase.from('cities').select('*').eq('country_id', d.country_id).order('name');
                    setCities(citiesData || []);
                }
                if (d.city_id) {
                    const { data: districtsData } = await supabase.from('districts').select('*').eq('city_id', d.city_id).order('name');
                    setDistricts(districtsData || []);
                }
            }
        } catch (err) {
            console.error('loadAll error:', err);
            setError('Veriler yüklenirken hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    // Ülke değişince şehirleri yükle
    const handleCountryChange = async (countryId) => {
        handleChange('country_id', countryId);
        setCities([]);
        setDistricts([]);
        if (countryId) {
            const { data } = await supabase.from('cities').select('*').eq('country_id', countryId).order('name');
            setCities(data || []);
        }
    };

    // Şehir değişince ilçeleri yükle
    const handleCityChange = async (cityId) => {
        handleChange('city_id', cityId);
        setDistricts([]);
        if (cityId) {
            const { data } = await supabase.from('districts').select('*').eq('city_id', cityId).order('name');
            setDistricts(data || []);
        }
    };

    const handleChange = (field, value) => {
        setForm((prev) => {
            const next = { ...prev, [field]: value };
            if (field === 'country_id') { next.city_id = ''; next.district_id = ''; }
            if (field === 'city_id') { next.district_id = ''; }
            return next;
        });
    };

    // ─── Logo Upload ───
    const handleLogoUpload = async (file) => {
        if (!file || !branch) return;
        if (file.size > 2 * 1024 * 1024) { setError('Logo dosyası 2MB\'dan küçük olmalı'); return; }
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(file.type)) {
            setError('Geçersiz dosya tipi. JPEG, PNG, WebP veya SVG kullanın'); return;
        }

        setUploading(true);
        setError('');
        try {
            const ext = file.name.split('.').pop();
            const path = `${branch.tenant_id}/${branch.id}/logo.${ext}`;

            const { error: upErr } = await supabase.storage.from('logos').upload(path, file, { upsert: true });
            if (upErr) throw upErr;

            const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/logos/${path}`;
            await supabase.from('branches').update({ logo_url: publicUrl }).eq('id', branch.id);

            setLogoPreview(publicUrl);
            handleChange('logo_url', publicUrl);
            setSuccess('Logo başarıyla yüklendi!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error(err);
            setError('Logo yüklenirken hata oluştu');
        } finally {
            setUploading(false);
        }
    };

    const handleLogoRemove = async () => {
        if (!branch) return;
        setUploading(true);
        try {
            // Remove all files in tenant/branch path
            const { data: files } = await supabase.storage.from('logos').list(`${branch.tenant_id}/${branch.id}`);
            if (files?.length > 0) {
                await supabase.storage.from('logos').remove(files.map(f => `${branch.tenant_id}/${branch.id}/${f.name}`));
            }
            await supabase.from('branches').update({ logo_url: null }).eq('id', branch.id);
            setLogoPreview(null);
            handleChange('logo_url', '');
            setSuccess('Logo kaldırıldı');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Logo kaldırılırken hata oluştu');
        } finally {
            setUploading(false);
        }
    };

    const handleLogoDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer?.files?.[0];
        if (file) handleLogoUpload(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        try {
            const payload = {};
            for (const [key, val] of Object.entries(form)) {
                payload[key] = val === '' ? null : val;
            }

            const { error: updateError } = await supabase
                .from('branches')
                .update(payload)
                .eq('id', branch.id);

            if (updateError) {
                setError('Güncelleme başarısız: ' + updateError.message);
            } else {
                setSuccess('Şube bilgileri başarıyla güncellendi!');
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            setError('Bir hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-screen" style={{ minHeight: 'auto', padding: '80px 0' }}>
                <div className="loading-spinner" />
                <p>Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="branch-settings">
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate('/settings')}>← Ayarlara Dön</button>
                <h1>🏢 Temel Bilgiler</h1>
                <p className="text-muted">Şubenizin genel bilgilerini düzenleyin</p>
            </div>

            {/* Tab Bar */}
            <div className="tab-bar">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'tab-btn--active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="branch-form">
                {error && <div className="alert alert-error">⚠️ {error}</div>}
                {success && <div className="alert alert-success">✅ {success}</div>}

                {/* Genel Bilgiler */}
                {activeTab === 'general' && (
                    <section className="form-section">
                        <h2 className="form-section-title">{TABS[0].title}</h2>

                        {/* Logo Upload */}
                        <div className="logo-upload-area">
                            <label className="logo-upload-label">Şube Logosu</label>
                            <div
                                className={`logo-dropzone ${uploading ? 'logo-dropzone--uploading' : ''}`}
                                onDrop={handleLogoDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => logoInputRef.current?.click()}
                            >
                                {logoPreview ? (
                                    <div className="logo-preview">
                                        <img src={logoPreview} alt="Logo" />
                                        <div className="logo-overlay">
                                            <span>Değiştirmek için tıkla</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="logo-placeholder">
                                        <span className="logo-placeholder-icon">🖼️</span>
                                        <span className="logo-placeholder-text">{uploading ? 'Yükleniyor...' : 'Logo yükle'}</span>
                                        <span className="logo-placeholder-hint">Sürükle veya tıkla • Max 2MB</span>
                                    </div>
                                )}
                            </div>
                            <input
                                ref={logoInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                                style={{ display: 'none' }}
                                onChange={(e) => { handleLogoUpload(e.target.files[0]); e.target.value = ''; }}
                            />
                            {logoPreview && (
                                <button type="button" className="logo-remove-btn" onClick={(e) => { e.stopPropagation(); handleLogoRemove(); }} disabled={uploading}>
                                    🗑️ Logoyu Kaldır
                                </button>
                            )}
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Marka Adı</label>
                                <input type="text" className="form-input" value={form.brand_name} onChange={(e) => handleChange('brand_name', e.target.value)} placeholder="Marka adınız" />
                            </div>
                            <div className="form-group">
                                <label>Şube Adı</label>
                                <input type="text" className="form-input" value={form.branch_name} onChange={(e) => handleChange('branch_name', e.target.value)} placeholder="Şube adı" />
                            </div>
                            <div className="form-group">
                                <label>Kategori</label>
                                <select className="form-input" value={form.category_id} onChange={(e) => handleChange('category_id', e.target.value)}>
                                    <option value="">Seçiniz</option>
                                    {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Hedef Cinsiyet</label>
                                <select className="form-input" value={form.target_gender_id} onChange={(e) => handleChange('target_gender_id', e.target.value)}>
                                    <option value="">Seçiniz</option>
                                    {genders.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
                                </select>
                            </div>
                            <div className="form-group form-group--full">
                                <label>Açıklama</label>
                                <textarea className="form-input form-textarea" value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Şubeniz hakkında kısa bir açıklama..." rows={3} />
                            </div>
                        </div>
                    </section>
                )}

                {/* İletişim */}
                {activeTab === 'contact' && (
                    <section className="form-section">
                        <h2 className="form-section-title">{TABS[1].title}</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Telefon</label>
                                <input type="tel" className="form-input" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="05XX XXX XX XX" />
                            </div>
                            <div className="form-group">
                                <label>E-posta</label>
                                <input type="email" className="form-input" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="salon@email.com" />
                            </div>
                            <div className="form-group">
                                <label>Website</label>
                                <input type="url" className="form-input" value={form.website_url} onChange={(e) => handleChange('website_url', e.target.value)} placeholder="https://..." />
                            </div>
                            <div className="form-group">
                                <label>Instagram</label>
                                <input type="url" className="form-input" value={form.instagram_url} onChange={(e) => handleChange('instagram_url', e.target.value)} placeholder="https://instagram.com/..." />
                            </div>
                            <div className="form-group form-group--full">
                                <label>Google Reviews</label>
                                <input type="url" className="form-input" value={form.google_reviews_url} onChange={(e) => handleChange('google_reviews_url', e.target.value)} placeholder="https://..." />
                            </div>
                        </div>
                    </section>
                )}

                {/* Adres */}
                {activeTab === 'address' && (
                    <section className="form-section">
                        <h2 className="form-section-title">{TABS[2].title}</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Ülke</label>
                                <select className="form-input" value={form.country_id} onChange={(e) => handleCountryChange(e.target.value)}>
                                    <option value="">Seçiniz</option>
                                    {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Şehir</label>
                                <select className="form-input" value={form.city_id} onChange={(e) => handleCityChange(e.target.value)} disabled={!form.country_id}>
                                    <option value="">{form.country_id ? 'Seçiniz' : 'Önce ülke seçin'}</option>
                                    {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>İlçe</label>
                                <select className="form-input" value={form.district_id} onChange={(e) => handleChange('district_id', e.target.value)} disabled={!form.city_id}>
                                    <option value="">{form.city_id ? 'Seçiniz' : 'Önce şehir seçin'}</option>
                                    {districts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Posta Kodu</label>
                                <input type="text" className="form-input" value={form.postal_code} onChange={(e) => handleChange('postal_code', e.target.value)} placeholder="34000" />
                            </div>
                            <div className="form-group form-group--full">
                                <label>Açık Adres</label>
                                <textarea className="form-input form-textarea" value={form.address_line} onChange={(e) => handleChange('address_line', e.target.value)} placeholder="Sokak, mahalle, bina no..." rows={2} />
                            </div>
                        </div>
                    </section>
                )}

                {/* Bölge & Para */}
                {activeTab === 'region' && (
                    <section className="form-section">
                        <h2 className="form-section-title">{TABS[3].title}</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Saat Dilimi</label>
                                <select className="form-input" value={form.timezone_id} onChange={(e) => handleChange('timezone_id', e.target.value)}>
                                    <option value="">Seçiniz</option>
                                    {timezones.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Para Birimi</label>
                                <select className="form-input" value={form.currency_id} onChange={(e) => handleChange('currency_id', e.target.value)}>
                                    <option value="">Seçiniz</option>
                                    {currencies.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.label}</option>)}
                                </select>
                            </div>
                        </div>
                    </section>
                )}

                {/* Mali */}
                {activeTab === 'tax' && (
                    <section className="form-section">
                        <h2 className="form-section-title">{TABS[4].title}</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Vergi Unvanı</label>
                                <input type="text" className="form-input" value={form.tax_title} onChange={(e) => handleChange('tax_title', e.target.value)} placeholder="Şirket unvanı" />
                            </div>
                            <div className="form-group">
                                <label>Vergi Numarası</label>
                                <input type="text" className="form-input" value={form.tax_number} onChange={(e) => handleChange('tax_number', e.target.value)} placeholder="Vergi no" />
                            </div>
                            <div className="form-group">
                                <label>Vergi Dairesi</label>
                                <input type="text" className="form-input" value={form.tax_office} onChange={(e) => handleChange('tax_office', e.target.value)} placeholder="Vergi dairesi adı" />
                            </div>
                            <div className="form-group">
                                <label>KDV Oranı (%)</label>
                                <input type="number" className="form-input" value={form.vat_default} onChange={(e) => handleChange('vat_default', e.target.value)} placeholder="20" step="0.01" />
                            </div>
                            <div className="form-group">
                                <label>Hizmet KDV (%)</label>
                                <input type="number" className="form-input" value={form.vat_service_default} onChange={(e) => handleChange('vat_service_default', e.target.value)} placeholder="20" step="0.01" />
                            </div>
                            <div className="form-group">
                                <label>Ürün KDV (%)</label>
                                <input type="number" className="form-input" value={form.vat_product_default} onChange={(e) => handleChange('vat_product_default', e.target.value)} placeholder="20" step="0.01" />
                            </div>
                            <div className="form-group form-group--full">
                                <label>Vergi Adresi</label>
                                <textarea className="form-input form-textarea" value={form.tax_address} onChange={(e) => handleChange('tax_address', e.target.value)} placeholder="Fatura adresi" rows={2} />
                            </div>
                        </div>
                    </section>
                )}

                {/* Submit */}
                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/settings')}>İptal</button>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? 'Kaydediliyor...' : '💾 Değişiklikleri Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
}
