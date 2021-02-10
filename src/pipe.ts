import { CB, SinkFactory } from "./common";

export const pipe = (source: CB, ...sfs: SinkFactory[]) => {
    let res: CB | void = source;
    for (let i = 0, n = sfs.length; i < n; i++) { 
        res = res ? sfs[i](res) : res; 
    }
    return res;
}