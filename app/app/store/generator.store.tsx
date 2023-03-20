import { toast } from "react-toastify";
import { create } from "zustand";
import { CustomDartOption, runQuickType } from "../generator";
import { History, useHistoryStore } from "./history.store";

interface GeneratorState {
  output: string;
  json: string;
  className: string;
  run: (setting: CustomDartOption) => void;
  init: (value: History) => void;
  update: (data: Partial<GeneratorState>) => void;
}

const useGeneratorStore = create<GeneratorState>((set, get) => ({
  output: "",
  json: "",
  className: "",
  update: (data: Partial<GeneratorState>) => {
    set({
      ...data,
    });
  },
  run: async (setting: CustomDartOption) => {
    try {
      const formatted = JSON.stringify(JSON.parse(get().json), null, "\t");
      const result = await runQuickType(get().className, formatted, setting);
      set({ output: result, json: formatted });
      const history = useHistoryStore.getState();
      history.save({
        className: get().className,
        jsonString: get().json,
        output: result,
      });
    } catch (ex: any) {
      toast(ex.toString(), {
        position: "top-right",
      });
    }
  },
  init: (value: History) => {
    set({
      className: value.className,
      json: value.jsonString,
      output: value.output,
    });
  },
}));

export default useGeneratorStore;
