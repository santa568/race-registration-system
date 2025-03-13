// logger.js (建立一個單獨的檔案來配置日誌)
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', // 設定預設日誌級別
  format: winston.format.combine(
    winston.format.timestamp(), // 添加時間戳記
    winston.format.json()       // 使用 JSON 格式
  ),
  transports: [
    new winston.transports.Console(), // 輸出到控制台
    new winston.transports.File({ filename: 'combined.log' }), // 輸出到檔案
    new winston.transports.File({ filename: 'error.log', level: 'error' }), // 只記錄錯誤訊息到單獨的檔案
  ],
});

// 如果不在生產環境，則添加更詳細的日誌格式到控制台
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;