import { ARGS, VARS } from "../utils/constants";
import { Mode, Tuple } from "../utils/common";
import { lookup, register } from "../utils/registry";
import { closure, argsFactory, execClosure } from "../utils/utils";
import { tget, tupleNew, tset } from "../utils/tuple-utils";

const SINK = 0;
const I = 1;
const ID = 2;

const callback = (state: Tuple) => () => {
    const vars = tget(state, VARS) as Tuple;
    const i = tget(vars, I) as number;
    execClosure(tget(vars, SINK) as Tuple)(1, i);
    tset(vars, I, i + 1, false)
}

const talkback = (state: Tuple) => (mode: Mode) => {
    const vars = tget(state, VARS) as Tuple;
    if (mode === Mode.stop) {
        clearInterval(lookup(tget(vars, ID) as number));
    }
}

const sf = (state: Tuple) => (mode: Mode, sink: any) => {
    if (mode !== Mode.start) return;
    const period = tget(tget(state, ARGS) as Tuple, 0) as number;
    const instance: Tuple = tupleNew(...state);
    const vars = tupleNew(sink, 0, 0, 0);
    tset(instance, VARS, vars, false);
    tset(vars, ID, register(setInterval(callback(instance), period)), false);
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

