import { Module } from "@nestjs/common";
import { ProcessStateService } from "./process-state.service";

@Module({
    imports: [ProcessStateModule],
    providers: [ProcessStateService],
    exports: [ProcessStateService],
})
export class ProcessStateModule {}
