"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";

import type { FormState } from "@/features/news/server/actions";

const initialState: FormState = { status: "idle", message: "" };

/**
 * A form for the newsroom desk. When the server refuses an action, the person sees why,
 * and the page keeps working. An action never crashes the page.
 */
export function DeskForm({
  action,
  className,
  children,
}: {
  action: (previous: FormState, formData: FormData) => Promise<FormState>;
  className?: string;
  children: ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className={className} aria-busy={pending}>
      {children}
      {state.status !== "idle" ? (
        <p
          className={`dash-status dash-status--${state.status}`}
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
