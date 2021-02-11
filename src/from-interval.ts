import { closure } from "./common";
import { Mode } from "./common";
import { FromIntervalInstance, FromIntervalArgs } from "./from-interval-types";

const callback = (state: FromIntervalInstance) => () => {
    state.sink?.(1, state.vars.i++);
}

const talkback = (state: FromIntervalInstance) => (mode: Mode) => {
    if (mode === Mode.destroy) {
        clearInterval(state.vars.id);
    }
}

const fromIntervalCB = (state: FromIntervalInstance) => (mode: Mode, sink: any) => {
    if (mode === Mode.init) {
        const instance: FromIntervalInstance = {
            ...state,
            sink,
        }
        instance.vars.id = setInterval(closure(instance, callback), state.args.period);
        const tb = closure(instance, talkback);
        sink(Mode.init, tb);
    }
}

export function fromInterval(args: FromIntervalArgs) {
    const prototype: FromIntervalInstance = { args, vars: { i: 0 } };
    return closure(prototype, fromIntervalCB);
}



// const interval = period => (start, sink) => {
//     if (start !== 0) return;
//     let i = 0;
//     const id = setInterval(() => {
//         sink(1, i++);
//     }, period);
//     sink(0, t => {
//         if (t === 2) clearInterval(id);
//     });
// };

