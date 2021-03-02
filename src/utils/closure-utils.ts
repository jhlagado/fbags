import { CProc, CSProc, Tuple, Elem } from './types';
import { ARGS, SOURCE, Role, Mode, VARS, SINK } from './constants';
import { elemClone, tupleClone, tupleDestroy, isOwned, tupleNew, tset } from './tuple-utils';

export const isTuple = (elem?: Elem): elem is Tuple => Array.isArray(elem) && elem.length === 4;

export const createClosure = (a: Elem, b: Elem, c: Elem, d: Elem, cproc: CProc | CSProc): Tuple => {
    const closure = tupleNew(a, b, c, d);
    closure.proc = cproc;
    closure.name = cproc.name;
    return closure;
};

export const cleanupClosure = (closure: Tuple) => {
    if (!isOwned(closure)) tupleDestroy(closure);
};

export const execClosure = (closure: Tuple, mode: Mode, d?: any) => {
    const proc = closure.proc as CProc;
    const result = proc(closure)(mode, d);
    cleanupClosure(closure);
    return result;
};

export const getArgs = (args: Elem[]) => {
    switch (args.length) {
        case 0:
            return 0;
        case 1:
            return args[0];
        default:
            return tupleNew(args[0], args[1], args[2], args[3]);
    }
};

export const argsFactory = (cproc: CProc | CSProc) => (...args: Elem[]) =>
    createClosure(elemClone(getArgs(args), true), 0, 0, 0, cproc);

export const sinkFactory = (cproc: CProc, role: Role): CSProc => {
    const sinkFactoryProc = (state: Tuple) => (source: Tuple) => {
        const tb = createClosure(elemClone(state[ARGS], false), 0, elemClone(source, true), 0, cproc);
        switch (role) {
            case Role.sink:
                execClosure(source, Mode.start, tb);
                break;
            default:
                cleanupClosure(source);
        }
        return tb;
    };
    return sinkFactoryProc;
};

export const closureFactoryGreet = (receiver: Tuple, tb: Tuple) => {
    execClosure(receiver, Mode.start, tb);
};

export const closureFactory = (cproc: CProc, role: Role): CProc => {
    const closureFactoryProc = (state: Tuple) => (mode: Mode, sink: Tuple) => {
        if (mode !== Mode.start) return;
        // const instance: Tuple = tupleNew(state[ARGS] as Tuple, state[VARS] as Tuple, state[SOURCE] as Tuple, sink);

        const instance = [0, 0, 0, 0] as Tuple;
        console.log('sink0', sink.owner?.container === instance);

        tset(instance, ARGS, state[ARGS] as Tuple);
        tset(instance, VARS, state[VARS] as Tuple);
        tset(instance, SOURCE, state[SOURCE] as Tuple);
        tset(instance, SINK, sink);

        const tb = tupleClone(instance, false);
        tb.proc = cproc;
        tb.name = cproc.name;
        switch (role) {
            case Role.source:
                closureFactoryGreet(sink, tb);
                break;
            case Role.sink:
                const source = tb[SOURCE] as Tuple;
                closureFactoryGreet(source, tb);
                break;
        }
        tupleDestroy(instance);
        return tb;
    };
    return closureFactoryProc;
};
