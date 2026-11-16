import { useSwarmSection } from "@/swarm/provider";

export function SectionHeading({
  idPrefix,
  label,
  title,
  description,
}: {
  idPrefix: string;
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p
        data-sw="text"
        data-sw-id={`${idPrefix}-label`}
        className="font-mono text-[11px] uppercase tracking-[0.25em]"
        style={{ color: "var(--accent-olive)" }}
      >
        {label}
      </p>
      <h2
        data-sw="text"
        data-sw-id={`${idPrefix}-title`}
        className="mt-3 section-display text-foreground"
      >
        {title}
      </h2>
      {description ? (
        <p
          data-sw="text"
          data-sw-id={`${idPrefix}-desc`}
          className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base"
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
