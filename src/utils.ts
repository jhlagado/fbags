import { CBProc, Role, Mode, Vars, VarsFunction, Closure, CBSProc, CBArgs, CB } from "./common";

export const closure = (state: any, cbf: CBProc | CBSProc): Closure => ({ ...state, proc: cbf })

export const isVarsFunction = (x: any): x is VarsFunction => {
    return (typeof x === 'function') && (x.length === 1);
}

export const cbExec = (closure?: Closure) => {
    if (!closure) return (..._args: any) => { }
    const proc = closure.proc as CBProc;
    return proc(closure);
}

export const argsFactory = (cbf: CBProc | CBSProc) => (args: CBArgs) => {
    const instance = { args };
    return closure(instance, cbf);
}

export const sinkFactory = (cbf: CBProc, role: Role): CBSProc =>
    (state) => (source) => {
        const instance: Closure = {
            ...state,
            source,
            vars: {},
        }
        const tb = closure(instance, cbf);
        switch (role) {
            case Role.sink:
                (cbExec(source))(Mode.start, tb);
                break;
        }
        return tb;
    }

export const cbFactory = (vars: Vars, tbf: CBProc, role: Role): CBProc =>
    (state) => (mode, sink: CB) => {
        if (mode !== Mode.start) return;
        const instance: Closure = {
            ...state,
            vars: isVarsFunction(vars) ? vars(state.args) : vars,
        };
        instance.vars!.sink = sink;
        const tb = closure(instance, tbf);
        switch (role) {
            case Role.source:
                (cbExec(sink))(Mode.start, tb)
                break;
            case Role.sink:
                (cbExec(instance.source!))(Mode.start, tb);
                break;
        }
        return tb;
    }

