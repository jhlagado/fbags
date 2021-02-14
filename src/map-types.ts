import { State, Mapper } from "./common";

export interface MapArgs {
    mapper: Mapper;
}

export interface MapVars {
}

export type MapState = State<MapArgs, MapVars>

