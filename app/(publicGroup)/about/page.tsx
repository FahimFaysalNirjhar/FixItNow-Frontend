import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | FixItNow",
  description:
    "FixItNow connects people with trusted local technicians. Book a time, get the job done and pay securely online.",
};

const STEPS = [
  {
    title: "Pick a service",
    text: "Browse repairs and home services, compare technicians and choose the one that fits your job.",
  },
  {
    title: "Request a time",
    text: "Send a booking request with your preferred time and a short note about the problem.",
  },
  {
    title: "Pay once it's approved",
    text: "When the technician accepts, you pay securely online. You are never charged before they confirm.",
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 md:py-24">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Fixing things shouldn&apos;t be the hard part
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          FixItNow helps you find a trusted technician, agree on a time and pay
          online, all in one place. No endless phone calls, no guessing who is
          turning up.
        </p>
      </header>

      <section className="mt-20 grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
        <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
        <ol className="space-y-8">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-5">
              <span
                aria-hidden
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="font-medium">{step.title}</h3>
                <p className="mt-1 leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-20 grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
        <h2 className="text-2xl font-semibold tracking-tight">
          What we stand for
        </h2>
        <dl className="space-y-6">
          <div>
            <dt className="font-medium">Clear expectations</dt>
            <dd className="mt-1 leading-relaxed text-muted-foreground">
              Every service shows what it covers, who does the work and what it
              costs before you book.
            </dd>
          </div>
          <div>
            <dt className="font-medium">Fair to technicians</dt>
            <dd className="mt-1 leading-relaxed text-muted-foreground">
              Technicians choose which jobs to accept and set their own
              availability, so the work fits their day.
            </dd>
          </div>
          <div>
            <dt className="font-medium">Safe payments</dt>
            <dd className="mt-1 leading-relaxed text-muted-foreground">
              Payments are handled by Stripe. We never store your card details.
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-24 flex flex-col items-start justify-between gap-6 rounded-2xl bg-muted px-6 py-10 sm:flex-row sm:items-center sm:px-10">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Ready to get something fixed?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Or are you a technician who wants to join? Get in touch.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/services"
            className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Browse services
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-10 items-center rounded-md border border-border bg-background px-5 text-sm font-medium hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Contact us
          </Link>
        </div>
      </section>
    </main>
  );
}
