import { CBEmpty } from "./empty";
import { CBForEach } from "../for-each";
import { pipe } from "../pipe";

test('make count up to 40 and print each number', () => {
    const printOp = jest.fn((value: string) => console.log(value));

    pipe(
        new CBEmpty(), 
        (source) => new CBForEach(source, printOp)
    );
    expect(printOp).toHaveBeenCalledTimes(0);
})