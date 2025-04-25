import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {prisma} from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json(
                {message: "Unauthorized"},
                {status: 401}
            );
        }

        const {name, description, organizationId} = await req.json();

        if (!name || typeof name !== "string" || name.trim() === "") {
            return NextResponse.json(
                {message: "Project name is required"},
                {status: 400}
            );
        }

        if (!organizationId) {
            return NextResponse.json(
                {message: "Organization ID is required"},
                {status: 400}
            );
        }

        // Verify that the user has access to the organization
        const organization = await prisma.organization.findFirst({
            where: {
                id: organizationId,
                users: {
                    some: {
                        email: session.user.email,
                    },
                },
            },
        });

        if (!organization) {
            return NextResponse.json(
                {message: "Organization not found or access denied"},
                {status: 404}
            );
        }

        // Create the project
        const project = await prisma.project.create({
            data: {
                name: name.trim(),
                description: description?.trim(),
                organization: {
                    connect: {id: organizationId}
                }
            }
        });

        return NextResponse.json(project, {status: 201});
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json(
            {message: "An error occurred while creating the project"},
            {status: 500}
        );
    }
}
