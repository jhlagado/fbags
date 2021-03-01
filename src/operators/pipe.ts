// import { isOwned, tupleDestroy } from "../utils/tuple-utils";
import { isOwned, tupleDestroy } from "../utils/tuple-utils";
import { Tuple, CSProc } from "../utils/types";

export const pipe = (source: Tuple, ...sinks: Tuple[]) => {
    let res: Tuple | void = source;
    for (let i = 0, n = sinks.length; i < n; i++) {
        const closure = sinks[i];
        const proc = closure.proc as CSProc;
        res = res ? (proc(closure))(res) : res;
        if (!isOwned(closure)) tupleDestroy(closure);
    }
    return res;
}