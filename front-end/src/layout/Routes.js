import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../components/dashboard/Dashboard";
import NotFound from "../utils/Errors/NotFound";
import { today } from "../utils/date-time";
import NewReservation from "../components/reservations/NewReservation";
import { listReservations, useQuery } from "../utils/api";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery()
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const date = query.get('date') ? query.get('date') : today()
  
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({date: date}, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }
  
  useEffect(loadDashboard, [date]);
  
  return (
    <Switch>
      
      <Route exact path="/reservations/new">
        <NewReservation />
      </Route>
      <Route exact={true} path="/dashboard">
        <Redirect to={`/dashboard?date=${date ? date : today()}`} />
        <Dashboard
          date={date ? date : today()}
          reservations={reservations}
          reservationsError={reservationsError}
          loadDashboard={loadDashboard}
        />
      </Route>

      <Route exact={true} path="/">
        <Redirect to={`/dashboard?date=${date ? date : today()}`} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
