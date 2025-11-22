import { DataSource } from "typeorm";
import { Ligne } from "../entities/Ligne.js";
import { Arret } from "../entities/Arret.js";
import { Itineraire } from "../entities/Itineraire.js";
import { Province } from "../entities/provinces.js";
import { Region } from "../entities/regions.js";
import { District } from "../entities/districts.js";
import { NotificationEntity } from "../entities/notification.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "ton_mot_de_passe",
  database: process.env.DB_NAME || "taxibe",
  // entities: ["dist/entities/*.js"],
    entities: [Ligne,Arret,Itineraire,Province,Region,District,NotificationEntity],
  synchronize: true,
});
