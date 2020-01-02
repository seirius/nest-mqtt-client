"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProcessStateModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const process_state_service_1 = require("./process-state.service");
let ProcessStateModule = ProcessStateModule_1 = class ProcessStateModule {
};
ProcessStateModule = ProcessStateModule_1 = __decorate([
    common_1.Module({
        imports: [ProcessStateModule_1],
        providers: [process_state_service_1.ProcessStateService],
        exports: [process_state_service_1.ProcessStateService],
    })
], ProcessStateModule);
exports.ProcessStateModule = ProcessStateModule;
//# sourceMappingURL=process-state.module.js.map