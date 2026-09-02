import { Link, Route, Routes } from 'react-router-dom';
import { Card } from '@loanflow/ui';

function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">React · TypeScript · Nx</p>
        <h1>LoanFlow</h1>
        <p className="hero__lead">
          A fictional consumer-loan journey built to demonstrate production-style frontend architecture,
          validation, testing and CI/CD.
        </p>
        <Card>
          <h2>Workspace initialized</h2>
          <p>The first product slice — loan calculator and application flow — is being built next.</p>
        </Card>
      </section>
    </main>
  );
}

export function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">LoanFlow</Link>
        <span className="topbar__meta">Fintech portfolio project</span>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
}
