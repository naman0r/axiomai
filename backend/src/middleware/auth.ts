import { Request, Response, NextFunction } from "express";
import { createClerkClient } from "@clerk/clerk-sdk-node";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        firstName?: string;
        lastName?: string;
      };
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const payload = await clerkClient.verifyToken(token);

    // Add user info to request
    req.user = {
      id: payload.sub,
      email: payload.email as string,
      firstName: payload.first_name as string,
      lastName: payload.last_name as string,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Optional auth - doesn't fail if no token
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (token) {
      const payload = await clerkClient.verifyToken(token);

      req.user = {
        id: payload.sub,
        email: payload.email as string,
        firstName: payload.first_name as string,
        lastName: payload.last_name as string,
      };
    }

    next();
  } catch (error) {
    // Continue without user if token is invalid
    console.warn("Optional auth failed:", error);
    next();
  }
};
