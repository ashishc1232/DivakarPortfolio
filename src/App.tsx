import { SiteProvider } from "@/swarm/provider";
import { SwarmControls } from "@/swarm/Controls";
import { EnquiryProvider } from "@/lib/enquiry";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Cinema } from "@/components/sections/Cinema";
import { Services } from "@/components/sections/Services";
import { Skills } from "@/components/sections/Skills";
import { BeforeAfterSection } from "@/components/sections/BeforeAfterSection";
import { CreativeProcess } from "@/components/sections/CreativeProcess";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export function App() {
  return (
    <SiteProvider>
      <EnquiryProvider>
        <Navbar />
        <main>
          <Hero />
          <Cinema />
          <Services />
          <Skills />
          <BeforeAfterSection />
          <CreativeProcess />
          <Testimonials />
          <Pricing />
          <Faq />
          <About />
          <Contact />
        </main>
        <Footer />
        <SwarmControls />
      </EnquiryProvider>
    </SiteProvider>
  );
}
