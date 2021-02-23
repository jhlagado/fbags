import { ARGS, VARS } from "../utils/constants";
import { Role, Mode, Tuple } from "../utils/common";
import { argsFactory, execClosure, closureFactory } from "../utils/utils";
import { tupleGet } from "../utils/tuple-utils";

type VarsTuple = [Tuple, number, number, number]
const SINK = 0;

const fromConstantTB = (state: Tuple) => (mode: Mode, d: any) => {
    const constant = tupleGet(state, ARGS) as number;
    const vars = state[VARS] as VarsTuple;
    execClosure(tupleGet(vars, SINK) as Tuple)(mode, mode === Mode.run ? constant : d)
}

const sf = closureFactory(fromConstantTB, Role.source, undefined);

export const fromConstant = argsFactory(sf);

