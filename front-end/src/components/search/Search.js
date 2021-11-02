import { useState } from "react";
import { listReservations } from "../../utils/api";
import ErrorAlert from "../../utils/Errors/ErrorAlert";
import ReservationDisplay from "../reservations/ReservationDisplay";

export default function Search() {
  const [searchbar, setSearchbar] = useState("");
  const [error, setError] = useState(null);
  const [found, setFound] = useState([]);

  const _inputChange = (event) => {
    event.preventDefault();
    const inputValue = event.target.value;
    if (inputValue.match(/\d$/) || inputValue.match(/^.{0}$/))
      setSearchbar(inputValue);
  };

  const _submitHandler = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    setError(null);

    const formattedSearchbar = _formatSearchbar(searchbar);

    await listReservations(
      { mobile_number: formattedSearchbar },
      abortController.signal
    )
      .then(setFound)
      .catch(setError);
    return () => abortController.abort();
  };

  const FoundComponent = () => {
    if (found.length === 0) return null;
    return <ReservationDisplay reservations={found} />;
  };

  useState(FoundComponent, [found]);

  const _formatSearchbar = (searchbar) => {
    let formattedSearchbar = searchbar;
    searchbar.length > 6
      ? (formattedSearchbar = `${searchbar.slice(0, 3)}-${searchbar.slice(
          3,
          6
        )}-${searchbar.slice(6)}`)
      : (formattedSearchbar = `${searchbar.slice(0, 3)}-${searchbar.slice(3)}`);
    return formattedSearchbar;
  };

  return (
    <div>
      <h1>Search by Phone Number</h1>
      <ErrorAlert error={error} />
      <form onSubmit={_submitHandler}>
        <label htmlFor="mobile_number"></label>
        <input
          name="mobile_number"
          id="mobile_number"
          placeholder="Enter a customer's phone number"
          required
          type="tel"
          minLength="1"
          maxLength="10"
          onChange={_inputChange}
          value={searchbar}
        />
        <button type="submit" name="find" id="find" value="Find" />
      </form>
      <FoundComponent />
    </div>
  );
}
