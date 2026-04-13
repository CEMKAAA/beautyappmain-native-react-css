/**
 * Monthly Appointment Card Component
 * Fresha-exact replica for monthly calendar view
 * 
 * Usage:
 *   <MonthlyAppointmentCard time="10:00" name="Jack Doe" status="confirmed" />
 *   <MonthlyMoreButton count={5} onClick={() => {}} />
 * 
 * Status values: 'confirmed', 'completed', 'blocked', 'noshow'
 * Colors:
 *   confirmed  → rgb(165, 223, 248) blue
 *   completed  → rgb(222, 227, 231) light gray
 *   blocked    → rgb(164, 173, 186) gray
 *   noshow     → rgb(253, 219, 216) pink
 */

const MonthlyAppointmentCard = ({ time, name, status = 'confirmed', onClick }) => {
    const statusClass = status === 'completed' ? ' is-completed'
        : status === 'blocked' ? ' is-blocked'
            : status === 'noshow' ? ' is-noshow'
                : '';

    return (
        <div className={`month-appt${statusClass}`} onClick={onClick}>
            <span className="month-appt-time">{time}</span>
            <span className="month-appt-name">{name}</span>
        </div>
    );
};

const MonthlyMoreButton = ({ count, onClick }) => {
    return (
        <div className="month-more" onClick={onClick}>
            {count} more
        </div>
    );
};

export { MonthlyAppointmentCard, MonthlyMoreButton };
export default MonthlyAppointmentCard;
