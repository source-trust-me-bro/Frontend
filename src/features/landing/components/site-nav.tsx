"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { LandingCta } from "./landing-cta";

const navLinks = [
  { href: "#listen", label: "How it works" },
  { href: "#calls", label: "On the feed" },
  { href: "#rooms", label: "Streams" },
  { href: "#voices", label: "Verification" },
  { href: "#faq", label: "Questions" },
  { href: "#contact", label: "Contact" },
];

export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const barRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const measure = () => {
      document.documentElement.style.setProperty(
        "--page-nav-h",
        `${Math.ceil(bar.getBoundingClientRect().bottom + 12)}px`,
      );
    };

    measure();
    window.measureNav = measure;
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("resize", measure);

      if (window.measureNav === measure) {
        delete window.measureNav;
      }
    };
  }, []);

  const openMenu = useCallback(() => {
    setMenuOpen(true);
    document.body.style.overflow = "hidden";
    window.lenis?.stop();
    requestAnimationFrame(() => closeRef.current?.focus());
  }, []);

  const shutMenu = useCallback((focusToggle = true) => {
    setMenuOpen(false);
    document.body.style.overflow = "";
    window.lenis?.start();

    if (focusToggle) {
      toggleRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        shutMenu();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, shutMenu]);

  return (
    <header className="nav on-dark" id="nav" data-8b-section="navigation">
      <nav className="nav__bar" aria-label="Main" ref={barRef}>
        <a
          className="nav__brand"
          href="#hero"
          aria-label="KalevaShorts, back to top"
        >
          <svg
            className="nav__mark"
            viewBox="0 0 40 28"
            aria-hidden="true"
          >
            <path
              className="nav__mark-a"
              d="M3 19C10 5 17 5 21 14s11 9 16-6"
            />
            <path
              className="nav__mark-b"
              d="M3 10c7 13 14 13 18 4s11-10 16 5"
            />
          </svg>
          <span className="nav__word m-text-5">KalevaShorts</span>
        </a>
        <ul className="nav__links m-text-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a className="m-link-2" href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <LandingCta className="m-btn-3 nav__cta" label="Open KalevaShorts" />
        <button
          className="m-icon-btn nav__toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="menu"
          aria-label="Open menu"
          onClick={openMenu}
          ref={toggleRef}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 8h16M4 16h16" />
          </svg>
        </button>
      </nav>
      <div
        className="menu"
        id="menu"
        data-lenis-prevent
        hidden={!menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <button
          className="m-icon-btn menu__close"
          type="button"
          aria-label="Close menu"
          onClick={() => shutMenu()}
          ref={closeRef}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <ul className="menu__links m-text-5">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                className="m-link-2"
                href={link.href}
                onClick={() => shutMenu(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <LandingCta className="m-btn" label="Open KalevaShorts" />
      </div>
    </header>
  );
}
