const jsonInput = "json-input";
const classNameInput = "class-name";
//
const genJson = "gen-json";
const genCPY = "gen-cpy";
const genTS = "gen-ts";

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
  var genJsonInput = document.getElementById(genJson);
  var genCpyInput = document.getElementById(genCPY);
  var genTsInput = document.getElementById(genTS);

  genJsonInput.checked = localStorage.getItem(genJson) == "true";
  genCpyInput.checked = localStorage.getItem(genCPY) == "true";
  genTsInput.checked = localStorage.getItem(genTS) == "true";

  genJsonInput.addEventListener("change", function () {
    localStorage.setItem(genJson, this.checked);
  });
  genCpyInput.addEventListener("change", function () {
    localStorage.setItem(genCPY, this.checked);
  });
  genTsInput.addEventListener("change", function () {
    localStorage.setItem(genTS, this.checked);
  });
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
  QuickType.runQuickType(className, jsonString, {
    generateToString: localStorage.getItem(genTS) == "true",
    generateCopyWith: localStorage.getItem(genCPY) == "true",
    generateToJson: localStorage.getItem(genJson) == "true",
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
  let keys = Object.keys(history);
  if (keys.length > 20) {
    delete history[keys[0]];
  }
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
