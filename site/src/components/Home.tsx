import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PosterArt } from "@/components/PosterArt";

export function Home() {
  return (
    <main id="main" className="page">
      <section className="page-hero">
        <div className="poster__bg" aria-hidden="true" />
        <div className="poster__ui">
          <div className="poster__stage" data-poster-scene>
            <PosterArt variant="home" />
          </div>
          <div className="page-hero__cta">
            <p className="page-hero__eyebrow">大阪風 · GitHub → Discord</p>
            <h1 className="page-hero__title">
              GitHub events, hot off the <em>grill.</em>
            </h1>
            <Link className="invite-button" href="/features">
              Meet the features <ArrowRight size={16} strokeWidth={2.5} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
