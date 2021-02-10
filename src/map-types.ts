import { CB, Mapper } from "./common";

export interface MapArgs {
    mapper: Mapper;
}

export interface MapVars {
    talkback?: CB;
}

export interface MapPrototype {
    args: MapArgs;
    source?: CB;
}

export interface MapInstance extends MapPrototype {
    sink: CB;
    vars: MapVars;
}

