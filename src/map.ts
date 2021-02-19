import { Role, Mode, Closure, ARGS, VARS, } from "./common";
import { argsFactory, execClosure, closureFactory, sinkFactory } from "./utils";

type VarsTuple = [Closure, undefined, undefined, undefined]
const SINK = 0;

const mapTB = (state: Closure) => (mode: Mode, d: any) => {
    const mapper = state[ARGS] as Function;
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

