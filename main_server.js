// main_server.js
const express = require('express');
const mongoose = require('mongoose');
const mqttClient = require('./mqttClient');
const RaceRecord = require('./models/raceRecord');
const raceRoutes = require('./routes/races');
const cors = require('cors'); // 導入 cors
const app = express();
// 錯誤處理中介軟體 (必須放在所有路由的後面)
app.use((err, req, res, next) => {
  console.error(err.stack); // 記錄錯誤堆疊追蹤
  res.status(500).json({ message: 'Something went wrong!' });
});
// 連接 MongoDB (移除已棄用的選項)
mongoose.connect('mongodb+srv://luo:wayne3636@luo.voiqw.mongodb.net/?retryWrites=true&w=majority&appName=luo')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// 使用 JSON 中介軟體
app.use(express.json());

// 跨域請求
app.use(cors());

const logger = require('./logger'); // 導入 logger 實例

// ...

try {
  // ...
} catch (error) {
  logger.error('An error occurred:', error); // 使用 logger 記錄錯誤
}

logger.info('Server started on port 3000');
logger.warn('Low disk space');

// 使用賽事路由
app.use('/api/races', raceRoutes);
///為了連結網站加的
app.use(express.static('public'));
// 處理 MQTT 訊息
mqttClient.on('data', async (data) => {
    try {
        data.raceId = new mongoose.Types.ObjectId(data.raceId);
        const newRecord = new RaceRecord(data);
        await newRecord.save();
        console.log('Race record saved:', newRecord);
    } catch (error) {
        console.error('Error saving race record:', error);
    }
});
app.get('/', (req, res) => {
  res.send('<h1>歡迎來到我的網站！</h1>'); // 發送一段 HTML
  // 或者：
  // res.sendFile(__dirname + '/public/index.html'); // 發送一個 HTML 檔案
});

/*
setInterval(() => {   ///測試指令
  const simulatedData = {
    chipId: 'test-chip-' + Math.floor(Math.random() * 1000), // 產生隨機 chipId
    timestamp: new Date().toISOString(),
    location: {
      latitude: 25.034 + (Math.random() - 0.5) * 0.01, // 稍微隨機化緯度
      longitude: 121.564 + (Math.random() - 0.5) * 0.01, // 稍微隨機化經度
    },
    speed: Math.random() * 10, // 模擬速度
  };

  mqttClient.publish('chip/data', JSON.stringify(simulatedData));
  console.log('Sent simulated data:', simulatedData);
}, 5000); // 每 5 秒發送一次

*/
// 啟動伺服器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


