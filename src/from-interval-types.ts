import { CB, CBArgs, CBPrototype, CBVars } from "./common";

export interface FromIntervalArgs extends CBArgs {
    period: number,
}

export interface FromIntervalVars extends CBVars {
    i: number,
    id?: any,
}

export interface FromIntervalPrototype extends CBPrototype {
    args: FromIntervalArgs;
}

export interface FromIntervalInstance extends FromIntervalPrototype {
    sink: CB;
    vars: FromIntervalVars;
}

