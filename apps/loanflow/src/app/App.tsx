import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { LoanCalculator } from './loan/LoanCalculator';
import { ApplicationWizard } from './application/ApplicationWizard';
import { ApplicationStatus } from './status/ApplicationStatus';
import { ComponentShowcase } from './components/ComponentShowcase';

function HomePage() {
  return (
    <main id="main-content" className="page-shell home-page">
      <section className="hero"><div className="hero__content"><p className="eyebrow">React 18 · TypeScript · Nx</p><h1>Borrowing,<br/>without the maze.</h1><p className="hero__lead">LoanFlow is a fictional fintech application built to demonstrate reusable frontend architecture, complex form handling, resilient UI states and automated quality practices.</p><div className="hero__actions"><a className="lf-button lf-button--primary" href="#calculator">Calculate a loan</a><Link className="lf-button lf-button--secondary" to="/apply">Open application flow</Link></div></div><div className="hero__visual" aria-hidden="true"><div className="visual-card visual-card--primary"><span>Application</span><strong>4 clear steps</strong><small>validated · resumable · testable</small></div><div className="visual-card visual-card--secondary"><span>Quality layer</span><strong>Unit + E2E</strong><small>Vitest · Cypress · CI</small></div></div></section>
      <section id="calculator" className="section-block"><LoanCalculator/></section>
      <section className="architecture-grid section-block" aria-label="Project architecture highlights"><article><span>01</span><h2>Feature-oriented UI</h2><p>Routes orchestrate the product journey while reusable primitives stay in an Nx UI library.</p></article><article><span>02</span><h2>Typed domain logic</h2><p>Calculations, affordability rules and validation are isolated from presentation and unit tested.</p></article><article><span>03</span><h2>Failure-aware UX</h2><p>Persistent drafts, loading states and recoverable API failures are first-class product states.</p></article></section>
    </main>
  );
}

export function App() {
  return <div className="app-shell"><a className="skip-link" href="#main-content">Skip to main content</a><header className="topbar"><Link className="brand" to="/">LoanFlow</Link><nav className="topbar__nav" aria-label="Primary navigation"><a href="/#calculator">Calculator</a><Link to="/apply">Application</Link><Link to="/components">Components</Link></nav><span className="topbar__meta">Fintech portfolio project</span></header><Routes><Route path="/" element={<HomePage/>}/><Route path="/apply" element={<ApplicationWizard/>}/><Route path="/status/:applicationId" element={<ApplicationStatus/>}/><Route path="/components" element={<ComponentShowcase/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes><footer className="footer"><span>LoanFlow · fictional portfolio product</span><span>React · TypeScript · Quality engineering</span></footer></div>;
}
