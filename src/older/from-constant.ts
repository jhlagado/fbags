import { CB } from "./common";

export class CBFromConstant implements CB {
    constant: any;
    sink: CB | undefined;

    constructor(constant: any) {
        this.constant = constant;
    }

    init(sink: CB) {
        // only allow this to happen once (caller: sink)
        if (!this.sink) {
            this.sink = sink;
            this.sink.init(this);
        }
    }

    run() {
        this.sink?.run(this.constant);
    }

    destroy() {
    }

}
