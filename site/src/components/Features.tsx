import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarDays,
  Flame,
  GitCompare,
  Rocket,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { PosterArt } from "@/components/PosterArt";
import FeatureCard from "@/components/FeatureCard";
import FeatureNav from "@/components/FeatureNav";
import ChopstickCursor from "@/components/ChopstickCursor";
import { features } from "@/lib/features";

const icons: Record<string, LucideIcon> = {
  pings: Zap,
  stats: BarChart3,
  streak: Flame,
  leaderboards: Trophy,
  compare: GitCompare,
  topday: CalendarDays,
  modes: Building2,
  setup: Rocket,
};

export function Features() {
  return (
    <main id="main" className="page">
      <section className="page-hero">
        <div className="poster__bg" aria-hidden="true" />
        <div className="poster__ui">
          <div className="poster__stage" data-poster-scene>
            <PosterArt variant="features" />
          </div>
          <div className="page-hero__cta page-hero__cta--right">
            <p className="page-hero__eyebrow">On the menu</p>
            <h1 className="page-hero__title page-hero__title--sm">
              Poke a ball to see <em>what it does.</em>
            </h1>
          </div>
        </div>
        <FeatureNav />
        <FeatureCard />
        <ChopstickCursor />
      </section>

      <section className="feature-grid-section" aria-labelledby="feature-grid-title">
        <div className="section-inner">
          <h2 id="feature-grid-title" className="section-title">Everything Takoyaki serves</h2>
          <ul className="feature-grid">
            {features.map((feature) => {
              const Icon = icons[feature.id] ?? Zap;
              return (
                <li className="feature-tile" key={feature.id}>
                  <span className="feature-tile__icon" aria-hidden="true">
                    <Icon size={22} strokeWidth={2.4} />
                  </span>
                  <h3>{feature.title}</h3>
                  <p>{feature.blurb}</p>
                  {feature.command ? <code>{feature.command}</code> : null}
                </li>
              );
            })}
          </ul>
          <Link className="invite-button section-cta" href="/commands">
            See the commands <ArrowRight size={16} strokeWidth={2.5} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
