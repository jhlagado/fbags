import { CB } from "./common";
import { CBProxy } from "./proxy";

export class CBTake implements CB {
    source!: CB;
    max!: number;
    taken: number = 0;
    sourceTalkback: CB | undefined;
    end: boolean = false;
    sink: CB | undefined;

    constructor(source: CB, max: number) {
        this.source = source;
        this.max = max;
    }

    forSink = new CBProxy(this, {
        init(this: CBTake, d: any) {
            if (this.taken < this.max) { this.sourceTalkback?.run(d); }
        },
        run(this: CBTake, d: any) {
            if (this.taken < this.max) { this.sourceTalkback?.run(d); }
        },
        destroy(this: CBTake, d: any) {
            this.end = true;
            this.sourceTalkback?.destroy(d);

        }
    })

    forSource = new CBProxy(this, {

        init(this: CBTake, srctb: CB) {
            this.sourceTalkback = srctb;
            this.sink!.init(this.forSink)
        },

        run(this: CBTake, d: any) {
            if (this.taken < this.max) {
                this.taken++;
                this.sink?.run(d);
                if (this.taken === this.max && !this.end) {
                    this.end = true
                    this.sourceTalkback?.destroy();
                    this.sink!.destroy();
                }
            }
        },

        destroy() { }

    })

    init(sink: CB) {
        this.taken = 0;
        this.sourceTalkback;
        this.end = false;
        this.sink = sink;

        this.source.init(this.forSource)
    }

    run() { }

    destroy() { }
}

// const take = max => source => (start, sink) => {
//     if (start !== 0) return;
//     let taken = 0;
//     let sourceTalkback;
//     let end;
//     function talkback(t, d) {
//         if (t === 2) {
//             end = true;
//             sourceTalkback(t, d);
//         } else if (taken < max) sourceTalkback(t, d);
//     }
//     source(0, (t, d) => {
//         if (t === 0) {
//             sourceTalkback = d;
//             sink(0, talkback);
//         } else if (t === 1) {
//             if (taken < max) {
//                 taken++;
//                 sink(t, d);
//                 if (taken === max && !end) {
//                     end = true
//                     sourceTalkback(2);
//                     sink(2);
//                 }
//             }
//         } else {
//             sink(t, d);
//         }
//     });
// };

