document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.btn');
    let currentInput = '';
    let shouldResetDisplay = false;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');
            
            if (button.id === 'clear') {
                currentInput = '';
                display.textContent = '0';
                return;
            }
            
            if (button.id === 'equals') {
                try {
                    // 使用安全的計算方法，避免使用eval
                    const result = calculate(currentInput);
                    display.textContent = result;
                    currentInput = result.toString();
                } catch (error) {
                    display.textContent = '錯誤';
                    currentInput = '';
                }
                return;
            }
            
            if (value) {
                if (shouldResetDisplay) {
                    currentInput = '';
                    shouldResetDisplay = false;
                }
                currentInput += value;
                display.textContent = currentInput;
            }
        });
    });

    function calculate(expression) {
        // 使用Shunting Yard算法將中序轉後序
        const outputQueue = [];
        const operatorStack = [];
        const operators = {
            '+': { precedence: 1, associativity: 'Left' },
            '-': { precedence: 1, associativity: 'Left' },
            '*': { precedence: 2, associativity: 'Left' },
            '/': { precedence: 2, associativity: 'Left' }
        };

        const tokens = expression.match(/(\d+\.?\d*)|[+\-*/]/g);
        if (!tokens) throw new Error('無效的表達式');

        tokens.forEach(token => {
            if (!isNaN(token)) {
                outputQueue.push(token);
            } else if (operators[token]) {
                while (operatorStack.length > 0) {
                    const top = operatorStack[operatorStack.length - 1];
                    if (operators[top] &&
                        ((operators[token].associativity === 'Left' && operators[token].precedence <= operators[top].precedence) ||
                        (operators[token].associativity === 'Right' && operators[token].precedence < operators[top].precedence))) {
                        outputQueue.push(operatorStack.pop());
                    } else {
                        break;
                    }
                }
                operatorStack.push(token);
            }
        });

        while (operatorStack.length > 0) {
            const op = operatorStack.pop();
            if (!operators[op]) throw new Error('無效的運算符');
            outputQueue.push(op);
        }

        // 計算後序表達式
        const stack = [];
        outputQueue.forEach(token => {
            if (!isNaN(token)) {
                stack.push(parseFloat(token));
            } else {
                const b = stack.pop();
                const a = stack.pop();
                switch(token) {
                    case '+': stack.push(a + b); break;
                    case '-': stack.push(a - b); break;
                    case '*': stack.push(a * b); break;
                    case '/': 
                        if (b === 0) throw new Error('除以零錯誤');
                        stack.push(a / b); 
                        break;
                    default: throw new Error('未知運算符');
                }
            }
        });

        if (stack.length !== 1) throw new Error('計算錯誤');
        return stack[0];
    }
});
