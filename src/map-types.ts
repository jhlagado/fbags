import { CB, CBArgs, CBPrototype, CBVars, Mapper } from "./common";

export interface MapArgs extends CBArgs  {
    mapper: Mapper;
}

export interface MapVars  extends CBVars {
    talkback?: CB;
}

export interface MapPrototype   extends CBPrototype {
    args: MapArgs;
    source?: CB;
}

export interface MapInstance extends MapPrototype {
    sink: CB;
    vars: MapVars;
}

