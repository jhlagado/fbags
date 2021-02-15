import { Effect, CB, State } from "./common";

export interface ForEachArgs {
    effect: Effect
}

export interface ForEachVars {
    talkback?: CB;
}

export type ForEachState = State<ForEachArgs, ForEachVars>

