const display = document.getElementById('display');
const buttons = document.querySelectorAll('.buttons button');
const clearBtn = document.getElementById('clear');
const equalsBtn = document.getElementById('equals');

let expression = '';

buttons.forEach(button => {
    if(button !== clearBtn && button !== equalsBtn) {
        button.addEventListener('click', () => {
            const val = button.getAttribute('data-value');
            expression += val;
            display.value = expression;
        });
    }
});

clearBtn.addEventListener('click', () => {
    expression = '';
    display.value = '';
});

equalsBtn.addEventListener('click', async () => {
    if(expression.trim() === '') return;
    try {
        const response = await fetch('/evaluate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ expression })
        });
        const data = await response.json();
        if(data.error) {
            display.value = 'Error';
            expression = '';
        } else {
            display.value = data.result;
            expression = data.result.toString();
        }
    } catch (e) {
        display.value = 'Error';
        expression = '';
    }
});
