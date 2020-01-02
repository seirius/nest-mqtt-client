import { Module } from "@nestjs/common";
import { ProcessStateService } from "./process-state.service";
import { MqttModule } from "../mqtt/mqtt.module";

@Module({
    imports: [MqttModule],
    providers: [ProcessStateService],
    exports: [ProcessStateService],
})
export class ProcessStateModule {}
