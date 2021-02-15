import { CBF, Role, Mode } from "./types/common";
import { TakeArgs, TakeVars } from "./types/take-types";
import { closure, cbFactory, sinkFactory, argsFactory } from "./utils";

const tbf: CBF<TakeArgs, TakeVars> = (state) => (mode, d) => {
    if (mode === Mode.stop) {
        state.vars!.end = true;
        state.source?.(mode, d);
    } else if (state.vars!.taken < state.args.max) {
        state.source?.(mode, d);
    }
}

const sourceTBF: CBF<TakeArgs, TakeVars> = (state) => (mode, d) => {
    const vars = state.vars!;
    switch (mode) {
        case Mode.start:
            state.source = d;
            vars?.sink?.(0, closure(state, tbf));
            break;
        case Mode.run:
            if (vars.taken < state.args.max) {
                vars.taken++;
                vars?.sink?.(Mode.run, d);
                if (vars.taken === state.args.max && !vars.end) {
                    vars.end = true
                    state.source?.(Mode.stop);
                    vars?.sink?.(Mode.stop);
                }
            }

            break;
        case Mode.stop:
            vars?.sink?.(Mode.stop, d);
            break;
    }
}

const cbf = cbFactory<TakeArgs, TakeVars>({ taken: 0, end: false }, sourceTBF, Role.sink);

const sf = sinkFactory<TakeArgs, TakeVars>(cbf, Role.none);

export const take = argsFactory<TakeArgs, TakeVars>(sf);

// const take = max => source => (start, sink) => {
//     if (start !== 0) return;
//     let taken = 0;
//     let sourceTalkback;
//     let end;
//     function talkback(t, d) {
//         if (t === 2) {
//             end = true;
//             sourceTalkback(t, d);
//         } else if (taken < max) sourceTalkback(t, d);
//     }
//     source(0, (t, d) => {
//         if (t === 0) {
//             sourceTalkback = d;
//             sink(0, talkback);
//         } else if (t === 1) {
//             if (taken < max) {
//                 taken++;
//                 sink(t, d);
//                 if (taken === max && !end) {
//                     end = true
//                     sourceTalkback(2);
//                     sink(2);
//                 }
//             }
//         } else {
//             sink(t, d);
//         }
//     });
// };

