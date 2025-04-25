import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {prisma} from "@/lib/prisma";
import {getServerSession} from "next-auth";
import Link from "next/link";
import {redirect} from "next/navigation";

type Params = Promise<{ id: string }>

export default async function IssuePage(props: { params: Params }) {
    const params = await props.params;
    const id = params.id
    // Use params directly in async calls instead of assigning to variable
    const session = await getServerSession();
    if (!session?.user?.email) {
        redirect("/");
    }

    const issue = await prisma.issue.findFirst({
        where: {
            id: id,
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
    });

    if (!issue) {
        redirect("/dashboard");
    }

    const statusMap: Record<string, { label: string, color: string }> = {
        'open': {label: 'Open', color: 'bg-red-100 text-red-800'},
        'in-progress': {label: 'In Progress', color: 'bg-yellow-100 text-yellow-800'},
        'resolved': {label: 'Resolved', color: 'bg-green-100 text-green-800'},
    };

    const statusInfo = statusMap[issue.status] || {label: issue.status, color: 'bg-gray-100 text-gray-800'};

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Link href={`/dashboard/organizations/${issue.project.organizationId}`} className="hover:underline">
                        {issue.project.organization.name}
                    </Link>
                    <span className="mx-2">/</span>
                    <Link href={`/dashboard/projects/${issue.projectId}`} className="hover:underline">
                        {issue.project.name}
                    </Link>
                    <span className="mx-2">/</span>
                    <span>Issue #{issue.id.substring(0, 8)}</span>
                </div>
            </div>

            <Card className="mb-6 overflow-hidden">
                <div className="border-b p-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold">{issue.title}</h1>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                    </span>
                </div>

                <div className="p-6">
                    <div className="flex items-center mb-4">
                        {issue.author?.image && (
                            <div className="h-8 w-8 rounded-full mr-2 overflow-hidden">
                                <img
                                    src={issue.author.image}
                                    alt={issue.author.name || 'User'}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}
                        <div>
                            <div
                                className="font-medium">{issue.author?.name || issue.author?.email || 'Unknown user'}</div>
                            <div className="text-xs text-gray-500">
                                Created on {new Date(issue.createdAt).toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {issue.labels && issue.labels.length > 0 && (
                        <div className="mb-4">
                            <div className="text-sm font-medium mb-1">Labels:</div>
                            <div className="flex flex-wrap gap-1">
                                {issue.labels.map((label: any) => (
                                    <span
                                        key={label.id}
                                        className="px-2 py-0.5 text-sm rounded-full"
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
                        </div>
                    )}

                    {issue.description ? (
                        <div className="prose max-w-none border-t pt-4">
                            <p>{issue.description}</p>
                        </div>
                    ) : (
                        <p className="text-gray-500 italic border-t pt-4">No description provided</p>
                    )}
                </div>

                <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500">
                    {issue.createdAt.toString() !== issue.updatedAt.toString() && (
                        <span>Updated on {new Date(issue.updatedAt).toLocaleString()}</span>
                    )}
                </div>
            </Card>

            <div className="flex justify-end space-x-2">
                <Button variant="outline" asChild>
                    <Link href={`/dashboard/projects/${issue.projectId}`}>
                        Back to Project
                    </Link>
                </Button>
            </div>
        </div>
    );
}
