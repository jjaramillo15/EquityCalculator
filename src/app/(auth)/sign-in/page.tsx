import { signIn } from "@/auth";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function getRedirectTarget() {
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");

  if (origin) {
    return new URL("/projects", origin).toString();
  }

  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  if (!host) {
    return "/projects";
  }

  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.includes("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");

  return `${protocol}://${host}/projects`;
}

async function authenticate(formData: FormData) {
  "use server";

  const email = formData.get("email");

  if (typeof email !== "string" || !email.trim()) {
    redirect("/sign-in");
  }

  await signIn("credentials", {
    email: email.trim().toLowerCase(),
    redirectTo: await getRedirectTarget(),
  });
}

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
        <form action={authenticate} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-stone-400">
              Email
            </span>
            <input
              required
              type="email"
              name="email"
              placeholder="hero@example.com"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-brass-300"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full border border-brass-400/40 bg-brass-400/10 px-4 py-3 text-sm font-semibold text-brass-100 transition hover:bg-brass-400/20"
          >
            Sign in with email
          </button>
        </form>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-stone-200">
          <Link
            href="/"
            className="rounded-full border border-white/15 px-4 py-2 transition hover:border-brass-300 hover:text-brass-200"
          >
            Back home
          </Link>
        </div>
      </section>
    </main>
  );
}
