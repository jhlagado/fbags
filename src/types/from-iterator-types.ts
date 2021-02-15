import { State } from "./common";

export interface FromIteratorArgs  {
    iterator: Iterator<number>
}

export interface FromIteratorVars   {
    inloop: boolean;
    got1: boolean;
    completed: boolean;
    done: boolean;
}

export type FromIteratorState = State<FromIteratorArgs, FromIteratorVars>

