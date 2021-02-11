import { CB, closure } from "./common";
import { TakeInstance, TakePrototype, TakeArgs } from "./take-types";
import { Mode } from "./common";

const talkback = (state: TakeInstance) => (mode: Mode, d: any) => {
    if (mode === Mode.destroy) {
        state.vars.end = true;
        state.vars.sourceTalkback?.(mode, d);
    } else if (state.vars.taken < state.args.max) {
        state.vars.sourceTalkback?.(mode, d);
    }
}

const takeSourceTB = (state: TakeInstance) => (mode: Mode, d: any) => {
    switch (mode) {
        case Mode.init:
            state.vars.sourceTalkback = d;
            state.sink(0, closure(state, talkback));
            break;
        case Mode.run:
            if (state.vars.taken < state.args.max) {
                state.vars.taken++;
                state.sink(Mode.run, d);
                if (state.vars.taken === state.args.max && !state.vars.end) {
                    state.vars.end = true
                    state.vars.sourceTalkback?.(Mode.destroy);
                    state.sink?.(Mode.destroy);
                }
            }
            break;
        case Mode.destroy:
            state.sink(Mode.destroy, d);
            break;
    }
}

const takeCB = (state: TakePrototype) => (mode: Mode, sink: any) => {
    if (mode !== Mode.init) return;
    const instance: TakeInstance = {
        ...state,
        sink,
        vars: {
            taken: 0,
            end: false,
        }
    }
    const tb = closure(instance, takeSourceTB);
    instance.source?.(Mode.init, tb);
}

const takeSinkFactory = (state: TakePrototype) => (source: CB) => {
    const prototype: TakePrototype = {
        ...state,
        source,
    }
    return closure(prototype, takeCB);
}

export function take(args: TakeArgs) {
    const prototype: TakePrototype = { args };
    return closure(prototype, takeSinkFactory);
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

