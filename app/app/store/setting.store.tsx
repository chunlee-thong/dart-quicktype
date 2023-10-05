import { logEvent } from "firebase/analytics";
import { create } from "zustand";
import { analytics } from "../firebase";
import { CustomDartOption } from "../generator";

interface SettingType {
  setting: CustomDartOption;
  init: () => void;
  updateValue: (value: CustomDartOption) => void;
}

var defaultSetting: CustomDartOption = {
  generateToString: false,
  generateCopyWith: false,
  generateToJson: false,
  useDefaultValue: false,
  useSerializable: false,
  useEquatable: false,
  useNum: false,
  generateKey: false,
  generateJsonComment: false,
};

const useSettingStore = create<SettingType>((set) => ({
  setting: defaultSetting,
  updateValue: (value: CustomDartOption) => {
    logEvent(analytics, "update_setting", {
      value: value,
    });
    set({ setting: value });
    localStorage.setItem("setting", JSON.stringify(value));
  },
  init: () => {
    var data = localStorage.getItem("setting");
    var json = JSON.parse(data ?? JSON.stringify(defaultSetting));
    set({ setting: json });
  },
}));

export default useSettingStore;
