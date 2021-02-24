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

export enum TPolicy {
    ref = 0,
    move = 1,
    clone = 2,
}

export type Elem = number | Tuple;
export type Tuple = [Elem, Elem, Elem, Elem] & {
    owner?: Owner, 
    mask?: number,
    proc: CProc | CSProc,
};

export type CProc = (state: Tuple) => (mode: Mode, d?: any) => Tuple | void;
export type CSProc = (state: Tuple) => (source: Tuple) => Tuple;

export type VarsFunction = (args: Elem) => Elem;

export type Effect = (value: string) => void;
export type Mapper = (value: any) => any;
export type Reducer = (acc: any, value: any) => any;

export type Owner = {
    container: Tuple;
    offset: number;
}

