import {NextRequest, NextResponse} from "next/server";
import {withAuth, withProjectAccess} from "@/middleware/auth";
import {IssueService} from "@/services/issue.service";
import {ProjectService} from "@/services/project.service";

export async function GET(req: NextRequest) {
    return withAuth(req, async (req, session) => {
        try {
            const url = new URL(req.url);
            const projectId = url.searchParams.get("projectId");

            let issues;

            if (projectId) {
                // Get issues for a specific project
                const project = await ProjectService.getProjectById(projectId, session.user.email);

                if (!project) {
                    return NextResponse.json({
                        success: false,
                        message: "Project not found or access denied"
                    }, {status: 404});
                }

                issues = project.issues;
            } else {
                // Get all issues the user has access to
                issues = await IssueService.getIssuesByUser(session.user.email);
            }

            return NextResponse.json({
                success: true,
                data: issues,
                message: "Issues fetched successfully"
            }, {status: 200});
        } catch (error) {
            console.error("Error fetching issues:", error);
            return NextResponse.json({
                success: false,
                message: "An error occurred while fetching issues"
            }, {status: 500});
        }
    });
}

export async function POST(req: NextRequest) {
    return withAuth(req, async (req, session) => {
        try {
            const {title, description, projectId, labelIds = []} = await req.json();

            if (!title || typeof title !== "string" || title.trim() === "") {
                return NextResponse.json({
                    success: false,
                    message: "Issue title is required"
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
                    // Create the issue using the service
                    const issue = await IssueService.createIssue({
                        title,
                        description,
                        projectId,
                        authorId: user.id,
                        labelIds: labelIds.length > 0 ? labelIds : undefined
                    });

                    return NextResponse.json({
                        success: true,
                        data: issue,
                        message: "Issue created successfully"
                    }, {status: 201});
                } catch (error) {
                    console.error("Error creating issue:", error);
                    return NextResponse.json({
                        success: false,
                        message: "An error occurred while creating the issue"
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
