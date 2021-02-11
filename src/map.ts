import { CB, closure } from "./common";
import { MapInstance, MapPrototype, MapArgs } from "./map-types";
import { Mode } from "./common";

const mapTB = (state: MapInstance) => (mode: Mode, d: any)=> {
    state.sink(mode, mode === Mode.run ? state.args.mapper(d) : d)
}

const mapCB = (state: MapPrototype) => (mode: Mode, sink: any) => {
    if (mode !== Mode.init) return;
    const instance: MapInstance = {
        ...state,
        sink,
        vars: {}
    }
    const tb = closure(instance, mapTB);
    instance.source?.(Mode.init, tb);
}

const mapSinkFactory = (state: MapPrototype) => (source: CB) => {
    const prototype: MapPrototype = {
        ...state,
        source,
    }
    return closure(prototype, mapCB);
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