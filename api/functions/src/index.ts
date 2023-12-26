import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import cors from "cors";
import {uniqueNamesGenerator, adjectives, colors, animals}
  from "unique-names-generator";

import {items} from "@legion/shared/Items";

admin.initializeApp();
const corsOptions = {origin: true};


async function getUID(request: any) {
  const authToken = request.headers.authorization?.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(authToken);
    return decodedToken.uid;
  } catch (error) {
    return "";
  }
}

export const createUserCharacter = functions.auth.user().onCreate((user) => {
  logger.info("Creating character for user:", user.uid);
  const db = admin.firestore();

  // Define the character data structure
  const playerData = {
    name: uniqueNamesGenerator({dictionaries: [adjectives, colors, animals]}),
    gold: 100,
    inventory: [0, 0, 0, 1, 1, 2, 3, 3],
    elo: 100,
    wins: 0,
    losses: 0,
    crowd: 3,
  };

  return db.collection("players").doc(user.uid).set(playerData)
    .then(() => {
      logger.info("New player created for user:", user.uid);
    })
    .catch((error) => {
      logger.info("Error creating player:", error);
    });
});

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!!!");
});

export const inventoryData = onRequest((request, response) => {
  logger.info("Fetching inventoryData");
  const db = admin.firestore();

  cors(corsOptions)(request, response, async () => {
    try {
      const uid = await getUID(request);
      const docSnap = await db.collection("players").doc(uid).get();

      if (docSnap.exists) {
        response.send({
          gold: docSnap.data()?.gold,
          inventory: docSnap.data()?.inventory,
        });
      } else {
        response.status(404).send("Not Found: Invalid player ID");
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      response.status(401).send("Unauthorized");
    }
  });
});

export const purchaseItem = onRequest((request, response) => {
  const db = admin.firestore();

  cors(corsOptions)(request, response, async () => {
    try {
      const uid = await getUID(request);
      const docSnap = await db.collection("players").doc(uid).get();

      if (docSnap.exists) {
        let gold = docSnap.data()?.gold;
        console.log(`gold: ${gold}`);
        const itemId = request.body.itemId;
        const nb = request.body.quantity;
        const itemPrice = items[itemId].price;
        const totalPrice = itemPrice * nb;
        console.log(`Total price for ${nb} items: ${totalPrice}`);
        if (gold < totalPrice) {
          response.status(500).send("Insufficient gold");
        }

        const inventory = docSnap.data()?.inventory;
        inventory.push(request.body.itemId);
        gold -= totalPrice;
        await db.collection("players").doc(uid).update({
          gold,
          inventory,
        });
        response.send({
          gold,
          inventory,
        });
      } else {
        response.status(404).send("Not Found: Invalid player ID");
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      response.status(401).send("Unauthorized");
    }
  });
});

export const fetchLeaderboard = onRequest((request, response) => {
  logger.info("Fetching leaderboard");
  const db = admin.firestore();

  cors(corsOptions)(request, response, async () => {
    try {
      const docSnap = await db.collection("players").get();
      const players = docSnap.docs.map((doc) => doc.data());
      const sortedPlayers = players.sort((a, b) => b.elo - a.elo);
      const leaderboard = sortedPlayers.map((player, index) => {
        const denominator = player.wins + player.losses;
        let winsRatio = 0;
        if (denominator === 0) {
          winsRatio = 0;
        } else {
          winsRatio = Math.round((player.wins/denominator));
        }
        return {
          rank: index + 1,
          player: player.name,
          elo: player.elo,
          wins: player.wins,
          losses: player.losses,
          winsRatio: winsRatio*100 + "%",
          crowdScore: player.crowd,
        };
      });
      response.send(leaderboard);
    } catch (error) {
      console.error("Error verifying token:", error);
      response.status(401).send("Unauthorized");
    }
  });
});