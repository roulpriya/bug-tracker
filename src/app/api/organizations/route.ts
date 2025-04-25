import {NextRequest, NextResponse} from "next/server";
import {withAuth} from "@/middleware/auth";
import {OrganizationService} from "@/services/organization.service";
import {UserService} from "@/services/user.service";

export async function GET(req: NextRequest) {
    return withAuth(req, async (req, session) => {
        try {
            const organizations = await OrganizationService.getOrganizationsByUser(session.user.email);

            return NextResponse.json({
                success: true,
                data: organizations,
                message: "Organizations fetched successfully"
            }, {status: 200});
        } catch (error) {
            console.error("Error fetching organizations:", error);
            return NextResponse.json({
                success: false,
                message: "An error occurred while fetching organizations"
            }, {status: 500});
        }
    });
}

export async function POST(req: NextRequest) {
    return withAuth(req, async (req, session) => {
        try {
            const {name} = await req.json();

            if (!name || typeof name !== "string" || name.trim() === "") {
                return NextResponse.json({
                    success: false,
                    message: "Organization name is required"
                }, {status: 400});
            }

            // Get current user
            const user = await UserService.getUserByEmail(session.user.email);

            if (!user) {
                return NextResponse.json({
                    success: false,
                    message: "User not found"
                }, {status: 404});
            }

            // Create the organization using the service
            const organization = await OrganizationService.createOrganization(name, user.id);

            return NextResponse.json({
                success: true,
                data: organization,
                message: "Organization created successfully"
            }, {status: 201});
        } catch (error) {
            console.error("Error creating organization:", error);
            return NextResponse.json({
                success: false,
                message: "An error occurred while creating the organization"
            }, {status: 500});
        }
    });
}
