///選手取得資料
// routes/races.js
const express = require('express');
const router = express.Router();
const rankingService = require('../services/rankingService');
const mongoose = require('mongoose');
const Race = require('../models/races');
// 建立新賽事 (POST /api/races)
router.post('/', async (req, res) => {
    try {
        const newRace = new Race(req.body);
        const savedRace = await newRace.save();
        res.status(201).json(savedRace);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 取得所有賽事 (GET /api/races)
router.get('/', async (req, res) => {
    try {
        const races = await Race.find();
        res.json(races);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 獲取特定賽事 (GET /api/races/:id)
router.get('/:id', getRace, (req, res) => {
    res.json(res.race);
});

// Middleware 函數，用於根據 ID 獲取賽事
async function getRace(req, res, next) {
    let race;
    try {
        race = await Race.findById(req.params.id);
        if (race == null) {
            return res.status(404).json({ message: 'Cannot find race' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.race = race;
    next();
}

// 取得特定賽事的排名 (GET /api/races/:id/rankings)
router.get('/:id/rankings', async (req, res) => {
    try {
        const raceId = req.params.id;
        const result = await rankingService.getRankings(raceId); // 獲取包含排名數據和 HTML 的物件
        res.json(result); // 將整個物件發送到前端
        // 或者只發送 HTML： res.send(result.htmlTable);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 計算特定賽事的比賽用時 (POST /api/races/:id/calculate-durations)
router.post('/:id/calculate-durations', async (req, res) => {
    try {
        const raceId = req.params.id; //  <-- This is where raceId is extracted
        console.log("raceId from req.params.id:", raceId); // Keep this log!

        // Validate raceId
        if (!mongoose.Types.ObjectId.isValid(raceId)) {
            return res.status(400).json({ message: 'Invalid raceId' });
        }

        await rankingService.calculateDurations(raceId); // Pass raceId as an argument
        res.status(200).json({ message: 'Durations calculated successfully.' });
    } catch (err) {
        console.error(`Error calculating durations for raceId: ${req.params.id}`, err); // Add this line for error logging
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;