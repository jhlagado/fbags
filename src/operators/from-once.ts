import { ARGS, Mode, Role, SINK, VARS } from '../utils/constants';
import { Tuple } from '../utils/types';
import { argsFactory, closureFactory, execClosure } from '../utils/closure-utils';
import { tsetv } from '../utils/tuple-utils';

const fromOnceTB = (state: Tuple) => (mode: Mode, d: any) => {
    const constant = state[ARGS] as number;
    const sink = state[SINK] as Tuple;
    let taken = state[VARS] as number;
    switch (mode) {
        case Mode.data:
            if (taken < 1) {
                tsetv(state, VARS, taken + 1);
                execClosure(sink, Mode.data, constant);
            }
        case Mode.stop:  // fall through
            execClosure(sink, Mode.stop);
    }
};

const sf = closureFactory(fromOnceTB, Role.source);

export const fromOnce = argsFactory(sf);
