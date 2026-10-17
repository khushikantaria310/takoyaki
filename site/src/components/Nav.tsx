"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { discordInviteUrl } from "@/lib/site-config";

const links = [
  { href: "#notifications", label: "Notifications" },
  { href: "#setup", label: "Setup" },
];

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const menuTransition = { duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" as const };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href="#main" aria-label="Takoyaki, back to the top">
          <span className="brand__seal" aria-hidden="true">焼</span>
              <span className="brand__wordmark">Takoyaki<span>!</span></span>
        </a>

        <nav className="site-nav" aria-label="Main navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <a className="site-header__invite" href={discordInviteUrl} target="_blank" rel="noreferrer" aria-label="Add Takoyaki to Discord">
          <span className="invite-button">
            Add to Discord <span className="invite-button__arrow" aria-hidden="true">↗</span>
          </span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="menu-toggle__lines" aria-hidden="true" />
        </button>

        <AnimatePresence initial={false}>
          {menuOpen && (
            <motion.nav
              className="mobile-menu"
              id="mobile-menu"
              aria-label="Mobile navigation"
              initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={menuTransition}
            >
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
