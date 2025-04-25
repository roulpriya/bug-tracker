import { prisma } from "@/lib/prisma";
import type { Project } from "@/types";

export class ProjectService {
  /**
   * Get all projects a user has access to
   */
  static async getProjectsByUser(email: string) {
    if (!email) {
      throw new Error("Email is required");
    }

    return prisma.project.findMany({
      where: {
        organization: {
          users: {
            some: {
              email,
            },
          },
        },
      },
      include: {
        organization: true,
        issues: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  /**
   * Get a specific project by ID if accessible to the user
   */
  static async getProjectById(id: string, email: string) {
    if (!id || !email) {
      throw new Error("Project ID and email are required");
    }

    return prisma.project.findFirst({
      where: {
        id,
        organization: {
          users: {
            some: {
              email,
            },
          },
        },
      },
      include: {
        organization: true,
        issues: true,
      },
    });
  }

  /**
   * Create a new project
   */
  static async createProject(data: {
    name: string;
    description?: string;
    organizationId: string;
  }) {
    if (!data.name || !data.organizationId) {
      throw new Error("Project name and organization ID are required");
    }

    return prisma.project.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim(),
        organization: {
          connect: { id: data.organizationId },
        },
      },
      include: {
        organization: true,
      },
    });
  }

  /**
   * Update an existing project
   */
  static async updateProject(
    id: string,
    data: {
      name?: string;
      description?: string;
    }
  ) {
    if (!id) {
      throw new Error("Project ID is required");
    }

    return prisma.project.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.description !== undefined && { 
          description: data.description?.trim() || null 
        }),
      },
      include: {
        organization: true,
      },
    });
  }

  /**
   * Delete a project
   */
  static async deleteProject(id: string) {
    if (!id) {
      throw new Error("Project ID is required");
    }

    return prisma.project.delete({
      where: { id },
    });
  }
}