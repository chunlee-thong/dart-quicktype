// import express from "express";
import { InputData, jsonInputForTargetLanguage, quicktype } from "quicktype-core";
import { CustomDartTargetLanguage } from "./custom_dart_renderer";

// const app = express();
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

export type CustomDartOption = {
  generateToString: boolean;
  generateCopyWith: boolean;
  generateToJson: boolean;
  useDefaultValue: boolean;
  useSerializable: boolean;
  useEquatable: boolean;
  useNum: boolean;
  generateKey: boolean;
  generateJsonComment: boolean;
};

export type ClassOption = {
  ignoreClasses: string | undefined;
  headers: string | undefined;
  classNameReplace: string | undefined;
};

export async function runQuickType(
  className: string,
  jsonString: string,
  dartOptions: CustomDartOption,
  classOptions: ClassOption
): Promise<string> {
  const jsonInput = jsonInputForTargetLanguage("dart");
  await jsonInput.addSource({
    name: className,
    samples: [jsonString],
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  const dartLang = new CustomDartTargetLanguage(dartOptions, classOptions);
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
  //
  if (dartOptions.generateJsonComment) {
    data = data + "\n/*\n" + jsonString + "*/";
  }
  return data;
}

// app.post("/api/generate", async (req, res) => {
//   try {
//     const { class_name, json_string, option } = req.body;
//     var options =
//       option ??
//       <CustomDartOption>{
//         generateToString: false,
//         generateCopyWith: true,
//         generateToJson: true,
//         useDefaultValue: true,
//         useSerializable: false,
//         useEquatable: false,
//         useNum: true,
//         generateKey: true,
//         generateJsonComment: true,
//       };
//     var result = await runQuickType(class_name, json_string, options);
//     return res.status(200).json({ data: result });
//   } catch (ex: any) {
//     return res.status(400).json({ error: ex.toString() });
//   }
// });

// app.listen(8001, () => console.log("Server is running"));
