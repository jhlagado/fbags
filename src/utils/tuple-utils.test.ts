import { tupleGet, getMask, isOwnedBy, ownerNew, tupleNew, tupleSet } from "./tuple-utils";

test('owner and masks', () => {
  const t1 = tupleNew(0, 0, 0, 0);
  expect(getMask(t1, 0)).toBe(false);
  const t2 = tupleNew(0, 0, 0, 0);
  tupleSet(t1, 0, t2, false);
  expect(tupleGet(t1,0)).toBe(t2);
  expect(isOwnedBy(t2, ownerNew(t1, 0)));
  expect(getMask(t1, 0)).toBe(true);
});

test('destroy tuple', () => {
  const t1 = tupleNew(0, 0, 0, 0);
  const t2 = tupleNew(0, 0, 0, 0);
  const t3 = tupleNew(0, 0, 0, 0);
  tupleSet(t1, 0, t2, false);
  tupleSet(t2, 3, t3, false);
  expect(isOwnedBy(t2, ownerNew(t1, 0)));
  expect(getMask(t1, 0)).toBe(true);
  expect(isOwnedBy(t3, ownerNew(t2, 3)));
  expect(getMask(t2, 0)).toBe(false);
  expect(getMask(t2, 3)).toBe(true);
  tupleSet(t1, 0, 0, false);
});
