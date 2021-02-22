import { ARGS, VARS } from "./constants";
import { Role, Mode, Closure, Tuple } from "./common";
import { lookupObject } from "./objects";
import { argsFactory, execClosure, closureFactory, sinkFactory } from "./utils";

const REDUCER = 0;
const SEED = 1;

type VarsTuple = Tuple;
const SINK = 0;
const ACC = 1;

const scanTB = (state: Closure) => (mode: Mode, d: any) => {
    const args = state[ARGS] as Tuple;
    const vars = state[VARS] as VarsTuple;
    if (mode === Mode.run) {
        vars[ACC] = lookupObject(args[REDUCER] as number)(vars[ACC], d);
        execClosure(vars[SINK] as Tuple)(Mode.run, vars[ACC]);
    } else {
        execClosure(vars[SINK] as Tuple)(mode, d);
    }
}

const cproc = closureFactory(scanTB, Role.sink, (args: any) => {
    return [0, args[SEED] as number, 0, 0] 
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