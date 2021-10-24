import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../../layout/Errors/ErrorAlert";
import { listReservations, useQuery } from "../../utils/api";
import { next, previous } from "../../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const history = useHistory()
  const query = useQuery();
  date = query.get("date") ? query.get("date") : date;
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date.slice(5)}-{date.slice(0, 4)}</h4>
      </div>
      {reservations.length === 0 ? (
        <h4>There are no reservations on this date</h4>
      ) : (
        <ol>
          {reservations.map((reservation, index) => {
            return <li key={index}>{reservation}</li>;
          })}
        </ol>
      )}
      <div>
        <input type='button' value='Previous Day' onClick={() => history.push(`/dashboard?date=${previous(date)}`)} />
        <input type='button' value='Today' onClick={() => history.push(`/dashboard`)} />
        <input type='button' value='Next Day' onClick={() => history.push(`/dashboard?date=${next(date)}`)} />
      </div>
      <ErrorAlert error={reservationsError} />
      {JSON.stringify(reservations)}
    </main>
  );
}

export default Dashboard;
