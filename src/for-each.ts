import {  Role, Mode, CB } from "./common";
import { sinkFactory, argsFactory, cbExec } from "./utils";

const forEachTB = (state: CB) => (mode: Mode, d: any) => {
    const vars = state.vars!;
    switch (mode) {
        case Mode.start:
            vars.talkback = d;
            cbExec(d)(Mode.run);
            break;
        case Mode.run:
            state.args.effect(d);
            cbExec(vars.talkback)(Mode.run);
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