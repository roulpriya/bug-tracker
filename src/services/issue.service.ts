import { prisma } from "@/lib/prisma";
import type { Issue, Label } from "@/types";

export class IssueService {
  /**
   * Get all issues accessible to a user by email
   */
  static async getIssuesByUser(email: string) {
    if (!email) {
      throw new Error("Email is required");
    }

    return prisma.issue.findMany({
      where: {
        project: {
          organization: {
            users: { 
              some: { 
                email 
              } 
            },
          },
        },
      },
      include: {
        project: { 
          include: { 
            organization: true 
          } 
        },
        author: true,
        labels: true,
      },
      orderBy: { 
        updatedAt: 'desc' 
      },
    });
  }

  /**
   * Get a specific issue by ID if accessible to the user
   */
  static async getIssueById(id: string, email: string) {
    if (!id || !email) {
      throw new Error("Issue ID and email are required");
    }
    
    return prisma.issue.findFirst({
      where: {
        id,
        project: {
          organization: {
            users: { 
              some: { 
                email 
              } 
            },
          },
        },
      },
      include: {
        project: { 
          include: { 
            organization: true 
          } 
        },
        author: true,
        labels: true,
      },
    });
  }

  /**
   * Create a new issue
   */
  static async createIssue(data: {
    title: string;
    description?: string;
    projectId: string;
    authorId: string;
    labelIds?: string[];
  }) {
    if (!data.title || !data.projectId || !data.authorId) {
      throw new Error("Title, project ID, and author ID are required");
    }

    return prisma.issue.create({
      data: {
        title: data.title.trim(),
        description: data.description?.trim(),
        status: "open",
        project: { 
          connect: { 
            id: data.projectId 
          } 
        },
        author: { 
          connect: { 
            id: data.authorId 
          } 
        },
        ...(data.labelIds && data.labelIds.length > 0
          ? { 
              labels: { 
                connect: data.labelIds.map(id => ({ id })) 
              } 
            }
          : {}),
      },
      include: {
        labels: true,
        author: true,
        project: true,
      },
    });
  }

  /**
   * Update an existing issue
   */
  static async updateIssue(
    id: string,
    data: {
      title?: string;
      description?: string;
      status?: 'open' | 'in-progress' | 'resolved';
      labelIds?: string[];
    }
  ) {
    if (!id) {
      throw new Error("Issue ID is required");
    }

    // First get the current issue to handle labels correctly
    const currentIssue = await prisma.issue.findUnique({
      where: { id },
      include: { labels: true },
    });

    if (!currentIssue) {
      throw new Error("Issue not found");
    }

    // Update the issue
    return prisma.issue.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title.trim() }),
        ...(data.description !== undefined && { 
          description: data.description?.trim() || null 
        }),
        ...(data.status && { status: data.status }),
        ...(data.labelIds && { 
          labels: {
            // Disconnect all existing labels first
            disconnect: currentIssue.labels.map(label => ({ id: label.id })),
            // Then connect the new labels
            connect: data.labelIds.map(id => ({ id })),
          } 
        }),
      },
      include: {
        labels: true,
        author: true,
        project: true,
      },
    });
  }

  /**
   * Delete an issue
   */
  static async deleteIssue(id: string) {
    if (!id) {
      throw new Error("Issue ID is required");
    }

    return prisma.issue.delete({
      where: { id },
    });
  }
}