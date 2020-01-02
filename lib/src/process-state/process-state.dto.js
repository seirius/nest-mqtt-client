"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROCESS_STATE_CHANNEL = {
    sendReport: "process_state:sendReport",
    receiveReport: "process_state:receiveReport",
    askReport: "process_state:askReport",
    onReportQuestion: "process_state:onReportQuestion",
};
var EProcessState;
(function (EProcessState) {
    EProcessState["OK"] = "OK";
    EProcessState["PARTIALLY_OK"] = "PARTIALLY_OK";
    EProcessState["ERROR"] = "ERROR";
    EProcessState["NOT_RESPONDING"] = "NOT_RESPONDING";
})(EProcessState = exports.EProcessState || (exports.EProcessState = {}));
//# sourceMappingURL=process-state.dto.js.map