import { useState } from "react";
import { seatReservation } from "../../utils/api";
import ErrorAlert from "../../utils/Errors/ErrorAlert";

export default function ReservationDisplay({ reservations, loadDashboard }) {
  const [error, setError] = useState(null);

  function _clickHandler(event) {
    event.preventDefault();
    setError(null);
    event.target.name === "seat"
      ? _seatClickHandler(event)
      : _clickHandler(event);
  }

  function _seatClickHandler(event) {
    const abortController = new AbortController();
    seatReservation(event.target.value, "seated", abortController.signal)
      .then(loadDashboard)
      .catch(setError);
    return () => abortController.abort();
  }

  function _cancelHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();
    if (
      !window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    )
      return null;
    seatReservation(event.target.value, "cancelled", abortController.signal)
      .then(loadDashboard)
      .catch(setError);
    return () => abortController.abort();
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
                <div>
                  <a href={`/reservations/${r.reservation_id}/seat`}>
                    <button
                      type="button"
                      name="seat"
                      value={r.reservation_id}
                      onClick={_clickHandler}
                    >
                      Seat
                    </button>
                  </a>
                  <a href={`/reservations/${r.reservation_id}/edit`}>
                    <button type="button" value={r.reservation_id}>
                      Edit
                    </button>
                  </a>
                  <button
                    type="button"
                    name="cancel"
                    value={r.reservation_id}
                    onClick={_cancelHandler}
                    data-reservation-id-cancel={r.reservation_id}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    );

  return (
    <div>
      <ErrorAlert error={error} />
      {reservationList}
    </div>
  );
}
