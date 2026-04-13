import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [brandName, setBrandName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [terms, setTerms] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validasyonlar
        if (!firstName || !lastName || !phone || !email || !password || !confirmPassword || !brandName) {
            setError('Tüm zorunlu alanları doldurun.');
            return;
        }

        if (password.length < 6) {
            setError('Şifre en az 6 karakter olmalıdır.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Şifreler eşleşmiyor.');
            return;
        }

        if (!terms) {
            setError('Kullanım koşullarını kabul etmeniz gerekiyor.');
            return;
        }

        setLoading(true);

        const { data, error: signUpError } = await signUp(email, password, {
            firstName,
            lastName,
            phone,
            brandName,
        });

        if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
            return;
        }

        // Supabase email doğrulama gerektirebilir
        if (data?.user?.identities?.length === 0) {
            setError('Bu e-posta adresi zaten kayıtlı.');
        } else {
            setSuccess('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
            setTimeout(() => navigate('/login'), 2000);
        }

        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                {/* Sol dekoratif panel */}
                <div className="auth-hero">
                    <div className="auth-hero-content">
                        <div className="auth-logo">
                            <span className="auth-logo-icon">✂️</span>
                            <span className="auth-logo-text">SalonAppy</span>
                        </div>
                        <h1>Salonunuzu Dijitale Taşıyın</h1>
                        <p>Randevularınızı yönetin, müşterilerinizi takip edin ve işinizi büyütün.</p>
                        <div className="auth-hero-features">
                            <div className="auth-hero-feature">
                                <span>📅</span>
                                <span>Akıllı Randevu Yönetimi</span>
                            </div>
                            <div className="auth-hero-feature">
                                <span>👥</span>
                                <span>Müşteri Takibi</span>
                            </div>
                            <div className="auth-hero-feature">
                                <span>📊</span>
                                <span>Detaylı Raporlar</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sağ form paneli */}
                <div className="auth-form-panel">
                    <div className="auth-form-wrapper">
                        <div className="auth-form-header">
                            <h2>Hesap Oluştur</h2>
                            <p className="text-muted">Hemen ücretsiz başlayın</p>
                        </div>

                        <form onSubmit={handleSubmit} className="auth-form">
                            {error && <div className="alert alert-error">⚠️ {error}</div>}
                            {success && <div className="alert alert-success">✅ {success}</div>}

                            {/* Ad Soyad - yan yana */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="firstName">Ad <span className="required">*</span></label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        className="form-input"
                                        placeholder="Adınız"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        autoComplete="given-name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Soyad <span className="required">*</span></label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        className="form-input"
                                        placeholder="Soyadınız"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        autoComplete="family-name"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Telefon <span className="required">*</span></label>
                                <input
                                    id="phone"
                                    type="tel"
                                    className="form-input"
                                    placeholder="05XX XXX XX XX"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    autoComplete="tel"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="brandName">Salon / Marka Adı <span className="required">*</span></label>
                                <input
                                    id="brandName"
                                    type="text"
                                    className="form-input"
                                    placeholder="Örn: Güzellik Salonu Ayla"
                                    value={brandName}
                                    onChange={(e) => setBrandName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">E-posta Adresi <span className="required">*</span></label>
                                <input
                                    id="email"
                                    type="email"
                                    className="form-input"
                                    placeholder="ornek@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                />
                            </div>

                            {/* Şifreler - yan yana */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="password">Şifre <span className="required">*</span></label>
                                    <input
                                        id="password"
                                        type="password"
                                        className="form-input"
                                        placeholder="En az 6 karakter"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="new-password"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Şifre Tekrar <span className="required">*</span></label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        className="form-input"
                                        placeholder="Tekrar girin"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>

                            <div className="form-group-checkbox">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={terms}
                                        onChange={(e) => setTerms(e.target.checked)}
                                    />
                                    <span className="checkbox-text">
                                        <a href="#" onClick={(e) => e.preventDefault()}>Kullanım koşullarını</a> ve{' '}
                                        <a href="#" onClick={(e) => e.preventDefault()}>gizlilik politikasını</a> kabul ediyorum.
                                    </span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-full"
                                disabled={loading}
                            >
                                {loading ? 'Kayıt yapılıyor...' : 'Hesap Oluştur'}
                            </button>
                        </form>

                        <p className="auth-footer">
                            Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
