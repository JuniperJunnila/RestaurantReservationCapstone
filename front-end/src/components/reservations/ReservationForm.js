import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import {
  createReservation,
  editReservation,
  listReservationsById,
} from "../../utils/api";
import { asDateString } from "../../utils/date-time";
import ErrorAlert from "../../utils/Errors/ErrorAlert";

export default function ReservationEditor({ loadDashboard }) {
  const history = useHistory();
  const { reservation_id } = useParams();
  const { href } = window.location;
  const defaultState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
    status: "new",
  };

  const [error, setError] = useState(null);
  const [newRes, setNewRes] = useState(defaultState);

  useEffect(() => {
    let isMounted = true;
    if (!reservation_id)
      return () => {
        isMounted = false;
      };
    const abortController = new AbortController();
    listReservationsById(
      {
        reservation_id: reservation_id,
      },
      abortController.signal
    )
      .then((recieved) => {
        if (isMounted) setNewRes(recieved);
      })
      .catch(setError);
    return () => {
      isMounted = false;
    };
  }, [reservation_id]);

  useEffect(() => {
    if (href.includes("reservations/new"))
      setNewRes({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
        status: "new",
      });
  }, [href]);

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
        if (inputValue.match(/\d$/) || inputValue.match(/^.{0}$/))
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

  const _timeCatch = () => {
    const today = asDateString(new Date());
    const now = new Date().getHours() * 100 + new Date().getMinutes();
    const time = Number(
      newRes.reservation_time.slice(0, 2) + newRes.reservation_time.slice(3)
    );
    const open = 1030;
    const close = 2230;
    const _timeString = (timeString) => {
      timeString = timeString.toString();
      if (timeString.length <= 2) timeString = "00" + timeString;
      return timeString.slice(0, 2) + ":" + timeString.slice(2);
    };
    const messages = [
      `Please enter a reservation date and time that is in the future.`,
      `This time is before our restaurant is open, please enter a time after ${_timeString(
        open
      )}.`,
      `Our restaurant closes at ${_timeString(
        close
      )}, please enter a time before ${_timeString(
        close - 100
      )} to allow your party the time to eat.`,
    ];
    if (today === newRes.reservation_date && time <= now) {
      setError({
        message: messages[0],
      });
    } else if (time < open && time > 0) {
      setError({
        message: messages[1],
      });
    } else if (time > close - 100) {
      setError({
        message: messages[2],
      });
    } else if (error && messages.includes(error.message)) {
      setError(null);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(_timeCatch, [newRes.reservation_date, newRes.reservation_time]);

  useEffect(_dateCatch, [newRes.reservation_date, newRes.reservation_time]);

  const _submitHandler = (event) => {
    event.preventDefault();
    if (!reservation_id) {
      createReservation(newRes)
        .then(loadDashboard)
        .then(() => {
          history.push(`/dashboard?date=${newRes.reservation_date}`);
        })
        .catch(setError);
    } else {
      editReservation(newRes)
        .then(loadDashboard)
        .then(() => {
          history.goBack();
        })
        .catch(setError);
    }
  };

  const FormHeader = () => {
    if (reservation_id) return <h1>Edit Reservation</h1>;
    return <h1>New Reservation</h1>;
  };

  return (
    <main>
      <FormHeader />
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
