import { useState } from "react";
import { useHistory } from "react-router";
import { createTable } from "../../utils/api";
import ErrorAlert from "../../utils/Errors/ErrorAlert";

export default function NewTable(loadDashboard) {
  const history = useHistory();

  const defaultState = {
    table_name: "",
    capacity: 0,
  };

  const [error, setError] = useState(null);
  const [table, setTable] = useState(defaultState);

  const _submitHandler = (event) => {
    event.preventDefault();
    const abortController = new AbortController();

    createTable(table, abortController.abort())
      .then(loadDashboard)
      .then(() => history.push(`/dashboard`))
      .catch(setError);
    return () => abortController.abort();
  };

  const _inputChange = (event) => {
    event.preventDefault();
    const inputValue = event.target.value;
    const inputId = event.target.name;
    inputId === "table_name"
      ? setTable({ ...table, table_name: inputValue })
      : setTable({ ...table, capacity: Number(inputValue) });
  };

  return (
    <main>
      <h1>New Table</h1>
      <ErrorAlert error={error} />
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Enter The Table's Information Below</h4>
      </div>
      <form onSubmit={_submitHandler}>
        <label htmlFor="table_name">
          <h5>Table Name</h5>
        </label>
        <input
          name="table_name"
          id="table_name"
          type="text"
          minLength={2}
          onChange={_inputChange}
          value={table.table_name}
        />
        <label htmlFor="table_name">
          <h5>Capacity</h5>
        </label>
        <input
          name="capacity"
          id="capacity"
          type="number"
          min={1}
          onChange={_inputChange}
          value={table.capacity}
        />
        <input type="submit" value="Submit" />
        <input type="button" value="Cancel" onClick={() => history.goBack()} />
      </form>
    </main>
  );
}
