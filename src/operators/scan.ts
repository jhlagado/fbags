import { ARGS, VARS } from "../utils/constants";
import { Role, Mode, Tuple } from "../utils/common";
import { lookup } from "../utils/registry";
import { argsFactory, execClosure, closureFactory, sinkFactory } from "../utils/utils";
import { tupleGet, tupleSet } from "../utils/tuple-utils";

const REDUCER = 0;
const SEED = 1;

const SINK = 0;
const ACC = 1;

const scanTB = (state: Tuple) => (mode: Mode, d: any) => {
    const args = tupleGet(state, ARGS) as Tuple;
    const vars = tupleGet(state, VARS) as Tuple;
    if (mode === Mode.run) {
        tupleSet(vars, ACC, lookup(tupleGet(args, REDUCER) as number)(vars[ACC], d), false);
        execClosure(tupleGet(vars, SINK) as Tuple)(Mode.run, vars[ACC]);
    } else {
        execClosure(tupleGet(vars, SINK) as Tuple)(mode, d);
    }
}

const cproc = closureFactory(scanTB, Role.sink, (args: any) => {
    return [0, tupleGet(args, SEED) as number, 0, 0]
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