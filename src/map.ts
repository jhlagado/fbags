import { CB, closure } from "./common";
import { MapInstance, MapPrototype, MapArgs } from "./map-types";
import { Mode } from "./common";

const mapTB = (state: MapInstance) => (mode: Mode, d: any)=> {
    state.sink(mode, mode === Mode.run ? state.args.mapper(d) : d)
}

const mapCB = (state: MapInstance) => (mode: Mode, sink: any) => {
    if (mode !== Mode.init) return;
    const instance: MapInstance = {
        ...state,
        sink,
    }
    const tb = closure(instance, mapTB);
    instance.source?.(Mode.init, tb);
}

const mapSinkFactory = (state: MapInstance) => (source: CB) => {
    const instance: MapInstance = {
        ...state,
        source,
        vars: {}
    }
    return closure(instance, mapCB);
}

export function map(args: MapArgs) {
    const prototype: MapPrototype = { args };
    return closure(prototype, mapSinkFactory);
}


// const map = f => source => (start, sink) => {
//     if (start !== 0) return;
//     source(0, (t, d) => {
//       sink(t, t === 1 ? f(d) : d)
//     });
//   };