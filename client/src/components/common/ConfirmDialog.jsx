export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div role="alertdialog">
      <p>{message}</p>
      <button onClick={onConfirm}>Confirm</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}
