export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16 sm:px-10">
      <section className="grid w-full gap-10 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-table backdrop-blur sm:p-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brass-300">
            App Router Bootstrap
          </p>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Texas Hold&apos;em Equity Calculator
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-stone-300">
              Multiway equity, saved ranges, scenario history, and a clean
              launch pad for the monolithic MVP.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-stone-300">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              Next.js App Router
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              Tailwind CSS
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              Vitest + Playwright
            </span>
          </div>
        </div>
        <aside className="rounded-[1.5rem] border border-brass-400/25 bg-felt-900/80 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brass-300">
            MVP Focus
          </p>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-300">
            <li>Build and review multiway scenarios.</li>
            <li>Save reusable preflop ranges with room for future CRUD.</li>
            <li>Track project-based hand history and share read-only results.</li>
          </ul>
        </aside>
      </section>
    </main>
  );
}
