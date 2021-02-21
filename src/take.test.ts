import { forEach } from "./for-each";
import { fromIterator } from "./from-iterator";
import { map } from "./map";
import { registerObject } from "./objects";
import { pipe } from "./pipe";
import { take } from "./take";

test('make count up to 40 and print each number', () => {
    const expected = [11, 21];
    const expectedLength = expected.length;
    const crossCheck = (jest.fn((value: string) => {
        console.log(value);
        expect(value).toBe(expected.shift());
    }));

    const iterator = registerObject([10, 20, 30, 40][Symbol.iterator]());

    pipe(
        fromIterator(iterator),
        take(2),
        map(registerObject((value: any) => value + 1)),
        forEach(registerObject(crossCheck)),
    );
    expect(crossCheck).toHaveBeenCalledTimes(expectedLength);
})