import { ARGS, VARS } from "./constants";
import { Role, Mode, Tuple } from "./common";
import { lookup } from "./registry";
import { argsFactory, execClosure, closureFactory, sinkFactory } from "./utils";

type VarsTuple = [Tuple, 0, 0, 0]
const SINK = 0;

const mapTB = (state: Tuple) => (mode: Mode, d: any) => {
    const mapper = lookup(state[ARGS] as number) as Function;
    const vars = state[VARS] as VarsTuple;
    execClosure(vars[SINK])(mode, mode === Mode.run ? mapper(d) : d)
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

