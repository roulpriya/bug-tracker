import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function IssuesPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/");
  }

  const issues = await prisma.issue.findMany({
    where: {
      project: {
        organization: {
          users: {
            some: {
              email: session.user.email,
            },
          },
        },
      },
    },
    include: {
      project: {
        include: {
          organization: true,
        },
      },
      author: true,
      labels: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  const statusMap: Record<string, { label: string, color: string }> = {
    'open': { label: 'Open', color: 'bg-red-100 text-red-800' },
    'in-progress': { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
    'resolved': { label: 'Resolved', color: 'bg-green-100 text-green-800' },
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Issues</h1>

      {issues.length === 0 ? (
        <Card className="p-6">
          <p className="text-center text-gray-500">
            No issues found. Report an issue from one of your projects.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {issues.map((issue: {
            id: string;
            title: string;
            description: string | null;
            status: string;
            createdAt: Date;
            project: {
              name: string;
              organization: {
                name: string;
              }
            };
            author: {
              id: string;
              name: string | null;
              email: string | null;
              image: string | null;
            } | null;
            labels: {
              id: string;
              name: string;
              color: string;
            }[];
          }) => {
            const statusInfo = statusMap[issue.status] || { label: issue.status, color: 'bg-gray-100 text-gray-800' };

            return (
              <Link
                href={`/dashboard/issues/${issue.id}`}
                key={issue.id}
              >
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-block w-2 h-2 rounded-full ${
                          issue.status === 'open' ? 'bg-red-500' : 
                          issue.status === 'in-progress' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <h2 className="font-semibold">{issue.title}</h2>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {issue.description?.substring(0, 100) || "No description"}
                        {(issue.description?.length ?? 0) > 100 ? "..." : ""}
                      </p>
                      <div className="flex items-center mt-1 mb-1">
                        <span className="text-xs text-gray-500 mr-1">By:</span>
                        <div className="flex items-center">
                          {issue.author?.image && (
                            <div className="h-4 w-4 rounded-full mr-1 overflow-hidden">
                              <img 
                                src={issue.author.image} 
                                alt={issue.author.name || 'User'} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <span className="text-xs font-medium">
                            {issue.author?.name || issue.author?.email || 'Unknown'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-1">
                        {issue.labels.map((label) => (
                          <span 
                            key={label.id}
                            className="px-2 py-0.5 text-xs rounded-full"
                            style={{ 
                              backgroundColor: `${label.color}25`, // 25% opacity
                              color: label.color,
                              border: `1px solid ${label.color}`
                            }}
                          >
                            {label.name}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        {issue.project.organization.name} / {issue.project.name}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0 flex flex-col md:items-end">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color} mb-1`}>
                        {statusInfo.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
