import { CB, closure } from "./common";
import { ScanInstance, ScanPrototype, ScanArgs } from "./scan-types";
import { Mode } from "./common";

const scanTB = (state: ScanInstance) => (mode: Mode, d: any) =>{
    if (mode === Mode.run) {
        state.vars.acc = state.hasAcc ? state.args.reducer(state.vars.acc, d) : ((state.hasAcc = true), d);
        state.sink(Mode.run, state.vars.acc);
    } else {
        state.sink(mode, d);
    }
}

const scanCB = (state: ScanInstance) => (mode: Mode, sink: any) => {
    if (mode !== Mode.init) return;
    const instance: ScanInstance = {
        ...state,
        sink,
    }
    const tb = closure(instance, scanTB);
    instance.source?.(Mode.init, tb);
}

const scanSinkFactory = (state: ScanInstance) => (source: CB) => {
    const instance: ScanInstance = {
        ...state,
        source,
        vars: {
            acc: state.args.seed
        }
    }
    return closure(instance, scanCB);
}

export function scan(args: ScanArgs) {
    const hasAcc = arguments.length === 2;
    const prototype: ScanPrototype = { args, hasAcc };
    return closure(prototype, scanSinkFactory);
}


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