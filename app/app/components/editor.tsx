"use client";
import { Button, TextInput } from "@mantine/core";
import { config } from "ace-builds";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/ext-error_marker";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-dracula";

import AceEditor from "react-ace";
import useGeneratorStore from "../store/generator.store";
import useSettingStore from "../store/setting.store";
import Title from "./title";

const Editor = () => {
  const generator = useGeneratorStore();
  const settingStore = useSettingStore();

  config;

  return (
    <div className="h-[88vh] flex flex-col">
      <Title title="Class name" />
      <TextInput
        className="mb-2 font-bold text-white text-2xl"
        size="sm"
        value={generator.className}
        required
        onChange={(event) => generator.setClassName(event.currentTarget.value)}
      />
      <AceEditor
        className="w-100 flex-grow-1 flex-1"
        mode="json"
        theme="dracula"
        width="100%"
        value={generator.value}
        onChange={(value) => generator.setValue(value)}
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
        onClick={async () => {
          generator.run(settingStore.setting);
        }}>
        Convert
      </Button>
    </div>
  );
};

export default Editor;
