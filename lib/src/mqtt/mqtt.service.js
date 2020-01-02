"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MqttService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const mqtt_1 = require("mqtt");
const MqttConfig_1 = require("./../config/MqttConfig");
let MqttService = MqttService_1 = class MqttService {
    constructor() {
        this.logger = new common_1.Logger(MqttService_1.name);
        this.connected = false;
        this.subscriptions = {};
        this.warnedAboutConnection = false;
        this.mqttClient = mqtt_1.connect(MqttConfig_1.MqttConfig.HOST);
        this.mqttClient.on("connect", () => {
            this.connected = true;
            this.mqttClient.on("message", (topic, message) => {
                if (topic in this.subscriptions) {
                    this.subscriptions[topic].forEach((callback) => callback(JSON.parse(message.toString())));
                }
            });
        });
    }
    push({ channel, payload }) {
        if (!this.connected) {
            if (!this.warnedAboutConnection) {
                this.warnedAboutConnection = true;
                this.logger.warn("Make sure mqtt client is connected before anything");
            }
            return;
        }
        if (!payload) {
            payload = {};
        }
        this.mqttClient.publish(channel, JSON.stringify(payload));
    }
    sub({ channel, callback }) {
        if (channel in this.subscriptions) {
            this.subscriptions[channel].push(callback);
        }
        else {
            this.mqttClient.subscribe(channel);
            this.subscriptions[channel] = [callback];
        }
    }
    isConnected() {
        return this.connected;
    }
};
MqttService = MqttService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], MqttService);
exports.MqttService = MqttService;
//# sourceMappingURL=mqtt.service.js.map