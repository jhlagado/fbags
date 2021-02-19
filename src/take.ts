import { CProc, Role, Mode, Closure, ARGS, SOURCE, VARS } from "./common";
import { closure, closureFactory, sinkFactory, argsFactory, execClosure } from "./utils";

type VarsTuple = [Closure, number, boolean, undefined]
const SINK = 0;
const TAKEN = 1;
const END = 2;

const tbf: CProc = (state) => (mode, d) => {
    const max = state[ARGS] as number;
    const vars = state[VARS] as VarsTuple;
    const source = state[SOURCE];
    if (mode === Mode.stop) {
        vars[END] = true;
        execClosure(source as Closure)(mode, d);
    } else if (vars[TAKEN] < max) {
        execClosure(source as Closure)(mode, d);
    }
}

const sourceTBF: CProc = (state) => (mode, d) => {
    const max = state[ARGS] as number;
    const vars = state[VARS] as VarsTuple;
    const sink = vars[SINK] as Closure;
    switch (mode) {
        case Mode.start:
            state[SOURCE] = d;
            execClosure(sink)(0, closure(state, tbf));
            break;
        case Mode.run:
            if (vars[TAKEN] < max) {
                vars[TAKEN]++;
                execClosure(sink)(Mode.run, d);
                if (vars[TAKEN] === max && !vars[END]) {
                    vars[END] = true
                    if (state[SOURCE]) execClosure(state[SOURCE] as Closure)(Mode.stop);
                    execClosure(sink)(Mode.stop);
                }
            }

            break;
        case Mode.stop:
            execClosure(sink)(Mode.stop, d);
            break;
    }
}

const cproc = closureFactory(sourceTBF, Role.sink, [undefined, 0, false]);

const sf = sinkFactory(cproc, Role.none);

export const take = argsFactory(sf);

// const take = max => source => (start, sink) => {
//     if (start !== 0) return;
//     let taken = 0;
//     let sourceTalkback;
//     let end;
//     function talkback(t, d) {
//         if (t === 2) {
//             end = true;
//             sourceTalkback(t, d);
//         } else if (taken < max) sourceTalkback(t, d);
//     }
//     source(0, (t, d) => {
//         if (t === 0) {
//             sourceTalkback = d;
//             sink(0, talkback);
//         } else if (t === 1) {
//             if (taken < max) {
//                 taken++;
//                 sink(t, d);
//                 if (taken === max && !end) {
//                     end = true
//                     sourceTalkback(2);
//                     sink(2);
//                 }
//             }
//         } else {
//             sink(t, d);
//         }
//     });
// };

