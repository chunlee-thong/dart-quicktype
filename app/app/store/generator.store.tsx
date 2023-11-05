import { toast } from "react-toastify";
import { create } from "zustand";
import { ClassOption, CustomDartOption, runQuickType } from "../generator";
import { History, useHistoryStore } from "./history.store";

interface GeneratorState {
  output: string;
  json: string;
  className: string;
  classOptions: ClassOption;
  history?: History | null;
  run: (setting: CustomDartOption) => void;
  init: (value: History) => void;
  update: (data: Partial<GeneratorState>) => void;
}

const useGeneratorStore = create<GeneratorState>((set, get) => ({
  output: "",
  json: "",
  className: "",
  classOptions: { ignoreClasses: "", headers: "", classNameReplace: "" },
  update: (data: Partial<GeneratorState>) => {
    set({
      ...data,
    });
  },
  run: async (setting: CustomDartOption) => {
    try {
      const formatted = JSON.stringify(JSON.parse(get().json), null, "\t");
      const result = await runQuickType(get().className, formatted, setting, get().classOptions);
      set({ output: result, json: formatted });
      const history = useHistoryStore.getState();
      const id = get().className === get().history?.className ? get().history?.id : null;
      history.saveHistory({
        id: id,
        className: get().className,
        jsonString: get().json,
        output: result,
        options: get().classOptions,
        active: true,
      });
    } catch (ex: any) {
      console.error(ex.stack);
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
      classOptions: value.options,
      history: value,
    });
  },
}));

export default useGeneratorStore;
