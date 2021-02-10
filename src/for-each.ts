import { CB } from "./common";
import { ForEachInstance, ForEachPrototype, ForEachArgs } from "./for-eachtypes";
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

function forEachCB(this: ForEachPrototype) {
    const instance = {
        ...this,
        vars: {}
    }
    const tb = forEachTB.bind(instance);
    instance.source?.(Mode.init, tb);
}

function forEachSinkFactory(this: ForEachPrototype, source: CB) {
    const prototype1 = { ...this, source };
    return forEachCB.bind(prototype1);
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
