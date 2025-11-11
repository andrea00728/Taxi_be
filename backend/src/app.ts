import '@dotenvx/dotenvx/config';

import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./config/data-source.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import ligneRouter from "./routes/ligne.routes.js";
import ArretRouter from "./routes/arret.router.js";
import ItineraireRouter from "./routes/itineraire.router.js";
import TrajetRouter from "./routes/trajet.routes.js";
import AuthRouter from "./routes/auth.routes.js";
import ProvinceRouter from "./routes/province.router.js";
import RegionRouter from "./routes/region.route.js";
import { DistrictRoute } from "./routes/district.route.js";
import cors from "cors";

const app = express();
app.use(express.json());
console.log('EMAIL_USER=', process.env.SMTP_USER);
console.log('EMAIL_PASS=', process.env.SMTP_PASS);


//configuration cors
app.use(
  cors({
    origin: [
      "http://localhost:8081", // si tu utilises le web via Expo
      "exp://192.168.1.189:8081", // ton adresse Expo Go
      "http://localhost:19006", // port Expo Web
      "http://localhost:19000", // port Expo dev tools
      "http://192.168.1.189:19000", // IP de ton téléphone sur le même réseau
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// --- Swagger configuration ---
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TaxiBe API",
      version: "1.0.0",
      description: "Documentation de l'API TaxiBe",
    },
    servers: [
      { url: "http://localhost:3000/api" },
    ],
    // Ajoutez la configuration de security
    components: {
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      description: "Entrer le token JWT depuis l’authentification (format: Bearer <votre_token>)"
    }
  }
} ,

// Ajoutez la configuration de security
security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./dist/routes/*.js", "./src/routes/*.js"],

}; 

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Route pour accéder à Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Routes ---
app.use("/api/auth",AuthRouter);
app.use("/api/lignes",ligneRouter);
app.use("/api/arrets",ArretRouter);
app.use("/api/itineraires",ItineraireRouter);
app.use("/api/Trajet",TrajetRouter);
app.use("/api/provinces",ProvinceRouter);
app.use("/api/regions",RegionRouter);
app.use("/api/districts",DistrictRoute);


AppDataSource.initialize()
  .then(() => console.log("📦 Base de données connectée"))
  .catch((err) => console.error("Erreur de connexion DB :", err));

export default app;
