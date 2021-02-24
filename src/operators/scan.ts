import { ARGS, VARS } from "../utils/constants";
import { Role, Mode, Tuple } from "../utils/common";
import { lookup } from "../utils/registry";
import { argsFactory, execClosure, closureFactory, sinkFactory } from "../utils/utils";
import { tgetv, tupleNew, tsett, tgett, tget } from "../utils/tuple-utils";

const REDUCER = 0;
const SEED = 1;

const SINK = 0;
const ACC = 1;

const scanTB = (state: Tuple) => (mode: Mode, d: any) => {
    const args = tgett(state, ARGS);
    const vars = tgett(state, VARS);
    if (mode === Mode.run) {
        tsett(vars, ACC, lookup(tgetv(args, REDUCER))(tget(vars, ACC), d), false);
        execClosure(tgett(vars, SINK))(Mode.run, tget(vars, ACC));
    } else {
        execClosure(tgett(vars, SINK))(mode, d);
    }
}

const cproc = closureFactory(scanTB, Role.sink, (args: any) => {
    return tupleNew(0, tgetv(args, SEED), 0, 0);
});

const sf = sinkFactory(cproc, Role.none);

export const scan = argsFactory(sf);

// function scan(reducer, seed) {
//     let hasAcc = arguments.length === 2;
//     return source => (start, sink) => {
//       if (start !== 0) return;
//       let acc = seed;
//       source(0, (t, d) => {
//         if (t === 1) {
//           acc = hasAcc ? reducer(acc, d) : ((hasAcc = true), d);
//           sink(1, acc);
//         } else sink(t, d);
//       });
//     };
//   }