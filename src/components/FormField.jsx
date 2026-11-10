export default function FormField({
  id,
  label,
  required,
  error,
  hint,
  multiline,
  ...props
}) {
  const Tag = multiline ? "textarea" : "input";
  const describedBy =
    [error && `${id}-err`, hint && `${id}-hint`].filter(Boolean).join(" ") ||
    undefined;
  return (
    <div className="field">
      <label htmlFor={id}>
        {label} {required && <span className="req" aria-hidden="true">*</span>}
        {required && <span className="sr-only">(wajib)</span>}
      </label>
      <Tag
        id={id}
        name={id}
        className={error ? "bad" : ""}
        aria-invalid={error ? "true" : "false"}
        aria-required={required || undefined}
        aria-describedby={describedBy}
        {...props}
      />
      {hint && !error && (
        <p className="hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="err" id={`${id}-err`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
