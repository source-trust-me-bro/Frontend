import { LandingCta } from "./landing-cta";

/** Replaces the old demo form: feedback goes through the authenticated dashboard form. */
export function ContactPanel() {
  return (
    <div className="contact__form" id="contact-form">
      <h3 className="m-text-5">Send us your thoughts</h3>
      <p className="m-text-8">
        Feedback is stored with your account and read by the editors. Sign in
        or create a free account to send it.
      </p>
      <ul className="m-text-8">
        <li>Which news sources should be added?</li>
        <li>Which languages and topics are missing?</li>
        <li>What would make a story easier to trust?</li>
      </ul>
      <LandingCta
        className="m-btn-2"
        label="Write feedback"
        href="/dashboard/feedback"
      />
    </div>
  );
}
