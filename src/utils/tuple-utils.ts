import { Elem, Owner, Tuple } from "./common";
import { isTuple } from "./closure-utils";

export const tupleNew = (...args: Elem[]) => args.concat([0, 0, 0, 0]).slice(0, 4) as Tuple;
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
    return tuple[offset];
}

export const tgett = (tuple: Tuple, offset: number): Tuple => {
    return tuple[offset] as Tuple;
}

export const tgetv = (tuple: Tuple, offset: number): number => {
    return tuple[offset] as number;
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
    if (maskGet(tuple, offset)) {
        const elem0 = tgett(tuple, offset);
        if (isOwned(elem0)) {
            setOwner(elem0, undefined);
            tupleDestroy(elem0);
        }
    }
    tuple[offset] = elem;
    const t = isTuple(elem);
    maskSet(tuple, offset, t)
    if (!t) return;
    if (!hasOwner(elem) || move) {
        setOwner(elem, { container: tuple, offset });
    }
}

export const tsett = (tuple: Tuple, offset: number, elem: Tuple, move: boolean) => {
    if (maskGet(tuple, offset)) {
        const elem0 = tgett(tuple, offset);
        if (isOwned(elem0)) {
            setOwner(elem0, undefined);
            tupleDestroy(elem0);
        }
    }
    tuple[offset] = elem;
    maskSet(tuple, offset, true)
    if (!hasOwner(elem) || move) {
        setOwner(elem, { container: tuple, offset });
    }
}

export const tupleDestroy = (tuple: Tuple) => {
    console.log('DESTROY!')
    setOwner(tuple, undefined);
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

