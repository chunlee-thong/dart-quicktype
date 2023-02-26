const jsonInput = "json-input";
const classNameInput = "class-name";
//

const options = {
  genJson: "gen-json",
  genCPY: "gen-cpy",
  genTS: "gen-ts",
  useDefaultValue: "use-default-value",
  useEquatable: "use-equatable",
  useSerializable: "use-serializable",
  useNum: "use-num",
  genJsonKey: "gen-key",
  genJsonComment: "gen-json-comment",
};

var jsonEditor;
var dartEditor;
let theme = "dracula";

//
window.onload = async function () {
  jsonEditor = ace.edit("json-editor");
  jsonEditor.setTheme(`ace/theme/${theme}`);
  jsonEditor.session.setMode("ace/mode/json");
  //
  dartEditor = ace.edit("dart-editor");
  dartEditor.setTheme(`ace/theme/${theme}`);
  dartEditor.setReadOnly(true);
  dartEditor.session.setMode("ace/mode/dart");
  dartEditor.setOptions({ fontFamily: "Space Mono", fontSize: 14 });
  //
  jsonEditor.setValue(localStorage.getItem(jsonInput) || "", 1);
  document.getElementById(classNameInput).value = localStorage.getItem(classNameInput);
  //
  initSetting();
};

function initSetting() {
  var values = Object.values(options);
  for (var i = 0; i < values.length; ++i) {
    var key = values[i];
    document.getElementById(values[i]).checked = localStorage.getItem(key) == "true";
    document.getElementById(key).addEventListener("change", listener);
  }
}

function listener(event) {
  localStorage.setItem(event.target.id, event.target.checked);
}

function copyCode() {
  const output = dartEditor.getValue();
  if (output) {
    const cb = navigator.clipboard;
    cb.writeText(output);
  }
}

function doConvert() {
  var className = document.getElementById(classNameInput).value;
  let jsonString = jsonEditor.getValue();
  if (!className) {
    alert("Please input class name");
    return;
  }
  if (!jsonString) {
    alert("Please input json string");
    return;
  }
  var keys = Object.values(options);
  QuickType.runQuickType(className, jsonString, {
    generateToJson: isEnable(keys[0]),
    generateCopyWith: isEnable(keys[1]),
    generateToString: isEnable(keys[2]),
    useDefaultValue: isEnable(keys[3]),
    useEquatable: isEnable(keys[4]),
    useSerializable: isEnable(keys[5]),
    useNum: isEnable(keys[6]),
    generateKey: isEnable(keys[7]),
    genJsonComment: isEnable(keys[8]),
  })
    .then((output) => {
      localStorage.setItem(classNameInput, className);
      localStorage.setItem(jsonInput, jsonString);
      dartEditor.setValue(output, 1);
      saveToHistory(className, jsonString);
    })
    .catch((err) => {
      alert(err);
    });
}

function isEnable(key) {
  return localStorage.getItem(key) == "true";
}

function getHistory() {
  let history = localStorage.getItem("history");
  return JSON.parse(history || "{}");
}

export function onSelectHistory(selected) {
  let history = getHistory();
  let data = history[selected];
  jsonEditor.setValue(data.jsonString, 1);
  document.getElementById(classNameInput).value = data.className;
}

function saveToHistory(className, jsonString) {
  let history = getHistory();
  history[className] = { className, jsonString };
  localStorage.setItem("history", JSON.stringify(history));
  initHistory();
}

window.doConvert = doConvert;
window.copyCode = copyCode;

function testCreateHistory() {
  for (var i = 0; i < 19; i++) {
    saveToHistory(`M${i}`, `{"name":"Model${i}"}`);
  }
}
