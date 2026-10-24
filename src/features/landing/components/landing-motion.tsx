"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

type SceneContext = {
  conditions?: Record<string, boolean>;
};

const media = {
  wide: "(min-width: 48rem) and (prefers-reduced-motion: no-preference)",
  narrow: "(max-width: 47.99rem) and (prefers-reduced-motion: no-preference)",
};

let captionPlayed = new WeakSet<Element>();

function query<T extends Element>(scope: ParentNode, selector: string): T {
  const element = scope.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Missing landing selector: ${selector}`);
  }

  return element;
}

function queryAll<T extends Element>(
  scope: ParentNode,
  selector: string,
): T[] {
  return Array.from(scope.querySelectorAll<T>(selector));
}

export function LandingMotion() {
  useEffect(() => {
    let disposed = false;
    let teardown: (() => void) | undefined;

    const adjacent = (a: string, b: string) => {
      const order = queryAll<HTMLElement>(document, "[data-8b-section]")
        .filter(
          (section) =>
            section.getAttribute("data-8b-section") !== "navigation",
        )
        .map((section) => section.id);

      return order.indexOf(a) >= 0 && order[order.indexOf(a) + 1] === b;
    };

    const start = async () => {
      if (document.fonts) {
        await document.fonts.ready;
      }

      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => resolve()),
      );

      if (disposed) return;

      gsap.registerPlugin(ScrollTrigger, SplitText);

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      let LenisScroller: typeof import("lenis").default | null = null;

      if (!reducedMotion) {
        LenisScroller = (await import("lenis")).default;
      }

      if (disposed) return;

      captionPlayed = new WeakSet<Element>();

      const splits: SplitText[] = [];
      const mm = gsap.matchMedia();
      const extraCleanups: Array<() => void> = [];

      const restRadius = (element: Element) =>
        parseFloat(
          (getComputedStyle(element).clipPath.match(/round\s+([\d.]+)px/) ||
            [])[1] || "0",
        ) || 0;

      const effects = {
        captionIn(element: Element, vars: gsap.TimelineVars = {}) {
          const split = SplitText.create(element, {
            type: "lines",
            mask: "lines",
          });

          splits.push(split);

          return gsap
            .timeline({
              ...vars,
              onComplete: () => split.revert(),
            })
            .from(split.lines, {
              yPercent: 108,
              duration: 1,
              ease: "expo.out",
              stagger: 0.09,
            });
        },
        readAlong(element: Element, vars: gsap.TweenVars = {}) {
          const split = SplitText.create(element, { type: "words" });
          const ink = getComputedStyle(element).color;
          const faint = ink.replace(/^rgb\((.+)\)$/, "rgba($1, 0.22)");

          splits.push(split);

          return gsap.fromTo(
            split.words,
            { color: faint },
            { color: ink, ease: "none", stagger: 0.12, duration: 0.6, ...vars },
          );
        },
        bandRise(sheet: Element, vars: gsap.TweenVars = {}) {
          const radius = restRadius(sheet);
          const side = window.innerWidth < 768 ? 2.5 : 4;
          const big = Math.round(radius * 2.6);

          return gsap.fromTo(
            sheet,
            {
              clipPath: `inset(0% ${side}% 0% ${side}% round ${big}px ${big}px 0px 0px)`,
            },
            {
              clipPath: `inset(0% 0% 0% 0% round ${radius}px ${radius}px 0px 0px)`,
              ease: "none",
              ...vars,
            },
          );
        },
      };

      queryAll<HTMLElement>(document, "[data-8b-section]").forEach((section) => {
        const headings = queryAll<HTMLElement>(
          section,
          '[data-8b-motion~="captionIn"]',
        );

        if (headings.length) {
          mm.add(media, () => {
            headings.forEach((heading, index) => {
              if (captionPlayed.has(heading)) return;

              const timeline = effects.captionIn(heading, { paused: true });

              ScrollTrigger.create({
                id: `effect:captionIn:${section.id}:${index}`,
                trigger: heading,
                start: "top 88%",
                once: true,
                onEnter: () => {
                  captionPlayed.add(heading);
                  timeline.play();
                },
              });
            });
          });
        }

        const reads = queryAll<HTMLElement>(
          section,
          '[data-8b-motion~="readAlong"]',
        );

        if (reads.length) {
          mm.add(media, () => {
            reads.forEach((element, index) => {
              ScrollTrigger.create({
                id: `effect:readAlong:${section.id}:${index}`,
                trigger: element,
                start: "top 88%",
                end: "bottom 60%",
                scrub: true,
                animation: effects.readAlong(element),
              });
            });
          });
        }

        const bands = queryAll<HTMLElement>(
          section,
          '[data-8b-motion~="bandRise"]',
        );

        if (bands.length) {
          mm.add(media, () => {
            bands.forEach((sheet, index) => {
              ScrollTrigger.create({
                id: `effect:bandRise:${section.id}:${index}`,
                trigger: section,
                start: "top bottom",
                end: "top 25%",
                scrub: true,
                animation: effects.bandRise(sheet),
              });
            });
          });
        }
      });

      const heroObserver = new IntersectionObserver(([entry]) => {
        const hero = document.getElementById("hero");
        hero?.classList.toggle("is-paused", !entry.isIntersecting);
      });
      const heroElement = document.getElementById("hero");

      if (heroElement) {
        heroObserver.observe(heroElement);
        extraCleanups.push(() => {
          heroObserver.disconnect();
          heroElement.classList.remove("is-paused");
        });
      }

      mm.add(media, (context: SceneContext) => {
        const hero = query<HTMLElement>(document, "#hero");
        const copy = query<HTMLElement>(hero, ".hero__copy");
        const talk = query<HTMLElement>(hero, ".hero__talk");
        const heroMedia = query<HTMLElement>(hero, ".hero__media");
        const wide = Boolean(context.conditions?.wide);

        if (!adjacent("hero", "listen")) return;

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              id: "hero:exit",
              trigger: hero,
              start: "bottom bottom",
              end: "bottom 20%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          .to(
            heroMedia,
            {
              scale: 1.1,
              transformOrigin: wide ? "100% 30%" : "62% 30%",
            },
            0,
          )
          .to(
            copy,
            { y: () => -window.innerHeight * (wide ? 0.26 : 0.16) },
            0,
          )
          .to(
            talk,
            { y: () => -window.innerHeight * (wide ? 0.14 : 0.1) },
            0,
          );
      });

      mm.add(media, (context: SceneContext) => {
        const root = query<HTMLElement>(document, "#listen");
        const sheet = query<HTMLElement>(root, ".listen__sheet");
        const title = query<HTMLElement>(root, ".listen__title");
        const hold = query<HTMLElement>(root, ".listen__hold");
        const voice = query<HTMLElement>(root, ".listen__panel--voice");
        const read = query<HTMLElement>(root, ".listen__panel--read");
        const voiceTrack = query<HTMLElement>(root, ".listen__track--voice");
        const rows = queryAll<HTMLElement>(
          root,
          ".listen__track--read > .listen__row",
        );
        const bars = queryAll<HTMLElement>(root, ".listen__wave > i");
        const wide = Boolean(context.conditions?.wide);

        if (adjacent("hero", "listen")) {
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                id: "listen:entry",
                trigger: root,
                start: "top bottom",
                end: "top 20%",
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
            .add(effects.bandRise(sheet), 0)
            .fromTo(
              title,
              wide
                ? { y: () => window.innerHeight * 0.22 }
                : { x: () => window.innerWidth * 0.22 },
              wide ? { y: 0 } : { x: 0 },
              0,
            );
        }

        root.classList.add("is-staged");

        const clones = rows.map((row) => {
          const clone = row.cloneNode(true) as HTMLElement;

          clone.classList.add("listen__row--voice");

          const text = query<HTMLElement>(clone, ".m-caption__text");
          const words = (text.textContent ?? "").trim().split(/\s+/);

          text.textContent = "";
          words.forEach((word, index) => {
            const span = document.createElement("span");

            span.className = "listen__word";
            span.style.setProperty(
              "--h",
              (0.45 + 0.55 * Math.abs(Math.sin(index * 1.7 + word.length)))
                .toFixed(2),
            );
            span.textContent = word;
            text.append(span, index < words.length - 1 ? " " : "");
          });

          voiceTrack.append(clone);
          return clone;
        });

        const pairs = rows.map((row, index) => [row, clones[index]]);

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              id: "listen:join",
              trigger: hold,
              start: "top bottom",
              end: "top top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(
            voice,
            { x: () => -window.innerWidth * (wide ? 0.08 : 0.07) },
            { x: 0 },
            0,
          )
          .fromTo(
            read,
            { x: () => window.innerWidth * (wide ? 0.08 : 0.07) },
            { x: 0 },
            0,
          );

        const setters = bars.map((bar) =>
          gsap.quickSetter(bar, "scaleY"),
        );
        const cross = gsap.timeline({
          defaults: { ease: "power1.inOut" },
          scrollTrigger: {
            id: "listen",
            trigger: hold,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progress = self.progress;
              const swell = Math.sin(Math.PI * progress);

              setters.forEach((set, index) =>
                set(
                  1 -
                    swell *
                      0.7 *
                      (1 -
                        Math.abs(Math.sin(index * 0.45 + progress * 18))),
                ),
              );
            },
          },
        });

        // Each news line gets its own stretch of scroll: it travels across, settles
        // in the evidence panel and stays there before the next one starts.
        const TRAVEL = 1;
        const GAP = 0.35;

        pairs.forEach((pair, index) => {
          const row = pair[0];
          const shift = wide
            ? () =>
                -(
                  row.offsetLeft -
                  read.offsetWidth +
                  row.offsetWidth +
                  32
                )
            : () => voice.offsetHeight;

          cross.fromTo(
            pair,
            wide ? { x: shift } : { y: shift },
            wide
              ? { x: 0, duration: TRAVEL, ease: "power2.out" }
              : { y: 0, duration: TRAVEL, ease: "power2.out" },
            index * (TRAVEL + GAP),
          );
        });

        cross.to({}, { duration: 0.35 });

        return () => {
          root.classList.remove("is-staged");
          clones.forEach((clone) => clone.remove());
        };
      });

      mm.add(media, (context: SceneContext) => {
        const root = query<HTMLElement>(document, "#calls");
        const list = query<HTMLElement>(root, ".calls__list");
        const items = Array.from(list.children) as HTMLElement[];
        const device = query<HTMLElement>(root, ".calls__device");
        const steps = items.map((_, index) =>
          queryAll<HTMLElement>(
            root,
            `.phone [data-step="${index + 1}"]`,
          ),
        );
        const wide = Boolean(context.conditions?.wide);
        const line = wide ? "58%" : "52%";
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            id: "calls",
            trigger: items[0],
            start: `top ${line}`,
            endTrigger: items[items.length - 1],
            end: `bottom ${line}`,
            scrub: true,
          },
        });

        items.forEach((item, index) => {
          if (index > 0) {
            timeline.fromTo(
              item,
              { opacity: 0.32 },
              { opacity: 1, duration: 0.25 },
              index - 0.1,
            );
          }

          if (index < items.length - 1) {
            timeline.to(item, { opacity: 0.32, duration: 0.25 }, index + 0.9);
          }

          if (steps[index].length) {
            timeline.from(
              steps[index],
              {
                opacity: 0,
                y: 14,
                scale: 0.94,
                transformOrigin: "50% 100%",
                duration: 0.3,
                stagger: 0.18,
                ease: "power2.out",
              },
              index + 0.05,
            );
          }
        });

        timeline.to(
          items.slice(0, -1),
          { opacity: 1, duration: 0.3 },
          items.length - 0.1,
        );

        if (adjacent("calls", "tune")) {
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                id: "calls:exit",
                trigger: root,
                start: "bottom bottom",
                end: "bottom 30%",
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
            .to(
              device,
              {
                scale: 0.8,
                rotation: -7,
                y: () =>
                  -window.innerHeight * (wide ? 0.12 : 0.08),
              },
              0,
            );
        }
      });

      mm.add(media, () => {
        const root = query<HTMLElement>(document, "#tune");
        const stage = query<HTMLElement>(root, ".tune__stage");
        const lines = queryAll<HTMLElement>(root, ".tune__line");
        const sizeFill = query<HTMLElement>(
          root,
          '[data-ctl="size"] .tune__fill',
        );
        const sizeThumb = query<HTMLElement>(
          root,
          '[data-ctl="size"] .tune__thumb',
        );
        const weightFill = query<HTMLElement>(
          root,
          '[data-ctl="weight"] .tune__fill',
        );
        const weightThumb = query<HTMLElement>(
          root,
          '[data-ctl="weight"] .tune__thumb',
        );
        const pill = query<HTMLElement>(
          root,
          '[data-ctl="contrast"] .tune__pill',
        );
        const tokens = getComputedStyle(document.documentElement);
        const paper = tokens.getPropertyValue("--color-2").trim();
        const ink = tokens.getPropertyValue("--color-1").trim();
        const offset = (element: HTMLElement, stop?: HTMLElement) => {
          let x = 0;
          let y = 0;

          for (
            let node: HTMLElement | null = element;
            node && node !== stop;
            node = node.offsetParent as HTMLElement | null
          ) {
            x += node.offsetLeft;
            y += node.offsetTop;
          }

          return { x, y };
        };

        if (adjacent("calls", "tune")) {
          const calls = query<HTMLElement>(document, "#calls");
          const aside = query<HTMLElement>(calls, ".calls__aside");
          const sticky = query<HTMLElement>(calls, ".calls__sticky");
          const screen = query<HTMLElement>(calls, ".phone__screen");

          let geometry: {
            x: number;
            y: number;
            scale: number;
          };

          const measure = () => {
            const startScroll = offset(root).y - window.innerHeight;
            const asideAt = offset(aside);
            const style = getComputedStyle(sticky);
            const released =
              asideAt.y +
              aside.offsetHeight -
              sticky.offsetHeight -
              startScroll;
            const fromBottom = style.top === "auto" && style.bottom !== "auto";
            const stickyY = fromBottom
              ? Math.min(
                  released,
                  window.innerHeight -
                    (parseFloat(style.bottom) || 0) -
                    sticky.offsetHeight,
                )
              : Math.min(
                  Math.max(
                    asideAt.y - startScroll,
                    parseFloat(style.top) || 0,
                  ),
                  released,
                );
            const inner = offset(screen, sticky);
            const screenX =
              asideAt.x + inner.x + screen.offsetWidth / 2;
            const screenY =
              stickyY + inner.y + screen.offsetHeight / 2;
            const stageAt = offset(stage);

            geometry = {
              x: screenX - (stageAt.x + stage.offsetWidth / 2),
              y:
                screenY -
                (stageAt.y - startScroll + stage.offsetHeight / 2),
              scale:
                window.innerWidth < 768
                  ? 0.12
                  : Math.max(0.16, screen.offsetWidth / stage.offsetWidth),
            };

            return geometry.x;
          };

          gsap
            .timeline({
              scrollTrigger: {
                id: "tune:entry",
                trigger: root,
                start: "top bottom",
                end: "top 30%",
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
            .fromTo(
              stage,
              { scale: 0 },
              {
                scale: () => (measure(), geometry.scale),
                ease: "none",
                duration: 0.02,
                immediateRender: false,
              },
              0,
            )
            .fromTo(
              stage,
              {
                x: measure,
                y: () => geometry.y,
                scale: () => geometry.scale,
              },
              {
                x: 0,
                y: 0,
                scale: 1,
                ease: "power1.inOut",
                duration: 0.98,
                immediateRender: false,
              },
              0.02,
            )
            .fromTo(
              stage,
              { autoAlpha: 0 },
              {
                autoAlpha: 1,
                ease: "none",
                duration: 0.1,
                immediateRender: false,
              },
              0,
            );
        }

        const track = (element: HTMLElement) =>
          (element.parentElement as HTMLElement).offsetWidth;

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              id: "tune",
              trigger: root,
              start: "top 30%",
              end: "top -45%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(
            lines,
            { fontVariationSettings: '"wght" 300', scale: 0.8 },
            { fontVariationSettings: '"wght" 800', scale: 1, duration: 1 },
            0,
          )
          .fromTo(sizeFill, { scaleX: 0.3 }, { scaleX: 0.75, duration: 1 }, 0)
          .fromTo(
            sizeThumb,
            { x: () => -0.45 * track(sizeThumb) },
            { x: 0, duration: 1 },
            0,
          )
          .fromTo(weightFill, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
          .fromTo(
            weightThumb,
            { x: () => -0.6 * track(weightThumb) },
            { x: () => 0.4 * track(weightThumb), duration: 1 },
            0,
          )
          .fromTo(
            stage,
            { backgroundColor: paper, color: ink },
            { backgroundColor: ink, color: paper, duration: 0.3 },
            1.05,
          )
          .fromTo(
            pill,
            { xPercent: -100 },
            { xPercent: 0, duration: 0.3 },
            1.05,
          )
          .to(
            lines,
            { fontVariationSettings: '"wght" 600', duration: 0.8 },
            1.45,
          )
          .to(weightFill, { scaleX: 0.6, duration: 0.8 }, 1.45)
          .to(weightThumb, { x: 0, duration: 0.8 }, 1.45);
      });

      mm.add(media, (context: SceneContext) => {
        const root = query<HTMLElement>(document, "#rooms");
        const hold = query<HTMLElement>(root, ".rooms__hold");
        const track = query<HTMLElement>(root, ".rooms__track");
        const places = queryAll<HTMLElement>(track, ".rooms__place");
        const lines = queryAll<Element>(root, ".rooms__line");
        const wide = Boolean(context.conditions?.wide);

        root.classList.add("is-track");

        const travel = () =>
          Math.max(0, track.scrollWidth - window.innerWidth);
        const setTravel = () =>
          gsap.set(root, { "--rooms-travel": `${travel()}px` });

        setTravel();
        ScrollTrigger.addEventListener("refreshInit", setTravel);

        const lead = () =>
          Math.min(
            0.9,
            (window.innerWidth * 0.6) / track.scrollWidth,
          );
        const main = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            id: "rooms",
            trigger: hold,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        main
          .fromTo(track, { x: 0 }, { x: () => -travel(), duration: 1 }, 0)
          .fromTo(
            lines,
            {
              strokeDasharray: 1,
              strokeDashoffset: () => 1 - lead(),
            },
            { strokeDashoffset: 0, duration: 1 },
            0,
          );

        places.forEach((place, index) => {
          const image = query<HTMLElement>(place, "img");
          const talk = queryAll<HTMLElement>(
            place,
            ".rooms__talk > *",
          );

          gsap.fromTo(
            image,
            { xPercent: 7 },
            {
              xPercent: 0,
              ease: "none",
              scrollTrigger: {
                id: `rooms:photo-${index}`,
                trigger: place,
                containerAnimation: main,
                start: "left right",
                end: wide ? "left 66%" : "left 40%",
                scrub: true,
              },
            },
          );

          gsap.fromTo(
            talk,
            { y: 36, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              ease: "power2.out",
              stagger: 0.3,
              scrollTrigger: {
                id: `rooms:talk-${index}`,
                trigger: place,
                containerAnimation: main,
                start: "left 100%",
                end: wide ? "left 66%" : "left 40%",
                scrub: true,
              },
            },
          );
        });

        return () => {
          ScrollTrigger.removeEventListener("refreshInit", setTravel);
          root.classList.remove("is-track");
        };
      });

      mm.add(media, (context: SceneContext) => {
        const root = query<HTMLElement>(document, "#voices");
        const colsBox = query<HTMLElement>(root, ".voices__cols");
        const cols = queryAll<HTMLElement>(root, ".voices__col");
        const cards = queryAll<HTMLElement>(root, ".voices__col > li");
        const photo = query<HTMLElement>(root, ".voices__photo img");
        const wide = Boolean(context.conditions?.wide);

        if (wide) {
          cols.forEach((col, index) => {
            gsap.fromTo(
              col,
              { y: () => window.innerHeight * (index ? 0.42 : 0.14) },
              {
                y: 0,
                ease: "none",
                scrollTrigger: {
                  id: `voices:col-${index}`,
                  trigger: colsBox,
                  start: "top bottom",
                  end: "top 18%",
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              },
            );
          });
        } else {
          cards.forEach((card, index) => {
            gsap.fromTo(
              card,
              {
                y: () => window.innerHeight * (index % 2 ? 0.16 : 0.06),
                x: index % 2 ? 28 : -28,
              },
              {
                y: 0,
                x: 0,
                ease: "none",
                scrollTrigger: {
                  id: `voices:card-${index}`,
                  trigger: card,
                  start: "top bottom",
                  end: "top 58%",
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              },
            );
          });
        }

        gsap.fromTo(
          photo,
          { scale: 1.2 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              id: "voices:photo",
              trigger: photo.parentElement,
              start: "top bottom",
              end: "center 50%",
              scrub: true,
            },
          },
        );
      });

      mm.add(media, () => {
        const root = query<HTMLElement>(document, "#setup");
        const steps = query<HTMLElement>(root, ".setup__steps");
        const cards = Array.from(steps.children) as HTMLElement[];

        root.classList.add("is-stacked");

        const gap = () =>
          parseFloat(getComputedStyle(steps).rowGap) || 0;
        const natural = (index: number) =>
          cards
            .slice(0, index)
            .reduce((sum, card) => sum + card.offsetHeight + gap(), 0);
        const stuck = (index: number) =>
          parseFloat(getComputedStyle(cards[index]).top) || 0;

        cards.slice(0, -1).forEach((card, index) => {
          gsap.fromTo(
            card,
            { scale: 1, filter: "brightness(1)" },
            {
              scale: 0.92,
              filter: "brightness(0.68)",
              ease: "none",
              scrollTrigger: {
                id: `setup:${index}`,
                trigger: steps,
                start: () => `top+=${natural(index + 1)} bottom`,
                end: () => `top+=${natural(index + 1)} ${stuck(index + 1)}px`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });

        return () => root.classList.remove("is-stacked");
      });

      mm.add(media, (context: SceneContext) => {
        const root = query<HTMLElement>(document, "#start");
        const frame = query<HTMLElement>(root, ".start__window");
        const image = query<HTMLElement>(frame, "img");
        const heading = query<HTMLElement>(root, ".start__copy h2");
        const wide = Boolean(context.conditions?.wide);
        const radius = restRadius(frame);
        const sideX = wide ? 31 : 12;
        const sideY = wide ? 15 : 22;

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              id: "start",
              trigger: frame,
              start: "top 92%",
              end: "top 10%",
              scrub: true,
            },
          })
          .fromTo(
            frame,
            {
              clipPath: `inset(${sideY}% ${sideX}% ${sideY}% ${sideX}% round ${radius * 3}px)`,
            },
            {
              clipPath: `inset(0% 0% 0% 0% round ${radius}px)`,
            },
            0,
          )
          .fromTo(image, { scale: 1.32 }, { scale: 1 }, 0);

        root.classList.add("is-transcribing");

        const split = SplitText.create(heading, {
          type: "words",
          wordsClass: "start__word",
        });
        const tween = gsap.fromTo(
          split.words,
          { "--bar": 1 },
          {
            "--bar": 0,
            ease: "none",
            stagger: 0.16,
            duration: 0.5,
          },
        );

        splits.push(split);

        ScrollTrigger.create({
          id: "start:words",
          trigger: heading,
          start: "top 96%",
          end: "bottom 64%",
          scrub: true,
          animation: tween,
        });

        return () => {
          root.classList.remove("is-transcribing");
          split.revert();
        };
      });

      mm.add(media, () => {
        const root = query<HTMLElement>(document, "#footer");
        const brand = query<HTMLElement>(root, ".footer__brand");
        const word = query<HTMLElement>(root, ".footer__word");
        const strokes = queryAll<Element>(root, ".footer__logo path");

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              id: "footer",
              trigger: brand,
              start: "top bottom",
              end: "bottom bottom",
              scrub: true,
            },
          })
          .fromTo(word, { yPercent: 70 }, { yPercent: 0 }, 0)
          .fromTo(
            strokes,
            { strokeDasharray: 1, strokeDashoffset: 1 },
            { strokeDashoffset: 0, stagger: 0.15 },
            0,
          );
      });

      let lenisCleanup: (() => void) | undefined;

      if (LenisScroller) {
        const bar = document.querySelector("#nav .nav__bar");
        const lenis = new LenisScroller({
          lerp: 0.085,
          anchors: {
            offset: -(
              bar ? Math.ceil(bar.getBoundingClientRect().bottom) : 0
            ),
          },
        });
        const tick = (time: number) => lenis.raf(time * 1000);

        window.lenis = lenis;
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        lenisCleanup = () => {
          gsap.ticker.remove(tick);
          gsap.ticker.lagSmoothing(500, 33);
          lenis.destroy();

          if (window.lenis === lenis) {
            window.lenis = null;
          }
        };
      }

      const refresh = () => {
        window.measureNav?.();
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      };

      refresh();
      requestAnimationFrame(refresh);

      teardown = () => {
        lenisCleanup?.();
        mm.revert();
        extraCleanups.forEach((cleanup) => cleanup());
        splits.forEach((split) => {
          if (split.isSplit) split.revert();
        });
      };
    };

    start().catch((error) => {
      console.error("Landing motion failed to initialise", error);
    });

    return () => {
      disposed = true;
      teardown?.();
    };
  }, []);

  return null;
}
