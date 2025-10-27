"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrajetController = void 0;
const arret_service_js_1 = require("../services/arret.service.js");
const ligne_service_js_1 = require("../services/ligne.service.js");
const arretSvc = new arret_service_js_1.ArretService();
const ligneSvc = new ligne_service_js_1.LigneService();
/**
 * Recherche très simple :
 * - on cherche les arrêts dont le nom contient le param départ et destination,
 * - on propose les lignes communes ou les lignes qui passent par ces arrêts.
 * (Ceci est un point de départ ; pour algo optimal utiliser graphe + Dijkstra/A*)
 */
class TrajetController {
    static async search(req, res) {
        const depart = req.query.depart || "";
        const destination = req.query.destination || "";
        if (!depart || !destination) {
            return res.status(400).json({ message: "Départ et destination requis" });
        }
        // trouver arrêts correspondants (partiel)
        const departArrets = await arretSvc.findByName(depart);
        const destArrets = await arretSvc.findByName(destination);
        // lignes qui passent par arrêt de départ
        const lignesDepart = new Map();
        for (const a of departArrets) {
            if (a.ligne)
                lignesDepart.set(a.ligne.id, a.ligne);
        }
        // lignes qui passent par arrêt de destination
        const lignesDest = new Map();
        for (const a of destArrets) {
            if (a.ligne)
                lignesDest.set(a.ligne.id, a.ligne);
        }
        // lignes communes => direct
        const direct = [];
        for (const [id, ligne] of lignesDepart) {
            if (lignesDest.has(id))
                direct.push(ligne);
        }
        // suggestions: direct first, else combinations
        const suggestions = [];
        if (direct.length > 0) {
            for (const l of direct) {
                suggestions.push({
                    type: "direct",
                    ligne: l,
                    note: "Passage direct entre départ et destination possible",
                });
            }
        }
        else {
            // proposer lignes départ + lignes destination (changer une fois)
            for (const l of lignesDepart.values()) {
                suggestions.push({ type: "depart", ligne: l });
            }
            for (const l of lignesDest.values()) {
                suggestions.push({ type: "destination", ligne: l });
            }
        }
        // renvoyer arrêts et suggestions
        res.json({
            departArrets,
            destArrets,
            suggestions,
        });
    }
}
exports.TrajetController = TrajetController;
//# sourceMappingURL=trajet.controller.js.map