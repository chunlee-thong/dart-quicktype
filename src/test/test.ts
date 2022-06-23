import * as fs from "fs";
import { runQuickType } from "../index";

async function test() {
  const jsonString = await fs.readFileSync("dart-json.json", "utf8");
  const result = await runQuickType("MyClass", jsonString, {
    generateToString: true,
    generateCopyWith: false,
    generateToJson: true,
    useDefaultValue: true,
    useSerializable: false
  });
  fs.writeFileSync("output.dart", result);

  const result2 = await runQuickType("MyClass", jsonString, {
    generateToString: true,
    generateCopyWith: false,
    generateToJson: true,
    useDefaultValue: true,
    useSerializable: true
  });
  fs.writeFileSync("output_serialization.dart", result2);

}

test();
