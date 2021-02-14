import { CB, CBArgs, CBVars, State } from "./common";

export interface TakeArgs extends CBArgs {
    max: number;
}

export interface TakeVars extends CBVars {
    taken: number;
    sourceTalkback?: CB;
    end: boolean;
}

export type TakeState = State<TakeArgs, TakeVars>;
