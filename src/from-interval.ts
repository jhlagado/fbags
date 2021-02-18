import { CB, Mode } from "./common";
import { closure, argsFactory, cbExec } from "./utils";

const callback = (state: CB) => () => {
    cbExec(state.vars?.sink)(1, state.vars!.i++);
}

const talkback = (state: CB) => (mode: Mode) => {
    if (mode === Mode.stop) {
        clearInterval(state.vars!.id);
    }
}

const sf = (state: CB) => (mode: Mode, sink: any) => {
    if (mode !== Mode.start) return;
    const instance: CB = {
        ...state,
        vars: {
            sink,
            i: 0,
        },
    }
    instance.vars!.id = setInterval(cbExec(closure(instance, callback)), state.args.period);
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

