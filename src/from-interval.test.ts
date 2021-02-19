import { forEach } from "./for-each";
import { fromInterval } from "./from-interval";
import { pipe } from "./pipe";
import { take } from "./take";

test('interval(100) sends 5 times then we dispose it', (done) => {
    const expected = [0, 1, 2, 3, 4];

    const fi = fromInterval(100);

    const printOp = ((value: string) => {
        console.log(value);
        expect(value).toBe(expected.shift());
        if (expected.length === 0) done();
    });

    pipe(
        fi,
        take(5),
        forEach(printOp)
    );

})