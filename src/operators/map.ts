import { ARGS, VARS } from "../utils/constants";
import { Role, Mode, Tuple } from "../utils/common";
import { lookup } from "../utils/registry";
import { argsFactory, execClosure, closureFactory, sinkFactory } from "../utils/closure-utils";
import { tgett, tgetv } from "../utils/tuple-utils";

const SINK = 0;

const mapTB = (state: Tuple) => (mode: Mode, d: any) => {
    const mapper = lookup(tgetv(state, ARGS)) as Function;
    const vars = tgett(state, VARS);
    execClosure(tgett(vars, SINK))(mode, mode === Mode.run ? mapper(d) : d)
}

const cproc = closureFactory(mapTB, Role.sink, undefined);

const sf = sinkFactory(cproc, Role.none);

export const map = argsFactory(sf);

// const map = f => source => (start, sink) => {
//     if (start !== 0) return;
//     source(0, (t, d) => {
//       sink(t, t === 1 ? f(d) : d)
//     });
//   };

