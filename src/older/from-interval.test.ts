import { CBForEach } from "./for-each";
import { CBFromInterval } from "./from-interval";
import { pipe } from "./pipe";

test('interval(100) sends 5 times then we dispose it', (done) => {
    const expected = [0, 1, 2, 3, 4];

    const fi = new CBFromInterval(100);

    const printOp = ((value: string) => {
        console.log(value);
        expect(value).toBe(expected.shift());
        if (expected.length === 0) {
            fi.destroy();
            done();
        }
    });

    pipe(
        fi,
        (source) => new CBForEach(source, printOp)
    );

})