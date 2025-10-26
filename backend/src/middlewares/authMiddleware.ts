import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET = "taxibe_secret_key_2025";

interface CustomRequest extends Request {
  user?: {
    uid: string;
    role: string;
  };
}

export const verifyToken = (roles: string[] = []) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token manquant" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token invalide" });
    }

    try {
      // Maintenant token est forcément une string
      const decoded = jwt.verify(token, SECRET) as JwtPayload;

      if (!decoded || typeof decoded === "string") {
        return res.status(401).json({ message: "Token invalide" });
      }

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Accès refusé" });
      }

      req.user = {
        uid: decoded.uid,
        role: decoded.role,
      };

      next();
    } catch (err: unknown) {
      return res.status(401).json({ message: "Token invalide" });
    }
  };
};
