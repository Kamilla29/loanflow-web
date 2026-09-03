import { useQuery } from '@tanstack/react-query';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getApplicationStatus, type SubmittedApplication } from '@loanflow/api';
import { Badge, Card, Skeleton } from '@loanflow/ui';

export function ApplicationStatus() {
  const { applicationId = 'unknown' } = useParams();
  const location = useLocation();
  const submission = location.state as SubmittedApplication | null;

  const query = useQuery({
    queryKey: ['application-status', applicationId],
    queryFn: () => getApplicationStatus(applicationId),
    enabled: !submission
  });

  const data = submission ?? query.data;

  return (
    <main id="main-content" className="page-shell status-page">
      <p className="eyebrow">Application status</p>
      <h1 className="page-title">Application received</h1>
      <p className="page-lead">
        A status route demonstrates direct navigation, loading state and query-backed recovery when
        router state is unavailable.
      </p>

      <Card className="status-card">
        {query.isLoading && !submission ? (
          <div role="status" aria-live="polite">
            <span className="sr-only">Loading application status</span>
            <Skeleton lines={4} />
          </div>
        ) : (
          <>
            <Badge tone="success">{data?.status ?? 'received'}</Badge>
            <dl>
              <div>
                <dt>Reference</dt>
                <dd data-cy="application-reference">{applicationId}</dd>
              </div>
              <div>
                <dt>Submitted</dt>
                <dd>
                  {data?.submittedAt
                    ? new Date(data.submittedAt).toLocaleString('en-GB')
                    : 'This browser session'}
                </dd>
              </div>
              <div>
                <dt>Next step</dt>
                <dd>Illustrative review</dd>
              </div>
            </dl>
          </>
        )}

        <Link className="lf-button lf-button--secondary" to="/">
          Back to calculator
        </Link>
      </Card>
    </main>
  );
}
