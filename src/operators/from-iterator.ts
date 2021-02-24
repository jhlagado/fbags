import { ARGS, FALSE, SINK2, TRUE, VARS } from "../utils/constants";
import { Role, Mode, Tuple } from "../utils/common";
import { lookup } from "../utils/registry";
import { closureFactory, argsFactory, execClosure } from "../utils/utils";
import { tgett, tgetv, tsett, tsetv } from "../utils/tuple-utils";

const SINK = 0;
const INLOOP = 0;
const GOT1 = 1;
const COMPLETED = 2;
const DONE = 3;

const loop = (state: Tuple) => {
    const iterator = lookup(tgetv(state, ARGS)) as any;
    const vars = tgett(state, VARS);
    tsetv(vars, INLOOP, TRUE);
    while (tgetv(vars, GOT1) && !tgetv(vars, COMPLETED)) {
        tsetv(vars, GOT1, FALSE);
        const res = iterator.next();
        if (res.done) {
            tsetv(vars, DONE, TRUE);
            execClosure(tgett(state, SINK2))(Mode.stop);
            break;
        }
        else {
            execClosure(tgett(state, SINK2))(1, res.value);
        }
    }
    tsetv(vars, INLOOP, FALSE);
}

const fromIteratorSinkCB = (state: Tuple) => (mode: Mode, first: boolean) => {
    const vars = tgett(state, VARS);
    if (tgetv(vars, COMPLETED)) return
    switch (mode) {
        case Mode.run:
            if (first) {
                // move SINK from tget(vars,SINK) to tget(state,SOURCE)
                // refer to as tget(state,SINK2)
                // reuse SINK as INLOOP  
                tsett(state, SINK2, tgett(vars, SINK), false);
                tsetv(vars, INLOOP, FALSE);
                tsetv(vars, GOT1, FALSE);
                tsetv(vars, COMPLETED, FALSE);
                tsetv(vars, DONE, FALSE);
            }
            tsetv(vars, GOT1, TRUE);
            if (!tgetv(vars, INLOOP) && !(tgetv(vars, DONE))) loop(state);
            break;
        case Mode.stop:
            tsetv(vars, COMPLETED, TRUE);
            break;
    }
}

const sf = closureFactory(fromIteratorSinkCB, Role.source, undefined);

export const fromIterator = argsFactory(sf);

// const fromIter = iter => (start, sink) => {
//     if (start !== 0) return;
//     const iterator =
//         typeof Symbol !== 'undefined' && iter[Symbol.iterator]
//             ? iter[Symbol.iterator]()
//             : iter;
//     let inloop = false;
//     let got1 = false;
//     let completed = false;
//     let res;
//     function loop() {
//         inloop = true;
//         while (got1 && !completed) {
//             got1 = false;
//             res = iterator.next();
//             if (res.done) {
//                 sink(2);
//                 break;
//             }
//             else sink(1, res.value);
//         }
//         inloop = false;
//     }
//     sink(0, t => {
//         if (completed) return

//         if (t === 1) {
//             got1 = true;
//             if (!inloop && !(res && res.done)) loop();
//         } else if (t === 2) {
//             completed = true;
//         }
//     });
// };
