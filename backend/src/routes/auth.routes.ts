
import express, { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";


dotenv.config();

const AuthRouter = express.Router();
const SECRET = "taxibe_secret_key_2025";

// Initialisation Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

// Nodemailer config (ex: Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// OTP in-memory store
type OtpRecord = { code: string; expiresAt: number; attempts: number;role:string; };
const pendingOtps = new Map<string, OtpRecord>();

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
AuthRouter.post('/send-confirmation', async (req: Request, res: Response) => {
  const { email, role } = req.body;
  const validRoles = ['user', 'admin'];
  if (!email || !role || !validRoles.includes(role)) {
    return res.status(400).json({ error: 'Email ou rôle invalide' });
  }

  try {
    await admin.auth().getUserByEmail(email);
    return res.status(400).json({ error: "Email déjà utilisé" });
  } catch {
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
AuthRouter.post('/confirm', async (req: Request, res: Response) => {
  const { email, code } = req.body;
  const otpData = pendingOtps.get(email);

  if (!otpData) return res.status(400).json({ error: "Aucun code en attente pour cet email" });

  if (Date.now() > otpData.expiresAt) {
    pendingOtps.delete(email);
    return res.status(400).json({ error: "Code expiré" });
  }

  if (otpData.code !== code) {
    return res.status(400).json({ error: "Code incorrect" });
  }

  try {
    const userRecord = await admin.auth().createUser({ email });
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: otpData.role });
    pendingOtps.delete(email);
    return res.json({ message: "Compte créé avec succès", uid: userRecord.uid });
  } catch (error) {
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
AuthRouter.post("/login", async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email manquant" });

  try {
    const user = await admin.auth().getUserByEmail(email);
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
  } catch (error: any) {
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
AuthRouter.post("/verify-otp", async (req: Request, res: Response) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: "Email et code requis" });

  const record = pendingOtps.get(email);
  if (!record) return res.status(400).json({ error: "Aucun OTP en attente" });

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
    const user = await admin.auth().getUserByEmail(email);
    const role = user.customClaims?.role || "user";
    const token = jwt.sign({ uid: user.uid, role }, SECRET, { expiresIn: "2h" });
    return res.json({ token, role });
  } catch {
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
const resendLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  // Utilise ipKeyGenerator pour gérer les IPv6 correctement
  keyGenerator: (req) => req.body.email || ipKeyGenerator(req as any),
});
AuthRouter.post("/resend-otp", resendLimiter, async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email manquant" });

  try {
    await admin.auth().getUserByEmail(email);
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
  } catch {
    return res.status(400).json({ error: "Utilisateur introuvable" });
  }
});

export default AuthRouter;
