import { canEdit, feedbackSchema, pageSchema } from "@/features/news/schemas";
import { apiRequest, attempt, getProfile } from "@/features/news/server/api";
import { getCommunities } from "@/features/news/server/data";

import { AppointModeratorForm } from "./appoint-moderator-form";

/** Editor side panel: appoint trusted voices and read reader feedback. */
export async function EditorAside() {
  const result = await attempt(async () => {
    const [profile, communities, feedback] = await Promise.all([
      getProfile(),
      getCommunities().catch(() => []),
      apiRequest("/feedback?page_size=10", pageSchema(feedbackSchema)),
    ]);

    return { profile, communities, feedback };
  });

  if (!result.ok) {
    return (
      <aside
        className="dash-aside dash-aside--editor"
        aria-label="Trusted voices and reader feedback"
      >
        <p className="dash-ed-note" role="alert">
          {result.message}
        </p>
      </aside>
    );
  }

  if (!canEdit(result.data.profile)) {
    return (
      <aside
        className="dash-aside dash-aside--editor"
        aria-label="Trusted voices and reader feedback"
      >
        <p className="dash-ed-note">
          Editor access is required to appoint trusted voices.
        </p>
      </aside>
    );
  }

  const { communities, feedback } = result.data;
  const languages = Array.from(
    new Map(
      communities
        .flatMap((community) => community.languages)
        .map((lane) => [lane.code, { code: lane.code, label: lane.label }]),
    ).values(),
  );

  return (
    <aside
      className="dash-aside dash-aside--editor"
      aria-label="Trusted voices and reader feedback"
    >
      <AppointModeratorForm
        canAppointAdmins
        communities={communities.map((community) => ({
          id: community.id,
          name: community.name,
        }))}
        languages={languages}
      />

      <section className="dash-ed-panel">
        <div className="dash-ed-panel__head">
          <h2 className="dash-ed-panel__title">Reader feedback</h2>
          <span className="dash-chip">{feedback.total}</span>
        </div>
        {feedback.items.length ? (
          <ul className="dash-ed-rows">
            {feedback.items.map((item) => (
              <li className="dash-ed-row" key={item.id}>
                <strong>
                  {item.subject || "No subject"} ·{" "}
                  {item.display_name || item.email || "Reader"}
                </strong>
                <span>{item.message}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="dash-ed-note">No feedback yet.</p>
        )}
      </section>
    </aside>
  );
}
