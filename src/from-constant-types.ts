import { CB, CBArgs, CBPrototype, CBVars } from "./common";

export interface FromConstantArgs extends CBArgs  {
    constant: any;
}

export interface FromConstantVars  extends CBVars {
}

export interface FromConstantPrototype   extends CBPrototype {
    args: FromConstantArgs;
}

export interface FromConstantInstance extends FromConstantPrototype {
    sink: CB;
    vars: FromConstantVars;
}

