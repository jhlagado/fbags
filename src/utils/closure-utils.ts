import { CProc, CSProc, Tuple, Elem, } from "./types";
import { ARGS, SOURCE, SINK, Role, Mode } from "./constants";
import { tupleNew, tsett, tgett, tset, elemClone, tupleClone } from "./tuple-utils";

export const isTuple = (elem: Elem): elem is Tuple => Array.isArray(elem) && elem.length === 4;

export const closure = (state: Tuple, cproc: CProc | CSProc): Tuple => {
    const instance = tupleClone(state, false);
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
        const instance: Tuple = tupleNew();
        tset(instance, ARGS, elemClone(tgett(state, ARGS), false), false);
        tsett(instance, SOURCE, source, false);
        const tb = closure(instance, cproc);
        switch (role) {
            case Role.sink:
                (execClosure(source))(Mode.start, tb);
                break;
        }
        return tb;
    }

export const closureFactory = (cproc: CProc, role: Role): CProc =>
    (state) => (mode, sink: Tuple) => {
        if (mode !== Mode.start) return;
        const instance: Tuple = tupleNew(...state);
        tsett(instance, SINK, sink, false);
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

