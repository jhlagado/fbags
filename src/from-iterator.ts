import { closure, Mode } from "./common";
import { FromIteratorArgs, FromIteratorInstance, FromIteratorPrototype } from "./from-iterator-types";

// binding simulates forth closure

const loop = (state: FromIteratorInstance) => () => {
    state.vars.inloop = true;
    while (state.vars.got1 && !state.vars.completed) {
        state.vars.got1 = false;
        const res = state.args.iterator.next();
        if (res.done) {
            state.vars.done = true;
            state.sink?.(Mode.destroy);
            break;
        }
        else {
            state.sink?.(1, res.value);
        }
    }
    state.vars.inloop = false;
}

const fromIteratorSinkCB = (state: FromIteratorInstance) => (mode: Mode) =>{
    if (state.vars.completed) return
    switch (mode) {
        case Mode.run:
            state.vars.got1 = true;
            if (!state.vars.inloop && !(state.vars.done)) closure(state, loop)();
            break;
        case Mode.destroy:
            state.vars.completed = true;
            break;
    }
}

const fromIteratorCB = (state: FromIteratorPrototype) => (mode: Mode, sink: any) => {
    if (mode !== Mode.init) return;
    const instance: FromIteratorInstance = {
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
    const prototype: FromIteratorPrototype = { args };
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
