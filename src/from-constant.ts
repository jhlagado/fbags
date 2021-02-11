import { closure } from "./common";
import { FromConstantInstance, FromConstantArgs } from "./from-constant-types";
import { Mode } from "./common";

const fromConstantTB = (state: FromConstantInstance) => (mode: Mode, d: any)=> {
    state.sink?.(mode, mode === Mode.run ? state.args.constant : d)
}

const fromConstantCB = (state: FromConstantInstance) => (mode: Mode, sink: any) => {
    if (mode !== Mode.init) return;
    const instance: FromConstantInstance = {
        ...state,
        sink,
        vars: {}
    }
    const tb = closure(instance, fromConstantTB);
    sink(Mode.init, tb);
}

export function fromConstant(args: FromConstantArgs) {
    const instance: FromConstantInstance = { args, vars:{} };
    return closure(instance, fromConstantCB);
}
