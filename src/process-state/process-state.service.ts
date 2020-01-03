import { Injectable, Logger } from "@nestjs/common";
import { MqttService } from "./../mqtt/mqtt.service";
import { IProcessStateReport, PROCESS_STATE_CHANNEL, IProcessReport, IAskForReport, IReportPetitionPayload } from "./process-state.dto";
import { v4 as uuid } from "uuid";
import { Observable } from "rxjs";

@Injectable()
export class ProcessStateService {

    private readonly logger = new Logger(ProcessStateService.constructor.name);

    private petitions: IProcessReport[] = [];

    constructor(
        private mqttService: MqttService,
    ) { }

    setAsReportListener(): void {
        this.mqttService.sub({
            channel: PROCESS_STATE_CHANNEL.processReport,
            callback: (payload: IProcessStateReport) => {
                this.logger.debug(`incomming process report ${JSON.stringify(payload, null, 2)}`);
                const petition = this.petitions.find(p => p.id === payload.petitionId);
                if (petition) {
                    const {reports, reportQuestion: {expect, onReport, feedbackOnEachReport}} = petition;
                    if (feedbackOnEachReport || !expect || !expect.length) {
                        onReport([payload]);
                    } else if (expect && expect.length) {
                        reports.push(payload);

                        if (expect
                            .every(({name: exName}) => reports
                            .filter(({name: rName}) => exName === rName).length === expect.length) ) {
                            onReport(reports);
                        }
                    }
                }
            },
        });
    }

    askForReport({expect, onReport, feedbackOnEachReport}: IAskForReport): void {
        const petitionId = uuid();
        this.petitions.push({
            id: petitionId,
            reports: [],
            reportQuestion: {
                expect,
                onReport,
                feedbackOnEachReport,
            },
        });
        this.mqttService.push({
            channel: PROCESS_STATE_CHANNEL.reportQuestion,
            payload: {
                petitionId,
            },
        });
    }

    sendReport(report: IProcessStateReport): void {
        this.mqttService.push({
            channel: PROCESS_STATE_CHANNEL.processReport,
            payload: report,
        });
    }

    onReportQuestion(): Observable<IReportPetitionPayload> {
        return new Observable<IReportPetitionPayload>(subscriber => {
            this.mqttService.sub({
                channel: PROCESS_STATE_CHANNEL.reportQuestion,
                callback: (payload: IReportPetitionPayload) => {
                    this.logger.debug(`incomming state request ${JSON.stringify(payload, null, 2)}`);
                    subscriber.next(payload);
                },
            });
        });
    }

}
