export const SEXTANT_VIEW = 0x1;
export const OPEN_VIEW    = 0x2;

export class Player {
    constructor() {
        this.lat = 0;
        this.lon = 0;
        this.azm = 0;
        this.alt = 0;
        this.viewMode = OPEN_VIEW;
    }
}
