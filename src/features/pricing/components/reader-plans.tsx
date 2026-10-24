"use client";

import Link from "next/link";
import { useState } from "react";

import { LandingCta } from "@/features/landing/components/landing-cta";

type Billing = "monthly" | "annual";

type ReaderPlan = {
  name: string;
  tagline: string;
  monthly: number;
  annual: number;
  featured?: boolean;
  cta: string;
  features: string[];
};

const plans: ReaderPlan[] = [
  {
    name: "Free",
    tagline: "For every reader, always.",
    monthly: 0,
    annual: 0,
    cta: "Start reading",
    features: [
      "Every published story in Finnish, English and Swedish",
      "The first-week guide for newcomers",
      "Topic tree, following, saved stories and history",
      "Sources, funding disclosures and public corrections",
      "No payment details, no trial, no expiry",
    ],
  },
  {
    name: "Supporter",
    tagline: "For readers who want the newsroom to go deeper.",
    monthly: 8,
    annual: 80,
    featured: true,
    cta: "Register interest",
    features: [
      "Everything in Free",
      "The editor's weekly briefing",
      "An ad-free reader",
      "Cancel any time, keep access to the end of the period",
    ],
  },
  {
    name: "Patron",
    tagline: "For readers who can help carry a language desk.",
    monthly: 18,
    annual: 180,
    cta: "Talk to us",
    features: [
      "Everything in Supporter",
      "Two guest passes each month",
      "Invitations to newsroom events",
      "Your name in the annual transparency report, if you choose",
      "A quarter of the extra goes to the Sámi and Swedish desks, reported yearly",
    ],
  },
];

const money = (value: number) => `€${value}`;

export function ReaderPlans() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <section className="pricing-section" aria-labelledby="readers-title">
      <div className="pricing-section__head">
        <div>
          <p className="pricing-page__eyebrow">Readers</p>
          <h2 id="readers-title">Free news, optional extras</h2>
          <p className="pricing-section__intro">
            The reporting stays free. Paid tiers add convenience and support the desks that
            commercial work cannot pay for.
          </p>
        </div>
        <div className="pricing-toggle" role="group" aria-label="Billing period">
          <button
            type="button"
            aria-pressed={billing === "monthly"}
            onClick={() => setBilling("monthly")}
          >
            Monthly
          </button>
          <button
            type="button"
            aria-pressed={billing === "annual"}
            onClick={() => setBilling("annual")}
          >
            Yearly <span className="pricing-toggle__save">save 17%</span>
          </button>
        </div>
      </div>

      <div className="pricing-grid">
        {plans.map((plan) => {
          const free = plan.monthly === 0;
          const price = billing === "annual" ? plan.annual : plan.monthly;
          const suffix = free ? "forever" : billing === "annual" ? "year" : "month";

          return (
            <article
              className={`pricing-card${plan.featured ? " pricing-card--featured" : ""}`}
              key={plan.name}
            >
              <div className="pricing-card__top">
                <h3>{plan.name}</h3>
                {plan.featured ? <span className="pricing-card__badge">Most chosen</span> : null}
              </div>
              <p className="pricing-card__price">
                {money(price)} <small>/ {suffix}</small>
              </p>
              <p className="pricing-card__billing">
                {free
                  ? "No card. No trial. No expiry."
                  : billing === "annual"
                    ? `€${(plan.annual / 12).toFixed(2)} per month, billed yearly`
                    : "Billed monthly. Cancel any time."}
              </p>
              <p className="pricing-card__tagline">{plan.tagline}</p>
              <ul className="pricing-card__features">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              {plan.name === "Free" ? (
                <LandingCta className="m-btn pricing-card__cta" label={plan.cta} />
              ) : (
                <Link className="m-btn-2 pricing-card__cta" href="/dashboard/feedback">
                  {plan.cta}
                </Link>
              )}
            </article>
          );
        })}
      </div>
      <p className="pricing-section__fine">
        Prices in euros, excluding VAT. Paid reader tiers are not live yet; registering interest
        opens a conversation, not a charge.
      </p>
    </section>
  );
}
