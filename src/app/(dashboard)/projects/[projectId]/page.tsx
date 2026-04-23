import { ProjectWorkspace } from "@/components/scenario/project-workspace";
import { getCurrentUser } from "@/lib/current-user";
import { getProjectWorkspace } from "@/lib/workspace";
import { notFound, redirect } from "next/navigation";

type ProjectWorkspacePageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectWorkspacePage({
  params,
}: ProjectWorkspacePageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { projectId } = await params;
  const workspace = await getProjectWorkspace(user.id, projectId);

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
      recentScenarios={workspace.recentScenarios}
    />
  );
}
