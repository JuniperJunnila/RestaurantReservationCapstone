import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../../utils/api";
import ErrorAlert from "../../utils/Errors/ErrorAlert";

function NewReservation(loadDashboard) {
  const history = useHistory();

  const defaultState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [error, setError] = useState(null);
  const [newRes, setNewRes] = useState(defaultState);

  const _inputChange = (event) => {
    event.preventDefault();
    const inputValue = event.target.value;
    const inputId = event.target.name;
    switch (inputId) {
      case "first_name":
        setNewRes({ ...newRes, first_name: inputValue });
        break;
      case "last_name":
        setNewRes({ ...newRes, last_name: inputValue });
        break;
      case "mobile_number":
        if (inputValue.match(/\d/))
          setNewRes({ ...newRes, mobile_number: inputValue });
        break;
      case "reservation_date":
        setNewRes({ ...newRes, reservation_date: inputValue });
        break;
      case "reservation_time":
        setNewRes({ ...newRes, reservation_time: inputValue });
        break;
      case "people":
        setNewRes({ ...newRes, people: parseInt(inputValue) });
        break;
      default:
        break;
    }
  };

  const _dateCatch = () => {
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const closedOn = 2;
    const resTimeDate = new Date(
      `${newRes.reservation_date}T${newRes.reservation_time}`
    );
    if (resTimeDate.getDay() === closedOn && resTimeDate < Date.now()) {
      setError({
        message: `We're sorry, the restaurant is closed on ${weekdays[closedOn]}s.\n
        Please enter a reservation date and time that is in the future.`,
      });
    } else if (resTimeDate.getDay() === closedOn) {
      setError({
        message: `We're sorry, the restaurant is closed on ${weekdays[closedOn]}s.`,
      });
    } else if (resTimeDate < Date.now())
      setError({
        message: `Please enter a reservation date and time that is in the future.`,
      });
  };

  useEffect(_dateCatch, [
    newRes.reservation_date,
    newRes.reservation_time,
  ]);

  const _submitHandler = (event) => {
    event.preventDefault();
    createReservation(newRes)
      .then(loadDashboard)
      .then(() => {
        history.push(`/dashboard?date=${newRes.reservation_date}`);
      })
      .catch(setError);
  };

  return (
    <main>
      <h1>NewReservation</h1>
      <ErrorAlert error={error} />
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Enter Your Information Below</h4>
      </div>
      <form onSubmit={_submitHandler}>
        <label htmlFor="first_name">
          <h5>First Name</h5>
        </label>
        <input
          required
          type="text"
          name="first_name"
          id="first_name"
          onChange={_inputChange}
          value={newRes.first_name}
        />
        <label htmlFor="last_name">
          <h5>Last Name</h5>
        </label>
        <input
          required
          type="text"
          name="last_name"
          id="last_name"
          onChange={_inputChange}
          value={newRes.last_name}
        />
        <label htmlFor="mobile_number">
          <h5>Phone Number</h5>
        </label>
        <input
          required
          type="tel"
          name="mobile_number"
          id="mobile_number"
          minLength="10"
          maxLength="10"
          onChange={_inputChange}
          value={newRes.mobile_number}
        />
        <label htmlFor="reservation_date">
          <h5>Reservation Date</h5>
        </label>
        <input
          required
          type="date"
          name="reservation_date"
          id="reservation_date"
          onChange={_inputChange}
          value={newRes.reservation_date}
        />
        <label htmlFor="reservation_time">
          <h5>Reservation Time</h5>
        </label>
        <input
          required
          type="time"
          name="reservation_time"
          id="reservation_time"
          onChange={_inputChange}
          value={newRes.reservation_time}
        />
        <label htmlFor="people">
          <h5>Number of People</h5>
        </label>
        <input
          required
          type="number"
          name="people"
          id="people"
          onChange={_inputChange}
          value={newRes.people}
        />
        <input type="submit" value="Confirm Reservation" />
        <input type="button" value="Cancel" onClick={() => history.goBack()} />
      </form>
    </main>
  );
}

export default NewReservation;
