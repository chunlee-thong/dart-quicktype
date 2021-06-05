"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fs = __importStar(require("fs"));
const quicktype_core_1 = require("quicktype-core");
const custom_dart_renderer_1 = require("./custom_dart_renderer");
//import { DartTargetLanguage } from "./quick_type_dart";
function quicktypeJSON(targetLanguage, modelName, jsonString) {
    return __awaiter(this, void 0, void 0, function* () {
        const jsonInput = quicktype_core_1.jsonInputForTargetLanguage(targetLanguage);
        yield jsonInput.addSource({
            name: modelName,
            samples: [jsonString],
        });
        const inputData = new quicktype_core_1.InputData();
        inputData.addInput(jsonInput);
        const lang = new custom_dart_renderer_1.CustomDartTargetLanguage();
        //const lang = new DartTargetLanguage();
        return yield quicktype_core_1.quicktype({
            lang,
            inputData,
            allPropertiesOptional: true,
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const jsonString = yield fs.readFileSync("dart-json.json", "utf8");
        const { lines: dartConfig } = yield quicktypeJSON("dart", "GoGymClass", jsonString);
        fs.writeFileSync("output.dart", dartConfig.join("\n"));
    });
}
main();
