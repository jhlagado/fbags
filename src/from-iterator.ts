import { Role, Mode, CB, CBI } from "./common";
import { cbFactory, argsFactory, cbExec } from "./utils";

type VarsTuple = [CB | boolean, boolean, boolean, boolean]
const SINK = 0;
const INLOOP = 0;
const GOT1 = 1;
const COMPLETED = 2;
const DONE = 3;

const SINK2 = CBI.source;

const loop = (state: CB) => {
    const iterator = state[CBI.args] as any;
    const vars = state[CBI.vars] as VarsTuple;
    vars[INLOOP] = true;
    while (vars[GOT1] && !vars[COMPLETED]) {
        vars[GOT1] = false;
        const res = iterator.next();
        if (res.done) {
            vars[DONE] = true;
            cbExec(state[SINK2] as CB)(Mode.stop);
            break;
        }
        else {
            cbExec(state[SINK2] as CB)(1, res.value);
        }
    }
    vars[INLOOP] = false;
}

const fromIteratorSinkCB = (state: CB) => (mode: Mode, first: boolean) => {
    const vars = state[CBI.vars] as VarsTuple;
    if (vars[COMPLETED]) return
    switch (mode) {
        case Mode.run:
            if (first) {
                // move SINK from vars[SINK] to state[CBI.source]
                // refer to as state[SINK2]
                // reuse SINK as INLOOP  
                state[SINK2] = vars[SINK];
                vars[INLOOP] = false;
            }
            vars[GOT1] = true;
            if (!vars[INLOOP] && !(vars[DONE])) loop(state);
            break;
        case Mode.stop:
            vars[COMPLETED] = true;
            break;
    }
}

const sf = cbFactory(fromIteratorSinkCB, Role.source, [undefined, false, false, false]);

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
