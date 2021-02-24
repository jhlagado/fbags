import { CProc, Role, Mode, VarsFunction, CSProc, Tuple, Elem } from "./common";
import { ARGS, PROC, SOURCE, VARS, SINK } from "./constants";
import { lookup, register } from "./registry";
import { tupleNew, tsett, tsetv, tgetv, tgett, tget, tset } from "./tuple-utils";

export const isTuple = (elem: Elem): elem is Tuple => Array.isArray(elem) && elem.length === 4;

export const closure = (state: Tuple, cproc: CProc | CSProc): Tuple => {
    const instance: Tuple = tupleNew(...state);
    tsetv(instance, PROC, register(cproc));
    return instance;
}

export const isVarsFunction = (x: any): x is VarsFunction => {
    return (typeof x === 'function') && (x.length === 1);
}

export const execClosure = (closure?: Tuple) => {
    if (!closure) return (..._args: any) => { }
    const proc = lookup(tgetv(closure, PROC)) as CProc;
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
    const instance = tupleNew(0, 0, 0, 0);
    tset(instance, ARGS, getArgs(args), false);
    return closure(instance, cproc);
}

export const sinkFactory = (cproc: CProc, role: Role): CSProc =>
    (state) => (source) => {
        const instance: Tuple = tupleNew(...state);
        tsett(instance, SOURCE, source, false);
        const tb = closure(instance, cproc);
        switch (role) {
            case Role.sink:
                (execClosure(source))(Mode.start, tb);
                break;
        }
        return tb;
    }

export const closureFactory = (cproc: CProc, role: Role, varsFunc?: VarsFunction): CProc =>
    (state) => (mode, sink: Tuple) => {
        if (mode !== Mode.start) return;
        const instance: Tuple = tupleNew(...state);
        const vars = isVarsFunction(varsFunc) ? varsFunc(tget(state, ARGS)) : tupleNew(0, 0, 0, 0);
        tset(instance, VARS, vars, false);
        tsett(tgett(instance, VARS), SINK, sink, false);
        const tb = closure(instance, cproc);
        switch (role) {
            case Role.source:
                (execClosure(sink))(Mode.start, tb)
                break;
            case Role.sink:
                (execClosure(tgett(instance, SOURCE)))(Mode.start, tb);
                break;
        }
        return tb;
    }

