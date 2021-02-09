import { CBForEach } from "./for-each";
import { CBFromIterator } from "./from-iterator";
import { pipe } from "./pipe";
import { CBScan } from "./scan";

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
        new CBFromIterator(iterator),
        (source) => new CBScan(source, reducer, 0),
        (source) => new CBForEach(source, printOp)
    );
    expect(printOp).toHaveBeenCalledTimes(expectedLength);
})