import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProjectsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const identity = session.user.name ?? session.user.email ?? "Player";

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-table backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brass-300">
          Protected Workspace
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-white">Projects</h1>
        <p className="mt-3 text-base leading-7 text-stone-300">
          Your hand review projects will live here.
        </p>
        <p className="mt-6 text-sm text-stone-400">
          Signed in as <span className="text-stone-200">{identity}</span>.
        </p>
      </section>
    </main>
  );
}
