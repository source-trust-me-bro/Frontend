"use client";

import { useActionState } from "react";

import {
  languageLabels,
  languageSchema,
  type Language,
} from "@/features/news/schemas";
import {
  updateProfile,
  type FormState,
} from "@/features/news/server/actions";

const initialState: FormState = { status: "idle", message: "" };
const languages = languageSchema.options;

export function SettingsForm({
  displayName,
  email,
  language,
  selectedTopicIds,
  topics,
}: {
  displayName: string;
  email: string | null;
  language: Language;
  selectedTopicIds: string[];
  topics: Array<{ id: string; name: string; depth: number }>;
}) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState,
  );

  return (
    <form className="dash-form" action={formAction}>
      <label>
        Display name
        <input
          name="display_name"
          type="text"
          defaultValue={displayName}
          maxLength={120}
          autoComplete="name"
        />
      </label>
      {email ? (
        <label>
          Email
          <input type="email" value={email} readOnly disabled />
          <small>Your sign-in email cannot be changed here.</small>
        </label>
      ) : null}

      <fieldset>
        <legend>Reading language</legend>
        <div className="dash-seg">
          {languages.map((code) => (
            <label key={code}>
              <input
                type="radio"
                name="preferred_language"
                value={code}
                defaultChecked={code === language}
              />
              <span>{languageLabels[code]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Interests</legend>
        {topics.length ? (
          <div className="dash-checks">
            {topics.map((topic) => (
              <label key={topic.id} style={{ paddingLeft: topic.depth * 16 }}>
                <input
                  type="checkbox"
                  name="topic_ids"
                  value={topic.id}
                  defaultChecked={selectedTopicIds.includes(topic.id)}
                />
                <span>{topic.name}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="dash-muted">
            No topics exist yet. An editor can create them.
          </p>
        )}
      </fieldset>

      <div className="dash-form__foot">
        <button className="dash-primary" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </button>
        {state.status !== "idle" ? (
          <p
            className={`dash-status dash-status--${state.status}`}
            role="status"
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
