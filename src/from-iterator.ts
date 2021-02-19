import { Role, Mode, CB, Dict, CBI } from "./common";
import { cbFactory, argsFactory, cbExec } from "./utils";

const loop = (state: CB) => {
    const iterator = state[CBI.args] as Iterator<any>;
    const vars = state[CBI.vars] as Dict;
    vars.inloop = true;
    while (vars.got1 && !vars.completed) {
        vars.got1 = false;
        const res = iterator.next();
        if (res.done) {
            vars.done = true;
            cbExec(vars.sink)(Mode.stop);
            break;
        }
        else {
            cbExec(vars.sink)(1, res.value);
        }
    }
    vars.inloop = false;
}

const fromIteratorSinkCB = (state: CB) => (mode: Mode) => {
    const vars = state[CBI.vars] as Dict;
    if (vars.completed) return
    switch (mode) {
        case Mode.run:
            vars.got1 = true;
            if (!vars.inloop && !(vars.done)) loop(state);
            break;
        case Mode.stop:
            vars.completed = true;
            break;
    }
}

const sf = cbFactory(fromIteratorSinkCB, Role.source, {
    inloop: false,
    got1: false,
    completed: false,
    done: false
});

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
