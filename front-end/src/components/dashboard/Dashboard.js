import { useHistory } from "react-router";
import ErrorAlert from "../../utils/Errors/ErrorAlert";
import { next, previous, today } from "../../utils/date-time";
import ReservationDisplay from "../reservations/ReservationDisplay";
import TablesDisplay from "../tables/TablesDisplay";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
export default function Dashboard({
  date,
  reservations,
  reservationsError,
  tables,
  tablesError,
  loadDashboard,
}) {
  const history = useHistory();

  return (
    <main className="menu-align">
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">
          Reservations for {date.slice(5)}-{date.slice(0, 4)}
        </h4>
      </div>

      <ReservationDisplay
        reservations={reservations}
        loadDashboard={loadDashboard}
      />
      <TablesDisplay tables={tables} loadDashboard={loadDashboard} />

      <div>
        <input
          type="button"
          name="yesterday"
          id="yesterday"
          className="btn btn-a border-a border-right-0"
          value="Previous Day"
          onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
        />
        <input
          type="button"
          name="today"
          id="today"
          className="btn btn-a border-a"
          value="Today"
          onClick={() => history.push(`/dashboard?date=${today()}`)}
        />
        <input
          type="button"
          name="tomorrow"
          id="tomorrow"
          className="btn btn-a border-a border-left-0"
          value="Next Day"
          onClick={() => history.push(`/dashboard?date=${next(date)}`)}
        />
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
    </main>
  );
}
