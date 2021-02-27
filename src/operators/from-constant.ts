import { ARGS, Mode, Role, SINK } from "../utils/constants";
import { Tuple } from "../utils/types";
import { argsFactory, execClosure, closureFactory } from "../utils/closure-utils";
import { tgett, tgetv } from "../utils/tuple-utils";

const fromConstantTB = (state: Tuple) => (mode: Mode, d: any) => {
    const constant = tgetv(state, ARGS);
    // const vars = tgett(state, VARS);
    execClosure(tgett(state, SINK))(mode, mode === Mode.data ? constant : d)
}

const sf = closureFactory(fromConstantTB, Role.source);

export const fromConstant = argsFactory(sf);

