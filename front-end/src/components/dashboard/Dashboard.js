import { useHistory } from "react-router";
import ErrorAlert from "../../utils/Errors/ErrorAlert";
import { next, previous, today } from "../../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
export default function Dashboard({ date, reservations, reservationsError }) {
  const history = useHistory();

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">
          Reservations for {date.slice(5)}-{date.slice(0, 4)}
        </h4>
      </div>
      {reservations.length === 0 ? (
        <h4>There are no reservations on this date</h4>
      ) : (
        <ol>
          {reservations.map((reservation, index) => {
            const r = reservation;
            return (
              <li key={index}>
                {r.last_name}, {r.first_name[0]} will arrive at{" "}
                {r.reservation_time}
              </li>
            );
          })}
        </ol>
        // null
      )}
      <div>
        <input
          type="button"
          value="Previous Day"
          onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
        />
        <input
          type="button"
          value="Today"
          onClick={() => history.push(`/dashboard?date=${today()}`)}
        />
        <input
          type="button"
          value="Next Day"
          onClick={() => history.push(`/dashboard?date=${next(date)}`)}
        />
      </div>
      <ErrorAlert error={reservationsError} />
    </main>
  );
}
