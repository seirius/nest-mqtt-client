import { MqttService } from "./../mqtt/mqtt.service";
import { IProcessStateReport, IAskForReport } from "./process-state.dto";
export declare class ProcessStateService {
    private mqttService;
    private petitions;
    constructor(mqttService: MqttService);
    askForReport({ expect, onReport, feedbackOnEachReport }: IAskForReport): void;
    sendReport(report: IProcessStateReport): void;
}
