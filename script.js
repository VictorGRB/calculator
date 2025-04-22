// JavaScript code for the calculator app
// This code handles the calculator's functionality, including basic operations, scientific functions, and history management.
let history = JSON.parse(localStorage.getItem('calculatorHistory')) || [];
function appendValue(value) {
  const display = document.getElementById("display");
  let current = display.value.trim();

  // Prevent multiple decimal points in the same number
  if (value === '.' && current.includes('.')) return;

  // Allow negative sign (-) at the beginning or after an operator (+, -, *, /)
  if (value === '-' && (current === "" || /[+\-*/]$/.test(current))) {
    display.value += value;
    return;
  }

  // Clear error message before appending new input
  const errorMessages = [
    "Error",
    "Invalid operator usage",
    "Starts with operator",
    "Ends with operator",
    "Cannot divide by 0",
    "Empty expression",
    "Invalid expression",
    "Invalid Input",
    "NaN",
    "Imaginary result",
  ];

  if (errorMessages.includes(display.value)) {
    display.value = "";
  }

  // Add the value to the display
  display.value += value;
  display.scrollLeft = display.scrollWidth;
}


function clearDisplay() {
  document.getElementById("display").value = "";
}

function deleteLast() {
  let current = document.getElementById("display").value;
  document.getElementById("display").value = current.slice(0, -1);
}

function showError(message = "Error") {
  const display = document.getElementById("display");
  display.value = message;
  display.classList.add("shake");

  // Auto-scroll to end of long message
  display.scrollLeft = display.scrollWidth;

  // Remove shake animation class after it's done
  setTimeout(() => {
    display.classList.remove("shake");
  }, 300);
}


function calculate() {
  const display = document.getElementById("display");
  let input = display.value.trim();
  const originalInput = input;

  if (!input || /^[+\/*]+$/.test(input)) return;

  // Allow only valid characters (numbers, operators, and scientific functions)
  if (/[^0-9+\-*/(). eMathPIlogqrtinsc]+/.test(input)) {
    showError("Invalid Input");
    return;
  }

  // Preprocess the input to handle cases like 3--1 by replacing -- with +
  input = input.replace(/--/g, '+');

  const sanitized = input.replace(/\s+/g, '');

  // ✅ Disallow invalid operator usage (like ++, ***, etc.)
  if (/(\+{2,}|\/{2,}|\*{3,}|\-{3,})/.test(sanitized)) {
    showError("Invalid operator usage");
    return;
  }

  // ❌ Disallow starting with +, *, /
  if (/^[+*/]/.test(sanitized)) {
    showError("Starts with operator");
    return;
  }

  // Check if the input is specifically "0/0"
  if (input === '0/0') {
    showError("Error"); // Display "Error" for 0/0 case
    return;
  }

  // Try to evaluate the expression
  try {
    const result = new Function('"use strict"; return (' + input + ')')();

    if (result === Infinity || result === -Infinity) {
      showError("Cannot divide by 0");
    } else if (isNaN(result)) {
      showError("Invalid expression");
    } else {
      display.value = result;
      display.scrollLeft = display.scrollWidth;
      addToHistory(originalInput, result);

    }
  } catch (error) {
    showError("Invalid expression");
  }
  const equalsBtn = document.getElementById("equals-btn");

  party.sparkles(equalsBtn, {
    count: 50,
    spread: 30,
    speed: 0.5,
    color: party.Color.fromHex("#66ccff")
  });
}


function appendFunction(func) {
  const display = document.getElementById("display");
  const value = display.value.trim();

  const errors = [
    "Invalid Expression",
    "Cannot divide by 0",
    "Invalid Input",
    "Starts with operator",
    "Ends with operator",
    "Invalid operator usage",
    "NaN",
    "Imaginary result",
  ];

  // Handle "Imaginary result" explicitly since it's a custom error message
  if (display.value === "Imaginary result") {
    display.value = '';  // Clear the display if it's an "Imaginary result"
  }

  // Clear the display if there's an error message (except "Imaginary result")
  if (errors.includes(display.value) && display.value !== "Imaginary result") {
    display.value = '';  // Clear the display if it's a different error message
  }

  // Ensure there's a value to apply a function to
  if (!value || errors.includes(value)) {
    showError("Nothing to apply function to");
    return;
  }

  // Handle the square root function
  if (func === 'Math.sqrt(') {
    const result = parseFloat(value); // Parse the value into a float

    if (isNaN(result)) {
      showError("Invalid Input");
      return; // Exit if the value is not a number
    }

    if (result < 0) {
      // If the result is negative, show the error
      showError("Imaginary result");
      return; // Return immediately to prevent further calculations
    }

    // Perform the square root calculation for non-negative numbers
    display.value = Math.sqrt(result); // Set the result directly to the display
    addToHistory(`Math.sqrt(${result})`, Math.sqrt(result));  // Optionally, add to history

    return; // Exit the function after the result is set
  }

  // If it's not a square root, proceed with other calculations
  try {
    const result = new Function('return ' + value)(); // Evaluate the expression
    let evaluated;

    // Handle other functions
    if (func === '**2') {
      evaluated = result ** 2;
    } else if (func === '**') {
      // For xʸ, allow the user to now enter the exponent
      display.value = result + '**';
      return;
    } else {
      evaluated = new Function('return ' + func + result + ')')();
    }

    // Set the evaluated result to the display
    display.value = evaluated;
    addToHistory(`${func}(${result})`, evaluated);

    display.scrollLeft = display.scrollWidth;

  } catch {
    showError("Invalid Expression");
  }
}

// Function to show error messages
function showError(message) {
  const display = document.getElementById("display");
  display.value = message;
  display.classList.add("shake");

  // Auto-scroll to end of long message
  display.scrollLeft = display.scrollWidth;

  // Remove shake animation class after it's done
  setTimeout(() => {
    display.classList.remove("shake");
  }, 300);
}


function appendPi() {
  const display = document.getElementById("display");
  const current = display.value.trim();

  // Check if the current display is just a number (positive, negative, or decimal)
  if (/^-?\d+(\.\d+)?$/.test(current)) {
    const result = parseFloat(current) * Math.PI;
    display.value = result;
    addToHistory(`${current} × π`, result);
  } else if (!current || /[\+\-\*\/\(]$/.test(current)) {
    display.value += 'Math.PI';
  } else if (/[\d\)]$/.test(current)) {
    display.value += '*Math.PI';
  } else {
    display.value += 'Math.PI';
  }
}

function appendE() {
  const display = document.getElementById("display");
  const current = display.value.trim();

  if (/^-?\d+(\.\d+)?$/.test(current)) {
    const result = parseFloat(current) * Math.E;
    display.value = result;
    addToHistory(`${current} × e`, result);
  } else if (!current || /[\+\-\*\/\(]$/.test(current)) {
    display.value += 'Math.E';
  } else if (/[\d\)]$/.test(current)) {
    display.value += '*Math.E';
  } else {
    display.value += 'Math.E';
  }
}


function addToHistory(input, result) {
  const historyList = document.getElementById("history-list");

  // Push the calculation to the history array
  history.push({ input, result });

  // Save history to localStorage
  localStorage.setItem('calculatorHistory', JSON.stringify(history));

  // Create a new history item
  const historyItem = document.createElement("li");
  historyItem.innerHTML = `${input} = ${result} <span onclick="clearHistoryItem(${history.length - 1})">❌</span>`;
  historyList.appendChild(historyItem);
}

function clearHistoryItem(index) {
  // Remove the history item from the array
  history.splice(index, 1);

  // Save the updated history to localStorage
  localStorage.setItem('calculatorHistory', JSON.stringify(history));

  // Re-render the history list
  renderHistory();
}

function renderHistory() {
  const historyList = document.getElementById("history-list");
  historyList.innerHTML = '';

  // Loop through history and render each item
  history.forEach((item, index) => {
    const historyItem = document.createElement("li");
    historyItem.innerHTML = `${item.input} = ${item.result} <span onclick="clearHistoryItem(${index})">❌</span>`;
    historyList.appendChild(historyItem);
  });
}

function clearHistory() {
  history = []; // Clear the history array

  // Remove history from localStorage
  localStorage.removeItem('calculatorHistory');

  // Re-render the empty history list
  renderHistory();

  // Create a temporary canvas over the history panel
  const panel = document.getElementById('history-panel');
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.pointerEvents = 'none';
  canvas.style.top = panel.offsetTop + 'px';
  canvas.style.left = panel.offsetLeft + 'px';
  canvas.width = panel.offsetWidth;
  canvas.height = panel.offsetHeight;
  canvas.style.zIndex = 9999;
  document.body.appendChild(canvas);

  // Launch confetti from the center of the panel
  const myConfetti = confetti.create(canvas, {
    resize: true,
    useWorker: true
  });

  myConfetti({
    particleCount: 120,
    spread: 70,
    origin: { x: 0.5, y: 0.8 }
  });

  // Remove canvas after animation
  setTimeout(() => {
    canvas.remove();
  }, 1500);
}


window.onload = () => {
  document.body.classList.add('fade-in');
  document.getElementById("clear-history-btn").addEventListener("click", clearHistory);
};

let memory = null;

// Add to memory function
function addToMemory() {
  const val = parseFloat(document.getElementById("display").value);
  if (!isNaN(val)) {
    memory = val;  // Set the memory to the current value
    localStorage.setItem('calculatorMemory', memory); // Store it in localStorage
    updateMemoryDisplay();  // Update the memory display
  }
}

// Recall memory
function recallMemory() {
  let memoryValue = localStorage.getItem('calculatorMemory');

  // If memory is available, append it to the display
  if (memoryValue) {
    let currentDisplay = display.value;

    // Prevent appending if there's a decimal issue
    if (currentDisplay.includes('.') && memoryValue.includes('.')) {
      return;
    }

    display.value = currentDisplay + memoryValue;
  }
}

// Clear memory
function clearMemory() {
  memory = null;
  localStorage.removeItem('calculatorMemory'); // Remove from localStorage
  updateMemoryDisplay();
}

function updateMemoryDisplay() {
  const memoryDisplay = document.getElementById("memory-display");
  const mrBtn = document.getElementById("mr-btn");
  const mcBtn = document.getElementById("mc-btn");

  // Check if memory is in localStorage
  if (localStorage.getItem('calculatorMemory') !== null) {
    memoryDisplay.innerText = "Memory: " + localStorage.getItem('calculatorMemory');
    mrBtn.disabled = false;
    mcBtn.disabled = false;
  } else {
    memoryDisplay.innerText = "Memory: (empty)";
    mrBtn.disabled = true;
    mcBtn.disabled = true;
  }
}

window.onload = () => {
  // Set the initial state of the memory display and buttons
  updateMemoryDisplay();

  // Your other code on load
  document.body.classList.add('fade-in');
  document.getElementById("clear-history-btn").addEventListener("click", clearHistory);
};

document.addEventListener('DOMContentLoaded', () => {
  updateMemoryDisplay();

  renderHistory();
});

function handleSqrtInput() {
  const display = document.getElementById("display");
  let input = display.value.trim();

  // Regular expression to find sqrt(number) patterns
  const sqrtRegex = /sqrt\((-?\d+(\.\d+)?)\)/g;

  // Check if input includes the sqrt pattern
  if (sqrtRegex.test(input)) {
    // Replace all occurrences of sqrt(<number>) with the result of the square root calculation
    input = input.replace(sqrtRegex, (match, numStr) => {
      const num = parseFloat(numStr);  // Extract the number inside the sqrt() function
      if (num < 0) {
        return Math.sqrt(Math.abs(num)) + 'i'; // Return the imaginary result for negative numbers
      } else {
        return Math.sqrt(num); // Return the normal square root for positive numbers
      }
    });

    // Update the display with the new input
    display.value = input;
  }
}

// Call this function every time the user types
document.getElementById("display").addEventListener('input', handleSqrtInput);
document.getElementById("toggle-dark-mode").addEventListener("click", toggleDarkMode);

function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark-mode");

  // Save the current state in localStorage
  if (isDark) {
    localStorage.setItem('darkMode', 'enabled');
  } else {
    localStorage.removeItem('darkMode');
  }
}


// Check if dark mode is enabled in localStorage on page load
window.addEventListener('load', () => {
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');  // Apply dark mode if it's saved
  }
});
