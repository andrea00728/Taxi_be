"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Ligne_js_1 = require("../entities/Ligne.js");
const Arret_js_1 = require("../entities/Arret.js");
const Itineraire_js_1 = require("../entities/Itineraire.js");
const provinces_js_1 = require("../entities/provinces.js");
const regions_js_1 = require("../entities/regions.js");
const districts_js_1 = require("../entities/districts.js");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "ton_mot_de_passe",
    database: process.env.DB_NAME || "taxibe",
    // entities: ["dist/entities/*.js"],
    entities: [Ligne_js_1.Ligne, Arret_js_1.Arret, Itineraire_js_1.Itineraire, provinces_js_1.Province, regions_js_1.Region, districts_js_1.District],
    synchronize: true,
});
//# sourceMappingURL=data-source.js.map