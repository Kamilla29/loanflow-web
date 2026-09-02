import { Link, useLocation, useParams } from 'react-router-dom';
import type { SubmittedApplication } from '@loanflow/api';
import { Card } from '@loanflow/ui';

export function ApplicationStatus() {
  const { applicationId } = useParams();
  const location = useLocation();
  const submission = location.state as SubmittedApplication | null;

  return (
    <main id="main-content" className="page-shell status-page">
      <p className="eyebrow">Application status</p>
      <h1 className="page-title">Application received</h1>
      <p className="page-lead">The demo API accepted the application and returned a reference identifier.</p>

      <Card className="status-card">
        <span className="status-badge" role="status">Received</span>
        <dl>
          <div><dt>Reference</dt><dd data-cy="application-reference">{applicationId}</dd></div>
          <div><dt>Submitted</dt><dd>{submission?.submittedAt ? new Date(submission.submittedAt).toLocaleString('en-GB') : 'This browser session'}</dd></div>
          <div><dt>Next step</dt><dd>Illustrative review</dd></div>
        </dl>
        <Link className="lf-button lf-button--secondary" to="/">Back to calculator</Link>
      </Card>
    </main>
  );
}
