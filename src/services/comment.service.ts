import { prisma } from "@/lib/prisma";
import type { Comment } from "@/types";

export class CommentService {
  /**
   * Get all comments for an issue
   */
  static async getCommentsByIssue(issueId: string) {
    if (!issueId) {
      throw new Error("Issue ID is required");
    }

    return prisma.comment.findMany({
      where: { issueId },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  /**
   * Create a new comment
   */
  static async createComment(data: {
    content: string;
    issueId: string;
    authorId: string;
  }) {
    if (!data.content || !data.issueId || !data.authorId) {
      throw new Error("Comment content, issue ID, and author ID are required");
    }

    return prisma.comment.create({
      data: {
        content: data.content.trim(),
        issue: {
          connect: { id: data.issueId },
        },
        author: {
          connect: { id: data.authorId },
        },
      },
      include: {
        author: true,
      },
    });
  }

  /**
   * Update an existing comment
   */
  static async updateComment(
    id: string,
    data: {
      content: string;
    }
  ) {
    if (!id || !data.content) {
      throw new Error("Comment ID and content are required");
    }

    return prisma.comment.update({
      where: { id },
      data: {
        content: data.content.trim(),
      },
      include: {
        author: true,
      },
    });
  }

  /**
   * Delete a comment
   */
  static async deleteComment(id: string) {
    if (!id) {
      throw new Error("Comment ID is required");
    }

    return prisma.comment.delete({
      where: { id },
    });
  }

  /**
   * Check if a user is the author of a comment
   */
  static async isCommentAuthor(commentId: string, userId: string) {
    if (!commentId || !userId) {
      throw new Error("Comment ID and user ID are required");
    }

    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        authorId: userId,
      },
    });

    return !!comment;
  }
}