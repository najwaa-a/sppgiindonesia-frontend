export function DetailSkeleton() {
  return (
    <div className="detail" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Memuat data menu…</span>
      <div className="skeleton sk-pic" />
      <div>
        <div className="skeleton sk-line w40" />
        <div className="skeleton sk-line w90 tall" />
        <div className="skeleton sk-line w70" />
        <div className="skeleton sk-line w100" />
        <div className="skeleton sk-line w100" />
        <div className="skeleton sk-line w60" />
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry, backTo }) {
  return (
    <div className="card empty" role="alert">
      <div className="big" aria-hidden="true">⚠️</div>
      <h1>Ups, terjadi masalah</h1>
      <p className="sub">{message}</p>
      <div className="row center">
        {onRetry && <button className="btn" onClick={onRetry}>Coba lagi</button>}
        {backTo}
      </div>
    </div>
  );
}
