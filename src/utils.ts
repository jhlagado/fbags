import {
    CProc, Role, Mode, Vars, VarsFunction, CSProc, Closure, Elem,
    EMPTY_TUPLE, Tuple, VARS, ARGS, PROC, SOURCE
} from "./common";
import { lookupObject, registerObject } from "./objects";

export const closure = (state: Closure, cproc: CProc | CSProc): Closure => {
    const instance: Closure = [...state];
    instance[PROC] = registerObject(cproc);
    return instance;
}

export const isVarsFunction = (x: any): x is VarsFunction => {
    return (typeof x === 'function') && (x.length === 1);
}

export const execClosure = (closure?: Closure) => {
    if (!closure) return (..._args: any) => { }
    const proc = lookupObject(closure[PROC] as number) as CProc;
    return proc(closure);
}

export const argsFactory = (cproc: CProc | CSProc) => (args: Elem) => {
    const instance = [...EMPTY_TUPLE] as Closure;
    instance[ARGS] = args;
    return closure(instance, cproc);
}

export const sinkFactory = (cproc: CProc, role: Role): CSProc =>
    (state) => (source) => {
        const instance: Closure = [...state]
        instance[SOURCE] = source;
        const tb = closure(instance, cproc);
        switch (role) {
            case Role.sink:
                (execClosure(source))(Mode.start, tb);
                break;
        }
        return tb;
    }

type VarsTuple = [Closure, 0, 0, 0]
const SINK = 0;

export const closureFactory = (cproc: CProc, role: Role, vars: Vars = [...EMPTY_TUPLE] as Tuple): CProc =>
    (state) => (mode, sink: Closure) => {
        if (mode !== Mode.start) return;
        const instance: Closure = [...state];
        instance[VARS] = isVarsFunction(vars) ? vars(state[ARGS]) : vars;
        (instance[VARS] as VarsTuple)[SINK] = sink;
        const tb = closure(instance, cproc);
        switch (role) {
            case Role.source:
                (execClosure(sink))(Mode.start, tb)
                break;
            case Role.sink:
                (execClosure(instance[SOURCE] as Closure))(Mode.start, tb);
                break;
        }
        return tb;
    }

