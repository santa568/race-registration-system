// mqttClient.js
const mqtt = require('mqtt');
const { EventEmitter } = require('events');

class MqttClient extends EventEmitter {
    constructor() {
        super();
        this.client = mqtt.connect('mqtt://localhost:1883');

        this.client.on('connect', () => {
            console.log('Connected to MQTT Broker');
            this.client.subscribe('chip/data');
        });

        this.client.on('message', (topic, message) => {
            console.log('Received message:', topic, message.toString());
            try {
                const data = JSON.parse(message.toString());
                this.emit('data', data); // 發出 'data' 事件
            } catch (error) {
                console.error('Error parsing MQTT message:', error);
            }
        });

        this.client.on('error', (error) => {
            console.error('MQTT Error:', error);
            this.emit('error', error);
        });
    }

    publish(topic, message) {
        if (this.client.connected) {
            this.client.publish(topic, message);
        } else {
            console.warn('MQTT client not connected, cannot publish.');
        }
    }
}

const client = new MqttClient();
module.exports = client;