import { CBForEach } from "../for-each";
import { CBFromIterator } from "../from-iterator";
import { CBMap } from "./map";
import { pipe } from "./pipe";
import { CBTake } from "./take";

test('make count up to 40 and print each number', () => {
    const expected = [11, 21, 31];
    const expectedLength = expected.length;
    const printOp = jest.fn((value: string) => {
        console.log(value);
        expect(value).toBe(expected.shift());
    });

    const iterator = [10, 20, 30, 40][Symbol.iterator]();
    const add = (number: number) => (value: number) => value + number;
    pipe(
        new CBFromIterator(iterator),
        (source) => new CBMap(source, add(1)),
        (source) => new CBTake(source, 3),
        (source) => new CBForEach(source, printOp)
    );

    expect(printOp).toHaveBeenCalledTimes(expectedLength);
})