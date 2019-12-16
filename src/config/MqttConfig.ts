import * as env from 'env-var';
import { config as envConfig } from 'dotenv';
envConfig();

export class MqttConfig {
    public static readonly HOST = env.get("MQTT_HOST", "mqtt://localhost").asString();
}