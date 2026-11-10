export default function QtyStepper({
  value,
  onChange,
  label = "porsi",
  min = 1,
  max = 20,
}) {
  return (
    <div className="stepper" role="group" aria-label={`Jumlah ${label}`}>
      <button
        type="button"
        onClick={() => onChange(-1)}
        disabled={value <= min}
        aria-label={`Kurangi ${label}`}
      >
        −
      </button>
      <output aria-live="polite">{value}</output>
      <button
        type="button"
        onClick={() => onChange(1)}
        disabled={value >= max}
        aria-label={`Tambah ${label}`}
      >
        +
      </button>
    </div>
  );
}
