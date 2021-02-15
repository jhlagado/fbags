import { CBF, CBSF, Role, Mode, State, Vars, VarsFunction } from "./types/common";

export const closure = (state: any, cbf: any): any => cbf(state)

export const argsFactory = <A, V>(cbf: CBF<A, V> | CBSF<A, V>) => (args: A) => {
    const instance = { args };
    return closure(instance, cbf);
}

export const isVarsFunction = <A, V>(x: any): x is VarsFunction<A, V> => {
    return (typeof x === 'function') && (x.length === 1); // or whatever test
}

export const cbFactory = <A, V>(vars: Vars<A, V>, tbf: CBF<A, V>, role: Role): CBF<A, V> =>
    (state) => (mode, sink) => {
        if (mode !== Mode.start) return;
        const instance: State<A, V> = {
            ...state,
            vars: isVarsFunction<A, V>(vars) ? vars(state.args) : vars as V,
        };
        instance.vars!.sink = sink;
        const tb = closure(instance, tbf);
        switch (role) {
            case Role.source:
                sink(Mode.start, tb)
                break;
            case Role.sink:
                instance.source?.(Mode.start, tb);
                break;
        }
        return tb;
    }

export const sinkFactory = <A, V>(cbf: CBF<A, V>, role: Role): CBSF<A, V> =>
    (state) => (source) => {
        const instance: State<A, V> = {
            ...state,
            source,
            vars: <V>{},
        }
        const tb = closure(instance, cbf);
        switch (role) {
            case Role.sink:
                source(Mode.start, tb);
                break;
        }
        return tb;
    }

