import { Effect, CB } from "./common";

export interface ForEachArgs {
    effect: Effect
}

export interface ForEachVars {
    talkback?: CB;
}

export interface ForEachPrototype {
    args: ForEachArgs;
    source?: CB;
}

export interface ForEachInstance extends ForEachPrototype {
    vars: ForEachVars;
}

