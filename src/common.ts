export enum Mode {
    init = 0,
    run = 1,
    destroy = 2,
}

export type CB = (mode: Mode, arg?: any) => void;
export type CBF = (mode: Mode, arg?: any) => void;

export interface CBArgs {
}
export interface CBVars {
}
export interface CBPrototype {
    args: CBArgs;
}

export interface CBInstance extends CBPrototype {
    vars: CBVars;
}


export type SinkFactory = (source: CB) => CB | void;

export type Effect = (value: string) => void;
export type Mapper = (value: any) => any;
export type Reducer = (acc: any, value: any) => any;

export const closure = (state: any, cbf: any): any => cbf.bind(state) 
