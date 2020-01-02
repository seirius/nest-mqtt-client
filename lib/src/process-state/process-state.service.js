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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const mqtt_service_1 = require("./../mqtt/mqtt.service");
const process_state_dto_1 = require("./process-state.dto");
const uuid_1 = require("uuid");
const rxjs_1 = require("rxjs");
let ProcessStateService = class ProcessStateService {
    constructor(mqttService) {
        this.mqttService = mqttService;
        this.petitions = [];
    }
    setAsReportListener() {
        this.mqttService.sub({
            channel: process_state_dto_1.PROCESS_STATE_CHANNEL.receiveReport,
            callback: (payload) => {
                const petition = this.petitions.find(p => p.id === payload.petitionId);
                if (petition) {
                    const { reports, reportQuestion: { expect, onReport, feedbackOnEachReport } } = petition;
                    if (feedbackOnEachReport || !expect || !expect.length) {
                        onReport([payload]);
                    }
                    else if (expect && expect.length) {
                        reports.push(payload);
                        if (expect
                            .every(({ name: exName }) => reports
                            .filter(({ name: rName }) => exName === rName).length === expect.length)) {
                            onReport(reports);
                        }
                    }
                }
            },
        });
    }
    askForReport({ expect, onReport, feedbackOnEachReport }) {
        const petitionId = uuid_1.v4();
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
            channel: process_state_dto_1.PROCESS_STATE_CHANNEL.askReport,
            payload: {
                petitionId,
            },
        });
    }
    sendReport(report) {
        this.mqttService.push({
            channel: process_state_dto_1.PROCESS_STATE_CHANNEL.sendReport,
            payload: report,
        });
    }
    onReportQuestion() {
        return new rxjs_1.Observable(subscriber => {
            this.mqttService.sub({
                channel: process_state_dto_1.PROCESS_STATE_CHANNEL.onReportQuestion,
                callback: (payload) => subscriber.next(payload),
            });
        });
    }
};
ProcessStateService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [mqtt_service_1.MqttService])
], ProcessStateService);
exports.ProcessStateService = ProcessStateService;
//# sourceMappingURL=process-state.service.js.map