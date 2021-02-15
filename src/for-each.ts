import {  Role, Mode } from "./types/common";
import { ForEachState, ForEachArgs, ForEachVars } from "./types/for-each-types";
import { sinkFactory, argsFactory } from "./utils";

const forEachTB = (state: ForEachState) => (mode: Mode, d: any) => {
    const vars = state.vars!;
    switch (mode) {
        case Mode.start:
            vars.talkback = d;
            vars.talkback?.(Mode.run);
            break;
        case Mode.run:
            state.args.effect(d);
            vars.talkback?.(Mode.run);
            break;
    }
}

const sf = sinkFactory<ForEachArgs, ForEachVars>(forEachTB, Role.sink);

export const forEach = argsFactory<ForEachArgs, ForEachVars>(sf);


// const forEach = operation => source => {
//     let talkback;
//     source(0, (t, d) => {
//       if (t === 0) talkback = d;
//       if (t === 1) operation(d);
//       if (t === 1 || t === 0) talkback(1);
//     });
//   };