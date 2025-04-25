import { prisma } from "@/lib/prisma";
import type { Label } from "@/types";

export class LabelService {
  /**
   * Get all labels for a project
   */
  static async getLabelsByProject(projectId: string) {
    if (!projectId) {
      throw new Error("Project ID is required");
    }

    return prisma.label.findMany({
      where: { projectId },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Check if a user has access to a project
   */
  static async hasProjectAccess(projectId: string, email: string) {
    if (!projectId || !email) {
      throw new Error("Project ID and email are required");
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        organization: {
          users: {
            some: {
              email,
            },
          },
        },
      },
    });

    return !!project;
  }

  /**
   * Create a new label
   */
  static async createLabel(data: {
    name: string;
    color: string;
    projectId: string;
  }) {
    if (!data.name || !data.projectId) {
      throw new Error("Label name and project ID are required");
    }

    return prisma.label.create({
      data: {
        name: data.name.trim(),
        color: data.color || "#CCCCCC",
        project: {
          connect: { id: data.projectId },
        },
      },
    });
  }

  /**
   * Update an existing label
   */
  static async updateLabel(
    id: string,
    data: {
      name?: string;
      color?: string;
    }
  ) {
    if (!id) {
      throw new Error("Label ID is required");
    }

    return prisma.label.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.color && { color: data.color }),
      },
    });
  }

  /**
   * Delete a label
   */
  static async deleteLabel(id: string) {
    if (!id) {
      throw new Error("Label ID is required");
    }

    return prisma.label.delete({
      where: { id },
    });
  }
}