import { Injectable } from "@nestjs/common";
import { MqttService } from "./../mqtt/mqtt.service";
import { IProcessStateReport, PROCESS_STATE_CHANNEL, IProcessReport, IAskForReport, IReportPetitionPayload } from "./process-state.dto";
import { v4 as uuid } from "uuid";
import { Observable } from "rxjs";

@Injectable()
export class ProcessStateService {

    private petitions: IProcessReport[] = [];

    constructor(
        private mqttService: MqttService,
    ) { }

    setAsReportListener(): void {
        this.mqttService.sub({
            channel: PROCESS_STATE_CHANNEL.receiveReport,
            callback: (payload: IProcessStateReport) => {
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
            channel: PROCESS_STATE_CHANNEL.askReport,
            payload: {
                petitionId,
            },
        });
    }

    sendReport(report: IProcessStateReport): void {
        this.mqttService.push({
            channel: PROCESS_STATE_CHANNEL.sendReport,
            payload: report,
        });
    }

    onReportQuestion(): Observable<IReportPetitionPayload> {
        return new Observable<IReportPetitionPayload>(subscriber => {
            this.mqttService.sub({
                channel: PROCESS_STATE_CHANNEL.onReportQuestion,
                callback: (payload: IReportPetitionPayload) => subscriber.next(payload),
            });
        });
    }

}
