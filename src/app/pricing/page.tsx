import type { Metadata } from "next";
import Link from "next/link";

import { LandingCta } from "@/features/landing/components/landing-cta";
import { SiteFooter } from "@/features/landing/components/site-footer";
import { SiteNav } from "@/features/landing/components/site-nav";
import "@/styles/pricing.css";
import { ReaderPlans } from "@/features/pricing/components/reader-plans";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "What readers and organisations pay for KalevaShorts, what each tier includes, and what money never buys.",
};

type ComparisonRow = {
  feature: string;
  free: boolean | string;
  supporter: boolean | string;
  patron: boolean | string;
};

const comparison: ComparisonRow[] = [
  {
    feature: "Every published story, in all three languages",
    free: true,
    supporter: true,
    patron: true,
  },
  {
    feature: "The first-week guide for newcomers",
    free: true,
    supporter: true,
    patron: true,
  },
  {
    feature: "Topic following, saved stories and reading history",
    free: true,
    supporter: true,
    patron: true,
  },
  {
    feature: "Sources, disclosures and public corrections",
    free: true,
    supporter: true,
    patron: true,
  },
  {
    feature: "The editor's weekly briefing",
    free: false,
    supporter: true,
    patron: true,
  },
  { feature: "Ad-free reading", free: false, supporter: true, patron: true },
  {
    feature: "Guest passes",
    free: false,
    supporter: false,
    patron: "2 / month",
  },
  { feature: "Newsroom events", free: false, supporter: false, patron: true },
  {
    feature: "Named in the annual transparency report",
    free: false,
    supporter: false,
    patron: "Optional",
  },
];

const organisations = [
  {
    name: "Community channel",
    who: "Employers and tourism companies",
    price: "From €450",
    period: "per month, billed yearly",
    features: [
      "One channel for staff, residents or a whole season",
      "Unlimited readers, with no per-seat fees",
      "Onboarding guide and a quarterly impact report",
      "A named editor as your contact",
      "No editorial approval rights",
    ],
  },
  {
    name: "Campus licence",
    who: "Universities and institutes",
    price: "From €3,900",
    period: "per year",
    features: [
      "Students and staff at one institution",
      "The first-week guide adapted to your orientation",
      "Two translation-review workshops each year",
      "A usage report for your international office",
      "Reader access stays free for students",
    ],
  },
  {
    name: "Public-service channel",
    who: "Municipalities and public services",
    price: "From €7,500",
    period: "per year",
    features: [
      "An official-information channel in plain language",
      "Accessibility and readability review",
      "A service-level agreement for corrections",
      "Priority contact for notices and emergencies",
      "Published as official information, never as news",
    ],
  },
];

const addOns = [
  {
    name: "Recruitment listing",
    price: "€250 per listing",
    detail:
      "Labelled as a listing and kept apart from news. Employers do not get to choose the surrounding coverage.",
  },
  {
    name: "Community event sponsorship",
    price: "€900 per event",
    detail:
      "The event is marked as sponsored. Sponsorship buys visibility, not a say in what is reported.",
  },
  {
    name: "Translation review workshop",
    price: "€1,200 per day",
    detail:
      "A working session with your communications team. It does not include editorial sign-off or early drafts.",
  },
  {
    name: "Archive and API access",
    price: "€2,400 per year",
    detail:
      "Read-only, rate-limited access to published stories with sources attached. No access to drafts or embargoed work.",
  },
  {
    name: "Additional language desk",
    price: "From €6,000 per year",
    detail:
      "Expands Sámi or Swedish coverage. Requires a named native-speaking reviewer before anything is published.",
  },
];

const faqs = [
  {
    question: "Is the news really free?",
    answer:
      "Yes. Every published story, the topic tree and the first-week guide are free in Finnish, English and Swedish. Nobody in a vulnerable position is asked to pay for essential information.",
  },
  {
    question: "Can I cancel a paid reader tier?",
    answer:
      "Yes, at any time. You keep access until the end of the period you have paid for, and you can export your saved stories before you go.",
  },
  {
    question: "Why do organisations pay \u201cfrom\u201d prices?",
    answer:
      "The work scales with the size of the community and the amount of translation and review involved. A resort with one seasonal channel and a municipality with an official-information service do not cost the same to serve. Every quote lists the assumptions in writing.",
  },
  {
    question: "Does a licence let a payer see a story early?",
    answer:
      "Never. Payers do not see drafts, do not approve copy and do not ask for changes. If a funder is connected to the subject of a story, that story says so. The funding page sets out the full promises.",
  },
  {
    question: "Do you add VAT?",
    answer:
      "Prices exclude VAT. Finnish VAT is added where required, and invoices are issued in euros. Public bodies and grant-funded partners can request the invoicing details they need.",
  },
  {
    question: "Will prices change without warning?",
    answer:
      "Reader prices change with at least 60 days\u2019 notice. Organisation licences hold their agreed price for the term of the contract, and renewals are quoted in writing before they begin.",
  },
  {
    question: "Is checkout live?",
    answer:
      "Not yet. This page is the plan we are testing with readers and organisations. Paid tiers currently open a conversation through the feedback form; no card is charged from this page.",
  },
];

function comparisonValue(value: boolean | string) {
  if (value === true) {
    return <span className="pricing-table__yes">Included</span>;
  }

  if (value === false) {
    return <span className="pricing-table__no">—</span>;
  }

  return <span>{value}</span>;
}

export default function PricingPage() {
  return (
    <>
      <SiteNav base="/" current="/pricing" />
      <main className="pricing-page" id="main">
        <section
          className="pricing-hero on-dark"
          aria-labelledby="pricing-title"
        >
          <div className="pricing-hero__inner l-wrap">
            <div className="pricing-hero__copy">
              <p className="pricing-eyebrow">Pricing</p>
              <h1 className="m-text-2" id="pricing-title">
                Pay for the reporting you value. <em>Never for the truth.</em>
              </h1>
              <p className="pricing-hero__lead">
                The news is free. Organisations pay for the community channels
                they rely on. Readers who want more can support the newsroom,
                and nobody in a vulnerable position is asked to pay for
                essential information.
              </p>
              <p className="pricing-hero__note">
                This is our pricing plan, not a live checkout. Prices are
                targets in euros, excluding VAT, and become binding only in a
                signed contract. Anything marked “from” depends on the size of
                the community and the language work involved.
              </p>
            </div>
            <aside className="pricing-glance" aria-label="Prices at a glance">
              <p className="pricing-glance__title">At a glance</p>
              <div className="pricing-glance__row">
                <span className="pricing-glance__who">Reading the news</span>
                <span className="pricing-glance__price">Free</span>
              </div>
              <div className="pricing-glance__row">
                <span className="pricing-glance__who">Supporter</span>
                <span className="pricing-glance__price">
                  €8 <small>/ month</small>
                </span>
              </div>
              <div className="pricing-glance__row">
                <span className="pricing-glance__who">Community channel</span>
                <span className="pricing-glance__price">
                  From €450 <small>/ month</small>
                </span>
              </div>
              <div className="pricing-glance__row">
                <span className="pricing-glance__who">Recruitment listing</span>
                <span className="pricing-glance__price">
                  €250 <small>/ listing</small>
                </span>
              </div>
            </aside>
          </div>
        </section>

        <div className="pricing-page__inner">
          <ReaderPlans />

          <section className="pricing-section" aria-labelledby="compare-title">
            <div className="pricing-section__head">
              <div>
                <p className="pricing-eyebrow">Compare</p>
                <h2 id="compare-title">What each reader tier includes</h2>
              </div>
            </div>
            <div className="pricing-table-wrap">
              <table className="pricing-table">
                <caption className="sr-only">
                  Reader tier comparison: Free, Supporter and Patron
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Feature</th>
                    <th scope="col">Free</th>
                    <th scope="col">Supporter</th>
                    <th scope="col">Patron</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.feature}>
                      <th scope="row">{row.feature}</th>
                      <td>{comparisonValue(row.free)}</td>
                      <td>{comparisonValue(row.supporter)}</td>
                      <td>{comparisonValue(row.patron)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section
            className="pricing-orgs"
            aria-labelledby="organisations-title"
          >
            <div className="pricing-section__head">
              <div>
                <p className="pricing-eyebrow">Organisations</p>
                <h2 id="organisations-title">
                  Licences for community channels
                </h2>
                <p className="pricing-section__intro">
                  A licence pays for a channel, not for influence. Readers never
                  pay, and payers never choose stories, see drafts early or ask
                  for changes.
                </p>
              </div>
            </div>
            <div className="pricing-grid pricing-grid--orgs">
              {organisations.map((org) => (
                <article
                  className="pricing-card pricing-card--org"
                  key={org.name}
                >
                  <div className="pricing-card__top">
                    <h3>{org.name}</h3>
                  </div>
                  <p className="pricing-card__who">{org.who}</p>
                  <p className="pricing-card__price">
                    {org.price} <small>{org.period}</small>
                  </p>
                  <ul className="pricing-card__features">
                    {org.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <Link
                    className="m-btn-2 pricing-card__cta"
                    href="/dashboard/feedback"
                  >
                    Request a quote
                  </Link>
                </article>
              ))}
            </div>

            <aside className="pricing-grant">
              <div>
                <h3>Language-protection partnership</h3>
                <p>
                  Foundations and public funders can support the Sámi and
                  Swedish desks through a grant. The work is reported publicly:
                  what the money paid for, who reviewed it and what was
                  published. A grant never buys approval rights.
                </p>
              </div>
              <p className="pricing-grant__price">By agreement</p>
            </aside>
          </section>

          <section className="pricing-section" aria-labelledby="addons-title">
            <div className="pricing-section__head">
              <div>
                <p className="pricing-eyebrow">Add-ons</p>
                <h2 id="addons-title">
                  Things organisations can buy separately
                </h2>
                <p className="pricing-section__intro">
                  Every item below is labelled where readers can see it and kept
                  apart from editorial decisions.
                </p>
              </div>
            </div>
            <ul className="pricing-addons">
              {addOns.map((addOn) => (
                <li key={addOn.name}>
                  <div>
                    <h3>{addOn.name}</h3>
                    <p>{addOn.detail}</p>
                  </div>
                  <p className="pricing-addons__price">{addOn.price}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="pricing-never" aria-labelledby="never-title">
            <div className="pricing-never__head">
              <p className="pricing-eyebrow">The line</p>
              <h2
                id="never-title"
                style={{
                  fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.035em",
                  fontWeight: 650,
                }}
              >
                What money never buys
              </h2>
              <p className="pricing-section__fine">
                <Link href="/funding">Read the full funding plan</Link> for who
                pays, why, and how every promise is checked.
              </p>
            </div>
            <ul className="pricing-never__list">
              <li>Choosing which stories we cover or skip.</li>
              <li>
                Seeing a story before it is published, or asking for changes
                afterwards.
              </li>
              <li>
                A favourable story. Advertising and recruitment listings are
                labelled and kept apart from news.
              </li>
              <li>
                Silence about a funder. We decline contracts that ask us to stop
                reporting critically.
              </li>
            </ul>
          </section>

          <section className="pricing-section" aria-labelledby="faq-title">
            <div className="pricing-section__head">
              <div>
                <p className="pricing-eyebrow">Questions</p>
                <h2 id="faq-title">Before you pay or sign</h2>
              </div>
            </div>
            <div className="pricing-faq">
              {faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="pricing-cta" aria-labelledby="cta-title">
            <div>
              <h2 id="cta-title">
                Start free. Talk to us if you represent an organisation.
              </h2>
              <p>
                Readers can open the newsroom now. Employers, universities,
                municipalities and funders can ask for a written quote that
                states what the money pays for and what it does not buy.
              </p>
            </div>
            <div className="pricing-cta__actions">
              <LandingCta className="m-btn" label="Open KalevaShorts" />
              <Link className="m-btn-2" href="/dashboard/feedback">
                Ask for a quote
              </Link>
              <Link className="m-link" href="/funding">
                Read the funding plan
              </Link>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter base="/" />
    </>
  );
}
