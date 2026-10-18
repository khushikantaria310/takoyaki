"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { discordInviteUrl } from "@/lib/site-config";

const links = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/commands", label: "Commands" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" href="/" aria-label="Takoyaki home">
          <span className="brand__seal" aria-hidden="true">焼</span>
          <span className="brand__wordmark">Takoyaki<span>!</span></span>
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <a
          className="invite-button site-header__invite"
          href={discordInviteUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Add Takoyaki to Discord"
        >
          Add to Discord <ArrowUpRight size={15} strokeWidth={2.5} aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}
