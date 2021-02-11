import { closure } from "./common";
import { FromConstantInstance, FromConstantPrototype, FromConstantArgs } from "./from-constant-types";
import { Mode } from "./common";

const fromConstantTB = (state: FromConstantInstance) => (mode: Mode, d: any)=> {
    state.sink(mode, mode === Mode.run ? state.args.constant : d)
}

const fromConstantCB = (state: FromConstantPrototype) => (mode: Mode, sink: any) => {
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
    const prototype: FromConstantPrototype = { args };
    return closure(prototype, fromConstantCB);
}
