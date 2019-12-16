export declare class MqttService {
    private readonly logger;
    private mqttClient;
    private connected;
    private subscriptions;
    private warnedAboutConnection;
    constructor();
    push({ channel, payload }: IPushOptions): void;
    sub({ channel, callback }: ISubOptions): void;
    isConnected(): boolean;
}
export interface ISubscriptions {
    [key: string]: ISubOptions["callback"][];
}
export interface IPushOptions {
    channel: string;
    payload: Record<string, any>;
}
export interface ISubOptions {
    channel: string;
    callback: (payload: Record<string, any>) => void;
}
