import { CB } from "./common";

export class CBEmpty implements CB {
    disposed = false
    sink: CB | undefined;

    init(sink: CB) {
        // only allow this to happen once (caller: sink)
        if (!this.sink) {
            this.sink = sink;
            this.sink.init(this);
            if (this.disposed) return
            this.sink.destroy()
        }
    }

    run() {
    }

    destroy() {
        this.disposed = true;
    }
}

// export default function empty(start, sink) {
//     if (start !== 0) return

//     let disposed = false

//     sink(0, end => {
//       if (end !== 2) return
//       disposed = true
//     })

//     if (disposed) return

//     sink(2)
//   }
