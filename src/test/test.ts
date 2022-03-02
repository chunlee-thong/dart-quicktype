import * as fs from "fs";
import { runQuickType } from "../index";

async function test() {
  const jsonString = await fs.readFileSync("dart-json.json", "utf8");
  const result = await runQuickType("MyClass", jsonString, {
    generateToString: true,
    generateCopyWith: false,
    generateToJson: false,
  });
  fs.writeFileSync("output.dart", result);
}

test();
