import { ARGS, VARS } from "../utils/constants";
import { Role, Mode, Tuple } from "../utils/common";
import { argsFactory, execClosure, closureFactory } from "../utils/utils";
import { tgett, tgetv } from "../utils/tuple-utils";

const SINK = 0;

const fromConstantTB = (state: Tuple) => (mode: Mode, d: any) => {
    const constant = tgetv(state, ARGS);
    const vars = tgett(state, VARS);
    execClosure(tgett(vars, SINK))(mode, mode === Mode.run ? constant : d)
}

const sf = closureFactory(fromConstantTB, Role.source, undefined);

export const fromConstant = argsFactory(sf);

