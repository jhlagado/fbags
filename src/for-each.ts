import { CB, closure, Mode } from "./common";
import { ForEachInstance, ForEachPrototype, ForEachArgs } from "./for-each-types";

const forEachTB = (state: ForEachInstance) => (mode: Mode, d: any) => {
    switch (mode) {
        case Mode.init:
            state.vars.talkback = d;
            state.vars.talkback?.(Mode.run);
            break;
        case Mode.run:
            state.args.effect(d);
            state.vars.talkback?.(Mode.run);
            break;
    }
}

const forEachSinkFactory = (state: ForEachPrototype) => (source: CB) => {
    const instance = {
        ...state,
        source,
        vars: {}
    }
    const tb = closure(instance, forEachTB);
    instance.source?.(Mode.init, tb);
}

export function forEach(args: ForEachArgs) {
    const prototype: ForEachPrototype = { args };
    return closure(prototype, forEachSinkFactory);
}

// const forEach = operation => source => {
//     let talkback;
//     source(0, (t, d) => {
//       if (t === 0) talkback = d;
//       if (t === 1) operation(d);
//       if (t === 1 || t === 0) talkback(1);
//     });
//   };
