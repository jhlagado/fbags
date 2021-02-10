import { CB } from "./common";

export interface FromIteratorArgs {
    iterator: Iterator<number>
}

export interface FromIteratorVars {
    inloop: boolean;
    got1: boolean;
    completed: boolean;
    done: boolean;
}

export interface FromIteratorPrototype {
    args: FromIteratorArgs;
    sink?: CB;
}

export interface FromIteratorInstance extends FromIteratorPrototype {
    vars: FromIteratorVars;
}

