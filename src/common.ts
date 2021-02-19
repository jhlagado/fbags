export enum Mode {
    start = 0,
    run = 1,
    stop = 2,
}

export enum Role {
    none = 0,
    source = 1,
    sink = 2,
}

export type Scalar = number | boolean;
export type Tuple = [Elem, Elem, Elem, Elem];
export type Elem = Scalar | Tuple | Closure | Function | Iterator<any> | undefined;

export type Closure = [Elem, Elem, Elem, Function?];
export const ARGS = 0;
export const VARS = 1;
export const SOURCE = 2;
export const SINK2 = 2;
export const PROC = 3;

export type CProc = (state: Closure) => (mode: Mode, d?: any) => Closure | void;
export type CSProc = (state: Closure) => (source: Closure) => Closure;

export type VarsFunction = (args: Elem) => Elem;
export type Vars = Elem | VarsFunction;

export type Effect = (value: string) => void;
export type Mapper = (value: any) => any;
export type Reducer = (acc: any, value: any) => any;

export const EMPTY_TUPLE = [undefined, undefined, undefined, undefined];