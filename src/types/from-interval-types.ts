import { State } from "./common";

export interface FromIntervalArgs {
    period: number,
}

export interface FromIntervalVars {
    i: number,
    id?: any,
}

export type FromIntervalState = State<FromIntervalArgs, FromIntervalVars>

