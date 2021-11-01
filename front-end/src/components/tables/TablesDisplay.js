export default function TablesDisplay({ tables, loadDashboard }) {
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
                <h5 data-table-id-status={t.table_id}>Occupied</h5>
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
