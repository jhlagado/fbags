import { Reducer, State } from "./common";

export interface ScanArgs {
    reducer: Reducer;
    seed: any
}

export interface ScanVars {
    acc: any;
}

export type ScanState = State<ScanArgs, ScanVars>;

