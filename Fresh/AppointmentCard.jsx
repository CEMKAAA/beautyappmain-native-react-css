import React from 'react';

/**
 * Fresha Appointment Card — Pixel-perfect replica
 * 
 * 3 tip randevu kartı:
 * - booking: Mavi (rgb(165, 223, 248))
 * - block: Gri (rgb(164, 173, 186))  
 * - completed: Açık gri (rgb(222, 227, 231)) + ✓ icon
 * 
 * Kullanım:
 * <AppointmentCard time="11:00 - 11:50" title="John Doe" type="booking" />
 */

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1a7 7 0 110 14A7 7 0 018 1zm3.36 4.65a.5.5 0 00-.72 0L7.2 9.09 5.36 7.25a.5.5 0 00-.72.7l2.2 2.2a.5.5 0 00.72 0l3.8-3.8a.5.5 0 000-.7z" />
    </svg>
);

const AppointmentCard = ({ time, title, type = 'booking', onClick }) => {
    return (
        <div className={`fresha-appointment ${type}`} onClick={onClick}>
            <div className="fresha-apt-bg" />
            <div className="fresha-apt-click" />
            <div className="fresha-apt-content">
                <div className="fresha-apt-time">{time}</div>
                <div className="fresha-apt-title">{title}</div>
            </div>
            {type === 'completed' && (
                <div className="fresha-apt-suffix">
                    <CheckIcon />
                </div>
            )}
        </div>
    );
};

export default AppointmentCard;
