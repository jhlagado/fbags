import { ARGS, Mode, Role, SINK } from "../utils/constants";
import { Tuple } from "../utils/types";
import { argsFactory, execClosure, closureFactory } from "../utils/closure-utils";
import { isOwned, tgett, tgetv, tupleDestroy } from "../utils/tuple-utils";

const fromConstantTB = (state: Tuple) => (mode: Mode, d: any) => {
    const constant = tgetv(state, ARGS);
    const closure = tgett(state, SINK);
    execClosure(closure)(mode, mode === Mode.data ? constant : d);
    if (!isOwned(closure)) tupleDestroy(closure);
}

const sf = closureFactory(fromConstantTB, Role.source, 0);

export const fromConstant = argsFactory(sf);

