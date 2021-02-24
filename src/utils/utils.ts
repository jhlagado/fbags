import { CProc, Role, Mode, Vars, VarsFunction, CSProc, Tuple, Elem } from "./common";
import { ARGS, EMPTY_TUPLE, PROC, SOURCE, VARS } from "./constants";
import { lookup, register } from "./registry";
import { tget, tupleNew, tset } from "./tuple-utils";

export const isTuple = (elem: Elem): elem is Tuple => Array.isArray(elem) && elem.length === 4;

export const closure = (state: Tuple, cproc: CProc | CSProc): Tuple => {
    const instance: Tuple = tupleNew(...state);
    tset(instance, PROC, register(cproc), false);
    return instance;
}

export const isVarsFunction = (x: any): x is VarsFunction => {
    return (typeof x === 'function') && (x.length === 1);
}

export const execClosure = (closure?: Tuple) => {
    if (!closure) return (..._args: any) => { }
    const proc = lookup(tget(closure, PROC) as number) as CProc;
    return proc(closure);
}

export const getArgs = (args: Elem[]) => {
    switch (args.length) {
        case 0:
            return 0;
        case 1:
            return args[0];
        default:
            return tupleNew(...args);
    }
}

export const argsFactory = (cproc: CProc | CSProc) => (...args: Elem[]) => {
    const instance = tupleNew(...EMPTY_TUPLE);
    tset(instance, ARGS, getArgs(args), false);
    return closure(instance, cproc);
}

export const sinkFactory = (cproc: CProc, role: Role): CSProc =>
    (state) => (source) => {
        const instance: Tuple = tupleNew(...state);
        tset(instance, SOURCE, source, false);
        const tb = closure(instance, cproc);
        switch (role) {
            case Role.sink:
                (execClosure(source))(Mode.start, tb);
                break;
        }
        return tb;
    }

const SINK = 0;

export const closureFactory = (cproc: CProc, role: Role, vars: Vars = tupleNew(...EMPTY_TUPLE)): CProc =>
    (state) => (mode, sink: Tuple) => {
        if (mode !== Mode.start) return;
        const instance: Tuple = tupleNew(...state);
        tset(instance, VARS, isVarsFunction(vars) ? vars(tget(state, ARGS)) : vars, false);
        tset(tget(instance, VARS) as Tuple, SINK, sink, false);
        const tb = closure(instance, cproc);
        switch (role) {
            case Role.source:
                (execClosure(sink))(Mode.start, tb)
                break;
            case Role.sink:
                (execClosure(tget(instance, SOURCE) as Tuple))(Mode.start, tb);
                break;
        }
        return tb;
    }

