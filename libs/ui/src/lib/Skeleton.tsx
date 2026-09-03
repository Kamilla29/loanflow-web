export function Skeleton({ lines = 3 }: { lines?: number }) {
  return <div className="lf-skeleton" aria-hidden="true">{Array.from({ length: lines }, (_, index) => <span key={index} />)}</div>;
}
