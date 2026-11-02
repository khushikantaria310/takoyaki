import Image from "next/image";
import { discordInviteUrl } from "@/lib/site-config";

const repo = "https://github.com/logizel/takoyaki";

export function Footer() {
  return (
    <footer className="site-footer">
      <span className="footer-watermark" data-footer-mark aria-hidden="true">たこやき</span>
      <div className="footer-octopus" aria-hidden="true">
        <Image
          src="/footer-octopus.png"
          alt=""
          width={980}
          height={420}
          sizes="(max-width: 720px) 80vw, 720px"
        />
      </div>
      <div className="footer-tentacles" aria-hidden="true">
        <svg viewBox="0 0 1600 120" preserveAspectRatio="none">
          {/* Tentacle paths crawling left to right */}
          <path className="footer-tentacle footer-tentacle--1"
            d="M 100,100 Q 200,80 300,95 Q 400,110 500,90 Q 600,70 700,85 Q 800,100 900,85 Q 1000,70 1100,90 Q 1200,110 1300,95 Q 1400,80 1500,100" />
          <path className="footer-tentacle footer-tentacle--2"
            d="M 80,110 Q 180,90 280,105 Q 380,120 480,100 Q 580,80 680,95 Q 780,110 880,95 Q 980,80 1080,100 Q 1180,120 1280,105 Q 1380,90 1480,110" />
          <path className="footer-tentacle footer-tentacle--3"
            d="M 120,95 Q 220,75 320,90 Q 420,105 520,85 Q 620,65 720,80 Q 820,95 920,80 Q 1020,65 1120,85 Q 1220,105 1320,90 Q 1420,75 1520,95" />
          <path className="footer-tentacle footer-tentacle--4"
            d="M 60,105 Q 160,85 260,100 Q 360,115 460,95 Q 560,75 660,90 Q 760,105 860,90 Q 960,75 1060,95 Q 1160,115 1260,100 Q 1360,85 1460,105" />
          <path className="footer-tentacle footer-tentacle--5"
            d="M 140,100 Q 240,80 340,95 Q 440,110 540,90 Q 640,70 740,85 Q 840,100 940,85 Q 1040,70 1140,90 Q 1240,110 1340,95 Q 1440,80 1540,100" />
          <path className="footer-tentacle footer-tentacle--6"
            d="M 40,115 Q 140,95 240,110 Q 340,125 440,105 Q 540,85 640,100 Q 740,115 840,100 Q 940,85 1040,105 Q 1140,125 1240,110 Q 1340,95 1440,115" />
        </svg>
      </div>
      <div className="footer-inner">
        <h2 className="footer-headline">never miss a commit again</h2>
        <p className="footer-sub">pings, stats &amp; leaderboards — right in your Discord</p>

        <div className="footer-cta">
          <a className="footer-button" href={discordInviteUrl} target="_blank" rel="noreferrer">
            Add Takoyaki to your server
          </a>
          <span className="footer-status">
            <span className="footer-dot" aria-hidden="true" /> bot online
          </span>
        </div>

        <div className="footer-rule" />

        <div className="footer-columns">
          <div className="footer-col">
            <h3>Product</h3>
            <a className="footer-link footer-link--accent" href="#home">Home</a>
            <a className="footer-link" href="#features">Features</a>
            <a className="footer-link" href="#commands">Commands</a>
          </div>
          <div className="footer-col">
            <h3>Open source</h3>
            <a className="footer-link" href={repo} target="_blank" rel="noreferrer">GitHub repo</a>
            <a className="footer-link" href={repo} target="_blank" rel="noreferrer">Star the repo</a>
          </div>
          <div className="footer-col">
            <h3>Connect</h3>
            <a className="footer-link" href={repo} target="_blank" rel="noreferrer">GitHub</a>
            <a className="footer-link" href={discordInviteUrl} target="_blank" rel="noreferrer">Add to Discord</a>
          </div>
        </div>

        <div className="footer-rule" />

        <div className="footer-bottom">
          <span className="footer-brand">
            <span className="footer-mark" aria-hidden="true">たこやき</span> takoyaki
          </span>
          <span className="footer-status">
            <span className="footer-dot" aria-hidden="true" /> bot online
          </span>
          <span className="footer-meta">pings in real time</span>
          <span className="footer-meta">© 2026</span>
          <span className="footer-meta">made with love, hot off the grill</span>
        </div>
      </div>
    </footer>
  );
}
