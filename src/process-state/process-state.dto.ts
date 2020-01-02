export const PROCESS_STATE_CHANNEL = {
    sendReport: "process_state:sendReport",
    receiveReport: "process_state:receiveReport",
    askReport: "process_state:askReport",
    onReportQuestion: "process_state:onReportQuestion",
};

export interface IProcessExpectation {
    name: string;
    times: number;
}

export interface IProcessReport {
    id: string;
    reports: IProcessStateReport[];
    reportQuestion: IAskForReport;
}

export enum EProcessState {
    OK = "OK",
    PARTIALLY_OK = "PARTIALLY_OK",
    ERROR = "ERROR",
    NOT_RESPONDING = "NOT_RESPONDING",
}

export interface IProcessStateReport {
    name: string;
    state: EProcessState;
    info?: Record<string, any>;
    petitionId: string;
}

export interface IAskForReport {
    expect?: IProcessExpectation[];
    onReport: (reports: IProcessStateReport[]) => void;
    feedbackOnEachReport?: boolean;
}

export interface IReportPetitionPayload {
    petitionId: string;
}
