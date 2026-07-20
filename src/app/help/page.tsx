"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    question: "How does GearLoop work?",
    answer:
      "GearLoop is a peer-to-peer marketplace where people list their outdoor gear for rent. Renters browse available gear, book the dates they need, and meet up with the owner to pick up and return the equipment. Payments are handled securely through the platform.",
  },
  {
    question: "What happens if gear gets damaged?",
    answer:
      "Every rental on GearLoop is covered by our gear protection policy. If your gear is damaged beyond normal wear and tear during a rental, you can file a claim and receive compensation up to the gear's replacement value. Renters also have the option to purchase additional coverage at checkout.",
  },
  {
    question: "How do security deposits work?",
    answer:
      "A refundable security deposit is collected from the renter at the time of booking. The deposit is held securely by GearLoop and released back to the renter automatically within 48 hours of a confirmed return, provided the gear is in the same condition.",
  },
  {
    question: "Can I cancel a booking?",
    answer:
      "Yes. Renters can cancel a booking up to 48 hours before the scheduled pickup date for a full refund. Cancellations within 48 hours are subject to a 20% fee. Owners who need to cancel should do so as early as possible — repeated cancellations may affect your listing visibility.",
  },
  {
    question: "How do I get paid as a gear owner?",
    answer:
      "Earnings are deposited into your linked bank account within 3–5 business days after a rental is completed. GearLoop takes a small platform fee from each transaction to cover payment processing and gear protection. You can view your earnings and payout history in your dashboard.",
  },
  {
    question: "What gear can I list?",
    answer:
      "You can list any outdoor gear that is in good working condition — camping equipment, bicycles, kayaks, ski gear, climbing equipment, cameras, and more. All listings must include accurate photos and descriptions. Gear that is recalled, counterfeit, or unsafe will be removed.",
  },
  {
    question: "How are users verified?",
    answer:
      "Every GearLoop account requires email verification and a valid phone number. Users build trust through their profile, reviews, and rental history. You can see a renter's or owner's review score and past transactions before confirming a booking.",
  },
  {
    question: "Is there a fee to use GearLoop?",
    answer:
      "Signing up and listing gear is free. GearLoop charges a platform fee on each completed rental — this covers payment processing, gear protection, and customer support. There are no upfront costs or subscription fees.",
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function toggleFaq(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Please enter a valid email address";
    if (!subject.trim()) errs.subject = "Subject is required";
    if (!message.trim()) errs.message = "Message is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    // TODO: POST to a real support endpoint, e.g.:
    // await fetch("/api/support", { method: "POST", body: JSON.stringify({ name, email, subject, message }) });
    console.log("Support request submitted:", { name, email, subject, message });

    setSubmitted(true);
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setErrors({});
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            Help &amp; Support
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            How can we help?
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
            Find answers to common questions below, or reach out to our support
            team using the contact form.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-2xl font-bold text-foreground">
            Frequently asked questions
          </h2>

          <div className="flex flex-col gap-3">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-card"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold text-foreground">
                      {item.question}
                    </span>
                    <svg
                      className={`h-5 w-5 shrink-0 text-muted transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5">
                      <p className="text-sm leading-relaxed text-muted">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-2xl font-bold text-foreground">
            Contact us
          </h2>
          <p className="mb-10 text-muted">
            Can&apos;t find what you&apos;re looking for? Send us a message and
            we&apos;ll get back to you within 24 hours.
          </p>

          {submitted ? (
            <div className="rounded-2xl border border-success/30 bg-success/10 p-8 text-center">
              <h3 className="text-lg font-semibold text-foreground">
                Message sent!
              </h3>
              <p className="mt-2 text-sm text-muted">
                Thanks for reaching out. Our team will review your message and
                respond within one business day.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 rounded-xl border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
              noValidate
            >
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                      errors.name ? "border-red-500" : "border-border"
                    }`}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                      errors.email ? "border-red-500" : "border-border"
                    }`}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div className="mt-6">
                <label
                  htmlFor="subject"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                    errors.subject ? "border-red-500" : "border-border"
                  }`}
                  placeholder="How can we help?"
                />
                {errors.subject && (
                  <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
                )}
              </div>

              {/* Message */}
              <div className="mt-6">
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full resize-none rounded-xl border px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                    errors.message ? "border-red-500" : "border-border"
                  }`}
                  placeholder="Tell us more about your question or issue..."
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="mt-6 w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 sm:w-auto"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
