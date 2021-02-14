import { State } from "./common";

export interface TakeArgs {
    max: number;
}

export interface TakeVars {
    taken: number;
    end: boolean;
}

export type TakeState = State<TakeArgs, TakeVars>;
