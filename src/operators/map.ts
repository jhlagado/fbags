import { ARGS, Mode, Role, SINK } from "../utils/constants";
import {  Tuple } from "../utils/types";
import { lookup } from "../utils/registry";
import { argsFactory, execClosure, closureFactory, sinkFactory } from "../utils/closure-utils";
import { tgett, tgetv } from "../utils/tuple-utils";

const mapTB = (state: Tuple) => (mode: Mode, d: any) => {
    const mapper = lookup(tgetv(state, ARGS)) as Function;
    const sink = tgett(state, SINK);
    execClosure(sink)(mode, mode === Mode.data ? mapper(d) : d)
}

const cproc = closureFactory(mapTB, Role.sink);

const sf = sinkFactory(cproc, Role.none);

export const map = argsFactory(sf);

// const map = f => source => (start, sink) => {
//     if (start !== 0) return;
//     source(0, (t, d) => {
//       sink(t, t === 1 ? f(d) : d)
//     });
//   };

