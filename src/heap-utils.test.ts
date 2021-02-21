import { heapEnd, heapInit, heapIsFull, heapStart, heapNew, tuples, heap_free } from "./heap-utils";

test('heap-utils', () => {
    heapInit(2);
    expect(heapEnd - heapStart).toBe(tuples(2));
    expect(heapIsFull()).toBe(false);
    const t1 = heapNew(0,0,0,0);
    expect(heapIsFull()).toBe(false);
    const t2 = heapNew(0,0,0,0);
    expect(heapIsFull()).toBe(true);
    heap_free(t1);
    expect(heapIsFull()).toBe(false);
    const t3 = heapNew(0,0,0,0);
    expect(t3 === t1).toBeTruthy();
    heap_free(t2);
    const t4 = heapNew(0,0,0,0);
    expect(t4 === t2).toBeTruthy();
})

/*
  2 heap4-init 
  heap4-end heap4-start - 2 TUPLE4-CELLS * 100 assert

  heap4-isfull false 100 assert

  0 0 0 0 heap4-new to t1
  heap4-ptr heap4-start - TUPLE4-CELLS 100 assert

  heap4-isfull false 100 assert

  0 0 0 0 heap4-new to t2
  heap4-isfull true 100 assert

  t1 heap4-free
  heap4-isfull false 100 assert

  0 0 0 0 heap4-new to t3
  heap4-isfull true 100 assert

  t1 t3 = true 100 assert

  t2 heap4-free
  heap4-isfull false 100 assert

  0 0 0 0 heap4-new to t4
  heap4-isfull true 100 assert

  t2 t4 = true 100 assert
  cr .s cr

*/