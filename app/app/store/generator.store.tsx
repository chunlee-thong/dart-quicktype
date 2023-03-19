import { toast } from "react-toastify";
import { create } from "zustand";
import { CustomDartOption, runQuickType } from "../generator";
import { History, useHistoryStore } from "./history.store";

interface GeneratorState {
  output: string;
  value: string;
  className: string;
  run: (setting: CustomDartOption) => void;
  setValue: (value: string) => void;
  setClassName: (value: string) => void;
  init: (value: History) => void;
}

const useGeneratorStore = create<GeneratorState>((set, get) => ({
  output: "",
  value: "",
  className: "",
  run: async (setting: CustomDartOption) => {
    try {
      const formatted = JSON.stringify(JSON.parse(get().value), null, "\t");
      const result = await runQuickType(get().className, formatted, setting);
      set({ output: result, value: formatted });
      const history = useHistoryStore.getState();
      history.save({
        className: get().className,
        jsonString: get().value,
        output: result,
      });
    } catch (ex: any) {
      toast(ex.toString(), {
        position: "top-right",
      });
    }
  },
  init: (value: History) => {
    get().setClassName(value.className);
    get().setValue(value.jsonString);
  },
  setValue: (value: string) => {
    set({ value: value });
  },
  setClassName: (value: string) => {
    set({ className: value });
  },
}));

export default useGeneratorStore;
