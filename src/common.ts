export enum Mode {
    init = 0,
    run = 1,
    destroy = 2,
}

export enum Role {
    none = 0,
    source = 1,
    sink = 2,
}

export interface State<A, V> {
    args: A,
    sink?: CB,
    source?: CB,
    vars?: V,
}

export type CB = (mode: Mode, arg?: any) => void;
export type CBS = (source: CB) => CB;
export type CBF<A, V> = (state: State<A, V>) => CB;
export type CBSF<A, V> = (state: State<A, V>) => CBS;

type VarsFunction<A, V> = (args: A) => V;
type Vars<A, V> = V | VarsFunction<A, V>;

export type Effect = (value: string) => void;
export type Mapper = (value: any) => any;
export type Reducer = (acc: any, value: any) => any;

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
        if (mode !== Mode.init) return;
        const instance: State<A, V> = {
            ...state,
            sink,
            vars: isVarsFunction<A, V>(vars) ? vars(state.args) : vars as V,
        }
        const tb = closure(instance, tbf);
        switch (role) {
            case Role.source:
                sink(Mode.init, tb)
                break;
            case Role.sink:
                instance.source?.(Mode.init, tb);
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
                instance.source?.(Mode.init, tb);
                break;
        }
        return tb;
    }

