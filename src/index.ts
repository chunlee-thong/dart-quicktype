import { InputData, jsonInputForTargetLanguage, quicktype } from "quicktype-core";
import { CustomDartTargetLanguage } from "./custom_dart_renderer";

export type CustomDartOption = {
  generateToString: boolean;
  generateCopyWith: boolean;
  generateToJson: boolean;
  useDefaultValue: boolean;
  useSerializable: boolean;
  useEquatable: boolean;
  useNum: boolean;
  generateKey: boolean;
};

export async function runQuickType(
  className: string,
  jsonString: string,
  dartOptions: CustomDartOption
): Promise<string> {
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
  });
  let data = result.join("\n");

  ///Replace , at the end of toString() generation
  var find = ", '";
  var regex = new RegExp(find, "g");
  data = data.replace(regex, "'");
  return data;
}
