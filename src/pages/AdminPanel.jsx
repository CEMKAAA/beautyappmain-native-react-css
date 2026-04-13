import { useNavigate } from 'react-router-dom';
import './Settings.css';

const adminCards = [
    { id: 'default-services', icon: '💇', title: 'Default Servisler', desc: 'Hazır hizmet kataloğunu yönetin', path: '/admin/default-services', active: true },
    { id: 'products', icon: '📦', title: 'Ürün Kataloğu', desc: 'Merkezi ürün kataloğunu yönetin', path: '/admin/products', active: true },
    { id: 'users', icon: '👤', title: 'Kullanıcılar', desc: 'Kullanıcı ve yetki yönetimi', path: null, active: false },
    { id: 'branches', icon: '🏢', title: 'Şube Yönetimi', desc: 'Şubelerinizi yönetin', path: null, active: false },
];

export default function AdminPanel() {
    const navigate = useNavigate();

    return (
        <div className="settings-page">
            <div className="page-header">
                <h1>🔧 Yönetim Paneli</h1>
                <p className="text-muted">Merkezi yönetim ayarlarınızı buradan düzenleyin</p>
            </div>

            <div className="settings-grid">
                {adminCards.map((card) => (
                    <div
                        key={card.id}
                        className={`settings-card ${card.active ? 'settings-card--active' : 'settings-card--disabled'}`}
                        onClick={() => card.active && card.path && navigate(card.path)}
                    >
                        <div className="settings-card-icon">{card.icon}</div>
                        <div className="settings-card-content">
                            <h3>{card.title}</h3>
                            <p>{card.desc}</p>
                        </div>
                        {!card.active && <span className="settings-card-badge">Yakında</span>}
                        {card.active && <span className="settings-card-arrow">→</span>}
                    </div>
                ))}
            </div>
        </div>
    );
}
