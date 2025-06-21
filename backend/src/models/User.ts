// User model
import { User as PrismaUser, PrismaClient } from "@prisma/client";

// implements PrismaUser????? how do I make this work?
export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public name?: string,
    public firstName?: string,
    public lastName?: string,
    public academicYear?: number,
    public school?: string,
    public credits: number = 20,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  canAfford(cost: number): boolean {
    return this.credits >= cost;
  }

  deductCredits(amount: number): void {
    if (!this.canAfford(amount)) {
      throw new Error("Insufficient credits");
    }
    this.credits -= amount;
    this.updatedAt = new Date();
  }

  addCredits(amount: number): void {
    this.credits += amount;
    this.updatedAt = new Date();
  }
}
