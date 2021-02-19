import { CB, CBI, Dict, Mode } from "./common";
import { closure, argsFactory, cbExec } from "./utils";

const callback = (state: Dict) => () => {
    const vars = state[CBI.vars] as Dict;
    cbExec(vars.sink)(1, vars.i++);
}

const talkback = (state: CB) => (mode: Mode) => {
    const vars = state[CBI.vars] as Dict;
    if (mode === Mode.stop) {
        clearInterval(vars.id);
    }
}

const sf = (state: CB) => (mode: Mode, sink: any) => {
    const period = state[CBI.args] as number;
    if (mode !== Mode.start) return;
    const instance: CB = [...state]
    instance[CBI.vars] = {
        sink,
        i: 0,
    } as Dict;
    (instance[CBI.vars] as Dict).id = setInterval(callback(instance), period);
    const tb = closure(instance, talkback);
    cbExec(sink)(Mode.start, tb);
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

