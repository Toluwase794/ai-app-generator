(function() {
  const display = document.getElementById('display');
  const buttons = document.querySelectorAll('.btn');
  const clearBtn = document.getElementById('clear');
  const equalsBtn = document.getElementById('equals');

  // Map function names to JS Math equivalents
  const functionsMap = {
    'sin': Math.sin,
    'cos': Math.cos,
    'tan': Math.tan,
    'log10': Math.log10 || function(x) { return Math.log(x) / Math.LN10; },
    'ln': Math.log
  };

  // Insert value at cursor end
  function insertValue(value) {
    display.value += value;
  }

  // Clear display
  clearBtn.addEventListener('click', () => {
    display.value = '';
  });

  // Handle button clicks
  buttons.forEach(button => {
    if(button !== clearBtn && button !== equalsBtn) {
      button.addEventListener('click', () => {
        insertValue(button.getAttribute('data-value'));
      });
    }
  });

  // Evaluate expression safely
  equalsBtn.addEventListener('click', () => {
    try {
      const expr = display.value;
      if (!expr) return;

      // Replace function calls with JS Math calls
      // e.g. sin( -> Math.sin(
      let jsExpr = expr
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log10\(/g, '(Math.log10 ? Math.log10 : (x => Math.log(x)/Math.LN10))(')
        .replace(/ln\(/g, 'Math.log(');

      // Replace unicode operators with JS operators
      jsExpr = jsExpr.replace(/÷/g, '/').replace(/×/g, '*').replace(/−/g, '-');

      // Evaluate with Math functions and parentheses
      // Use Function constructor to evaluate safely
      // Disallow any characters except digits, operators, parentheses, decimal, Math, and letters for functions
      if (!/^[0-9+\-*/()., Mathsincoetlgr]+$/.test(jsExpr)) {
        throw new Error('Invalid characters in expression');
      }

      // Evaluate
      const result = Function('return ' + jsExpr)();

      if (typeof result === 'number' && isFinite(result)) {
        display.value = result.toString();
      } else {
        display.value = 'Error';
      }
    } catch (e) {
      display.value = 'Error';
    }
  });

  // Support keyboard input for convenience
  window.addEventListener('keydown', e => {
    const allowedKeys = '0123456789+-*/().';
    if (allowedKeys.includes(e.key)) {
      insertValue(e.key);
      e.preventDefault();
    } else if (e.key === 'Enter') {
      equalsBtn.click();
      e.preventDefault();
    } else if (e.key === 'Backspace') {
      display.value = display.value.slice(0, -1);
      e.preventDefault();
    }
  });

})();
