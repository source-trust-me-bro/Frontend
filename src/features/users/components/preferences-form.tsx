"use client";

import { useActionState } from "react";

import { updateUserPreferences } from "../server/update-user-preferences";
import type { PreferencesState } from "../types";
import type { PreferredLanguage } from "../schemas/user-profile-schema";

const languages: Array<{
  code: PreferredLanguage;
  label: string;
  note: string;
}> = [
  { code: "en", label: "English", note: "Source and interface" },
  { code: "fi", label: "Suomi", note: "Finnish reporting" },
];

const initialState: PreferencesState = { status: "idle", message: "" };

export function PreferencesForm({
  currentLanguage,
}: {
  currentLanguage: PreferredLanguage;
}) {
  const [state, formAction, pending] = useActionState(
    updateUserPreferences,
    initialState,
  );

  return (
    <section className="workspace__panel workspace__panel--span-7">
      <div className="workspace__panel-head">
        <h2 className="workspace__panel-title">Reading preferences</h2>
        <span className="workspace__panel-note">
          PATCH /api/v1/users/me
        </span>
      </div>
      <p className="workspace__panel-note">
        Your lead language is stored on the FastAPI profile and follows your
        Clerk account.
      </p>
      <form action={formAction} className="workspace__form">
        <fieldset className="workspace__fieldset">
          <legend className="workspace__legend">
            Preferred language
          </legend>
          <div className="language-choices">
            {languages.map((language) => (
              <label className="language-choice" key={language.code}>
                <input
                  type="radio"
                  name="preferred_language"
                  value={language.code}
                  defaultChecked={language.code === currentLanguage}
                  disabled={pending}
                />
                <span>{language.label}</span>
                <small>{language.note}</small>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="workspace__actions">
          <button
            className="workspace__submit"
            type="submit"
            disabled={pending}
          >
            {pending ? "Saving…" : "Save preferences"}
          </button>
          {state.status !== "idle" ? (
            <p
              className={`workspace__status workspace__status--${state.status}`}
              role="status"
              aria-live="polite"
            >
              {state.message}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}
