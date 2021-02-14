import { argsFactory, CBF, cbFactory, closure, Mode, sinkFactory } from "./common";
import { TakeState, TakeArgs, TakeVars } from "./take-types";

const tbf: CBF<TakeState> = (state) => (mode, d) => {
    if (mode === Mode.destroy) {
        state.vars!.end = true;
        state.source?.(mode, d);
    } else if (state.vars!.taken < state.args.max) {
        state.source?.(mode, d);
    }
}

const sourceTBF: CBF<TakeState> = (state) => (mode, d) => {
    const vars = state.vars!;
    switch (mode) {
        case Mode.init:
            state.source = d;
            state.sink?.(0, closure(state, tbf));
            break;
        case Mode.run:
            if (vars.taken < state.args.max) {
                vars.taken++;
                state.sink?.(Mode.run, d);
                if (vars.taken === state.args.max && !vars.end) {
                    vars.end = true
                    state.source?.(Mode.destroy);
                    state.sink?.(Mode.destroy);
                }
            }

            break;
        case Mode.destroy:
            state.sink?.(Mode.destroy, d);
            break;
    }
}

const cbf = cbFactory<TakeArgs, TakeVars>({ taken: 0, end: false }, sourceTBF);

const sf = sinkFactory<TakeArgs, TakeVars>(cbf);

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

