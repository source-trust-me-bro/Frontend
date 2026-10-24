"use client";

import { useState, useTransition } from "react";

import { setReadingLanguages } from "@/features/news/server/actions";

export type LanguageOption = { code: string; label: string; count?: number };

/**
 * Which languages the reader reads. Stories without an edition in one of these never show up
 * in Following, so an English reader is not shown Sámi stories.
 */
export function ReadingLanguages({
  options,
  main,
  alsoReads,
}: {
  options: LanguageOption[];
  main: string;
  alsoReads: string[];
}) {
  const [primary, setPrimary] = useState(main);
  const [extra, setExtra] = useState<string[]>(alsoReads.filter((code) => code !== main));
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function save(nextPrimary: string, nextExtra: string[]) {
    setMessage("");
    startTransition(async () => {
      const result = await setReadingLanguages(nextPrimary, nextExtra);

      setMessage(result.ok ? "Saved." : (result.message ?? "That did not work."));
    });
  }

  return (
    <fieldset
      className="dash-reading"
      disabled={pending}
      aria-labelledby="dash-reading-title"
    >
      <h2 className="dash-reading__title" id="dash-reading-title">
        I read in
      </h2>
      <label className="dash-reading__main">
        <span>Main language</span>
        <select
          value={primary}
          onChange={(event) => {
            const next = event.target.value;
            const nextExtra = extra.filter((code) => code !== next);

            setPrimary(next);
            setExtra(nextExtra);
            save(next, nextExtra);
          }}
        >
          {options.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label}
              {option.count === undefined ? "" : ` (${option.count})`}
            </option>
          ))}
        </select>
      </label>
      <div className="dash-chips" role="group" aria-label="Also read in">
        {options
          .filter((option) => option.code !== primary)
          .map((option) => {
            const on = extra.includes(option.code);

            return (
              <button
                key={option.code}
                type="button"
                className={`dash-chip${on ? " is-active" : ""}`}
                aria-pressed={on}
                onClick={() => {
                  const next = on
                    ? extra.filter((code) => code !== option.code)
                    : [...extra, option.code];

                  setExtra(next);
                  save(primary, next);
                }}
              >
                {option.label}
                {option.count === undefined ? null : (
                  <span className="dash-muted"> {option.count}</span>
                )}
              </button>
            );
          })}
      </div>
      <p className="dash-muted dash-reading__hint">
        Stories that are not available in a language you read are not shown.
      </p>
      {message ? (
        <span className="dash-status" role="status">
          {message}
        </span>
      ) : null}
    </fieldset>
  );
}
