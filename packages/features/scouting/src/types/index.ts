export interface FormSchema {
  schema: any;
  name: string;
}

export interface ScoutingData {
  data: any;
  schema: any;
  formName: string;
  eventCode: string | null | undefined;
  teamId: string | null | undefined;
}

export interface MatchData extends ScoutingData {
  matchNumber: number;
  teamNumber: number;
  teamLocation: number;
}

export interface PitData extends ScoutingData {
  teamNumber: number;
}

export interface FieldDefinition {
  type:
    | 'text'
    | 'number'
    | 'date'
    | 'select'
    | 'boolean'
    | 'matrix'
    | 'photo'
    | 'header';
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
  matrixRows?: MatrixRow[];
  maxRating?: number;
}

export interface MatrixRow {
  id: string;
  label: string;
  value: number;
}

export interface ScoutingResponse {
  success: boolean;
  isLocal: boolean;
  error?: any;
}

export type ScoutingType = 'match' | 'pit';
