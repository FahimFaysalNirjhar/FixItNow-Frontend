import { Suspense } from "react";
import type { Metadata } from "next";
import { getCategories } from "./_actions/getCategories";
import { Hero } from "./_components/Hero";
import {
  CategoriesSection,
  FeaturedServices,
  FeaturedTechnicians,
  StatsSection,
} from "./_components/DataSections";
import {
  Faq,
  HowItWorks,
  TechnicianCta,
  WhyChoose,
} from "./_components/StaticSections";

export const metadata: Metadata = {
  title: "FixItNow | Expert fixes, right at your door",
  description:
    "Find trusted technicians, pick a time that suits you and pay securely online. Repairs and home services, booked in minutes.",
};

export default function HomePage() {
  // Started here but not awaited, so the hero renders instantly and the
  // popular-category chips fill in when the data arrives
  const popular = getCategories().then((categories) => categories.slice(0, 4));

  return (
    <>
      <Hero popular={popular} />

      <Suspense fallback={<div className="h-24" aria-hidden />}>
        <StatsSection />
      </Suspense>

      <Suspense fallback={<div className="h-72" aria-hidden />}>
        <CategoriesSection />
      </Suspense>

      <HowItWorks />

      <Suspense fallback={<div className="h-96" aria-hidden />}>
        <FeaturedServices />
      </Suspense>

      <Suspense fallback={<div className="h-96" aria-hidden />}>
        <FeaturedTechnicians />
      </Suspense>

      <WhyChoose />
      <TechnicianCta />
      <Faq />
    </>
  );
}
