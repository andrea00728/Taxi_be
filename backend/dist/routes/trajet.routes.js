"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trajet_controller_js_1 = require("../controllers/trajet.controller.js");
const TrajetRouter = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Trajets
 *   description: Recherche intelligente de trajets avec correspondances géographiques et calcul de distances
 */
/**
 * @swagger
 * /Trajet/search:
 *   get:
 *     summary: Rechercher des trajets selon départ et destination
 *     description: |
 *       Recherche intelligente de trajets avec:
 *       - Calcul de distance réelle (formule de Haversine)
 *       - Correspondances basées sur la proximité géographique
 *       - Instructions détaillées pas à pas
 *       - Gestion de la marche entre arrêts
 *       - Score optimisé (distance + correspondances)
 *     tags: [Trajets]
 *     parameters:
 *       - name: depart
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Point de départ (nom de l'arrêt)
 *         example: "Adventiste Isada"
 *       - name: destination
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Destination finale (nom de l'arrêt)
 *         example: "ENS Fianarantsoa"
 *       - name: maxTransfers
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 2
 *           minimum: 0
 *           maximum: 5
 *         description: Nombre maximum de correspondances autorisées
 *       - name: maxWalkingDistance
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 500
 *           minimum: 100
 *           maximum: 2000
 *         description: Distance maximale de marche entre correspondances (en mètres)
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 5
 *           minimum: 1
 *           maximum: 20
 *         description: Nombre maximum de trajets à retourner
 *     responses:
 *       200:
 *         description: Liste des trajets trouvés avec leurs détails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 depart:
 *                   type: object
 *                   properties:
 *                     query:
 *                       type: string
 *                       example: "Adventiste Isada"
 *                     arrets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           nom:
 *                             type: string
 *                           latitude:
 *                             type: string
 *                           longitude:
 *                             type: string
 *                 destination:
 *                   type: object
 *                   properties:
 *                     query:
 *                       type: string
 *                       example: "ENS Fianarantsoa"
 *                     arrets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           nom:
 *                             type: string
 *                           latitude:
 *                             type: string
 *                           longitude:
 *                             type: string
 *                 routes:
 *                   type: array
 *                   description: Liste des trajets trouvés, triés par score (meilleur en premier)
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         enum: [direct, with_transfer]
 *                         description: Type de trajet (direct ou avec correspondance)
 *                       lignes:
 *                         type: array
 *                         description: Liste des lignes à emprunter
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: number
 *                             nom:
 *                               type: string
 *                             depart:
 *                               type: string
 *                             terminus:
 *                               type: string
 *                             tarif:
 *                               type: string
 *                             statut:
 *                               type: string
 *                       arrets:
 *                         type: array
 *                         description: Liste des arrêts du trajet (départ, correspondances, arrivée)
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: number
 *                             nom:
 *                               type: string
 *                             latitude:
 *                               type: string
 *                             longitude:
 *                               type: string
 *                       transferCount:
 *                         type: number
 *                         description: Nombre de correspondances nécessaires
 *                       estimatedDistance:
 *                         type: number
 *                         description: Distance estimée du trajet (en mètres)
 *                       totalDistance:
 *                         type: number
 *                         description: Distance totale incluant la marche (en mètres)
 *                       walkingDistance:
 *                         type: number
 *                         description: Distance totale à pied (en mètres)
 *                       score:
 *                         type: number
 *                         description: Score du trajet (100 pour direct, réduit selon distance et correspondances)
 *                       instructions:
 *                         type: array
 *                         description: Instructions détaillées pas à pas
 *                         items:
 *                           type: string
 *                 totalFound:
 *                   type: number
 *                   description: Nombre total de trajets trouvés
 *                 filters:
 *                   type: object
 *                   properties:
 *                     maxTransfers:
 *                       type: number
 *                     maxWalkingDistance:
 *                       type: string
 *                       example: "500m"
 *                     limit:
 *                       type: number
 *             examples:
 *               trajet_direct:
 *                 summary: Trajet direct sans correspondance
 *                 value:
 *                   depart:
 *                     query: "Adventiste Isada"
 *                     arrets:
 *                       - id: 14
 *                         nom: "Adventiste Isada"
 *                         latitude: "-21.463723"
 *                         longitude: "47.091866"
 *                   destination:
 *                     query: "Soatsihadino"
 *                     arrets:
 *                       - id: 15
 *                         nom: "Soatsihadino"
 *                         latitude: "-21.454287"
 *                         longitude: "47.096572"
 *                   routes:
 *                     - type: "direct"
 *                       lignes:
 *                         - id: 23
 *                           nom: "Bus 39"
 *                           depart: "Ambonifahidrano"
 *                           terminus: "Soatsihadino"
 *                           tarif: "600"
 *                           statut: "Accepted"
 *                       arrets:
 *                         - id: 14
 *                           nom: "Adventiste Isada"
 *                           latitude: "-21.463723"
 *                           longitude: "47.091866"
 *                         - id: 15
 *                           nom: "Soatsihadino"
 *                           latitude: "-21.454287"
 *                           longitude: "47.096572"
 *                       transferCount: 0
 *                       estimatedDistance: 1248
 *                       totalDistance: 1248
 *                       score: 98.75
 *                       instructions:
 *                         - "Prendre Bus 39 à \"Adventiste Isada\""
 *                         - "Descendre à \"Soatsihadino\""
 *                         - "Distance estimée: 1248m"
 *                   totalFound: 1
 *                   filters:
 *                     maxTransfers: 2
 *                     maxWalkingDistance: "500m"
 *                     limit: 5
 *               trajet_avec_correspondance:
 *                 summary: Trajet avec correspondance intelligente
 *                 value:
 *                   depart:
 *                     query: "Adventiste Isada"
 *                     arrets:
 *                       - id: 14
 *                         nom: "Adventiste Isada"
 *                         latitude: "-21.463723"
 *                         longitude: "47.091866"
 *                   destination:
 *                     query: "ENS Fianarantsoa"
 *                     arrets:
 *                       - id: 10
 *                         nom: "ENS Fianarantsoa"
 *                         latitude: "-21.462316"
 *                         longitude: "47.108749"
 *                   routes:
 *                     - type: "with_transfer"
 *                       lignes:
 *                         - id: 23
 *                           nom: "Bus 39"
 *                           depart: "Ambonifahidrano"
 *                           terminus: "Soatsihadino"
 *                           tarif: "600"
 *                         - id: 21
 *                           nom: "Bus 40"
 *                           depart: "Ankofafa Ambony"
 *                           terminus: "Andrainjato"
 *                           tarif: "600"
 *                       arrets:
 *                         - id: 14
 *                           nom: "Adventiste Isada"
 *                           latitude: "-21.463723"
 *                           longitude: "47.091866"
 *                         - id: 15
 *                           nom: "Soatsihadino"
 *                           latitude: "-21.454287"
 *                           longitude: "47.096572"
 *                         - id: 8
 *                           nom: "Police Routiere Andohanivory"
 *                           latitude: "-21.451581"
 *                           longitude: "47.096926"
 *                         - id: 10
 *                           nom: "ENS Fianarantsoa"
 *                           latitude: "-21.462316"
 *                           longitude: "47.108749"
 *                       transferCount: 1
 *                       estimatedDistance: 3245
 *                       totalDistance: 3567
 *                       walkingDistance: 322
 *                       score: 72.43
 *                       instructions:
 *                         - "1. Prendre Bus 39 à \"Adventiste Isada\""
 *                         - "2. Descendre à \"Soatsihadino\""
 *                         - "3. 🚶 Marcher 298m jusqu'à \"Police Routiere Andohanivory\""
 *                         - "4. Prendre Bus 40"
 *                         - "5. Descendre à \"ENS Fianarantsoa\""
 *                         - "Distance totale: 3567m"
 *                         - "Distance à pied: 322m"
 *                   totalFound: 2
 *                   filters:
 *                     maxTransfers: 2
 *                     maxWalkingDistance: "500m"
 *                     limit: 5
 *       400:
 *         description: Paramètres manquants ou invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *             example:
 *               message: "Départ et destination requis"
 *               error: "MISSING_PARAMETERS"
 *       404:
 *         description: Aucun arrêt trouvé ou aucun trajet disponible
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *                 suggestions:
 *                   type: array
 *                   items:
 *                     type: string
 *                 suggestion:
 *                   type: string
 *             examples:
 *               depart_introuvable:
 *                 summary: Départ introuvable
 *                 value:
 *                   message: "Aucun arrêt trouvé pour le départ: \"XYZ\""
 *                   error: "DEPARTURE_NOT_FOUND"
 *                   suggestions:
 *                     - "Adventiste Isada"
 *                     - "Ambatovory"
 *                     - "Antarandolo"
 *               destination_introuvable:
 *                 summary: Destination introuvable
 *                 value:
 *                   message: "Aucun arrêt trouvé pour la destination: \"ABC\""
 *                   error: "DESTINATION_NOT_FOUND"
 *                   suggestions:
 *                     - "ENS Fianarantsoa"
 *                     - "Municipal Stadium"
 *                     - "Marché Anjoma"
 *               aucun_trajet:
 *                 summary: Aucun trajet trouvé
 *                 value:
 *                   message: "Aucun trajet trouvé"
 *                   error: "NO_ROUTE_FOUND"
 *                   depart:
 *                     query: "Adventiste Isada"
 *                     arrets:
 *                       - id: 14
 *                         nom: "Adventiste Isada"
 *                   destination:
 *                     query: "Lieu très éloigné"
 *                     arrets:
 *                       - id: 99
 *                         nom: "Lieu très éloigné"
 *                   suggestion: "Essayez d'augmenter la distance de marche maximale ou le nombre de correspondances"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
TrajetRouter.get("/search", trajet_controller_js_1.TrajetController.search);
/**
 * @swagger
 * /Trajet/nearby:
 *   get:
 *     summary: Rechercher les arrêts à proximité d'une position GPS
 *     description: |
 *       Trouve tous les arrêts dans un rayon donné autour d'une position GPS.
 *       Utilise la formule de Haversine pour calculer les distances précises.
 *     tags: [Trajets]
 *     parameters:
 *       - name: latitude
 *         in: query
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Latitude de la position
 *         example: -21.462316
 *       - name: longitude
 *         in: query
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Longitude de la position
 *         example: 47.108749
 *       - name: radius
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 500
 *           minimum: 100
 *           maximum: 5000
 *         description: Rayon de recherche en mètres
 *     responses:
 *       200:
 *         description: Liste des arrêts à proximité avec leurs distances
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 arrets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       nom:
 *                         type: string
 *                       latitude:
 *                         type: string
 *                       longitude:
 *                         type: string
 *                       distance:
 *                         type: number
 *                         description: Distance en mètres
 *                       ligne:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           nom:
 *                             type: string
 *                           tarif:
 *                             type: string
 *                 count:
 *                   type: number
 *             example:
 *               arrets:
 *                 - id: 10
 *                   nom: "ENS Fianarantsoa"
 *                   latitude: "-21.462316"
 *                   longitude: "47.108749"
 *                   distance: 0
 *                   ligne:
 *                     id: 21
 *                     nom: "Bus 40"
 *                     tarif: "600"
 *                 - id: 9
 *                   nom: "Arret Antanifotsy"
 *                   latitude: "-21.457972"
 *                   longitude: "47.103073"
 *                   distance: 687
 *                   ligne:
 *                     id: 21
 *                     nom: "Bus 40"
 *                     tarif: "600"
 *               count: 2
 *       400:
 *         description: Latitude et longitude requises
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Latitude et longitude requises"
 */
// TrajetRouter.get("/nearby", TrajetController.);
exports.default = TrajetRouter;
//# sourceMappingURL=trajet.routes.js.map