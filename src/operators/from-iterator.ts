import { ARGS, FALSE, SINK2, TRUE, VARS } from "../utils/constants";
import { Role, Mode, Tuple } from "../utils/common";
import { lookup } from "../utils/registry";
import { closureFactory, argsFactory, execClosure } from "../utils/utils";
import { tupleGet, tupleSet } from "../utils/tuple-utils";

const SINK = 0;
const INLOOP = 0;
const GOT1 = 1;
const COMPLETED = 2;
const DONE = 3;

const loop = (state: Tuple) => {
    const iterator = lookup(tupleGet(state, ARGS) as number) as any;
    const vars = tupleGet(state, VARS) as Tuple;
    tupleSet(vars, INLOOP, TRUE, false);
    while (tupleGet(vars, GOT1) && !tupleGet(vars, COMPLETED)) {
        tupleSet(vars, GOT1, FALSE, false);
        const res = iterator.next();
        if (res.done) {
            tupleSet(vars, DONE, TRUE, true);
            execClosure(state[SINK2] as Tuple)(Mode.stop);
            break;
        }
        else {
            execClosure(state[SINK2] as Tuple)(1, res.value);
        }
    }
    tupleSet(vars, INLOOP, FALSE, false);
}

const fromIteratorSinkCB = (state: Tuple) => (mode: Mode, first: boolean) => {
    const vars = tupleGet(state, VARS) as Tuple;
    if (tupleGet(vars, COMPLETED)) return
    switch (mode) {
        case Mode.run:
            if (first) {
                // move SINK from tupleGet(vars,SINK) to state[SOURCE]
                // refer to as state[SINK2]
                // reuse SINK as INLOOP  
                tupleSet(state, SINK2, tupleGet(vars, SINK), false);
                tupleSet(vars, INLOOP, FALSE, false);
                tupleSet(vars, GOT1, FALSE, false);
                tupleSet(vars, COMPLETED, FALSE, false);
                tupleSet(vars, DONE, FALSE, false);
            }
            tupleSet(vars, GOT1, TRUE, false);
            if (!tupleGet(vars, INLOOP) && !(tupleGet(vars, DONE))) loop(state);
            break;
        case Mode.stop:
            tupleSet(vars, COMPLETED, TRUE, false);
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
