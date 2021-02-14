import { MapState, MapArgs, MapVars } from "./map-types";
import { argsFactory, cbFactory, Role, Mode, sinkFactory } from "./common";

const mapTB = (state: MapState) => (mode: Mode, d: any) => {
    state.sink?.(mode, mode === Mode.run ? state.args.mapper(d) : d)
}

const cbf = cbFactory<MapArgs, MapVars>({}, mapTB, Role.sink);

const sf = sinkFactory<MapArgs, MapVars>(cbf, Role.none);

export const map = argsFactory<MapArgs, MapVars>(sf);

// const map = f => source => (start, sink) => {
//     if (start !== 0) return;
//     source(0, (t, d) => {
//       sink(t, t === 1 ? f(d) : d)
//     });
//   };

