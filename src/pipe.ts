import { CB, CBSProc } from "./common";

export const pipe = (source: CB, ...sfs: CB[]) => {
    let res: CB | void = source;
    for (let i = 0, n = sfs.length; i < n; i++) {
        const cbs = sfs[i];
        const proc = cbs.proc as CBSProc;
        res = res ? (proc(cbs))(res) : res;
    }
    return res;
}