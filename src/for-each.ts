import { Effect, CB } from "./common";

export class CBForEach implements CB {
    operation: Effect;
    source: CB | undefined;
    talkback: CB | undefined;

    constructor(source: CB, operation: Effect) {
        this.source = source;
        this.operation = operation;
        this.source?.init(this);
    }

    init(d?: any) {
        this.talkback = d;
        this.talkback?.run();
    }

    run(data: any) {
        this.operation(data)
        this.talkback?.run();
    }

    destroy() {
    }
}


// const forEach = operation => source => {
//     let talkback;
//     source(0, (t, d) => {
//       if (t === 0) talkback = d;
//       if (t === 1) operation(d);
//       if (t === 1 || t === 0) talkback(1);
//     });
//   };
