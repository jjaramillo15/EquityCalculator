import Link from "next/link";

type ProjectListProps = {
  projects: Array<{
    id: string;
    name: string;
    updatedLabel: string;
  }>;
};

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <ul className="space-y-3">
      {projects.map((project) => (
        <li key={project.id}>
          <Link
            href={`/projects/${project.id}`}
            className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4 transition hover:border-brass-300/40 hover:bg-white/10"
          >
            <div>
              <div className="text-lg font-semibold text-white">
                {project.name}
              </div>
              <div className="mt-1 text-sm text-stone-400">
                {project.updatedLabel}
              </div>
            </div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-brass-300">
              Open
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
