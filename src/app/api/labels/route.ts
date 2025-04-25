import {NextRequest, NextResponse} from "next/server";
import {withAuth, withProjectAccess} from "@/middleware/auth";
import {LabelService} from "@/services/label.service";

export async function GET(req: NextRequest) {
    return withAuth(req, async (req, session) => {
        try {
            const url = new URL(req.url);
            const projectId = url.searchParams.get("projectId");

            if (!projectId) {
                return NextResponse.json({
                    success: false,
                    message: "Project ID is required"
                }, {status: 400});
            }

            // Check if user has access to the project
            const hasAccess = await LabelService.hasProjectAccess(projectId, session.user.email);

            if (!hasAccess) {
                return NextResponse.json({
                    success: false,
                    message: "Project not found or access denied"
                }, {status: 404});
            }

            // Get labels for the project using the service
            const labels = await LabelService.getLabelsByProject(projectId);

            return NextResponse.json({
                success: true,
                data: labels,
                message: "Labels fetched successfully"
            }, {status: 200});
        } catch (error) {
            console.error("Error fetching labels:", error);
            return NextResponse.json({
                success: false,
                message: "An error occurred while fetching labels"
            }, {status: 500});
        }
    });
}

export async function POST(req: NextRequest) {
    return withAuth(req, async (req, session) => {
        try {
            const {name, color, projectId} = await req.json();

            if (!name || typeof name !== "string" || name.trim() === "") {
                return NextResponse.json({
                    success: false,
                    message: "Label name is required"
                }, {status: 400});
            }

            if (!projectId) {
                return NextResponse.json({
                    success: false,
                    message: "Project ID is required"
                }, {status: 400});
            }

            // We'll pass the projectId to withProjectAccess to verify the user has access to it
            return withProjectAccess(req, projectId, async (req, user) => {
                try {
                    // Create the label using the service
                    const label = await LabelService.createLabel({
                        name,
                        color: color || "#CCCCCC",
                        projectId
                    });

                    return NextResponse.json({
                        success: true,
                        data: label,
                        message: "Label created successfully"
                    }, {status: 201});
                } catch (error) {
                    console.error("Error creating label:", error);
                    return NextResponse.json({
                        success: false,
                        message: "An error occurred while creating the label"
                    }, {status: 500});
                }
            });
        } catch (error) {
            console.error("Error processing request:", error);
            return NextResponse.json({
                success: false,
                message: "An error occurred while processing the request"
            }, {status: 500});
        }
    });
}
