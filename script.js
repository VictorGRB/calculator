let history = [];
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
    "Invalid Input"
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

  console.log("Input before processing:", input);

  if (!input || /^[+\/*]+$/.test(input)) return;

  // Allow only valid characters (numbers, operators, and scientific functions)
  if (/[^0-9+\-*/(). eMathPIlogqrtinsc]+/.test(input)) {
    showError("Invalid Input");
    return;
  }

  // Preprocess the input to handle cases like 3--1 by replacing -- with +
  input = input.replace(/--/g, '+');

  const sanitized = input.replace(/\s+/g, '');
  console.log("Sanitized input after handling --:", sanitized);

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
    console.log("Evaluation result:", result);

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
    "Ends with operator"
  ];

  if (!value || errors.includes(value)) {
    showError("Nothing to apply function to");
    return;
  }

  try {
    const result = new Function('return ' + value)();
    let evaluated;

    if (func === '**2') {
      evaluated = result ** 2;
    } else if (func === '**') {
      // For xʸ, allow the user to now enter the exponent
      display.value = result + '**';
      return;
    } else {
      evaluated = new Function('return ' + func + result + ')')();
    }

    display.value = evaluated;
    addToHistory(`${func}(${result})`, evaluated);
      
    display.scrollLeft = display.scrollWidth;
  } catch {
    showError("Invalid Expression");
  }
}

function appendPi() {
  const display = document.getElementById("display");
  const current = display.value.trim();

  // If the current value is just a number, multiply it by Math.PI
  if (/^\d+$/.test(current)) {
    const result = parseFloat(current) * Math.PI;
    display.value = result;
    addToHistory(`${current} × π`, result);  // Update the display with the result
  } else {
    // If there is no number before π, just append Math.PI
    display.value += 'Math.PI';
  }
}

function appendE() {
  const display = document.getElementById("display");
  const current = display.value.trim();

  // If the current value is just a number, multiply it by Math.E
  if (/^\d+$/.test(current)) {
    const result = parseFloat(current) * Math.E;
    display.value = result;  // Update the display with the result
    addToHistory(`${current} × e`, result);
  } else {
    // If there is no number before e, just append Math.E
    display.value += 'Math.E';
  }
}

function addToHistory(input, result) {
  const historyList = document.getElementById("history-list");

  // Push the calculation to the history array
  history.push({ input, result });

  // Create a new history item
  const historyItem = document.createElement("li");
  historyItem.innerHTML = `${input} = ${result} <span onclick="clearHistoryItem(${history.length - 1})">❌</span>`;
  historyList.appendChild(historyItem);
}

function clearHistoryItem(index) {
  // Remove the history item from the array
  history.splice(index, 1);
  
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
  renderHistory(); // Re-render the empty history list

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

function addToMemory() {
  const val = parseFloat(document.getElementById("display").value);
  if (!isNaN(val)) {
    memory = val;  // Set the memory to the current value
    updateMemoryDisplay();  // Update the memory display
  }
}

function recallMemory() {
  const display = document.getElementById("display");
  let memoryValue = memory;

  // If memory is null, do nothing
  if (memoryValue === null) return;

  // Get the current value in the display
  let currentDisplay = display.value;

  // Check if the memory value is a decimal number
  if (memoryValue.toString().includes('.')) {
    // Check if the current display already contains a decimal
    if (currentDisplay.includes('.')) {
      // If both memory value and current display have decimals, don't append the memory value
      return;
    }
  }

  // If no decimal issue, append the memory value
  display.value = currentDisplay + memoryValue;

  // Update memory display after recalling
  updateMemoryDisplay();
}

function clearMemory() {
  memory = null; // Clear the memory
  updateMemoryDisplay(); // Update the memory display to show it's empty
}

function updateMemoryDisplay() {
  const memoryDisplay = document.getElementById("memory-display");
  const mrBtn = document.getElementById("mr-btn");
  const mcBtn = document.getElementById("mc-btn");

  if (memory !== null) {
    memoryDisplay.innerText = "Memory: " + memory; // Display the stored memory
    mrBtn.disabled = false; // Enable MR button
    mcBtn.disabled = false; // Enable MC button
  } else {
    memoryDisplay.innerText = "Memory: (empty)"; // Indicate memory is empty
    mrBtn.disabled = true; // Disable MR button
    mcBtn.disabled = true; // Disable MC button
  }
}

window.onload = () => {
  // Set the initial state of the memory display and buttons
  updateMemoryDisplay();
  
  // Your other code on load
  document.body.classList.add('fade-in');
  document.getElementById("clear-history-btn").addEventListener("click", clearHistory);
};