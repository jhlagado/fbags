import { CB } from "./common";
import { ForEachInstance, ForEachPrototype, ForEachArgs } from "./for-each-types";
import { Mode } from "./common";

function forEachTB(this: ForEachInstance, mode: Mode, d: any) {
    switch (mode) {
        case Mode.init:
            this.vars.talkback = d;
            this.vars.talkback?.(Mode.run);
            break;
        case Mode.run:
            this.args.effect(d);
            this.vars.talkback?.(Mode.run);
            break;
    }
}

function forEachSinkFactory(this: ForEachPrototype, source: CB):CB {
    const instance = {
        ...this,
        source,
        vars: {}
    }
    const tb = forEachTB.bind(instance);
    instance.source?.(Mode.init, tb);
    return tb;
}

export function forEach(args: ForEachArgs) {
    const prototype: ForEachPrototype = { args };
    return forEachSinkFactory.bind(prototype);
}

// const forEach = operation => source => {
//     let talkback;
//     source(0, (t, d) => {
//       if (t === 0) talkback = d;
//       if (t === 1) operation(d);
//       if (t === 1 || t === 0) talkback(1);
//     });
//   };
