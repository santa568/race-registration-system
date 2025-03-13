///比賽紀錄規格
// models/raceRecord.js
const mongoose = require('mongoose');

const raceRecordSchema = new mongoose.Schema({
    chipId: { type: String, required: true },
    raceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Race' },
    timestamp: { type: Date, required: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    speed: { type: Number }, // 可選
    startTime: { type: Date },
    endTime: { type: Date },
    duration: { type: Number }
});

raceRecordSchema.index({ raceId: 1, duration: 1 });
const RaceRecord = mongoose.model('RaceRecord', raceRecordSchema);

module.exports = RaceRecord;