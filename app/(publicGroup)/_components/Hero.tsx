"use client";

import { Suspense, use, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  Loader2,
  Search,
  ShieldCheck,
  Star,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Popular = { id: string; name: string };

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const headline: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const word: Variants = {
  hidden: { y: "110%", opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: EASE } },
};

const LINE_ONE = ["Expert", "fixes,"];
const LINE_TWO = ["right", "at", "your", "door."];

function Words({ words, className }: { words: string[]; className?: string }) {
  return (
    <span className={cn("block", className)}>
      {words.map((text, index) => (
        <span
          key={index}
          className="inline-block overflow-hidden py-1 align-bottom"
        >
          <motion.span variants={word} className="inline-block">
            {text}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function PopularChips({ popular }: { popular: Promise<Popular[]> }) {
  const items = use(popular);
  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-serif text-sm text-slate-500">Popular:</span>
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/services?categoryId=${item.id}`}
          className="rounded-full border border-[#c9a45c]/50 bg-white/80 px-3 py-1 font-serif text-xs text-[#2c4a6e] transition-colors hover:border-[#b8892f] hover:bg-[#c9a45c]/15"
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}

function HeroSearch() {
  const router = useRouter();
  const [term, setTerm] = useState("");
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const clean = term.trim();

    startTransition(() =>
      router.push(
        clean
          ? `/services?searchTerm=${encodeURIComponent(clean)}`
          : "/services",
      ),
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex items-center gap-2 rounded-full border border-[#c9a45c]/50 bg-white p-1.5 shadow-lg shadow-[#2c4a6e]/10 focus-within:border-[#b8892f] focus-within:ring-4 focus-within:ring-[#b8892f]/15"
    >
      <Search className="ml-3 size-5 shrink-0 text-[#b8892f]" aria-hidden />
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="What needs fixing? e.g. AC repair"
        aria-label="Search services"
        className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-[#2c4a6e] outline-none placeholder:text-slate-400 sm:text-base"
      />
      <Button
        type="submit"
        disabled={pending}
        className="h-11 rounded-full bg-[#2c4a6e] px-6 text-white hover:bg-[#2c4a6e]/90"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          "Search"
        )}
      </Button>
    </form>
  );
}

function FloatCard({
  className,
  delay = 0,
  duration = 6,
  reduce,
  children,
}: {
  className?: string;
  delay?: number;
  duration?: number;
  reduce: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className={cn(
        "absolute w-60 rounded-2xl border border-[#c9a45c]/40 bg-white/95 p-4 shadow-xl shadow-[#2c4a6e]/10 backdrop-blur",
        className,
      )}
      initial={reduce ? false : { opacity: 0, scale: 0.85 }}
      animate={reduce ? undefined : { opacity: 1, scale: 1, y: [0, -12, 0] }}
      transition={{
        opacity: { duration: 0.6, delay: 0.6 + delay },
        scale: { duration: 0.6, delay: 0.6 + delay, ease: EASE },
        y: { duration, delay, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      {children}
    </motion.div>
  );
}

export function Hero({ popular }: { popular: Promise<Popular[]> }) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden bg-linear-to-b from-[#faf6ee] via-white to-white"
    >
      {/* Background: dotted grid and drifting glows */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(rgba(201,164,92,0.35) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <motion.div
        aria-hidden
        className="absolute -left-24 -top-24 -z-10 size-96 rounded-full bg-[#c9a45c]/25 blur-3xl"
        animate={reduce ? undefined : { x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -right-24 top-1/3 -z-10 size-96 rounded-full bg-[#2c4a6e]/10 blur-3xl"
        animate={reduce ? undefined : { x: [0, -40, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-24 pt-14 sm:px-6 lg:grid-cols-2 lg:pb-32 lg:pt-24">
        {/* Copy */}
        <motion.div
          variants={container}
          initial={reduce ? "show" : "hidden"}
          animate="show"
          style={reduce ? undefined : { y: textY }}
          className="space-y-7"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-[#c9a45c]/50 bg-white/80 px-4 py-1.5 font-serif text-xs font-semibold uppercase tracking-wider text-[#b8892f]"
          >
            <BadgeCheck className="size-4" aria-hidden />
            Trusted home services
          </motion.span>

          <motion.h1
            variants={headline}
            aria-label="Expert fixes, right at your door."
            className="font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-[#2c4a6e] sm:text-6xl lg:text-7xl"
          >
            <span aria-hidden>
              <Words words={LINE_ONE} />
              <Words words={LINE_TWO} className="italic text-[#b8892f]" />
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-xl font-serif text-lg italic text-slate-600"
          >
            Find a trusted technician, pick a time that suits you and pay
            securely online. Repairs and home services, booked in minutes.
          </motion.p>

          <motion.div variants={fadeUp} className="max-w-xl space-y-4">
            <HeroSearch />
            <Suspense fallback={<div className="h-8" />}>
              <PopularChips popular={popular} />
            </Suspense>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 gap-2 rounded-full bg-[#2c4a6e] px-7 text-white hover:bg-[#2c4a6e]/90"
            >
              <Link href="/services">
                Browse services
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-[#c9a45c] bg-white/70 px-7 text-[#2c4a6e] hover:bg-[#c9a45c]/15 hover:text-[#2c4a6e]"
            >
              <Link href="/register">Become a technician</Link>
            </Button>
          </motion.div>

          <motion.ul
            variants={fadeUp}
            className="flex flex-wrap gap-x-6 gap-y-2 font-serif text-sm text-slate-600"
          >
            {["Clear pricing", "Secure payments", "Real reviews"].map(
              (text) => (
                <li key={text} className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-[#b8892f]/15 text-[#b8892f]">
                    <Check className="size-3" aria-hidden />
                  </span>
                  {text}
                </li>
              ),
            )}
          </motion.ul>
        </motion.div>

        {/* Visual */}
        <motion.div
          aria-hidden
          style={reduce ? undefined : { y: visualY }}
          className="relative mx-auto hidden aspect-square w-full max-w-lg lg:block"
        >
          <div className="absolute inset-4 rounded-full border border-[#c9a45c]/40 bg-linear-to-br from-white via-[#faf6ee] to-[#c9a45c]/25" />

          <motion.div
            className="absolute inset-12 rounded-full border-2 border-dashed border-[#c9a45c]/50"
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
          />

          {/* Center emblem, same look as the logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="relative flex size-44 items-center justify-center rounded-full border border-[#c9a45c]/60 bg-white shadow-2xl shadow-[#b8892f]/25"
              animate={reduce ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <Wrench className="size-16 text-[#2c4a6e]" strokeWidth={1.5} />
              <span className="absolute bottom-7 right-9 size-4 rounded-full bg-[#b8892f]" />
            </motion.div>
          </div>

          <FloatCard reduce={reduce} className="left-0 top-4" duration={6}>
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#faf6ee] text-[#b8892f]">
                <CalendarCheck className="size-5" />
              </span>
              <div>
                <p className="font-serif text-sm font-semibold text-[#2c4a6e]">
                  Booking accepted
                </p>
                <p className="text-xs text-slate-500">Tomorrow, 10:00 AM</p>
              </div>
            </div>
          </FloatCard>

          <FloatCard
            reduce={reduce}
            className="right-0 top-1/3"
            delay={1.2}
            duration={7}
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <ShieldCheck className="size-5" />
              </span>
              <div>
                <p className="font-serif text-sm font-semibold text-[#2c4a6e]">
                  Secure payment
                </p>
                <p className="text-xs text-slate-500">Pay safely online</p>
              </div>
            </div>
          </FloatCard>

          <FloatCard
            reduce={reduce}
            className="bottom-6 left-6"
            delay={0.6}
            duration={8}
          >
            <div className="space-y-1.5">
              <div className="flex gap-0.5 text-[#b8892f]">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className="size-4 fill-current" />
                ))}
              </div>
              <p className="font-serif text-sm font-semibold text-[#2c4a6e]">
                Rated by real customers
              </p>
            </div>
          </FloatCard>
        </motion.div>
      </div>
    </section>
  );
}
