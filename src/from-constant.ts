import { CB, Role, Mode, ARGS, VARS } from "./common";
import { argsFactory, cbExec, cbFactory } from "./utils";

type VarsTuple = [CB, undefined, undefined, undefined]
const SINK = 0;

const fromConstantTB = (state: CB) => (mode: Mode, d: any) => {
    const constant = state[ARGS] as number;
    const vars = state[VARS] as VarsTuple;
    cbExec(vars[SINK])(mode, mode === Mode.run ? constant : d)
}

const sf = cbFactory(fromConstantTB, Role.source, undefined);

export const fromConstant = argsFactory(sf);

