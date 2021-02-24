import { ARGS, FALSE, SINK2, TRUE, VARS } from "../utils/constants";
import { Role, Mode, Tuple } from "../utils/common";
import { lookup } from "../utils/registry";
import { closureFactory, argsFactory, execClosure } from "../utils/utils";
import { tget, tset } from "../utils/tuple-utils";

const SINK = 0;
const INLOOP = 0;
const GOT1 = 1;
const COMPLETED = 2;
const DONE = 3;

const loop = (state: Tuple) => {
    const iterator = lookup(tget(state, ARGS) as number) as any;
    const vars = tget(state, VARS) as Tuple;
    tset(vars, INLOOP, TRUE, false);
    while (tget(vars, GOT1) && !tget(vars, COMPLETED)) {
        tset(vars, GOT1, FALSE, false);
        const res = iterator.next();
        if (res.done) {
            tset(vars, DONE, TRUE, true);
            execClosure(tget(state, SINK2) as Tuple)(Mode.stop);
            break;
        }
        else {
            execClosure(tget(state, SINK2) as Tuple)(1, res.value);
        }
    }
    tset(vars, INLOOP, FALSE, false);
}

const fromIteratorSinkCB = (state: Tuple) => (mode: Mode, first: boolean) => {
    const vars = tget(state, VARS) as Tuple;
    if (tget(vars, COMPLETED)) return
    switch (mode) {
        case Mode.run:
            if (first) {
                // move SINK from tget(vars,SINK) to tget(state,SOURCE)
                // refer to as tget(state,SINK2)
                // reuse SINK as INLOOP  
                tset(state, SINK2, tget(vars, SINK), false);
                tset(vars, INLOOP, FALSE, false);
                tset(vars, GOT1, FALSE, false);
                tset(vars, COMPLETED, FALSE, false);
                tset(vars, DONE, FALSE, false);
            }
            tset(vars, GOT1, TRUE, false);
            if (!tget(vars, INLOOP) && !(tget(vars, DONE))) loop(state);
            break;
        case Mode.stop:
            tset(vars, COMPLETED, TRUE, false);
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
