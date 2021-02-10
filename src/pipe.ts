import { CB, SinkFactory } from "./common";

export const pipe = (source: CB, ...sfs: SinkFactory[]) => {
    let res = source;
    for (let i = 0, n = sfs.length; i < n; i++) res = sfs[i](res);
    return res;
}