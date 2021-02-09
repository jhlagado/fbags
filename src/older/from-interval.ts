import { CB } from "./common";

export class CBFromInterval implements CB {
    period: number;
    sink: CB | undefined;
    i = 0;
    id: NodeJS.Timeout | undefined;

    constructor(period: number) {
        this.period = period;
    }

    init(sink: CB) {
        // only allow this to happen once (caller: sink)
        if (!this.sink) {
            this.sink = sink;
            this.i = 0;
            this.id = setInterval(() => {
                this.sink!.run(this.i++);
            }, this.period);
            sink.init(this);
        }
    }

    run() {
    }

    destroy() {
        if (this.id) clearInterval(this.id);
    }
}

// const interval = period => (start, sink) => {
//     if (start !== 0) return;
//     let i = 0;
//     const id = setInterval(() => {
//         sink(1, i++);
//     }, period);
//     sink(0, t => {
//         if (t === 2) clearInterval(id);
//     });
// };

