type StepperProps = {
  labels: string[];
  activeIndex: number;
};

export function Stepper({ labels, activeIndex }: StepperProps) {
  return (
    <ol className="lf-stepper" aria-label="Application progress">
      {labels.map((label, index) => (
        <li
          className={`lf-stepper__item ${index === activeIndex ? 'is-active' : ''} ${index < activeIndex ? 'is-complete' : ''}`.trim()}
          key={label}
          aria-current={index === activeIndex ? 'step' : undefined}
        >
          <span className="lf-stepper__number">{index + 1}</span>
          <span>{label}</span>
        </li>
      ))}
    </ol>
  );
}
