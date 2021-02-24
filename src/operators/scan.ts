import { ARGS, SINK, VARS } from "../utils/constants";
import { Role, Mode, Tuple, TPolicy } from "../utils/common";
import { lookup } from "../utils/registry";
import { argsFactory, execClosure, closureFactory, sinkFactory } from "../utils/closure-utils";
import { tgetv, tupleNew, tsett, tgett, tget } from "../utils/tuple-utils";

const REDUCER = 0;
const SEED = 1;


const ACC = 1;

const scanTB = (state: Tuple) => (mode: Mode, d: any) => {
    const args = tgett(state, ARGS);
    let vars = tgett(state, VARS);
    if (!vars) {
        vars = tupleNew(0, 0, 0, 0);
        tsett(state, VARS, vars, TPolicy.ref)
    }
    if (mode === Mode.run) {
        tsett(vars, ACC, lookup(tgetv(args, REDUCER))(tget(vars, ACC), d), TPolicy.ref);
        execClosure(tgett(state, SINK))(Mode.run, tget(vars, ACC));
    } else {
        execClosure(tgett(state, SINK))(mode, d);
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