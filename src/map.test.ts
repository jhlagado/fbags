import { forEach } from "./for-each";
import { fromIterator } from "./from-iterator";
import { map } from "./map";

test('count up to 40 in 10s and compare each number', () => {
    const expected = [11, 21, 31, 41];
    const expectedLength = expected.length;
    const printOp = jest.fn((value: string) => {
        console.log(value);
        expect(value).toBe(expected.shift());
    });

    const iterator = [10, 20, 30, 40][Symbol.iterator]();

    const fi = fromIterator({ iterator });
    const m = map({ mapper: (value) => value + 1 })(fi);
    forEach({ effect: printOp })(m);

    expect(printOp).toHaveBeenCalledTimes(expectedLength);
})