import { CB, CBArgs, CBPrototype, CBVars } from "./common";

export interface FromIteratorArgs extends CBArgs {
    iterator: Iterator<number>
}

export interface FromIteratorVars  extends CBVars {
    inloop: boolean;
    got1: boolean;
    completed: boolean;
    done: boolean;
}

export interface FromIteratorPrototype  extends CBPrototype  {
    args: FromIteratorArgs;
    sink?: CB;
}

export interface FromIteratorInstance extends FromIteratorPrototype {
    vars: FromIteratorVars;
}

