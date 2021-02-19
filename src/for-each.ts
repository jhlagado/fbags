import { Role, Mode, CB, CBI } from "./common";
import { sinkFactory, argsFactory, cbExec } from "./utils";

// for the sake of simplicity this closure 
// does not allocate a vars object instead it mutates 
// the (normally immutable) source field instead
const forEachTB = (state: CB) => (mode: Mode, d: any) => {
    const effect = state[CBI.args] as Function;
    switch (mode) {
        case Mode.start:
            state[CBI.source] = d;
            cbExec(d)(Mode.run, true);
            break;
        case Mode.run:
            effect(d);
            cbExec(state[CBI.source] as CB)(Mode.run, false);
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