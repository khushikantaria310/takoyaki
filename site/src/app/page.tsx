import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Features } from "@/components/Features";
import { Commands } from "@/components/Commands";
import { Footer } from "@/components/Footer";
import WorldMount from "@/components/WorldMount";

export default function Page() {
  return (
    <>
      <WorldMount />
      <main id="main">
        <Hero />
        <About />
        <Features />
        <Commands />
        <Footer />
      </main>
    </>
  );
}
