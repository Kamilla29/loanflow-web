export function ProgressBar({ value, label }: { value: number; label: string }) {
  const normalized = Math.max(0, Math.min(100, value));
  const rounded = Math.round(normalized);

  return (
    <div className="lf-progress">
      <div className="lf-progress__header"><span>{label}</span><strong>{rounded}%</strong></div>
      <div
        className="lf-progress__track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={rounded}
      >
        <span style={{ width: `${normalized}%` }} />
      </div>
    </div>
  );
}
