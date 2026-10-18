import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { discordInviteUrl } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <Link className="brand" href="/" aria-label="Takoyaki home">
            <span className="brand__seal" aria-hidden="true">焼</span>
            <span className="brand__wordmark">Takoyaki<span>!</span></span>
          </Link>
          <p className="footer-note">
            GitHub activity, hot off the grill and into your Discord server.
          </p>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <Link href="/">Home</Link>
          <Link href="/features">Features</Link>
          <Link href="/commands">Commands</Link>
          <a href={discordInviteUrl} target="_blank" rel="noreferrer">
            Add to Discord <ArrowUpRight size={13} strokeWidth={2.5} aria-hidden="true" />
          </a>
        </nav>
      </div>
      <div className="footer-bottom">Takoyaki · GitHub → Discord · たこ焼き</div>
    </footer>
  );
}
