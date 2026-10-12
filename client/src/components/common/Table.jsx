export default function Table({ columns, data, empty = 'No records' }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>{columns.map((c, i) => <th key={i}>{c.header}</th>)}</tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: 20 }}>{empty}</td></tr>
          ) : data.map((row, i) => (
            <tr key={i}>
              {columns.map((c, j) => (
                <td key={j}>{c.render ? c.render(row) : row[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}