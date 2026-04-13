import { useNavigate } from 'react-router-dom';
import './Settings.css';

const settingsCards = [
    { id: 'branch', icon: '🏢', title: 'Temel Bilgiler', desc: 'Şube bilgilerini düzenleyin', path: '/settings/branch', active: true },
    { id: 'hours', icon: '🕐', title: 'Çalışma Saatleri', desc: 'Haftalık çalışma saatlerini belirleyin', path: '/settings/working-hours', active: true },
    { id: 'seasonal', icon: '📅', title: 'Dönemsel Çalışma Saatleri', desc: 'Tatil ve özel dönem saatleri', path: '/settings/seasonal-hours', active: true },
    { id: 'staff', icon: '👥', title: 'Personeller', desc: 'Personel ekleyin ve yönetin', path: '/settings/staff', active: true },
    { id: 'services', icon: '💇', title: 'Hizmetler', desc: 'Sunduğunuz hizmetleri tanımlayın', path: '/settings/services', active: true },
    { id: 'promo', icon: '🎁', title: 'Promosyon Ayarları', desc: 'Parapuan ve indirim ayarları', path: '/settings/promotions', active: true },
    { id: 'products', icon: '📦', title: 'Ürünler', desc: 'Şube ürünlerini ve stokları yönetin', path: '/settings/products', active: true },
    { id: 'packages', icon: '🎀', title: 'Paketler', desc: 'Hizmet paketleri oluşturun', path: '/settings/packages', active: true },
    { id: 'appointment', icon: '📋', title: 'Randevu Ayarları', desc: 'Randevu sistemi yapılandırması', path: '/settings/appointments', active: true },
    { id: 'tags', icon: '🏷️', title: 'Etiket Ayarları', desc: 'Etiket ve kategori yönetimi', path: '/settings/tags', active: true },
    { id: 'faq', icon: '❓', title: 'SSS Ayarları', desc: 'Sıkça sorulan sorular', path: '/settings/faqs', active: true },
];

export default function Settings() {
    const navigate = useNavigate();

    return (
        <div className="settings-page">
            <div className="page-header">
                <h1>⚙️ Ayarlar</h1>
                <p className="text-muted">Salonunuzun tüm ayarlarını buradan yönetin</p>
            </div>

            <div className="settings-grid">
                {settingsCards.map((card) => (
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
