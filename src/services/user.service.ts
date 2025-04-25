import { prisma } from "@/lib/prisma";
import type { User } from "@/types";

export class UserService {
  /**
   * Get a user by email
   */
  static async getUserByEmail(email: string) {
    if (!email) {
      throw new Error("Email is required");
    }

    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Get a user by ID
   */
  static async getUserById(id: string) {
    if (!id) {
      throw new Error("User ID is required");
    }

    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Create or update a user (used during authentication)
   */
  static async upsertUser(data: {
    email: string;
    name?: string | null;
    image?: string | null;
  }) {
    if (!data.email) {
      throw new Error("Email is required");
    }

    return prisma.user.upsert({
      where: { email: data.email },
      update: {
        name: data.name,
        image: data.image,
      },
      create: {
        email: data.email,
        name: data.name,
        image: data.image,
      },
    });
  }

  /**
   * Update a user's profile
   */
  static async updateUser(
    id: string,
    data: {
      name?: string;
      image?: string;
    }
  ) {
    if (!id) {
      throw new Error("User ID is required");
    }

    return prisma.user.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.image && { image: data.image }),
      },
    });
  }
}