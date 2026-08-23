const testimonials = [
  {
    quote:
      "RoleFit told me exactly which role to target and what to study. I stopped applying randomly and focused on ML Engineer roles.",
    name: "Priya K.",
    role: "ML Engineer intern",
    score: "87% role fit",
  },
  {
    quote:
      "The project-specific interview questions were the best part. I finally knew what they'd ask about my capstone.",
    name: "Rahul M.",
    role: "Data Science graduate",
    score: "82% role fit",
  },
  {
    quote:
      "Skill gap analysis made my prep plan obvious. Docker and SQL were my weak spots — I fixed them in two weeks.",
    name: "Ananya S.",
    role: "Software Engineer",
    score: "79% role fit",
  },
];

export function Testimonials() {
  return (
    <section className="border-t bg-secondary/30 py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-primary">Trusted by students &amp; early-career builders</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Real outcomes, not generic advice
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 border-t pt-4">
                <p className="font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
                <p className="mt-1 text-xs font-medium text-primary">{t.score}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
