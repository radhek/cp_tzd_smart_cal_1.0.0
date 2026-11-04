import { useState, useCallback, useMemo } from 'react';
import { evaluateExpression, formatResultNumber } from './normalEngine';

export function useNormalCalculator(initialExpression?: string) {
  const [prevInitial, setPrevInitial] = useState(initialExpression);
  const [expression, setExpression] = useState<string>(initialExpression || '');
  const [finalResult, setFinalResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);

  // Synchronize state when initialExpression changes (React official render adjustment pattern)
  if (initialExpression !== prevInitial) {
    setPrevInitial(initialExpression);
    setExpression(initialExpression || '');
    setIsCalculated(false);
    setFinalResult(null);
    setError(null);
    setErrorKey(null);
  }

  // Live preview evaluation (e.g., as user types "12 + 5", preview shows "17")
  const previewResult = useMemo(() => {
    if (isCalculated || !expression.trim() || error) {
      return null;
    }
    // Only show live preview if there's at least one operator or percentage in the expression
    if (!/[+\-−×÷%]/.test(expression)) {
      return null;
    }
    const res = evaluateExpression(expression);
    if (res.success && res.formatted) {
      return res.formatted;
    }
    return null;
  }, [expression, isCalculated, error]);

  const inputDigit = useCallback((digit: string) => {
    setError(null);
    setErrorKey(null);

    if (isCalculated) {
      setExpression(digit);
      setIsCalculated(false);
      setFinalResult(null);
      return;
    }

    setExpression((prev) => {
      if (!prev) return digit;

      // Check current number token at the end of expression
      const lastTokenMatch = prev.match(/([0-9.]+)$/);
      if (lastTokenMatch) {
        const lastToken = lastTokenMatch[1];
        // Prevent leading zeros like "00"
        if (lastToken === '0') {
          if (digit === '0') return prev;
          return prev.slice(0, -1) + digit;
        }
      }

      // If user types digit immediately after %, insert multiplication
      if (prev.endsWith('%')) {
        return prev + ' × ' + digit;
      }

      return prev + digit;
    });
  }, [isCalculated]);

  const inputDecimal = useCallback(() => {
    setError(null);
    setErrorKey(null);

    if (isCalculated) {
      setExpression('0.');
      setIsCalculated(false);
      setFinalResult(null);
      return;
    }

    setExpression((prev) => {
      if (!prev) return '0.';

      // If expression ends with operator or space
      if (prev.endsWith(' ')) {
        return prev + '0.';
      }

      // Check if current token already has a decimal point
      const lastTokenMatch = prev.match(/([0-9.]+)$/);
      if (lastTokenMatch && lastTokenMatch[1].includes('.')) {
        return prev; // Ignore duplicate decimal
      }

      return prev + '.';
    });
  }, [isCalculated]);

  const inputOperator = useCallback((op: '+' | '−' | '×' | '÷') => {
    setError(null);
    setErrorKey(null);

    if (isCalculated) {
      // Continue from previous calculated result
      const base = finalResult ? finalResult.replace(/,/g, '') : '0';
      setExpression(base + ' ' + op + ' ');
      setIsCalculated(false);
      setFinalResult(null);
      return;
    }

    setExpression((prev) => {
      if (!prev) {
        if (op === '−') return '−';
        return '0 ' + op + ' ';
      }

      // If ends with another operator and spaces, e.g. " + ", replace it
      if (/\s[+−×÷]\s$/.test(prev)) {
        return prev.slice(0, -3) + ' ' + op + ' ';
      }

      // If ends with dangling decimal point, remove it first
      const cleanPrev = prev.endsWith('.') ? prev.slice(0, -1) : prev;
      return cleanPrev + ' ' + op + ' ';
    });
  }, [isCalculated, finalResult]);

  const inputPercentage = useCallback(() => {
    setError(null);
    setErrorKey(null);

    if (isCalculated) {
      const base = finalResult ? finalResult.replace(/,/g, '') : '0';
      setExpression(base + '%');
      setIsCalculated(false);
      setFinalResult(null);
      return;
    }

    setExpression((prev) => {
      if (!prev || prev.endsWith(' ') || prev.endsWith('%')) {
        return prev;
      }
      return prev + '%';
    });
  }, [isCalculated, finalResult]);

  const toggleSign = useCallback(() => {
    setError(null);
    setErrorKey(null);

    if (isCalculated && finalResult) {
      const num = Number(finalResult.replace(/,/g, ''));
      if (Number.isFinite(num)) {
        const toggled = -num;
        setExpression(formatResultNumber(toggled));
        setFinalResult(formatResultNumber(toggled));
        setIsCalculated(false);
      }
      return;
    }

    setExpression((prev) => {
      if (!prev) return '−';

      // Case 1: Expression ends with parenthesized negative number like "(-12)" or "(-12.5)"
      const parenMatch = prev.match(/\((-?\d+(?:\.\d+)?)\)$/);
      if (parenMatch) {
        const val = parenMatch[1];
        // Unwrap "(-12)" => "12"
        const unwrapped = val.startsWith('-') ? val.slice(1) : val;
        return prev.slice(0, parenMatch.index) + unwrapped;
      }

      // Case 2: Expression starts with leading negative sign "-12" or "−12"
      if (/^[−-]\d+(?:\.\d+)?$/.test(prev)) {
        return prev.slice(1);
      }

      // Case 3: Expression ends with positive number
      const numMatch = prev.match(/(\d+(?:\.\d+)?)$/);
      if (numMatch) {
        const numStr = numMatch[1];
        const prefix = prev.slice(0, numMatch.index);
        if (prefix.length === 0) {
          return '−' + numStr;
        }
        return prefix + '(-' + numStr + ')';
      }

      return prev;
    });
  }, [isCalculated, finalResult]);

  const backspace = useCallback(() => {
    setError(null);
    setErrorKey(null);

    if (isCalculated) {
      setIsCalculated(false);
      return;
    }

    setExpression((prev) => {
      if (!prev) return '';

      // If expression ends with parenthesized negative like "(-5)"
      if (prev.endsWith(')')) {
        const parenIndex = prev.lastIndexOf('(');
        if (parenIndex !== -1) {
          // Remove closing paren or whole wrapper
          const content = prev.slice(parenIndex + 1, -1);
          const positive = content.startsWith('-') ? content.slice(1) : content;
          return prev.slice(0, parenIndex) + positive;
        }
      }

      // If expression ends with operator with spaces " + "
      if (/\s[+−×÷]\s$/.test(prev)) {
        return prev.slice(0, -3);
      }

      return prev.slice(0, -1);
    });
  }, [isCalculated]);

  const clearAll = useCallback(() => {
    setExpression('');
    setFinalResult(null);
    setError(null);
    setErrorKey(null);
    setIsCalculated(false);
  }, []);

  const calculate = useCallback((onCalculated?: (expression: string, resultValue: number) => void) => {
    if (!expression.trim()) return;

    const res = evaluateExpression(expression);
    if (!res.success) {
      setError(res.error || 'Error');
      setErrorKey(res.errorKey || 'calculators.dailyLife.normal.invalidFormat');
      setFinalResult(null);
      setIsCalculated(false);
    } else {
      setError(null);
      setErrorKey(null);
      setFinalResult(res.formatted);
      setIsCalculated(true);
      if (onCalculated) {
        onCalculated(expression, res.value);
      }
    }
  }, [expression]);

  return {
    expression,
    previewResult,
    finalResult,
    error,
    errorKey,
    isCalculated,
    inputDigit,
    inputDecimal,
    inputOperator,
    inputPercentage,
    toggleSign,
    backspace,
    clearAll,
    calculate,
    setExpression,
  };
}
