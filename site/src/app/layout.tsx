import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "たこやき · Takoyaki",
  description:
    "Takoyaki turns GitHub activity into real-time Discord pings, contribution stats, streak heatmaps, and leaderboards.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Klee+One:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var m=!window.matchMedia('(prefers-reduced-motion: reduce)').matches;var c=document.createElement('canvas');var g=c.getContext('webgl2')||c.getContext('webgl');if(m&&g){document.documentElement.classList.add('fx');}}catch(e){}})();",
          }}
        />
        <a className="skip-link" href="#main">Skip to content</a>
        <SmoothScroll />
        <Nav />
        {children}
      </body>
    </html>
  );
}
