function appendValue(value) {
  const display = document.getElementById("display");

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

  // Clear error message before appending new input
  if (errorMessages.includes(display.value)) {
    display.value = "";
  }

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
  const input = display.value.trim();

  // ✅ Do nothing if input is empty or only operators
  if (!input || /^[+\-*/]+$/.test(input)) return;

  // ✅ Check for invalid characters
  if (/[^0-9+\-*/(). ]/.test(input)) {
    showError("Invalid Input");
    return;
  }

  // ✅ Check for bad operator usage
  if (/^[+\-*/]/.test(input)) {
    showError("Starts with operator");
    return;
  }
  if (/[+\-*/.]$/.test(input)) {
    showError("Ends with operator");
    return;
  }
  if (/[+\-*/]{2,}/.test(input.replace(/\s+/g, ''))) {
    showError("Invalid operator usage");
    return;
  }

  try {
    const result = new Function('return ' + input)();

    if (result === Infinity || result === -Infinity) {
      showError("Cannot divide by 0");
    } else if (isNaN(result)) {
      showError("Invalid expression");
    } else {
      display.value = result;
      display.scrollLeft = display.scrollWidth;
    }
  } catch (error) {
    showError("Invalid expression");
  }
}
