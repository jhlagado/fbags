import { ARGS, VARS } from "./constants";
import { Role, Mode, Tuple } from "./common";
import { argsFactory, execClosure, closureFactory } from "./utils";

type VarsTuple = [Tuple, number, number, number]
const SINK = 0;

const fromConstantTB = (state: Tuple) => (mode: Mode, d: any) => {
    const constant = state[ARGS] as number;
    const vars = state[VARS] as VarsTuple;
    execClosure(vars[SINK])(mode, mode === Mode.run ? constant : d)
}

const sf = closureFactory(fromConstantTB, Role.source, undefined);

export const fromConstant = argsFactory(sf);

