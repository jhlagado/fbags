import { CB, CBArgs, CBVars } from "./common";

export interface FromConstantArgs extends CBArgs  {
    constant: any;
}

export interface FromConstantVars  extends CBVars {
}

export interface FromConstantInstance {
    args: FromConstantArgs;
    sink?: CB;
    vars: FromConstantVars;
}

