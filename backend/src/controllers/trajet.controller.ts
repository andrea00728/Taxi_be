import { Request, Response } from "express";
import { ArretService } from "../services/arret.service.js";
import { LigneService } from "../services/ligne.service.js";

const arretSvc = new ArretService();
const ligneSvc = new LigneService();

interface ArretWithDistance {
  arret: any;
  distance: number;
  index: number; // Ajout pour tracker l'index
}

interface RouteOption {
  type: "direct" | "with_transfer";
  lignes: any[];
  arrets: any[];
  transferCount: number;
  estimatedDistance: number;
  totalDistance: number;
  score: number;
  instructions: string[];
  walkingDistance?: number;
}

export class TrajetController {
  /**
   * Calcule la distance entre deux points GPS avec la formule de Haversine
   */
  private static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // Ajout fonction pour obtenir l'index
  private static getArretIndex(arretId: number, ligneArrets: any[]): number {
    return ligneArrets.findIndex((a: any) => a.id === arretId);
  }

  //  Ajout fonction pour vérifier la direction
 private static isValidDirection(startIndex: number, endIndex: number): boolean {
  // Vérifie que les indices sont valides ET différents
  return startIndex >= 0 && endIndex >= 0 && startIndex !== endIndex;
}

  private static findNearestArret(
    targetLat: number,
    targetLon: number,
    arrets: any[]
  ): ArretWithDistance | null {
    if (!arrets || arrets.length === 0) return null;

    let nearest: ArretWithDistance | null = null;
    let minDistance = Infinity;

    //  Modification pour tracker l'index
    for (let i = 0; i < arrets.length; i++) {
      const arret = arrets[i];
      const lat = parseFloat(arret.latitude);
      const lon = parseFloat(arret.longitude);

      if (isNaN(lat) || isNaN(lon)) continue;

      const distance = this.calculateDistance(targetLat, targetLon, lat, lon);

      if (distance < minDistance) {
        minDistance = distance;
        nearest = { arret, distance, index: i }; //  Ajout de l'index
      }
    }

    return nearest;
  }

  static async search(req: Request, res: Response) {
    const depart = (req.query.depart as string)?.trim() || "";
    const destination = (req.query.destination as string)?.trim() || "";
    const maxTransfers = parseInt(req.query.maxTransfers as string) || 2;
    const maxWalkingDistance = parseInt(req.query.maxWalkingDistance as string) || 500;
    const limit = parseInt(req.query.limit as string) || 5;

    console.log("\n" + "=".repeat(60));
    console.log(" RECHERCHE DE TRAJET");
    console.log("=".repeat(60));
    console.log(` Départ: "${depart}"`);
    console.log(` Destination: "${destination}"`);
    console.log(` Filtres: maxTransfers=${maxTransfers}, maxWalkingDistance=${maxWalkingDistance}m`);

    if (!depart || !destination) {
      return res.status(400).json({
        message: "Départ et destination requis",
        error: "MISSING_PARAMETERS",
      });
    }

    console.log("\n ÉTAPE 1: Recherche des arrêts (recherche floue)");
    const departArrets = await arretSvc.findByName(depart);
    const destArrets = await arretSvc.findByName(destination);

    console.log(`   Arrêts de départ trouvés: ${departArrets.length}`);
    if (departArrets.length > 0) {
      departArrets.forEach((a: any) => {
        console.log(`     - ${a.nom} (ID: ${a.id}, Ligne: ${a.ligne?.nom || "N/A"})`);
      });
    }

    console.log(`   Arrêts de destination trouvés: ${destArrets.length}`);
    if (destArrets.length > 0) {
      destArrets.forEach((a: any) => {
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

    console.log("\n ÉTAPE 2: Chargement des lignes acceptées");
    const allLignes = await ligneSvc.findAllWithArrets();
    const acceptedLignes = allLignes.filter((l: any) => 
      l.statut === "Accepted" && l.arrets && l.arrets.length > 0
    );

    console.log(`   Total lignes acceptées avec arrêts: ${acceptedLignes.length}`);
    acceptedLignes.forEach((l: any) => {
      console.log(`     - ${l.nom}: ${l.arrets.length} arrêt(s)`);
    });

    const routes: RouteOption[] = [];

    console.log("\n ÉTAPE 3: Recherche de routes directes");
    const directRoutes = await TrajetController.findDirectRoutes(
      departArrets,
      destArrets,
      acceptedLignes //  Passage de allLignes pour vérifier l'ordre
    );
    console.log(`   Routes directes trouvées: ${directRoutes.length}`);
    routes.push(...directRoutes);

    if (maxTransfers > 0) {
      console.log("\n ÉTAPE 4: Recherche de routes avec correspondances");
      const transferRoutes = await TrajetController.findIntelligentTransferRoutes(
        departArrets,
        destArrets,
        acceptedLignes,
        maxWalkingDistance,
        maxTransfers
      );
      console.log(`   Routes avec correspondances trouvées: ${transferRoutes.length}`);
      routes.push(...transferRoutes);
    }

    routes.sort((a, b) => b.score - a.score);
    const topRoutes = routes.slice(0, limit);

    console.log("\n RÉSUMÉ FINAL");
    console.log(`  Total routes trouvées: ${routes.length}`);
    console.log(`  Routes retournées: ${topRoutes.length}`);
    console.log("=".repeat(60) + "\n");

    if (topRoutes.length === 0) {
      return res.status(404).json({
        message: "Aucun trajet trouvé",
        error: "NO_ROUTE_FOUND",
        depart: {
          query: depart,
          arrets: departArrets.map((a: any) => ({ 
            id: a.id, 
            nom: a.nom,
            ligne: a.ligne?.nom || null
          })),
        },
        destination: {
          query: destination,
          arrets: destArrets.map((a: any) => ({ 
            id: a.id, 
            nom: a.nom,
            ligne: a.ligne?.nom || null
          })),
        },
        suggestion:
          "Essayez d'augmenter la distance de marche maximale ou le nombre de correspondances",
        debug: {
          acceptedLignesCount: acceptedLignes.length,
          departArretsCount: departArrets.length,
          destArretsCount: destArrets.length,
          departLignes: departArrets.map((a: any) => a.ligne?.nom).filter(Boolean),
          destLignes: destArrets.map((a: any) => a.ligne?.nom).filter(Boolean),
        },
      });
    }

    res.json({
      depart: {
        query: depart,
        arrets: departArrets.map((a: any) => ({
          id: a.id,
          nom: a.nom,
          latitude: a.latitude,
          longitude: a.longitude,
        })),
      },
      destination: {
        query: destination,
        arrets: destArrets.map((a: any) => ({
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

  private static async findDirectRoutes(
  departArrets: any[],
  destArrets: any[],
  allLignes: any[]
): Promise<RouteOption[]> {
  const routes: RouteOption[] = [];
  const processedPairs = new Set<string>();

  for (const depArret of departArrets) {
    if (!depArret.ligne) {
      console.log(`     "${depArret.nom}" n'a pas de ligne associée`);
      continue;
    }

    for (const destArret of destArrets) {
      if (!destArret.ligne) {
        console.log(`      "${destArret.nom}" n'a pas de ligne associée`);
        continue;
      }

      if (depArret.ligne.id === destArret.ligne.id) {
        const pairKey = `${depArret.id}-${destArret.id}`;
        if (processedPairs.has(pairKey)) continue;
        processedPairs.add(pairKey);

        //  Vérification de l'ordre des arrêts (dans les deux sens)
        const ligneComplete = allLignes.find((l: any) => l.id === depArret.ligne.id);
        if (ligneComplete && ligneComplete.arrets) {
          const departIndex = this.getArretIndex(depArret.id, ligneComplete.arrets);
          const destIndex = this.getArretIndex(destArret.id, ligneComplete.arrets);

          if (!this.isValidDirection(departIndex, destIndex)) {
            console.log(`      Ordre invalide: ${depArret.nom} → ${destArret.nom} (indices: ${departIndex} → ${destIndex})`);
            continue;
          }

          //  Déterminer la direction du trajet
          const direction = departIndex < destIndex ? "aller" : "retour";
          console.log(`     Route directe via ${depArret.ligne.nom} (${direction})`);
        }

        const distance = this.calculateDistance(
          parseFloat(depArret.latitude),
          parseFloat(depArret.longitude),
          parseFloat(destArret.latitude),
          parseFloat(destArret.longitude)
        );

        console.log(`       Distance: ${Math.round(distance)}m`);

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

private static async findIntelligentTransferRoutes(
  departArrets: any[],
  destArrets: any[],
  allLignes: any[],
  maxWalkingDistance: number,
  maxTransfers: number
): Promise<RouteOption[]> {
  const routes: RouteOption[] = [];
  const processedCombinations = new Set<string>();

  for (const depArret of departArrets) {
    if (!depArret.ligne) {
      console.log(`     Arrêt de départ "${depArret.nom}" sans ligne`);
      continue;
    }

    const ligneDepart = depArret.ligne;
    console.log(`\n     Analyse de ${ligneDepart.nom}`);

    const ligneCompletDepart = allLignes.find((l: any) => l.id === ligneDepart.id);
    
    if (!ligneCompletDepart || !ligneCompletDepart.arrets || ligneCompletDepart.arrets.length === 0) {
      console.log(`        ${ligneDepart.nom} n'a pas d'arrêts chargés`);
      continue;
    }

    const arretsLigneDepart = ligneCompletDepart.arrets;
    console.log(`       → ${arretsLigneDepart.length} arrêts disponibles`);

    for (const destArret of destArrets) {
      //  FILTRAGE: Ignorer si destination sur même ligne que départ
      if (destArret.ligne && destArret.ligne.id === ligneDepart.id) {
        console.log(`         Destination sur même ligne (${ligneDepart.nom}), route directe à privilégier`);
        continue;
      }

      const destLat = parseFloat(destArret.latitude);
      const destLon = parseFloat(destArret.longitude);

      if (isNaN(destLat) || isNaN(destLon)) continue;

      let bestTransfer: {
        arretDescente: any;
        ligneCorrespondance: any;
        arretMontee: any;
        arretDestination: any;
        walkDistance: number;
        totalDistance: number;
      } | null = null;

      for (const arretDescente of arretsLigneDepart) {
        //  Ne pas descendre au même arrêt que le départ
        if (arretDescente.id === depArret.id) {
          continue;
        }

        const descenteLat = parseFloat(arretDescente.latitude);
        const descenteLon = parseFloat(arretDescente.longitude);

        if (isNaN(descenteLat) || isNaN(descenteLon)) continue;

        for (const autreLigne of allLignes) {
          if (autreLigne.id === ligneDepart.id) continue;
          if (!autreLigne.arrets || autreLigne.arrets.length === 0) continue;

          const nearestArret = this.findNearestArret(
            descenteLat,
            descenteLon,
            autreLigne.arrets
          );

          if (!nearestArret || nearestArret.distance > maxWalkingDistance) continue;

          const nearestToDest = this.findNearestArret(
            destLat,
            destLon,
            autreLigne.arrets
          );

          if (!nearestToDest) continue;

          //  VALIDATION: Vérifier que montée ≠ destination
          if (nearestArret.index === nearestToDest.index) {
            console.log(`      Arrêt de montée = arrêt de destination sur ${autreLigne.nom}`);
            continue;
          }

          const distanceDepart = this.calculateDistance(
            parseFloat(depArret.latitude),
            parseFloat(depArret.longitude),
            descenteLat,
            descenteLon
          );

          const distanceTransfer = this.calculateDistance(
            parseFloat(nearestArret.arret.latitude),
            parseFloat(nearestArret.arret.longitude),
            parseFloat(nearestToDest.arret.latitude),
            parseFloat(nearestToDest.arret.longitude)
          );

          const walkToDestination = this.calculateDistance(
            parseFloat(nearestToDest.arret.latitude),
            parseFloat(nearestToDest.arret.longitude),
            destLat,
            destLon
          );

          const totalDistance =
            distanceDepart + nearestArret.distance + distanceTransfer + walkToDestination;

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
        const combinationKey = `${depArret.id}-${bestTransfer.arretDescente.id}-${bestTransfer.arretMontee.id}-${destArret.id}`;
        if (processedCombinations.has(combinationKey)) continue;
        processedCombinations.add(combinationKey);

        const score = 80 - bestTransfer.totalDistance / 1000 - bestTransfer.walkDistance / 100;

        console.log(`    Correspondance trouvée: ${ligneDepart.nom} → ${bestTransfer.ligneCorrespondance.nom}`);
        console.log(`       ${depArret.nom} → ${bestTransfer.arretDescente.nom} → ${bestTransfer.arretMontee.nom} → ${bestTransfer.arretDestination.nom}`);
        console.log(`        Distance: ${Math.round(bestTransfer.totalDistance)}m (dont ${Math.round(bestTransfer.walkDistance)}m à pied)`);

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
            `3. 🚶 Marcher ${Math.round(
              this.calculateDistance(
                parseFloat(bestTransfer.arretDescente.latitude),
                parseFloat(bestTransfer.arretDescente.longitude),
                parseFloat(bestTransfer.arretMontee.latitude),
                parseFloat(bestTransfer.arretMontee.longitude)
              )
            )}m jusqu'à "${bestTransfer.arretMontee.nom}"`,
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


  private static async getSuggestions(
    query: string,
    arretSvc: ArretService
  ): Promise<string[]> {
    const allArrets = await arretSvc.getAllArrets();
    
    const normalizedQuery = query.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[''`´]/g, "")
      .toLowerCase()
      .trim();
    
    const suggestions = allArrets
      .filter((a: any) => {
        const normalizedName = a.nom.normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[''`´]/g, "")
          .toLowerCase();
        return normalizedName.includes(normalizedQuery.substring(0, 3));
      })
      .slice(0, 5)
      .map((a: any) => a.nom);

    return suggestions;
  }
}
