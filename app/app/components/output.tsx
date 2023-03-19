import { Button } from "@mantine/core";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-dart";
import "ace-builds/src-noconflict/theme-dracula";

import AceEditor from "react-ace";
import useGeneratorStore from "../store/generator.store";
import Title from "./title";

const Output = () => {
  const store = useGeneratorStore();

  return (
    <div className="h-[88vh] flex flex-col">
      <Title title="Output" />
      <AceEditor
        mode="dart"
        theme="dracula"
        width="100%"
        className="flex-grow flex-1"
        value={store.output}
        readOnly
        setOptions={{
          fontFamily: "Space Mono",
          fontSize: 12,
        }}
      />

      <Button
        color="blue"
        fullWidth
        variant="outline"
        className="mt-4 bg-white"
        size="md"
        onClick={() => {
          navigator.clipboard.writeText(store.output);
        }}>
        Copy code
      </Button>
    </div>
  );
};

export default Output;
