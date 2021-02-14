import { argsFactory, Mode, tbSinkFactory } from "./common";
import { ForEachState, ForEachArgs, ForEachVars } from "./for-each-types";

const forEachTB = (state: ForEachState) => (mode: Mode, d: any) => {
    const vars = state.vars!;
    switch (mode) {
        case Mode.init:
            vars.talkback = d;
            vars.talkback?.(Mode.run);
            break;
        case Mode.run:
            state.args.effect(d);
            vars.talkback?.(Mode.run);
            break;
    }
}

const sf = tbSinkFactory<ForEachArgs, ForEachVars>(forEachTB);

export const forEach = argsFactory<ForEachArgs, ForEachVars>(sf);


// const forEach = operation => source => {
//     let talkback;
//     source(0, (t, d) => {
//       if (t === 0) talkback = d;
//       if (t === 1) operation(d);
//       if (t === 1 || t === 0) talkback(1);
//     });
//   };