import { CB, Role } from "./common";
import { Mode } from "./common";
import { argsFactory, cbExec, cbFactory, sinkFactory } from "./utils";

const scanTB = (state: CB) => (mode: Mode, d: any) =>{
    const vars = state.vars!;
    if (mode === Mode.run) {
        vars.acc = state.args.reducer(vars.acc, d);
        cbExec(vars.sink)(Mode.run, vars.acc);
    } else {
        cbExec(vars.sink)(mode, d);
    }
}

const cbf = cbFactory((args)=>({ acc: args.seed }), scanTB,  Role.sink);

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