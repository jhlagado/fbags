import { CBForEach } from "../for-each";
import { CBFromConstant } from "./from-constant";
import { pipe } from "../pipe";
import { CBTake } from "../take";

const times = 3;
test('emit 3 numbers', () => {
    const expected = [1000, 1000, 1000];
    const expectedLength = expected.length;
    const printOp = jest.fn((value: string) => {
        console.log(value);
        expect(value).toBe(expected.shift());
    });

    pipe(
        new CBFromConstant(1000),
        (source) => new CBTake(source, times),
        (source) => new CBForEach(source, printOp)
    );
    expect(printOp).toHaveBeenCalledTimes(expectedLength);
})