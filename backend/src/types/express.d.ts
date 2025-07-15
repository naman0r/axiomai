import { User } from "@clerk/clerk-sdk-node";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
