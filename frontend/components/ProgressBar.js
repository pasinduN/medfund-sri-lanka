export default function ProgressBar({ percent, cells = 14 }) {
  const filled = (percent / 100) * cells;

  return (
    <div className="seg" role="progressbar" aria-valuenow={Math.round(percent)} aria-valuemin={0} aria-valuemax={100}>
      {Array.from({ length: cells }, (_, i) => (
        <i key={i} className={i < Math.floor(filled) ? "f" : i < filled ? "h" : ""} />
      ))}
    </div>
  );
}
