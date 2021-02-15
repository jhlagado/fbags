import { Role } from "./types/common";
import { FromConstantState, FromConstantArgs, FromConstantVars } from "./types/from-constant-types";
import { Mode } from "./types/common";
import { argsFactory, cbFactory } from "./utils";

const fromConstantTB = (state: FromConstantState) => (mode: Mode, d: any)=> {
    state.vars?.sink?.(mode, mode === Mode.run ? state.args.constant : d)
}

const sf = cbFactory({}, fromConstantTB, Role.source);

export const fromConstant = argsFactory<FromConstantArgs, FromConstantVars>(sf);

