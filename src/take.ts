import { CBProc, Role, Mode, Dict } from "./common";
import { closure, cbFactory, sinkFactory, argsFactory, cbExec } from "./utils";

const tbf: CBProc = (state) => (mode, d) => {
    const args = state.args as Dict;
    const vars = state.vars as Dict;
    const source = state.source!;
    if (mode === Mode.stop) {
        vars.end = true;
        cbExec(source)(mode, d);
    } else if (vars.taken < args.max) {
        cbExec(source)(mode, d);
    }
}

const sourceTBF: CBProc = (state) => (mode, d) => {
    const args = state.args as Dict;
    const vars = state.vars as Dict;
    const sink = vars.sink!;
    switch (mode) {
        case Mode.start:
            state.source = d;
            cbExec(sink)(0, closure(state, tbf));
            break;
        case Mode.run:
            if (vars.taken < args.max) {
                vars.taken++;
                cbExec(sink)(Mode.run, d);
                if (vars.taken === args.max && !vars.end) {
                    vars.end = true
                    if (state.source) cbExec(state.source)(Mode.stop);
                    cbExec(sink)(Mode.stop);
                }
            }

            break;
        case Mode.stop:
            cbExec(sink)(Mode.stop, d);
            break;
    }
}

const cbf = cbFactory(sourceTBF, Role.sink, { taken: 0, end: false });

const sf = sinkFactory(cbf, Role.none);

export const take = argsFactory(sf);

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

