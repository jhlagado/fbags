import { CB, Dict, Role } from "./common";
import { Mode } from "./common";
import { argsFactory, cbExec, cbFactory, sinkFactory } from "./utils";

const scanTB = (state: CB) => (mode: Mode, d: any) => {
    const args = state.args as Dict;
    const vars = state.vars as Dict;
    if (mode === Mode.run) {
        vars.acc = args.reducer(vars.acc, d);
        cbExec(vars.sink)(Mode.run, vars.acc);
    } else {
        cbExec(vars.sink)(mode, d);
    }
}

const cbf = cbFactory(scanTB, Role.sink, (args:Dict) => { 
    return ({ acc: args.seed }) 
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