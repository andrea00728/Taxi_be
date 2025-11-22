"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LigneController = void 0;
const ligne_service_js_1 = require("../services/ligne.service.js");
const ligneService = new ligne_service_js_1.LigneService();
class LigneController {
    /**
     * Retrieves all lignes from the database, including their associated arrets and itineraires.
     *
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the lignes.
     */
    static async getAllLignes(req, res) {
        try {
            const data = await ligneService.getAllLignes();
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des lignes" });
        }
    }
    /**
     * Retrieves all lignes belonging to a given user, including their associated arrets and itineraires.
     *
     * @param {AuthRequest} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the lignes.
     */
    static async getLigneByUser(req, res) {
        try {
            const firebaseUid = req.user.uid;
            const data = await ligneService.getLigneUser(firebaseUid);
            res.status(200).json(data);
        }
        catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des lignes" });
        }
    }
    /**
     * Retrieves a ligne by its ID, including its associated arrets and itineraires.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the ligne.
     */
    static async getLigneById(req, res) {
        try {
            const id = Number(req.params.id);
            const data = await ligneService.getLigneById(id);
            if (!data) {
                return res.status(404).json({ message: "Ligne introuvable" });
            }
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération de la ligne" });
        }
    }
    /**
     * Creates a new ligne and persists it to the database.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while creating the ligne.
     */
    static async createLigne(req, res) {
        try {
            const payload = req.body;
            const firebaseUid = req.user.uid;
            const role = req.user.role;
            const createLigne = await ligneService.createLign(payload, firebaseUid, role);
            res.status(201).json({ message: "ligne crée avec succès", createLigne });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erreur lors de la création de la ligne", error });
        }
    }
    //  static async createLigne(req: AuthRequest, res: Response) {
    //   try {
    //     const payload = req.body;
    //     const firebaseUid = req.user!.uid;
    //     const role = req.user!.role;
    //     const createLigne = await ligneService.createLign(payload, firebaseUid, role);
    //     // ✅ ICI : Notifier les admins si c'est un user qui crée la ligne
    //     if (role === 'user') {
    //       console.log(">>> Envoi notification à l'admin via websocket");
    //       sendNotificationToAllAdmins({
    //         type: "ligne_created",
    //         title: "🆕 Nouvelle ligne créée",
    //         message: `Une nouvelle ligne "${createLigne.nom}" a été créée et attend validation.`,
    //         ligne: {
    //           id: createLigne.id,
    //           nom: createLigne.nom,
    //           district: createLigne.district,
    //         },
    //         createdAt: new Date().toISOString()
    //       });
    //     }
    //     res.status(201).json({ message: "Ligne créée avec succès", createLigne });
    //   } catch (error) {
    //     console.log(error);
    //     res.status(500).json({ message: "Erreur lors de la création de la ligne", error });
    //   }
    // }
    /**
     * Updates a ligne by its ID.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while updating the ligne.
     */
    static async updateLigne(req, res) {
        try {
            const id = Number(req.params.id);
            const updateLigne = await ligneService.updateLigne(id, req.body);
            res.status(200).json({ message: "ligne mise à jour avec succès", updateLigne });
        }
        catch (error) {
            res.status(500).json({ message: "Erreur lors de la mise à jour de la ligne" });
        }
    }
    // static async updateStatusLigne(req: Request, res: Response) {
    //   try {
    //     const id = Number(req.params.id);
    //     const ligne_avant_maj = await ligneService.getLigneById(id);
    //     if (!ligne_avant_maj) {
    //       return res.status(404).json({ message: "Ligne introuvable" });
    //     }
    //     console.log("🔍 Ligne avant maj:", {
    //       id: ligne_avant_maj.id,
    //       nom: ligne_avant_maj.nom,
    //       firebase_uid: ligne_avant_maj.firebase_uid  // ⚠️ IMPORTANT
    //     });
    //     const updateLigne = await ligneService.updateLigne(id, req.body);
    //     const newStatus = req.body.statut;
    //     console.log("📝 Nouveau statut:", newStatus);
    //     let notification: any = null;
    //     if (newStatus === StatutLigne.Accepted) {
    //       notification = {
    //         type: 'ligne_accepted',
    //         title: '✅ Ligne validée',
    //         message: `Votre ligne "${updateLigne?.nom}" a été acceptée et est maintenant active.`,
    //         ligne: {
    //           id: updateLigne?.id,
    //           nom_ligne: updateLigne?.nom,  // ✅ Changé de "nom" à "nom_ligne"
    //           district: updateLigne?.district,
    //         },
    //         createdAt: new Date().toISOString(),
    //       };
    //     } else if (newStatus === StatutLigne.Attent) {
    //       notification = {
    //         type: 'ligne_rejected',
    //         title: '❌ Ligne désactivée',
    //         message: `Votre ligne "${updateLigne?.nom}" a été désactivée.`,
    //         ligne: {
    //           id: updateLigne?.id,
    //           nom_ligne: updateLigne?.nom,  // ✅ Changé ici aussi
    //           district: updateLigne?.district,
    //         },
    //         createdAt: new Date().toISOString(),
    //       };
    //     }
    //     // ⚠️ LOGS CRITIQUES ICI
    //     if (notification && ligne_avant_maj?.firebase_uid) {
    //       console.log("📤 Tentative d'envoi notification:");
    //       console.log("   → Firebase UID:", ligne_avant_maj.firebase_uid);
    //       console.log("   → Notification:", JSON.stringify(notification, null, 2));
    //       const sent = sendNotificationToUser(ligne_avant_maj.firebase_uid, notification);
    //       console.log(`   → Notification ${sent ? '✅ ENVOYÉE' : '❌ NON ENVOYÉE'}`);
    //     } else {
    //       console.log("⚠️ Notification NON envoyée:");
    //       console.log("   → notification existe?", !!notification);
    //       console.log("   → firebase_uid existe?", !!ligne_avant_maj?.firebase_uid);
    //     }
    //     res.status(200).json({
    //       message: "Ligne mise à jour avec succès",
    //       updateLigne
    //     });
    //   } catch (error) {
    //     console.error('❌ Erreur updateStatusLigne:', error);
    //     res.status(500).json({
    //       message: "Erreur lors de la mise à jour de la ligne"
    //     });
    //   }
    // }
    static async updateStatusLigne(req, res) {
        try {
            const id = Number(req.params.id);
            const updateLigne = await ligneService.updateStatusLigne(id, req.body);
            res.status(200).json({ message: "ligne mise à jour avec succès", updateLigne });
        }
        catch (error) {
            res.status(500).json({ message: "Erreur lors de la mise à jour de la ligne" });
        }
    }
    /**
     * Deletes a ligne by its ID.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while deleting the ligne.
     */
    static async deleteLigne(req, res) {
        try {
            const id = Number(req.params.id);
            await ligneService.deleteLigne(id);
            res.status(200).json({ message: "Ligne supprimée avec succès" });
        }
        catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression de la ligne" });
        }
    }
}
exports.LigneController = LigneController;
//# sourceMappingURL=ligne.controller.js.map