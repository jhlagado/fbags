import { maskGet, isOwnedBy, ownerNew, tupleNew, tset, tgett } from "./tuple-utils";

test('owner and masks', () => {
  const t1 = tupleNew(0, 0, 0, 0);
  expect(maskGet(t1, 0)).toBe(false);
  const t2 = tupleNew(0, 0, 0, 0);
  tset(t1, 0, t2, false);
  expect(tgett(t1,0)).toBe(t2);
  expect(isOwnedBy(t2, ownerNew(t1, 0)));
  expect(maskGet(t1, 0)).toBe(true);
});

test('destroy tuple', () => {
  const t1 = tupleNew(0, 0, 0, 0);
  const t2 = tupleNew(0, 0, 0, 0);
  const t3 = tupleNew(0, 0, 0, 0);
  tset(t1, 0, t2, false);
  tset(t2, 3, t3, false);
  expect(isOwnedBy(t2, ownerNew(t1, 0)));
  expect(maskGet(t1, 0)).toBe(true);
  expect(isOwnedBy(t3, ownerNew(t2, 3)));
  expect(maskGet(t2, 0)).toBe(false);
  expect(maskGet(t2, 3)).toBe(true);
  tset(t1, 0, 0, false);
});
