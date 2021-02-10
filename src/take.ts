import { CB } from "./common";
import { TakeInstance, TakePrototype, TakeArgs } from "./take-types";
import { Mode } from "./common";

function talkback(this: TakeInstance, mode: Mode, d: any) {
    if (mode === Mode.destroy) {
        this.vars.end = true;
        this.vars.sourceTalkback?.(mode, d);
    } else if (this.vars.taken < this.args.max) {
        this.vars.sourceTalkback?.(mode, d);
    }
}

function takeSourceTB(this: TakeInstance, mode: Mode, d: any) {
    switch (mode) {
        case Mode.init:
            this.vars.sourceTalkback = d;
            this.sink(0, talkback.bind(this));
            break;
        case Mode.run:
            if (this.vars.taken < this.args.max) {
                this.vars.taken++;
                this.sink(Mode.run, d);
                if (this.vars.taken === this.args.max && !this.vars.end) {
                    this.vars.end = true
                    this.vars.sourceTalkback?.(Mode.destroy);
                    this.sink?.(Mode.destroy);
                }
            }
            break;
        case Mode.destroy:
            this.sink(Mode.destroy, d);
            break;
    }
}

function takeCB(this: TakePrototype, mode: Mode, sink: any) {
    if (mode !== Mode.init) return;
    const instance: TakeInstance = {
        ...this,
        sink,
        vars: {
            taken: 0,
            end: false,
        }
    }
    const tb = takeSourceTB.bind(instance);
    instance.source?.(Mode.init, tb);
}

function takeSinkFactory(this: TakePrototype, source: CB) {
    const prototype: TakePrototype = {
        ...this,
        source,
    }
    return takeCB.bind(prototype);
}

export function take(args: TakeArgs) {
    const prototype: TakePrototype = { args };
    return takeSinkFactory.bind(prototype);
}

// const take = max => source => (start, sink) => {
//     if (start !== 0) return;
//     let taken = 0;
//     let sourceTalkback;
//     let end;
//     function talkback(t, d) {
//         if (t === 2) {
//             end = true;
//             sourceTalkback(t, d);
//         } else if (taken < max) sourceTalkback(t, d);
//     }
//     source(0, (t, d) => {
//         if (t === 0) {
//             sourceTalkback = d;
//             sink(0, talkback);
//         } else if (t === 1) {
//             if (taken < max) {
//                 taken++;
//                 sink(t, d);
//                 if (taken === max && !end) {
//                     end = true
//                     sourceTalkback(2);
//                     sink(2);
//                 }
//             }
//         } else {
//             sink(t, d);
//         }
//     });
// };

