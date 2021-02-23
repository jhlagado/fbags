import { Tuple, CSProc } from "../utils/common";
import { PROC } from "../utils/constants";
import { lookup } from "../utils/registry";

export const pipe = (source: Tuple, ...sinks: Tuple[]) => {
    let res: Tuple | void = source;
    for (let i = 0, n = sinks.length; i < n; i++) {
        const closure = sinks[i];
        const proc = lookup(closure[PROC] as number) as CSProc;
        res = res ? (proc(closure))(res) : res;
    }
    return res;
}