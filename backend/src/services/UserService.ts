import { User } from "../models/User";
import { IUserRepo } from "../repositories/interfaces/IUserRepo";

class UserService {
  constructor(private userRepo: IUserRepo) {}

  async deductCreditsForAI(userId: string, cost: number): Promise<User> {
    const user: User | null = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.deductCredits(cost);
    return await this.userRepo.update(user);
  }
}
