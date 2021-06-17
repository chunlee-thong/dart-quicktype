import { InputData, jsonInputForTargetLanguage, quicktype } from "quicktype-core";
import { CustomDartTargetLanguage } from "./custom_dart_renderer";
//import { DartTargetLanguage } from "./quick_type_dart";

async function quicktypeJSON(className: string, jsonString: string) {
  const jsonInput = jsonInputForTargetLanguage("dart");
  await jsonInput.addSource({
    name: className,
    samples: [jsonString],
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  const lang = new CustomDartTargetLanguage();

  return await quicktype({
    lang,
    inputData,
    allPropertiesOptional: true,
    inferEnums: false,
  });
}

export async function runQuickType(className: string, jsonString: string): Promise<string> {
  const { lines: result } = await quicktypeJSON(className, jsonString);
  return result.join("\n");
}
