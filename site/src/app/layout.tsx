import type { Metadata } from "next";
import { Archivo, Geist_Mono, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import SceneCanvasMount from "@/components/SceneCanvasMount";

const display = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-display",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const japanese = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-jp",
});

export const metadata: Metadata = {
  title: "Takoyaki — GitHub, hot off the grill",
  description: "GitHub push, pull request, issue, and repository notifications served straight to Discord.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} ${japanese.variable}`}>
      <body className="min-h-dvh">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var m=!window.matchMedia('(prefers-reduced-motion: reduce)').matches;var c=document.createElement('canvas');var g=c.getContext('webgl2')||c.getContext('webgl');if(m&&g){document.documentElement.classList.add('fx');}}catch(e){}})();",
          }}
        />
        <a className="skip-link" href="#main">Skip to the poster</a>
        <SceneCanvasMount />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
