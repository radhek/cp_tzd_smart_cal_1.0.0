/**
 * Normal (Basic) Calculator Math Engine
 * Supports standard arithmetic (+, −, ×, ÷), standard operator precedence (BODMAS/PEMDAS),
 * percentage calculations, positive/negative toggling, floating point precision sanitization,
 * safe division by zero handling, and dynamic number formatting.
 */

export interface EvaluationResult {
  success: boolean;
  value: number;
  formatted: string;
  error?: string;
  errorKey?: string;
}

/**
 * Format a raw number for display with comma separation and precision trimming.
 */
export function formatResultNumber(num: number): string {
  if (!Number.isFinite(num)) {
    return 'Error';
  }

  // Sanitize floating point precision (e.g. 0.1 + 0.2 => 0.3)
  const trimmed = parseFloat(num.toPrecision(12));

  // Use scientific notation for extremely large or microscopic numbers
  if (Math.abs(trimmed) >= 1e12 || (Math.abs(trimmed) > 0 && Math.abs(trimmed) < 1e-7)) {
    return trimmed.toExponential(6).replace(/\+/, '');
  }

  const parts = trimmed.toString().split('.');
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.length > 1 ? `${intPart}.${parts[1]}` : intPart;
}

/**
 * Format an in-progress expression string with comma-separated numbers for display.
 */
export function formatExpression(expr: string): string {
  if (!expr) return '';

  // Replace each number sequence with its comma-grouped version while preserving operators and decimals
  return expr.replace(/\b\d+(\.\d*)?/g, (match) => {
    const parts = match.split('.');
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.length > 1 ? `${intPart}.${parts[1]}` : intPart;
  });
}

/**
 * Evaluates a mathematical expression string.
 * Supports +, − (or -), × (or *), ÷ (or /), %, and negative numbers like (-5).
 */
export function evaluateExpression(rawExpr: string): EvaluationResult {
  if (!rawExpr || !rawExpr.trim()) {
    return { success: true, value: 0, formatted: '0' };
  }

  // Normalize Unicode operators to standard ASCII for processing
  let expr = rawExpr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .trim();

  // Strip trailing operators or dangling decimal points if incomplete (e.g., "12 + ")
  expr = expr.replace(/[+\-*/.]+$/, '').trim();
  if (!expr) {
    return { success: true, value: 0, formatted: '0' };
  }

  // Tokenize into numbers (including parenthesized negatives like (-5)), operators (+, -, *, /), and %
  const regex = /\(-?\d+(?:\.\d+)?\)|\d+(?:\.\d+)?|[+\-*/%]/g;
  const rawTokens = expr.match(regex);
  if (!rawTokens || rawTokens.length === 0) {
    return {
      success: false,
      value: 0,
      formatted: 'Error',
      error: 'Invalid expression',
      errorKey: 'calculators.dailyLife.normal.invalidFormat'
    };
  }

  // Clean tokens and resolve unary negative numbers
  const tokens: string[] = [];
  for (let i = 0; i < rawTokens.length; i++) {
    const t = rawTokens[i];
    if (t.startsWith('(') && t.endsWith(')')) {
      // Unpack (-5) to "-5"
      tokens.push(t.slice(1, -1));
    } else if (t === '-' && (i === 0 || ['+', '-', '*', '/'].includes(tokens[tokens.length - 1]))) {
      // Unary negative sign directly preceding a number
      const next = rawTokens[++i];
      if (next) {
        const cleanNext = next.startsWith('(') ? next.slice(1, -1) : next;
        tokens.push('-' + cleanNext);
      }
    } else {
      tokens.push(t);
    }
  }

  // 1. Percentage resolution (%)
  // Handles standard calculator rules:
  // - A + B% => A + (A * B / 100)
  // - A − B% => A − (A * B / 100)
  // - A × B% => A * (B / 100)
  // - A ÷ B% => A / (B / 100)
  // - B%     => B / 100
  const tokensWithPercent: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === '%') {
      const prevNumStr = tokensWithPercent.pop();
      if (prevNumStr === undefined || isNaN(Number(prevNumStr))) {
        return {
          success: false,
          value: 0,
          formatted: 'Error',
          error: 'Invalid percentage',
          errorKey: 'calculators.dailyLife.normal.invalidFormat'
        };
      }
      const prevNum = Number(prevNumStr);
      const op = tokensWithPercent[tokensWithPercent.length - 1];
      const baseNumStr = tokensWithPercent[tokensWithPercent.length - 2];

      let val: number;
      if (['+', '-'].includes(op) && baseNumStr !== undefined && !isNaN(Number(baseNumStr))) {
        const baseNum = Number(baseNumStr);
        val = (baseNum * prevNum) / 100;
      } else {
        val = prevNum / 100;
      }
      tokensWithPercent.push(String(val));
    } else {
      tokensWithPercent.push(tokens[i]);
    }
  }

  // 2. High Precedence: Multiplication (*) and Division (/) (left-to-right)
  const tokensAfterMulDiv: string[] = [];
  for (let i = 0; i < tokensWithPercent.length; i++) {
    const t = tokensWithPercent[i];
    if (t === '*' || t === '/') {
      const prevStr = tokensAfterMulDiv.pop();
      const nextStr = tokensWithPercent[++i];
      if (prevStr === undefined || nextStr === undefined) {
        return {
          success: false,
          value: 0,
          formatted: 'Error',
          error: 'Invalid expression',
          errorKey: 'calculators.dailyLife.normal.invalidFormat'
        };
      }
      const a = Number(prevStr);
      const b = Number(nextStr);
      if (isNaN(a) || isNaN(b)) {
        return {
          success: false,
          value: 0,
          formatted: 'Error',
          error: 'Invalid expression',
          errorKey: 'calculators.dailyLife.normal.invalidFormat'
        };
      }

      if (t === '/') {
        // Safe division by zero check
        if (Math.abs(b) < 1e-15) {
          return {
            success: false,
            value: 0,
            formatted: 'Cannot divide by zero',
            error: 'Cannot divide by zero',
            errorKey: 'calculators.dailyLife.normal.cannotDivideByZero'
          };
        }
        tokensAfterMulDiv.push(String(a / b));
      } else {
        tokensAfterMulDiv.push(String(a * b));
      }
    } else {
      tokensAfterMulDiv.push(t);
    }
  }

  // 3. Low Precedence: Addition (+) and Subtraction (-) (left-to-right)
  if (tokensAfterMulDiv.length === 0) {
    return { success: true, value: 0, formatted: '0' };
  }

  let acc = Number(tokensAfterMulDiv[0]);
  if (isNaN(acc)) {
    return {
      success: false,
      value: 0,
      formatted: 'Error',
      error: 'Invalid expression',
      errorKey: 'calculators.dailyLife.normal.invalidFormat'
    };
  }

  for (let i = 1; i < tokensAfterMulDiv.length; i += 2) {
    const op = tokensAfterMulDiv[i];
    const nextStr = tokensAfterMulDiv[i + 1];
    if (nextStr === undefined) break;

    const b = Number(nextStr);
    if (isNaN(b)) {
      return {
        success: false,
        value: 0,
        formatted: 'Error',
        error: 'Invalid expression',
        errorKey: 'calculators.dailyLife.normal.invalidFormat'
      };
    }

    if (op === '+') {
      acc += b;
    } else if (op === '-') {
      acc -= b;
    }
  }

  const safeVal = parseFloat(acc.toPrecision(12));
  return {
    success: true,
    value: safeVal,
    formatted: formatResultNumber(safeVal)
  };
}
