export enum Mode {
    init = 0,
    run = 1,
    destroy = 2,
}

export type CB = (mode: Mode, arg: any) => void;
export type SinkFactory = (source: CB) => CB;

export type Effect = (value: string) => void;
export type Mapper = (value: any) => any;
export type Reducer = (acc: any, value: any) => any;


