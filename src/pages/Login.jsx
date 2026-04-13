import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, signIn } = useAuth();
    const navigate = useNavigate();

    // Kullanıcı giriş yaptığında otomatik yönlendir
    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Tüm alanları doldurun.');
            return;
        }

        setLoading(true);

        try {
            const { error: signInError } = await signIn(email, password);

            if (signInError) {
                if (signInError.message === 'Invalid login credentials') {
                    setError('E-posta veya şifre hatalı.');
                } else {
                    setError(signInError.message);
                }
                return;
            }

            // Navigation useEffect tarafından user state değişince otomatik yapılacak
        } catch (err) {
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
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
                        <h1>Tekrar Hoş Geldiniz</h1>
                        <p>Salonunuzu yönetmeye devam edin. Tüm randevularınız ve müşterileriniz sizi bekliyor.</p>
                        <div className="auth-hero-features">
                            <div className="auth-hero-feature">
                                <span>🔒</span>
                                <span>Güvenli Giriş</span>
                            </div>
                            <div className="auth-hero-feature">
                                <span>⚡</span>
                                <span>Hızlı Erişim</span>
                            </div>
                            <div className="auth-hero-feature">
                                <span>🛡️</span>
                                <span>Verileriniz Güvende</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sağ form paneli */}
                <div className="auth-form-panel">
                    <div className="auth-form-wrapper">
                        <div className="auth-form-header">
                            <h2>Giriş Yap</h2>
                            <p className="text-muted">Hesabınıza giriş yapın</p>
                        </div>

                        <form onSubmit={handleSubmit} className="auth-form">
                            {error && <div className="alert alert-error">⚠️ {error}</div>}

                            <div className="form-group">
                                <label htmlFor="email">E-posta Adresi</label>
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

                            <div className="form-group">
                                <label htmlFor="password">Şifre</label>
                                <input
                                    id="password"
                                    type="password"
                                    className="form-input"
                                    placeholder="Şifrenizi girin"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-full"
                                disabled={loading}
                            >
                                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                            </button>
                        </form>

                        <p className="auth-footer">
                            Hesabınız yok mu? <Link to="/register">Hesap Oluştur</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
