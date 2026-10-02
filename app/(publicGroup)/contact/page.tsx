import type { Metadata } from "next";
import { ContactForm } from "../_components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | FixItNow",
  description:
    "Questions about a booking, a payment or joining as a technician? Send us a message and we'll get back to you.",
};

// Replace these placeholders with your real details
const CONTACT_DETAILS = [
  {
    label: "Email",
    value: "support@fixitnow.com",
    href: "mailto:support@fixitnow.com",
  },
  { label: "Phone", value: "+880 1700 000000", href: "tel:+8801700000000" },
  { label: "Hours", value: "Sat to Thu, 9am to 6pm" },
];

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 md:py-24">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Talk to us
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Have a question about a booking or a payment, or want to join as a
          technician? Send a message and we&apos;ll reply within one business
          day.
        </p>
      </header>

      <div className="mt-14 grid gap-14 md:grid-cols-[2fr_1fr] md:gap-16">
        <ContactForm />

        <aside>
          <h2 className="text-lg font-semibold">Other ways to reach us</h2>
          <dl className="mt-5 space-y-5">
            {CONTACT_DETAILS.map((item) => (
              <div key={item.label}>
                <dt className="text-sm text-muted-foreground">{item.label}</dt>
                <dd className="mt-0.5 font-medium">
                  {item.href ? (
                    <a
                      href={item.href}
                      className="underline-offset-4 hover:underline"
                    >
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </main>
  );
}
