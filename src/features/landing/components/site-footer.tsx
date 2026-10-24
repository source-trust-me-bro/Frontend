import type { CSSProperties } from "react";

/**
 * The site footer, shared by the landing page and the pages that sit beside it. `base` is "" on
 * the landing page itself and "/" elsewhere, so the in-page links still land on the right section.
 */
export function SiteFooter({ base = "" }: { base?: string }) {
  return (
    <footer
      className="footer on-dark"
      id="footer"
      data-8b-section="footer"
      aria-labelledby="footer-title"
    >
      <div className="footer__sheet m-band-4" aria-hidden="true"></div>
      <div className="footer__inner l-wrap">
        <div className="footer__top">
          <div className="footer__pitch">
            <h2 className="m-text-5" id="footer-title">
              News intelligence you can audit.
            </h2>
            <p className="m-text-4">
              Multilingual news, with the evidence attached.
            </p>
            <a className="m-link m-text-6" href={`${base}#hero`}>
              Back to the top
            </a>
          </div>
          <div className="footer__cols m-text-6">
            <div className="footer__col">
              <h2 className="m-text-6">Product</h2>
              <ul>
                <li>
                  <a className="m-link-2" href={`${base}#listen`}>
                    How it works
                  </a>
                </li>
                <li>
                  <a className="m-link-2" href={`${base}#calls`}>
                    What&rsquo;s built
                  </a>
                </li>
                <li>
                  <a className="m-link-2" href={`${base}#rooms`}>
                    Events
                  </a>
                </li>
                <li>
                  <a className="m-link-2" href={`${base}#tune`}>
                    Your settings
                  </a>
                </li>
              </ul>
            </div>
            <div className="footer__col">
              <h2 className="m-text-6">Support</h2>
              <ul>
                <li>
                  <a className="m-link-2" href="/dashboard/feedback">
                    Send feedback
                  </a>
                </li>
                <li>
                  <a className="m-link-2" href={`${base}#contact`}>
                    Get involved
                  </a>
                </li>
                <li>
                  <a className="m-link-2" href={`${base}#faq`}>
                    Questions
                  </a>
                </li>
                <li>
                  <a className="m-link-2" href={`${base}#setup`}>
                    Editor access
                  </a>
                </li>
              </ul>
            </div>
            <div className="footer__col">
              <h2 className="m-text-6">Company</h2>
              <ul>
                <li>
                  <a className="m-link-2" href={`${base}#voices`}>
                    Principles
                  </a>
                </li>
                <li>
                  <a className="m-link-2" href={`${base}#setup`}>
                    Roadmap
                  </a>
                </li>
                <li>
                  <a className="m-link-2" href="/pricing">
                    Pricing
                  </a>
                </li>
                <li>
                  <a className="m-link-2" href="/funding">
                    How we are funded
                  </a>
                </li>
                <li>
                  <a className="m-link-2" href="/dashboard">
                    Open dashboard
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer__brand" aria-hidden="true">
          <svg className="footer__logo" viewBox="0 0 40 28">
            <path
              className="footer__logo-a"
              pathLength="1"
              d="M3 19C10 5 17 5 21 14s11 9 16-6"
            />
            <path
              className="footer__logo-b"
              pathLength="1"
              d="M3 10c7 13 14 13 18 4s11-10 16 5"
            />
          </svg>
          <p
            className="footer__word m-text-2"
            style={{ "--len": 12 } as CSSProperties}
          >
            KalevaShorts
          </p>
        </div>
        <div className="footer__legal m-text-7">
          <p>© 2026 KalevaShorts.</p>
          <ul>
            <li>
              <a className="m-link" href={`${base}#voices`}>
                Principles
              </a>
            </li>
            <li>
              <a className="m-link" href={`${base}#faq`}>
                FAQ
              </a>
            </li>
            <li>
              <a className="m-link" href={`${base}#hero`}>
                Back to top
              </a>
            </li>
          </ul>
        </div>
        <p className="footer__note m-text-7">
          KalevaShorts is in active development. Check the linked original
          report when accuracy matters.
        </p>
      </div>
    </footer>
  );
}
