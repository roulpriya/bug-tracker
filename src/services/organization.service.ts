import { prisma } from "@/lib/prisma";
import type { Organization } from "@/types";

export class OrganizationService {
  /**
   * Get all organizations a user belongs to
   */
  static async getOrganizationsByUser(email: string) {
    if (!email) {
      throw new Error("Email is required");
    }

    // Get the user first
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organizations: {
          include: {
            projects: true
          }
        }
      }
    });

    if (!user) {
      return [];
    }

    // Return organizations directly
    return user.organizations;
  }

  /**
   * Get a specific organization by ID if accessible to the user
   */
  static async getOrganizationById(id: string, email: string) {
    if (!id || !email) {
      throw new Error("Organization ID and email are required");
    }

    // Get the user first
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    // Fetch the organization if user has access to it
    const organization = await prisma.organization.findFirst({
      where: {
        id,
        users: {
          some: {
            id: user.id
          }
        }
      },
      include: {
        projects: true
      }
    });

    return organization;
  }

  /**
   * Create a new organization
   */
  static async createOrganization(name: string, userId: string) {
    if (!name || !userId) {
      throw new Error("Organization name and user ID are required");
    }

    // Create the organization and connect the user as an OWNER
    return prisma.organization.create({
      data: {
        name: name.trim(),
        users: {
          connect: { id: userId }
        }
      },
      include: {
        projects: true
      }
    });
  }

  /**
   * Update an existing organization
   */
  static async updateOrganization(
    id: string, 
    data: { name: string }
  ) {
    if (!id || !data.name) {
      throw new Error("Organization ID and name are required");
    }

    return prisma.organization.update({
      where: { id },
      data: {
        name: data.name.trim(),
      },
    });
  }

  /**
   * Add a user to an organization
   */
  static async addUserToOrganization(organizationId: string, userId: string) {
    if (!organizationId || !userId) {
      throw new Error("Organization ID and user ID are required");
    }

    // Check if user is already in organization
    const organization = await prisma.organization.findFirst({
      where: {
        id: organizationId,
        users: {
          some: {
            id: userId
          }
        }
      }
    });

    if (organization) {
      // User already in organization
      return organization;
    }

    // Add user to organization
    return prisma.organization.update({
      where: { id: organizationId },
      data: {
        users: {
          connect: { id: userId }
        }
      }
    });
  }

  /**
   * Remove a user from an organization
   */
  static async removeUserFromOrganization(organizationId: string, userId: string) {
    if (!organizationId || !userId) {
      throw new Error("Organization ID and user ID are required");
    }

    return prisma.organization.update({
      where: { id: organizationId },
      data: {
        users: {
          disconnect: { id: userId }
        }
      }
    });
  }
}