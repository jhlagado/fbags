import { ARGS, FALSE, Mode, Role, SINK, TRUE, VARS } from "../utils/constants";
import { Tuple, } from "../utils/types";
import { lookup } from "../utils/registry";
import { closureFactory, argsFactory, execClosure } from "../utils/closure-utils";
import { tgett, tgetv, tsett, tsetv, tupleNew } from "../utils/tuple-utils";


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
            execClosure(tgett(state, SINK))(Mode.stop);
            break;
        }
        else {
            execClosure(tgett(state, SINK))(1, res.value);
        }
    }
    tsetv(vars, INLOOP, FALSE);
}

const fromIteratorSinkCB = (state: Tuple) => (mode: Mode, first: boolean) => {
    let vars = tgett(state, VARS);
    if (!vars) {
        vars = tupleNew(FALSE, FALSE, FALSE, FALSE);
        tsett(state, VARS, vars, false)
    }
    if (tgetv(vars, COMPLETED)) return
    switch (mode) {
        case Mode.run:
            tsetv(vars, GOT1, TRUE);
            if (!tgetv(vars, INLOOP) && !(tgetv(vars, DONE))) loop(state);
            break;
        case Mode.stop:
            tsetv(vars, COMPLETED, TRUE);
            break;
    }
}

const sf = closureFactory(fromIteratorSinkCB, Role.source);

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
