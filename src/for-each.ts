import {  Role, Mode, CB } from "./common";
import { sinkFactory, argsFactory, cbExec } from "./utils";

// for the sake of simplicity this closure 
// does not allocate a vars object instead it mutates 
// the (normally immutable) source field instead
const forEachTB = (state: CB) => (mode: Mode, d: any) => {
    const effect = state.args as Function;
    switch (mode) {
        case Mode.start:
            state.source = d;
            cbExec(d)(Mode.run);
            break;
        case Mode.run:
            effect(d);
            cbExec(state.source)(Mode.run);
            break;
    }
}

const sf = sinkFactory(forEachTB, Role.sink);

export const forEach = argsFactory(sf);


// const forEach = operation => source => {
//     let talkback;
//     source(0, (t, d) => {
//       if (t === 0) talkback = d;
//       if (t === 1) operation(d);
//       if (t === 1 || t === 0) talkback(1);
//     });
//   };