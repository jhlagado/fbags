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

export type Dict = {
    [key: string]: any;
};

export type CBArgs = Dict | number;

export type CBVars = Dict & {
    sink?: CB;
} | number;

export interface CB {
    args: CBArgs,
    vars?: CBVars,
    source?: CB,
    proc: CBProc | CBSProc;
}

export type CBProc = (state: CB) => (mode: Mode, d?: any) => CB | void;
export type CBSProc = (state: CB) => (source: CB) => CB;

export type VarsFunction = (args: CBArgs) => CBVars;
export type Vars = CBVars | VarsFunction;

export type Effect = (value: string) => void;
export type Mapper = (value: any) => any;
export type Reducer = (acc: any, value: any) => any;

export type Tuple = [CBArgs, CBVars, CB, CBProc | CBSProc];
