import { State } from "./common";

export interface FromConstantArgs   {
    constant: any;
}

export interface FromConstantVars   {
}

export type FromConstantState = State<FromConstantArgs, FromConstantVars>

