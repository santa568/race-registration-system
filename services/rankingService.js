// services/rankingService.js
const mongoose = require('mongoose');
const RaceRecord = require('../models/raceRecord');
const logger = require('../logger'); // 導入日誌函式庫

async function getRankings(raceId) {
    try {
        if (!mongoose.Types.ObjectId.isValid(raceId)) {
            throw new Error('Invalid raceId');
        }

        const rankings = await RaceRecord.aggregate([
            { $match: { raceId: new mongoose.Types.ObjectId(raceId) } },
            { $sort: { duration: 1 } },
            {
                $group: {
                    _id: '$raceId',
                    records: { $push: '$$ROOT' },
                },
            },
            {
                $unwind: {
                    path: '$records',
                    includeArrayIndex: 'rank',
                },
            },
            {
                $project: {
                    _id: 0,
                    chipId: '$records.chipId',
                    duration: '$records.duration',
                    rank: { $add: ['$rank', 1] },
                },
            },
        ]);

        logger.info(`Rankings for race ${raceId} fetched successfully.`, { raceId, count: rankings.length }); // 記錄 INFO 級別的訊息
        return { rankings: rankings };
    } catch (error) {
        logger.error(`Error getting rankings for race ${raceId}:`, error); // 記錄 ERROR 級別的訊息
        throw error;
    }
}

async function calculateDurations(raceId) {
    try {
        logger.info(`Calculating durations for race ${raceId}...`);

        const records = await RaceRecord.find({ raceId: new mongoose.Types.ObjectId(raceId) });

        logger.debug(`Found ${records.length} records for race ${raceId}.`);

        const groupedRecords = {};
        for (const record of records) {
            if (!groupedRecords[record.chipId]) {
                groupedRecords[record.chipId] = [];
            }
            groupedRecords[record.chipId].push(record);
        }

        for (const chipId in groupedRecords) {
            const chipRecords = groupedRecords[chipId];

            chipRecords.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

            const startTime = chipRecords[0].startTime;
            const endTime = chipRecords[chipRecords.length - 1].endTime;
            const duration = endTime.getTime() - startTime.getTime();

            logger.debug(`Calculated duration for chipId ${chipId}: ${duration} ms`);

            await RaceRecord.updateMany(
                { raceId: new mongoose.Types.ObjectId(raceId), chipId: chipId },
                { $set: { startTime: startTime, endTime: endTime, duration: duration } }
            );
        }

        logger.info(`Durations calculated and updated for race ${raceId}.`);
    } catch (error) {
        logger.error(`Error calculating durations for race ${raceId}:`, error);
        throw error;
    }
}

module.exports = { getRankings, calculateDurations };