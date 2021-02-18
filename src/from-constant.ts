import { CB, Role } from "./common";
import { Mode } from "./common";
import { argsFactory, cbExec, cbFactory } from "./utils";

const fromConstantTB = (state: CB) => (mode: Mode, d: any)=> {
    cbExec(state.vars?.sink)(mode, mode === Mode.run ? state.args.constant : d)
}

const sf = cbFactory({}, fromConstantTB, Role.source);

export const fromConstant = argsFactory(sf);

