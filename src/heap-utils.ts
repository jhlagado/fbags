import { LAST, TUPLE_SIZE } from "./common";

const MEM_SIZE = 100000;
const CELL_SIZE = 4;
const TUPLE_CELLS = TUPLE_SIZE * CELL_SIZE;
const NIL = -1; // needed because 0 is a valid address

export const buffer = new ArrayBuffer(MEM_SIZE);
export const mem = new DataView(buffer);
let herePtr = 0;

let heapPtr: number;
let freePtr: number;
export let heapStart: number;
export let heapEnd: number;

export const allot = (size: number) => {
    herePtr += size;
}

export const cells = (value: number) => value << 2;
export const tuples = (value: number) => value << 2 << 2;

export const arrayNew = (size: number) => {
    const h = herePtr;
    allot(cells(size));
    return h;
}

const tupleSet = (ptr: number, a: number, b: number, c: number, d: number) => {
    mem.setInt32(ptr, a);
    ptr += CELL_SIZE;
    mem.setInt32(ptr, b);
    ptr += CELL_SIZE;
    mem.setInt32(ptr, c);
    ptr += CELL_SIZE;
    mem.setInt32(ptr, d);
}

export const heapInit = (size: number) => {
    heapPtr = 0;
    freePtr = NIL;
    heapStart = arrayNew(size * TUPLE_SIZE);
    heapEnd = herePtr;
}

export const heapIsFull = () => {
    if (freePtr !== NIL) return false
    return (heapEnd <= heapPtr)
}

export const heapNew = (a: number, b: number, c: number, d: number): number => {
    if (heapIsFull()) throw new Error('Out of heap space');
    let tuplePtr: number;
    if (freePtr !== NIL) {
        tuplePtr = freePtr;
        freePtr = mem.getInt32(tuplePtr + cells(LAST));
    }
    else {
        tuplePtr = heapPtr;
        heapPtr += TUPLE_CELLS;
    }
    tupleSet(tuplePtr, a, b, c, d);
    return tuplePtr;
};

export const heap_free = (tuplePtr: number) => {
    mem.setInt32(tuplePtr + cells(LAST), freePtr);
    freePtr = tuplePtr;
}
