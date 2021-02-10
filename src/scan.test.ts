import { forEach } from "./for-each";
import { fromIterator } from "./from-iterator";
import { pipe } from "./pipe";
import { scan } from "./scan";

test('accumulate the total', () => {
    const expected = [1, 3, 6, 10];
    const expectedLength = expected.length;
    const printOp = jest.fn((value: string) => {
        console.log(value);
        expect(value).toBe(expected.shift());
    });
    const reducer = (acc: number, value: number) => acc + value;
    const iterator = [1, 2, 3, 4][Symbol.iterator]();
    pipe(
        fromIterator({iterator}),
        scan({reducer, seed:0}),
        forEach({effect:printOp})
    );
    expect(printOp).toHaveBeenCalledTimes(expectedLength);
})