export default function ReservationDisplay({ reservations, loadDashboard }) {
  const reservationList =
    !reservations || reservations.length === 0 ? (
      <h4>There are no reservations on this date</h4>
    ) : (
      <ol>
        {reservations.map((r, index) => {
          return (
            <li key={index}>
              <h5>
                {r.last_name}, {r.first_name[0]} will arrive at{" "}
                {r.reservation_time}
              </h5>
              <a href={`/reservations/${r.reservation_id}/seat`}>
                <button type="button">Seat</button>
              </a>
            </li>
          );
        })}
      </ol>
    );

  return <div>{reservationList}</div>;
}
