import jwt from "jsonwebtoken";
const SECRET = "taxibe_secret_key_2025";
export const verifyToken = (roles = []) => {
    return (req, res, next) => {
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
            const decoded = jwt.verify(token, SECRET);
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
        }
        catch (err) {
            return res.status(401).json({ message: "Token invalide" });
        }
    };
};
//# sourceMappingURL=authMiddleware.js.map