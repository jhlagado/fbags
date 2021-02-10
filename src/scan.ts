import { CB, closure } from "./common";
import { ScanInstance, ScanPrototype, ScanArgs } from "./scan-types";
import { Mode } from "./common";

function scanTB(this: ScanInstance, mode: Mode, d: any) {
    if (mode === Mode.run) {
        this.vars.acc = this.args.hasAcc ? this.args.reducer(this.vars.acc, d) : ((this.args.hasAcc = true), d);
        this.sink(Mode.run, this.vars.acc);
    } else {
        this.sink(mode, d);
    }
}

function scanCB(this: ScanPrototype, mode: Mode, sink: any) {
    if (mode !== Mode.init) return;
    const instance: ScanInstance = {
        ...this,
        sink,
        vars: {
            acc: this.args.seed
        }
    }
    const tb = closure(instance, scanTB);
    instance.source?.(Mode.init, tb);
}

function scanSinkFactory(this: ScanPrototype, source: CB) {
    const prototype: ScanPrototype = {
        ...this,
        source,
    }
    return closure(prototype, scanCB);
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