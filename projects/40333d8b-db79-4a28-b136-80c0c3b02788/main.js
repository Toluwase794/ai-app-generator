(() => {
  const expressionEl = document.getElementById('expression');
  const resultEl = document.getElementById('result');
  const buttons = document.querySelectorAll('.btn');
  const clearBtn = document.getElementById('clear');
  const deleteBtn = document.getElementById('delete');
  const equalsBtn = document.getElementById('equals');

  let expression = '';

  // Map for replacing operator symbols to JS equivalents
  const operatorReplacements = {
    '÷': '/',
    '×': '*',
    '−': '-',
    '^': '**'
  };

  // Functions allowed for evaluation
  const allowedFunctions = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    sqrt: Math.sqrt,
    log10: Math.log10 || ((x) => Math.log(x) / Math.LN10),
    ln: Math.log,
    exp: Math.exp,
    PI: Math.PI
  };

  // Sanitize and prepare expression for evaluation
  function prepareExpression(expr) {
    // Replace operator symbols
    Object.entries(operatorReplacements).forEach(([key, val]) => {
      expr = expr.split(key).join(val);
    });

    // Replace constants like pi with Math.PI
    expr = expr.replace(/π/g, 'Math.PI');

    // Replace function names with allowedFunctions equivalents
    // We will prefix function calls with allowedFunctions. to restrict
    // But since we will use a Function with allowedFunctions in scope, we can just allow them as variables

    // Replace ^ with ** (already done above)

    return expr;
  }

  // Evaluate expression safely
  function evaluateExpression(expr) {
    try {
      const prepared = prepareExpression(expr);

      // Create a function with allowed functions in scope
      const func = new Function(...Object.keys(allowedFunctions), 'return ' + prepared);
      const res = func(...Object.values(allowedFunctions));

      if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
        return res;
      } else {
        return 'Error';
      }
    } catch (e) {
      return 'Error';
    }
  }

  function updateDisplay() {
    expressionEl.textContent = expression || '';
    if (expression === '') {
      resultEl.textContent = '0';
      return;
    }
    const res = evaluateExpression(expression);
    resultEl.textContent = res === 'Error' ? 'Error' : res;
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-value');

      if (btn.id === 'clear') {
        expression = '';
        updateDisplay();
        return;
      }

      if (btn.id === 'delete') {
        expression = expression.slice(0, -1);
        updateDisplay();
        return;
      }

      if (btn.id === 'equals') {
        const res = evaluateExpression(expression);
        if (res !== 'Error') {
          expression = res.toString();
        } else {
          // Keep expression but show error
        }
        updateDisplay();
        return;
      }

      // Append value to expression
      // For functions, add '(' automatically if not present
      if (btn.classList.contains('function')) {
        // If val ends with '(', just append
        expression += val;
      } else if (btn.classList.contains('constant')) {
        // For constants like pi, append Math.PI
        expression += val;
      } else {
        expression += val;
      }
      updateDisplay();
    });
  });

  // Keyboard support (optional enhancement)
  window.addEventListener('keydown', (e) => {
    const key = e.key;
    const allowedKeys = '0123456789+-*/().';
    if (allowedKeys.includes(key)) {
      expression += key;
      updateDisplay();
      e.preventDefault();
    } else if (key === 'Enter' || key === '=') {
      const res = evaluateExpression(expression);
      if (res !== 'Error') {
        expression = res.toString();
      }
      updateDisplay();
      e.preventDefault();
    } else if (key === 'Backspace') {
      expression = expression.slice(0, -1);
      updateDisplay();
      e.preventDefault();
    } else if (key.toLowerCase() === 'c') {
      expression = '';
      updateDisplay();
      e.preventDefault();
    }
  });

  updateDisplay();
})();
