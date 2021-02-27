import { Elem, Owner, Tuple } from "./types";
import { isTuple } from "./closure-utils";
// import { formatTuple } from "./format-utils";

export const tupleList: Tuple[] = [];

export const tupleNew = (...args: Elem[]) => {
    const tuple = [0, 0, 0, 0] as Tuple;
    for (let i = 0; i < args.length; i++) {
        tset(tuple, i, args[i], true)
    }
    tupleList.push(tuple);
    return tuple;
};

export const ownerNew = (container: Tuple, offset: number) => ({ container, offset });

export const hasOwner = (elem: Elem): boolean => {
    const owner = getOwner(elem);
    if (!owner) return false;
    const { container, offset } = owner;
    const self = tgett(container, offset);
    return elem === self;
}

export const getOwner = (elem: Elem): Owner | undefined => {
    if (!isTuple(elem)) return;
    if (!elem.owner) return;
    return elem.owner;
};

export const setOwner = (elem: Elem, owner: Owner | undefined) => {
    if (!isTuple(elem)) return;
    elem.owner = owner;
};

export const isOwned = (elem: Elem): elem is Tuple => {
    const owner = getOwner(elem);
    return isOwnedBy(elem, owner);
};

export const isOwnedBy = (elem: Elem, owner: Owner | undefined): elem is Tuple => {
    if (!owner) return false;
    const { container, offset } = owner;
    return tgett(container, offset) === elem;
};

export const maskGet = (tuple: Tuple, offset: number): boolean => {
    let mask = tuple.mask || 0;
    const m = 1 << offset;
    const v = mask & 0xF & m;
    return v !== 0;
};

export const maskSet = (tuple: Tuple, offset: number, value: boolean) => {
    let mask = tuple.mask || 0;
    const m = ~(1 << offset)
    mask &= m;
    const b = (value ? 1 : 0) << offset;
    mask |= b;
    tuple.mask = mask;
};

export const tget = (tuple: Tuple, offset: number): Elem => {
    // if (tuple.destroy) throw new Error('Tried to get on destroyed tuple ' + formatTuple(tuple));
    return tuple[offset];
}

export const tgett = (tuple: Tuple, offset: number): Tuple => {
    return tget(tuple, offset) as Tuple;
}

export const tgetv = (tuple: Tuple, offset: number): number => {
    return tget(tuple, offset) as number;
}

export const tsetv = (tuple: Tuple, offset: number, value: number) => {
    if (maskGet(tuple, offset)) {
        const elem0 = tgett(tuple, offset);
        if (isOwned(elem0)) {
            setOwner(elem0, undefined);
            tupleDestroy(elem0);
        }
    }
    tuple[offset] = value;
    maskSet(tuple, offset, false)
}

export const tset = (tuple: Tuple, offset: number, elem: Elem, move: boolean) => {
    // if (tuple.destroy) throw new Error('Tried to set on destroyed tuple ' + formatTuple(tuple));
    if (maskGet(tuple, offset)) {
        const elem0 = tgett(tuple, offset);
        if (isOwned(elem0)) {
            setOwner(elem0, undefined);
            tupleDestroy(elem0);
        }
    }
    const t = isTuple(elem);
    tuple[offset] = elem;
    maskSet(tuple, offset, t)
    if (!t) return;
    if (!hasOwner(elem) || move) {
        setOwner(elem, { container: tuple, offset });
    }
}

export const tsett = (tuple: Tuple, offset: number, elem: Tuple, move: boolean) =>
    tset(tuple, offset, elem, move);

export const tupleDestroy = (tuple: Tuple) => {
    console.log('DESTROY!')
    setOwner(tuple, undefined);
    tuple.destroy = true;
    for (let i = 0; i < 4; i++) {
        if (maskGet(tuple, i)) {
            const child = tgett(tuple, i);
            const owner = getOwner(child);
            if (owner && owner.container === tuple && isOwnedBy(child, owner)) {
                tupleDestroy(child);
                console.log('DESTROY CHILD', i)
            }
        }
    }
    console.log('FREE');
}

export const tupleClone = (tuple: Tuple, deep: boolean): Tuple => {
    const tuple1 = tupleNew(0, 0, 0, 0);
    tuple1.proc = tuple.proc;
    for (let i = 0; i < 4; i++) {
        if (maskGet(tuple, i)) {
            const child = tgett(tuple, i);
            const child1 = deep ? tupleClone(child, deep) : child;
            tsett(tuple1, i, child1, false);
        } else {
            const child = tgetv(tuple, i);
            tsetv(tuple1, i, child);
        }
    }
    return tuple1;
}

export const elemClone = (elem: Elem, deep: boolean): Elem => {
    if (!isTuple(elem)) return elem;
    return tupleClone(elem, deep);
}

