import { CBProc, Role, Mode, Vars, VarsFunction, CBSProc, CBArgs, CB, CBI } from "./common";

type VarsTuple = [CB, undefined, undefined, undefined]
const SINK = 0;

export const closure = (state: CB, cbf: CBProc | CBSProc): CB => {
    const instance: CB = [...state];
    instance[CBI.proc] = cbf;
    return instance;
}

export const isVarsFunction = (x: any): x is VarsFunction => {
    return (typeof x === 'function') && (x.length === 1);
}

export const cbExec = (cb?: CB) => {
    if (!cb) return (..._args: any) => { }
    const proc = cb[CBI.proc] as CBProc;
    return proc(cb);
}

export const argsFactory = (cbf: CBProc | CBSProc) => (args: CBArgs) => {
    const instance: CB = [undefined, undefined, undefined, undefined,];
    instance[CBI.args] = args;
    return closure(instance, cbf);
}

export const sinkFactory = (cbf: CBProc, role: Role): CBSProc =>
    (state) => (source) => {
        const instance:CB = [...state]
        instance[CBI.source] = source;
        const tb = closure(instance, cbf);
        switch (role) {
            case Role.sink:
                (cbExec(source))(Mode.start, tb);
                break;
        }
        return tb;
    }

export const cbFactory = (tbf: CBProc, role: Role, vars: Vars): CBProc =>
    (state) => (mode, sink: CB) => {
        if (mode !== Mode.start) return;
        const instance: CB = [...state];
        instance[CBI.vars] = isVarsFunction(vars) ? vars(state[CBI.args]) : vars,
            (instance[CBI.vars] as VarsTuple)[SINK] = sink;
        const tb = closure(instance, tbf);
        switch (role) {
            case Role.source:
                (cbExec(sink))(Mode.start, tb)
                break;
            case Role.sink:
                (cbExec(instance[CBI.source] as CB))(Mode.start, tb);
                break;
        }
        return tb;
    }

