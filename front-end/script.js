const jsonInput = "json-input";
const classNameInput = "class-name";
const genJson = "gen-json";
const genCPY = "gen-cpy";
const genTS = "gen-ts";


var jsonEditor;
var dartEditor;
let theme = 'dracula';
window.onload = function () {
  jsonEditor = ace.edit("editor");
  jsonEditor.setTheme(`ace/theme/${theme}`);
  jsonEditor.session.setMode("ace/mode/json");
  //
  dartEditor = ace.edit("editor-dart");
  dartEditor.setTheme(`ace/theme/${theme}`);
  dartEditor.setReadOnly(true);
  dartEditor.session.setMode("ace/mode/dart");
  dartEditor.setOptions({ fontFamily: 'Space Mono', fontSize: 14 })
  //
  jsonEditor.setValue(localStorage.getItem(jsonInput), 1)
  // document.getElementById(jsonInput).value = ;
  document.getElementById(classNameInput).value = localStorage.getItem(classNameInput);
  //
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
};

function copyCode() {
  const output = dartEditor.getValue();
  if (output) {
    const cb = navigator.clipboard;
    cb.writeText(output);
  }
}

function doConvert() {
  var className = document.getElementById(classNameInput).value;
  let jsonString = jsonEditor.getValue()
  QuickType.runQuickType(className, jsonString, {
    generateToString: localStorage.getItem(genTS) == "true",
    generateCopyWith: localStorage.getItem(genCPY) == "true",
    generateToJson: localStorage.getItem(genJson) == "true",
  })
    .then((data) => {
      console.log(data);
      localStorage.setItem(classNameInput, className);
      localStorage.setItem(jsonInput, jsonString);
      dartEditor.setValue(data, 1);
    })
    .catch((err) => {
      alert(err);
    });
}
