"use client";

import { useActionState, useState, useTransition } from "react";

import {
  appointCommunityRole,
  searchAccounts,
  type AccountHit,
  type FormState,
} from "@/features/news/server/actions";

const reviewRoles = [
  { value: "community_reviewer", label: "Community reviewer" },
  { value: "language_reviewer", label: "Language reviewer" },
  { value: "subject_expert", label: "Subject expert" },
];

const initialState: FormState = { status: "idle", message: "" };

/**
 * Community admins and moderators are the community's trusted voices. Search for the person
 * by name, choose them, and give them a position, review roles and languages.
 *
 * Editors can appoint community admins and moderators in any community. A community admin
 * can appoint moderators in their own community. The backend enforces this.
 */
export function AppointModeratorForm({
  languages,
  canAppointAdmins,
  communities,
}: {
  languages: Array<{ code: string; label: string }>;
  canAppointAdmins: boolean;
  communities?: Array<{ id: string; name: string }>;
}) {
  const [state, formAction, pending] = useActionState(appointCommunityRole, initialState);
  const [query, setQuery] = useState("");
  const [accounts, setAccounts] = useState<AccountHit[]>([]);
  const [searched, setSearched] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searching, startSearch] = useTransition();

  const search = () =>
    startSearch(async () => {
      const result = await searchAccounts(query);

      setSearched(true);
      setSearchError(result.ok ? "" : result.message);
      setAccounts(result.ok ? result.accounts : []);
    });

  return (
    <section className="dash-ed-panel">
      <div className="dash-ed-panel__head">
        <h2 className="dash-ed-panel__title">Trusted voices</h2>
      </div>
      <p className="dash-ed-note">
        The people who run a community are its trusted voices. Search for someone by name,
        then choose their position, the roles they may review as, and the languages they may
        approve. Their name is shown beside what they approved. They need to have signed in once.
      </p>

      <div className="dash-ed-search">
        <label>
          Find a person by name
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                if (query.trim().length >= 2) search();
              }
            }}
            placeholder="Start typing a name"
            minLength={2}
          />
        </label>
        <button
          className="dash-ed-btn"
          type="button"
          disabled={searching || query.trim().length < 2}
          onClick={search}
        >
          {searching ? "Searching…" : "Search"}
        </button>
      </div>
      {searchError ? (
        <p className="dash-ed-note" role="alert">
          {searchError}
        </p>
      ) : null}

      <form action={formAction} className="dash-ed-form">
        {searched && !searchError ? (
          accounts.length ? (
            <fieldset>
              <legend>Choose the person</legend>
              {accounts.map((account) => (
                <label key={account.id} className="dash-ed-check">
                  <input type="radio" name="user_id" value={account.id} required />
                  <span>
                    {account.display_name}
                    {account.email_hint ? (
                      <span className="dash-ed-hint"> · {account.email_hint}</span>
                    ) : null}
                  </span>
                </label>
              ))}
            </fieldset>
          ) : (
            <p className="dash-ed-note">
              No account matches that name. They need to sign in once first.
            </p>
          )
        ) : null}

        {communities ? (
          <label>
            Community
            <select name="community_id" required defaultValue="">
              <option value="" disabled>
                Choose
              </option>
              {communities.map((community) => (
                <option key={community.id} value={community.id}>
                  {community.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <label>
          Position
          <select name="community_role" defaultValue="moderator">
            <option value="moderator">Moderator</option>
            {canAppointAdmins ? <option value="admin">Community admin</option> : null}
            <option value="member">Remove (back to member)</option>
          </select>
        </label>
        <fieldset>
          <legend>May review as</legend>
          {reviewRoles.map((role) => (
            <label key={role.value} className="dash-ed-check">
              <input type="checkbox" name="review_roles" value={role.value} /> {role.label}
            </label>
          ))}
        </fieldset>
        <fieldset>
          <legend>Languages they can approve</legend>
          {languages.map((language) => (
            <label key={language.code} className="dash-ed-check">
              <input type="checkbox" name="review_languages" value={language.code} />{" "}
              {language.label}
            </label>
          ))}
        </fieldset>
        <div className="dash-ed-inline">
          <button className="dash-ed-btn dash-ed-btn--primary" type="submit" disabled={pending || !accounts.length}>
            {pending ? "Saving…" : "Save"}
          </button>
          {state.status !== "idle" ? (
            <span
              className={`dash-status dash-status--${state.status}`}
              role="status"
            >
              {state.message}
            </span>
          ) : null}
        </div>
      </form>
    </section>
  );
}
