import {
  Clapperboard,
  Film,
  ImageIcon,
  MessagesSquare,
} from "lucide-react";

export function whatsapp(message = "Hi Divakar, I'd like to discuss a video project.") {
  return "https://wa.me/919136228403?text=" + encodeURIComponent(message);
}

export const INSTAGRAM_URL = "https://www.instagram.com/divakar3676/";

export interface VideoItem {
  id: string;
  /** Real title fetched from YouTube oEmbed — not invented. */
  title: string;
  channel: string;
  label: string;
  url: string;
}

export const VIDEOS: [VideoItem, VideoItem, VideoItem, VideoItem] = [
  {
    id: "02n29Gee0Vg",
    title:
      "Asha Bhosle On Love, Music & Old Memories | Amrita Rao I RJ Anmol I COUPLE Of Things I #ashabhosle",
    channel: "Couple of Things — Amrita Rao I RJ Anmol",
    label: "Featured Edit 01",
    url: "https://youtu.be/02n29Gee0Vg",
  },
  {
    id: "sdfCVR2TOL0",
    title:
      "Jaya Kishori On Love .. I Amrita Rao I COUPLE Of Things I @JayaKishoriMotivation @Iamjayakishori",
    channel: "Couple of Things — Amrita Rao I RJ Anmol",
    label: "Featured Edit 02",
    url: "https://youtu.be/sdfCVR2TOL0",
  },
  {
    id: "ajg9jIP5WQ4",
    title:
      "Attract Love, Happiness and Heal Relationships in 2026 I BK Sister Shivani I COUPLE Of Things  #love",
    channel: "Couple of Things — Amrita Rao I RJ Anmol",
    label: "Featured Edit 03",
    url: "https://youtu.be/ajg9jIP5WQ4",
  },
  {
    id: "LmHGppaHk2I",
    title:
      "Kiku Sharda & Priyanka Love Story I Kapil Sharma Show I Bachcha Yadav I Amrita Rao I RJ Anmol I",
    channel: "Couple of Things — Amrita Rao I RJ Anmol",
    label: "Featured Edit 04",
    url: "https://youtu.be/LmHGppaHk2I",
  },
];

export function thumbUrl(id: string) {
  return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
}

export interface Service {
  icon: typeof Clapperboard;
  index: string;
  title: string;
  body: string;
}

export const SERVICES: Service[] = [
  {
    icon: Clapperboard,
    index: "01",
    title: "Short Form Video",
    body: "We turn your content into scroll-stopping videos made for Reels, Shorts and TikTok. Quick, engaging, and built to hook viewers in seconds.",
  },
  {
    icon: ImageIcon,
    index: "02",
    title: "Thumbnail Design",
    body: "Your thumbnail is the first thing viewers notice. We design eye-catching visuals that attract clicks and represent your content perfectly.",
  },
  {
    icon: Film,
    index: "03",
    title: "Long-Form Video",
    body: "From concept to final cut, we craft compelling long-form content that tells your story with clarity and impact.",
  },
  {
    icon: MessagesSquare,
    index: "04",
    title: "Consulting",
    body: "Get expert advice to shape your video ideas and content strategy. We help you create smarter, more effective content that performs.",
  },
];

export const SKILLS = [
  "Storytelling",
  "Scriptwriting",
  "Communication",
  "Time Management",
  "Problem Solving",
  "Branding",
  "Content Strategy",
  "Color Correction",
  "Transitions & Effects",
  "Graphic Design",
  "Motion Design",
  "Reel Editing",
] as const;

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discover",
    body: "Understand the brief, goals, audience and visual direction.",
  },
  {
    step: "02",
    title: "Create",
    body: "Structure the story, choose the best footage and establish pacing.",
  },
  {
    step: "03",
    title: "Refine",
    body: "Improve color, transitions, motion, sound and overall polish.",
  },
  {
    step: "04",
    title: "Deliver",
    body: "Prepare final files for the intended platforms and formats.",
  },
] as const;

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Rohan Sharma",
    role: "YouTube Creator",
    quote:
      "Working with Divakar made a noticeable difference to my videos. He didn't just edit — he improved the overall flow and storytelling.",
  },
  {
    name: "Ankit Verma",
    role: "Digital Marketer",
    quote:
      "Divakar ne hamare raw clips ko ek proper engaging video me convert kar diya. Editing clean thi aur audience retention me bhi improvement dikha.",
  },
  {
    name: "Mukesh",
    role: "Brand Manager",
    quote:
      "I've worked with a few editors before, but Divakar stands out. Simple, professional, and delivers exactly what's needed.",
  },
  {
    name: "Olivia Bennett",
    role: "Content Manager",
    quote:
      "Mujhe sabse zyada unki detailing pasand aayi. Chhoti chhoti cheezein jo hum ignore kar dete hain, Divakar unhe perfectly handle karte hain.",
  },
];

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  featured?: boolean;
  features: string[];
  cta: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "personal",
    name: "Personal",
    price: 10,
    currency: "$",
    period: "/ month",
    features: [
      "20 Short videos",
      "Personalized video branding",
      "Pause or cancel anytime",
      "24/7 Chat support",
      "Dedicated social media manager",
      "Unlimited revisions",
    ],
    cta: "Choose Personal",
  },
  {
    id: "professional",
    name: "Professional",
    price: 100,
    currency: "$",
    period: "/ month",
    featured: true,
    features: [
      "15 Short videos + 10 animation edits",
      "Personalized video branding",
      "Pause or cancel anytime",
      "24/7 Chat support",
      "Dedicated social media manager",
      "Unlimited revisions",
    ],
    cta: "Choose Professional",
  },
  {
    id: "business",
    name: "Business",
    price: 300,
    currency: "$",
    period: "/ month",
    features: [
      "Complete organic growth package",
      "Personalized video branding",
      "Pause or cancel anytime",
      "24/7 Chat support",
      "Dedicated social media manager",
      "Unlimited revisions",
    ],
    cta: "Choose Business",
  },
];

export interface Faq {
  question: string;
  answer: string;
}

export const FAQS: Faq[] = [
  {
    question: "I have a great video idea, but I'm not sure how to get started. Can you help?",
    answer:
      "Absolutely. Start with a short brief — even a rough voice note or a few reference links is enough. From there I help you shape the concept, plan the structure and decide the format that fits your audience before any editing begins.",
  },
  {
    question: "How can editing make my video more engaging?",
    answer:
      "Editing shapes pace, rhythm and emphasis. Tight cuts hold attention, music and sound design set the mood, and well-placed b-roll, text and transitions keep viewers watching instead of scrolling away.",
  },
  {
    question: "Do you offer any special effects or motion graphics?",
    answer:
      "Yes. Titles, lower-thirds, kinetic text, subtle motion graphics and transitions are all part of the toolkit. The goal is always to support the story — effects are used where they add clarity or impact, never as filler.",
  },
  {
    question: "What if I need edits for different platforms, such as YouTube vs Instagram?",
    answer:
      "Each platform has its own language. Long-form edits are structured for watch time, while Reels and Shorts are reframed and re-cut for quick hooks. I can deliver platform-specific versions from the same footage so every channel gets the right fit.",
  },
  {
    question: "How can I make my video rank higher in search results?",
    answer:
      "Ranking depends on many factors outside the edit itself — topics, titles, thumbnails, descriptions and audience behaviour. I can advise on editing choices that support discoverability, like strong hooks and clear structure, but no editor can guarantee search positions.",
  },
  {
    question: "How much creative control do I have over the editing process?",
    answer:
      "As much as you want. You can share detailed references and notes, review drafts and request revisions, or hand over the brief and let me drive the creative direction. Unlimited revisions are included in every plan.",
  },
  {
    question: "Ready to get started? How can I contact you?",
    answer:
      "The fastest way is a message on WhatsApp — share your idea, footage details and timeline, and we'll take it from there. You can also pick a plan on this page and send the enquiry straight from the contact section.",
  },
];

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Skills", href: "#skills" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
] as const;
