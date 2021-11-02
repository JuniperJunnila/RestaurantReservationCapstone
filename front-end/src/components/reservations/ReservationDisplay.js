import { seatReservation } from "../../utils/api";

export default function ReservationDisplay({ reservations, loadDashboard }) {
  function _seatClickHandler(event) {
    seatReservation(event.target.value, 'seated');
  }

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
              <h5 data-reservation-id-status={r.reservation_id}>{r.status}</h5>
              {r.reservation_id === "booked" ? null : (
                <a href={`/reservations/${r.reservation_id}/seat`}>
                  <button
                    type="button"
                    value={r.reservation_id}
                    onClick={_seatClickHandler}
                  >
                    Seat
                  </button>
                </a>
              )}
            </li>
          );
        })}
      </ol>
    );

  return <div>{reservationList}</div>;
}
