"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trajet_controller_js_1 = require("../controllers/trajet.controller.js");
const TrajetRouter = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Trajets
 *   description: Recherche des trajets disponibles avec correspondances
 */
/**
 * @swagger
 * /Trajet/search:
 *   get:
 *     summary: Rechercher des trajets selon départ et destination
 *     description: Recherche intelligente de trajets avec gestion des correspondances et scoring basé sur la distance et le nombre de changements
 *     tags: [Trajets]
 *     parameters:
 *       - name: depart
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Point de départ (nom de l'arrêt)
 *         example: "Place de la République"
 *       - name: destination
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Destination finale (nom de l'arrêt)
 *         example: "Gare Centrale"
 *       - name: maxTransfers
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 2
 *           minimum: 0
 *           maximum: 5
 *         description: Nombre maximum de correspondances autorisées
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
 *                       example: "Place de la République"
 *                     arrets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           nom:
 *                             type: string
 *                 destination:
 *                   type: object
 *                   properties:
 *                     query:
 *                       type: string
 *                       example: "Gare Centrale"
 *                     arrets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           nom:
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
 *                               type: number
 *                       arrets:
 *                         type: array
 *                         description: Liste des arrêts du trajet (départ, correspondances, arrivée)
 *                         items:
 *                           type: object
 *                       transferCount:
 *                         type: number
 *                         description: Nombre de correspondances nécessaires
 *                       score:
 *                         type: number
 *                         description: Score du trajet (100 pour direct, réduit selon les correspondances)
 *                       recommendation:
 *                         type: string
 *                         description: Recommandation sur ce trajet
 *                 totalFound:
 *                   type: number
 *                   description: Nombre total de trajets trouvés
 *                 filters:
 *                   type: object
 *                   properties:
 *                     maxTransfers:
 *                       type: number
 *                     limit:
 *                       type: number
 *             examples:
 *               trajet_direct:
 *                 summary: Trajet direct
 *                 value:
 *                   depart:
 *                     query: "Place de la République"
 *                     arrets:
 *                       - id: 1
 *                         nom: "Place de la République"
 *                   destination:
 *                     query: "Gare Centrale"
 *                     arrets:
 *                       - id: 5
 *                         nom: "Gare Centrale"
 *                   routes:
 *                     - type: "direct"
 *                       lignes:
 *                         - id: 1
 *                           nom: "Ligne 1"
 *                           depart: "Place de la République"
 *                           terminus: "Gare Centrale"
 *                           tarif: 400
 *                       arrets:
 *                         - id: 1
 *                           nom: "Place de la République"
 *                         - id: 5
 *                           nom: "Gare Centrale"
 *                       transferCount: 0
 *                       score: 100
 *                       recommendation: "Trajet direct recommandé - Aucun changement nécessaire"
 *                   totalFound: 1
 *                   filters:
 *                     maxTransfers: 2
 *                     limit: 5
 *               trajet_avec_correspondance:
 *                 summary: Trajet avec correspondance
 *                 value:
 *                   depart:
 *                     query: "Analakely"
 *                     arrets:
 *                       - id: 2
 *                         nom: "Analakely"
 *                   destination:
 *                     query: "Ivato"
 *                     arrets:
 *                       - id: 8
 *                         nom: "Ivato"
 *                   routes:
 *                     - type: "with_transfer"
 *                       lignes:
 *                         - id: 2
 *                           nom: "Ligne 2"
 *                           depart: "Analakely"
 *                           terminus: "67 Ha"
 *                           tarif: 400
 *                         - id: 5
 *                           nom: "Ligne 5"
 *                           depart: "67 Ha"
 *                           terminus: "Ivato"
 *                           tarif: 600
 *                       arrets:
 *                         - id: 2
 *                           nom: "Analakely"
 *                         - id: 6
 *                           nom: "67 Ha"
 *                         - id: 8
 *                           nom: "Ivato"
 *                       transferCount: 1
 *                       score: 60
 *                       recommendation: "Trajet avec 1 correspondance - Bonne option"
 *                   totalFound: 3
 *                   filters:
 *                     maxTransfers: 2
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
 *         description: Aucun arrêt trouvé pour le départ ou la destination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *             examples:
 *               depart_introuvable:
 *                 summary: Départ introuvable
 *                 value:
 *                   message: "Aucun arrêt trouvé pour le départ: \"XYZ\""
 *                   error: "DEPARTURE_NOT_FOUND"
 *               destination_introuvable:
 *                 summary: Destination introuvable
 *                 value:
 *                   message: "Aucun arrêt trouvé pour la destination: \"ABC\""
 *                   error: "DESTINATION_NOT_FOUND"
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
 *     description: Trouve tous les arrêts dans un rayon donné autour d'une position GPS
 *     tags: [Trajets]
 *     parameters:
 *       - name: latitude
 *         in: query
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Latitude de la position
 *         example: -18.8792
 *       - name: longitude
 *         in: query
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Longitude de la position
 *         example: 47.5079
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
 *         description: Liste des arrêts à proximité
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
 *                         type: number
 *                       longitude:
 *                         type: number
 *                       ligne:
 *                         type: object
 *                 count:
 *                   type: number
 *       400:
 *         description: Latitude et longitude requises
 */
TrajetRouter.get("/nearby", trajet_controller_js_1.TrajetController.searchNearby);
exports.default = TrajetRouter;
//# sourceMappingURL=trajet.routes.js.map