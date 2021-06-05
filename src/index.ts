import * as fs from "fs";
import { InputData, jsonInputForTargetLanguage, quicktype } from "quicktype-core";
import { CustomDartTargetLanguage } from "./custom_dart_renderer";
//import { DartTargetLanguage } from "./quick_type_dart";

async function quicktypeJSON(targetLanguage: string, modelName: string, jsonString: string) {
  const jsonInput = jsonInputForTargetLanguage(targetLanguage);
  await jsonInput.addSource({
    name: modelName,
    samples: [jsonString],
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  const lang = new CustomDartTargetLanguage();
  //const lang = new DartTargetLanguage();

  return await quicktype({
    lang,
    inputData,
    allPropertiesOptional: true,
  });
}

async function main() {
  const jsonString = await fs.readFileSync("dart-json.json", "utf8");
  const { lines: dartConfig } = await quicktypeJSON("dart", "GoGymClass", jsonString);
  fs.writeFileSync("output.dart", dartConfig.join("\n"));
}

main();
