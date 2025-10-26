import express from "express";
import admin from "firebase-admin";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();
const AuthRouter = express.Router();
const SECRET = "taxibe_secret_key_2025";
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}
// Configuration Nodemailer avec SMTP Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
export const verifyToken = (roles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ message: "Token manquant" });
        const token = authHeader.split(" ")[1];
        if (!token)
            return res.status(401).json({ message: "Token invalide" });
        try {
            const decoded = jwt.verify(token, SECRET);
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
            await admin.auth().getUserByEmail(email);
            return res.status(400).json({ error: "L'adresse email est déjà utilisée." });
        }
        catch (err) {
            if (err.code !== "auth/user-not-found")
                throw err;
        }
        const userRecord = await admin.auth().createUser({ email, password });
        await admin.auth().setCustomUserClaims(userRecord.uid, { role });
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
        const user = await admin.auth().getUserByEmail(email);
        const role = user.customClaims?.role || "user";
        const token = jwt.sign({ uid: user.uid, role }, SECRET, { expiresIn: "2h" });
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
        const link = await admin.auth().generatePasswordResetLink(email);
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
        const link = await admin.auth().generateEmailVerificationLink(email);
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
export default AuthRouter;
//# sourceMappingURL=auth.routes.js.map