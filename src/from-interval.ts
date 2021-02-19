import { ARGS, Closure, Mode, VARS } from "./common";
import { closure, argsFactory, execClosure } from "./utils";

type VarsTuple = [Closure, number, any, undefined]
const SINK = 0;
const I = 1;
const ID = 2;

const callback = (state: Closure) => () => {
    const vars = state[VARS] as VarsTuple;
    execClosure(vars[SINK])(1, vars[I]!++);
}

const talkback = (state: Closure) => (mode: Mode) => {
    const vars = state[VARS] as VarsTuple;
    if (mode === Mode.stop) {
        clearInterval(vars[ID]);
    }
}

const sf = (state: Closure) => (mode: Mode, sink: any) => {
    if (mode !== Mode.start) return;
    const period = state[ARGS] as number;
    const instance: Closure = [...state];
    const vars = [sink, 0, undefined, undefined] as VarsTuple;
    instance[VARS] = vars;
    vars[ID] = setInterval(callback(instance), period);
    const tb = closure(instance, talkback);
    execClosure(sink)(Mode.start, tb);
}

export const fromInterval = argsFactory(sf);



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

