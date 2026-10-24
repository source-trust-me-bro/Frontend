import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How we are funded",
  description:
    "Who pays for KalevaShorts, what they never get to decide, and how we stay independent.",
};

const payers = [
  {
    who: "Employers and tourism companies",
    why: "Newcomers who know how things work settle in faster and stay longer. A resort or a company can pay for a channel for its staff or a whole season.",
    how: "A licence for the channel. The people who read it never pay.",
  },
  {
    who: "Universities and institutes",
    why: "International students and researchers need clear, trustworthy information in their first weeks.",
    how: "An annual institutional licence.",
  },
  {
    who: "Municipalities and public services",
    why: "They need to reach residents who do not read Finnish, and to be understood.",
    how: "A service contract for official-information channels, and grants.",
  },
  {
    who: "Foundations and public funders",
    why: "Sámi and Swedish speakers deserve news in their own language, even when it will never pay for itself.",
    how: "Grants for minority-language and integration work.",
  },
  {
    who: "Readers who want more",
    why: "The news and the first-week guide are free. Extra features can be paid.",
    how: "A free tier with optional paid extras. We will not ask people in a vulnerable position to pay for essential information.",
  },
];

const never = [
  "Choose which stories we cover or skip.",
  "See a story before it is published, or ask for changes afterwards.",
  "Buy a favourable story. Advertising and recruitment listings are labelled and kept apart from news.",
  "Stop us from reporting critically on them. We decline contracts that ask for that.",
];

export default function FundingPage() {
  return (
    <main className="info-page">
      <div className="info-page__inner">
        <Link className="info-page__back" href="/">
          ← KalevaShorts
        </Link>
        <h1>How we are funded</h1>
        <p className="info-page__lead">
          Good journalism needs money, and money can pull on the people who report. So we write
          down who pays and what they do not get, before anyone signs.
        </p>
        <p className="info-page__note">
          This is our funding plan. It is a set of promises and hypotheses we are testing with
          real employers, institutions and communities, not a list of existing contracts.
        </p>

        <h2>Who pays, and why</h2>
        <ul className="info-cards">
          {payers.map((item) => (
            <li key={item.who}>
              <h3>{item.who}</h3>
              <p>{item.why}</p>
              <p className="info-cards__how">{item.how}</p>
            </li>
          ))}
        </ul>

        <h2>What a payer never gets</h2>
        <ul className="info-list">
          {never.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2>How you can check us</h2>
        <ul className="info-list">
          <li>
            If a funder is connected to the subject of a story, that story says so, on the story.
          </li>
          <li>
            Every story names the people who approved it, links its sources and says that AI
            helped prepare it.
          </li>
          <li>
            Mistakes are corrected in public, and the correction says what was wrong.
          </li>
          <li>
            Editors, not funders, decide what is published. Each decision is recorded with the
            name of the person who made it.
          </li>
        </ul>

        <h2>Sámi and Swedish language content</h2>
        <p>
          These communities are small, and their languages matter more than their market. We
          expect this work to be paid for by language-protection grants and public funders, and
          we will not sell it to the highest bidder. A native-speaking reviewer approves every
          story before it is published.
        </p>

        <h2>Organisations: talk to us</h2>
        <p>
          If your organisation would like to support a community channel, tell us through the
          feedback form in the app. We will explain what it costs, and what you will and will not
          get.
        </p>
        <p>
          <Link href="/pricing">See the pricing plan</Link> ·{" "}
          <Link href="/dashboard/feedback">Send feedback</Link> ·{" "}
          <Link href="/dashboard/community">See the community newsroom</Link>
        </p>
      </div>
    </main>
  );
}
