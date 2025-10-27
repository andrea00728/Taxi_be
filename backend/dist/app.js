"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const data_source_js_1 = require("./config/data-source.js");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const ligne_routes_js_1 = __importDefault(require("./routes/ligne.routes.js"));
const arret_router_js_1 = __importDefault(require("./routes/arret.router.js"));
const itineraire_router_js_1 = __importDefault(require("./routes/itineraire.router.js"));
const trajet_routes_js_1 = __importDefault(require("./routes/trajet.routes.js"));
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
const province_router_js_1 = __importDefault(require("./routes/province.router.js"));
const region_route_js_1 = __importDefault(require("./routes/region.route.js"));
const district_route_js_1 = require("./routes/district.route.js");
const app = (0, express_1.default)();
app.use(express_1.default.json());
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
        },
        // Ajoutez la configuration de security
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./dist/routes/*.js", "./src/routes/*.js"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
// Route pour accéder à Swagger UI
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
// --- Routes ---
app.use("/api/auth", auth_routes_js_1.default);
app.use("/api/lignes", ligne_routes_js_1.default);
app.use("/api/arrets", arret_router_js_1.default);
app.use("/api/itineraires", itineraire_router_js_1.default);
app.use("/api/Trajet", trajet_routes_js_1.default);
app.use("/api/provinces", province_router_js_1.default);
app.use("/api/regions", region_route_js_1.default);
app.use("/api/districts", district_route_js_1.DistrictRoute);
data_source_js_1.AppDataSource.initialize()
    .then(() => console.log("📦 Base de données connectée"))
    .catch((err) => console.error("Erreur de connexion DB :", err));
exports.default = app;
//# sourceMappingURL=app.js.map