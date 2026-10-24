"use client";

import { useActionState } from "react";

import {
  sendFeedback,
  type FormState,
} from "@/features/news/server/actions";

const initialState: FormState = { status: "idle", message: "" };

export function FeedbackForm() {
  const [state, formAction, pending] = useActionState(
    sendFeedback,
    initialState,
  );

  return (
    <form className="dash-form" action={formAction}>
      <label>
        Subject (optional)
        <input name="subject" type="text" maxLength={200} />
      </label>
      <label>
        Message
        <textarea
          name="message"
          rows={6}
          maxLength={4000}
          required
          placeholder="What should the team improve?"
        />
      </label>
      <div className="dash-form__foot">
        <button className="dash-primary" type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send feedback"}
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
