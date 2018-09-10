import { ChalkConfigInterface, LoggerConfigInterface, PrototypeInterface, RestrictedInheritanceInterface, RestrictedInterface } from './interfaces';

export type CloneTypesSignature = (prototype: PrototypeInterface, typesList: TypesListType, restricted: RestrictedInterface, name?: string) => object;

export type DeSymbolize = (name: string | symbol) => string;

export type LoggerSignature<T> = (message?: string, caller?: string, subject?: string, chalkConfig?: ChalkConfigInterface) => T;

export type RestrictedKeysType = string[];
export type RestrictedTypesType = symbol[];
export type RestrictedSignature<T> = (restricted?: T) => T;
export type RestrictedLoggerSignature<T> = (restricted?: T, message?: string, caller?: string, subject?: string, chalkConfig?: ChalkConfigInterface) => {};
export type RestrictedKeysSignature = RestrictedSignature<string[]>;
export type RestrictedTypesSignature = RestrictedSignature<symbol[]>;

export type InheritanceSignature = (
  name: string,
  restricted: RestrictedInheritanceInterface,
  prototype?: PrototypeInterface,
  loggerConfig?: LoggerConfigInterface
) => {};
export type Signature = (
  name: string,
  restricted: RestrictedInterface,
  prototype?: PrototypeInterface,
  loggerConfig?: LoggerConfigInterface
) => PrototypeInterface;

export type SignaturePrototype = (name: string, restricted: RestrictedInterface, prototype: PrototypeInterface, loggerConfig?: LoggerConfigInterface) => {};

export type MethodSignature<T> = (prototype: T, message?: string, caller?: string, subject?: string) => {};

export type StrategySignature = (prototype: PrototypeInterface, restricted: RestrictedInterface, name: string) => {};

export type Symbolize = (name: string | symbol) => symbol;

export type TypesListType = symbol[];

export type ValidateSignature = (fileName: string, inputName: string, input: any) => void;
