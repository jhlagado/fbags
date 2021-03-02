import { CProc, CSProc, Tuple, Elem } from './types';
import { ARGS, SOURCE, Role, Mode, VARS } from './constants';
import { elemClone, tupleClone, tupleDestroy, isOwned, tupleNew, tget } from './tuple-utils';

export const isTuple = (elem?: Elem): elem is Tuple => Array.isArray(elem) && elem.length === 4;

export const createClosure = (state: Tuple, cproc: CProc | CSProc, deep = false): Tuple => {
    const closure = tupleClone(state, deep);
    closure.proc = cproc;
    closure.name = cproc.name;
    return closure;
};

export const createClosure1 = (a: Elem, b: Elem, c: Elem, d: Elem, cproc: CProc | CSProc): Tuple => {
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
    createClosure1(elemClone(getArgs(args), true), 0, 0, 0, cproc);

export const sinkFactory = (cproc: CProc, role: Role): CSProc => {
    const sinkFactoryProc = (state: Tuple) => (source: Tuple) => {
        const tb = createClosure1(elemClone(state[ARGS], false), 0, elemClone(source, true), 0, cproc);
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
        const instance: Tuple = tupleNew(tget(state, ARGS), tget(state, VARS), tget(state, SOURCE), sink);
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

// export const closureFactory1 = (cproc: CProc, role: Role): CProc => {
//     const closureFactoryProc = (state: Tuple) => (mode: Mode, sink: Tuple) => {
//         if (mode !== Mode.start) return;
//         const instance: Tuple = tupleClone(state, true);
//         instance.name = 'closure-factory';
//         tsett(instance, SINK, sink, false);
//         const tb = closure(instance, cproc);
//         switch (role) {
//             case Role.source:
//                 closureFactoryGreet(sink, tb)
//                 break;
//             case Role.sink:
//                 const source = tgett(instance, SOURCE);
//                 closureFactoryGreet(source, tb)
//                 break;
//         }
//         return tb;
//     }
//     return closureFactoryProc;
// }
