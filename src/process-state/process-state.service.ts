import { Injectable } from "@nestjs/common";
import { MqttService } from "./../mqtt/mqtt.service";
import { IProcessStateReport, PROCESS_STATE_CHANNEL, IProcessReport, IAskForReport } from "./process-state.dto";
import { v4 as uuid } from "uuid";

@Injectable()
export class ProcessStateService {

    private petitions: IProcessReport[] = [];

    constructor(
        private mqttService: MqttService,
    ) {
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
        this.petitions.push({
            id: uuid(),
            reports: [],
            reportQuestion: {
                expect,
                onReport,
                feedbackOnEachReport,
            },
        });
        this.mqttService.push({
            channel: PROCESS_STATE_CHANNEL.askReport,
        });
    }

    sendReport(report: IProcessStateReport): void {
        this.mqttService.push({
            channel: PROCESS_STATE_CHANNEL.sendReport,
            payload: report,
        });
    }

}
