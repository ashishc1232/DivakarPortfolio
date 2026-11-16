import { describe, expect, it } from "vitest";
import { whatsapp, INSTAGRAM_URL, PRICING_PLANS, VIDEOS } from "@/data/content";

/**
 * Content accuracy — values come from the owner's supplied spec and must not
 * drift. Videos are the four real "Couple of Things" edits; pricing is marked
 * for owner confirmation before publish and must match the spec exactly.
 */

const VERIFIED_VIDEOS = [
  {
    id: "02n29Gee0Vg",
    titleIncludes: "Asha Bhosle",
    channel: "Couple of Things — Amrita Rao I RJ Anmol",
  },
  {
    id: "sdfCVR2TOL0",
    titleIncludes: "Jaya Kishori",
    channel: "Couple of Things — Amrita Rao I RJ Anmol",
  },
  {
    id: "ajg9jIP5WQ4",
    titleIncludes: "BK Sister Shivani",
    channel: "Couple of Things — Amrita Rao I RJ Anmol",
  },
  {
    id: "LmHGppaHk2I",
    titleIncludes: "Kiku Sharda",
    channel: "Couple of Things — Amrita Rao I RJ Anmol",
  },
] as const;

const SHARED_PLAN_FEATURES = [
  "Personalized video branding",
  "Pause or cancel anytime",
  "24/7 Chat support",
  "Dedicated social media manager",
  "Unlimited revisions",
];

describe("video data accuracy", () => {
  it("contains exactly the four verified Couple of Things videos", () => {
    expect(VIDEOS.map((v) => v.id)).toEqual(VERIFIED_VIDEOS.map((v) => v.id));
    for (const expected of VERIFIED_VIDEOS) {
      const video = VIDEOS.find((v) => v.id === expected.id);
      expect(video, `missing verified video ${expected.id}`).toBeDefined();
      expect(video?.title).toContain(expected.titleIncludes);
      expect(video?.channel).toBe(expected.channel);
    }
  });
});

describe("pricing accuracy (owner must confirm before publish)", () => {
  it("Personal plan is $10/mo with 20 short videos", () => {
    const plan = PRICING_PLANS.find((p) => p.id === "personal");
    expect(plan?.price).toBe(10);
    expect(plan?.period).toBe("/ month");
    expect(plan?.features[0]).toBe("20 Short videos");
  });

  it("Professional plan is $100/mo with 15 shorts + 10 animation edits", () => {
    const plan = PRICING_PLANS.find((p) => p.id === "professional");
    expect(plan?.price).toBe(100);
    expect(plan?.features[0]).toBe("15 Short videos + 10 animation edits");
  });

  it("Business plan is $300/mo with the complete organic growth package", () => {
    const plan = PRICING_PLANS.find((p) => p.id === "business");
    expect(plan?.price).toBe(300);
    expect(plan?.features[0]).toBe("Complete organic growth package");
  });

  it("all plans share the spec features and include no invented discounts", () => {
    expect(PRICING_PLANS).toHaveLength(3);
    for (const plan of PRICING_PLANS) {
      for (const feature of SHARED_PLAN_FEATURES) {
        expect(plan.features).toContain(feature);
      }
      const text = plan.features.join(" ").toLowerCase();
      expect(text).not.toContain("%");
      expect(text).not.toContain("off");
      expect(text).not.toContain("discount");
    }
  });
});

describe("contact channel accuracy", () => {
  it("routes enquiries to the studio WhatsApp number", () => {
    expect(new URL(whatsapp()).pathname).toBe("/919136228403");
    expect(new URL(whatsapp("Edit & grade")).searchParams.get("text")).toBe("Edit & grade");
    expect(INSTAGRAM_URL).toBe("https://www.instagram.com/divakar3676/");
  });
});
