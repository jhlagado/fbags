import { ARGS, VARS } from "../utils/constants";
import { Role, Mode, Tuple } from "../utils/common";
import { argsFactory, execClosure, closureFactory } from "../utils/utils";
import { tupleGet } from "../utils/tuple-utils";

const SINK = 0;

const fromConstantTB = (state: Tuple) => (mode: Mode, d: any) => {
    const constant = tupleGet(state, ARGS) as number;
    const vars = tupleGet(state, VARS) as Tuple;
    execClosure(tupleGet(vars, SINK) as Tuple)(mode, mode === Mode.run ? constant : d)
}

const sf = closureFactory(fromConstantTB, Role.source, undefined);

export const fromConstant = argsFactory(sf);

