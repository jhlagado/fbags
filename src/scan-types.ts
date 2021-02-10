import { CB, Reducer } from "./common";

export interface ScanArgs {
    reducer: Reducer;
    seed: any
    hasAcc?: boolean;
}

export interface ScanVars {
    acc: any;
}

export interface ScanPrototype {
    args: ScanArgs;
    hasAcc: boolean;
    source?: CB;
}

export interface ScanInstance extends ScanPrototype {
    sink: CB;
    vars: ScanVars;
}

