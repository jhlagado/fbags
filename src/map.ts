import { Role, Mode, CB, Dict, CBI, } from "./common";
import { argsFactory, cbExec, cbFactory, sinkFactory } from "./utils";

const mapTB = (state: CB) => (mode: Mode, d: any) => {
    const mapper = state[CBI.args] as Function;
    const vars = state[CBI.vars] as Dict;
    cbExec(vars.sink)(mode, mode === Mode.run ? mapper(d) : d)
}

const cbf = cbFactory(mapTB, Role.sink, {});

const sf = sinkFactory(cbf, Role.none);

export const map = argsFactory(sf);

// const map = f => source => (start, sink) => {
//     if (start !== 0) return;
//     source(0, (t, d) => {
//       sink(t, t === 1 ? f(d) : d)
//     });
//   };

