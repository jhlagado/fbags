import { CB, CBI, Dict, Role } from "./common";
import { Mode } from "./common";
import { argsFactory, cbExec, cbFactory } from "./utils";

const fromConstantTB = (state: CB) => (mode: Mode, d: any) => {
    const constant = state[CBI.args] as Dict;
    const vars = state[CBI.vars] as Dict;
    cbExec(vars.sink)(mode, mode === Mode.run ? constant : d)
}

const sf = cbFactory(fromConstantTB, Role.source, {});

export const fromConstant = argsFactory(sf);

