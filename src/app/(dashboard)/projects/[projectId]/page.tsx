import { ProjectWorkspace } from "@/components/scenario/project-workspace";
import { getDemoProjectWorkspace } from "@/lib/workspace";
import { notFound } from "next/navigation";

type ProjectWorkspacePageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectWorkspacePage({
  params,
}: ProjectWorkspacePageProps) {
  const { projectId } = await params;
  const workspace = await getDemoProjectWorkspace(projectId);

  if (!workspace) {
    notFound();
  }

  return (
    <ProjectWorkspace
      projectId={workspace.project.id}
      projectName={workspace.project.name}
      ranges={workspace.ranges}
      board={workspace.board}
      players={workspace.players}
    />
  );
}
