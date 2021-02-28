import { CProc, CSProc, Tuple, Elem, } from "./types";
import { ARGS, SOURCE, SINK, Role, Mode } from "./constants";
import { tupleNew, tsett, tgett, tset, elemClone, tupleClone, tupleDestroy } from "./tuple-utils";

export const isTuple = (elem?: Elem): elem is Tuple => Array.isArray(elem) && elem.length === 4;

export const closure = (state: Tuple, cproc: CProc | CSProc, deep = false): Tuple => {
    const closure = tupleClone(state, deep);
    closure.proc = cproc;
    closure.name = cproc.name;
    return closure;
}

export const execClosure = (closure?: Tuple) => {
    if (!closure) return (..._args: any[]) => { }
    const proc = closure.proc as CProc;
    const result = proc(closure);
    // if (!isOwned(closure)) tupleDestroy(closure);
    return result;
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

export const argsFactory = (cproc: CProc | CSProc, destroy = false) => (...args: Elem[]) => {
    const instance = tupleNew(0, 0, 0, 0);
    instance.name = 'args-factory';
    tset(instance, ARGS, getArgs(args), false);
    const af = closure(instance, cproc);
    if (destroy) tupleDestroy(instance);
    return af;
}

export const sinkFactory = (cproc: CProc, role: Role): CSProc => {
    const sinkFactoryProc =
        (state: Tuple) => (source: Tuple) => {
            const instance: Tuple = tupleNew();
            instance.name = 'sink-factory';
            tset(instance, ARGS, elemClone(tgett(state, ARGS), false), false);
            tsett(instance, SOURCE, elemClone(source, false) as Tuple, false);
            const tb = closure(instance, cproc);
            // tupleDestroy(instance)
            switch (role) {
                case Role.sink:
                    (execClosure(source))(Mode.start, tb);
                    break;
            }
            return tb;
        }
    return sinkFactoryProc;
}

export const closureFactoryGreet = (receiver: Tuple, tb: Tuple) => (execClosure(receiver))(Mode.start, tb);

export const closureFactory = (cproc: CProc, role: Role): CProc => {
    const closureFactoryProc = (state: Tuple) => (mode: Mode, sink: Tuple) => {
        if (mode !== Mode.start) return;
        const instance: Tuple = tupleClone(state, false);
        instance.name = 'closure-factory';
        tsett(instance, SINK, sink, false);
        const tb = closure(instance, cproc);
        // tupleDestroy(instance);
        switch (role) {
            case Role.source:
                closureFactoryGreet(sink, tb)
                break;
            case Role.sink:
                const source = tgett(instance, SOURCE);
                closureFactoryGreet(source, tb)
                break;
        }
        return tb;
    }
    return closureFactoryProc;
}

