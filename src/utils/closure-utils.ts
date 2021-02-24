import { CProc, Role, Mode, VarsFunction, CSProc, Tuple, Elem, TPolicy } from "./common";
import { ARGS, SOURCE, SINK } from "./constants";
import { tupleNew, tsett, tgett, tset } from "./tuple-utils";

export const isTuple = (elem: Elem): elem is Tuple => Array.isArray(elem) && elem.length === 4;

export const closure = (state: Tuple, cproc: CProc | CSProc): Tuple => {
    const instance: Tuple = tupleNew(...state);
    instance.proc = cproc;
    return instance;
}

export const execClosure = (closure?: Tuple) => {
    if (!closure) return (..._args: any[]) => { }
    const proc = closure.proc as CProc;
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
        tsett(instance, SOURCE, source, TPolicy.ref);
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
        tsett(instance, SINK, sink, TPolicy.ref);
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

