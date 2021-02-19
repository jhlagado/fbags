import { CBProc, Role, Mode, Vars, VarsFunction, CBSProc, CBArgs, CB, Tuple, Dict } from "./common";

export const isDict = (x: any): x is Dict => Object.prototype.toString.call(x) === '[object Object]';
export const isTuple = (x: any): x is Tuple => Array.isArray(x) && x.length === 4;

export const closure = (state: any, cbf: CBProc | CBSProc): CB => ({ ...state, proc: cbf })

export const isVarsFunction = (x: any): x is VarsFunction => {
    return (typeof x === 'function') && (x.length === 1);
}

export const cbExec = (closure?: CB) => {
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
        const instance = {
            ...state,
            source,
        }
        const tb = closure(instance, cbf);
        switch (role) {
            case Role.sink:
                (cbExec(source))(Mode.start, tb);
                break;
        }
        return tb;
    }

export const cbFactory = (tbf: CBProc, role: Role, vars?: Vars): CBProc =>
    (state) => (mode, sink: CB) => {
        if (mode !== Mode.start) return;
        const instance: CB = {
            ...state,
            vars: isVarsFunction(vars) ? vars(state.args) : vars,
        };
        if (isDict(instance.vars)) instance.vars!.sink = sink;
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

