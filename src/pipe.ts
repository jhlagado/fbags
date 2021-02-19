import { Closure, CSProc, PROC } from "./common";

export const pipe = (source: Closure, ...sinks: Closure[]) => {
    let res: Closure | void = source;
    for (let i = 0, n = sinks.length; i < n; i++) {
        const closure = sinks[i];
        const proc = closure[PROC] as CSProc;
        res = res ? (proc(closure))(res) : res;
    }
    return res;
}