const calculator = document.querySelector(".calculator");
const keys = calculator.querySelector(".calculator__keys");
const display = document.querySelector(".calculator__display");
const displayPreview = document.querySelector(".calculator__display-preview");
const historyDisplay = document.getElementById("historyDisplay");

let currentInput = "0";
let previousInput = "";
let operation = null;
let shouldResetDisplay = false;
let lastAnswer = null;

// Вспомогательная функция для отладки
const debugLog = (message, data) => {
  console.log(`[Отладка] ${message}:`, data);
};

const formatNumber = (num) => {
  if (num === undefined || num === null || isNaN(num)) return "0";

  const numStr = num.toString();
  if (numStr.length > 12) {
    const expNum = parseFloat(num).toExponential(8);
    return expNum;
  }
  return numStr;
};

const updateDisplay = () => {
  display.textContent = formatNumber(currentInput);

  if (displayPreview) {
    displayPreview.textContent = formatNumber(currentInput);
  }

  display.classList.add("display-update");
  setTimeout(() => display.classList.remove("display-update"), 150);
};

const updateHistory = () => {
  if (previousInput && operation && !shouldResetDisplay) {
    const opSymbol =
      {
        add: "+",
        subtract: "-",
        multiply: "×",
        divide: "÷",
      }[operation] || "";

    historyDisplay.textContent = `${formatNumber(previousInput)} ${opSymbol}`;
    historyDisplay.classList.add("history-visible");
  } else {
    historyDisplay.textContent = "";
    historyDisplay.classList.remove("history-visible");
  }
};

const calculate = (n1, operator, n2) => {
  const firstNum = parseFloat(n1);
  const secondNum = parseFloat(n2);

  if (isNaN(firstNum) || isNaN(secondNum)) return 0;

  switch (operator) {
    case "add":
      return firstNum + secondNum;
    case "subtract":
      return firstNum - secondNum;
    case "multiply":
      return firstNum * secondNum;
    case "divide":
      if (secondNum === 0) return NaN;
      return firstNum / secondNum;
    default:
      return secondNum;
  }
};

const performCalculation = () => {
  if (!previousInput || !operation) return currentInput;

  const result = calculate(previousInput, operation, currentInput);

  if (isNaN(result) || !isFinite(result)) {
    return "Error";
  }

  lastAnswer = result;
  return result.toString();
};

const handleNumber = (number) => {
  console.log(
    `[Отладка] Ввод числа: ${number}, текущий currentInput: ${currentInput}`
  );

  if (shouldResetDisplay) {
    currentInput = number;
    shouldResetDisplay = false;
  } else {
    currentInput = currentInput === "0" ? number : currentInput + number;
  }
  updateDisplay();
  console.log(`[Отладка] Новый currentInput: ${currentInput}`);
};

const handleDecimal = () => {
  console.log(
    `[Отладка] Ввод десятичной точки, текущий currentInput: ${currentInput}`
  );

  if (shouldResetDisplay) {
    currentInput = "0.";
    shouldResetDisplay = false;
  } else if (!currentInput.includes(".")) {
    currentInput += ".";
  }
  updateDisplay();
  console.log(`[Отладка] После точки: ${currentInput}`);
};

const handleOperator = (op) => {
  console.log(
    `[Отладка] ОПЕРАТОР: currentInput=${currentInput}, op=${op}, previousInput=${previousInput}, operation=${operation}`
  );

  if (previousInput && operation && !shouldResetDisplay) {
    const result = performCalculation();
    console.log(
      `[Вычисление] ${previousInput} ${operation} ${currentInput} = ${result}`
    );

    if (result === "Error") {
      currentInput = "Error";
      updateDisplay();
      resetCalculator();
      return;
    }
    currentInput = result;
    updateDisplay();
    console.log(`[Обновление дисплея] ${currentInput}`);
  }

  previousInput = currentInput;
  operation = op;
  shouldResetDisplay = true;
  updateHistory();
  console.log(
    `[Отладка] СОСТОЯНИЕ ПОСЛЕ ОПЕРАТОРА: previous=${previousInput}, operation=${operation}`
  );
};

const handleClear = () => {
  console.log("[Отладка] ОЧИСТКА (AC)");
  currentInput = "0";
  previousInput = "";
  operation = null;
  shouldResetDisplay = false;
  updateDisplay();
  updateHistory();
};

const handleNegate = () => {
  console.log(`[Отладка] СМЕНА ЗНАКА, текущий: ${currentInput}`);
  const num = parseFloat(currentInput);
  if (!isNaN(num)) {
    currentInput = (-num).toString();
    updateDisplay();
    console.log(`[Отладка] Новый знак: ${currentInput}`);
  }
};

const handlePercent = () => {
  console.log(`[Отладка] ПРОЦЕНТ, текущий: ${currentInput}`);
  const num = parseFloat(currentInput);
  if (!isNaN(num)) {
    currentInput = (num / 100).toString();
    updateDisplay();
    console.log(`[Отладка] После %: ${currentInput}`);
  }
};

const handleCalculate = () => {
  console.log(
    `[Отладка] ВЫЧИСЛЕНИЕ (=), current=${currentInput}, previous=${previousInput}, operation=${operation}`
  );

  if (!previousInput || !operation) return;

  const result = performCalculation();
  console.log(
    `[Вычисление] ${previousInput} ${operation} ${currentInput} = ${result}`
  );

  if (result === "Error") {
    currentInput = "Error";
    updateDisplay();
    resetCalculator();
    return;
  }

  currentInput = result;
  previousInput = "";
  operation = null;
  shouldResetDisplay = true;
  updateDisplay();
  updateHistory();
  console.log(`[Отладка] РЕЗУЛЬТАТ ВЫЧИСЛЕНИЯ: ${currentInput}`);

  const equalBtn = keys.querySelector('[data-action="calculate"]');
  if (equalBtn) {
    equalBtn.classList.add("equal-flash");
    setTimeout(() => equalBtn.classList.remove("equal-flash"), 300);
  }
};

const resetCalculator = () => {
  setTimeout(() => {
    if (currentInput === "Error") {
      console.log("[Отладка] СБРОС ПОСЛЕ ОШИБКИ");
      currentInput = "0";
      previousInput = "";
      operation = null;
      shouldResetDisplay = false;
      updateDisplay();
      updateHistory();
    }
  }, 1500);
};

const getKeyType = (key) => {
  const { action } = key.dataset;
  if (!action) return "number";
  if (
    action === "add" ||
    action === "subtract" ||
    action === "multiply" ||
    action === "divide"
  ) {
    return "operator";
  }
  return action;
};

const playKeyPressAnimation = (key) => {
  key.classList.add("is-pressed");
  setTimeout(() => key.classList.remove("is-pressed"), 150);
};

const handleButtonPress = (key) => {
  playKeyPressAnimation(key);

  const action = key.dataset.action;
  const content = key.textContent;

  if (window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(10);
  }

  if (key.classList.contains("key--number") && !action) {
    handleNumber(content);
  } else if (action === "decimal") {
    handleDecimal();
  } else if (action === "clear") {
    handleClear();
  } else if (action === "negate") {
    handleNegate();
  } else if (action === "percent") {
    handlePercent();
  } else if (action === "calculate") {
    handleCalculate();
  } else if (getKeyType(key) === "operator") {
    handleOperator(action);
  }

  document.querySelectorAll(".key--operator").forEach((op) => {
    if (op.dataset.action === operation && operation) {
      op.classList.add("active-operator");
    } else {
      op.classList.remove("active-operator");
    }
  });
};

const findButtonForKey = (key) => {
  if (/^\d$/.test(key)) {
    return Array.from(keys.querySelectorAll(".key--number")).find(
      (btn) => !btn.dataset.action && btn.textContent === key
    );
  }

  const actionByKey = {
    ".": "decimal",
    ",": "decimal",
    "+": "add",
    "-": "subtract",
    "*": "multiply",
    "/": "divide",
    Enter: "calculate",
    "=": "calculate",
    Escape: "clear",
    Delete: "clear",
    Backspace: "clear",
    "%": "percent",
  };

  const action = actionByKey[key];
  if (!action) return null;

  if (action === "clear" && key === "Backspace") {
    if (!shouldResetDisplay && currentInput.length > 1) {
      currentInput = currentInput.slice(0, -1);
      if (currentInput === "" || currentInput === "-") currentInput = "0";
      updateDisplay();
    } else if (!shouldResetDisplay && currentInput.length === 1) {
      currentInput = "0";
      updateDisplay();
    }
    return null;
  }

  return keys.querySelector(`[data-action="${action}"]`);
};

keys.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  e.preventDefault();
  handleButtonPress(btn);
});

document.addEventListener("keydown", (e) => {
  const button = findButtonForKey(e.key);
  if (!button) return;

  e.preventDefault();
  handleButtonPress(button);
});

console.log("[Отладка] КАЛЬКУЛЯТОР ЗАГРУЖЕН! Начинайте ввод.");
updateDisplay();
updateHistory();
