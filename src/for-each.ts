import { ARGS, SOURCE } from "./constants";
import { Role, Mode, Closure } from "./common";
import { lookupObject } from "./objects";
import { sinkFactory, argsFactory, execClosure } from "./utils";

// for the sake of simplicity this closure 
// does not allocate a vars object instead it mutates 
// the (normally immutable) source field instead
const forEachTB = (state: Closure) => (mode: Mode, d: any) => {
    const effect = lookupObject(state[ARGS] as number) as Function;
    switch (mode) {
        case Mode.start:
            state[SOURCE] = d;
            execClosure(d)(Mode.run, true);  // first = true is needed for soures that need initialisation
            // see fromIterator 
            break;
        case Mode.run:
            effect(d);
            execClosure(state[SOURCE] as Closure)(Mode.run, false);
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