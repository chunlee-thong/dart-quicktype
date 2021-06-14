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

window.onload = function () {
  document.getElementById(jsonInput).value = localStorage.getItem(jsonInput);
  document.getElementById(classNameInput).value = localStorage.getItem(classNameInput);
};

function copyCode() {
  const output = document.getElementById("output").value;
  console.log(output);
  if (output) {
    const cb = navigator.clipboard;
    cb.writeText(output);
  }
}

const doConvert = debounce(function () {
  var className = document.getElementById(classNameInput).value;
  let jsonString = document.getElementById(jsonInput).value;
  QuickType.runQuickType(className, jsonString)
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
