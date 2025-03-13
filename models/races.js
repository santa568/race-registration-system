///比賽規格
// models/races.js  假設您也需要一個 Race 模型
const mongoose = require('mongoose');

const raceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String },
    // 其他欄位...
});

const Race = mongoose.model('Race', raceSchema);

module.exports = Race;