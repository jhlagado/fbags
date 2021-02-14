import { closure, Mode } from "./common";
import { FromIteratorArgs, FromIteratorState } from "./from-iterator-types";

// binding simulates forth closure

const loop = (state: FromIteratorState) => () => {
    const vars = state.vars!;
    vars.inloop = true;
    while (vars.got1 && !vars.completed) {
        vars.got1 = false;
        const res = state.args.iterator.next();
        if (res.done) {
            vars.done = true;
            state.sink?.(Mode.destroy);
            break;
        }
        else {
            state.sink?.(1, res.value);
        }
    }
    vars.inloop = false;
}

const fromIteratorSinkCB = (state: FromIteratorState) => (mode: Mode) =>{
    const vars = state.vars!;
    if (vars.completed) return
    switch (mode) {
        case Mode.run:
            vars.got1 = true;
            if (!vars.inloop && !(vars.done)) closure(state, loop)();
            break;
        case Mode.destroy:
            vars.completed = true;
            break;
    }
}

const fromIteratorCB = (state: FromIteratorState) => (mode: Mode, sink: any) => {
    if (mode !== Mode.init) return;
    const instance: FromIteratorState = {
        ...state,
        sink,
        vars: {
            inloop: false,
            got1: false,
            completed: false,
            done: false
        },
    }
    sink(Mode.init, closure(instance, fromIteratorSinkCB));
}

export function fromIterator(args: FromIteratorArgs) {
    const prototype: FromIteratorState = { args };
    return closure(prototype, fromIteratorCB);
}

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
