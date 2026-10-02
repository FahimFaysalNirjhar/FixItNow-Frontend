import Link from "next/link";
import {
  ArrowRight,
  Droplets,
  Hammer,
  Paintbrush,
  Snowflake,
  Sparkles,
  Tags,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountUp } from "./CountUp";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { getTechnicians } from "../_actions/getTechnicians";
import { getServices } from "../_actions/getServices";
import { getCategories } from "../_actions/getCategories";
import { ServiceCard } from "../services/_components/service-card";
import { TechnicianCard } from "../technicians/_components/technician-card";

const containerClass = "mx-auto max-w-7xl px-4 sm:px-6";

// Picks an icon from the category name, with a wrench as the fallback
const ICONS: [RegExp, LucideIcon][] = [
  [/electr|wiring|light/i, Zap],
  [/plumb|water|pipe|leak/i, Droplets],
  [/clean/i, Sparkles],
  [/paint/i, Paintbrush],
  [/\b(ac|air|hvac)\b|cool|refriger/i, Snowflake],
  [/carpent|wood|furnit/i, Hammer],
];

const iconFor = (name: string): LucideIcon =>
  ICONS.find(([pattern]) => pattern.test(name))?.[1] ?? Wrench;

export async function StatsSection() {
  const [technicians, services, categories] = await Promise.all([
    getTechnicians({ sort: "rating" }),
    getServices({}),
    getCategories(),
  ]);

  const stats = [
    {
      label: "Technicians",
      value: technicians.success ? technicians.meta.total : 0,
      icon: Users,
    },
    {
      label: "Services listed",
      value: services.success ? services.meta.total : 0,
      icon: Wrench,
    },
    { label: "Categories", value: categories.length, icon: Tags },
  ];

  if (stats.every((stat) => stat.value === 0)) return null;

  return (
    <section
      aria-label="Platform statistics"
      className="relative z-10 -mt-12 px-4 sm:px-6"
    >
      <Reveal>
        <div className="mx-auto grid max-w-3xl grid-cols-3 divide-x divide-[#c9a45c]/25 rounded-2xl border border-[#c9a45c]/30 bg-white p-5 shadow-xl shadow-[#2c4a6e]/10 sm:p-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 px-2 text-center"
            >
              <stat.icon className="size-5 text-[#b8892f]" aria-hidden />
              <p className="font-serif text-2xl font-semibold text-[#2c4a6e] sm:text-4xl">
                <CountUp value={stat.value} />
              </p>
              <p className="text-xs text-slate-500 sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export async function CategoriesSection() {
  const categories = await getCategories();
  if (categories.length === 0) return null;

  return (
    <section
      aria-labelledby="categories-title"
      className="bg-[#faf6ee]/60 py-16 sm:py-24"
    >
      <div className={containerClass}>
        <Reveal>
          <SectionHeading
            id="categories-title"
            eyebrow="What do you need?"
            title="Browse by category"
            description="Whatever needs fixing, there is a professional for it."
          />
        </Reveal>

        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.slice(0, 8).map((category, index) => {
            const Icon = iconFor(category.name);

            return (
              <li key={category.id}>
                <Reveal delay={Math.min(index, 7) * 0.05} className="h-full">
                  <Link
                    href={`/services?categoryId=${category.id}`}
                    className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-[#c9a45c]/30 bg-white p-6 text-center transition hover:-translate-y-1 hover:border-[#b8892f] hover:shadow-lg"
                  >
                    <span className="flex size-14 items-center justify-center rounded-full border border-[#c9a45c]/50 bg-[#faf6ee] text-[#b8892f] transition group-hover:border-[#2c4a6e] group-hover:bg-[#2c4a6e] group-hover:text-white">
                      <Icon className="size-6" aria-hidden />
                    </span>
                    <span className="font-serif text-base font-semibold text-[#2c4a6e]">
                      {category.name}
                    </span>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export async function FeaturedServices() {
  const result = await getServices({});
  if (!result.success || result.data.length === 0) return null;

  const services = result.data.slice(0, 3);

  return (
    <section aria-labelledby="services-title" className="py-16 sm:py-24">
      <div className={containerClass}>
        <Reveal>
          <SectionHeading
            id="services-title"
            eyebrow="Fresh on FixItNow"
            title="Popular services"
            description="Clear prices, trusted technicians, ready to book."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.id} delay={index * 0.1} className="h-full">
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex justify-center">
          <Button
            asChild
            variant="outline"
            className="gap-2 rounded-full border-[#c9a45c] px-6 text-[#2c4a6e] hover:bg-[#c9a45c]/15 hover:text-[#2c4a6e]"
          >
            <Link href="/services">
              View all services
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

export async function FeaturedTechnicians() {
  const result = await getTechnicians({ sort: "rating" });
  if (!result.success || result.data.length === 0) return null;

  const technicians = result.data.slice(0, 3);

  return (
    <section
      aria-labelledby="technicians-title"
      className="bg-[#faf6ee]/60 py-16 sm:py-24"
    >
      <div className={containerClass}>
        <Reveal>
          <SectionHeading
            id="technicians-title"
            eyebrow="Meet the pros"
            title="Top-rated technicians"
            description="Skilled professionals, ready when you are."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {technicians.map((technician, index) => (
            <Reveal key={technician.id} delay={index * 0.1} className="h-full">
              <TechnicianCard technician={technician} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex justify-center">
          <Button
            asChild
            variant="outline"
            className="gap-2 rounded-full border-[#c9a45c] px-6 text-[#2c4a6e] hover:bg-[#c9a45c]/15 hover:text-[#2c4a6e]"
          >
            <Link href="/technicians">
              View all technicians
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
