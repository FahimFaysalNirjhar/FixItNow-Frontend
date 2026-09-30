import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { NAV_LINKS } from "@/components/shared/navbar/nav-links";
import { CopyrightYear } from "./copyright-year";

const ACCOUNT_LINKS = [
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" },
];

// Replace with your real contact details
const CONTACT = {
  email: "support@fixitnow.com",
  phone: "+880 1700-000000",
  address: "Dhaka, Bangladesh",
};

const linkClass =
  "font-serif text-sm text-[#2c4a6e] transition-colors hover:text-[#b8892f] dark:text-slate-300 dark:hover:text-[#d4b06a]";

const headingClass =
  "font-serif text-sm font-semibold uppercase tracking-wider text-[#b8892f] dark:text-[#d4b06a]";

export function Footer() {
  return (
    <footer className="border-t border-[#c9a45c]/30 bg-[#faf6ee] dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Logo size="md" />
            <p className="max-w-xs font-serif text-sm italic text-slate-500 dark:text-slate-400">
              Book trusted technicians for repairs and home services, all in one
              place.
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer" className="space-y-4">
            <h3 className={headingClass}>Explore</h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Account */}
          <nav aria-label="Account" className="space-y-4">
            <h3 className={headingClass}>Account</h3>
            <ul className="space-y-2.5">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className={headingClass}>Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-[#b8892f] dark:text-[#d4b06a]" />
                <a href={`mailto:${CONTACT.email}`} className={linkClass}>
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-[#b8892f] dark:text-[#d4b06a]" />
                <a
                  href={`tel:${CONTACT.phone.replace(/[\s-]/g, "")}`}
                  className={linkClass}
                >
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#b8892f] dark:text-[#d4b06a]" />
                <span className="font-serif text-sm text-[#2c4a6e] dark:text-slate-300">
                  {CONTACT.address}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-[#c9a45c]/30 pt-6 text-center sm:flex-row sm:text-left">
          <p className="font-serif text-xs text-slate-500 dark:text-slate-400">
            &copy; <CopyrightYear /> FixItNow. All rights reserved.
          </p>
          <p className="font-serif text-xs italic text-slate-500 dark:text-slate-400">
            Expert fixes, right at your door.
          </p>
        </div>
      </div>
    </footer>
  );
}
