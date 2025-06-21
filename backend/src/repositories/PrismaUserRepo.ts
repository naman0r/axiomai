import { PrismaClient } from "@prisma/client";
import { User } from "../models/User";
import { IUserRepo } from "./interfaces/IUserRepo";

/**
 * This is a class which acts as a repository for all users in the database, compatible with Prisma.
 */
export class PrismaUserRepo implements IUserRepo {
  constructor(private prisma: PrismaClient) {}

  /**
   * Finds a user by id, returs null if not found.
   * @param id the ID of the user.
   */
  async findById(id: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({ where: { id } });
    return userData ? this.mapToUser(userData) : null;
  }

  /**
   *
   * @param email Finds user by email.
   */
  async findByEmail(email: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({ where: { email } });
    return userData ? this.mapToUser(userData) : null;
  }
  async create(user: User): Promise<User> {
    const userData = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        academicYear: user.academicYear,
        school: user.school,
        credits: user.credits,
      },
    });
    return this.mapToUser(userData);
  }

  async update(user: User): Promise<User> {
    const userData = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        academicYear: user.academicYear,
        school: user.school,
        credits: user.credits,
        updatedAt: user.updatedAt,
      },
    });
    return this.mapToUser(userData);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async upsert(user: User): Promise<User> {
    const userData = await this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        academicYear: user.academicYear,
        school: user.school,
        credits: user.credits,
        updatedAt: user.updatedAt,
      },
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        academicYear: user.academicYear,
        school: user.school,
        credits: user.credits,
      },
    });
    return this.mapToUser(userData);
  }

  private mapToUser(data: any): User {
    return new User(
      data.id,
      data.email,
      data.name,
      data.firstName,
      data.lastName,
      data.academicYear,
      data.school,
      data.credits,
      data.createdAt,
      data.updatedAt
    );
  }
}
