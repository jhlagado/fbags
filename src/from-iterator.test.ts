import { CBForEach } from "./for-each";
import { CBFromIterator } from "./from-iterator";

test('make count up to 40 and print each number', ()=>{
    const expected = [10, 20, 30, 40];
    const expectedLength = expected.length;
    const printOp = jest.fn((value: string) => {
        console.log(value);
        expect(value).toBe(expected.shift());
    });

    const iterator = [10, 20, 30, 40][Symbol.iterator]();

    const fi = new CBFromIterator(iterator);
    new CBForEach(fi, printOp);

    expect(printOp).toHaveBeenCalledTimes(expectedLength);
})