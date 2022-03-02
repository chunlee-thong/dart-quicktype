const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const jsonInput = "json-input";
const classNameInput = "class-name";
const genJson = "gen-json";
const genCPY = "gen-cpy";
const genTS = "gen-ts";






window.onload = function () {
  document.getElementById(jsonInput).value = localStorage.getItem(jsonInput);
  document.getElementById(classNameInput).value = localStorage.getItem(classNameInput);
  //
  var genJsonInput = document.getElementById(genJson);
  var genCpyInput = document.getElementById(genCPY);
  var genTsInput = document.getElementById(genTS);

  genJsonInput.checked = localStorage.getItem(genJson) == 'true';
  genCpyInput.checked = localStorage.getItem(genCPY) == 'true';
  genTsInput.checked = localStorage.getItem(genTS) == 'true';

  genJsonInput.addEventListener("change", function () {
    localStorage.setItem(genJson, this.checked);
  })
  genCpyInput.addEventListener("change", function () {
    localStorage.setItem(genCPY, this.checked);
  })
  genTsInput.addEventListener("change", function () {
    localStorage.setItem(genTS, this.checked);
  })
};

function copyCode() {
  const output = document.getElementById("output").value;
  if (output) {
    const cb = navigator.clipboard;
    cb.writeText(output);
  }
}

const doConvert = debounce(function () {
  var className = document.getElementById(classNameInput).value;
  let jsonString = document.getElementById(jsonInput).value;
  QuickType.runQuickType(className, jsonString, {
    generateToString: localStorage.getItem(genTS) == 'true',
    generateCopyWith: localStorage.getItem(genCPY) == 'true',
    generateToJson: localStorage.getItem(genJson) == 'true',
  })
    .then((data) => {
      console.log(data);
      localStorage.setItem(classNameInput, className);
      localStorage.setItem(jsonInput, jsonString);
      document.getElementById("output").innerHTML = data;
      document.getElementById("output").value = data;
    })
    .catch((err) => {
      alert(err);
    });
}, 10);
