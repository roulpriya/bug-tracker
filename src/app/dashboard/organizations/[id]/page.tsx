import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

type Params = Promise<{ id: string }>

export default async function OrganizationPage(props: { params: Params }) {
  const params = await props.params;
  const id = params.id;
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/");
  }

  // Use a constant for the ID to avoid using params.id directly
  const organizationId = params.id;

  // Import organization service
  const { OrganizationService } = await import("@/services");

  // Get the organization using the service
  const organization = await OrganizationService.getOrganizationById(
    organizationId,
    session.user.email
  );

  if (!organization) {
    redirect("/dashboard");
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{organization.name}</h1>
          <p className="text-sm text-gray-500">
            Created on {new Date(organization.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Link href={`/dashboard/organizations/${organizationId}/projects/new`}>
          <Button>Add Project</Button>
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Projects</h2>

        {organization.projects.length === 0 ? (
          <Card className="p-6">
            <p className="text-center text-gray-500">
              No projects yet. Create your first project to get started!
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organization.projects.map((project) => (
              <Link
                href={`/dashboard/projects/${project.id}`}
                key={project.id}
              >
                <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                  <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {project.description || "No description"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Created on {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
