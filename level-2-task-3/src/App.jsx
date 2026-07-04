import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [formula, setFormula] = useState('');
  const [displayValue, setDisplayValue] = useState('0');
  const [isResult, setIsResult] = useState(false);
  const [history, setHistory] = useState(() => {
    return JSON.parse(localStorage.getItem('calchistory')) || [];
  });

  // Persist history in local storage
  useEffect(() => {
    localStorage.setItem('calchistory', JSON.stringify(history));
  }, [history]);

  // Safe Math Evaluator
  const evaluateExpression = (expr) => {
    try {
      // Replace fancy multiplication/division symbols
      const sanitizedExpr = expr.replace(/×/g, '*').replace(/÷/g, '/');
      
      // Strict regex matching to prevent arbitrary code execution
      if (!/^[0-9.+\-*/\s()]+$/.test(sanitizedExpr)) {
        return 'Error';
      }

      // Safe calculation using Function evaluator
      const calcResult = new Function(`return (${sanitizedExpr})`)();
      
      if (calcResult === Infinity || calcResult === -Infinity) {
        return 'Div by 0';
      }
      
      // Limit decimals to 8 places max
      return Number(calcResult.toFixed(8)).toString();
    } catch (e) {
      return 'Error';
    }
  };

  // Button Click handler
  const handleButtonClick = (value, type) => {
    if (type === 'number') {
      if (displayValue === '0' || isResult) {
        setDisplayValue(value);
        setFormula(isResult ? '' : formula + value);
        setIsResult(false);
      } else {
        // Prevent multiple consecutive decimals
        if (value === '.' && displayValue.includes('.')) return;
        setDisplayValue(displayValue + value);
        setFormula(formula + value);
      }
    }

    if (type === 'operator') {
      setIsResult(false);
      // Replace last operator if clicked consecutively
      const lastChar = formula.slice(-1);
      if (['+', '-', '×', '÷'].includes(lastChar)) {
        setFormula(formula.slice(0, -1) + value);
      } else {
        setFormula((formula || displayValue) + value);
      }
      setDisplayValue('0');
    }

    if (type === 'clear') {
      setFormula('');
      setDisplayValue('0');
      setIsResult(false);
    }

    if (type === 'delete') {
      if (displayValue.length > 1) {
        setDisplayValue(displayValue.slice(0, -1));
        setFormula(formula.slice(0, -1));
      } else {
        setDisplayValue('0');
        if (formula.length > 0) setFormula(formula.slice(0, -1));
      }
    }

    if (type === 'equals') {
      if (!formula) return;
      
      const lastChar = formula.slice(-1);
      if (['+', '-', '×', '÷'].includes(lastChar)) return; // Don't evaluate incomplete formulas

      const result = evaluateExpression(formula);
      
      if (result !== 'Error') {
        const newHistoryItem = {
          id: Date.now(),
          formula: formula,
          result: result
        };
        setHistory([newHistoryItem, ...history.slice(0, 19)]); // Store up to 20 calculations
      }

      setDisplayValue(result);
      setFormula(result);
      setIsResult(true);
    }
  };

  // Load history item back to screen
  const loadHistoryItem = (item) => {
    setFormula(item.formula);
    setDisplayValue(item.result);
    setIsResult(true);
  };

  // Clear history items
  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="calculator-container">
      {/* Decorative Blur Backgrounds */}
      <div className="bubble bubble-1"></div>
      <div className="bubble bubble-2"></div>

      {/* Main Panel */}
      <div className="calculator-body">
        <div className="title-bar">
          <div className="window-dots">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <h2>Veda<span>Calc</span></h2>
        </div>

        {/* Display Screen Component */}
        <div className="calculator-screen">
          <div className="screen-formula">{formula || '\u00A0'}</div>
          <div className="screen-value">{displayValue}</div>
        </div>

        {/* Keypad Grid Component */}
        <div className="calculator-keypad">
          <button className="calc-btn clear" onClick={() => handleButtonClick('', 'clear')}>AC</button>
          <button className="calc-btn operator" onClick={() => handleButtonClick('', 'delete')}><i className="fa-solid fa-delete-left"></i></button>
          <button className="calc-btn operator" onClick={() => handleButtonClick('÷', 'operator')}>÷</button>
          <button className="calc-btn operator" onClick={() => handleButtonClick('×', 'operator')}>×</button>

          <button className="calc-btn" onClick={() => handleButtonClick('7', 'number')}>7</button>
          <button className="calc-btn" onClick={() => handleButtonClick('8', 'number')}>8</button>
          <button className="calc-btn" onClick={() => handleButtonClick('9', 'number')}>9</button>
          <button className="calc-btn operator" onClick={() => handleButtonClick('-', 'operator')}>-</button>

          <button className="calc-btn" onClick={() => handleButtonClick('4', 'number')}>4</button>
          <button className="calc-btn" onClick={() => handleButtonClick('5', 'number')}>5</button>
          <button className="calc-btn" onClick={() => handleButtonClick('6', 'number')}>6</button>
          <button className="calc-btn operator" onClick={() => handleButtonClick('+', 'operator')}>+</button>

          <button className="calc-btn" onClick={() => handleButtonClick('1', 'number')}>1</button>
          <button className="calc-btn" onClick={() => handleButtonClick('2', 'number')}>2</button>
          <button className="calc-btn" onClick={() => handleButtonClick('3', 'number')}>3</button>
          <button className="calc-btn" onClick={() => handleButtonClick('.', 'number')}>.</button>

          <button className="calc-btn" onClick={() => handleButtonClick('0', 'number')}>0</button>
          <button className="calc-btn equals" onClick={() => handleButtonClick('', 'equals')}>=</button>
        </div>
      </div>

      {/* History Sidebar Panel Component */}
      <div className="calculator-history">
        <div className="history-header">
          <h3>History</h3>
          {history.length > 0 && (
            <button className="btn-clear-history" onClick={clearHistory}>Clear</button>
          )}
        </div>

        <div className="history-list">
          {history.length === 0 ? (
            <div className="history-empty">
              <i className="fa-solid fa-clock-rotate-left"></i>
              <p>No calculations yet</p>
            </div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="history-item" onClick={() => loadHistoryItem(item)}>
                <span className="history-formula">{item.formula} =</span>
                <span className="history-result">{item.result}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
