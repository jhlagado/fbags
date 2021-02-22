import { arrayNew, CELL_SIZE, here, mem } from "./heap-utils";

export let rcStart: number;
export let rcEnd: number;

export const rcInit = (size: number) => {
    rcStart = arrayNew(size * CELL_SIZE);
    rcEnd = here();
    for (let i = rcStart; i < rcEnd; i += CELL_SIZE) {
        mem.setInt32(rcStart, 0);
    }
}

