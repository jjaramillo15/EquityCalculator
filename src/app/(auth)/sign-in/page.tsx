import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-24">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-table backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brass-300">
          Auth Baseline
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-white">Sign in</h1>
        <p className="mt-3 text-base leading-7 text-stone-300">
          Authentication wiring lands in this task so projects can be
          user-owned.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm text-stone-200">
          <Link
            href="/"
            className="rounded-full border border-white/15 px-4 py-2 transition hover:border-brass-300 hover:text-brass-200"
          >
            Back home
          </Link>
          <Link
            href="/projects"
            className="rounded-full border border-brass-400/40 bg-brass-400/10 px-4 py-2 transition hover:bg-brass-400/20"
          >
            Continue to projects
          </Link>
        </div>
      </section>
    </main>
  );
}
