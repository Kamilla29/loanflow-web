import { Alert, Badge, Button, Card, FormField, ProgressBar, Skeleton, Stepper } from '@loanflow/ui';

export function ComponentShowcase() {
  return (
    <main id="main-content" className="page-shell showcase-page">
      <p className="eyebrow">UI library</p><h1 className="page-title">Component showcase</h1><p className="page-lead">A reviewable catalogue of the reusable primitives used by the LoanFlow product flow. It provides a lightweight in-app equivalent of a component workshop for portfolio review.</p>
      <div className="showcase-grid">
        <Card><p className="eyebrow">Actions</p><h2>Buttons</h2><div className="showcase-row"><Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="ghost">Ghost</Button><Button disabled>Disabled</Button></div></Card>
        <Card><p className="eyebrow">Status</p><h2>Badges & alerts</h2><div className="showcase-row"><Badge>Brand</Badge><Badge tone="success">Success</Badge><Badge tone="warning">Warning</Badge><Badge tone="neutral">Neutral</Badge></div><Alert title="Recoverable service state" tone="danger">The same alert primitive is used for failed application submissions.</Alert></Card>
        <Card><p className="eyebrow">Forms</p><h2>Field anatomy</h2><FormField label="Email" htmlFor="showcase-email" hint="Supporting text is associated with the field"><input id="showcase-email" className="lf-input" placeholder="name@example.com" /></FormField></Card>
        <Card><p className="eyebrow">Progress</p><h2>Stepper & indicator</h2><Stepper labels={['Loan','Personal','Finances','Review']} activeIndex={2}/><ProgressBar value={38} label="Payment share"/></Card>
        <Card><p className="eyebrow">Loading</p><h2>Skeleton</h2><Skeleton lines={4}/></Card>
      </div>
    </main>
  );
}
