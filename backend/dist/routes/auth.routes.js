"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const express_rate_limit_1 = __importStar(require("express-rate-limit"));
dotenv_1.default.config();
const AuthRouter = express_1.default.Router();
const SECRET = "taxibe_secret_key_2025";
// Initialisation Firebase Admin
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
// Nodemailer config (ex: Gmail SMTP)
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
const pendingOtps = new Map();
function generateOtp(len = 6) {
    return Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join("");
}
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentification utilisateurs via OTP email
 */
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentification avec confirmation email par code OTP
 */
/**
 * @swagger
 * /auth/send-confirmation:
 *   post:
 *     summary: Envoie un code de confirmation par email pour créer un utilisateur (email + rôle)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: user
 *     responses:
 *       200:
 *         description: Code envoyé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 step:
 *                   type: string
 *       400:
 *         description: Email ou rôle invalide / email déjà utilisé
 */
AuthRouter.post('/send-confirmation', async (req, res) => {
    const { email, role } = req.body;
    const validRoles = ['user', 'admin'];
    if (!email || !role || !validRoles.includes(role)) {
        return res.status(400).json({ error: 'Email ou rôle invalide' });
    }
    try {
        await firebase_admin_1.default.auth().getUserByEmail(email);
        return res.status(400).json({ error: "Email déjà utilisé" });
    }
    catch {
        // Utilisateur non trouvé, ok pour générer code
    }
    const code = generateOtp(6);
    pendingOtps.set(email, {
        code,
        role,
        expiresAt: Date.now() + 5 * 60 * 1000,
        attempts: 0
    });
    await transporter.sendMail({
        from: `"Support TaxiBe" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Code de confirmation pour inscription",
        html: `<p>Votre code de confirmation (valide 5 minutes) : <b>${code}</b></p>`,
    });
    res.json({ message: "Code envoyé, veuillez confirmer", step: "CONFIRM_EMAIL" });
});
/**
 * @swagger
 * /auth/confirm:
 *   post:
 *     summary: Confirme le code OTP et crée le compte utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Compte créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 uid:
 *                   type: string
 *       400:
 *         description: Code invalide, expiré ou aucun code en attente
 */
AuthRouter.post('/confirm', async (req, res) => {
    const { email, code } = req.body;
    const otpData = pendingOtps.get(email);
    if (!otpData)
        return res.status(400).json({ error: "Aucun code en attente pour cet email" });
    if (Date.now() > otpData.expiresAt) {
        pendingOtps.delete(email);
        return res.status(400).json({ error: "Code expiré" });
    }
    if (otpData.code !== code) {
        return res.status(400).json({ error: "Code incorrect" });
    }
    try {
        const userRecord = await firebase_admin_1.default.auth().createUser({ email });
        await firebase_admin_1.default.auth().setCustomUserClaims(userRecord.uid, { role: otpData.role });
        pendingOtps.delete(email);
        return res.json({ message: "Compte créé avec succès", uid: userRecord.uid });
    }
    catch (error) {
        return res.status(400).json({ error: "Erreur lors de la création du compte" });
    }
});
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Vérification email, envoi OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Code envoyé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 step:
 *                   type: string
 *                 uid:
 *                   type: string
 *       400:
 *         description: Erreur d'email
 */
AuthRouter.post("/login", async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ error: "Email manquant" });
    try {
        const user = await firebase_admin_1.default.auth().getUserByEmail(email);
        const code = generateOtp(6);
        pendingOtps.set(email, {
            code, expiresAt: Date.now() + 5 * 60000, attempts: 0,
            role: ""
        });
        await transporter.sendMail({
            from: `"Support TaxiBe" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Votre code de vérification",
            html: `<p>Voici votre code de vérification (valide 5 minutes): <b>${code}</b></p>`,
        });
        return res.json({ message: "Code envoyé par email", step: "VERIFY_OTP", uid: user.uid });
    }
    catch (error) {
        console.error("Erreur login/OTP:", error);
        return res.status(400).json({ error: "Utilisateur introuvable ou erreur d'envoi" });
    }
});
/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Vérifie le code OTP reçu par email, délivre un JWT si correct
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, code]
 *             properties:
 *               email:
 *                 type: string
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Connexion réussie (token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Code invalide ou expiré
 *       429:
 *         description: Trop de tentatives
 */
AuthRouter.post("/verify-otp", async (req, res) => {
    const { email, code } = req.body;
    if (!email || !code)
        return res.status(400).json({ error: "Email et code requis" });
    const record = pendingOtps.get(email);
    if (!record)
        return res.status(400).json({ error: "Aucun OTP en attente" });
    if (record.attempts >= 5) {
        pendingOtps.delete(email);
        return res.status(429).json({ error: "Trop de tentatives, redemandez un code" });
    }
    if (Date.now() > record.expiresAt) {
        pendingOtps.delete(email);
        return res.status(400).json({ error: "Code expiré, redemandez un code" });
    }
    record.attempts += 1;
    if (code !== record.code) {
        return res.status(400).json({ error: "Code invalide" });
    }
    pendingOtps.delete(email);
    try {
        const user = await firebase_admin_1.default.auth().getUserByEmail(email);
        const role = user.customClaims?.role || "user";
        const token = jsonwebtoken_1.default.sign({ uid: user.uid, role }, SECRET, { expiresIn: "2h" });
        return res.json({ token, role });
    }
    catch {
        return res.status(400).json({ error: "Utilisateur introuvable" });
    }
});
/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Renvoyer un nouveau code OTP à l'email si délai/expiration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Nouveau code envoyé
 *       400:
 *         description: Utilisateur introuvable
 *       429:
 *         description: Rate limit atteint
 */
const resendLimiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000,
    max: 3,
    // Utilise ipKeyGenerator pour gérer les IPv6 correctement
    keyGenerator: (req) => req.body.email || (0, express_rate_limit_1.ipKeyGenerator)(req),
});
AuthRouter.post("/resend-otp", resendLimiter, async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ error: "Email manquant" });
    try {
        await firebase_admin_1.default.auth().getUserByEmail(email);
        const code = generateOtp(6);
        pendingOtps.set(email, {
            code, expiresAt: Date.now() + 5 * 60000, attempts: 0,
            role: ""
        });
        await transporter.sendMail({
            from: `"Support TaxiBe" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Nouveau code de vérification",
            html: `<p>Nouveau code (valide 5 minutes): <b>${code}</b></p>`,
        });
        return res.json({ message: "Nouveau code envoyé" });
    }
    catch {
        return res.status(400).json({ error: "Utilisateur introuvable" });
    }
});
exports.default = AuthRouter;
//# sourceMappingURL=auth.routes.js.map