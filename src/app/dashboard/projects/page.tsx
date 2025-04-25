import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProjectsPage() {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    redirect("/");
  }
  
  const projects = await prisma.project.findMany({
    where: {
      organization: {
        users: {
          some: {
            email: session.user.email,
          },
        },
      },
    },
    include: {
      organization: true,
      issues: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Projects</h1>
      
      {projects.length === 0 ? (
        <Card className="p-6">
          <p className="text-center text-gray-500">
            No projects found. Create a project in one of your organizations.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {projects.map((project: {
            id: string;
            name: string;
            description: string | null;
            organization: {
              name: string;
            };
            issues: any[];
          }) => (
            <Link
              href={`/dashboard/projects/${project.id}`}
              key={project.id}
            >
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-semibold">{project.name}</h2>
                      <span className="text-sm text-gray-500">
                        ({project.organization.name})
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {project.description || "No description"}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0 text-sm">
                    <span className="bg-gray-100 text-gray-800 rounded-full px-2 py-1">
                      {project.issues.length} issue{project.issues.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}