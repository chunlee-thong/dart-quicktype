import * as fs from "fs";
import { runQuickType } from "../index";

async function test() {
  const jsonString = await fs.readFileSync("dart-json.json", "utf8");
  const result = await runQuickType("MyClass", jsonString, {
    generateToString: true,
    generateCopyWith: true,
    generateToJson: true,
    useDefaultValue: false,
    useSerializable: false,
    useEquatable: true,
  });
  fs.writeFileSync("dart-result/lib/output.dart", result);

  const result2 = await runQuickType("MyClass", jsonString, {
    generateToString: true,
    generateCopyWith: false,
    generateToJson: true,
    useDefaultValue: false,
    useSerializable: true,
    useEquatable: false,
  });
  fs.writeFileSync("dart-result/lib/output_serialization.dart", result2);

}

test();
