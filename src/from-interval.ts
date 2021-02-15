import { Mode } from "./types/common";
import { FromIntervalState, FromIntervalArgs, FromIntervalVars } from "./types/from-interval-types";
import { closure, argsFactory } from "./utils";

const callback = (state: FromIntervalState) => () => {
    state.vars?.sink?.(1, state.vars!.i++);
}

const talkback = (state: FromIntervalState) => (mode: Mode) => {
    if (mode === Mode.stop) {
        clearInterval(state.vars!.id);
    }
}

const sf = (state: FromIntervalState) => (mode: Mode, sink: any) => {
    if (mode !== Mode.start) return;
    const instance: FromIntervalState = {
        ...state,
        vars:{
            sink,
            i:0,
        },
    }
    instance.vars!.id = setInterval(closure(instance, callback), state.args.period);
    const tb = closure(instance, talkback);
    sink(Mode.start, tb);
}

export const fromInterval = argsFactory<FromIntervalArgs, FromIntervalVars>(sf);



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

