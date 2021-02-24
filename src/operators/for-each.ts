import { ARGS, SOURCE } from "../utils/constants";
import { Role, Mode, Tuple } from "../utils/common";
import { lookup } from "../utils/registry";
import { sinkFactory, argsFactory, execClosure } from "../utils/utils";
import { tgett, tgetv, tset } from "../utils/tuple-utils";

// for the sake of simplicity this closure 
// does not allocate a vars object instead it mutates 
// the (normally immutable) source field instead
const forEachTB = (state: Tuple) => (mode: Mode, d: any) => {
    const effect = lookup(tgetv(state, ARGS)) as Function;
    switch (mode) {
        case Mode.start:
            tset(state, SOURCE, d, false);
            execClosure(d)(Mode.run, true);  // first = true is needed for soures that need initialisation
            // see fromIterator 
            break;
        case Mode.run:
            effect(d);
            execClosure(tgett(state, SOURCE))(Mode.run, false);
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