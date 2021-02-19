import {
    CBProc, Role, Mode, Vars, VarsFunction, CBSProc, CB, Elem,
    EMPTY_TUPLE, Tuple, VARS, ARGS, PROC, SOURCE
} from "./common";

type VarsTuple = [CB, undefined, undefined, undefined]
const SINK = 0;

export const closure = (state: CB, cbf: CBProc | CBSProc): CB => {
    const instance: CB = [...state];
    instance[PROC] = cbf;
    return instance;
}

export const isVarsFunction = (x: any): x is VarsFunction => {
    return (typeof x === 'function') && (x.length === 1);
}

export const cbExec = (cb?: CB) => {
    if (!cb) return (..._args: any) => { }
    const proc = cb[PROC] as CBProc;
    return proc(cb);
}

export const argsFactory = (cbf: CBProc | CBSProc) => (args: Elem) => {
    const instance = [...EMPTY_TUPLE] as CB;
    instance[ARGS] = args;
    return closure(instance, cbf);
}

export const sinkFactory = (cbf: CBProc, role: Role): CBSProc =>
    (state) => (source) => {
        const instance: CB = [...state]
        instance[SOURCE] = source;
        const tb = closure(instance, cbf);
        switch (role) {
            case Role.sink:
                (cbExec(source))(Mode.start, tb);
                break;
        }
        return tb;
    }

export const cbFactory = (tbf: CBProc, role: Role, vars: Vars = [...EMPTY_TUPLE] as Tuple): CBProc =>
    (state) => (mode, sink: CB) => {
        if (mode !== Mode.start) return;
        const instance: CB = [...state];
        instance[VARS] = isVarsFunction(vars) ? vars(state[ARGS]) : vars;
        (instance[VARS] as VarsTuple)[SINK] = sink;
        const tb = closure(instance, tbf);
        switch (role) {
            case Role.source:
                (cbExec(sink))(Mode.start, tb)
                break;
            case Role.sink:
                (cbExec(instance[SOURCE] as CB))(Mode.start, tb);
                break;
        }
        return tb;
    }

