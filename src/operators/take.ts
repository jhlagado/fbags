import { ARGS, Mode, Role, SINK, SOURCE, TRUE, VARS } from "../utils/constants";
import { CProc, } from "../utils/types";
import { closure, closureFactory1, sinkFactory, argsFactory, execClosure } from "../utils/closure-utils";
import { tgett, tgetv, tsett, tsetv, tupleNew } from "../utils/tuple-utils";


const TAKEN = 1;
const END = 2;

const tbf: CProc = (state) => (mode, d) => {
    const max = tgetv(state, ARGS);
    const vars = tgett(state, VARS);
    const source = tgett(state, SOURCE);
    if (mode === Mode.stop) {
        tsetv(vars, END, TRUE);
        execClosure(source)(mode, d);
    } else if (tgetv(vars, TAKEN) < max) {
        execClosure(source)(mode, d);
    }
}

const sourceTBF: CProc = (state) => (mode, d) => {
    const max = tgetv(state, ARGS);
    let vars = tgett(state, VARS);
    if (!vars) {
        vars = tupleNew(0, 0, 0, 0);
        tsett(state, VARS, vars, false)
    }
    const sink = tgett(state, SINK);
    switch (mode) {
        case Mode.start:
            tsett(state, SOURCE, d, false);
            execClosure(sink)(Mode.start, closure(state, tbf));
            break;
        case Mode.data:
            const taken = tgetv(vars, TAKEN);
            if (taken < max) {
                tsetv(vars, TAKEN, taken + 1);
                execClosure(sink)(Mode.data, d);
                if (tgetv(vars, TAKEN) === max && !tgetv(vars, END)) {
                    tsetv(vars, END, TRUE);
                    if (tgett(state, SOURCE)) execClosure(tgett(state, SOURCE))(Mode.stop);
                    execClosure(sink)(Mode.stop);
                }
            }

            break;
        case Mode.stop:
            execClosure(sink)(Mode.stop, d);
            break;
    }
}

const cproc = closureFactory1(sourceTBF, Role.sink);

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

