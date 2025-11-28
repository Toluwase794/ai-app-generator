(() => {
  const display = document.getElementById('display');
  const buttons = document.querySelectorAll('.btn');
  const clearBtn = document.getElementById('clear');
  const equalsBtn = document.getElementById('equals');

  // Map function names to JS Math equivalents
  const functionsMap = {
    'sin': 'Math.sin',
    'cos': 'Math.cos',
    'tan': 'Math.tan',
    'log10': 'Math.log10',
    'ln': 'Math.log'
  };

  // Convert degrees to radians for trig functions
  function degToRad(deg) {
    return deg * Math.PI / 180;
  }

  // Replace function calls in expression with JS equivalents
  function parseExpression(expr) {
    // Replace function calls with wrappers that convert degrees to radians for trig
    expr = expr.replace(/(sin|cos|tan)\(/g, (match, p1) => {
      return `Math.${p1}(degToRad(`;
    });

    // Replace log10 and ln with Math.log10 and Math.log
    expr = expr.replace(/log10\(/g, 'Math.log10(');
    expr = expr.replace(/ln\(/g, 'Math.log(');

    return expr;
  }

  // Evaluate the expression safely
  function evaluateExpression(expr) {
    try {
      // Parse expression
      const parsedExpr = parseExpression(expr);

      // Create a function with degToRad in scope
      const func = new Function('Math', 'degToRad', `return ${parsedExpr}`);
      const result = func(Math, degToRad);

      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return result;
      } else {
        return 'Error';
      }
    } catch (e) {
      return 'Error';
    }
  }

  // Append value to display
  function appendToDisplay(value) {
    // Prevent multiple consecutive operators except for minus
    const operators = ['+', '-', '*', '/'];
    const lastChar = display.value.slice(-1);

    if (operators.includes(value)) {
      if (display.value === '' && value !== '-') {
        // Do not allow operator at start except minus
        return;
      }
      if (operators.includes(lastChar)) {
        // Replace last operator with new one
        display.value = display.value.slice(0, -1) + value;
        return;
      }
    }

    display.value += value;
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const val = button.getAttribute('data-value');
      if (val) {
        appendToDisplay(val);
      }
    });
  });

  clearBtn.addEventListener('click', () => {
    display.value = '';
  });

  equalsBtn.addEventListener('click', () => {
    if (display.value.trim() === '') return;
    const result = evaluateExpression(display.value);
    display.value = result.toString();
  });

  // Support keyboard input
  window.addEventListener('keydown', (e) => {
    const allowedKeys = '0123456789+-*/().';
    if (allowedKeys.includes(e.key)) {
      e.preventDefault();
      appendToDisplay(e.key);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      equalsBtn.click();
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      display.value = display.value.slice(0, -1);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      clearBtn.click();
    }
  });

  // Accessibility: focus visible styles
  document.body.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('user-is-tabbing');
    }
  });
})();
