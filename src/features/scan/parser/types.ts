export type ScanConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ParsedOCRResult {
  calculatorId?: string;
  confidence: ScanConfidence;
  detectedInputs: Record<string, any>;
  sourceText: string;
}

export interface PatternMatchResult {
  calculatorId: string;
  detectedInputs: Record<string, any>;
  confidence: ScanConfidence;
}
