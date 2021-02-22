import { ARGS, VARS } from "./constants";
import { Mode, Closure } from "./common";
import { lookupObject, registerObject } from "./objects";
import { closure, argsFactory, execClosure } from "./utils";

type VarsTuple = [Closure, number, number, number]
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
        clearInterval(lookupObject(vars[ID]));
    }
}

const sf = (state: Closure) => (mode: Mode, sink: any) => {
    if (mode !== Mode.start) return;
    const period = state[ARGS] as number;
    const instance: Closure = [...state];
    const vars = [sink, 0, 0, 0] as VarsTuple;
    instance[VARS] = vars;
    vars[ID] = registerObject(setInterval(callback(instance), period));
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

