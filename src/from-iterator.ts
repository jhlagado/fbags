import { Mode } from "./common";

// binding simulates forth closure

function loop(this: any) {
    this.vars.inloop = true;
    while (this.vars.got1 && !this.vars.completed) {
        this.vars.got1 = false;
        const res = this.iterator.next();
        if (this.vars.done) {
            this.vars.done = true;
            this.sink(Mode.destroy);
            break;
        }
        else this.sink(1, res.value);
    }
    this.vars.inloop = false;
}

function fromIteratorSinkCB(this: any, mode: Mode) {
    if (this.vars.completed) return
    switch (mode) {
        case Mode.run:
            this.vars.got1 = true;
            if (!this.vars.inloop && !(this.vars.done)) loop.bind(this)();
            break;
        case Mode.destroy:
            this.vars.completed = true;
            break;
    }
}

function fromIteratorCB(this: any, mode: Mode, sink: any) {
    if (mode !== Mode.init) return;
    const state = {
        ...this,
        sink,
        vars: {
            inloop: false,
            got1: false,
            completed: false,
            done: false
        },
    }
    sink(Mode.init, fromIteratorSinkCB.bind(state));
}

export function fromIterator(iterator: Iterator<number>) {
    const args = { iterator };
    const prototype = { args };
    return fromIteratorCB.bind(prototype);
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
