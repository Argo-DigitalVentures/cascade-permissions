import { _clone, _propId } from '../lib/symbols';
import { RestrictedKeysSignature, RestrictedKeysType, RestrictedTypesSignature, Signature } from './types';

export interface ChalkConfigInterface {
  color: string;
  bold: boolean;
}

export interface LoggerConfigInterface {
  caller?: string;
  chalkConfig?: ChalkConfigInterface;
  message?: string;
  subject?: string;
}

export interface RestrictedInheritanceInterface {
  restrictedKeys?: Array<string | RestrictedKeys>;
  restrictedTypes?: string[];
}
export interface RestrictedInterface {
  restrictedKeys?: string[];
  restrictedTypes?: symbol[];
}

export interface RestrictedKeys {
  [index: string]: RestrictedKeysType;
}

export interface PropertyDescriptorInterface<T> {
  configurable?: boolean;
  enumerable?: boolean;
  value: T;
  writable?: boolean;
  get?(): any;
  set?(v: any): void;
}

export interface SymbolizedInterface<T> {
  [index: string]: T;
}
export interface CloneInterface {
  [index: string]: {
    configurable?: boolean;
    enumerable?: boolean;
    value: Signature;
    writable?: boolean;
    get?(): any;
    set?(v: any): void;
  };
}
export interface PrototypeInterface {
  // _permittedTypes: RestrictedTypesSignature;
  // [index: string]: {
  //   configurable?: boolean;
  //   enumerable?: boolean;
  //   value: Signature | RestrictedTypesSignature | RestrictedKeysSignature;
  //   writable?: boolean;
  //   get?(): Signature | RestrictedTypesSignature | RestrictedKeysSignature;
  //   set?(v: any): void;
  // };
  [index: string]: () => RestrictedTypesSignature;
  // [index: string]: () => Signature | RestrictedTypesSignature | RestrictedKeysSignature;
}
