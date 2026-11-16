import { useSwarmSection } from "@/swarm/provider";
import { whatsapp } from "@/data/content";
import { Instagram } from "lucide-react";
import { INSTAGRAM_URL, NAV_LINKS } from "@/data/content";
import { cn } from "@/lib/utils";

export function Navbar() {
  const ref = useSwarmSection<HTMLElement>("navigation");
  return (
    <header ref={ref} className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto grid h-16 w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:flex sm:justify-between sm:px-6"
      >
        <a
          href="#home"
          data-sw="text"
          data-sw-id="nav-brand"
          className="font-display text-lg font-bold tracking-tight text-foreground"
        >
          DIVAKAR<span style={{ color: "var(--accent-olive)" }}>.</span>
        </a>
        <div className="hidden items-center gap-5 lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-sw="text"
              data-sw-id={`nav-${l.label}`}
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a
            href={whatsapp()} target="_blank" rel="noreferrer"
            data-sw="rect"
            data-sw-id="nav-cta"
            className="hidden rounded-full px-4 py-2 text-[13px] font-medium text-primary-foreground shadow-sm transition-transform hover:scale-[1.03] sm:inline-flex"
            style={{ background: "var(--accent-olive)", color: "#10130d" }}
          >
            Let's Work Together
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
          >
            <Instagram className="h-4 w-4" />
          </a>
          {/* Mobile menu: anchor list */}
          <details className="relative lg:hidden">
            <summary
              aria-label="Open menu"
              className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-border text-foreground"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </summary>
            <div className="absolute right-0 top-11 w-44 rounded-xl border border-border bg-popover p-2 shadow-xl">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className={cn("block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent")}
                >
                  {l.label}
                </a>
              ))}
              <a
                href={whatsapp()} target="_blank" rel="noreferrer"
                className="mt-1 block rounded-lg px-3 py-2 text-sm font-medium"
                style={{ color: "var(--accent-olive)" }}
              >
                Let's Work Together
              </a>
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}
