export const SEXT_VIEW = 0x1;
export const OPEN_VIEW = 0x2;

const otherMap = {
    [SEXT_VIEW]: OPEN_VIEW,
    [OPEN_VIEW]: SEXT_VIEW,
};

export class Player {
    constructor() {
        this.lat = 0;
        this.lon = 0;
        this.azm = 0;
        this.alt = 0;
        this.viewMode = OPEN_VIEW;
        this.vFovMap = {
            [OPEN_VIEW]: Math.PI*0.250,
            [SEXT_VIEW]: Math.PI*0.070,
        };
        this.sextantAngle = 0.1;
    }
    get vFov() {
        return this.vFovMap[this.viewMode];
    }
    set vFov(value) {
        return this.vFovMap[this.viewMode] = value;
    }
    inSextantMode() {
        return this.viewMode === SEXT_VIEW;
    }
    inOpenViewMode() {
        return this.viewMode === OPEN_VIEW;
    }
    toggleMode() {
        this.viewMode = otherMap[this.viewMode];
        return this;
    }
}
