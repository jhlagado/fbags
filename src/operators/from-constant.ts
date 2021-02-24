import { ARGS, VARS } from "../utils/constants";
import { Role, Mode, Tuple } from "../utils/common";
import { argsFactory, execClosure, closureFactory } from "../utils/utils";
import { tget } from "../utils/tuple-utils";

const SINK = 0;

const fromConstantTB = (state: Tuple) => (mode: Mode, d: any) => {
    const constant = tget(state, ARGS) as number;
    const vars = tget(state, VARS) as Tuple;
    execClosure(tget(vars, SINK) as Tuple)(mode, mode === Mode.run ? constant : d)
}

const sf = closureFactory(fromConstantTB, Role.source, undefined);

export const fromConstant = argsFactory(sf);

