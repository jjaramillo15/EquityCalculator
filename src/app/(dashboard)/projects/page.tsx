import { auth } from "@/auth";
import { ProjectList } from "@/components/projects/project-list";
import { listDemoProjects } from "@/lib/workspace";
import { redirect } from "next/navigation";

export default async function ProjectsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const identity = session.user.name ?? session.user.email ?? "Player";
  const projects = await listDemoProjects();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-table backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brass-300">
          Protected Workspace
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-white">Projects</h1>
        <p className="mt-3 text-base leading-7 text-stone-300">
          Open a study workspace, revisit prior scenario trees, and keep a
          reusable project shelf for active reviews.
        </p>
        <p className="mt-6 text-sm text-stone-400">
          Signed in as <span className="text-stone-200">{identity}</span>.
        </p>
        <div className="mt-8">
          <ProjectList projects={projects} />
        </div>
      </section>
    </main>
  );
}
