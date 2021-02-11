import { CB, CBArgs, CBPrototype, CBVars, Reducer } from "./common";

export interface ScanArgs extends CBArgs {
    reducer: Reducer;
    seed: any
}

export interface ScanVars extends CBVars {
    acc: any;
}

export interface ScanPrototype extends CBPrototype {
    args: ScanArgs;
    hasAcc: boolean;
    source?: CB;
}

export interface ScanInstance extends ScanPrototype {
    sink: CB;
    vars: ScanVars;
}

