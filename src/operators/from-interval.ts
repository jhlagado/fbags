import { ARGS, Mode, SINK, VARS } from "../utils/constants";
import { Tuple } from "../utils/types";
import { lookup, register } from "../utils/registry";
import { closure, argsFactory, execClosure } from "../utils/closure-utils";
import { tupleNew, tsett, tsetv, tgetv, tgett } from "../utils/tuple-utils";

const I = 1;
const ID = 2;

const callback = (state: Tuple) => () => {
    const vars = tgett(state, VARS);
    const i = tgetv(vars, I);
    execClosure(tgett(state, SINK))(1, i);
    tsetv(vars, I, i + 1)
}

const talkback = (state: Tuple) => (mode: Mode) => {
    const vars = tgett(state, VARS);
    if (mode === Mode.stop) {
        clearInterval(lookup(tgetv(vars, ID)));
    }
}

const sf = (state: Tuple) => (mode: Mode, sink: any) => {
    if (mode !== Mode.start) return;
    const period = tgetv(tgett(state, ARGS), 0);
    const instance: Tuple = tupleNew(...state);
    tsett(instance, SINK, sink, false);
    const vars = tupleNew(0, 0, 0, 0);
    tsett(instance, VARS, vars, false);
    tsetv(vars, ID, register(setInterval(callback(instance), period)));
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

