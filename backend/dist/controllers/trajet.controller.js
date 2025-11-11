"use strict";
// import { Request, Response } from "express";
// import { ArretService } from "../services/arret.service.js";
// import { LigneService } from "../services/ligne.service.js";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrajetController = void 0;
const arret_service_js_1 = require("../services/arret.service.js");
const ligne_service_js_1 = require("../services/ligne.service.js");
const arretSvc = new arret_service_js_1.ArretService();
const ligneSvc = new ligne_service_js_1.LigneService();
class TrajetController {
    /**
     * Recherche de trajet optimisée avec:
     * - Gestion des correspondances multiples
     * - Calcul de score basé sur distance et nombre de changements
     * - Support de la recherche floue
     * - Limitation des résultats pertinents
     */
    static async search(req, res) {
        const depart = req.query.depart?.trim() || "";
        const destination = req.query.destination?.trim() || "";
        const maxTransfers = parseInt(req.query.maxTransfers) || 2;
        const limit = parseInt(req.query.limit) || 5;
        if (!depart || !destination) {
            return res.status(400).json({
                message: "Départ et destination requis",
                error: "MISSING_PARAMETERS"
            });
        }
        // Normalisation et recherche floue des arrêts
        const departArrets = await arretSvc.findByName(depart);
        const destArrets = await arretSvc.findByName(destination);
        if (departArrets.length === 0) {
            return res.status(404).json({
                message: `Aucun arrêt trouvé pour le départ: "${depart}"`,
                error: "DEPARTURE_NOT_FOUND"
            });
        }
        if (destArrets.length === 0) {
            return res.status(404).json({
                message: `Aucun arrêt trouvé pour la destination: "${destination}"`,
                error: "DESTINATION_NOT_FOUND"
            });
        }
        // Construire un graphe des lignes et arrêts
        const lignesMap = new Map();
        const arretToLignes = new Map();
        // Indexer les lignes depuis les arrêts de départ
        for (const arret of departArrets) {
            if (arret.ligne) {
                lignesMap.set(arret.ligne.id, arret.ligne);
                if (!arretToLignes.has(arret.id)) {
                    arretToLignes.set(arret.id, new Set());
                }
                arretToLignes.get(arret.id).add(arret.ligne.id);
            }
        }
        // Indexer les lignes depuis les arrêts de destination
        for (const arret of destArrets) {
            if (arret.ligne) {
                lignesMap.set(arret.ligne.id, arret.ligne);
                if (!arretToLignes.has(arret.id)) {
                    arretToLignes.set(arret.id, new Set());
                }
                arretToLignes.get(arret.id).add(arret.ligne.id);
            }
        }
        // Trouver toutes les routes possibles
        const routes = [];
        // 1. Routes directes (sans correspondance)
        const directRoutes = await TrajetController.findDirectRoutes(departArrets, destArrets, lignesMap);
        routes.push(...directRoutes);
        // 2. Routes avec correspondances (si pas assez de routes directes)
        if (routes.length < limit && maxTransfers > 0) {
            const transferRoutes = await TrajetController.findRoutesWithTransfers(departArrets, destArrets, lignesMap, arretSvc, maxTransfers);
            routes.push(...transferRoutes);
        }
        // Trier par score (moins de correspondances = meilleur score)
        routes.sort((a, b) => b.score - a.score);
        // Limiter les résultats
        const topRoutes = routes.slice(0, limit);
        // Enrichir avec des informations supplémentaires
        const enrichedRoutes = topRoutes.map((route) => ({
            ...route,
            recommendation: TrajetController.getRecommendation(route),
        }));
        res.json({
            depart: {
                query: depart,
                arrets: departArrets.map(a => ({ id: a.id, nom: a.nom })),
            },
            destination: {
                query: destination,
                arrets: destArrets.map(a => ({ id: a.id, nom: a.nom })),
            },
            routes: enrichedRoutes,
            totalFound: routes.length,
            filters: {
                maxTransfers,
                limit,
            },
        });
    }
    /**
     * Trouver les routes directes (sans correspondance)
     */
    static async findDirectRoutes(departArrets, destArrets, lignesMap) {
        const routes = [];
        const processedLignes = new Set();
        for (const depArret of departArrets) {
            if (!depArret.ligne)
                continue;
            for (const destArret of destArrets) {
                if (!destArret.ligne)
                    continue;
                // Même ligne = trajet direct
                if (depArret.ligne.id === destArret.ligne.id) {
                    const ligneId = depArret.ligne.id;
                    // Éviter les doublons
                    if (processedLignes.has(ligneId))
                        continue;
                    processedLignes.add(ligneId);
                    const ligne = lignesMap.get(ligneId);
                    routes.push({
                        type: "direct",
                        lignes: [ligne],
                        arrets: [depArret, destArret],
                        transferCount: 0,
                        score: 100, // Score maximum pour trajet direct
                    });
                }
            }
        }
        return routes;
    }
    /**
     * Trouver les routes avec correspondances (algorithme simplifié de graphe)
     */
    static async findRoutesWithTransfers(departArrets, destArrets, lignesMap, arretSvc, maxTransfers) {
        const routes = [];
        const processedCombinations = new Set();
        // Pour chaque arrêt de départ
        for (const depArret of departArrets) {
            if (!depArret.ligne)
                continue;
            // Trouver les arrêts de correspondance sur la ligne de départ
            const ligneDepart = depArret.ligne;
            const arretsLigneDepart = await arretSvc.findByLigneId(ligneDepart.id);
            // Pour chaque arrêt de la ligne de départ
            for (const arretCorrespondance of arretsLigneDepart) {
                // Trouver les autres lignes qui passent par cet arrêt
                const autresLignes = await arretSvc.findLignesByArretName(arretCorrespondance.nom);
                // Pour chaque ligne de correspondance
                for (const ligneCorrespondance of autresLignes) {
                    if (ligneCorrespondance.id === ligneDepart.id)
                        continue;
                    // Vérifier si cette ligne va vers la destination
                    for (const destArret of destArrets) {
                        if (!destArret.ligne)
                            continue;
                        if (ligneCorrespondance.id === destArret.ligne.id) {
                            const combinationKey = `${ligneDepart.id}-${ligneCorrespondance.id}-${destArret.id}`;
                            if (processedCombinations.has(combinationKey))
                                continue;
                            processedCombinations.add(combinationKey);
                            routes.push({
                                type: "with_transfer",
                                lignes: [ligneDepart, ligneCorrespondance],
                                arrets: [depArret, arretCorrespondance, destArret],
                                transferCount: 1,
                                score: 70 - (1 * 10), // Pénalité pour chaque correspondance
                            });
                        }
                    }
                }
            }
        }
        // Limiter aux routes avec correspondances acceptables
        return routes.filter(r => r.transferCount <= maxTransfers);
    }
    /**
     * Générer une recommandation basée sur la route
     */
    static getRecommendation(route) {
        if (route.type === "direct") {
            return "Trajet direct recommandé - Aucun changement nécessaire";
        }
        if (route.transferCount === 1) {
            return "Trajet avec 1 correspondance - Bonne option";
        }
        return `Trajet avec ${route.transferCount} correspondances - Option alternative`;
    }
    /**
     * Recherche d'arrêts à proximité (pour suggestions futures)
     */
    static async searchNearby(req, res) {
        const { latitude, longitude, radius = 500 } = req.query;
        if (!latitude || !longitude) {
            return res.status(400).json({
                message: "Latitude et longitude requises"
            });
        }
        const nearbyArrets = await arretSvc.findNearby(parseFloat(latitude), parseFloat(longitude), parseInt(radius));
        res.json({
            arrets: nearbyArrets,
            count: nearbyArrets.length,
        });
    }
}
exports.TrajetController = TrajetController;
//# sourceMappingURL=trajet.controller.js.map