import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { useSwarmSection } from "@/swarm/provider";
import { SectionHeading } from "@/components/SectionHeading";

export function BeforeAfterSection() {
  const ref = useSwarmSection<HTMLElement>("before-after");
  return (
    <section
      id="before-after"
      ref={ref}
      className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6"
    >
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <SectionHeading
            idPrefix="ba"
            label="06 / GRADE & POLISH"
            title="See the Difference"
            description="From the first frame to the final finish."
          />
        </div>
        <div data-sw="rect" data-sw-id="ba-frame">
          <BeforeAfterSlider />
        </div>
      </div>
    </section>
  );
}
