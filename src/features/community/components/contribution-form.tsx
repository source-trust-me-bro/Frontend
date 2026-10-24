"use client";

import { useActionState, useState } from "react";

import {
  sendContribution,
  type ContributionState,
} from "@/features/news/server/actions";
import type { MessageKind } from "@/features/news/schemas";

const initialState: ContributionState = { status: "idle", message: "" };

const kinds: Array<{ value: MessageKind; label: string; hint: string }> = [
  {
    value: "question",
    label: "Ask a question",
    hint: "We answer from published stories. If we cannot, an editor does. We never guess.",
  },
  {
    value: "tip",
    label: "Suggest a story",
    hint: "A tip is a lead for our editors to check. It is never published as fact.",
  },
  {
    value: "local_knowledge",
    label: "Share local knowledge",
    hint: "Something newcomers should know. An editor decides, and credits the community.",
  },
  {
    value: "correction",
    label: "Request a correction",
    hint: "Tell us what is wrong and what is right. Corrections are published openly.",
  },
];

const actionText: Record<string, string> = {
  answer: "Here is what we found",
  open_pitch: "Passed to the editors as a lead",
  open_correction: "A correction request is open",
  needs_human: "An editor will look at this",
  reject: "We could not use this",
};

export function ContributionForm({
  stories,
}: {
  stories: Array<{ id: string; headline: string }>;
}) {
  const [state, formAction, pending] = useActionState(
    sendContribution,
    initialState,
  );
  const [kind, setKind] = useState<MessageKind>("question");
  const active = kinds.find((item) => item.value === kind) ?? kinds[0];

  return (
    <form className="dash-form dash-form--wide" action={formAction}>
      <fieldset>
        <legend>What would you like to do?</legend>
        <div className="dash-seg dash-seg--wrap">
          {kinds.map((item) => (
            <label key={item.value}>
              <input
                type="radio"
                name="kind"
                value={item.value}
                checked={kind === item.value}
                onChange={() => setKind(item.value)}
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
        <small>{active.hint}</small>
      </fieldset>

      {kind === "correction" && stories.length ? (
        <label>
          Which story?
          <select name="story_id" defaultValue="">
            <option value="">Choose a story</option>
            {stories.map((story) => (
              <option key={story.id} value={story.id}>
                {story.headline}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <label>
        Your message
        <textarea
          name="text"
          rows={5}
          maxLength={4000}
          required
          placeholder="Do not include phone numbers or addresses. We do not need them."
        />
      </label>

      <p className="dash-privacy">
        <strong>Your privacy.</strong> An AI service hosted by Google helps our editors read
        and sort messages. If your message contains an e-mail address or a phone number, it
        goes straight to a person and the AI never sees it. People, not the AI, decide what
        is published or answered. We do not give the AI your name or account details.
      </p>

      <div className="dash-form__foot">
        <button className="dash-primary" type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send"}
        </button>
        {state.status === "error" ? (
          <p className="dash-status dash-status--error" role="alert">
            {state.message}
          </p>
        ) : null}
      </div>

      {state.status === "success" && state.triage ? (
        <div className="dash-reply" role="status">
          <strong>{actionText[state.triage.action] ?? "Received"}</strong>
          <p>{state.triage.reply || state.triage.reason}</p>
        </div>
      ) : null}
    </form>
  );
}
