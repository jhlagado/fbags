import { ARGS, Mode, Role, SINK } from '../utils/constants';
import { Tuple } from '../utils/types';
import { argsFactory, closureFactory, execClosure } from '../utils/closure-utils';

const fromConstantTB = (state: Tuple) => (mode: Mode, d: any) => {
    const constant = state[ARGS] as number;
    const closure = state[SINK] as Tuple;
    execClosure(closure, mode, mode === Mode.data ? constant : d);
};

const sf = closureFactory(fromConstantTB, Role.source);

export const fromConstant = argsFactory(sf);
