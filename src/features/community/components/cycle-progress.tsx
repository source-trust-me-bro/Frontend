import type { CycleProgress } from "@/features/news/schemas";

function clock(seconds: number): string {
  const whole = Math.max(0, Math.round(seconds));

  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

const stateText: Record<string, string> = {
  done: "Done",
  running: "In progress",
  pending: "Waiting",
  skipped: "Skipped",
  stopped: "Stopped",
};

const taskNames: Record<string, string> = {
  "explainer.write_story": "Writing stories",
  "translator.translate_story": "Translations",
  "translator.backtranslate": "Translation checks",
  assess_evidence: "Evidence checks",
  extract_claims: "Claim extraction",
  "standards.second_opinion": "Standards opinions",
  select_stories: "Story selection",
  "connector.link_topics": "Topic links",
  architect_analyse: "Event analysis",
};

const agentNames: Record<string, string> = {
  newsroom: "Newsroom",
  reporter: "Reporter",
  translator: "Translator",
  editor: "Editor",
  collect: "Collector",
  group: "Architect",
};

function headline(progress: CycleProgress): string {
  if (progress.running) {
    const current = progress.stages.find((stage) => stage.key === progress.stage);

    return current ? `Working: ${current.label}` : "Starting";
  }

  if (progress.outcome === "failed") {
    return "The cycle failed";
  }

  if (progress.outcome === "stopped") {
    return "The cycle was stopped";
  }

  return "The cycle finished";
}

/**
 * What the agents are doing right now: one bar for the whole cycle with the time left, each stage
 * with its count and duration, how hard the model is being used, every story with the step and
 * language count it has reached, and a live feed of what just happened. Plain server-rendered
 * markup; the desk refreshes it every few seconds while the cycle runs.
 */
export function CycleProgressPanel({ progress }: { progress: CycleProgress }) {
  const state = progress.running ? "running" : progress.outcome || "idle";
  const latest = progress.activity[0];
  const { usage } = progress;
  const used = usage.budget ? Math.min(100, Math.round((100 * usage.calls) / usage.budget)) : 0;

  return (
    <section className="dash-prog" aria-label="Newsroom cycle progress" data-state={state}>
      <div className="dash-prog__top">
        <div>
          <strong className="dash-prog__headline">{headline(progress)}</strong>
          <span className="dash-prog__time">
            {progress.running ? "running for " : "took "}
            {clock(progress.elapsed_seconds)}
            {progress.running && progress.eta_seconds != null
              ? ` · about ${clock(progress.eta_seconds)} left`
              : ""}
          </span>
        </div>
        <span className="dash-prog__percent" aria-hidden="true">
          {progress.percent}%
        </span>
      </div>

      <div
        className="dash-prog__bar"
        role="progressbar"
        aria-label="Whole cycle"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress.percent}
        aria-valuetext={`${progress.percent} percent. ${headline(progress)}`}
      >
        <div className="dash-prog__fill" style={{ width: `${progress.percent}%` }} />
      </div>

      {progress.running && latest ? (
        <p className="dash-prog__now" aria-live="polite">
          <span className="dash-prog__pulse" aria-hidden="true" />
          <span>
            <strong>{agentNames[latest.agent] ?? latest.agent}:</strong> {latest.text}
          </span>
        </p>
      ) : null}

      {progress.note ? (
        <p className="dash-prog__note" role={progress.outcome === "failed" ? "alert" : "status"}>
          {progress.note}
        </p>
      ) : null}

      {usage.budget ? (
        <div className="dash-prog__usage" aria-label="Model usage">
          <div className="dash-prog__usage-row">
            <span>
              <strong>{usage.calls}</strong> of {usage.budget} model calls
            </span>
            <span>
              {progress.running ? `${usage.in_flight} running now` : `up to ${usage.peak_in_flight} at once`}
              {usage.max_concurrent ? ` (limit ${usage.max_concurrent})` : ""}
              {usage.avg_seconds != null ? ` · ${usage.avg_seconds.toFixed(1)} s per call` : ""}
            </span>
          </div>
          <div className="dash-prog__mini" aria-hidden="true">
            <div style={{ width: `${used}%` }} />
          </div>
          {Object.keys(usage.by_task).length ? (
            <ul className="dash-prog__tasks">
              {Object.entries(usage.by_task).map(([task, count]) => (
                <li key={task}>
                  {taskNames[task] ?? task} <strong>{count}</strong>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <ol className="dash-prog__stages">
        {progress.stages.map((stage) => (
          <li className="dash-prog__stage" data-status={stage.status} key={stage.key}>
            <span className="dash-prog__icon" aria-hidden="true" />
            <div className="dash-prog__stage-body">
              <div className="dash-prog__stage-row">
                <span className="dash-prog__stage-label">{stage.label}</span>
                <span className="dash-prog__stage-count">
                  {stage.status === "pending"
                    ? stateText.pending
                    : stage.total
                      ? `${Math.min(stage.done, stage.total)} of ${stage.total}`
                      : stateText[stage.status]}
                  {stage.seconds != null && stage.status !== "pending"
                    ? ` · ${stage.seconds < 60 ? `${Math.round(stage.seconds)} s` : clock(stage.seconds)}`
                    : ""}
                </span>
              </div>
              {stage.detail && stage.status !== "pending" ? (
                <span className="dash-prog__detail">{stage.detail}</span>
              ) : null}
              {stage.status === "running" || (stage.status === "done" && stage.total) ? (
                <div className="dash-prog__mini" aria-hidden="true">
                  <div style={{ width: `${stage.percent}%` }} />
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      {progress.stories.length ? (
        <>
          <h3 className="dash-prog__sub">Stories ({progress.stories.length})</h3>
          <ul className="dash-prog__stories">
            {progress.stories.map((story) => (
              <li className="dash-prog__story" data-status={story.status} key={story.pitch_id}>
                <div className="dash-prog__story-head">
                  <span className="dash-prog__story-title">{story.title}</span>
                  <span className="dash-prog__story-where">{story.community}</span>
                </div>
                <div
                  className="dash-prog__steps"
                  role="img"
                  aria-label={`${story.step_label}: step ${Math.min(story.steps_done + 1, story.steps_total)} of ${story.steps_total}`}
                >
                  {progress.story_steps.map((step, index) => (
                    <span
                      className="dash-prog__step"
                      data-state={
                        index < story.steps_done
                          ? "done"
                          : index === story.steps_done && story.status === "running"
                            ? "now"
                            : "todo"
                      }
                      key={step.key}
                      title={step.label}
                    />
                  ))}
                </div>
                <div className="dash-prog__story-foot">
                  <span className="dash-prog__story-step">
                    {story.status === "failed"
                      ? "Failed"
                      : story.status === "running"
                        ? story.step_label
                        : story.status === "awaiting_review"
                          ? "Ready for a person to review"
                          : story.status === "published"
                            ? "Published"
                            : story.status === "blocked"
                              ? "Blocked, needs a person"
                              : story.step_label}
                  </span>
                  {story.languages_total > 0 ? (
                    <span className="dash-prog__langs">
                      {story.languages_done} of {story.languages_total} languages
                    </span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {progress.activity.length ? (
        <details className="dash-prog__log" open={progress.running}>
          <summary>Live activity ({progress.activity.length} latest)</summary>
          <ol>
            {progress.activity.map((item, index) => (
              <li data-level={item.level} key={`${item.t}-${index}`}>
                <time>{clock(item.t)}</time>
                <span className="dash-prog__agent">{agentNames[item.agent] ?? item.agent}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ol>
        </details>
      ) : null}
    </section>
  );
}
