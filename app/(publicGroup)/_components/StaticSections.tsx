import Link from "next/link";
import {
  CalendarCheck,
  Check,
  ChevronDown,
  Clock,
  CreditCard,
  Search,
  ShieldCheck,
  Star,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const containerClass = "mx-auto max-w-7xl px-4 sm:px-6";

const STEPS = [
  {
    icon: Search,
    title: "Find the right professional",
    text: "Browse services or technicians and filter by category, location, price and rating.",
  },
  {
    icon: CalendarCheck,
    title: "Request a time",
    text: "Choose a slot from the technician's availability and send your request.",
  },
  {
    icon: CreditCard,
    title: "Get it done, pay securely",
    text: "Once your request is accepted, pay online and let the technician get to work.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-title"
      className="scroll-mt-24 py-16 sm:py-24"
    >
      <div className={containerClass}>
        <Reveal>
          <SectionHeading
            id="how-title"
            eyebrow="Simple by design"
            title="How FixItNow works"
            description="From the first search to a finished job in three steps."
          />
        </Reveal>

        <ol className="relative mt-14 grid gap-10 md:grid-cols-3">
          <div
            aria-hidden
            className="absolute left-[16%] right-[16%] top-9 hidden border-t-2 border-dashed border-[#c9a45c]/50 md:block"
          />

          {STEPS.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={index * 0.15} className="relative text-center">
                <span className="relative mx-auto flex size-[72px] items-center justify-center rounded-full border border-[#c9a45c]/60 bg-white text-[#2c4a6e] shadow-lg shadow-[#b8892f]/15">
                  <step.icon className="size-7" aria-hidden />
                  <span className="absolute -right-1 -top-1 flex size-7 items-center justify-center rounded-full bg-[#b8892f] font-serif text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                </span>
                <h3 className="mt-5 font-serif text-xl font-semibold text-[#2c4a6e]">
                  {step.title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
                  {step.text}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const REASONS = [
  {
    icon: Star,
    title: "Real customer reviews",
    text: "Every technician profile shows ratings and reviews, so you can choose with confidence.",
  },
  {
    icon: Wallet,
    title: "Clear pricing",
    text: "See the price of a service before you book. No surprises at the door.",
  },
  {
    icon: Clock,
    title: "Your schedule",
    text: "Pick a time from the technician's published availability, not the other way around.",
  },
  {
    icon: ShieldCheck,
    title: "Secure payments",
    text: "Payments are handled securely online through Stripe once your booking is accepted.",
  },
];

export function WhyChoose() {
  return (
    <section
      aria-labelledby="why-title"
      className="bg-[#faf6ee]/60 py-16 sm:py-24"
    >
      <div className={containerClass}>
        <Reveal>
          <SectionHeading
            id="why-title"
            eyebrow="Why FixItNow"
            title="Home services you can rely on"
            description="Everything you need to book with peace of mind."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((reason, index) => (
            <Reveal key={reason.title} delay={index * 0.1} className="h-full">
              <div className="h-full rounded-2xl border border-[#c9a45c]/30 bg-white p-6 transition hover:-translate-y-1 hover:border-[#b8892f] hover:shadow-lg">
                <span className="flex size-12 items-center justify-center rounded-full border border-[#c9a45c]/50 bg-[#faf6ee] text-[#b8892f]">
                  <reason.icon className="size-6" aria-hidden />
                </span>
                <h3 className="mt-4 font-serif text-lg font-semibold text-[#2c4a6e]">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {reason.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const PERKS = [
  "Create your profile in minutes",
  "Set the hours you work",
  "Get booking requests from customers",
];

export function TechnicianCta() {
  return (
    <section className="py-16 sm:py-24">
      <div className={containerClass}>
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-3xl bg-[#2c4a6e] px-6 py-14 text-center sm:px-14 sm:py-16">
            <div
              aria-hidden
              className="absolute -right-20 -top-20 -z-10 size-72 rounded-full bg-[#c9a45c]/25 blur-3xl"
            />
            <div
              aria-hidden
              className="absolute -bottom-24 -left-16 -z-10 size-72 rounded-full bg-white/10 blur-3xl"
            />

            <p className="font-serif text-xs font-semibold uppercase tracking-[0.2em] text-[#d4b06a]">
              For technicians
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Are you a skilled technician?{" "}
              <span className="italic text-[#d4b06a]">Join FixItNow.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-serif italic text-white/75">
              List your services, set your own hours and let customers come to
              you.
            </p>

            <ul className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/85">
              {PERKS.map((perk) => (
                <li key={perk} className="flex items-center gap-2">
                  <Check className="size-4 text-[#d4b06a]" aria-hidden />
                  {perk}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-[#c9a45c] px-8 font-semibold text-[#2c4a6e] hover:bg-[#d4b06a]"
              >
                <Link href="/register">Join as a technician</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-white/40 bg-transparent px-8 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="#how-it-works">See how it works</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: "How do I book a technician?",
    a: "Find a service you like, open it and send a booking request for a time within the technician's availability. The technician then accepts or declines.",
  },
  {
    q: "When do I pay?",
    a: "Once the technician accepts your request, you can pay securely online from your bookings page.",
  },
  {
    q: "Can I cancel a booking?",
    a: "Yes, as long as the technician hasn't accepted it yet. You can cancel from the My bookings page in your dashboard.",
  },
  {
    q: "How do I become a technician?",
    a: "Register as a technician, complete your profile with your experience and rates, then add your services and the hours you are available.",
  },
];

export function Faq() {
  return (
    <section
      aria-labelledby="faq-title"
      className="bg-[#faf6ee]/60 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            id="faq-title"
            eyebrow="Good to know"
            title="Frequently asked questions"
          />
        </Reveal>

        <div className="mt-10 space-y-3">
          {FAQS.map((item, index) => (
            <Reveal key={item.q} delay={index * 0.07}>
              <details className="group rounded-xl border border-[#c9a45c]/30 bg-white open:border-[#b8892f] open:shadow-md">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-serif text-base font-semibold text-[#2c4a6e] [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown
                    className="size-5 shrink-0 text-[#b8892f] transition-transform group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
