import { ARGS, CB, Role, VARS } from "./common";
import { Mode } from "./common";
import { argsFactory, cbExec, cbFactory, sinkFactory } from "./utils";

type ArgsTuple = [Function, number, undefined, undefined]
const REDUCER = 0;
const SEED = 1;

type VarsTuple = [CB, any, undefined, undefined]
const SINK = 0;
const ACC = 1;

const scanTB = (state: CB) => (mode: Mode, d: any) => {
    const args = state[ARGS] as ArgsTuple;
    const vars = state[VARS] as VarsTuple;
    if (mode === Mode.run) {
        vars[ACC] = args[REDUCER](vars[ACC], d);
        cbExec(vars[SINK])(Mode.run, vars[ACC]);
    } else {
        cbExec(vars[SINK])(mode, d);
    }
}

const cbf = cbFactory(scanTB, Role.sink, (args: ArgsTuple) => {
    return [undefined, args[SEED]]
});

const sf = sinkFactory(cbf, Role.none);

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