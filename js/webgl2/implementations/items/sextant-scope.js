import { sextantScope as geometry } from '../static-geometries.js';
import * as Programs from '../programs.js';

const progMap = {
	C: Programs.orthographic,
	L: Programs.orthographicL,
	R: Programs.orthographicR,
};

export const draw = (ctx, camera, side = 'C') => {
	const prog = progMap[side];
    ctx.useProgram(prog);
    ctx.drawGeometry(geometry);
	prog.setFloatUniform('scale', 1);
	prog.setFloatUniform('screenRatio', camera.ratio);
	prog.setVec2Uniform('screenPos', [ 0, 0 ]);
};
