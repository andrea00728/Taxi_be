"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const express_1 = __importDefault(require("express"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
dotenv_1.default.config();
const AuthRouter = express_1.default.Router();
const SECRET = "taxibe_secret_key_2025";
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(serviceAccount),
    });
}
// Configuration Nodemailer avec SMTP Gmail
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const verifyToken = (roles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ message: "Token manquant" });
        const token = authHeader.split(" ")[1];
        if (!token)
            return res.status(401).json({ message: "Token invalide" });
        try {
            const decoded = jsonwebtoken_1.default.verify(token, SECRET);
            if (!decoded || typeof decoded === "string")
                return res.status(401).json({ message: "Token invalide" });
            if (roles.length && !roles.includes(decoded.role))
                return res.status(403).json({ message: "Accès refusé" });
            req.user = { uid: decoded.uid, role: decoded.role };
            next();
        }
        catch {
            return res.status(401).json({ message: "Token invalide" });
        }
    };
};
exports.verifyToken = verifyToken;
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentification utilisateurs
 */
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Créer un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: exemple@domaine.com
 *               password:
 *                 type: string
 *                 example: MotDePasseFort123!
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: user
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur de requête
 */
AuthRouter.post("/register", async (req, res) => {
    const { email, password, role } = req.body;
    const validRoles = ["user", "admin"];
    if (!role || !validRoles.includes(role)) {
        return res.status(400).json({ error: "Role invalide ou manquant. Doit être 'user' ou 'admin'." });
    }
    try {
        try {
            await firebase_admin_1.default.auth().getUserByEmail(email);
            return res.status(400).json({ error: "L'adresse email est déjà utilisée." });
        }
        catch (err) {
            if (err.code !== "auth/user-not-found")
                throw err;
        }
        const userRecord = await firebase_admin_1.default.auth().createUser({ email, password });
        await firebase_admin_1.default.auth().setCustomUserClaims(userRecord.uid, { role });
        res.status(201).json({ message: "Utilisateur créé", uid: userRecord.uid, role });
    }
    catch (error) {
        console.error("Erreur création utilisateur:", error);
        res.status(400).json({ error: error.message || error });
    }
});
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: exemple@domaine.com
 *     responses:
 *       200:
 *         description: Authentification réussie
 *       400:
 *         description: Erreur de requête
 */
AuthRouter.post("/login", async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ error: "Email manquant" });
    try {
        const user = await firebase_admin_1.default.auth().getUserByEmail(email);
        const role = user.customClaims?.role || "user";
        const token = jsonwebtoken_1.default.sign({ uid: user.uid, role }, SECRET, { expiresIn: "2h" });
        res.json({ token, role });
    }
    catch (error) {
        console.error("Erreur login utilisateur:", error);
        res.status(400).json({ error: error.message || error });
    }
});
/**
 * @swagger
 * /auth/password-reset:
 *   post:
 *     summary: Envoyer un lien de réinitialisation de mot de passe
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Lien de réinitialisation envoyé
 *       400:
 *         description: Erreur de requête
 */
AuthRouter.post("/password-reset", async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ error: "Email manquant" });
    try {
        const link = await firebase_admin_1.default.auth().generatePasswordResetLink(email);
        await transporter.sendMail({
            from: `"Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Réinitialisation de votre mot de passe",
            html: `<p>Cliquez sur ce lien pour réinitialiser votre mot de passe :<br><a href="${link}">${link}</a></p>`,
        });
        res.json({ message: "Lien de réinitialisation envoyé par email" });
    }
    catch (error) {
        console.error("Erreur envoi lien réinitialisation:", error);
        res.status(400).json({ error: error.message || error });
    }
});
/**
 * @swagger
 * /auth/send-email-verification:
 *   post:
 *     summary: Envoyer un lien de vérification par email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Lien de vérification envoyé
 *       400:
 *         description: Erreur de requête
 */
AuthRouter.post("/send-email-verification", async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ error: "Email manquant" });
    try {
        const link = await firebase_admin_1.default.auth().generateEmailVerificationLink(email);
        await transporter.sendMail({
            from: `"Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Vérification de votre adresse email",
            html: `<p>Cliquez sur ce lien pour confirmer votre adresse email :<br><a href="${link}">${link}</a></p>`,
        });
        res.json({ message: "Lien de vérification envoyé par email" });
    }
    catch (error) {
        console.error("Erreur envoi lien vérification email:", error);
        res.status(400).json({ error: error.message || error });
    }
});
exports.default = AuthRouter;
//# sourceMappingURL=auth.routes.js.map