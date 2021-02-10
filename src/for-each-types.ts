import { Effect, CB, CBPrototype, CBVars, CBArgs } from "./common";

export interface ForEachArgs extends CBArgs {
    effect: Effect
}

export interface ForEachVars  extends CBVars {
    talkback?: CB;
}

export interface ForEachPrototype  extends CBPrototype {
    args: ForEachArgs;
    source?: CB;
}

export interface ForEachInstance extends ForEachPrototype {
    vars: ForEachVars;
}

