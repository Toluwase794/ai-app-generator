const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let expression = '';

function updateDisplay() {
  display.textContent = expression || '0';
}

function isOperator(char) {
  return ['+', '-', '*', '/'].includes(char);
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;

    if (button.id === 'clear') {
      expression = '';
      updateDisplay();
      return;
    }

    if (button.id === 'equals') {
      try {
        // Evaluate expression safely
        // Replace multiple operators or trailing operators
        if (expression === '') return;
        if (isOperator(expression.slice(-1))) {
          expression = expression.slice(0, -1);
        }
        // eslint-disable-next-line no-eval
        let result = eval(expression);
        if (result === Infinity || result === -Infinity) {
          expression = 'Error';
        } else if (isNaN(result)) {
          expression = 'Error';
        } else {
          expression = result.toString();
        }
      } catch {
        expression = 'Error';
      }
      updateDisplay();
      return;
    }

    // Prevent two operators in a row
    if (isOperator(value)) {
      if (expression === '' && value !== '-') {
        // Only allow '-' as first char for negative numbers
        return;
      }
      if (isOperator(expression.slice(-1))) {
        expression = expression.slice(0, -1);
      }
    }

    // Append value
    if (expression === 'Error') {
      expression = '';
    }
    expression += value;
    updateDisplay();
  });
});

updateDisplay();
