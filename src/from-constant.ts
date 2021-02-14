import { argsFactory, cbFactory, Role } from "./common";
import { FromConstantState, FromConstantArgs, FromConstantVars } from "./from-constant-types";
import { Mode } from "./common";

const fromConstantTB = (state: FromConstantState) => (mode: Mode, d: any)=> {
    state.sink?.(mode, mode === Mode.run ? state.args.constant : d)
}

const sf = cbFactory({}, fromConstantTB, Role.source);

export const fromConstant = argsFactory<FromConstantArgs, FromConstantVars>(sf);

