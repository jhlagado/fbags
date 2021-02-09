import { CB, Reducer } from "./common";
import { CBProxy } from "./proxy";

export class CBScan implements CB {
    source: CB;
    reducer: Reducer;
    seed: any;
    sink: CB | undefined;
    hasAcc: boolean;

    constructor(source: CB, reducer: Reducer, seed?: any) {
        this.source = source;
        this.reducer = reducer;
        this.seed = seed;
        this.hasAcc = seed !== undefined;
    }

    init(sink: CB) {
        let acc = this.seed;
        let tb = new CBProxy(this, {
            init(d: any) { sink.init(d) },
            run(this: CBScan, d: any) {
                acc = this.hasAcc ? this.reducer(acc, d) : ((this.hasAcc = true), d);
                sink.run(acc);
            },
            destroy(d: any) { sink.destroy(d) },
        })
        this.source.init(tb);
    }

    run() {
    }

    destroy() {
    }
}


// function scan(reducer, seed) {
//     let hasAcc = arguments.length === 2;
//     return source => (start, sink) => {
//       if (start !== 0) return;
//       let acc = seed;
//       source(0, (t, d) => {
//         if (t === 1) {
//           acc = hasAcc ? reducer(acc, d) : ((hasAcc = true), d);
//           sink(1, acc);
//         } else sink(t, d);
//       });
//     };
//   }