import { Closure, Role, Mode, ARGS, VARS } from "./common";
import { argsFactory, execClosure, closureFactory } from "./utils";

type VarsTuple = [Closure, undefined, undefined, undefined]
const SINK = 0;

const fromConstantTB = (state: Closure) => (mode: Mode, d: any) => {
    const constant = state[ARGS] as number;
    const vars = state[VARS] as VarsTuple;
    execClosure(vars[SINK])(mode, mode === Mode.run ? constant : d)
}

const sf = closureFactory(fromConstantTB, Role.source, undefined);

export const fromConstant = argsFactory(sf);

