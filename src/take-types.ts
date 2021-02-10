import { CB, CBArgs, CBPrototype, CBVars } from "./common";

export interface TakeArgs extends CBArgs {
    max: number;
}

export interface TakeVars extends CBVars {
    taken: number;
    sourceTalkback?: CB;
    end: boolean;
}

export interface TakePrototype extends CBPrototype {
    args: TakeArgs;
    source?: CB;
}

export interface TakeInstance extends TakePrototype {
    sink: CB;
    vars: TakeVars;
}

