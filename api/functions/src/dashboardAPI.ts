import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import admin, {checkAPIKey, corsMiddleware, getUID} from "./APIsetup";

interface RetentionData {
    returningPlayers: number;
    retentionRate: number;
}

interface DashboardData {
    DAU: {
        date: string;
        userCount: number;
    }[];
    totalPlayers: number;
    day1retention: RetentionData;
    day7retention: RetentionData;
    day30retention: RetentionData;
    yesterdayRetention: RetentionData;
    newPlayersPerDay: { [key: string]: number };
    gamesPerModePerDay: GamesPerModePerDay;
    medianGameDuration: number;
}
interface GamesPerModePerDay {
    [date: string]: {
        [mode: string]: number;
    };
}
interface TutorialDropoffStats {
    totalPlayers: number;
    dropoffPoints: {
        [tutorialStep: string]: {
            count: number;
            percentage: number;
        }
    };
    averageLastStep: string;
}

interface PlayerGameHistory {
    gameId: string;
    startDate: Date;
    endDate: Date | null;
    league: string;
    mode: string;
    hasReplay: boolean;
    playerWon: boolean;
    actions: any[];
}

export async function updateDAU(userId: string) {
    const db = admin.firestore();
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    const docRef = db.collection("dailyActiveUsers").doc(today);

    await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(docRef);
        if (!doc.exists) {
            transaction.set(docRef, {users: [userId]});
        } else {
            const docData = doc.data();
            const users = docData && docData.users ? docData.users : [];
            if (!users.includes(userId)) {
                users.push(userId);
                transaction.update(docRef, {users: users});
            }
        }
    });
}


export async function updateDailyVisits(visitorId?: string, referrer?: string, isMobile?: boolean) {
    if (!visitorId) return;
    
    const db = admin.firestore();
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    const docRef = db.collection("dailyVisits").doc(today);

    await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(docRef);
        if (!doc.exists) {
            transaction.set(docRef, {
                visitors: [{
                    id: visitorId,
                    referrer: referrer || null,
                    isMobile: !!isMobile,
                    isDeveloper: referrer?.includes('phaser.io') || false
                }]
            });
        } else {
            const docData = doc.data();
            const visitors = docData && docData.visitors ? docData.visitors : [];
            
            // Check if visitor already exists by ID
            const visitorIndex = visitors.findIndex((v: any) => v.id === visitorId);
            
            if (visitorIndex === -1) {
                // Add new visitor
                visitors.push({
                    id: visitorId,
                    referrer: referrer || null,
                    isMobile: !!isMobile,
                    isDeveloper: referrer?.includes('phaser.io') || false
                });
                transaction.update(docRef, { visitors: visitors });
            }
        }
    });
}


export async function logPlayerAction(playerId: string, actionType: string, details: any) {
    if (!playerId || playerId === '' || playerId === undefined || playerId === null) return;
    console.log(`[logPlayerAction] playerId: ${playerId}, actionType: ${actionType}, details: ${JSON.stringify(details)}`);
    const db = admin.firestore();
    const actionRef = db.collection('players').doc(playerId).collection('actions').doc();
    await actionRef.set({
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        actionType,
        details,
    });
}

export async function logGameAction(gameId: string, playerId: string, actionType: string, details: any) {
    console.log(`Logging game action: ${gameId}, ${playerId}, ${actionType}, ${details}`);
    const db = admin.firestore();

    // Query for the document where the field gameId matches the provided gameId
    const gameQuerySnapshot = await db.collection('games').where('gameId', '==', gameId).limit(1).get();

    if (gameQuerySnapshot.empty) {
        console.error(`No game found with gameId: ${gameId}`);
        return;
    }

    const gameDoc = gameQuerySnapshot.docs[0];
    const actionRef = gameDoc.ref.collection('actions').doc();

    await actionRef.set({
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        playerId,
        actionType,
        details,
    });
}

export const logQueuingActivity = onRequest({ secrets: ["API_KEY"] }, async (request, response) => {
    if (!checkAPIKey(request)) {
        response.status(401).send('Unauthorized');
        return;
    }
    const { playerId, actionType, details } = request.body;
    await logPlayerAction(playerId, actionType, details);
    response.send({status: 0});
});

export const insertGameAction = onRequest({memory: '512MiB'}, async (request, response) => {
    const { gameId, playerId, actionType, details } = request.body;
    await logGameAction(gameId, playerId, actionType, details);
    response.send({status: 0});
});


export const getDashboardData = onRequest(
    { memory: '512MiB' },
    async (request, response) => {
    const db = admin.firestore();

    corsMiddleware(request, response, async () => {
        try {
            const startDate = request.query.startDate;
            const endDate = request.query.endDate;

            const query = db.collection("dailyActiveUsers");
            if (startDate && endDate) {
                query.where(admin.firestore.FieldPath.documentId(), ">=", startDate)
                    .where(admin.firestore.FieldPath.documentId(), "<=", endDate);
            }

            const snapshot = await query.get();
            const data = snapshot.docs.map((doc) => ({
                date: doc.id,
                userCount: doc.data().users.length,
            }));

            const playersSnapshot = await db.collection("players").get();
            const totalPlayers = playersSnapshot.size;

            const calculateRetention = (days: number, totalPlayers: number) => {
                let returningPlayers = 0;

                playersSnapshot.forEach((doc) => {
                    const { joinDate, lastActiveDate } = doc.data();

                    if (joinDate && lastActiveDate) {
                        const joinDateObj = new Date(joinDate);
                        const lastActiveDateObj = new Date(lastActiveDate);

                        if (!isNaN(joinDateObj.getTime()) && !isNaN(lastActiveDateObj.getTime())) {
                            const daysActive = (lastActiveDateObj.getTime() - joinDateObj.getTime()) / (1000 * 60 * 60 * 24);

                            if (daysActive >= days) {
                                returningPlayers++;
                            }
                        }
                    }
                });

                const retentionRate = totalPlayers > 0 ? (returningPlayers / totalPlayers) * 100 : 0;
                return { returningPlayers, retentionRate };
            };

            const calculateInactivePlayers = () => {
                const inactivePlayerIds: string[] = [];

                playersSnapshot.forEach((doc) => {
                    const { joinDate, lastActiveDate } = doc.data();
                    const playerId = doc.id;

                    if (joinDate && lastActiveDate) {
                        const joinDateObj = new Date(joinDate);
                        const lastActiveDateObj = new Date(lastActiveDate);

                        if (!isNaN(joinDateObj.getTime()) && !isNaN(lastActiveDateObj.getTime())) {
                            const daysActive = (lastActiveDateObj.getTime() - joinDateObj.getTime()) / (1000 * 60 * 60 * 24);
                            const now = new Date();
                            const daysSinceLastActive = (now.getTime() - lastActiveDateObj.getTime()) / (1000 * 60 * 60 * 24);

                            if (daysActive > 1 && daysSinceLastActive > 2) {
                                inactivePlayerIds.push(playerId);
                            }
                        }
                    }
                });

                return inactivePlayerIds;
            };

            const day1retention = calculateRetention(1, totalPlayers);
            const day7retention = calculateRetention(7, totalPlayers);
            const day30retention = calculateRetention(30, totalPlayers);
            const yesterdayRetention = calculateRetention(1, totalPlayers);

            const inactivePlayerIds = calculateInactivePlayers();

            const newPlayersPerDay: { [key: string]: number } = {};
            playersSnapshot.forEach((doc) => {
                const { joinDate } = doc.data();
                if (joinDate) {
                    const joinDateStr = new Date(joinDate).toISOString().split('T')[0];
                    if (!newPlayersPerDay[joinDateStr]) {
                        newPlayersPerDay[joinDateStr] = 0;
                    }
                    newPlayersPerDay[joinDateStr]++;
                }
            });

            // Calculate the number of games of each mode per day
            const gamesSnapshot = await db.collection("games").get();
            const gamesPerModePerDay: GamesPerModePerDay = {};
            const gameDurations: number[] = [];
            gamesSnapshot.forEach((doc) => {
                const { date, mode, end } = doc.data();
                if (date) {
                    const dateObj = date.toDate();
                    if (end) {
                        const endObj = end.toDate();
                        const duration = (endObj.getTime() - dateObj.getTime()) / (1000 * 60); // Duration in minutes
                        gameDurations.push(duration);
                    }

                    const dateStr = dateObj.toISOString().split('T')[0];
                    if (!gamesPerModePerDay[dateStr]) {
                        gamesPerModePerDay[dateStr] = {};
                    }
                    if (!gamesPerModePerDay[dateStr][mode]) {
                        gamesPerModePerDay[dateStr][mode] = 0;
                    }
                    gamesPerModePerDay[dateStr][mode]++;
                }
            });

            // Calculate median game duration
            const medianGameDuration = gameDurations.length > 0 ? gameDurations.sort((a, b) => a - b)[Math.floor(gameDurations.length / 2)] : 0;

            response.send({
                DAU: data,
                day1retention,
                day7retention,
                day30retention,
                yesterdayRetention,
                newPlayersPerDay,
                gamesPerModePerDay,
                totalPlayers,
                medianGameDuration,
                inactivePlayerIds,
            });
        } catch (error) {
            console.error("DashboardData error:", error);
            response.status(500).send("Error");
        }
    });
});

export const getActionLog = onRequest(
    { memory: '512MiB' },
    async (request, response) => {
    const db = admin.firestore();

    corsMiddleware(request, response, async () => {
        try {
            const playerId = request.query.playerId;
            if (!playerId) {
                response.status(400).send(" Bad Request: Missing player ID");
                return;
            }

            // Fetch the player's action log
            const actionLogSnapshot = await db.collection("players")
                .doc(playerId.toString()).collection("actions")
                .orderBy("timestamp", "asc").get();
            const actionLog = actionLogSnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));

            // Extract game IDs from the action log
            const gameIdSet = new Set();
            actionLog.forEach((action) => {
                // @ts-ignore
                const details = action.details || {};
                const gameId = details.gameId;
                if (gameId) {
                    gameIdSet.add(gameId);
                }
            });
            const gamesPlayed = Array.from(gameIdSet);

            // Fetch the player's summary data
            const playerDoc = await db.collection("players").doc(playerId.toString()).get();
            if (!playerDoc.exists) {
                response.status(404).send("Player not found");
                return;
            }
            const playerData = playerDoc.data();
            // @ts-ignore
            const { gold, rank, leagueStats, allTimeStats, characters, lossesStreak, engagementStats, joinDate, lastActiveDate } = playerData;

            // Fetch character details
            const characterDetails = [];
            for (const characterRef of characters) {
                const characterDoc = await characterRef.get();
                if (characterDoc.exists) {
                    const characterData = characterDoc.data();
                    characterDetails.push({
                        id: characterDoc.id,
                        level: characterData.level,
                        xp: characterData.xp,
                        sp: characterData.sp,
                        allTimeSP: characterData.allTimeSP,
                        skills: characterData.skills,
                        inventory: characterData.inventory,
                        equipment: characterData.equipment,
                    });
                }
            }

            // Prepare the player summary
            const playerSummary = {
                gold,
                rank: leagueStats.rank,
                allTimeRank: allTimeStats.rank,
                lossesStreak: allTimeStats.lossesStreak,
                characters: characterDetails,
                engagementStats,
                joinDate,
                lastActiveDate,
            };

            // Send the response including joinDate, lastActiveDate, and gamesPlayed
            response.send({
                actionLog,
                playerSummary,
                gamesPlayed,
            });
        } catch (error) {
            console.error("getActionLog error:", error);
            response.status(500).send("Error");
        }
    });
});

export const getGameLog = onRequest(async (request, response) => {
    const db = admin.firestore();

    corsMiddleware(request, response, async () => {
        try {
            const gameId = request.query.gameId;
            if (!gameId) {
                response.status(400).send("Bad Request: Missing game ID");
                return;
            }

            // Query for the document where the field gameId matches the provided gameId
            const gameQuerySnapshot = await db.collection('games').where('gameId', '==', gameId.toString()).limit(1).get();

            if (gameQuerySnapshot.empty) {
                response.status(404).send("Not Found: No game found with the provided game ID");
                return;
            }

            const gameDoc = gameQuerySnapshot.docs[0];
            const snapshot = await gameDoc.ref.collection("actions")
                .orderBy("timestamp", "asc").limit(100).get();

            const data = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));

            response.send(data);
        } catch (error) {
            console.error("getGameLog error:", error);
            response.status(500).send("Error");
        }
    });
});

export const listPlayerIDs = onRequest(
    { memory: '512MiB' },
    async (request, response) => {
    const db = admin.firestore();
    corsMiddleware(request, response, async () => {
        // if (!checkAPIKey(request)) {
        //     response.status(401).send('Unauthorized');
        //     return;
        // }
        // Return a list of all player IDs together with their joinDate
        const snapshot = await db.collection("players").get();
        const players = snapshot.docs.map((doc) => ({
            id: doc.id,
            joinDate: doc.data().joinDate,
        }));
        response.send(players);
    });
});

export const getEngagementMetrics = onRequest({ memory: '512MiB' }, async (request, response) => {
    const db = admin.firestore();

    corsMiddleware(request, response, async () => {
        try {
            const startDate = request.query.date;
            if (!startDate) {
                response.status(400).send("Bad Request: Missing date parameter");
                return;
            }

            // Get players who joined after the start date, grouped by developer/mobile status
            const playersSnapshot = await db.collection("players")
                .where("joinDate", ">=", startDate)
                .get();

            // Filter players by different properties
            const allPlayers = playersSnapshot.docs.filter(doc => !doc.data().is_excluded);
            const newPlayers = allPlayers.filter(doc => doc.data().joinDate >= startDate);
            const developerPlayers = allPlayers.filter(doc => doc.data().is_developer);
            const nonDeveloperPlayers = allPlayers.filter(doc => !doc.data().is_developer);
            const mobilePlayers = allPlayers.filter(doc => doc.data().isMobile);
            const nonMobilePlayers = allPlayers.filter(doc => !doc.data().isMobile);
            
            const activePlayers = await db.collection("players")
                .where("lastActiveDate", ">=", startDate)
                .where("joinDate", "<", startDate)
                .get();
            
            const activePlayersData = activePlayers.docs.filter(doc => !doc.data().is_excluded);

            // For each segment, calculate players who've played games
            const nbGamesThershold = 2; // Tutorial game + one more

            // Get unique visitors since start date with their attributes
            const visitsSnapshot = await db.collection("dailyVisits")
                .where(admin.firestore.FieldPath.documentId(), ">=", startDate)
                .get();

            // Parse visitor data
            const allVisitors = new Set();
            const developerVisitors = new Set();
            const mobileVisitors = new Set();
            
            visitsSnapshot.forEach(doc => {
                const visitors = doc.data().visitors || [];
                visitors.forEach((visitor: any) => {
                    allVisitors.add(visitor.id);
                    if (visitor.isDeveloper) developerVisitors.add(visitor.id);
                    if (visitor.isMobile) mobileVisitors.add(visitor.id);
                });
            });

            // Extract the non-developer and non-mobile visitors
            const nonDeveloperVisitors = new Set([...allVisitors].filter(id => !developerVisitors.has(id)));
            const nonMobileVisitors = new Set([...allVisitors].filter(id => !mobileVisitors.has(id)));

            // Calculate engagement metrics for each segment
            const calculateSegmentMetrics = (players: any[]) => {
                if (players.length === 0) {
                    return {
                        totalPlayers: 0,
                        playedOneGameCount: 0,
                        playedOneGameRate: 0,
                        playedMultipleGamesCount: 0,
                        playedMultipleGamesRate: 0,
                        gameCompletionRate: 0,
                        abandonedFirstGameCount: 0,
                        abandonedFirstGameRate: 0
                    };
                }

                let playedOneGame = 0;
                let playedMultipleGames = 0;
                let totalCompletedGames = 0;
                let totalGamesStarted = 0;
                let abandonedFirstGame = 0;

                for (const playerDoc of players) {
                    const stats = playerDoc.data().engagementStats || {};
                    const completedGames = stats.completedGames || 0;
                    const totalGames = stats.totalGames || 0;
                    
                    if (completedGames >= nbGamesThershold) {
                        playedOneGame++;
                    }
                    if (completedGames > nbGamesThershold) {
                        playedMultipleGames++;
                    }
                    if (totalGames === 1 && completedGames === 0) {
                        abandonedFirstGame++;
                    }
                    
                    totalCompletedGames += completedGames;
                    totalGamesStarted += totalGames;
                }

                return {
                    totalPlayers: players.length,
                    playedOneGameCount: playedOneGame,
                    playedOneGameRate: (playedOneGame / players.length) * 100,
                    playedMultipleGamesCount: playedMultipleGames,
                    playedMultipleGamesRate: (playedMultipleGames / players.length) * 100,
                    gameCompletionRate: totalGamesStarted > 0 ? (totalCompletedGames / totalGamesStarted) * 100 : 0,
                    abandonedFirstGameCount: abandonedFirstGame,
                    abandonedFirstGameRate: (abandonedFirstGame / players.length) * 100
                };
            };

            // Calculate metrics for each segment
            const overallMetrics = calculateSegmentMetrics(allPlayers);
            const developerMetrics = calculateSegmentMetrics(developerPlayers);
            const nonDeveloperMetrics = calculateSegmentMetrics(nonDeveloperPlayers);
            const mobileMetrics = calculateSegmentMetrics(mobilePlayers);
            const nonMobileMetrics = calculateSegmentMetrics(nonMobilePlayers);

            // Calculate conversion rates
            const overallConversionRate = allVisitors.size > 0 ? (newPlayers.length / allVisitors.size) * 100 : 0;
            const developerConversionRate = developerVisitors.size > 0 ? 
                (developerPlayers.length / developerVisitors.size) * 100 : 0;
            const nonDeveloperConversionRate = nonDeveloperVisitors.size > 0 ?
                (nonDeveloperPlayers.length / nonDeveloperVisitors.size) * 100 : 0;
            const mobileConversionRate = mobileVisitors.size > 0 ?
                (mobilePlayers.length / mobileVisitors.size) * 100 : 0;
            const nonMobileConversionRate = nonMobileVisitors.size > 0 ?
                (nonMobilePlayers.length / nonMobileVisitors.size) * 100 : 0;

            // Generate insights
            const insights = [];
            
            if (developerMetrics.playedOneGameRate > nonDeveloperMetrics.playedOneGameRate + 5) {
                insights.push("Developers have a significantly higher rate of playing at least the threshold number of games.");
            }
            
            if (nonDeveloperMetrics.playedOneGameRate > developerMetrics.playedOneGameRate + 5) {
                insights.push("Non-developers have a significantly higher rate of playing at least the threshold number of games.");
            }
            
            if (mobileMetrics.playedOneGameRate > nonMobileMetrics.playedOneGameRate + 5) {
                insights.push("Mobile users have a significantly higher rate of playing at least the threshold number of games.");
            }
            
            if (nonMobileMetrics.playedOneGameRate > mobileMetrics.playedOneGameRate + 5) {
                insights.push("Desktop users have a significantly higher rate of playing at least the threshold number of games.");
            }
            
            if (mobileMetrics.abandonedFirstGameRate > nonMobileMetrics.abandonedFirstGameRate + 5) {
                insights.push("Mobile users abandon their first game at a significantly higher rate.");
            }

            if (nonMobileConversionRate > mobileConversionRate + 5) {
                insights.push("Desktop users convert from visit to player at a higher rate than mobile users.");
            }

            if (mobileConversionRate > nonMobileConversionRate + 5) {
                insights.push("Mobile users convert from visit to player at a higher rate than desktop users.");
            }

            response.send({
                // Visitor metrics
                totalVisitors: allVisitors.size,
                developerVisitors: developerVisitors.size,
                mobileVisitors: mobileVisitors.size,
                
                // Conversion rates
                overallConversionRate,
                developerConversionRate,
                nonDeveloperConversionRate,
                mobileConversionRate,
                nonMobileConversionRate,
                
                // Player counts
                totalNewPlayers: newPlayers.length,
                developerPlayers: developerPlayers.length,
                nonDeveloperPlayers: nonDeveloperPlayers.length,
                mobilePlayers: mobilePlayers.length,
                nonMobilePlayers: nonMobilePlayers.length,
                activePlayers: activePlayersData.length,
                
                // Engagement metrics by segment
                overall: overallMetrics,
                developers: developerMetrics,
                nonDevelopers: nonDeveloperMetrics,
                mobile: mobileMetrics,
                desktop: nonMobileMetrics,
                
                // Insights
                insights,
                
                // IDs for further analysis if needed
                newPlayerIds: newPlayers.map(doc => doc.id),
                activePlayerIds: activePlayersData.map(doc => doc.id)
            });
        } catch (error) {
            console.error("getEngagementMetrics error:", error);
            response.status(500).send("Error calculating engagement metrics");
        }
    });
});

export const getTutorialDropoffStats = onRequest(async (request, response) => {
    const db = admin.firestore();

    corsMiddleware(request, response, async () => {
        try {
            const startDate = request.query.date;
            if (!startDate) {
                response.status(400).send("Bad Request: Missing date parameter");
                return;
            }

            // Get all players who joined after the start date
            const playersSnapshot = await db.collection("players")
                .where("joinDate", ">=", startDate)
                .get();

            const totalPlayers = playersSnapshot.size;
            if (totalPlayers === 0) {
                response.send({
                    totalPlayers: 0,
                    dropoffPoints: {},
                    averageLastStep: "none"
                });
                return;
            }

            // Collect all unique tutorial steps and count occurrences
            const dropoffPoints: { [key: string]: number } = {};
            const stepOrder: string[] = []; // To keep track of step discovery order

            // Process each player
            for (const playerDoc of playersSnapshot.docs) {
                // Get all tutorial actions for this player
                const tutorialActions = await playerDoc.ref
                    .collection("actions")
                    .where("actionType", "==", "tutorial")
                    .orderBy("timestamp", "desc")
                    .limit(1)
                    .get();

                if (!tutorialActions.empty) {
                    const lastAction = tutorialActions.docs[0].data();
                    const lastStep = lastAction.details;
                    
                    if (typeof lastStep === 'string') {
                        // Add step to order list if it's new
                        if (!stepOrder.includes(lastStep)) {
                            stepOrder.push(lastStep);
                        }
                        
                        // Increment count for this step
                        dropoffPoints[lastStep] = (dropoffPoints[lastStep] || 0) + 1;
                    }
                }
            }

            // Calculate percentages and format response
            const stats: TutorialDropoffStats = {
                totalPlayers,
                dropoffPoints: {},
                averageLastStep: "none"
            };

            // Calculate weighted average to find average last step
            let weightedSum = 0;
            stepOrder.forEach((step, index) => {
                const count = dropoffPoints[step] || 0;
                stats.dropoffPoints[step] = {
                    count,
                    percentage: (count / totalPlayers) * 100
                };
                weightedSum += index * count;
            });

            const averageStepIndex = stepOrder.length > 0 ? 
                Math.round(weightedSum / totalPlayers) : -1;
            stats.averageLastStep = averageStepIndex >= 0 ? 
                stepOrder[averageStepIndex] : "none";

            response.send(stats);
        } catch (error) {
            console.error("getTutorialDropoffStats error:", error);
            response.status(500).send("Error calculating tutorial dropoff stats");
        }
    });
});

export const migrateEngagementMetrics = onRequest(async (request, response) => {
    const db = admin.firestore();

    corsMiddleware(request, response, async () => {
        try {
            // Get all players
            const playersSnapshot = await db.collection("players").get();
            const playerIds = playersSnapshot.docs.map(doc => doc.id);
            
            console.log(`Starting migration for ${playerIds.length} players`);
            const results = {
                totalPlayers: playerIds.length,
                updatedPlayers: 0,
                errors: [] as string[]
            };

            // Process players in batches
            const gameBatchSize = 30; // Firestore array-contains-any limit
            const tutorialBatchSize = 500;

            // Process each player
            for (let i = 0; i < playerIds.length; i += tutorialBatchSize) {
                const batchPlayerIds = playerIds.slice(i, i + tutorialBatchSize);
                
                // Create parallel promises for tutorial completion check
                const tutorialQueries = batchPlayerIds.map(playerId =>
                    db.collection("players").doc(playerId)
                        .collection("actions")
                        .where("actionType", "==", "tutorial")
                        .where("details", "==", "coda")
                        .limit(1)
                        .get()
                );

                // Get tutorial completion results
                const tutorialResults = await Promise.all(tutorialQueries);
                const completedTutorials = new Map(
                    tutorialResults.map((result, index) => 
                        [batchPlayerIds[index], !result.empty])
                );

                // Count games per player
                const gamesPerPlayer = new Map<string, number>();
                
                // Process games in sub-batches due to array-contains-any limit
                for (let j = 0; j < batchPlayerIds.length; j += gameBatchSize) {
                    const gamesBatchPlayerIds = batchPlayerIds.slice(j, j + gameBatchSize);
                    const gamesQuery = await db.collection("games")
                        .where("players", "array-contains-any", gamesBatchPlayerIds)
                        .get();

                    // Count games per player
                    gamesQuery.docs.forEach(gameDoc => {
                        const players = gameDoc.data().players || [];
                        players.forEach((playerId: string) => {
                            if (gamesBatchPlayerIds.includes(playerId)) {
                                gamesPerPlayer.set(playerId, (gamesPerPlayer.get(playerId) || 0) + 1);
                            }
                        });
                    });
                }

                // Update each player's engagement metrics
                const updates = batchPlayerIds.map(async (playerId) => {
                    try {
                        const totalGames = gamesPerPlayer.get(playerId) || 0;
                        const completedTutorial = completedTutorials.get(playerId) || false;

                        await db.collection("players").doc(playerId).update({
                            'engagementStats.totalGames': totalGames,
                            'engagementStats.completedTutorial': completedTutorial
                        });

                        results.updatedPlayers++;
                    } catch (error) {
                        results.errors.push(`Error updating player ${playerId}: ${error}`);
                    }
                });

                await Promise.all(updates);
                
                // Log progress
                console.log(`Processed ${Math.min(i + tutorialBatchSize, playerIds.length)} out of ${playerIds.length} players`);
            }

            response.send({
                message: "Migration completed",
                results
            });

        } catch (error) {
            console.error("Migration error:", error);
            response.status(500).send({
                message: "Error during migration",
                // @ts-ignore
                error: error.toString()
            });
        }
    });
});

export const migrateMetricsToStats = onRequest(async (request, response) => {
    const db = admin.firestore();

    corsMiddleware(request, response, async () => {
        try {
            // Get all players that have engagementMetrics
            const playersSnapshot = await db.collection("players")
                .where("engagementMetrics", "!=", null)
                .get();
            
            console.log(`Found ${playersSnapshot.size} players with engagementMetrics`);
            const results = {
                totalPlayers: playersSnapshot.size,
                updatedPlayers: 0,
                errors: [] as string[]
            };

            // Update each player
            const updates = playersSnapshot.docs.map(async (doc) => {
                try {
                    const data = doc.data();
                    if (data.engagementMetrics) {
                        await doc.ref.update({
                            'engagementStats': data.engagementMetrics,
                            'engagementMetrics': admin.firestore.FieldValue.delete()
                        });
                        results.updatedPlayers++;
                    }
                } catch (error) {
                    results.errors.push(`Error updating player ${doc.id}: ${error}`);
                }
            });

            await Promise.all(updates);

            response.send({
                message: "Migration completed",
                results
            });

        } catch (error) {
            console.error("Migration error:", error);
            response.status(500).send({
                message: "Error during migration",
                // @ts-ignore
                error: error.toString()
            });
        }
    });
});

export const getPlayerGameHistory = onRequest(
    { memory: '512MiB' },
    async (request, response) => {
    const db = admin.firestore();

    corsMiddleware(request, response, async () => {
        try {
            const playerId = request.query.playerId;
            if (!playerId) {
                response.status(400).send("Bad Request: Missing player ID");
                return;
            }

            // Query games where the player was a participant
            const gamesSnapshot = await db.collection("games")
                .where("players", "array-contains", playerId.toString())
                .orderBy("date", "desc")
                .get();

            const gameHistories: PlayerGameHistory[] = [];

            // Process each game
            for (const gameDoc of gamesSnapshot.docs) {
                const gameData = gameDoc.data();
                
                // Get actions for this game
                const actionsSnapshot = await gameDoc.ref.collection("actions")
                    .orderBy("timestamp", "asc")
                    .get();
                
                const actions = actionsSnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }));

                gameHistories.push({
                    gameId: gameData.gameId,
                    startDate: gameData.date.toDate(),
                    endDate: gameData.end ? gameData.end.toDate() : null,
                    league: gameData.league || "unknown",
                    mode: gameData.mode,
                    hasReplay: !!gameData.replay,
                    playerWon: gameData.winner === playerId,
                    actions: actions,
                });
            }

            response.send(gameHistories);
        } catch (error) {
            console.error("getPlayerGameHistory error:", error);
            response.status(500).send("Error fetching player game history");
        }
    });
});

export const getActivePlayers = onRequest({ memory: '512MiB' }, async (request, response) => {
    const db = admin.firestore();

    corsMiddleware(request, response, async () => {
        try {
            // Calculate date 1 month ago
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            const oneMonthAgoStr = oneMonthAgo.toISOString();

            // Get players with more than 1 completed game and not active in last month
            const playersSnapshot = await db.collection("players")
                .where("engagementStats.completedGames", ">", 5)
                .where("lastActiveDate", "<", oneMonthAgoStr)
                .get();

            // Filter out contacted players in memory
            const players = playersSnapshot.docs
                .filter(doc => !doc.data().is_contacted) // This will filter out docs where is_contacted is true
                .map(doc => ({
                    id: doc.id,
                    totalGames: doc.data().engagementStats?.completedGames || 0,
                    joinDate: doc.data().joinDate,
                    lastActiveDate: doc.data().lastActiveDate
                }))
                .sort((a, b) => b.totalGames - a.totalGames);

            response.send(players);
        } catch (error) {
            console.error("getActivePlayers error:", error);
            response.status(500).send("Error fetching active players");
        }
    });
});

export const migrateMobileFlag = onRequest({ memory: '512MiB' }, async (request, response) => {
    const db = admin.firestore();

    corsMiddleware(request, response, async () => {
        try {
            // Get all players
            const playersSnapshot = await db.collection("players").get();
            
            // Filter for documents that don't have the isMobile field
            const docsToUpdate = playersSnapshot.docs.filter(doc => 
                !doc.data().hasOwnProperty('isMobile')
            );

            console.log(`Found ${docsToUpdate.length} players without isMobile flag`);
            
            const results = {
                totalPlayers: docsToUpdate.length,
                updatedPlayers: 0,
                mobileUsers: 0,
                errors: [] as string[]
            };

            // Process each player
            const updates = docsToUpdate.map(async (playerDoc) => {
                try {
                    // Check if any action has isMobile: true in details
                    const actionsSnapshot = await playerDoc.ref
                        .collection("actions")
                        .where("details.isMobile", "==", true)
                        .limit(1)
                        .get();

                    const isMobile = !actionsSnapshot.empty;

                    // Update the player document
                    await playerDoc.ref.update({
                        isMobile: isMobile
                    });

                    results.updatedPlayers++;
                    if (isMobile) {
                        results.mobileUsers++;
                    }
                } catch (error) {
                    results.errors.push(`Error updating player ${playerDoc.id}: ${error}`);
                }
            });

            await Promise.all(updates);

            response.send({
                message: "Migration completed",
                results
            });

        } catch (error) {
            console.error("Migration error:", error);
            response.status(500).send({
                message: "Error during migration",
                // @ts-ignore
                error: error.toString()
            });
        }
    });
});

export const getPlayerActionsReport = onRequest({ memory: '512MiB' }, async (request, response) => {
    const db = admin.firestore();

    corsMiddleware(request, response, async () => {
        try {
            const startDate = request.query.date;
            if (!startDate) {
                response.status(400).send("Bad Request: Missing date parameter");
                return;
            }

            // Get all players who joined after the start date and haven't played any games
            const playersSnapshot = await db.collection("players")
                .where("joinDate", ">=", startDate)
                .where("engagementStats.totalGames", "==", 0)
                .get();

            let textLog = `Actions log for players who joined since ${startDate} and haven't played any games\n`;
            textLog += `Total players found: ${playersSnapshot.size}\n\n`;

            // Process each player
            for (const playerDoc of playersSnapshot.docs) {
                const playerData = playerDoc.data();
                textLog += `\n=== Player ${playerDoc.id} ===\n`;
                textLog += `Joined: ${playerData.joinDate}\n`;
                textLog += `Last active: ${playerData.lastActiveDate}\n`;

                // Get all actions for this player
                const actionsSnapshot = await playerDoc.ref
                    .collection("actions")
                    .orderBy("timestamp", "asc")
                    .get();

                if (actionsSnapshot.empty) {
                    textLog += "No actions recorded\n";
                    continue;
                }

                // Process each action
                actionsSnapshot.docs.forEach(actionDoc => {
                    const action = actionDoc.data();
                    const timestamp = action.timestamp?.toDate?.() || 'unknown time';
                    textLog += `\n ${action.actionType}\n`;
                    if (action.details) {
                        textLog += `Details: ${JSON.stringify(action.details, null, 2)}\n`;
                    }
                });

                textLog += "\n---\n";
            }

            // Set content type to text/plain for better browser display
            response.setHeader('Content-Type', 'text/plain');
            response.send(textLog);

        } catch (error) {
            console.error("getPlayerActionsLog error:", error);
            response.status(500).send("Error fetching player actions log");
        }
    });
});

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSpeedForClass(classId: number): number {
    switch (classId) {
        case 0: return getRandomInt(25, 35);
        case 1: return getRandomInt(20, 30);
        case 2: return getRandomInt(15, 25);
        default: return 20; // fallback value
    }
}

export const migrateCharacterSpeed = onRequest({ memory: '512MiB' }, async (request, response) => {
    const db = admin.firestore();

    corsMiddleware(request, response, async () => {
        try {
            const charactersSnapshot = await db.collection("characters").get();
            
            const results = {
                totalCharacters: charactersSnapshot.size,
                updatedCharacters: 0,
                errors: [] as string[]
            };

            const updates = charactersSnapshot.docs.map(async (doc) => {
                try {
                    const data = doc.data();
                    const classId = data.class || 0;

                    const update = {
                        'equipment_bonuses.speed': 0,
                        'sp_bonuses.speed': 0,
                        'stats.speed': getSpeedForClass(classId)
                    };

                    await doc.ref.update(update);
                    results.updatedCharacters++;
                } catch (error) {
                    results.errors.push(`Error updating character ${doc.id}: ${error}`);
                }
            });

            await Promise.all(updates);

            response.send({
                message: "Character speed migration completed",
                results
            });

        } catch (error) {
            console.error("Migration error:", error);
            response.status(500).send({
                message: "Error during character speed migration",
                // @ts-ignore
                error: error.toString()
            });
        }
    });
});

export const markPlayerContacted = onRequest({ memory: '512MiB' }, async (request, response) => {
    const db = admin.firestore();

    corsMiddleware(request, response, async () => {
        try {
            const playerId = request.query.playerId;
            if (!playerId) {
                response.status(400).send("Bad Request: Missing player ID");
                return;
            }

            await db.collection("players").doc(playerId.toString()).update({
                is_contacted: true
            });

            response.send({ status: "success" });
        } catch (error) {
            console.error("markPlayerContacted error:", error);
            response.status(500).send("Error marking player as contacted");
        }
    });
});

export const markPlayerExcluded = onRequest({ memory: '512MiB' }, async (request, response) => {
    const db = admin.firestore();

    corsMiddleware(request, response, async () => {
        try {
            const playerId = request.query.playerId;
            if (!playerId) {
                response.status(400).send("Bad Request: Missing player ID");
                return;
            }

            await db.collection("players").doc(playerId.toString()).update({
                is_excluded: true
            });

            response.send({ status: "success" });
        } catch (error) {
            console.error("markPlayerExcluded error:", error);
            response.status(500).send("Error marking player as excluded");
        }
    });
});

