"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runQuickType = void 0;
const quicktype_core_1 = require("quicktype-core");
const custom_dart_renderer_1 = require("./custom_dart_renderer");
//import { DartTargetLanguage } from "./quick_type_dart";
function quicktypeJSON(className, jsonString) {
    return __awaiter(this, void 0, void 0, function* () {
        const jsonInput = quicktype_core_1.jsonInputForTargetLanguage("dart");
        yield jsonInput.addSource({
            name: className,
            samples: [jsonString],
        });
        const inputData = new quicktype_core_1.InputData();
        inputData.addInput(jsonInput);
        const lang = new custom_dart_renderer_1.CustomDartTargetLanguage();
        return yield quicktype_core_1.quicktype({
            lang,
            inputData,
            allPropertiesOptional: true,
        });
    });
}
function runQuickType(className, jsonString) {
    return __awaiter(this, void 0, void 0, function* () {
        const { lines: result } = yield quicktypeJSON(className, jsonString);
        return result.join("\n");
    });
}
exports.runQuickType = runQuickType;
