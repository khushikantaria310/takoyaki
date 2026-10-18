import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Features } from "@/components/Features";
import { Commands } from "@/components/Commands";
import { Footer } from "@/components/Footer";
import BonitoCursor from "@/components/BonitoCursor";

export default function Page() {
  return (
    <main id="main">
      <BonitoCursor />
      <Hero />
      <About />
      <Features />
      <Commands />
      <Footer />
    </main>
  );
}
