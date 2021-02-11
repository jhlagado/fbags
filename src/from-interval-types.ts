import { CB, CBArgs, CBVars } from "./common";

export interface FromIntervalArgs extends CBArgs {
    period: number,
}

export interface FromIntervalVars extends CBVars {
    i: number,
    id?: any,
}

export interface FromIntervalInstance {
    args: FromIntervalArgs;
    sink?: CB;
    vars: FromIntervalVars;
}

