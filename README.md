# 賽事報名與管理系統 (使用 `#` 創建一級標題)

## 專案簡介 (使用 `##` 創建二級標題)

這是一個使用 Node.js (Express)、MongoDB (Mongoose) 和 MQTT 構建的基礎賽事報名與管理系統原型。
主要功能是模擬接收賽事計時晶片的 MQTT 數據，記錄比賽過程，計算完賽時間，並提供一個簡單的網頁來顯示排名結果。
此專案是我學習全端開發、非同步處理、資料庫互動和即時通訊協定 (MQTT) 的實踐。

## 主要功能

* **賽事創建:** 可通過 API 創建新的賽事資訊。
* **MQTT 數據接收:** 透過 MQTT Broker 接收模擬的計時晶片數據 (chipId, timestamp, location)。
* **比賽記錄儲存:** 將接收到的 MQTT 數據儲存到 MongoDB 的 `racerecords` 集合中。
* **比賽用時計算:** 提供 API 端點，根據儲存的時間戳記計算每個參賽者的 `startTime`, `endTime`, 和 `duration`。
* **排名查詢:** 提供 API 端點，根據計算出的 `duration` 查詢並返回賽事排名。
* **前端排名顯示:** 提供一個簡單的 HTML 頁面 (`result.html`)，通過 `Workspace` API 獲取排名數據並動態生成表格顯示。

## 技術棧

* **後端:** Node.js, Express.js
* **資料庫:** MongoDB, Mongoose
* **訊息佇列/即時通訊:** MQTT (使用 Mosquitto Broker 進行本地測試)
* **前端:** HTML, JavaScript (原生 Fetch API, DOM 操作)
* **API 測試工具:** Postman
* **版本控制:** Git, GitHub

## 安裝與設定

1.  **克隆倉庫:**
    ```bash
    git clone [https://github.com/YourUsername/race-registration-system.git](https://github.com/YourUsername/race-registration-system.git)
    cd race-registration-system
    ```
    *(請將 `YourUsername` 替換為您的 GitHub 使用者名稱)*

2.  **安裝依賴:**
    ```bash
    npm install
    ```

3.  **設定環境變數:**
    * 創建一個 `.env` 檔案在專案根目錄。
    * 在 `.env` 檔案中添加您的 MongoDB 連接字串 (例如 MongoDB Atlas):
        ```
        MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-address>/race_registration?retryWrites=true&w=majority
        ```
    * *(可選)* 您也可以在 `.env` 中設定 MQTT Broker 的 URL。

4.  **啟動所需服務:**
    * 確保您的 MongoDB 服務正在運行 (本地或 Atlas)。
    * 確保您的 MQTT Broker (例如 Mosquitto) 正在運行。

5.  **啟動應用程式:**
    ```bash
    node main_server.js
    ```
    * 伺服器預設運行在 `http://localhost:3000`。

## 如何使用/測試

1.  **創建賽事:**
    * 使用 Postman 向 `POST /api/races` 發送請求。
    * 請求 Body (JSON):
        ```json
        {
          "name": "測試賽事",
          "date": "YYYY-MM-DDTHH:mm:ss.sssZ",
          "location": "測試地點"
        }
        ```
    * 記下返回的賽事 `_id`。

2.  **發送 MQTT 數據:**
    * 使用 `mosquitto_pub` 或其他 MQTT 客戶端向 `chip/data` 主題發布模擬的 `RaceRecord` 數據。
    * 確保 JSON 數據中包含正確的 `raceId` (您剛剛創建的賽事 ID) 和變化的 `timestamp`。
    * 範例：
        ```bash
        mosquitto_pub -h localhost -t "chip/data" -m "{\"chipId\": \"chip-001\", \"raceId\": \"YOUR_RACE_ID\", \"timestamp\": \"...\": ...}"
        ```

3.  **計算比賽用時:**
    * 使用 Postman 向 `POST /api/races/YOUR_RACE_ID/calculate-durations` 發送請求 (將 `YOUR_RACE_ID` 替換為實際 ID)。

4.  **查看排名:**
    * 在瀏覽器中打開 `public/result.html`。
    * 確保 URL 中包含 `raceId` 參數，例如：`http://localhost:3000/result.html?raceId=YOUR_RACE_ID`。

## API 端點 (範例)

* `POST /api/races`: 創建賽事
* `GET /api/races/:id/rankings`: 獲取賽事排名
* `POST /api/races/:id/calculate-durations`: 計算比賽用時

## 未來可改進方向

* 完善的使用者註冊/登入系統。
* 加入線上支付功能。
* 更詳細的賽事管理介面。
* 即時排名更新 (使用 WebSocket)。
* 更健壯的錯誤處理和日誌記錄。
* 單元測試和整合測試。

## 授權

(您可以選擇一個開源授權，例如 MIT License)