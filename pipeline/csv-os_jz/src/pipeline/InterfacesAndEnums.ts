/**
 * Value Object Decorator For Files That Undergo Testing
 * Data Contains ... Well Data
 * Info Contains Warnings
 * Erro Contains ... Well Errors
 */
export interface iError {
  action: eAction;
  element: eElement;
  constraint: eConstraint;
  prop: string;
  value: string;
}

/**
 * Value Object Decorator For Files That Undergo Testing
 * Data Contains ... Well Data
 * Info Contains Warnings
 * Erro Contains ... Well Errors
 */
export interface iTest {
  data: any;
  info: Array<iError>;
  error: Array<iError>;
}

export interface iSheetLog {
  sheet: eSheet;
  file: string;
  error: Array<iError>;
  info: Array<iError>;
}

export interface iField {
  name: string;
  type: eDataType;
  values: Array<any>;
}

export enum eDataType {
  Number = 1 << 0,
  String = 1 << 1,
  ID = 1 << 2,
  NA = 1 << 3
}
export enum eSheet {
  PATIENT = 1 << 0,
  SAMPLE = 1 << 1,
  MATRIX = 1 << 2,
  EVENT = 1 << 3,
  MUTATION = 1 << 4
}
export enum eConstraint {
  UNIQUE = 1 << 0,
  REQUIRED = 1 << 1,
  INVALID_VALUE = 1 << 2,
  SINGLE_VALUE = 1 << 3, // 8
  NON_NUMERIC = 1 << 4, // 16
  UNKNOWN_TYPE = 1 << 5,
  UNINFORMATIVE = 1 << 6
}
export enum eAction {
  REM = 1 << 0,
  MOD = 1 << 1
}
export enum eElement {
  SHEET = 1 << 0,
  COLUMN = 1 << 1,
  ROW = 1 << 2,
  GENE = 1 << 4
}
