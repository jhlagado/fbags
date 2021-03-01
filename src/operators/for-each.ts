import { ARGS, Mode, Role, SOURCE } from "../utils/constants";
import { Tuple, } from "../utils/types";
import { lookup } from "../utils/registry";
import { sinkFactory, argsFactory, execClosure } from "../utils/closure-utils";
import { tgett, tgetv, tsett } from "../utils/tuple-utils";

const forEachTB = (state: Tuple) => (mode: Mode, d: any) => {
    const effect = lookup(tgetv(state, ARGS)) as Function;
    switch (mode) {
        case Mode.start:
            tsett(state, SOURCE, d, false);
            execClosure(d, Mode.data);
            break;
        case Mode.data:
            effect(d);
            const source = tgett(state, SOURCE);
            execClosure(source, Mode.data);
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