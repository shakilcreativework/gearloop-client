import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — GearLoop",
  description:
    "Learn how GearLoop connects outdoor enthusiasts to rent and lend gear, reduce waste, and explore more.",
};

const TRUST_FEATURES = [
  {
    title: "Gear Protection",
    description:
      "Every rental on GearLoop is covered by our gear protection policy. If something breaks beyond normal wear, owners are compensated up to the gear's replacement value.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Secure Deposits",
    description:
      "A refundable security deposit is held at the time of booking. It's released automatically once the gear is returned in the same condition.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    title: "Verified Users",
    description:
      "Every GearLoop user has a verified profile with reviews and rental history. Know who you're renting from or lending to before you meet.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
];

const VALUES = [
  {
    title: "Community First",
    description:
      "GearLoop is built for real people in real neighborhoods. Every feature is designed to make local gear sharing easy, safe, and rewarding.",
  },
  {
    title: "Sustainability",
    description:
      "The average tent sits unused for 360 days a year. By connecting owners with renters, we keep gear in circulation and out of landfills.",
  },
  {
    title: "Accessibility",
    description:
      "Outdoor adventures shouldn't require a closet full of expensive equipment. GearLoop gives everyone access to the gear they need, when they need it.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            About GearLoop
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Less gear sitting idle, more adventures on the trail
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
            GearLoop is a peer-to-peer outdoor gear rental marketplace that connects
            people who have gear with adventurers who need it. We believe the best
            adventures start with the right equipment — and that shouldn&apos;t mean
            buying everything new.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
              How It Works
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Renting gear in three simple steps
            </h2>
          </div>

          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "List Your Gear",
                description:
                  "Snap a few photos, set your price, and write a quick description. Your tent, kayak, or climbing rope is now available to your community.",
              },
              {
                step: "02",
                title: "Get Booked",
                description:
                  "Adventurers in your area browse, find your gear, and reserve the dates they need. You get notified instantly when a booking comes in.",
              },
              {
                step: "03",
                title: "Get Paid",
                description:
                  "After a successful rental, your earnings are deposited directly into your account. The more you list, the more you earn.",
              },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="text-lg font-bold">{s.step}</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-secondary">
              Our Values
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              What drives us
            </h2>
          </div>

          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-border bg-card p-8"
              >
                <h3 className="mb-3 text-lg font-semibold text-foreground">
                  {v.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
              Trust &amp; Safety
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Rent with confidence
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              We built GearLoop so every transaction feels safe for both owners
              and renters. Here&apos;s how we make that happen.
            </p>
          </div>

          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {TRUST_FEATURES.map((f) => (
              <div key={f.title} className="text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  {f.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to start exploring?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Whether you have gear gathering dust or you need the perfect equipment
            for your next adventure, GearLoop has you covered.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/explore"
              className="inline-flex items-center rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Browse Gear
            </Link>
            <Link
              href="/listings/add"
              className="inline-flex items-center rounded-xl border border-border bg-card px-8 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              List Your Gear
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
