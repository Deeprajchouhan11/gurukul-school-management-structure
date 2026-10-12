export default function Pagination({ page, onPageChange }) {
  return (
    <nav>
      <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</button>
      <span>{page}</span>
      <button onClick={() => onPageChange(page + 1)}>Next</button>
    </nav>
  );
}
