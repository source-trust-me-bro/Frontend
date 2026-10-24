/* eslint-disable @next/next/no-img-element */
/*
  Landing page adapted from the free 8B App Landing Page Template.
  Free website template by 8B: https://8b.com/templates/linea/
  Source: https://github.com/8bsite/app-landing-page-template
  MIT License (code) https://8b.com/ · Photos: Unsplash License, see CREDITS.md · Fonts: Google Fonts (OFL)
  All ids, data-8b-section and data-8b-motion hooks are preserved for the scene scripts in landing-motion.tsx.
*/

import type { CSSProperties } from "react";

import { ContactForm } from "./contact-form";
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
    label: "Local · Helsinki",
    image: counterImage,
    sizes: "(max-width: 767px) 90vw, 17vw",
    width: 1600,
    height: 2400,
    alt: "A woman with a backpack orders at a café counter",
    background: "#40260c",
    source: "The council meeting starts at 17:00.",
    translation: "Kaupunginvaltuusto kokoontuu kello 17.",
  },
  {
    label: "Nordic · Stockholm",
    image: tableImage,
    sizes: "(max-width: 767px) 90vw, 22vw",
    width: 1600,
    height: 1803,
    alt: "A family laughs together over lunch at a home table",
    background: "#c0c0c0",
    source: "The committee wants an independent review.",
    translation: "Valiokunta haluaa riippumattoman tarkastuksen.",
  },
  {
    label: "Europe · Brussels",
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
    label: "Science · Tampere",
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
    label: "Community · Turku",
    image: cornerImage,
    sizes: "(max-width: 767px) 90vw, 19vw",
    width: 1600,
    height: 2092,
    alt: "Neighbours sit and chat outside a shop on a cobbled street",
    background: "#404040",
    source: "Neighbours meet on Saturday at ten.",
    translation: "Naapurit tapaavat lauantaina kello kymmenen.",
  },
];

const callSteps = [
  {
    title: "Every article keeps its source",
    body: "Headlines arrive with the outlet, reporter, publication time and a direct link to the original reporting.",
  },
  {
    title: "Language switching, in place",
    body: "Read the same story in English or Finnish without losing the paragraph you were on.",
  },
  {
    title: "Cross-language alignment",
    body: "Sentences are paired across languages, so you can compare the translation with the original line by line.",
  },
  {
    title: "Claims under review",
    body: "Unverified statements are labelled and linked to the outlets that confirm, dispute or add context.",
  },
  {
    title: "Keep the verification trail",
    body: "Pin a story and keep its sources, revisions and language versions together in one place.",
  },
];

const tuneSettings = [
  {
    title: "Headline size",
    body: "From a compact briefing to a full reading view.",
    control: "size",
  },
  {
    title: "Reading weight",
    body: "Lighter or bolder text for long sessions.",
    control: "weight",
  },
  {
    title: "Contrast",
    body: "Light, dark, or follow your system.",
    control: "contrast",
  },
];

const faqs = [
  {
    question: "What is KalevaShorts?",
    answer:
      "KalevaShorts is an open-source bilingual Finnish–English news platform. It ingests reporting in Finnish and English, aligns translations with the original text, and keeps every claim attached to its source.",
  },
  {
    question: "Which languages are supported today?",
    answer:
      "The first release is bilingual: English and Finnish across the feed, translation view and editor workspace. Each profile stores a single lead language so the reader and the FastAPI service stay in sync.",
  },
  {
    question: "How do you verify a story?",
    answer:
      "Each article carries its outlet, reporter, publication time and a link to the original. Claims can be cross-checked against other outlets, labelled as confirmed, disputed or still under review, and the trail stays visible to readers.",
  },
  {
    question: "Is the translation automatic?",
    answer:
      "Translations are generated automatically and aligned sentence by sentence with the original. Community editors can correct them, and readers can always open the source text beside the translation.",
  },
  {
    question: "Do I need an account to read?",
    answer:
      "You can explore the landing page without an account. The dashboard, saved stories, language preferences and editor tools require a Clerk session so the FastAPI profile can stay in sync.",
  },
  {
    question: "Can I self-host the platform?",
    answer:
      "Yes. The stack is a Next.js frontend, Clerk for authentication and a FastAPI service backed by MongoDB. All configuration lives in three environment variables, so a self-hosted instance stays portable.",
  },
  {
    question: "How do editor roles work?",
    answer:
      "Roles are stored in Clerk session metadata. The editor workspace verifies editor or admin access on the server before rendering any controls, and the API receives the same Clerk bearer token.",
  },
  {
    question: "Is the code open source?",
    answer:
      "Yes. The platform is open source under the MIT license. This landing page is adapted from the 8B App Landing Page Template.",
  },
];

const voicePanels = [
  {
    label: "Source feed · English",
    className: "m-caption",
    text: "The council approved the new budget on Tuesday.",
  },
  {
    label: "Translation · Suomi",
    className: "m-caption",
    text: "Valtuusto hyväksyi uuden budjetin tiistaina.",
  },
];

const verificationCards = [
  {
    title: "Source-first",
    body: "Every article carries a link to the original outlet, reporter and publication time.",
  },
  {
    title: "Bilingual by default",
    body: "Finnish and English are aligned sentence by sentence, not stitched together.",
  },
  {
    title: "Community curation",
    body: "Local editors can curate topics, correct translations and flag claims for review.",
  },
  {
    title: "Self-hostable",
    body: "Next.js, FastAPI and MongoDB run from three environment variables and a single repository.",
  },
  {
    title: "Transparent revisions",
    body: "Corrections keep their history, so readers can see what changed and when.",
  },
  {
    title: "No engagement ranking",
    body: "The feed is ordered by recency and verification state, not by outrage.",
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
                    The council approved the budget on Tuesday.
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
                    Valtuusto hyväksyi budjetin tiistaina.
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
                Every story, readable in your language.
              </h1>
              <div className="hero__lower">
                <p className="m-text-4 hero__lead">
                  KalevaShorts brings Finnish and English reporting into one
                  calm reading surface — with the original text and every
                  source still in view.
                </p>
                <ul className="hero__proof m-text-6">
                  <li>
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path className="hero__tick" d="M3 8.5l3 3 7-7" />
                    </svg>
                    Open source under MIT
                  </li>
                  <li>
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path className="hero__tick" d="M3 8.5l3 3 7-7" />
                    </svg>
                    Self-hostable FastAPI + MongoDB
                  </li>
                  <li>
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path className="hero__tick" d="M3 8.5l3 3 7-7" />
                    </svg>
                    English · Suomi
                  </li>
                </ul>
                <div className="hero__actions">
                  <LandingCta className="m-btn" label="Start reading free" />
                  <a className="m-link m-text-6" href="#listen">
                    See how verification works
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
              Nothing lost between a source and a reader.
            </h2>
            <p
              className="m-text-4 listen__lead"
              data-8b-motion="readAlong"
            >
              Every story arrives with its original language, a translation you
              can compare line by line, and a record of where each claim came
              from. Nothing is smoothed over.
            </p>
          </div>
          <div className="listen__hold">
            <div className="listen__stage l-wrap">
              <div className="listen__panels">
                <div className="listen__panel listen__panel--voice">
                  <p className="m-text-6 listen__label">Source feed</p>
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
                    Cross-language read
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
                A feed that shows its work.
              </h2>
              <div className="calls__head-copy">
                <p className="m-text-4 calls__lead">
                  KalevaShorts reads the original, aligns the translation and marks
                  the source of every claim. You decide how much detail to
                  open.
                </p>
                <LandingCta className="m-btn" label="Open your feed" />
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
                      aria-label="Example of a verified story on KalevaShorts"
                    >
                      <div className="phone__screen">
                        <div className="phone__top">
                          <p className="phone__who">Nordic desk</p>
                          <p className="phone__state">
                            <span
                              className="phone__dot"
                              aria-hidden="true"
                            ></span>
                            Live verification · 02:14
                          </p>
                          <span className="phone__end" aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                              <path d="M4 14c4-4 12-4 16 0l-2 3-3-1v-2c-2-1-4-1-6 0v2l-3 1z" />
                            </svg>
                          </span>
                        </div>
                        <p className="phone__number" data-step="2">
                          Language · English
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
                                Municipal budget passed 42–18 on Tuesday.
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
                                Read in Suomi — 18 paragraphs aligned.
                              </span>
                            </p>
                            <p className="phone__note">
                              Translation view · source kept in step
                            </p>
                          </li>
                          <li className="phone__cue" data-step="4">
                            Cross-checking with two regional outlets
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
                                Both outlets report the same vote count.
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
                                Saved with four linked sources.
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
                          Verification trail saved
                        </p>
                        <div className="phone__bar" aria-hidden="true">
                          <span>
                            <svg viewBox="0 0 24 24">
                              <path d="M4 10v4h4l5 4V6L8 10zM16 9a4 4 0 0 1 0 6" />
                            </svg>
                            Feed
                          </span>
                          <span>
                            <svg viewBox="0 0 24 24">
                              <rect
                                x="9"
                                y="3"
                                width="6"
                                height="11"
                                rx="3"
                              />
                              <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
                            </svg>
                            Sources
                          </span>
                          <span>
                            <svg viewBox="0 0 24 24">
                              <rect
                                x="3"
                                y="6"
                                width="18"
                                height="12"
                                rx="2"
                              />
                              <path d="M7 10h1M11 10h1M15 10h1M8 14h8" />
                            </svg>
                            Language
                          </span>
                          <span>
                            <svg viewBox="0 0 24 24">
                              <path d="M6 6h.01M12 6h.01M18 6h.01M6 12h.01M12 12h.01M18 12h.01M6 18h.01M12 18h.01M18 18h.01" />
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
                <span>English · Verified · Dark</span>
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
                  Choose how much source detail sits beside each story, and
                  which language leads. KalevaShorts keeps that choice on every
                  device.
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
                          <span>Light</span>
                          <span>Dark</span>
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
                  <h3 className="m-text-5">Preferred language</h3>
                  <p className="m-text-8">
                    English or Finnish as your lead reading language.
                  </p>
                  <span className="tune__ctl tune__tag" aria-hidden="true">
                    EN · FI
                  </span>
                </li>
                <li className="tune__row">
                  <h3 className="m-text-5">Verified sources only</h3>
                  <p className="m-text-8">
                    Show stories that carry at least two independent sources.
                  </p>
                  <span
                    className="tune__ctl tune__toggle"
                    aria-hidden="true"
                  ></span>
                </li>
                <li className="tune__row">
                  <h3 className="m-text-5">Source languages</h3>
                  <p className="m-text-8">
                    Follow reporting in Finnish and English.
                  </p>
                  <span className="tune__ctl tune__tag" aria-hidden="true">
                    2 active
                  </span>
                </li>
                <li className="tune__row">
                  <h3 className="m-text-5">Hide unverified claims</h3>
                  <p className="m-text-8">
                    Collapse statements that are still under review.
                  </p>
                  <span
                    className="tune__ctl tune__toggle"
                    aria-hidden="true"
                  ></span>
                </li>
                <li className="tune__row">
                  <h3 className="m-text-5">Sync across devices</h3>
                  <p className="m-text-8">
                    Your language and source preferences follow your account.
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
              Five streams. One verified picture.
            </h2>
            <p
              className="m-text-4 rooms__lead"
              data-8b-motion="readAlong"
            >
              Follow municipal reporting, Nordic coverage, European policy,
              science and community briefings — each with its own sources in
              Finnish and English.
            </p>
          </div>
          <div className="rooms__hold">
            <div className="rooms__stage">
              <p className="rooms__now m-text-6">
                <i aria-hidden="true"></i>All streams · every source linked
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
              Built in the open. Checked in Finnish and English.
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
                    “A translation is only trustworthy when the reader can
                    still see the original.”
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
                    KalevaShorts maintainers
                    <br />
                    <span>Open-source project</span>
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
                Three steps, then just read.
              </h2>
              <p className="m-text-4">
                No installer and no proprietary lock-in. Sign in, choose
                English or Finnish, and start with a verified feed.
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
                  <h3 className="m-text-5">Sign in with Clerk</h3>
                  <p className="m-text-8">
                    One account gives you a synced profile, saved stories and
                    editor tools when your role allows it.
                  </p>
                </div>
                <div className="setup__ui m-text-6" aria-hidden="true">
                  <p className="setup__check">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M8 12.5l2.5 2.5L16 9.5" />
                    </svg>
                    Secure session created
                  </p>
                  <p className="setup__check">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M8 12.5l2.5 2.5L16 9.5" />
                    </svg>
                    Profile synced with FastAPI
                  </p>
                  <p className="setup__check">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M8 12.5l2.5 2.5L16 9.5" />
                    </svg>
                    Preferences ready
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
                  <h3 className="m-text-5">
                    Pick your lead language and community
                  </h3>
                  <p className="m-text-8">
                    Choose English or Finnish as your lead language and follow
                    the streams that matter locally.
                  </p>
                </div>
                <div className="setup__ui m-text-6" aria-hidden="true">
                  <p className="setup__option setup__option--on">
                    English · Suomi
                    <span>Selected</span>
                  </p>
                  <p className="setup__option">
                    Bilingual coverage
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
                      Preferences saved to your profile.
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
                  <h3 className="m-text-5">Read or curate</h3>
                  <p className="m-text-8">
                    Follow verified cross-language stories, or apply for a
                    Community Editor role to curate topics and sources.
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
                      Story verified · four sources
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
                      Added to Local · Helsinki
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
                  Ask a person
                </a>{" "}
                — the project team reads every note.
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
                Your next story can arrive in your language.
              </h2>
              <p className="m-text-4">
                Open the dashboard, pick English or Suomi, and read with the
                sources in view.
              </p>
              <div className="start__actions">
                <LandingCta className="m-btn" label="Open your dashboard" />
                <a className="m-link m-text-6" href="#contact">
                  Talk to the team
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
                Talk to a person, in English or Finnish.
              </h2>
              <p className="m-text-4">
                The project team answers by email and in the community forum.
                We read English and Finnish.
              </p>
              <p className="m-text-7">
                Contact details and response times are owner-configurable.
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
                  <p className="m-text-6">Email</p>
                  <a
                    className="m-link m-text-5"
                    href="mailto:hello@kalevashorts.example"
                  >
                    hello@kalevashorts.example
                  </a>
                </li>
                <li>
                  <p className="m-text-6">Community</p>
                  <a className="m-link m-text-5" href="#contact-form">
                    Open the forum
                  </a>
                </li>
                <li>
                  <p className="m-text-6">Editorial</p>
                  <a className="m-link m-text-5" href="#contact-form">
                    Apply as a Community Editor
                  </a>
                </li>
              </ul>
            </div>
            <ContactForm />
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
                Verified news, in Finnish and English.
              </h2>
              <p className="m-text-4">
                An open-source reading layer for Finnish–English reporting.
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
                      On the feed
                    </a>
                  </li>
                  <li>
                    <a className="m-link-2" href="#rooms">
                      Streams
                    </a>
                  </li>
                  <li>
                    <a className="m-link-2" href="#tune">
                      Reading settings
                    </a>
                  </li>
                </ul>
              </div>
              <div className="footer__col">
                <h2 className="m-text-6">Support</h2>
                <ul>
                  <li>
                    <a
                      className="m-link-2"
                      href="mailto:hello@kalevashorts.example"
                    >
                      hello@kalevashorts.example
                    </a>
                  </li>
                  <li>
                    <a className="m-link-2" href="#contact">
                      Contact us
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
                      Verification
                    </a>
                  </li>
                  <li>
                    <a className="m-link-2" href="#setup">
                      Getting started
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
              © 2026 KalevaShorts contributors. Code under the MIT license.
            </p>
            <ul>
              <li>
                <a className="m-link" href="#contact">
                  Privacy
                </a>
              </li>
              <li>
                <a className="m-link" href="#faq">
                  Terms
                </a>
              </li>
              <li>
                <a className="m-link" href="#hero">
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
          <p className="footer__note m-text-7">
            KalevaShorts is an open-source project. Translations are provided for
            cross-language reading and should be checked against the linked
            original when accuracy is critical.
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
