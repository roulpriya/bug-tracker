import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {prisma} from "@/lib/prisma";
import {getServerSession} from "next-auth";
import Link from "next/link";
import {redirect} from "next/navigation";

type Params = Promise<{ id: string }>

export default async function ProjectPage(props: { params: Params }) {
    const params = await props.params;
    const id = params.id;

    const session = await getServerSession();

    if (!session?.user?.email) {
        redirect("/");
    }

    const project = await prisma.project.findFirst({
        where: {
            id: id,
            organization: {
                users: {
                    some: {
                        email: session.user.email,
                    },
                },
            },
        },
        include: {
            issues: true,
            organization: true,
        },
    });

    if (!project) {
        redirect("/dashboard");
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Link href={`/dashboard/organizations/${project.organizationId}`} className="hover:underline">
                        {project.organization.name}
                    </Link>
                    <span className="mx-2">/</span>
                    <span>{project.name}</span>
                </div>

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">{project.name}</h1>
                        <p className="text-sm text-gray-600">
                            {project.description || "No description"}
                        </p>
                    </div>
                    <Link href={`/dashboard/projects/${id}/issues/new`}>
                        <Button>Report Issue</Button>
                    </Link>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Issues</h2>

                {project.issues.length === 0 ? (
                    <Card className="p-6">
                        <p className="text-center text-gray-500">
                            No issues reported yet.
                        </p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {project.issues.map((issue) => (
                            <Link
                                href={`/dashboard/issues/${issue.id}`}
                                key={issue.id}
                            >
                                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${
                            issue.status === 'open' ? 'bg-red-500' :
                                issue.status === 'in-progress' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}/>
                                                <h3 className="font-medium">{issue.title}</h3>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {issue.description?.substring(0, 100) || "No description"}
                                                {(issue.description?.length ?? 0) > 100 ? "..." : ""}
                                            </p>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(issue.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
