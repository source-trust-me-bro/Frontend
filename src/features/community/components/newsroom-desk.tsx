import { attempt } from "@/features/news/server/api";
import { getCycleStatus, getReviewQueue } from "@/features/news/server/data";

import { AutoRefresh } from "./auto-refresh";
import { CycleProgressPanel } from "./cycle-progress";
import { DeskForm } from "./desk-form";
import {
  addStorySource,
  runNewsroomCycle,
  stopNewsroomCycle,
  submitReview,
} from "@/features/news/server/actions";

export const roleLabels: Record<string, string> = {
  editor_in_chief: "Editor-in-chief",
  language_reviewer: "Language reviewer",
  community_reviewer: "Community reviewer",
  subject_expert: "Subject expert",
};

const originLabels: Record<string, string> = {
  report: "From the reporting",
  agent_reference: "Added by the newsroom",
  editor: "Added by an editor",
};

/**
 * The desk where people decide what is published. Agents only prepare and propose.
 *
 * Editors can act as editor-in-chief, check and add sources, and run cycles. Community
 * admins and moderators, the community's trusted voices, can act only in the review roles
 * they were given, and only on stories for their own community.
 */
export async function NewsroomDesk({
  allowedRoles,
  isEditor,
  memberCommunityId = null,
  title = "Newsroom desk",
}: {
  allowedRoles: string[];
  isEditor: boolean;
  /** The community this person belongs to. Community roles apply only there. */
  memberCommunityId?: string | null;
  title?: string;
}) {
  const result = await attempt(getReviewQueue);
  const cycle = isEditor ? await attempt(getCycleStatus) : null;
  const running = cycle?.ok === true && cycle.data.status === "running";

  return (
    <section className="dash-ed-panel">
      <div className="dash-ed-panel__head">
        <h2 className="dash-ed-panel__title">{title}</h2>
        {isEditor ? (
          <>
            <DeskForm action={runNewsroomCycle} className="dash-ed-inline">
              <label className="dash-ed-label" htmlFor="news-count">
                How many news
              </label>
              <select id="news-count" name="news_count" defaultValue="10">
                <option value="10">10</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <button className="dash-ed-btn" type="submit">
                {running ? "Cycle running…" : "Run a newsroom cycle"}
              </button>
            </DeskForm>
            {running ? (
              <DeskForm action={stopNewsroomCycle}>
                <button className="dash-ed-btn dash-ed-btn--danger" type="submit">
                  Stop
                </button>
              </DeskForm>
            ) : null}
          </>
        ) : null}
      </div>
      <AutoRefresh active={running} everyMs={8000} />
      {cycle?.ok && cycle.data.progress && (cycle.data.progress.running || cycle.data.progress.outcome) ? (
        <CycleProgressPanel progress={cycle.data.progress} />
      ) : cycle?.ok && cycle.data.status !== "idle" ? (
        <p className="dash-ed-note" role="status">
          {cycle.data.status === "running"
            ? "A cycle is running. This page updates itself."
            : cycle.data.status === "done"
              ? `Last cycle ${cycle.data.summary?.stopped_reason ? `stopped (${cycle.data.summary.stopped_reason})` : "finished"}: ${cycle.data.summary?.articles_processed ?? 0} articles read, ${cycle.data.summary?.pitches ?? 0} stories prepared${cycle.data.summary?.articles_deferred ? `, ${cycle.data.summary.articles_deferred} saved for the next cycle` : ""}.`
              : `The last cycle failed: ${cycle.data.error ?? "unknown error"}`}
        </p>
      ) : null}
      <p className="dash-ed-note">
        Agents find, explain and check stories. Nothing is published until named people
        approve it. You review under your own account name, in the roles you hold:{" "}
        {allowedRoles.map((role) => roleLabels[role] ?? role).join(", ") || "none"}.
      </p>

      {!result.ok ? (
        <p className="dash-ed-note" role="alert">
          {result.status === 503
            ? "The newsroom service is not running. Start it, then reload."
            : result.message}
        </p>
      ) : result.data.length === 0 ? (
        <p className="dash-ed-note">No stories are waiting for review.</p>
      ) : (
        <ul className="dash-ed-list">
          {result.data.map((task) => {
            // Offer only what the server will accept: the editor-in-chief role for editors,
            // and community roles only on stories for the community the person belongs to.
            const mine = task.missing_roles.filter((role) =>
              role === "editor_in_chief"
                ? isEditor && allowedRoles.includes(role)
                : allowedRoles.includes(role) &&
                  memberCommunityId !== null &&
                  task.community_id === memberCommunityId,
            );

            return (
              <li className="dash-ed-task" key={task.story_id}>
                <div className="dash-ed-task__head">
                  <strong>{task.headline}</strong>
                  <span className="dash-tag">
                    {task.community} · risk {task.risk_tier}
                  </span>
                </div>
                {task.standfirst ? <p>{task.standfirst}</p> : null}
                {task.type === "language_review" ? (
                  <p className="dash-ed-note">
                    Already published in English. Still waiting for a language reviewer:{" "}
                    {Object.keys(task.translations)
                      .map((lang) => lang.toUpperCase())
                      .join(", ")}
                    .
                  </p>
                ) : null}

                <p className="dash-ed-label">
                  Sources{isEditor ? " (check them, add more if needed)" : ""}
                </p>
                <ul className="dash-ed-sources">
                  {task.sources.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} target="_blank" rel="noopener noreferrer">
                        {source.name}
                      </a>
                      {source.official ? <span className="dash-tag">Official</span> : null}
                      <span className="dash-tag dash-tag--note">
                        {originLabels[source.origin] ?? source.origin}
                      </span>
                    </li>
                  ))}
                </ul>

                {isEditor ? (
                  <DeskForm action={addStorySource} className="dash-ed-inline">
                    <input type="hidden" name="story_id" value={task.story_id} />
                    <input name="name" placeholder="Source name" required />
                    <input name="url" type="url" placeholder="https://…" required />
                    <label>
                      <input type="checkbox" name="official" /> Official
                    </label>
                    <button className="dash-ed-btn" type="submit">
                      Add source
                    </button>
                  </DeskForm>
                ) : null}

                {task.blocking_checks.length ? (
                  <p className="dash-ed-warn" role="alert">
                    Blocked by: {task.blocking_checks.join("; ")}
                  </p>
                ) : null}
                <p className="dash-ed-label">
                  Still needed:{" "}
                  {task.missing_roles.map((role) => roleLabels[role] ?? role).join(", ") ||
                    "nothing"}
                </p>
                <p className="dash-ed-label">
                  Translations:{" "}
                  {Object.entries(task.translations)
                    .map(([lang, status]) => `${lang.toUpperCase()} ${status.replaceAll("_", " ")}`)
                    .join(" · ") || "none"}
                </p>

                {mine.length ? (
                  mine.map((role) => (
                    <DeskForm
                      action={submitReview}
                      className="dash-ed-inline dash-ed-inline--review"
                      key={role}
                    >
                      <input type="hidden" name="pitch_id" value={task.pitch_id} />
                      <input type="hidden" name="role" value={role} />
                      <span className="dash-ed-label">{roleLabels[role] ?? role}</span>
                      {role === "editor_in_chief" && task.missing_roles.length > 1 ? (
                        <span className="dash-ed-note">
                          Also needed before it goes out:{" "}
                          {task.missing_roles
                            .filter((other) => other !== "editor_in_chief")
                            .map((other) => roleLabels[other] ?? other)
                            .join(", ")}
                        </span>
                      ) : null}
                      <input name="notes" placeholder="Notes (needed when asking for changes)" />
                      {role === "editor_in_chief" ? (
                        <fieldset className="dash-ed-where">
                          <legend className="dash-ed-label">Publish to</legend>
                          <label>
                            <input type="checkbox" name="destinations" value="dashboard" defaultChecked />{" "}
                            Dashboard
                          </label>
                          <label>
                            <input type="checkbox" name="destinations" value="community" defaultChecked />{" "}
                            Community page
                          </label>
                        </fieldset>
                      ) : null}
                      <button
                        className="dash-ed-btn dash-ed-btn--primary"
                        type="submit"
                        name="decision"
                        value="approve"
                      >
                        {role === "language_reviewer"
                          ? "Approve language"
                          : role === "editor_in_chief" && task.missing_roles.length === 1
                            ? "Publish"
                            : "Approve"}
                      </button>
                      <button
                        className="dash-ed-btn"
                        type="submit"
                        name="decision"
                        value="request_changes"
                      >
                        Request changes
                      </button>
                      <button
                        className="dash-ed-btn dash-ed-btn--danger"
                        type="submit"
                        name="decision"
                        value="reject"
                      >
                        Reject
                      </button>
                    </DeskForm>
                  ))
                ) : (
                  <p className="dash-ed-note">
                    Nothing is waiting on you here. Other reviewers still need to act.
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
