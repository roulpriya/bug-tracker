import {NextRequest, NextResponse} from "next/server";
import {withAuth} from "@/middleware/auth";
import {CommentService} from "@/services/comment.service";
import {IssueService} from "@/services/issue.service";
import {UserService} from "@/services/user.service";

export async function GET(req: NextRequest) {
    return withAuth(req, async (req, session) => {
        try {
            const url = new URL(req.url);
            const issueId = url.searchParams.get("issueId");

            if (!issueId) {
                return NextResponse.json({
                    success: false,
                    message: "Issue ID is required"
                }, {status: 400});
            }

            // Check if the user has access to the issue
            const issue = await IssueService.getIssueById(issueId, session.user.email);

            if (!issue) {
                return NextResponse.json({
                    success: false,
                    message: "Issue not found or access denied"
                }, {status: 404});
            }

            // Get comments for the issue
            const comments = await CommentService.getCommentsByIssue(issueId);

            return NextResponse.json({
                success: true,
                data: comments,
                message: "Comments fetched successfully"
            }, {status: 200});
        } catch (error) {
            console.error("Error fetching comments:", error);
            return NextResponse.json({
                success: false,
                message: "An error occurred while fetching comments"
            }, {status: 500});
        }
    });
}

export async function POST(req: NextRequest) {
    return withAuth(req, async (req, session) => {
        try {
            const {content, issueId} = await req.json();

            if (!content || typeof content !== "string" || content.trim() === "") {
                return NextResponse.json({
                    success: false,
                    message: "Comment content is required"
                }, {status: 400});
            }

            if (!issueId || typeof issueId !== "string") {
                return NextResponse.json({
                    success: false,
                    message: "Valid issue ID is required"
                }, {status: 400});
            }

            if (content.length > 5000) {
                return NextResponse.json({
                    success: false,
                    message: "Comment content exceeds maximum length"
                }, {status: 400});
            }

            // Get the user
            const user = await UserService.getUserByEmail(session.user.email);

            if (!user) {
                return NextResponse.json({
                    success: false,
                    message: "User not found"
                }, {status: 404});
            }

            // Check if the user has access to the issue
            const issue = await IssueService.getIssueById(issueId, session.user.email);

            if (!issue) {
                return NextResponse.json({
                    success: false,
                    message: "Issue not found or access denied"
                }, {status: 404});
            }

            // Create the comment
            const comment = await CommentService.createComment({
                content,
                issueId,
                authorId: user.id
            });

            return NextResponse.json({
                success: true,
                data: comment,
                message: "Comment created successfully"
            }, {status: 201});
        } catch (error) {
            console.error("Error creating comment:", error);
            return NextResponse.json({
                success: false,
                message: "An error occurred while creating the comment"
            }, {status: 500});
        }
    });
}
