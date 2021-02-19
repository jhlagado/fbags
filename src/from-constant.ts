import { CB, Dict, Role } from "./common";
import { Mode } from "./common";
import { argsFactory, cbExec, cbFactory } from "./utils";

const fromConstantTB = (state: CB) => (mode: Mode, d: any) => {
    const args = state.args as Dict;
    const vars = state.vars as Dict;
    cbExec(vars.sink)(mode, mode === Mode.run ? args.constant : d)
}

const sf = cbFactory(fromConstantTB, Role.source, {});

export const fromConstant = argsFactory(sf);

