"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrajetController = void 0;
const arret_service_js_1 = require("../services/arret.service.js");
const ligne_service_js_1 = require("../services/ligne.service.js");
const arretSvc = new arret_service_js_1.ArretService();
const ligneSvc = new ligne_service_js_1.LigneService();
class TrajetController {
    /**
     * Calcule la distance entre deux points GPS avec la formule de Haversine
     */
    static calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3;
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    static findNearestArret(targetLat, targetLon, arrets) {
        if (!arrets || arrets.length === 0)
            return null;
        let nearest = null;
        let minDistance = Infinity;
        for (const arret of arrets) {
            const lat = parseFloat(arret.latitude);
            const lon = parseFloat(arret.longitude);
            if (isNaN(lat) || isNaN(lon))
                continue;
            const distance = this.calculateDistance(targetLat, targetLon, lat, lon);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = { arret, distance };
            }
        }
        return nearest;
    }
    static async search(req, res) {
        const depart = req.query.depart?.trim() || "";
        const destination = req.query.destination?.trim() || "";
        const maxTransfers = parseInt(req.query.maxTransfers) || 2;
        const maxWalkingDistance = parseInt(req.query.maxWalkingDistance) || 500;
        const limit = parseInt(req.query.limit) || 5;
        console.log("\n" + "=".repeat(60));
        console.log("🔍 RECHERCHE DE TRAJET");
        console.log("=".repeat(60));
        console.log(`📍 Départ: "${depart}"`);
        console.log(`🎯 Destination: "${destination}"`);
        console.log(`⚙️  Filtres: maxTransfers=${maxTransfers}, maxWalkingDistance=${maxWalkingDistance}m`);
        if (!depart || !destination) {
            return res.status(400).json({
                message: "Départ et destination requis",
                error: "MISSING_PARAMETERS",
            });
        }
        // 1. Recherche floue des arrêts (utilise maintenant la méthode du service)
        console.log("\n📍 ÉTAPE 1: Recherche des arrêts (recherche floue)");
        const departArrets = await arretSvc.findByName(depart);
        const destArrets = await arretSvc.findByName(destination);
        console.log(`  ✅ Arrêts de départ trouvés: ${departArrets.length}`);
        if (departArrets.length > 0) {
            departArrets.forEach((a) => {
                console.log(`     - ${a.nom} (ID: ${a.id}, Ligne: ${a.ligne?.nom || "N/A"})`);
            });
        }
        console.log(`  ✅ Arrêts de destination trouvés: ${destArrets.length}`);
        if (destArrets.length > 0) {
            destArrets.forEach((a) => {
                console.log(`     - ${a.nom} (ID: ${a.id}, Ligne: ${a.ligne?.nom || "N/A"})`);
            });
        }
        if (departArrets.length === 0) {
            return res.status(404).json({
                message: `Aucun arrêt trouvé pour le départ: "${depart}"`,
                error: "DEPARTURE_NOT_FOUND",
                suggestions: await TrajetController.getSuggestions(depart, arretSvc),
            });
        }
        if (destArrets.length === 0) {
            return res.status(404).json({
                message: `Aucun arrêt trouvé pour la destination: "${destination}"`,
                error: "DESTINATION_NOT_FOUND",
                suggestions: await TrajetController.getSuggestions(destination, arretSvc),
            });
        }
        // 2. Récupérer toutes les lignes avec leurs arrêts
        console.log("\n🚌 ÉTAPE 2: Chargement des lignes acceptées");
        const allLignes = await ligneSvc.findAllWithArrets();
        const acceptedLignes = allLignes.filter((l) => l.statut === "Accepted" && l.arrets && l.arrets.length > 0);
        console.log(`  ✅ Total lignes acceptées avec arrêts: ${acceptedLignes.length}`);
        acceptedLignes.forEach((l) => {
            console.log(`     - ${l.nom}: ${l.arrets.length} arrêt(s)`);
        });
        const routes = [];
        // 3. Routes directes
        console.log("\n🎯 ÉTAPE 3: Recherche de routes directes");
        const directRoutes = await TrajetController.findDirectRoutes(departArrets, destArrets);
        console.log(`  ✅ Routes directes trouvées: ${directRoutes.length}`);
        routes.push(...directRoutes);
        // 4. Routes avec correspondances
        if (maxTransfers > 0) {
            console.log("\n🔄 ÉTAPE 4: Recherche de routes avec correspondances");
            const transferRoutes = await TrajetController.findIntelligentTransferRoutes(departArrets, destArrets, acceptedLignes, maxWalkingDistance, maxTransfers);
            console.log(`  ✅ Routes avec correspondances trouvées: ${transferRoutes.length}`);
            routes.push(...transferRoutes);
        }
        // 5. Tri et limite
        routes.sort((a, b) => b.score - a.score);
        const topRoutes = routes.slice(0, limit);
        console.log("\n📊 RÉSUMÉ FINAL");
        console.log(`  Total routes trouvées: ${routes.length}`);
        console.log(`  Routes retournées: ${topRoutes.length}`);
        console.log("=".repeat(60) + "\n");
        if (topRoutes.length === 0) {
            return res.status(404).json({
                message: "Aucun trajet trouvé",
                error: "NO_ROUTE_FOUND",
                depart: {
                    query: depart,
                    arrets: departArrets.map((a) => ({
                        id: a.id,
                        nom: a.nom,
                        ligne: a.ligne?.nom || null
                    })),
                },
                destination: {
                    query: destination,
                    arrets: destArrets.map((a) => ({
                        id: a.id,
                        nom: a.nom,
                        ligne: a.ligne?.nom || null
                    })),
                },
                suggestion: "Essayez d'augmenter la distance de marche maximale ou le nombre de correspondances",
                debug: {
                    acceptedLignesCount: acceptedLignes.length,
                    departArretsCount: departArrets.length,
                    destArretsCount: destArrets.length,
                    departLignes: departArrets.map((a) => a.ligne?.nom).filter(Boolean),
                    destLignes: destArrets.map((a) => a.ligne?.nom).filter(Boolean),
                },
            });
        }
        res.json({
            depart: {
                query: depart,
                arrets: departArrets.map((a) => ({
                    id: a.id,
                    nom: a.nom,
                    latitude: a.latitude,
                    longitude: a.longitude,
                })),
            },
            destination: {
                query: destination,
                arrets: destArrets.map((a) => ({
                    id: a.id,
                    nom: a.nom,
                    latitude: a.latitude,
                    longitude: a.longitude,
                })),
            },
            routes: topRoutes,
            totalFound: routes.length,
            filters: {
                maxTransfers,
                maxWalkingDistance: `${maxWalkingDistance}m`,
                limit,
            },
        });
    }
    static async findDirectRoutes(departArrets, destArrets) {
        const routes = [];
        const processedLignes = new Set();
        for (const depArret of departArrets) {
            if (!depArret.ligne) {
                console.log(`    ⚠️  "${depArret.nom}" n'a pas de ligne associée`);
                continue;
            }
            for (const destArret of destArrets) {
                if (!destArret.ligne) {
                    console.log(`    ⚠️  "${destArret.nom}" n'a pas de ligne associée`);
                    continue;
                }
                if (depArret.ligne.id === destArret.ligne.id) {
                    const ligneId = depArret.ligne.id;
                    if (processedLignes.has(ligneId))
                        continue;
                    processedLignes.add(ligneId);
                    const distance = this.calculateDistance(parseFloat(depArret.latitude), parseFloat(depArret.longitude), parseFloat(destArret.latitude), parseFloat(destArret.longitude));
                    console.log(`    ✅ Route directe via ${depArret.ligne.nom}: ${Math.round(distance)}m`);
                    routes.push({
                        type: "direct",
                        lignes: [depArret.ligne],
                        arrets: [depArret, destArret],
                        transferCount: 0,
                        estimatedDistance: distance,
                        totalDistance: distance,
                        score: 100 - distance / 1000,
                        instructions: [
                            `Prendre ${depArret.ligne.nom} à "${depArret.nom}"`,
                            `Descendre à "${destArret.nom}"`,
                            `Distance estimée: ${Math.round(distance)}m`,
                        ],
                    });
                }
            }
        }
        return routes;
    }
    static async findIntelligentTransferRoutes(departArrets, destArrets, allLignes, maxWalkingDistance, maxTransfers) {
        const routes = [];
        for (const depArret of departArrets) {
            if (!depArret.ligne) {
                console.log(`    ⚠️  Arrêt de départ "${depArret.nom}" sans ligne`);
                continue;
            }
            const ligneDepart = depArret.ligne;
            console.log(`\n    🚌 Analyse de ${ligneDepart.nom}`);
            const ligneCompletDepart = allLignes.find((l) => l.id === ligneDepart.id);
            if (!ligneCompletDepart || !ligneCompletDepart.arrets || ligneCompletDepart.arrets.length === 0) {
                console.log(`       ❌ ${ligneDepart.nom} n'a pas d'arrêts chargés`);
                continue;
            }
            const arretsLigneDepart = ligneCompletDepart.arrets;
            console.log(`       → ${arretsLigneDepart.length} arrêts disponibles`);
            for (const destArret of destArrets) {
                const destLat = parseFloat(destArret.latitude);
                const destLon = parseFloat(destArret.longitude);
                if (isNaN(destLat) || isNaN(destLon))
                    continue;
                let bestTransfer = null;
                for (const arretDescente of arretsLigneDepart) {
                    const descenteLat = parseFloat(arretDescente.latitude);
                    const descenteLon = parseFloat(arretDescente.longitude);
                    if (isNaN(descenteLat) || isNaN(descenteLon))
                        continue;
                    for (const autreLigne of allLignes) {
                        if (autreLigne.id === ligneDepart.id)
                            continue;
                        if (!autreLigne.arrets || autreLigne.arrets.length === 0)
                            continue;
                        const nearestArret = this.findNearestArret(descenteLat, descenteLon, autreLigne.arrets);
                        if (!nearestArret || nearestArret.distance > maxWalkingDistance)
                            continue;
                        const nearestToDest = this.findNearestArret(destLat, destLon, autreLigne.arrets);
                        if (!nearestToDest)
                            continue;
                        const distanceDepart = this.calculateDistance(parseFloat(depArret.latitude), parseFloat(depArret.longitude), descenteLat, descenteLon);
                        const distanceTransfer = this.calculateDistance(parseFloat(nearestArret.arret.latitude), parseFloat(nearestArret.arret.longitude), parseFloat(nearestToDest.arret.latitude), parseFloat(nearestToDest.arret.longitude));
                        const walkToDestination = this.calculateDistance(parseFloat(nearestToDest.arret.latitude), parseFloat(nearestToDest.arret.longitude), destLat, destLon);
                        const totalDistance = distanceDepart + nearestArret.distance + distanceTransfer + walkToDestination;
                        if (!bestTransfer || totalDistance < bestTransfer.totalDistance) {
                            bestTransfer = {
                                arretDescente,
                                ligneCorrespondance: autreLigne,
                                arretMontee: nearestArret.arret,
                                arretDestination: nearestToDest.arret,
                                walkDistance: nearestArret.distance + walkToDestination,
                                totalDistance,
                            };
                        }
                    }
                }
                if (bestTransfer) {
                    const score = 80 - bestTransfer.totalDistance / 1000 - bestTransfer.walkDistance / 100;
                    console.log(`       ✅ Correspondance trouvée: ${ligneDepart.nom} → ${bestTransfer.ligneCorrespondance.nom}`);
                    console.log(`          Distance: ${Math.round(bestTransfer.totalDistance)}m (dont ${Math.round(bestTransfer.walkDistance)}m à pied)`);
                    routes.push({
                        type: "with_transfer",
                        lignes: [ligneDepart, bestTransfer.ligneCorrespondance],
                        arrets: [
                            depArret,
                            bestTransfer.arretDescente,
                            bestTransfer.arretMontee,
                            bestTransfer.arretDestination,
                            destArret,
                        ],
                        transferCount: 1,
                        estimatedDistance: bestTransfer.totalDistance,
                        totalDistance: bestTransfer.totalDistance,
                        walkingDistance: bestTransfer.walkDistance,
                        score,
                        instructions: [
                            `1. Prendre ${ligneDepart.nom} à "${depArret.nom}"`,
                            `2. Descendre à "${bestTransfer.arretDescente.nom}"`,
                            `3. 🚶 Marcher ${Math.round(this.calculateDistance(parseFloat(bestTransfer.arretDescente.latitude), parseFloat(bestTransfer.arretDescente.longitude), parseFloat(bestTransfer.arretMontee.latitude), parseFloat(bestTransfer.arretMontee.longitude)))}m jusqu'à "${bestTransfer.arretMontee.nom}"`,
                            `4. Prendre ${bestTransfer.ligneCorrespondance.nom}`,
                            `5. Descendre à "${bestTransfer.arretDestination.nom}"`,
                            `Distance totale: ${Math.round(bestTransfer.totalDistance)}m`,
                            `Distance à pied: ${Math.round(bestTransfer.walkDistance)}m`,
                        ],
                    });
                }
            }
        }
        return routes.filter((r) => r.transferCount <= maxTransfers);
    }
    static async getSuggestions(query, arretSvc) {
        const allArrets = await arretSvc.getAllArrets();
        // Normaliser la query
        const normalizedQuery = query.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[''`´]/g, "")
            .toLowerCase()
            .trim();
        const suggestions = allArrets
            .filter((a) => {
            const normalizedName = a.nom.normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[''`´]/g, "")
                .toLowerCase();
            return normalizedName.includes(normalizedQuery.substring(0, 3));
        })
            .slice(0, 5)
            .map((a) => a.nom);
        return suggestions;
    }
}
exports.TrajetController = TrajetController;
//# sourceMappingURL=trajet.controller.js.map