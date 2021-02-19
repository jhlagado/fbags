import { Role, Mode, CB, ARGS, VARS, } from "./common";
import { argsFactory, cbExec, cbFactory, sinkFactory } from "./utils";

type VarsTuple = [CB, undefined, undefined, undefined]
const SINK = 0;

const mapTB = (state: CB) => (mode: Mode, d: any) => {
    const mapper = state[ARGS] as Function;
    const vars = state[VARS] as VarsTuple;
    cbExec(vars[SINK])(mode, mode === Mode.run ? mapper(d) : d)
}

const cbf = cbFactory(mapTB, Role.sink, undefined);

const sf = sinkFactory(cbf, Role.none);

export const map = argsFactory(sf);

// const map = f => source => (start, sink) => {
//     if (start !== 0) return;
//     source(0, (t, d) => {
//       sink(t, t === 1 ? f(d) : d)
//     });
//   };

