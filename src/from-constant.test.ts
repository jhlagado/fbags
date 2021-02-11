import { forEach } from "./for-each";
import { fromConstant } from "./from-constant";
import { pipe } from "./pipe";
import { take } from "./take";

const times = 3;
test('emit 3 numbers', () => {
    const expected = [1000, 1000, 1000];
    const expectedLength = expected.length;
    const printOp = jest.fn((value: string) => {
        console.log(value);
        expect(value).toBe(expected.shift());
    });

    pipe(
        fromConstant({ constant: 1000 }),
        take({ max: times }),
        forEach({ effect: printOp })
    );
    expect(printOp).toHaveBeenCalledTimes(expectedLength);
})