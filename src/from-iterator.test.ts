import { forEach } from "./for-each";
import { fromIterator } from "./from-iterator";
import { registerObject } from "./objects";
import { pipe } from "./pipe";

test('count up to 40 in 10s and compare each number', () => {
    const expected = [10, 20, 30, 40];
    const expectedLength = expected.length;
    const crossCheck = (jest.fn((value: string) => {
        console.log(value);
        expect(value).toBe(expected.shift());
    }));

    const iterator = registerObject([10, 20, 30, 40][Symbol.iterator]());

    pipe(
        fromIterator(iterator),
        forEach(registerObject(crossCheck)),
    );

    expect(crossCheck).toHaveBeenCalledTimes(expectedLength);
})