import { ParsedOCRResult, ScanConfidence, PatternMatchResult } from './types';

// Helper to extract clean numeric values (ignoring commas, currencies, etc)
// e.g. "₹10,000.50" -> 10000.5, "18%" -> 18, "Rs. 500" -> 500
// It ignores phone numbers (length > 8 consecutive digits).
export const extractAllNumbers = (text: string): number[] => {
  // Regex finds sequences of digits, optional commas, optional decimals
  // Negative lookahead/behind to ignore long ID/phone strings (e.g. 10 digits)
  const regex = /(?<!\d)(?:(?:\d{1,3}(?:,\d{3})+)|(?:\d+))(?:\.\d+)?(?!\d)/g;
  const matches = text.match(regex);
  if (!matches) return [];

  const numbers: number[] = [];
  for (const match of matches) {
    const cleanStr = match.replace(/,/g, '');
    if (cleanStr.length > 8 && !cleanStr.includes('.')) {
      // Ignore long integer sequences (phone numbers, IDs)
      continue;
    }
    const val = parseFloat(cleanStr);
    if (!isNaN(val)) {
      numbers.push(val);
    }
  }
  return numbers;
};

// Find a number near a specific keyword, optionally requiring percentage
export const findNumberNearKeyword = (text: string, keywords: RegExp[], isPercentage: boolean = false): number | null => {
  const lowerText = text.toLowerCase();
  for (const keyword of keywords) {
    // Find keyword index
    const match = lowerText.match(keyword);
    if (match && match.index !== undefined) {
      // Get the substring after the keyword
      const afterKeyword = lowerText.substring(match.index + match[0].length);
      
      if (isPercentage) {
        const percMatch = afterKeyword.match(/(?<!\d)(?:\d+(?:\.\d+)?)(?=\s*%)/);
        if (percMatch) return parseFloat(percMatch[0]);
      } else {
        const nums = extractAllNumbers(afterKeyword);
        if (nums.length > 0) return nums[0];
      }
    }
  }
  
  // Fallback to line-based approach
  const lines = text.split(/\n/);
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    const hasKeyword = keywords.some(k => k.test(lowerLine));
    if (hasKeyword) {
      if (isPercentage && !lowerLine.includes('%')) continue;
      const nums = extractAllNumbers(line);
      if (nums.length > 0) {
        if (isPercentage) {
          const percMatch = line.match(/(?<!\d)(?:\d+(?:\.\d+)?)(?=\s*%)/);
          if (percMatch) return parseFloat(percMatch[0]);
        }
        return nums[0];
      }
    }
  }
  return null;
};

const hasKeyword = (text: string, keywords: RegExp[]) => {
  const lower = text.toLowerCase();
  return keywords.some(k => k.test(lower));
};

export const suggestCalculator = (text: string): ParsedOCRResult => {
  let bestMatch: PatternMatchResult | null = null;
  const allNums = extractAllNumbers(text);

  // 1. GST Calculator
  if (hasKeyword(text, [/gst/])) {
    const rate = findNumberNearKeyword(text, [/gst/], true) || (allNums.length > 1 ? allNums.find(n => n <= 30) : undefined);
    const amount = findNumberNearKeyword(text, [/amount/, /total/, /price/]) || (allNums.length > 0 ? allNums.find(n => n !== rate) : undefined);
    
    // Check if intra or inter state is explicitly mentioned
    let gstType: string | undefined;
    if (hasKeyword(text, [/intra/])) gstType = 'intra';
    if (hasKeyword(text, [/inter/])) gstType = 'inter';
    if (hasKeyword(text, [/igst/])) gstType = 'inter';
    if (hasKeyword(text, [/cgst/, /sgst/])) gstType = 'intra';
    
    if (amount !== undefined) {
      bestMatch = {
        calculatorId: 'finance-gst',
        detectedInputs: {
          amount: amount,
          gstRate: rate,
          ...(gstType && { gstType })
        },
        confidence: rate !== undefined && amount !== undefined ? (gstType ? 'HIGH' : 'MEDIUM') : 'MEDIUM'
      };
    } else {
      bestMatch = {
        calculatorId: 'finance-gst',
        detectedInputs: { gstRate: rate },
        confidence: 'LOW'
      };
    }
  }

  // 2. DISCOUNT Calculator
  else if (hasKeyword(text, [/discount/, /off/])) {
    const discount = findNumberNearKeyword(text, [/discount/, /off/], true) || (text.includes('%') ? allNums.find(n => n < 100) : undefined);
    const price = findNumberNearKeyword(text, [/price/, /mrp/]) || allNums.find(n => n !== discount);

    if (price !== undefined) {
      bestMatch = {
        calculatorId: 'finance-discount',
        detectedInputs: {
          originalPrice: price,
          discount: discount
        },
        confidence: discount !== undefined ? 'HIGH' : 'MEDIUM'
      };
    }
  }

  // 3. PROFIT / LOSS
  else if (hasKeyword(text, [/cost/, /cp/]) && hasKeyword(text, [/selling/, /sp/])) {
    const cp = findNumberNearKeyword(text, [/cost/, /cp/]);
    const sp = findNumberNearKeyword(text, [/selling/, /sp/]);
    
    if (cp !== undefined && sp !== undefined) {
      bestMatch = {
        calculatorId: 'finance-profit-loss',
        detectedInputs: {
          costPrice: cp,
          sellingPrice: sp
        },
        confidence: 'HIGH'
      };
    }
  }

  // 4. BILL SPLIT
  else if (hasKeyword(text, [/split/, /people/, /persons/])) {
    const bill = findNumberNearKeyword(text, [/bill/, /amount/, /total/]) || allNums[0];
    const people = findNumberNearKeyword(text, [/people/, /persons/, /split/]) || allNums.find(n => n < 100 && n % 1 === 0 && n !== bill);
    
    if (bill !== undefined && people !== undefined) {
      bestMatch = {
        calculatorId: 'dailyLife-bill-splitter',
        detectedInputs: {
          totalBill: bill,
          numberOfPeople: people,
          tipPercentage: 0
        },
        confidence: 'HIGH'
      };
    }
  }

  // 5. TIP
  else if (hasKeyword(text, [/tip/])) {
    const bill = findNumberNearKeyword(text, [/bill/, /amount/, /total/]) || allNums[0];
    const tip = findNumberNearKeyword(text, [/tip/], true) || allNums.find(n => n < 100 && n !== bill);
    
    if (bill !== undefined) {
      bestMatch = {
        calculatorId: 'dailyLife-tip',
        detectedInputs: {
          totalBill: bill,
          tipPercentage: tip
        },
        confidence: tip !== undefined ? 'HIGH' : 'MEDIUM'
      };
    }
  }

  // 6. EMI / LOAN
  else if (hasKeyword(text, [/loan/, /emi/])) {
    const principal = findNumberNearKeyword(text, [/loan/, /principal/, /amount/]) || (allNums.length > 0 ? allNums.reduce((a,b) => Math.max(a,b), 0) : undefined);
    const rate = findNumberNearKeyword(text, [/interest/, /rate/], true) || allNums.find(n => n < 30 && n !== principal);
    const tenure = findNumberNearKeyword(text, [/tenure/, /years/, /months/]) || allNums.find(n => n < 360 && n !== principal && n !== rate);
    
    if (principal !== undefined) {
      bestMatch = {
        calculatorId: 'finance-emi',
        detectedInputs: {
          principal,
          rate,
          tenure
        },
        confidence: (rate !== undefined && tenure !== undefined) ? 'HIGH' : 'MEDIUM'
      };
    }
  }

  // 7. FUEL COST
  else if (hasKeyword(text, [/fuel/, /mileage/]) && hasKeyword(text, [/distance/])) {
    const distance = findNumberNearKeyword(text, [/distance/, /km/]);
    const mileage = findNumberNearKeyword(text, [/mileage/, /km\/l/]);
    const price = findNumberNearKeyword(text, [/price/]);
    
    if (distance !== undefined && mileage !== undefined) {
      bestMatch = {
        calculatorId: 'dailyLife-fuel-cost',
        detectedInputs: {
          distance,
          mileage,
          fuelPrice: price
        },
        confidence: price !== undefined ? 'HIGH' : 'MEDIUM'
      };
    }
  }

  // 8. SIP
  else if (hasKeyword(text, [/sip/, /monthly investment/])) {
    const monthly = findNumberNearKeyword(text, [/sip/, /monthly/]) || (allNums.length > 0 ? allNums.reduce((a,b) => Math.max(a,b), 0) : undefined);
    const rate = findNumberNearKeyword(text, [/interest/, /rate/], true) || allNums.find(n => n < 30 && n !== monthly);
    const duration = findNumberNearKeyword(text, [/duration/, /years/]) || allNums.find(n => n < 50 && n !== monthly && n !== rate);
    
    if (monthly !== undefined) {
      bestMatch = {
        calculatorId: 'finance-sip',
        detectedInputs: {
          monthlyInvestment: monthly,
          rate,
          duration
        },
        confidence: (rate !== undefined && duration !== undefined) ? 'HIGH' : 'MEDIUM'
      };
    }
  }

  // 9. SIMPLE/COMPOUND INTEREST
  else if (hasKeyword(text, [/principal/]) && hasKeyword(text, [/rate/]) && hasKeyword(text, [/time/, /years/])) {
    const principal = findNumberNearKeyword(text, [/principal/]);
    const rate = findNumberNearKeyword(text, [/rate/], true);
    const time = findNumberNearKeyword(text, [/time/, /years/]);
    
    if (principal !== undefined && rate !== undefined && time !== undefined) {
      if (hasKeyword(text, [/compound/])) {
        bestMatch = {
          calculatorId: 'finance-compound-interest',
          detectedInputs: {
            principal,
            rate,
            time,
            frequency: '12' // Requires user selection if missing, but default to monthly or yearly
          },
          confidence: 'MEDIUM' // Medium because frequency isn't parsed
        };
      } else {
        bestMatch = {
          calculatorId: 'finance-simple-interest',
          detectedInputs: {
            principal,
            rate,
            time
          },
          confidence: 'HIGH'
        };
      }
    }
  }

  if (bestMatch) {
    return {
      calculatorId: bestMatch.calculatorId,
      confidence: bestMatch.confidence,
      detectedInputs: bestMatch.detectedInputs,
      sourceText: text
    };
  }

  return {
    confidence: 'LOW',
    detectedInputs: {},
    sourceText: text
  };
};
