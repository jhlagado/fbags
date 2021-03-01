import { ARGS, Mode, Role, SINK, VARS } from "../utils/constants";
import { Tuple, } from "../utils/types";
import { lookup } from "../utils/registry";
import { argsFactory, closureFactory, sinkFactory, execClosure } from "../utils/closure-utils";
import { tgetv, tupleNew, tsett, tgett, tget, isOwned, tupleDestroy } from "../utils/tuple-utils";

const REDUCER = 0;
const SEED = 1;


const ACC = 1;

const scanTB = (state: Tuple) => (mode: Mode, d: any) => {
    const args = tgett(state, ARGS);
    let vars = tgett(state, VARS);
    if (!vars) {
        vars = tupleNew(tgetv(args, SEED), 0, 0, 0);
        tsett(state, VARS, vars, false)
    }
    const sink = tgett(state, SINK);
    if (mode === Mode.data) {
        tsett(vars, ACC, lookup(tgetv(args, REDUCER))(tget(vars, ACC), d), false);
        execClosure(sink,Mode.data, tget(vars, ACC));
        if (!isOwned(sink)) tupleDestroy(sink);
    } else {
        execClosure(sink,mode, d);
        if (!isOwned(sink)) tupleDestroy(sink);
    }
}

const cproc = closureFactory(scanTB, Role.sink);

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