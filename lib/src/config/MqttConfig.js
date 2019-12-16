"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const env = __importStar(require("env-var"));
const dotenv_1 = require("dotenv");
dotenv_1.config();
class MqttConfig {
}
exports.MqttConfig = MqttConfig;
MqttConfig.HOST = env.get("MQTT_HOST", "mqtt://localhost").asString();
//# sourceMappingURL=MqttConfig.js.map