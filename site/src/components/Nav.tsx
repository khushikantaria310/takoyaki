"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#home", label: "home" },
  { href: "#features", label: "features" },
  { href: "#commands", label: "commands" },
];

export default function Nav() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const ids = ["home", "features", "commands"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="topnav" aria-label="Sections">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={active === link.label ? "is-active" : undefined}
          aria-current={active === link.label ? "true" : undefined}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
