declare const TrajetRouter: import("express-serve-static-core").Router;
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
export default TrajetRouter;
//# sourceMappingURL=trajet.routes.d.ts.map