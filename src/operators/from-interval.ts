import { ARGS, VARS } from "../utils/constants";
import { Mode, Tuple } from "../utils/common";
import { lookup, register } from "../utils/registry";
import { closure, argsFactory, execClosure } from "../utils/utils";

type VarsTuple = [Tuple, number, number, number]
const SINK = 0;
const I = 1;
const ID = 2;

const callback = (state: Tuple) => () => {
    const vars = state[VARS] as VarsTuple;
    execClosure(vars[SINK])(1, vars[I]!++);
}

const talkback = (state: Tuple) => (mode: Mode) => {
    const vars = state[VARS] as VarsTuple;
    if (mode === Mode.stop) {
        clearInterval(lookup(vars[ID]));
    }
}

const sf = (state: Tuple) => (mode: Mode, sink: any) => {
    if (mode !== Mode.start) return;
    const period = (state[ARGS] as Tuple)[0] as number;
    const instance: Tuple = [...state] as Tuple;
    const vars = [sink, 0, 0, 0] as VarsTuple;
    instance[VARS] = vars;
    vars[ID] = register(setInterval(callback(instance), period));
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

