"use client";
import { Accordion, Button, Space, TextInput, Textarea } from "@mantine/core";
import "ace-builds";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/ext-error_marker";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/webpack-resolver";
import AceEditor from "react-ace";

import useGeneratorStore from "../store/generator.store";
import useSettingStore from "../store/setting.store";
import SmTitle from "./sm_title";
import Title from "./title";

const Editor = () => {
  const generator = useGeneratorStore();
  const settingStore = useSettingStore();

  return (
    <div className="h-[88vh] flex flex-col">
      <Title title="Class name" />
      <TextInput
        className="mb-2 font-bold text-white text-2xl"
        size="sm"
        value={generator.className}
        required
        onChange={(event) => generator.update({ className: event.currentTarget.value })}
      />
      <Accordion variant="contained" className="mb-2">
        <Accordion.Item value="options">
          <Accordion.Control p={"sm"}>
            <SmTitle title="Options" />
          </Accordion.Control>
          <Accordion.Panel>
            <TextInput
              className="font-bold text-white text-2xl"
              placeholder="Ignore classes name (separate by comma)"
              size="sm"
              value={generator.classOptions.ignoreClasses}
              required
              onChange={(event) => {
                generator.classOptions.ignoreClasses = event.target.value;
                generator.update({
                  classOptions: generator.classOptions,
                });
              }}
            />
            <Space h={"md"} />
            <Textarea
              className="font-bold text-white text-2xl"
              placeholder="Headers"
              value={generator.classOptions.headers}
              required
              onChange={(event) => {
                generator.classOptions.headers = event.target.value;
                generator.update({
                  classOptions: generator.classOptions,
                });
              }}
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <AceEditor
        className="w-100 flex-grow-1 flex-1"
        mode="json"
        theme="dracula"
        width="100%"
        value={generator.json}
        onChange={(value) => generator.update({ json: value })}
        setOptions={{}}
      />
      <Button
        color="blue"
        fullWidth
        variant="filled"
        className="mt-4 bg-blue-500"
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
