import * as fs from "fs";
import { runQuickType } from ".";

async function test() {
  const jsonString = await fs.readFileSync("../dart-json.json", "utf8");
  const result = await runQuickType("MyClass", jsonString, {
    generateToString: true,
    generateCopyWith: true,
    generateToJson: true,
    useDefaultValue: true,
    useSerializable: false,
    useEquatable: false,
    useNum: true,
    generateKey: true,
    generateJsonComment: true,
  });
  fs.writeFileSync("../dart-result/lib/output.dart", result);

  const result2 = await runQuickType("MyClass", jsonString, {
    generateToString: true,
    generateCopyWith: false,
    generateToJson: true,
    useDefaultValue: false,
    useSerializable: true,
    useEquatable: false,
    useNum: true,
    generateKey: false,
    generateJsonComment: false,
  });
  fs.writeFileSync("dart-result/lib/filename.dart", result2);
}

test();
