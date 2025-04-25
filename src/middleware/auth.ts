import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserService } from "@/services/user.service";
import { OrganizationService } from "@/services/organization.service";
import { ProjectService } from "@/services/project.service";

/**
 * Middleware to check if user is authenticated
 */
export async function withAuth(
  req: NextRequest,
  handler: (req: NextRequest, session: any) => Promise<NextResponse>
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { 
          success: false,
          error: "Unauthorized",
          message: "You must be logged in to access this resource",
          statusCode: 401
        },
        { status: 401 }
      );
    }
    
    return handler(req, session);
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Authentication error",
        message: "An error occurred during authentication",
        statusCode: 500
      },
      { status: 500 }
    );
  }
}

/**
 * Middleware to check if user has access to an organization
 */
export async function withOrgAccess(
  req: NextRequest, 
  orgId: string,
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Unauthorized",
          message: "You must be logged in to access this resource",
          statusCode: 401
        },
        { status: 401 }
      );
    }
    
    // Check if the user has access to the organization
    const user = await UserService.getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: "User not found",
          message: "User account not found",
          statusCode: 404
        },
        { status: 404 }
      );
    }
    
    const org = await OrganizationService.getOrganizationById(orgId, session.user.email);
    if (!org) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Forbidden",
          message: "You do not have access to this organization",
          statusCode: 403
        },
        { status: 403 }
      );
    }
    
    return handler(req, user);
  } catch (error) {
    console.error("Organization access error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Server error",
        message: "An error occurred while checking organization access",
        statusCode: 500
      },
      { status: 500 }
    );
  }
}

/**
 * Middleware to check if user has access to a project
 */
export async function withProjectAccess(
  req: NextRequest, 
  projectId: string,
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Unauthorized",
          message: "You must be logged in to access this resource",
          statusCode: 401
        },
        { status: 401 }
      );
    }
    
    // Check if the user has access to the project
    const user = await UserService.getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: "User not found",
          message: "User account not found",
          statusCode: 404
        },
        { status: 404 }
      );
    }
    
    const project = await ProjectService.getProjectById(projectId, session.user.email);
    if (!project) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Forbidden",
          message: "You do not have access to this project",
          statusCode: 403
        },
        { status: 403 }
      );
    }
    
    return handler(req, user);
  } catch (error) {
    console.error("Project access error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Server error",
        message: "An error occurred while checking project access",
        statusCode: 500
      },
      { status: 500 }
    );
  }
}