# Accessibility notes

LoanFlow treats accessibility as part of the product behavior rather than a final visual pass.

Implemented practices:

- skip navigation link;
- semantic page and section headings;
- labels tied to form controls;
- validation errors connected through `aria-describedby`;
- `aria-invalid` on invalid controls;
- `aria-current="step"` in the application stepper;
- focus moves to the first invalid field and to the heading of a newly opened step;
- loading and submission state exposed through `aria-busy`, live regions and status semantics;
- progress indicators expose `progressbar` value semantics;
- reduced-motion CSS fallback;
- responsive layouts preserve reading order.

Accessibility remains part of the regression checklist whenever shared UI primitives or the application journey change.
