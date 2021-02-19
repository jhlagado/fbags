import { Role, Mode, Closure, ARGS, VARS, SINK2 } from "./common";
import { closureFactory, argsFactory, execClosure } from "./utils";

type VarsTuple = [Closure | boolean, boolean, boolean, boolean]
const SINK = 0;
const INLOOP = 0;
const GOT1 = 1;
const COMPLETED = 2;
const DONE = 3;

const loop = (state: Closure) => {
    const iterator = state[ARGS] as any;
    const vars = state[VARS] as VarsTuple;
    vars[INLOOP] = true;
    while (vars[GOT1] && !vars[COMPLETED]) {
        vars[GOT1] = false;
        const res = iterator.next();
        if (res.done) {
            vars[DONE] = true;
            execClosure(state[SINK2] as Closure)(Mode.stop);
            break;
        }
        else {
            execClosure(state[SINK2] as Closure)(1, res.value);
        }
    }
    vars[INLOOP] = false;
}

const fromIteratorSinkCB = (state: Closure) => (mode: Mode, first: boolean) => {
    const vars = state[VARS] as VarsTuple;
    if (vars[COMPLETED]) return
    switch (mode) {
        case Mode.run:
            if (first) {
                // move SINK from vars[SINK] to state[SOURCE]
                // refer to as state[SINK2]
                // reuse SINK as INLOOP  
                state[SINK2] = vars[SINK];
                vars[INLOOP] = false;
                vars[GOT1] = false;
                vars[COMPLETED] = false;
                vars[DONE] = false;;

            }
            vars[GOT1] = true;
            if (!vars[INLOOP] && !(vars[DONE])) loop(state);
            break;
        case Mode.stop:
            vars[COMPLETED] = true;
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
