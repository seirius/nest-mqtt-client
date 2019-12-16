import { Injectable, Logger } from "@nestjs/common";
import { Client, connect } from "mqtt";
import { MqttConfig } from "./../config/MqttConfig";

@Injectable()
export class MqttService {

    private readonly logger = new Logger(MqttService.name);

    private mqttClient: Client;
    private connected = false;
    private subscriptions: ISubscriptions = {};
    private warnedAboutConnection = false;

    constructor() {
        this.mqttClient = connect(MqttConfig.HOST);

        this.mqttClient.on("connect", () => {
            this.connected = true;
            this.mqttClient.on("message", (topic: string, message: Buffer) => {
                if (topic in this.subscriptions) {
                    this.subscriptions[topic].forEach((callback) => callback(JSON.parse(message.toString())));
                }
            });
        });

    }
 
    public push({channel, payload}: IPushOptions): void {
        if (!this.connected) {
            if (!this.warnedAboutConnection) {
                this.warnedAboutConnection = true;
                this.logger.warn("Make sure mqtt client is connected before anything");
            }
            return;
        }
        this.mqttClient.publish(channel, JSON.stringify(payload));
    }

    public sub({channel, callback}: ISubOptions): void {
        if (channel in this.subscriptions) {
            this.subscriptions[channel].push(callback);
        } else {
            this.mqttClient.subscribe(channel);
            this.subscriptions[channel] = [callback];
        }

    }

    public isConnected(): boolean {
        return this.connected;
    }

}

export interface ISubscriptions {
    [key: string]: ISubOptions["callback"][];
}

export interface IPushOptions {
    channel: string;
    payload: Record<string, any>;
}

export interface ISubOptions {
    channel: string;
    callback: (payload: Record<string, any>) => void;
}