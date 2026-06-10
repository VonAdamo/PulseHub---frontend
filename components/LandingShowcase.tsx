type TechCard = {
  name: string;
  label: string;
  quote: string;
  accent: string;
};

const TECH_CARDS: TechCard[] = [
  {
    name: "Next.js",
    label: "App Router",
    quote: "Render the front end with a structure that stays close to the backend contract.",
    accent: "cyber-accent-cyan",
  },
  {
    name: "TypeScript",
    label: "Typed contracts",
    quote: "Keep API payloads explicit so backend responses do not surprise the UI.",
    accent: "cyber-accent-violet",
  },
  {
    name: "Tailwind CSS",
    label: "Utility-first UI",
    quote: "Keep the surface light while the backend and auth rules stay readable.",
    accent: "cyber-accent-green",
  },
  {
    name: "BFF",
    label: "Backend entry point",
    quote: "Route every request through one backend layer instead of touching services directly.",
    accent: "cyber-accent-amber",
  },
  {
    name: "Spring Boot",
    label: "Backend framework",
    quote: "Power the BFF and keep the backend flow consistent and easy to reason about.",
    accent: "cyber-accent-rose",
  },
  {
    name: "Docker",
    label: "Container runtime",
    quote: "Package the backend services so local development matches the deployment shape.",
    accent: "cyber-accent-magenta",
  },
  {
    name: "RabbitMQ",
    label: "Async messaging",
    quote: "Handle background work and bot-style message flow without blocking the UI.",
    accent: "cyber-accent-cyan",
  },
  {
    name: "CORS",
    label: "Local dev",
    quote: "Allow the browser to reach the backend during local development without hacks.",
    accent: "cyber-accent-lime",
  },
] as const;

export function LandingShowcase() {
  return (
    <section className="cyber-shell cyber-grid space-y-4 overflow-hidden p-5">
      <div className="max-w-2xl space-y-2">
        <p className="cyber-kicker">PulseHub stack</p>
        <h2 className="cyber-heading text-3xl font-semibold tracking-tight text-[color:var(--foreground)] md:text-4xl">
          Built around the BFF, Spring Boot, Docker, and RabbitMQ.
        </h2>
        <p className="cyber-copy max-w-3xl">
          The app stays thin on purpose: Next.js for the UI, TypeScript for the contract, Tailwind for structure, and
          a backend stack built on Spring Boot, Docker, RabbitMQ, and a BFF that owns auth, messages, tokens, and error
          handling.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {TECH_CARDS.map((card) => (
          <article key={card.name} className={`cyber-card p-4 ${card.accent}`}>
            <p className="cyber-kicker">{card.label}</p>
            <h3 className="cyber-heading mt-2 text-xl font-semibold text-[color:var(--foreground)]">{card.name}</h3>
            <p className="cyber-copy mt-3 text-sm leading-6">{card.quote}</p>
          </article>
        ))}
      </div>

      <div className="cyber-terminal grid gap-3 p-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
        <FlowStep number="01" title="BFF" description="Requests pass through a single backend entry point." />
        <FlowArrow />
        <FlowStep number="02" title="API" description="The frontend only reads and writes through the contract." />
        <FlowArrow />
        <FlowStep number="03" title="Async" description='RabbitMQ and the bot flow can respond after "hej bot".' />
      </div>
    </section>
  );
}

function FlowStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="cyber-card p-3">
      <p className="cyber-kicker">{number}</p>
      <p className="cyber-heading mt-1 font-semibold text-[color:var(--foreground)]">{title}</p>
      <p className="cyber-copy mt-1 text-sm">{description}</p>
    </div>
  );
}

function FlowArrow() {
  return <div className="hidden h-px w-full bg-[color:rgba(0,212,255,0.35)] md:block" aria-hidden="true" />;
}
