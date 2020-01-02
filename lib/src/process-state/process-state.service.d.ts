import { MqttService } from "./../mqtt/mqtt.service";
import { IProcessStateReport, IAskForReport, IReportPetitionPayload } from "./process-state.dto";
import { Observable } from "rxjs";
export declare class ProcessStateService {
    private mqttService;
    private petitions;
    constructor(mqttService: MqttService);
    setAsReportListener(): void;
    askForReport({ expect, onReport, feedbackOnEachReport }: IAskForReport): void;
    sendReport(report: IProcessStateReport): void;
    onReportQuestion(): Observable<IReportPetitionPayload>;
}
