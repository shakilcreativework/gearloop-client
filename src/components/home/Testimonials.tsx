const TESTIMONIALS = [
  {
    name: "Sarah Mitchell",
    role: "Weekend Camper",
    text: "I used to spend hundreds on gear I'd only use twice a year. GearLoop let me rent a premium tent and sleeping bag for a fraction of the cost. The whole process was seamless.",
    rating: 5,
    avatar: "SM",
  },
  {
    name: "Marcus Chen",
    role: "Gear Owner & Trail Runner",
    text: "I list my climbing gear and mountain bike on GearLoop. It pays for itself in two months, and I love knowing my gear is getting the use it deserves instead of sitting in my garage.",
    rating: 5,
    avatar: "MC",
  },
  {
    name: "Jade Rodriguez",
    role: "Adventure Photographer",
    text: "Needed a telephoto lens for a wildlife photography trip. Found one on GearLoop for $60/day instead of buying a $3,000 lens I'd use once. Incredible value.",
    rating: 5,
    avatar: "JR",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            What People Say
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by outdoor enthusiasts
          </h2>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              {/* Stars */}
              <div className="mb-4 flex gap-0.5 text-primary">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <svg
                    key={i}
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="flex-1 text-sm leading-relaxed text-muted">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {t.avatar}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
