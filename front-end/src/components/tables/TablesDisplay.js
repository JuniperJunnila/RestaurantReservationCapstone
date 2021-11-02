import { freeTable } from "../../utils/api";

export default function TablesDisplay({ tables, loadDashboard }) {
  async function _clickHandler({ target }) {
    if (
      !window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    )
      return null;
    const abortController = new AbortController();
    await freeTable(target.value, abortController.signal).then(loadDashboard);
    return () => abortController.abort();
  }

  const tableList =
    !tables || tables.length === 0 ? (
      <h4>There are no tables</h4>
    ) : (
      <ul>
        {tables.map((t, index) => {
          return (
            <li key={index}>
              <h5>
                {t.table_name}: seats up to {t.capacity}
              </h5>
              {t.occupied ? (
                <div>
                  <h5 data-table-id-status={t.table_id}>Occupied</h5>
                  <button
                    type="button"
                    name="finish"
                    id="finish"
                    value={t.table_id}
                    data-table-id-finish={t.table_id}
                    onClick={_clickHandler}
                  >
                    Finish
                  </button>
                </div>
              ) : (
                <h5 data-table-id-status={t.table_id}>Free</h5>
              )}
            </li>
          );
        })}
      </ul>
    );

  return <div>{tableList}</div>;
}
