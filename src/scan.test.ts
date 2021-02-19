import { forEach } from "./for-each";
import { fromIterator } from "./from-iterator";
import { pipe } from "./pipe";
import { scan } from "./scan";

test('accumulate the total', () => {
    const expected = [1, 3, 6, 10];
    const expectedLength = expected.length;
    const crossCheck = jest.fn((value: string) => {
        console.log(value);
        expect(value).toBe(expected.shift());
    });
    const reducer = (acc: number, value: number) => acc + value;
    const iterator = [1, 2, 3, 4][Symbol.iterator]();
    pipe(
        fromIterator(iterator),
        scan([reducer, 0]),
        forEach(crossCheck)
    );
    expect(crossCheck).toHaveBeenCalledTimes(expectedLength);
})