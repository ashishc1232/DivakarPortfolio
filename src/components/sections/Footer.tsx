import { Instagram } from "lucide-react";
import { INSTAGRAM_URL, NAV_LINKS } from "@/data/content";
import { useSwarmSection } from "@/swarm/provider";

export function Footer() {
  const ref = useSwarmSection<HTMLElement>("footer");
  const year = new Date().getFullYear();
  return (
    <footer ref={ref} className="border-t border-white/5 bg-black/20">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p
            data-sw="text"
            data-sw-id="footer-brand"
            className="font-display text-lg font-bold tracking-tight text-foreground"
          >
            DIVAKAR / VISUAL STUDIO
          </p>
          <p data-sw="text" data-sw-id="footer-role" className="mt-2 text-sm text-muted-foreground">
            Video Editor & Visual Storyteller
          </p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            data-sw="text"
            data-sw-id="footer-ig"
            className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Instagram className="h-4 w-4" /> @divakar3676
          </a>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-2">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-sw="text"
              data-sw-id={`footer-${l.label}`}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <p
          data-sw="text"
          data-sw-id="footer-copy"
          className="self-end font-mono text-[11px] text-muted-foreground md:text-right"
        >
          © {year} Divakar Parajapati. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
