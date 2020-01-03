export const PROCESS_STATE_CHANNEL = {
    processReport: "processReport",
    reportQuestion: "reportQuestion",
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
