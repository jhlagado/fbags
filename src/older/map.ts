import { CB, Mapper, SinkCB } from "./common";

export class CBMap implements SinkCB {
    source: any;
    mapper: Mapper;
    sink: CB | undefined;

    constructor(source: CB, mapper: Mapper) {
        this.source = source;
        this.mapper = mapper;
    }

    init(d: CB) {
        if (!this.sink) {
            // d is a sink
            const sink = d;
            this.sink = sink;
            this.source?.init(this);
        } else {
            // is a talkback from source
            const sourceTalkback = d;
            this.sink.init(sourceTalkback)
        }
    }

    run(d: any) {
        this.sink?.run(this.mapper(d))
    }

    destroy(d: any) {
        this.sink?.destroy(d)
    }
}


// const map = f => source => (start, sink) => {
//     if (start !== 0) return;
//     source(0, (t, d) => {
//       sink(t, t === 1 ? f(d) : d)
//     });
//   };