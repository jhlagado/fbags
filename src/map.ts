import { CB, closure } from "./common";
import { MapInstance, MapPrototype, MapArgs } from "./map-types";
import { Mode } from "./common";

function mapTB(this: MapInstance, mode: Mode, d: any) {
    this.sink(mode, mode === Mode.run ? this.args.mapper(d) : d)
}

function mapCB(this: MapPrototype, mode: Mode, sink: any) {
    if (mode !== Mode.init) return;
    const instance: MapInstance = {
        ...this,
        sink,
        vars: {}
    }
    const tb = closure(instance, mapTB);
    instance.source?.(Mode.init, tb);
}

function mapSinkFactory(this: MapPrototype, source: CB) {
    const prototype: MapPrototype = {
        ...this,
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