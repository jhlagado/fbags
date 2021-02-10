import { CB } from "./common";

export interface TakeArgs {
    max: number;
}

export interface TakeVars {
    taken: number;
    sourceTalkback?: CB;
    end: boolean;
}

export interface TakePrototype {
    args: TakeArgs;
    source?: CB;
}

export interface TakeInstance extends TakePrototype {
    sink: CB;
    vars: TakeVars;
}

