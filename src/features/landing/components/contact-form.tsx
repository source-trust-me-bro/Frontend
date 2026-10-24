"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState("");

  return (
    <form
      className="contact__form"
      id="contact-form"
      noValidate
      data-msg-ok="Thanks — this demo form still needs a support endpoint before it can deliver mail."
      data-msg-error="Please add your name, a valid email and a short message."
      onSubmit={(event) => {
        event.preventDefault();

        const form = event.currentTarget;
        const valid = form.checkValidity();

        setStatus(
          valid
            ? (form.dataset.msgOk ?? "")
            : (form.dataset.msgError ?? ""),
        );

        if (valid) {
          form.reset();
        } else {
          form.querySelector<HTMLElement>(":invalid")?.focus();
        }
      }}
    >
      <h3 className="m-text-5">Send us a note</h3>
      <p className="m-text-7">
        Owner-configurable demo form. Connect it to your support endpoint
        before launch.
      </p>
      <div className="m-field">
        <label className="m-field__label" htmlFor="contact-name">
          Your name
        </label>
        <input
          className="m-field__input"
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
        />
      </div>
      <div className="m-field">
        <label className="m-field__label" htmlFor="contact-email">
          Email
        </label>
        <input
          className="m-field__input"
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div className="m-field">
        <label className="m-field__label" htmlFor="contact-message">
          How can we help?
        </label>
        <textarea
          className="m-field__input"
          id="contact-message"
          name="message"
          rows={4}
          required
        ></textarea>
      </div>
      <button className="m-btn-2" type="submit">
        <span className="m-btn__label">Send message</span>
        <span className="m-btn__wave" aria-hidden="true">
          <i></i>
          <i></i>
          <i></i>
        </span>
      </button>
      <p
        className="contact__status m-text-8"
        role="status"
        aria-live="polite"
      >
        {status}
      </p>
    </form>
  );
}
