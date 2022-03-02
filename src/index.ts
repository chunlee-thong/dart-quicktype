import { InputData, jsonInputForTargetLanguage, quicktype } from "quicktype-core";
import { CustomDartTargetLanguage } from "./custom_dart_renderer";
//import { DartTargetLanguage } from "./quick_type_dart";


export type CustomDartOption = {
  generateToString: boolean,
  generateCopyWith: boolean,
  generateToJson: boolean,
}

export async function runQuickType(className: string, jsonString: string, dartOptions: CustomDartOption): Promise<string> {
  const jsonInput = jsonInputForTargetLanguage("dart");
  await jsonInput.addSource({
    name: className,
    samples: [jsonString],
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  const dartLang = new CustomDartTargetLanguage(dartOptions);
  const { lines: result } = await quicktype({
    lang: dartLang,
    inputData,
    allPropertiesOptional: true,
    inferEnums: false,
  })
  return result.join("\n");
}
