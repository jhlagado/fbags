import { closure } from "./common";
import { FromConstantState, FromConstantArgs } from "./from-constant-types";
import { Mode } from "./common";

const fromConstantTB = (state: FromConstantState) => (mode: Mode, d: any)=> {
    state.sink?.(mode, mode === Mode.run ? state.args.constant : d)
}

const fromConstantCB = (state: FromConstantState) => (mode: Mode, sink: any) => {
    if (mode !== Mode.init) return;
    const instance: FromConstantState = {
        ...state,
        sink,
        vars: {}
    }
    const tb = closure(instance, fromConstantTB);
    sink(Mode.init, tb);
}

export function fromConstant(args: FromConstantArgs) {
    const instance: FromConstantState = { args, vars:{} };
    return closure(instance, fromConstantCB);
}
