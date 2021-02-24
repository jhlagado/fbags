import { ARGS, FALSE, SOURCE, TRUE, VARS } from "../utils/constants";
import { Role, Mode, Tuple, CProc } from "../utils/common";
import { closure, closureFactory, sinkFactory, argsFactory, execClosure } from "../utils/utils";
import { tget, tupleNew, tset } from "../utils/tuple-utils";

const SINK = 0;
const TAKEN = 1;
const END = 2;

const tbf: CProc = (state) => (mode, d) => {
    const max = tget(state, ARGS) as number;
    const vars = tget(state, VARS) as Tuple;
    const source = tget(state, SOURCE);
    if (mode === Mode.stop) {
        tset(vars, END, TRUE, false);
        execClosure(source as Tuple)(mode, d);
    } else if (tget(vars, TAKEN) < max) {
        execClosure(source as Tuple)(mode, d);
    }
}

const sourceTBF: CProc = (state) => (mode, d) => {
    const max = tget(state, ARGS) as number;
    const vars = tget(state, VARS) as Tuple;
    const sink = tget(vars, SINK) as Tuple;
    switch (mode) {
        case Mode.start:
            tset(state, SOURCE, d, false);
            execClosure(sink)(0, closure(state, tbf));
            break;
        case Mode.run:
            const taken = tget(vars, TAKEN) as number;
            if (taken < max) {
                tset(vars, TAKEN, taken + 1, false);
                execClosure(sink)(Mode.run, d);
                if (tget(vars, TAKEN) === max && !tget(vars, END)) {
                    tset(vars, END, TRUE, false);
                    if (tget(state, SOURCE)) execClosure(tget(state, SOURCE) as Tuple)(Mode.stop);
                    execClosure(sink)(Mode.stop);
                }
            }

            break;
        case Mode.stop:
            execClosure(sink)(Mode.stop, d);
            break;
    }
}

const cproc = closureFactory(sourceTBF, Role.sink, tupleNew(0, 0, FALSE, 0));

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

