import { argsFactory, cbFactory, sinkFactory } from "./common";
import { ScanState, ScanArgs, ScanVars } from "./scan-types";
import { Mode } from "./common";

const scanTB = (state: ScanState) => (mode: Mode, d: any) =>{
    const vars = state.vars!;
    if (mode === Mode.run) {
        vars.acc = state.args.reducer(vars.acc, d);
        state.sink?.(Mode.run, vars.acc);
    } else {
        state.sink?.(mode, d);
    }
}

const cbf = cbFactory<ScanArgs, ScanVars>((args)=>({ acc: args.seed }), scanTB);

const sf = sinkFactory<ScanArgs, ScanVars>(cbf);

export const scan = argsFactory<ScanArgs, ScanVars>(sf);

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