export enum Mode {
    init = 0,
    run = 1,
    destroy = 2,
}

export type CB = (mode: Mode, arg?: any) => void;
export type CBSF<S> = (state: S) => (source: CB) => CB;
export type CBF<S> = (state: S) => (mode: Mode, arg?: any) => void;

export interface CBArgs {
}
export interface CBVars {
}
export interface CBPrototype {
    args: CBArgs;
}

export interface CBInstance extends CBPrototype {
    vars: CBVars;
}

export interface State<A, V> {
    args: A,
    sink?: CB,
    source?: CB,
    vars?: V,
}

type VarsFunction<A, V> = (args: A) => V;
type Vars<A, V> = V | VarsFunction<A, V>;

export type SinkFactory = (source: CB) => CB | void;

export type Effect = (value: string) => void;
export type Mapper = (value: any) => any;
export type Reducer = (acc: any, value: any) => any;

export const closure = (state: any, cbf: any): any => cbf(state)

export const argsFactory = <A, V>(cbf: CBF<State<A, V>> | CBSF<State<A, V>>) => (args: A) => {
    const instance = { args };
    return closure(instance, cbf);
}

// export const sinkFactory = <P>(cbf: CBF<P>): CBSF<P> => (state) => (source) => {
//     const instance: P = {
//         ...state,
//         source,
//     }
//     return closure(instance, cbf);
// }

export const sinkFactory = <A,V>(cbf: CBF<State<A,V>>): CBSF<State<A,V>> => (state) => (source) => {
    const instance: State<A,V> = {
        ...state,
        source,
        vars: <V>{},
    }
    return closure(instance, cbf);
}

export const tbSinkFactory = <A,V>(cbf: CBF<State<A,V>>): CBSF<State<A,V>> => (state) => (source) => {
    const tb = sinkFactory<A,V>(cbf)(state)(source);
    source?.(Mode.init, tb);
    return tb;
}

export const isVarsFunction = <A, V>(x: any): x is VarsFunction<A, V> => {
    return (typeof x === 'function') && (x.length === 1); // or whatever test
}

export const cbFactory = <A, V>(vars: Vars<A, V>, tbf: CBF<State<A, V>>): CBF<State<A, V>> => (state) => (mode, sink) => {
    if (mode !== Mode.init) return;
    const instance: State<A, V> = {
        ...state,
        sink,
        vars: isVarsFunction<A, V>(vars) ? vars(state.args) : vars as V,
    }
    const tb = closure(instance, tbf);
    instance.source?.(Mode.init, tb);
}
