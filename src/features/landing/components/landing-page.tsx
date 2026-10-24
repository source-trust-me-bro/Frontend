/* eslint-disable @next/next/no-img-element */
/*
  Landing page adapted from the free 8B App Landing Page Template.
  Free website template by 8B: https://8b.com/templates/linea/
  Source: https://github.com/8bsite/app-landing-page-template
  MIT License (code) https://8b.com/ · Photos: Unsplash License, see CREDITS.md · Fonts: Google Fonts (OFL)
  All ids, data-8b-section and data-8b-motion hooks are preserved for the scene scripts in landing-motion.tsx.
*/

import type { CSSProperties } from "react";

import { ContactPanel } from "./contact-form";
import { LandingCta } from "./landing-cta";
import { LandingMotion } from "./landing-motion";
import { SiteNav } from "./site-nav";
import { unsplashImage } from "./landing-images";

const heroImage = unsplashImage("photo-1719492172750-4ca0809345b8", [
  400, 640, 960, 1160, 1280, 1600,
]);
const counterImage = unsplashImage("photo-1786772444593-63542e7d0618", [
  230, 340, 400, 450, 640, 960,
]);
const tableImage = unsplashImage("photo-1627662166825-a860471632e4", [
  290, 340, 400, 570, 640, 960,
]);
const clinicImage = unsplashImage("photo-1790469337210-02bde622b520", [
  230, 340, 400, 450, 640, 960,
]);
const talkImage = unsplashImage("photo-1638957835514-224c57ffe617", [
  230, 340, 400, 450, 640, 960,
]);
const cornerImage = unsplashImage("photo-1787767296743-b59cbed3809d", [
  250, 340, 400, 490, 640, 960,
]);
const voicesImage = unsplashImage("photo-1643297654397-97b3201abc7c", [
  360, 400, 660, 720, 960, 1280, 1600,
]);
const startImage = unsplashImage("photo-1726047336347-77803fc5f725", [
  400, 640, 1010, 1180, 1280, 1600,
]);
const contactImage = unsplashImage("photo-1766066014237-00645c74e9c6", [
  340, 400, 680, 960, 1280,
]);

const templateParts = [
  "layers",
  "tokens",
  "base",
  "system",
  "layout",
  "section:nav",
  "section:hero",
  "section:listen",
  "scene-style:listen",
  "section:calls",
  "section:tune",
  "section:rooms",
  "scene-style:rooms",
  "section:voices",
  "section:setup",
  "scene-style:setup",
  "section:faq",
  "section:start",
  "scene-style:start",
  "section:contact",
  "section:footer",
  "section-script:nav",
  "section-script:hero",
  "motion-queue",
  "section-script:contact",
  "page-init",
  "motion",
  "scene:hero",
  "scene:listen",
  "scene:calls",
  "scene:tune",
  "scene:rooms",
  "scene:voices",
  "scene:setup",
  "scene:start",
  "scene:footer",
];

const waveform = [
  0.32, 0.5, 0.74, 0.58, 0.9, 0.66, 0.42, 0.3, 0.54, 0.82, 1, 0.7, 0.46,
  0.36, 0.6, 0.86, 0.64, 0.4, 0.28, 0.48, 0.72, 0.94, 0.62, 0.38, 0.52,
  0.78, 0.56, 0.34,
];

const feeds = [
  {
    label: "Nordic · Local",
    image: counterImage,
    sizes: "(max-width: 767px) 90vw, 17vw",
    width: 1600,
    height: 2400,
    alt: "A woman with a backpack orders at a café counter",
    background: "#40260c",
    source: "The council meeting starts at 17:00.",
    translation: "Disputed: the vote count differs.",
  },
  {
    label: "Economy · Energy",
    image: tableImage,
    sizes: "(max-width: 767px) 90vw, 22vw",
    width: 1600,
    height: 1803,
    alt: "A family laughs together over lunch at a home table",
    background: "#c0c0c0",
    source: "Electricity prices fell for a third week.",
    translation: "Sähkön hinta laski kolmatta viikkoa.",
  },
  {
    label: "Europe · Policy",
    image: clinicImage,
    sizes: "(max-width: 767px) 90vw, 17vw",
    width: 1600,
    height: 2400,
    alt: "A smiling clinician in a white coat talks with an older patient",
    background: "#8c8ca6",
    source: "The proposal moves to committee on Thursday.",
    translation: "Ehdotus siirtyy valiokuntaan torstaina.",
  },
  {
    label: "Science · Research",
    image: talkImage,
    sizes: "(max-width: 767px) 90vw, 17vw",
    width: 1600,
    height: 2397,
    alt: "An audience listens to a talk in a bright hall",
    background: "#c0c0c0",
    source: "The study is open for peer review.",
    translation: "Tutkimus on avoin vertaisarvioinnille.",
  },
  {
    label: "Technology · AI",
    image: cornerImage,
    sizes: "(max-width: 767px) 90vw, 19vw",
    width: 1600,
    height: 2092,
    alt: "Neighbours sit and chat outside a shop on a cobbled street",
    background: "#404040",
    source: "The regulator opened a public consultation.",
    translation: "Viranomainen avasi julkisen kuulemisen.",
  },
];

const callSteps = [
  {
    title: "Collection you can audit",
    body: "Stories are gathered from news sources, duplicates are skipped, and every collection run records how many stories were added, updated, skipped or failed.",
  },
  {
    title: "Language-aware feeds",
    body: "Each reader gets a feed in their language, narrowed to the topics they follow and the community they belong to.",
  },
  {
    title: "A topic tree, not a flat list",
    body: "Stories are filed under nested topics. Editors can add branches and keywords, and new stories are matched to them automatically.",
  },
  {
    title: "Search across languages",
    body: "Search finds related coverage across languages, even when the wording differs.",
  },
  {
    title: "Evidence, not just summaries",
    body: "Next up: agents extract claims, look for independent reporting, and keep supporting and contradicting sources side by side.",
  },
];

const tuneSettings = [
  {
    title: "Topic interests",
    body: "Pick topics and the For you feed narrows to them.",
    control: "size",
  },
  {
    title: "Sources you follow",
    body: "Follow outlets and read their latest stories in one tab.",
    control: "weight",
  },
  {
    title: "Reading language",
    body: "English or Finnish as your lead language.",
    control: "contrast",
  },
];

const faqs = [
  {
    question: "What is KalevaShorts?",
    answer:
      "KalevaShorts is a multilingual news intelligence platform. It collects reporting in several languages, organises it in a topic tree, and is being built so that agents can investigate stories, compare accounts and keep the evidence behind every claim.",
  },
  {
    question: "What works today, and what is still being built?",
    answer:
      "Today: story collection from news sources, a topic tree, communities, language-aware feeds, search, saved stories, reading history and following. Still being built, in order: story discovery, claim investigation and evidence, event and topic-tree curation, then community-specific editing.",
  },
  {
    question: "Which languages are supported?",
    answer:
      "English and Finnish are the focus, with Swedish also supported. More languages can be added as coverage grows.",
  },
  {
    question: "How will claims be verified?",
    answer:
      "Each claim becomes an evidence record that lists the sources that support it, the sources that contradict it, who said it, and what is still unknown. Syndicated copies are not counted as independent confirmation, and contradictions are kept rather than averaged away.",
  },
  {
    question: "Where does the news come from, and what about copyright?",
    answer:
      "BBC News is the first source, with more added over time. We respect each source's terms, store article text only where permitted, and always link back to the original report.",
  },
  {
    question: "Who pays for this, and does that affect what you report?",
    answer:
      "Employers, tourism companies, universities and public bodies pay for community channels, and grants support minority-language work. Readers in vulnerable positions are not asked to pay for essential information. Payers never choose stories, see drafts early or ask for changes, and a funding link to a story's subject is disclosed on that story. The full plan is on the funding page.",
  },
  {
    question: "Do I need an account?",
    answer:
      "Yes. A free account gives you a personalised feed, saved stories, reading history and the sources you follow, on every device.",
  },
  {
    question: "Who can edit sources and topics?",
    answer:
      "Every account starts as a reader. Editors and admins can add sources, run ingestion, manage topics and read reader feedback. Roles are checked every time you act, not just when a page loads.",
  },
];

const voicePanels = [
  {
    label: "Claim",
    className: "m-caption",
    text: "Claim: the council approved the new budget on Tuesday.",
  },
  {
    label: "Evidence",
    className: "m-caption",
    text: "Supported by two independent outlets in Finnish and English.",
  },
  {
    label: "Dispute",
    className: "m-caption",
    text: "A third report gives a different vote count, so it is flagged.",
  },
  {
    label: "Record",
    className: "m-caption",
    text: "Both accounts stay on the record, each with its source.",
  },
];

const verificationCards = [
  {
    title: "Provenance on every claim",
    body: "Each claim keeps its source, timestamp and attribution, so you can see who said it and where.",
  },
  {
    title: "Contradictions are kept",
    body: "When outlets disagree, both accounts stay on the record instead of being forced into a false consensus.",
  },
  {
    title: "The original is one click away",
    body: "Every story links straight to the publisher's own report, so you can check it yourself.",
  },
  {
    title: "Proposals before commits",
    body: "Agents propose facts and topic-tree changes with evidence; only validated changes become authoritative.",
  },
  {
    title: "Honest uncertainty",
    body: "Unknowns are shown as unknowns. Model confidence is never presented as a calibrated probability.",
  },
  {
    title: "No single voice dominates",
    body: "Feeds balance relevance with variety, so one publisher or viewpoint can't take over.",
  },
];

export function LandingPage() {
  return (
    <>
      <a className="skip-link m-text-6" href="#main">
        Skip to content
      </a>

      <SiteNav />

      <main id="main">
        {/* hero: first screen: headline over a full-bleed photo, lead, proof line, button; caption chips ride curved lines across the photo (animation: scene:hero) */}
        <section
          className="hero on-dark"
          id="hero"
          data-8b-section="hero"
          aria-labelledby="hero-title"
        >
          <div className="hero__media">
            <img
              src={heroImage.src}
              srcSet={heroImage.srcSet}
              sizes="(max-width: 767px) 167vw, 90vw"
              style={{ background: "#59c0f3" }}
              width={1600}
              height={1200}
              alt="A woman smiles as she reads a message on her phone under a clear blue sky"
              fetchPriority="high"
            />
          </div>
          <div className="hero__shade" aria-hidden="true"></div>
          <div className="hero__talk" aria-hidden="true">
            <div className="hero__draw">
              <svg className="hero__lines">
                <ellipse
                  className="hero__arc hero__arc--a"
                  pathLength="1"
                />
                <ellipse
                  className="hero__arc hero__arc--b"
                  pathLength="1"
                />
                <ellipse
                  className="hero__flow hero__flow--a"
                  pathLength="1"
                />
                <ellipse
                  className="hero__flow hero__flow--b"
                  pathLength="1"
                />
              </svg>
              <div className="hero__chip hero__chip--1">
                <p className="m-caption">
                  <span className="m-caption__wave">
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                  </span>
                  <span className="m-caption__text">
                    Claim: the budget passed on Tuesday.
                  </span>
                </p>
              </div>
              <div className="hero__chip hero__chip--2">
                <p className="m-caption">
                  <span className="m-caption__wave">
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                  </span>
                  <span className="m-caption__text">
                    Supported by two independent outlets.
                  </span>
                </p>
              </div>
              <div className="hero__chip hero__chip--3">
                <p className="m-caption-2">
                  <span className="m-caption__wave">
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                  </span>
                  <span className="m-caption__text">
                    Kaupunginvaltuusto kokoontuu kello 17.
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="hero__copy l-wrap">
            <div className="hero__intro">
              <h1 className="m-text-2 hero__title" id="hero-title">
                Follow a story across every language it was told in.
              </h1>
              <div className="hero__lower">
                <p className="m-text-4 hero__lead">
                  KalevaShorts is a multilingual news intelligence platform.
                  It gathers reporting in several languages, organises it in a
                  living topic tree, and is being built to check claims against
                  independent sources.
                </p>
                <ul className="hero__proof m-text-6">
                  <li>
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path className="hero__tick" d="M3 8.5l3 3 7-7" />
                    </svg>
                    Evidence behind every claim
                  </li>
                  <li>
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path className="hero__tick" d="M3 8.5l3 3 7-7" />
                    </svg>
                    Original report linked on every story
                  </li>
                  <li>
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path className="hero__tick" d="M3 8.5l3 3 7-7" />
                    </svg>
                    Seven languages: English · Suomi · Svenska ·
                    Davvisámegiella · Arabic · Ukrainian · Russian
                  </li>
                </ul>
                <div className="hero__actions">
                  <LandingCta className="m-btn" label="Create a free account" />
                  <a className="m-link m-text-6" href="#listen">
                    See how a story is checked
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* voice-to-text: two-panel stage: source text on one side, aligned cross-language read on the other (animation: scene:listen) */}
        <section
          className="listen"
          id="listen"
          data-8b-section="voice-to-text"
          aria-labelledby="listen-title"
        >
          <div className="listen__sheet m-band" aria-hidden="true"></div>
          <div className="listen__head l-wrap">
            <h2 className="m-text-3 listen__title" id="listen-title">
              Every claim stays attached to its evidence.
            </h2>
            <p
              className="m-text-4 listen__lead"
              data-8b-motion="readAlong"
            >
              Each article is stored with its source, language and
              publication time. Each claim pulled from it points to the reports
              that support or contradict it. Disagreements are recorded, not
              smoothed over.
            </p>
          </div>
          <div className="listen__hold">
            <div className="listen__stage l-wrap">
              <div className="listen__panels">
                <div className="listen__panel listen__panel--voice">
                  <p className="m-text-6 listen__label">Incoming reports</p>
                  <div className="listen__wave" aria-hidden="true">
                    {waveform.map((height, index) => (
                      <i
                        key={index}
                        style={
                          { "--h": height } as CSSProperties
                        }
                      ></i>
                    ))}
                  </div>
                  <div
                    className="listen__track listen__track--voice"
                    aria-hidden="true"
                  ></div>
                </div>
                <div className="listen__panel listen__panel--read">
                  <p className="m-text-6 listen__label">
                    Evidence record
                  </p>
                  <div className="listen__track listen__track--read">
                    {voicePanels.map((panel) => (
                      <div className="listen__row" key={panel.label}>
                        <p className={panel.className}>
                          <span
                            className="m-caption__wave"
                            aria-hidden="true"
                          >
                            <i></i>
                            <i></i>
                            <i></i>
                            <i></i>
                          </span>
                          <span className="m-caption__text">
                            {panel.text}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* calls: feature list beside a sticky phone whose screen builds one step per feature (animation: scene:calls) */}
        <section
          className="calls on-dark"
          id="calls"
          data-8b-section="calls"
          aria-labelledby="calls-title"
        >
          <div
            className="calls__sheet m-band-3"
            aria-hidden="true"
            data-8b-motion="bandRise"
          ></div>
          <div className="calls__inner l-wrap">
            <div className="calls__head">
              <h2
                className="m-text-3"
                id="calls-title"
                data-8b-motion="captionIn"
              >
                A newsroom that shows its work.
              </h2>
              <div className="calls__head-copy">
                <p className="m-text-4 calls__lead">
                  What exists today is the foundation: ingestion, storage,
                  topics, feeds and search. The investigating agents build on
                  it, one phase at a time.
                </p>
                <LandingCta className="m-btn" label="Open the dashboard" />
              </div>
            </div>
            <div className="calls__grid">
              <ul className="calls__list">
                {callSteps.map((step) => (
                  <li className="calls__item" key={step.title}>
                    <h3 className="m-text-5">{step.title}</h3>
                    <p className="m-text-8">{step.body}</p>
                  </li>
                ))}
              </ul>
              <div className="calls__aside">
                <div className="calls__sticky">
                  <div className="calls__device">
                    <figure
                      className="phone"
                      aria-label="Illustration of the planned investigation flow"
                    >
                      <div className="phone__screen">
                        <div className="phone__top">
                          <p className="phone__who">Budget vote</p>
                          <p className="phone__state">
                            <span
                              className="phone__dot"
                              aria-hidden="true"
                            ></span>
                            Investigating · 5 reports
                          </p>
                          <span className="phone__end" aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                              <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" />
                              <path d="M9 12l2 2 4-4" />
                            </svg>
                          </span>
                        </div>
                        <p className="phone__number" data-step="2">
                          Topic · Politics
                        </p>
                        <ol className="phone__log">
                          <li className="phone__msg" data-step="1">
                            <p className="m-caption">
                              <span
                                className="m-caption__wave"
                                aria-hidden="true"
                              >
                                <i></i>
                                <i></i>
                                <i></i>
                                <i></i>
                              </span>
                              <span className="m-caption__text">
                                Claim: the budget passed 42–18 on Tuesday.
                              </span>
                            </p>
                          </li>
                          <li
                            className="phone__msg phone__msg--you"
                            data-step="3"
                          >
                            <p className="m-caption-2">
                              <span
                                className="m-caption__wave"
                                aria-hidden="true"
                              >
                                <i></i>
                                <i></i>
                                <i></i>
                                <i></i>
                              </span>
                              <span className="m-caption__text">
                                Searching Finnish and English coverage.
                              </span>
                            </p>
                            <p className="phone__note">
                              Found 5 reports · 2 are syndicated copies
                            </p>
                          </li>
                          <li className="phone__cue" data-step="4">
                            Checking independent outlets
                          </li>
                          <li className="phone__msg" data-step="4">
                            <p className="m-caption">
                              <span
                                className="m-caption__wave"
                                aria-hidden="true"
                              >
                                <i></i>
                                <i></i>
                                <i></i>
                                <i></i>
                              </span>
                              <span className="m-caption__text">
                                Two independent outlets report 42–18.
                              </span>
                            </p>
                          </li>
                          <li
                            className="phone__msg phone__msg--you"
                            data-step="5"
                          >
                            <p className="m-caption-2">
                              <span
                                className="m-caption__wave"
                                aria-hidden="true"
                              >
                                <i></i>
                                <i></i>
                                <i></i>
                                <i></i>
                              </span>
                              <span className="m-caption__text">
                                Evidence record saved with 3 sources.
                              </span>
                            </p>
                          </li>
                        </ol>
                        <p className="phone__saved" data-step="5">
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <rect
                              x="5"
                              y="11"
                              width="14"
                              height="9"
                              rx="2"
                            />
                            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                          </svg>
                          Provenance saved
                        </p>
                        <div className="phone__bar" aria-hidden="true">
                          <span>
                            <svg viewBox="0 0 24 24">
                              <path d="M5 5h11v14H7a2 2 0 0 1-2-2zM16 9h3v8a2 2 0 0 1-2 2M8 9h5M8 12h5M8 15h3" />
                            </svg>
                            Feed
                          </span>
                          <span>
                            <svg viewBox="0 0 24 24">
                              <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
                            </svg>
                            Sources
                          </span>
                          <span>
                            <svg viewBox="0 0 24 24">
                              <path d="M4 6h9M8.5 4v2M6 6c.5 3 2.5 5.5 5 7M12 6c-.5 3-3 6-7 8M13 20l4-9 4 9M14.5 17h5" />
                            </svg>
                            Language
                          </span>
                          <span>
                            <svg viewBox="0 0 24 24">
                              <path d="M7 4h10v16l-5-4-5 4z" />
                            </svg>
                            Saved
                          </span>
                        </div>
                      </div>
                    </figure>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* caption-styles: a wall-sized sample sentence over a list of eight settings with drawn controls (animation: scene:tune) */}
        <section
          className="tune"
          id="tune"
          data-8b-section="caption-styles"
          aria-labelledby="tune-title"
        >
          <div className="tune__sheet m-band-2" aria-hidden="true"></div>
          <div className="tune__inner l-wrap">
            <div className="tune__stage">
              <p className="tune__meta m-text-6">
                <span>
                  <i aria-hidden="true"></i>Live preview
                </span>
                <span>English · For you · Synced</span>
              </p>
              <p className="tune__sample m-text-2">
                <span
                  className="tune__line"
                  style={{ "--len": 14 } as CSSProperties}
                >
                  Two languages,
                </span>{" "}
                <span
                  className="tune__line"
                  style={{ "--len": 16 } as CSSProperties}
                >
                  one clear story.
                </span>
              </p>
            </div>
            <div className="tune__body">
              <div className="tune__head">
                <h2
                  className="m-text-3"
                  id="tune-title"
                  data-8b-motion="captionIn"
                >
                  The feed, set your way.
                </h2>
                <p className="m-text-4">
                  Choose your language, topics and sources. The choices live on
                  your account, so every device shows the same feed.
                </p>
              </div>
              <ul className="tune__settings">
                {tuneSettings.map((setting) => (
                  <li className="tune__row" key={setting.title}>
                    <h3 className="m-text-5">{setting.title}</h3>
                    <p className="m-text-8">{setting.body}</p>
                    <span
                      className={
                        setting.control === "contrast"
                          ? "tune__ctl tune__seg"
                          : "tune__ctl tune__slider"
                      }
                      data-ctl={setting.control}
                      aria-hidden="true"
                    >
                      {setting.control === "contrast" ? (
                        <>
                          <b className="tune__pill"></b>
                          <span>English</span>
                          <span>Suomi</span>
                        </>
                      ) : (
                        <>
                          <span className="tune__fill"></span>
                          <span className="tune__thumb"></span>
                        </>
                      )}
                    </span>
                  </li>
                ))}
                <li className="tune__row">
                  <h3 className="m-text-5">Supported languages</h3>
                  <p className="m-text-8">
                    English and Finnish, with Swedish also supported.
                  </p>
                  <span className="tune__ctl tune__tag" aria-hidden="true">
                    EN · FI · SV
                  </span>
                </li>
                <li className="tune__row">
                  <h3 className="m-text-5">Saved stories</h3>
                  <p className="m-text-8">
                    Bookmark stories and pick them up on any device.
                  </p>
                  <span className="tune__ctl tune__tag" aria-hidden="true">
                    On account
                  </span>
                </li>
                <li className="tune__row">
                  <h3 className="m-text-5">Reading history</h3>
                  <p className="m-text-8">
                    Pick up where you left off, and clear it whenever you like.
                  </p>
                  <span
                    className="tune__ctl tune__toggle"
                    aria-hidden="true"
                  ></span>
                </li>
                <li className="tune__row">
                  <h3 className="m-text-5">Sync across devices</h3>
                  <p className="m-text-8">
                    Preferences, bookmarks and follows are stored server-side.
                  </p>
                  <span
                    className="tune__ctl tune__toggle"
                    aria-hidden="true"
                  ></span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* in-person: horizontal track of five regional streams with photos and caption pairs, two curved lines run through all of them (animation: scene:rooms) */}
        <section
          className="rooms on-dark"
          id="rooms"
          data-8b-section="in-person"
          aria-labelledby="rooms-title"
        >
          <div className="rooms__sheet m-band-4" aria-hidden="true"></div>
          <div className="rooms__head l-wrap">
            <h2
              className="m-text-3"
              id="rooms-title"
              data-8b-motion="captionIn"
            >
              One event, many reports, every language.
            </h2>
            <p
              className="m-text-4 rooms__lead"
              data-8b-motion="readAlong"
            >
              Reports from different publishers and languages are grouped
              around a single event, so you can follow its timeline instead of
              a pile of near-identical headlines.
            </p>
          </div>
          <div className="rooms__hold">
            <div className="rooms__stage">
              <p className="rooms__now m-text-6">
                <i aria-hidden="true"></i>Example headlines · every source linked
              </p>
              <div className="rooms__track">
                <svg
                  className="rooms__lines"
                  viewBox="0 0 1000 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    className="rooms__line rooms__line--a"
                    pathLength="1"
                    d="M0 60C40 10 80 10 120 50S200 95 240 55 320 5 360 45 440 95 480 55 560 5 600 45 680 95 720 55 800 5 840 45 920 95 1000 50"
                  />
                  <path
                    className="rooms__line rooms__line--b"
                    pathLength="1"
                    d="M0 40C40 90 80 90 120 50S200 5 240 45 320 95 360 55 440 5 480 45 560 95 600 55 680 5 720 45 800 95 840 55 920 5 1000 50"
                  />
                </svg>
                {feeds.map((feed) => (
                  <figure className="rooms__place" key={feed.label}>
                    <img
                      src={feed.image.src}
                      srcSet={feed.image.srcSet}
                      sizes={feed.sizes}
                      style={{ background: feed.background }}
                      width={feed.width}
                      height={feed.height}
                      alt={feed.alt}
                      loading="lazy"
                      decoding="async"
                    />
                    <figcaption className="rooms__label m-text-6">
                      {feed.label}
                    </figcaption>
                    <div className="rooms__talk">
                      <p className="m-caption">
                        <span
                          className="m-caption__wave"
                          aria-hidden="true"
                        >
                          <i></i>
                          <i></i>
                          <i></i>
                          <i></i>
                        </span>
                        <span className="m-caption__text">
                          {feed.source}
                        </span>
                      </p>
                      <p className="m-caption-2">
                        <span
                          className="m-caption__wave"
                          aria-hidden="true"
                        >
                          <i></i>
                          <i></i>
                          <i></i>
                          <i></i>
                        </span>
                        <span className="m-caption__text">
                          {feed.translation}
                        </span>
                      </p>
                    </div>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* verification: project principles beside two columns of factual platform cards (animation: scene:voices) */}
        <section
          className="voices"
          id="voices"
          data-8b-section="testimonials"
          aria-labelledby="voices-title"
        >
          <div
            className="voices__sheet m-band"
            aria-hidden="true"
            data-8b-motion="bandRise"
          ></div>
          <div className="voices__inner l-wrap">
            <h2
              className="m-text-3 voices__title"
              id="voices-title"
              data-8b-motion="captionIn"
            >
              Built to be audited, not just trusted.
            </h2>
            <div className="voices__grid">
              <figure className="voices__expert">
                <div className="voices__photo">
                  <img
                    src={voicesImage.src}
                    srcSet={voicesImage.srcSet}
                    sizes="(max-width: 767px) 95vw, 51vw"
                    style={{ background: "#a6c0c0" }}
                    width={1600}
                    height={1290}
                    alt="A smiling clinician with a stethoscope stands outdoors by the water"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <blockquote
                  className="voices__quote m-text-4"
                  data-8b-motion="readAlong"
                >
                  <p>
                    “A claim is only as good as the evidence you can check
                    for yourself.”
                  </p>
                </blockquote>
                <figcaption className="voices__who m-text-6">
                  <span className="voices__badge" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </span>
                  <p>
                    Design principle
                    <br />
                    <span>What we hold ourselves to</span>
                  </p>
                </figcaption>
              </figure>
              <div className="voices__cols">
                <ul className="voices__col">
                  {verificationCards.slice(0, 3).map((card) => (
                    <li className="m-card" key={card.title}>
                      <p className="m-text-5">{card.title}</p>
                      <p className="m-text">{card.body}</p>
                    </li>
                  ))}
                </ul>
                <ul className="voices__col">
                  {verificationCards.slice(3).map((card) => (
                    <li className="m-card" key={card.title}>
                      <p className="m-text-5">{card.title}</p>
                      <p className="m-text">{card.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* how-it-works: three numbered step cards that stack on top of each other (animation: scene:setup) */}
        <section
          className="setup"
          id="setup"
          data-8b-section="how-it-works"
          aria-labelledby="setup-title"
        >
          <div className="setup__sheet m-band-2" aria-hidden="true"></div>
          <div className="setup__inner l-wrap">
            <div className="setup__head">
              <h2
                className="m-text-3"
                id="setup-title"
                data-8b-motion="captionIn"
              >
                From a headline to a filed event.
              </h2>
              <p className="m-text-4">
                Ingestion, storage, topics and feeds are built. The
                investigating agents arrive in the next phases.
              </p>
            </div>
            <ol className="setup__steps">
              <li
                className="setup__card"
                style={{ "--setup-i": 0 } as CSSProperties}
              >
                <p className="setup__num m-text-2" aria-hidden="true">
                  1
                </p>
                <div className="setup__copy">
                  <h3 className="m-text-5">Discover and ingest</h3>
                  <p className="m-text-8">
                    Stories are gathered from news sources, and each one is
                    kept once, with its original link.
                  </p>
                </div>
                <div className="setup__ui m-text-6" aria-hidden="true">
                  <p className="setup__check">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M8 12.5l2.5 2.5L16 9.5" />
                    </svg>
                    Sources checked
                  </p>
                  <p className="setup__check">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M8 12.5l2.5 2.5L16 9.5" />
                    </svg>
                    Full text gathered
                  </p>
                  <p className="setup__check">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M8 12.5l2.5 2.5L16 9.5" />
                    </svg>
                    Duplicates removed
                  </p>
                </div>
              </li>
              <li
                className="setup__card"
                style={{ "--setup-i": 1 } as CSSProperties}
              >
                <p className="setup__num m-text-2" aria-hidden="true">
                  2
                </p>
                <div className="setup__copy">
                  <h3 className="m-text-5">Investigate across languages</h3>
                  <p className="m-text-8">
                    An agent extracts claims, looks for independent coverage in
                    other languages and records what supports or contradicts
                    each one.
                  </p>
                </div>
                <div className="setup__ui m-text-6" aria-hidden="true">
                  <p className="setup__option setup__option--on">
                    Claims extracted
                    <span>Done</span>
                  </p>
                  <p className="setup__option">
                    Independent coverage found
                    <span>EN + FI</span>
                  </p>
                  <p className="m-caption-2">
                    <span className="m-caption__wave">
                      <i></i>
                      <i></i>
                      <i></i>
                      <i></i>
                    </span>
                    <span className="m-caption__text">
                      Disputed claim kept with both sources.
                    </span>
                  </p>
                </div>
              </li>
              <li
                className="setup__card on-dark"
                style={{ "--setup-i": 2 } as CSSProperties}
              >
                <p className="setup__num m-text-2" aria-hidden="true">
                  3
                </p>
                <div className="setup__copy">
                  <h3 className="m-text-5">File it and deliver it</h3>
                  <p className="m-text-8">
                    The event joins the topic tree with its timeline, and each
                    community&rsquo;s feed picks what matters to it.
                  </p>
                </div>
                <div className="setup__ui" aria-hidden="true">
                  <p className="m-caption">
                    <span className="m-caption__wave">
                      <i></i>
                      <i></i>
                      <i></i>
                      <i></i>
                    </span>
                    <span className="m-caption__text">
                      Event added to Europe · Policy
                    </span>
                  </p>
                  <p className="m-caption-2">
                    <span className="m-caption__wave">
                      <i></i>
                      <i></i>
                      <i></i>
                      <i></i>
                    </span>
                    <span className="m-caption__text">
                      Timeline updated · 3 new reports
                    </span>
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* faq: questions and answers (native <details>) */}
        <section
          className="faq"
          id="faq"
          data-8b-section="faq"
          aria-labelledby="faq-title"
        >
          <div className="faq__sheet m-band" aria-hidden="true"></div>
          <div className="faq__inner l-wrap">
            <div className="faq__head">
              <h2
                className="m-text-3"
                id="faq-title"
                data-8b-motion="captionIn"
              >
                Questions, answered plainly.
              </h2>
              <p className="m-text-8">
                Still wondering about something?{" "}
                <a className="m-link" href="#contact">
                  Tell the team
                </a>{" "}
                — editors read every note.
              </p>
            </div>
            <div className="faq__list">
              {faqs.map((faq) => (
                <details className="faq__item" key={faq.question}>
                  <summary className="m-text-5">
                    {faq.question}
                    <span className="faq__icon" aria-hidden="true"></span>
                  </summary>
                  <p className="m-text">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* call-to-action: closing call to action over a photo that opens from a small window to the full band (animation: scene:start) */}
        <section
          className="start on-dark"
          id="start"
          data-8b-section="call-to-action"
          aria-labelledby="start-title"
        >
          <div className="start__sheet m-band-4" aria-hidden="true"></div>
          <div className="start__inner l-wrap">
            <div className="start__window">
              <img
                src={startImage.src}
                srcSet={startImage.srcSet}
                sizes="(max-width: 767px) 269vw, 92vw"
                style={{ background: "#26260c" }}
                width={1600}
                height={1067}
                alt="A young woman smiles as she talks on the phone in a leafy garden"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="start__copy">
              <h2 className="m-text-3" id="start-title">
                Follow the story, not just the headline.
              </h2>
              <p className="m-text-4">
                Create an account, pick your language and topics, and read a
                feed built from real sources, with the original link on every
                story.
              </p>
              <div className="start__actions">
                <LandingCta className="m-btn" label="Open the dashboard" />
                <a className="m-link m-text-6" href="#contact">
                  Send feedback
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* contact: support hours, a photo, three ways to reach the team and a contact form */}
        <section
          className="contact"
          id="contact"
          data-8b-section="contact"
          aria-labelledby="contact-title"
        >
          <div
            className="contact__sheet m-band-2"
            aria-hidden="true"
            data-8b-motion="bandRise"
          ></div>
          <div className="contact__inner l-wrap">
            <div className="contact__info">
              <h2
                className="m-text-3"
                id="contact-title"
                data-8b-motion="captionIn"
              >
                Help shape what gets built.
              </h2>
              <p className="m-text-4">
                Tell us which sources, languages and checks matter to you.
                Feedback goes straight to the editors, who read it in the
                editor workspace.
              </p>
              <figure className="contact__photo">
                <img
                  src={contactImage.src}
                  srcSet={contactImage.srcSet}
                  sizes="(max-width: 767px) 90vw, 47vw"
                  style={{ background: "#260c0c" }}
                  width={1600}
                  height={1067}
                  alt="A smiling support specialist wearing a headset at her desk"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <ul className="contact__ways">
                <li>
                  <p className="m-text-6">Readers</p>
                  <a className="m-link m-text-5" href="/dashboard/feedback">
                    Send feedback
                  </a>
                </li>
                <li>
                  <p className="m-text-6">Editors</p>
                  <a className="m-link m-text-5" href="#faq">
                    How editor access works
                  </a>
                </li>
                <li>
                  <p className="m-text-6">Roadmap</p>
                  <a className="m-link m-text-5" href="#setup">
                    What is built next
                  </a>
                </li>
              </ul>
            </div>
            <ContactPanel />
          </div>
        </section>
      </main>

      {/* footer: tagline, link columns, giant wordmark, copyright and a legal note (animation: scene:footer) */}
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
              <a className="m-link m-text-6" href="#hero">
                Back to the top
              </a>
            </div>
            <div className="footer__cols m-text-6">
              <div className="footer__col">
                <h2 className="m-text-6">Product</h2>
                <ul>
                  <li>
                    <a className="m-link-2" href="#listen">
                      How it works
                    </a>
                  </li>
                  <li>
                    <a className="m-link-2" href="#calls">
                      What&rsquo;s built
                    </a>
                  </li>
                  <li>
                    <a className="m-link-2" href="#rooms">
                      Events
                    </a>
                  </li>
                  <li>
                    <a className="m-link-2" href="#tune">
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
                    <a className="m-link-2" href="#contact">
                      Get involved
                    </a>
                  </li>
                  <li>
                    <a className="m-link-2" href="#faq">
                      Questions
                    </a>
                  </li>
                  <li>
                    <a className="m-link-2" href="#setup">
                      Editor access
                    </a>
                  </li>
                </ul>
              </div>
              <div className="footer__col">
                <h2 className="m-text-6">Company</h2>
                <ul>
                  <li>
                    <a className="m-link-2" href="#voices">
                      Principles
                    </a>
                  </li>
                  <li>
                    <a className="m-link-2" href="#setup">
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
            <p>
              © 2026 KalevaShorts.
            </p>
            <ul>
              <li>
                <a className="m-link" href="#voices">
                  Principles
                </a>
              </li>
              <li>
                <a className="m-link" href="#faq">
                  FAQ
                </a>
              </li>
              <li>
                <a className="m-link" href="#hero">
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

      <div hidden aria-hidden="true">
        {templateParts.map((part) => (
          <span key={part} data-8b-part={part}></span>
        ))}
      </div>

      <LandingMotion />
    </>
  );
}
