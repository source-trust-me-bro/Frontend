import { getBackendHealth } from "../server/get-backend-health";

export async function HealthStatusCard() {
  const result = await getBackendHealth();

  return (
    <section className="workspace__panel workspace__panel--span-4">
      <div className="workspace__panel-head">
        <h2 className="workspace__panel-title">Backend health</h2>
        <span
          className={
            result.status === "ok"
              ? "workspace__badge"
              : "workspace__badge workspace__badge--danger"
          }
        >
          {result.status === "ok" ? "Ready" : "Unavailable"}
        </span>
      </div>
      <p className="workspace__panel-note">
        GET /api/v1/health/ready · server-to-server probe
      </p>
      {result.status === "ok" ? (
        <dl className="workspace__facts">
          <div className="workspace__fact">
            <dt>Status</dt>
            <dd>{result.health.status}</dd>
          </div>
          <div className="workspace__fact">
            <dt>Database</dt>
            <dd>{result.health.database || "not reported"}</dd>
          </div>
          <div className="workspace__fact">
            <dt>Version</dt>
            <dd>{result.health.version || "—"}</dd>
          </div>
          <div className="workspace__fact">
            <dt>Checked</dt>
            <dd>{result.health.checked_at || "just now"}</dd>
          </div>
        </dl>
      ) : (
        <div className="workspace__empty">
          <span className="workspace__badge workspace__badge--warning">
            FastAPI offline
          </span>
          <p>{result.message}</p>
        </div>
      )}
    </section>
  );
}
