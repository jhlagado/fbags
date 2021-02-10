import { forEach } from "./for-each";
import { fromIterator } from "./from-iterator";
import { map } from "./map";
import { pipe } from "./pipe";

test('make count up to 40 and print each number', () => {
    const expected = [11, 21, 31, 41];
    const expectedLength = expected.length;
    const printOp = jest.fn((value: string) => {
        console.log(value);
        expect(value).toBe(expected.shift());
    });

    const iterator = [10, 20, 30, 40][Symbol.iterator]();

    pipe(
        fromIterator({ iterator }),
        map({ mapper: (value) => value + 1 }),
        forEach({ effect: printOp }),
    );
    expect(printOp).toHaveBeenCalledTimes(expectedLength);
})