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

export interface State<A, V> {
    args: A,
    sink?: CB,
    source?: CB,
    vars?: V,
}

export type CB = (mode: Mode, arg?: any) => void;
export type CBS = (source: CB) => CB;
export type CBF<A, V> = (state: State<A, V>) => CB;
export type CBSF<A, V> = (state: State<A, V>) => CBS;

export type VarsFunction<A, V> = (args: A) => V;
export type Vars<A, V> = V | VarsFunction<A, V>;

export type Effect = (value: string) => void;
export type Mapper = (value: any) => any;
export type Reducer = (acc: any, value: any) => any;

